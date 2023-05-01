import React,{useState, useEffect} from 'react';
import LoggedinLayout from '@/common/layouts/loggedIn';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import Head from 'next/head';

// Axios for exp backend
import useAuthAxiosPrivate from '@/common/hooks/useAuthAxiosPrivate';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
// redux
import { useSelector } from 'react-redux';
import ModeratorNavbar from '@/common/components/navbars/ModeratorNavbar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
// Calendar
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction"

import Table from '@/common/components/Table';

// Modal
import Modal from '@mui/material/Modal';
import { height } from '@mui/system';
import CircularProgress from '@mui/material/CircularProgress';

const Event = (props) => {
    const router = useRouter();
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [mounted , setMounted] = useState(false);  
    const [tableOpen, setTableOpen]= useState(false);
    const [conferences, setConferences]= useState([]);
    const [events, seteEvents]= useState([]);
    const [event, seteEvent] = useState({});
    const [eventDates, setEventDates]= useState([]);
    const [activeTab, setActiveTab]= useState('conferences');
    const accessToken = useSelector((state)=>state.user.accessToken);
    const [loading, setLoading] = useState(false);
    const page = {
        active:activeTab, setActive: setActiveTab
    }

    // Min Time Setting
    const startTimeRef = useRef(null);
    const endTimeRef = useRef(null);

    function handleStartTimeChange() {
        console.log(startTimeRef.current.value);
        console.log(endTimeRef.current.min);
        endTimeRef.current.min = startTimeRef.current.value;
        console.log(endTimeRef.current.min);
        console.log(endTimeRef.current);
    }
    // axios
    const axiosPrivate = useAuthAxiosPrivate();


    const fetchData = async ()=>{
        setLoading(true)
       try{
        await fetchAvailability();
        await fetchConferences();
       }catch(e){
        console.log(e);
       }
       setLoading(false)
    }
    
    let clickableDates =[];

    function formatDate(date) {
       
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0'); 
      
        return `${year}-${month}-${day}`;
    }

    const fetchAvailability = async()=>{
        const response = await axiosPrivate.get(`/moderator/${window.location.href.split('/')[4]}/availability`,{},{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        console.log(response);
        seteEvent(response?.data?.result?.event);
        if (response?.data?.result?.availability.length>0){
            setTableOpen(true)
        }

        // Calendar Events creation
        let Tempevents =[];
        let datesinAvailibility =[];
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
    }

    const fetchConferences = async()=>{
        const response = await axiosPrivate.get(`/moderator/${window.location.href.split('/')[4]}/conferences`,{},{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        console.log(response);
        setConferences(response?.data?.result?.conferences);
    }

    const [eventOpen, setEventOpen]= useState(false);
    const [timeIntervals, setTimeIntervals]= useState([]);
    const [activeDate, setActiveDate]= useState('');

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
        const response = await axiosPrivate.post(`/moderator/${window.location.href.split('/')[4]}/customHours`,JSON.stringify({customHour: customHour}),{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        await fetchAvailability();
        setEventOpen(false);
    }
      function handleEventClick(info) {
        // Do something with the clicked event, such as open a dialog box
        console.log("Clicked event: ", info.event.start);
        let titleString = info.event._def.title.split('\n');
        console.log(titleString);
        setTimeIntervals(titleString);
        setActiveDate(new Date(info.event.start).toISOString())
        setEventOpen(true);
      }
      const resendInvite = async(email, moderatorEmail)=>{
        const response = await axiosPrivate.post(`/moderator/${window.location.href.split('/')[4]}/resend-invite`,JSON.stringify({email: email}),{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        console.log(response);
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
    const insertavailability =()=>{
        const item = document.createElement('div');
        const minDate  = formatDate(new Date(event.start));
        const maxDate =formatDate(new Date(event.end))
        item.innerHTML=`
            <div class='text-gray gap-11 flex flex-col w-1/2'>
                <div class='font-bold text-black text-lg'>Date Availability</div>
                <div class='flex flex-col gap-3'>
                    <div class='flex gap-4'>
                        <input type='date' class='border-2 border-solid border-border-gray rounded p-1 w-48' min='${minDate}' max='${maxDate}'/>
                        <input type='date' class='border-2 border-solid border-border-gray rounded p-1 w-48' min='${minDate}' max='${maxDate}'/>
                    </div>
                    <br/>
                    <div class='text-lg'>
                        <input type='checkbox' class='p-1'/>&nbsp; Disable Availibility on Saturdays and Sundays
                    </div>
                </div>
            </div>
            <div class='text-gray gap-3 flex flex-col w-1/2'>
                <div class='font-bold text-black text-lg'>Time Availability</div>
                <div class='flex flex-col gap-5'>
                    <div class='flex flex-col gap-4'>
                        <div class='flex gap-4'>
                            <div class='flex flex-col gap-2 w-48'>
                                <label class='text-dark-blue font-bold'>From</label>  
                                <input type='time' class='border-2 border-solid border-border-gray rounded p-1'/>
                            </div>
                            <div class='flex flex-col gap-2 w-48'>
                                <label class='text-dark-blue font-bold'>To</label>  
                                <input type='time' class='border-2 border-solid border-border-gray rounded p-1'/>
                            </div>
                        </div>
                    </div>
                    <button class='flex gap-3 items-center justify-center'>
                    <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddCircleOutlineIcon"><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
                    Add more time intervals
                    </button>
                </div>
            </div>`;
        item.classList.add('flex');
        item.classList.add('gap-8');
        item.classList.add('light-shadow');
        item.classList.add('rounded-lg');
        item.classList.add('w-full');
        item.classList.add('bg-white');
        item.classList.add('p-8');
        item.children[1].children[1].children[1].addEventListener('click',(e)=>{
            console.log(e);
            addTimeIntervals(e);
        })
        document.getElementById('availability').append(item);
    }

    function getWeekdayTimeFrames(startDate, endDate, hours) {
        // Set the start and end dates to the beginning and end of their respective days
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      
        const timeFrames = [];
      
        let currentStartDate = new Date(startDate);
      
        // Loop through all days between the start and end dates
        while (currentStartDate <= endDate) {
          // Check if the current date is a weekday (Monday to Friday)
          const dayOfWeek = currentStartDate.getDay();
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            // If it's a weekday, find the end date for the current time frame
            let currentEndDate = new Date(currentStartDate);
            while (currentEndDate <= endDate && currentEndDate.getDay() >= 1 && currentEndDate.getDay() <= 5) {
              currentEndDate.setDate(currentEndDate.getDate() + 1);
            }
      
            // Add the time frame to the array
            timeFrames.push({
              start: new Date(currentStartDate).toISOString(),
              end: new Date(currentEndDate.getTime() - 1).toISOString(),
              hours: hours
            });
      
            // Set the start date for the next time frame to be the day after the current end date
            currentStartDate = new Date(currentEndDate);
          } else {
            // If it's not a weekday, move to the next day
            currentStartDate.setDate(currentStartDate.getDate() + 1);
          }
        }
      
        return timeFrames;
      }

    const saveAvailability =async() =>{
        let availability =[];
        for(let i =0; i<document.getElementById('availability').children.length;i++){
            let disableSat= document.getElementById('availability').children[i].children[0].children[1].children[2].children[0].checked;
            // let  disableSun =document.getElementById('availability').children[i].children[0].children[1].children[3].children[0].checked;
            let distributedAvailibilities=[];
            let hours = [];
            for(let j=0; j<document.getElementById('availability').children[i].children[1].children[1].children[0].children.length; j++){
                let interval ={
                    start: new Date(new Date().toDateString() + " " +document.getElementById('availability').children[i].children[1].children[1].children[0].children[j].children[0].children[1].value).toISOString(),
                    end: new Date(new Date().toDateString() + " " +document.getElementById('availability').children[i].children[1].children[1].children[0].children[j].children[1].children[1].value).toISOString(),
                }
                console.log(interval);
                hours.push(interval);
            }
            if(disableSat){
                const newavailability = getWeekdayTimeFrames(new Date(document.getElementById('availability').children[i].children[0].children[1].children[0].children[0].value).toISOString(), 
                new Date(document.getElementById('availability').children[i].children[0].children[1].children[0].children[1].value).toISOString(),
                hours);
                availability.push(...newavailability);
            }else{
                const newavailability ={
                    start: new Date(document.getElementById('availability').children[i].children[0].children[1].children[0].children[0].value).toISOString(),
                    end: new Date(document.getElementById('availability').children[i].children[0].children[1].children[0].children[1].value).toISOString(),
                    hours:hours
                }
                availability.push(newavailability);
            }
        }
        console.log('availability: ',availability);
        const response = await axiosPrivate.post(`/moderator/${window.location.href.split('/')[4]}/availability`,JSON.stringify({availability: availability}),{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        if(response?.data?.code ===200){
            fetchAvailability();
        }
    }

        // Download Function
        const download = async(e)=>{
            console.log(e.target.parentNode.nextElementSibling);
    
             var csv_data = [];
     
             var rows = e.target.parentNode.nextElementSibling.getElementsByTagName('tr');
             for (var i = 0; i < rows.length; i++) {
    
                 var cols = rows[i].querySelectorAll('td,th');
    
                 var csvrow = [];
                 for (var j = 0; j < cols.length; j++) {
    
                     csvrow.push(cols[j].innerHTML);
                 }
    
                 csv_data.push(csvrow.join(","));
             }
    
             csv_data = csv_data.join('\n');
    
                let CSVFile = new Blob([csv_data], {
                    type: "text/csv"
                });
     
                var temp_link = document.createElement('a');
     
                temp_link.download = "gdsc-india.csv";
                var url = window.URL.createObjectURL(CSVFile);
                temp_link.href = url;
     
                temp_link.style.display = "none";
                document.body.appendChild(temp_link);
     
                temp_link.click();
                document.body.removeChild(temp_link);
    
        }
    // Fetching Data intially
    useEffect(()=>{
        if(mounted && accessToken){
          fetchData('superAdmin');
        }
    },[mounted]);
    useEffect(()=>{setMounted(true)},[])

  return (
   <>
   <Head>
        <title>{event?.eventName} | Moderator</title>
   </Head>
    <LoggedinLayout leftSidebarOpen={leftSidebarOpen} setLeftSidebarOpen={setLeftSidebarOpen} fetchData={fetchData}>
        <div className={`flex flex-col w-full ${activeTab === 'availability'? ('bg-faint-blue h-screen'):('')}`}>
        <ModeratorNavbar page={page}/>
        {activeTab === 'conferences' &&(
            <div className='w-full flex justify-center items-center'>
                <div className='w-10/12'>
                <Table download={download} tableHeaders={['#','Full Name','Email ID','Date and Time','Conference Link', 'Action']} tableContent={conferences} tableName={'moderatorEventConferences'} resend={resendInvite} />
                </div>
            </div>
        )}
        {activeTab === 'availability' &&(
            <div className='w-full flex justify-center items-center flex-col'>
                {!tableOpen?(
                    <div className='w-11/12 flex flex-col gap-4'>
                        <div className='text-xl font-bold'>
                            Set Availability:
                        </div>
                        <div id='availability' className='flex flex-wrap gap-8 p-4 w-9/12'>
                            {/* Slot */}
                            <div className='flex gap-8 light-shadow rounded-lg p-8 w-full bg-white'>
                                {/* Date Availability */}
                                <div className='text-gray gap-11 flex flex-col w-1/2'>
                                    <div className='font-bold text-black text-lg'>Date Availability</div>
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex gap-4'>
                                            <input type='date' className='border-2 border-solid border-border-gray rounded p-1 w-48' min={formatDate(new Date(event.start))} max={formatDate(new Date(event.end))}/>
                                            <input type='date' className='border-2 border-solid border-border-gray rounded p-1 w-48' min={formatDate(new Date(event.start))} max={formatDate(new Date(event.end))}/>
                                        </div>
                                        <br/>
                                        <div className='text-lg'>
                                            <input type='checkbox' className='p-1'/>&nbsp; Disable availability on Staurdays and Sundays
                                        </div>
                                    </div>
                                </div>
                                {/* Time Availability */}
                                <div className='text-gray gap-3 flex flex-col w-1/2'>
                                    <div className='font-bold text-black text-lg'>Time Availability</div>
                                    <div className='flex flex-col gap-5'>
                                        <div className='flex flex-col gap-4'>
                                            <div className='flex gap-4'>
                                                <div className='flex flex-col gap-2 w-48'>
                                                    <label className='text-dark-blue font-bold'>From</label>  
                                                    <input type='time' className='border-2 border-solid border-border-gray rounded p-1' ref={startTimeRef} onChange={handleStartTimeChange}/>
                                                </div>
                                                <div className='flex flex-col gap-2 w-48'>
                                                    <label className='text-dark-blue font-bold'>To</label>  
                                                    <input type='time' className='border-2 border-solid border-border-gray rounded p-1' ref={endTimeRef} />
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={addTimeIntervals} className='flex gap-3 items-center justify-center'><AddCircleOutlineIcon/> Add more time intervals</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-9/12 flex justify-center items-center text-gray'><button onClick={insertavailability} className='flex gap-2 itms-center justify-center'><AddCircleOutlineIcon/> &nbsp; Insert More Date Intervals</button></div>
                        <div><button className='h2s-button' onClick={saveAvailability}>Save Availability</button></div>
                    </div>
                ):(
                    <>
                    <div className='hidden flex w-11/12 flex justify-end px-6'><div className='text-sm text-gray cursor-pointer flex justify-center items-center' onClick={()=>{setTableOpen(false)}}><ArrowBackIosRoundedIcon fontSize='sm'/> &nbsp; Back to Availability Form</div></div>
                    <div className='w-11/12 px-5 text-xs text-dark-blue'>**Your Availibility for the event has been set, you can preview and update your availability from the Calendar given below.</div>
                    <div className='w-11/12 p-5'>
                        <FullCalendar
                            plugins={[ dayGridPlugin, interactionPlugin ]}
                            initialView="dayGridMonth"
                            events={events}
                            eventClick={handleEventClick}
                            eventContent={eventContent}
                        />
                    </div>
                    {eventOpen && (
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
                    )}
                    </>
                )}
            </div>
        )}
        </div>

    
    </LoggedinLayout>
   </>
  )
}

export default Event