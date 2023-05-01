import React,{useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Axios for exp backend
import useAuthAxiosPrivate from '@/common/hooks/useAuthAxiosPrivate';

// Components
import LoggedinLayout from '@/common/layouts/loggedIn';
import Table from '@/common/components/Table';

// redux
import { useSelector } from 'react-redux';
import Link from 'next/link';

// Calendar
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction"
import EditRoundedIcon from '@mui/icons-material/EditRounded';  
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
// Modal
import Modal from '@mui/material/Modal';

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

  // Conferences
  const [conferences, setConferences]= useState([]);

  const fetchData = async ()=>{
    try{
      const confResponse = await axiosPrivate.get(`/admin/${window.location.href.split('/')[4]}/${window.location.href.split('/')[5]}/conferences`,{},{
          headers: {
              "Content-Type": "application/json"
          },
          withCredentials: true
      });
      console.log(confResponse);
      console.log("varsha"+ confResponse);
      setConferences(confResponse?.data?.result?.conferences);
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

  function convertTo24Hour(timeString) {
      const [hours, minutes, indicator] = timeString.split(/:| /);
      let hoursNum = Number(hours);
      if (indicator === 'PM' && hoursNum !== 12) {
        hoursNum += 12;
      }
      if (indicator === 'AM' && hoursNum === 12) {
        hoursNum = 0;
      }
      return `${hoursNum.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  const setTime = async()=>{
    let allIntputs = document.getElementsByClassName('clanedarTimeIntervals')[0].getElementsByTagName('input');
    let hours=[];
    for(let i=0; i< allIntputs.length;i+=2){
        let newInterval = {
            start: new Date(new Date().toDateString() +' '+ allIntputs[i].value).toISOString(),
            end: new Date(new Date().toDateString()+' ' + allIntputs[i+1].value).toISOString(),
        }
        hours.push(newInterval);
    }
    let customHour={
        date: activeDate,
        hours: hours
    }
    console.log('custom Hour: ', customHour);
    const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/${window.location.href.split('/')[5]}/customHours`,JSON.stringify({customHour: customHour}),{
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true
    });
    await fetchData();
    setEventOpen(false);
  }

  const addTimeIntervals =(e)=>{
    const item = document.createElement('div');
    item.innerHTML =`
      <div class='flex flex-col gap-2 w-48'>
          <label class='text-dark-blue font-bold'>From</label>  
          <input type='time' class='border-2 border-solid border-border-gray rounded p-1'/>
      </div>
      <div class='flex flex-col gap-2 w-48'>
          <label class='text-dark-blue font-bold'>To</label>  
          <input type='time' class='border-2 border-solid border-border-gray rounded p-1'/>
      </div>
      <div class='flex justify-center items-end py-2 cursor-pointer' onclick="this.parentNode.parentNode.removeChild(this.parentNode)">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          width="24" height="24"
          viewBox="0 0 24 24">
              <path d="M 10 2 L 9 3 L 5 3 C 4.448 3 4 3.448 4 4 C 4 4.552 4.448 5 5 5 L 7 5 L 17 5 L 19 5 C 19.552 5 20 4.552 20 4 C 20 3.448 19.552 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.105 5.895 22 7 22 L 17 22 C 18.105 22 19 21.105 19 20 L 19 7 L 5 7 z"></path>
          </svg>
      </div>`;
      item.classList.add('flex');
      item.classList.add('gap-4');
      e.target.parentNode.children[0].append(item);
  }

  // Calendar Funstions
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
        {availability?.length?(
          <div className='w-11/12 p-5'>
            <FullCalendar
              plugins={[ dayGridPlugin, interactionPlugin ]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
              eventContent={eventContent}
            />
            <Modal
              open={eventOpen}
              onClose={()=>{setEventOpen(false)}}
              className='flex justify-center items-center'>
              <div className='w-3/5 h-96 bg-white border-0 outline-0 rounded-lg p-8 flex'>
                <div className='w-1/2 flex flex-col gap-3 pr-3 text-xl font-bold'>
                  Change Time Availability
                  <div className='flex flex-col gap-4 text-base font-medium clanedarTimeIntervals'>
                      {timeIntervals.map((timeInterval, key)=>{
                          return (
                            <>
                            {timeInterval != '' &&(
                              <div className='flex gap-4' key={key}>
                                <div className='flex flex-col gap-2 w-48'>
                                  <label className='text-dark-blue font-bold'>From</label>  
                                  <input type='time' defaultValue={convertTo24Hour(timeInterval.split('-')[0])} className='border-2 border-solid border-border-gray rounded p-1'/>
                                </div>
                                <div className='flex flex-col gap-2 w-48'>
                                  <label className='text-dark-blue font-bold'>To</label>  
                                  <input type='time' defaultValue={convertTo24Hour(timeInterval.split('-')[1])} className='border-2 border-solid border-border-gray rounded p-1'/>
                                </div>
                                  {key!=0 &&(
                                    <div className='flex justify-center items-end py-2 cursor-pointer' >
                                        <DeleteIcon onClick={(e)=>{ console.log(e.currentTarget);e.currentTarget.parentNode.parentNode.parentNode.removeChild(e.currentTarget.parentNode.parentNode)}}/> 
                                    </div>
                                  )}
                              </div>
                            )}
                          </>
                      )})}
                      {timeIntervals.length===1 &&(
                        <div className='flex gap-4'>
                          <div className='flex flex-col gap-2 w-48'>
                            <label className='text-dark-blue font-bold'>From</label>  
                            <input type='time'  className='border-2 border-solid border-border-gray rounded p-1'/>
                          </div>
                          <div className='flex flex-col gap-2 w-48'>
                            <label className='text-dark-blue font-bold'>To</label>  
                            <input type='time' className='border-2 border-solid border-border-gray rounded p-1'/>
                          </div>
                        </div>
                      )}
                                          
                  </div>
                    <button onClick={addTimeIntervals} className='flex gap-3 items-center justify-center text-gray text-base font-medium'><AddCircleOutlineIcon/> Add more time intervals</button>
                      <div className='flex gap-3 w-full justify-center items-center mt-5 text-base font-medium'>
                        <button className='h2s-button' onClick={setTime}>Set Time</button>
                        <button className='h2s-gray-button' onClick={()=>{setEventOpen(false)}}>Back</button>
                      </div>
                </div>
                <div className='w-1/2 flex flex-col gap-5 pl-3'>
                  <div className='text-xl'>Today Booked Conference</div>
                  <div><Table tableHeaders={['Time Interval', 'Email ID']} tableContent={conferences} tableName={'calendarBookedConferences'} activeDate={activeDate}/></div>
                  <div className='w-full flex justify-center items-center text-sm'>To Reschedule the conference, contact the admin</div>
                </div>
              </div>
            </Modal>
          </div>
        ):(
          <div> Moderator has not set thier availability yet</div>
        )}
      </div>
    </LoggedinLayout>
    </>
  )
}

export default Availability