import React,{useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Axios for exp backend
import useAuthAxiosPrivate from '@/common/hooks/useAuthAxiosPrivate';

// Components
import LoggedinLayout from '@/common/layouts/loggedIn';

// redux
import { useSelector } from 'react-redux';
import Link from 'next/link';

// Calendar
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction"
import EditRoundedIcon from '@mui/icons-material/EditRounded';


const Availability = () => {
  const router = useRouter();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [mounted , setMounted] = useState(false);  
  const accessToken = useSelector((state)=>state.user.accessToken);
  // axios
  const axiosPrivate = useAuthAxiosPrivate();
  const [availability, setAvailability] = useState();
  const [customHours, setCustomHours] = useState();
  const [event, setEvent] = useState();
  const [events, seteEvents]= useState([]);
  const [eventDates, setEventDates]= useState([]);

  // Calendar 
  const [eventOpen, setEventOpen]= useState(false);
  const [timeIntervals, setTimeIntervals]= useState([]);
  const [activeDate, setActiveDate]= useState('');

  const fetchData = async ()=>{
    try{
      const response = await axiosPrivate.get(`/admin/${window.location.href.split('/')[4]}/${window.location.href.split('/')[5]}/availability`,{},{
          headers: {
              "Content-Type": "application/json"
          },
          withCredentials: true
      });

      setAvailability(response?.data?.result?.availability);
      setCustomHours(response?.data?.result?.customHours);
      setEvent(response?.data?.result?.event);

       // Calendar Events creation
       let Tempevents =[];
       let datesinAvailibility =[];
       let clickableDates =[];
       for(let i =0; i<response?.data?.result?.availability?.length;i++){
           console.log("getting here");
           let titleString='';
           for(let j=0;j<response?.data?.result?.availability[i].hours.length;j++){
               titleString+= new Date(response?.data?.result?.availability[i]?.hours[j]?.start).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) +'-'+new Date(response?.data?.result?.availability[i].hours[j].end).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })+'\n'
           }
           console.log('normal title String: ', titleString);
           for(let j= new Date(response?.data?.result?.availability[i].start);j<=new Date(response?.data?.result?.availability[i].end);){
               
               let newTitleString='';
               for(let k =0; k<response?.data?.result?.customHours?.length;k++){
                   console.log(new Date(response?.data?.result?.customHours[k].date).toDateString(),'-', j.toDateString());
                   if(new Date(response?.data?.result?.customHours[k].date).toDateString() === j.toDateString() ){
                       console.log('eqaul h ')
                       for(let l =0; l<response?.data?.result?.customHours[k].hours.length ; l++){
                           newTitleString+=new Date(response?.data?.result?.customHours[k].hours[l].start).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) +'-'+new Date(response?.data?.result?.customHours[k].hours[l].end).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })+'\n'
                       }
                       console.log(newTitleString);
                   }
               }
               datesinAvailibility.push(new Date(j).toDateString())
               clickableDates.push(formatDate(j));
               Tempevents.push({
                   title: newTitleString.length>1? (newTitleString):(titleString),
                   start: formatDate(j)
               })
               j.setDate(j.getDate() + 1);
           }
       }
       let eDates=[]
       for(let i =new Date(response?.data?.result?.event.start); i<=new Date(response?.data?.result?.event.end);){
           eDates.push(i.toDateString());
           if(!datesinAvailibility.includes(i.toDateString())){
               let newTitleString='';
               for(let k =0; k<response?.data?.result?.customHours?.length;k++){
                   console.log(new Date(response?.data?.result?.customHours[k].date).toDateString(),'-', i.toDateString());
                   if(new Date(response?.data?.result?.customHours[k].date).toDateString() === i.toDateString() ){
                       console.log('eqaul h ')
                       for(let l =0; l<response?.data?.result?.customHours[k].hours.length ; l++){
                           newTitleString+=new Date(response?.data?.result?.customHours[k].hours[l].start).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) +'-'+new Date(response?.data?.result?.customHours[k].hours[l].end).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })+'\n'
                       }
                       console.log(newTitleString);
                   }
               }
               clickableDates.push(formatDate(i));
               Tempevents.push({
                   title: newTitleString.length>1? (newTitleString):(''),
                   start:formatDate(i)
               })
           }
           i.setDate(i.getDate() + 1);
       }
       setEventDates(eDates);

       console.log('clickableDates: ', clickableDates)
       seteEvents(Tempevents);
    }catch(e){
      console.log(e)
    }
  }

  function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const day = String(date.getDate()).padStart(2, '0'); 
    
      return `${year}-${month}-${day}`;
  }

  const eventContent = ({ event }) => {
    let intervals = event.title.split('\n');
      if (eventDates.includes(new Date(event.start).toDateString())) {
        return (
          <div className='flex flex-col gap-2 p-2 cursor-pointer eventContainer'>
              <div className='flex justify-start text-gray'>
                  <EditRoundedIcon fontSize='sm'/>
              </div>
              <br/>
              <div className='flex flex-col gap-2'>
                  {intervals.map((interval, key)=>(
                      <div key={key}>{interval}</div>
                  ))}
              </div>
          </div>
        );
      } else {
        return (
          <div>
            {event.title}
          </div>
        );
      }
  };
  function handleEventClick(info) {
    // Do something with the clicked event, such as open a dialog box
    console.log("Clicked event: ", info.event.start);
    let titleString = info.event._def.title.split('\n');
    console.log(titleString);
    setTimeIntervals(titleString);
    setActiveDate(new Date(info.event.start).toISOString())
    setEventOpen(true);
  }
  // Fetching Data intially
  useEffect(()=>{
      if(mounted && accessToken){
        fetchData();
      }
  },[mounted]);
  useEffect(()=>{setMounted(true)},[]);

  return (
    <>
    <Head>
        <title> Availbilty Check | Admin</title>
    </Head>
    <LoggedinLayout leftSidebarOpen={leftSidebarOpen} setLeftSidebarOpen={setLeftSidebarOpen} fetchData={fetchData}>
      <div className='w-full flex flex-col py-3 justify-center items-center'>
        <div className='w-11/12 flex justify-start'><div><Link href={`/admin/${event?.eventURL}`}>Back</Link></div></div>
        <div className='w-11/12 p-5'>
          <FullCalendar
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            events={events}
            eventContent={eventContent}
          />
        </div>
      </div>
    </LoggedinLayout>
    </>
  )
}

export default Availability