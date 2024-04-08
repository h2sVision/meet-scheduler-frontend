import React,{useState, useEffect} from 'react';
import LoggedinLayout from '../../../common/layouts/loggedIn';
import { useSelector } from 'react-redux';
import Head from 'next/head';
// Axios for exp backend
import useAuthAxiosPrivate from '@/common/hooks/useAuthAxiosPrivate';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import DatePickerStatic from '@/common/components/event/DatePicker';

import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CircularProgress from '@mui/material/CircularProgress';
import HelpIcon from '@mui/icons-material/Help';
import Link from 'next/link';
import {useRouter} from 'next/router';
// Intro.js
import { Steps } from 'intro.js-react';
import { borderRadius, fontWeight } from '@mui/system';
const Event = (props) => {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [minDate, setMinDate] = useState();
    const [maxDate, setMaxDate] = useState();
    const [userData, setUserData] = useState([]);
    const [availableSlotsCount, setAvailableSlotsCount] = useState(0);
    const [mounted , setMounted] = useState(false);  
    const accessToken = useSelector((state)=>state.user.accessToken);
    const [name, setName] = useState('');
    const [dur, setDur] = useState('');
    const [eventName, setEventName] = useState('');
    const [loading, setLoading] = useState(false);
    const [monthName, setMonthName]= useState(' ');
    const router = useRouter();

    // Intro.js JS
    const [enabled,setEnabled] = useState(true)
    const [initialStep,setInitialStep] = useState(0)
    
    const onExit = () => {
        setEnabled(false)  
    }
    const steps = [
        {
        element: '#monthName',
        intro: 'You can use this button for help',
        position: 'right',
        }
    ];


    // axios
    const axiosPrivate = useAuthAxiosPrivate();
   const [conference, setConference] = useState({});
    const [bookedConference, setBookedConference] = useState({});
    const openSlots =(date)=>{
        if(date){
            for(let i =0; i< document.getElementById('slots').children.length;i++){
                document.getElementById('slots').children[i].style.display = 'none';
            }
            if(document.getElementById(date.toDateString())){
                document.getElementById(date.toDateString()).style.display = 'flex';
                document.getElementById('selectedDate').innerHTML= date.toDateString();
            }
        }
    };
    const appendFunction =async(childrenArray,parent)=>{
        for (const child of childrenArray) {
            parent.appendChild(child); 
            // console.log()
        }
    }
    const sortSlots = async(minID, maxID)=>{
        console.log('yeeee: ', minID,'-', maxID)
        for(let dateId = new Date(minID); dateId <=new Date(maxID); dateId = new Date(dateId.setDate(dateId.getDate() +1))){
            const parent = document.getElementById(dateId.toDateString());
            const childrenArray = Array.from(parent.children);
            console.log("Data => ", childrenArray); 
        childrenArray.sort((a, b) => a.id.localeCompare(b.id)); 
            await appendFunction(childrenArray, parent)
        }
    }
    const printData = async()=>{
        let availableSlotsCount = 0;
        try{
            const response =await  axiosPrivate.get(`/user/${window.location.href.split('/')[4]}`);
            const response2 = await  axiosPrivate.get(`/user/${window.location.href.split('/')[4]}/userEventInfo`);
            setUserData(response2?.data?.result);
            setLoading(false)
            setName(response?.data?.result?.name);
            setDur(response?.data?.result?.duration);
            setEventName(response?.data?.result?.eventName);
            const duration = parseInt(response?.data?.result?.duration);
            const moderators = response?.data?.result?.moderators;

            for(let i = new Date(response?.data?.result?.start);i <= new Date(response?.data?.result?.end); i.setDate(i.getDate() +1)){
                let newDateDiv = document.createElement('div');
                newDateDiv.style.display='none';
                newDateDiv.id = `${i.toDateString()}`;
                newDateDiv.classList.add('dateSlotsContainer');
                newDateDiv.innerHTML=`<div class='flex justify-center items-center text-center'>No Slots Available on this Day.</div>`
                document.getElementById('slots')?.append(newDateDiv);
            }
            if(moderators){
                for(let i =0; i<moderators.length; i++){
                    let initialslots=[];
                    let extraslots=[];

                    for(let j=0; j<moderators[i].availability.length;j++){
                        for(let k=0; k<moderators[i].availability[j].hours.length;k++){
                            const startDate = new Date(moderators[i].availability[j].start).toDateString();
                            const startTime = new Date(moderators[i].availability[j].hours[k].start).toTimeString();
                            const compoundStart = new Date(startDate +' ' + startTime);
        
                            const endDate = new Date(moderators[i].availability[j].end).toDateString();
                            const endTime = new Date(moderators[i].availability[j].hours[k].end).toTimeString();
                            const compoundEnd = new Date(endDate +' ' + endTime);
                            let l = compoundStart;
                            while(l<compoundEnd){
                                let compareDate = new Date(l.getTime() + duration*60000);
                                if(compareDate.toTimeString() <= compoundEnd.toTimeString()){
                                    let confOverlap = false;
                                    for( let c =0; c< moderators[i].conferences.length; c++){
                                        let tempL = new Date();
                                        tempL.setDate(l.getDate());
                                        tempL.setTime(l.getTime());
                                        tempL.setMinutes(l.getMinutes()+duration);
                                        if(new Date(l)< new Date(moderators[i].conferences[c].end) && tempL> new Date(moderators[i].conferences[c].start) ){
                                            confOverlap = true;
                                        }
                                    }
                                    if(!confOverlap){
                                        initialslots.push(l);
                                    }
                                    l=new Date(l.setMinutes(l.getMinutes() + duration));
                                }else{
                                    l = new Date(new Date(l.setDate(l.getDate() +1)).toDateString() + ' '+ startTime);
                                }
                            }
                            availableSlotsCount++;
                            console.log("availableSlotsCount => ", availableSlotsCount);
                        }
                    }
                    extraslots=[];
                    async function testOne(callback, filterIntSlots, displaySlots){
                        for(let j=0; j<moderators[i].customHours.length;j++){
                            for(let k=0; k<initialslots.length;k ++){
                                console.log(initialslots[k].toDateString());
                                if(new Date(moderators[i].customHours[j].date).toDateString() === initialslots[k].toDateString()){
                                    extraslots.push(initialslots[k].toDateString());
                                }
                            }
                        }
                        await filterIntSlots();
                        await callback();
                        await displaySlots();
                    }
                    function filterIntSlots(){
                        initialslots = initialslots.filter(function(item) {
                            return !extraslots.includes(new Date(item).toDateString());
                        });
                    }
                    function testTwo(){
                        for(let j=0; j<moderators[i].customHours.length;j++){
                            for(let k=0; k<moderators[i].customHours[j].hours.length;k++){
                                const startDate = new Date(moderators[i].customHours[j].date).toDateString();
                                const startTime = new Date(moderators[i].customHours[j].hours[k].start).toTimeString();
                                const compoundStart = new Date(startDate +' ' + startTime);
            
                                const endDate = new Date(moderators[i].customHours[j].date).toDateString();
                                const endTime = new Date(moderators[i].customHours[j].hours[k].end).toTimeString();
                                const compoundEnd = new Date(endDate +' ' + endTime);
                                
                                for(let l =compoundStart; new Date(l.getTime() + duration*60000)<=compoundEnd; l=new Date(compoundStart.setMinutes(compoundStart.getMinutes() + duration)))
                                {
                                    let confOverlap = false;
                                        for( let c =0; c< moderators[i].conferences.length; c++){
                                            let tempL = new Date();
                                            tempL.setDate(l.getDate());
                                            tempL.setTime(l.getTime());
                                            tempL.setMinutes(l.getMinutes()+duration);
                                            if(new Date(l)< new Date(moderators[i].conferences[c].end) && tempL> new Date(moderators[i].conferences[c].start) ){
                                                confOverlap = true;
                                            }
                                        }
                                        if(!confOverlap){
                                            let tem = new Date(l);
                                            tem = new Date(tem.setMinutes(tem.getMinutes() + duration))
                                            initialslots.push(tem);
                                        }
                                }
                            }
                        }
                    }
                    const displaySlots=()=>{
                        initialslots.sort(function(a, b) {
                            return b - a;
                        });
                        for(let slot =initialslots.length-1; slot>=0; slot--){
                        if(!moderators[i].conferences.includes(initialslots[slot].toISOString())){
                            let ss  = document.getElementById(initialslots[slot].toISOString());
                            
                            if(ss?.children[0]){
                                let mods = ss.children[0].dataset.moderators.slice(1, -1).split(',');
                                if(mods.length>1){
                                    for(let m =0; m<mods.length; m++){
                                        mods[m] = mods[m].slice(1,-1);
                                    }
                                }
                                mods.push(moderators[i].email);
                                ss.children[0].dataset.moderators = JSON.stringify(mods);
                            }else{
                                let newSlot = document.createElement('div');
                                newSlot.id = initialslots[slot].toISOString();
                                newSlot.classList.add('flex')
                                newSlot.classList.add('justify-center')
                                newSlot.innerHTML=`<div data-moderators="[${moderators[i].email}]">${new Date(initialslots[slot].setMinutes(initialslots[slot].getMinutes()- duration)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div><div hidden>${initialslots[slot].toISOString()}</div>`;
                                newSlot.children[0].classList.add('slotTime');
                                newSlot.addEventListener('click', async()=>{
                                    document.getElementById('displaySlot').innerHTML =  new Date(newSlot.children[1].innerHTML).toDateString() +', '+ new Date(newSlot.children[1].innerHTML).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true}) + new Date(newSlot.children[1].innerHTML).toString().slice(34);
                                    setConference({
                                        start: newSlot.children[1]?.innerHTML,
                                        end: new Date(new Date(newSlot.children[1]?.innerHTML).setMinutes(new Date(newSlot.children[1]?.innerHTML).getMinutes() +duration)).toISOString(),
                                        moderators: newSlot.children[0].dataset.moderators,
                                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                                    });
                                    for(let tS =0; tS<document.getElementsByClassName('slotTime').length;tS++){
                                        document.getElementsByClassName('slotTime')[tS].classList.remove('active');
                                    }
                                    newSlot.children[0].classList.add('active');
                                });
            
                                let dateDiv = document.getElementById(initialslots[slot].toDateString());
            
                                if(dateDiv){
                                    dateDiv.children[0].innerHTML='';
                                    dateDiv?.append(newSlot);
                                    const childrenArray = Array.from(dateDiv.children);
                                    console.log("Data => ", childrenArray); 
                                    childrenArray.sort((a, b) => a.id.localeCompare(b.id)); 
                                    appendFunction(childrenArray, dateDiv)
            
                                }else{
                                    let newDateDiv = document.createElement('div');
                                    newDateDiv.id = `${initialslots[slot].toDateString()}`;
                                    newDateDiv.style.display='none';
                                    newDateDiv?.append(newSlot);
                                    document.getElementById('slots')?.append(newDateDiv);
                                }
                            
                            }
                            
                        }
                        }
                    }
                    testOne(testTwo, filterIntSlots,displaySlots);
                    setMonthName(document.getElementsByClassName('react-datepicker__current-month')[0].innerHTML);
                }
            }else{
            setBookedConference(response?.data?.result);
            }
            let minID;
            let maxID;
            if(new Date()<= new Date(response?.data?.result?.start)){
                setMinDate(response?.data?.result?.start);
                minID = new Date(response?.data?.result?.start).toDateString();
                openSlots(new Date(response?.data?.result?.start));
            }else{
                setMinDate(new Date().toISOString());
                minID =new Date().toDateString();
                openSlots(new Date());
            }
            setMaxDate(response?.data?.result?.end);
            maxID = new Date(response?.data?.result?.end).toDateString();
            return {min: minID, max: maxID}
        }catch(e){
            console.log(e)
        }
    }
    const fetchData = async ()=>{
        setLoading(true)
        try{

            const obj = await printData();
            // await sortSlots(obj.min, obj.max);

        }catch(e){
            console.log(e);
            if(e?.response?.status === 403){
                router.push('/user/dashboard');
            }

        }
        setLoading(false)

    }
    const handleClick = async () => {
        setLoading(true);
        document.getElementById('schdulingButton').disabled = true;

        // Generate a random delay between 1 and 5 seconds (you can adjust as needed)
        const randomDelay = Math.floor(Math.random() * 4000) + 1000; // Random number between 1000ms (1s) and 5000ms (5s)
        console.log("randomDelay => ", randomDelay)
        // Use setTimeout to delay the execution of the axios.post call
        setTimeout(async () => {
            try {
                const response = await axiosPrivate.post(`/user/${window.location.href.split('/')[4]}`, JSON.stringify({ conference: conference }));
                if (response?.data?.code === 200) {
                    await fetchData();
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }, randomDelay);
    };
    // Fetching Data intially
    const [selectedDate, setSelectedDate] = useState('');
    useEffect(()=>{
      if(minDate){
        setSelectedDate(new Date(minDate));
      }
    },[])
    useEffect(()=>{
      if(mounted && accessToken){
        fetchData();
      }
    },[mounted])
    useEffect(()=>{setMounted(true)},[])
  return (
    <>
    <Head>
        <title>{eventName} | Participant</title>
    </Head>
    <LoggedinLayout leftSidebarOpen={leftSidebarOpen} setLeftSidebarOpen={setLeftSidebarOpen} fetchData={fetchData}>
       
       <div className='flex w-full flex-col justify-center items-center certerPageItems colMd'>
               {bookedConference.link ? (
                   <div className='flex w-full h-full justify-center bg-faint-blue items-center certerPageItems pb-20 pt-10'>
                       <div className='text-center bg-white rounded-2xl light-shadow flex flex-col gap-5 items-center justify-center lg:w-8/12 mx-3 md:mx-8 lg:mx-16 pb-6'>
                           <div className=''><img src='/conference_Details.png'/></div>
                           <div className='md:text-lg lg:text-3xl font-bold'>🎉 Congratulations!</div>
                           <div className='text-sm md:text-base text-gray'>You have successfully scheduled your interview with Google Developers Student Clubs Lead Application process.
                           <br/> <span className='text-sm'>An email containing details of interview as shown below has been sent to you</span></div>
                           <div className='bg-dark-gray rounded-xl pb-6 px-2  mx-2 flex flex-col justify-center items-center gap-2 w-11/12  md:w-10/12'>
                               <div className='font-bold text-sm md:text-base lg:text-xl text-center border-b-2 border-white border-solid p-2 w-full'>Interview Details</div>    
                               <div className='text-xs md:text-base'><span className='font-bold'><CalendarMonthOutlinedIcon/> Date & Time: </span>&nbsp; <strong>{new Date(bookedConference.start).toDateString()}, {new Date(bookedConference.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})} {new Date(bookedConference.start).toString().slice(34)}</strong></div>    
                               <div className='text-xs md:text-base'><span className='font-bold'><AccessTimeRoundedIcon/> Duration: </span>&nbsp; 30- 40 Minutes</div>    
                               <div className='text-xs md:text-base font-thin text-gray'>Copy your interview meeting link </div>
                               <div className='text-xs md:text-sm lg:text-base bg-light-gray text-gray rounded-lg pl-2 w-full md:w-82 lg:w-96 flex justify-between items-center '>{bookedConference.link} &nbsp; &nbsp; <button className='h2s-blue-button' onClick={(e)=>{e.target.innerHTML='Copied!'; navigator.clipboard.writeText(bookedConference.link)}}>Copy</button></div>
                               <div className='text-xs md:text-base font-thin text-gray'>
                                <small className='block'>
                                NOTE: Slots once booked are considered final and cannot be rescheduled later. If you wish to reschedule your interview, 
                                you can do so only once by mailing us at <a href='mailto:gdsc-india@hack2skill.com' className='text-blue'>gdsc-india@hack2skill.com</a> at least 24 hours before the scheduled time. 
                                Please state a valid reason for the rescheduling.
                                <br/>We will accommodate requests only on a case by case basis. In this case, allow the team 24 hours to respond to your queries.
                                </small>
                               </div>
                               {/* <div className='text-xs md:text-base font-thin text-gray'>Incase of any queries, write to our alias gdsc-india@hack2skill.com</div> */}
                           </div>
                           <div className='bg-dark-gray rounded-xl pb-5 px-2  mx-2 flex flex-col justify-center items-center gap-2 w-11/12  md:w-10/12'>
                               <div className='font-bold text-sm md:text-base lg:text-xl text-center border-b-2 border-white border-solid p-2 w-full'>Personal Details</div>    
                               <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 text-left'>
                                    <div className='text-xs md:text-base w-12/12'><span className='font-bold'>Name: </span>&nbsp; {userData.fullName}</div>
                                    <div className='text-xs md:text-base w-12/12'><span className='font-bold'>Email: </span>&nbsp; {userData.email}</div>
                                    <div className='text-xs md:text-base w-12/12'><span className='font-bold'>Gender: </span>&nbsp; {userData.gender}</div>
                                    <div className='text-xs md:text-base w-12/12'><span className='font-bold'>Mobile Number: </span>&nbsp; {userData.mobileNumber}</div>
                                    <div className='text-xs md:text-base w-12/12'><span className='font-bold'>LinkedIn URL: </span>&nbsp; {userData.linkedInURL}</div>
                                    <div className='text-xs md:text-base w-12/12'><span className='font-bold'>Passing Year: </span>&nbsp; {userData.passingYear}</div>
                                </div>
                               <div className='text-xs md:text-base font-thin text-gray'>Incase of any queries, write to our alias gdsc-india@hack2skill.com</div>
                           </div>
                       </div>
                   </div>
               ):(
                <>
                    {/* <Steps
                    enabled={enabled}
                    steps={steps}
                    // initialStep={initialStep}
                    onExit={onExit}
                    />*/}
                    {/* <div className='flex flex-col w-full p-2 mb-3'>
                        <div style={{ backgroundColor: '#fef3c7', padding: '10px 10px 6px 10px', borderRadius: '8px' }}>
                            <marquee behavior="scroll" direction="left">
                                <span style={{ color: '#f59e0b' }}>
                                    Last date for interview is 28th May 2023. No interview will be scheduled after it.
                                </span>
                            </marquee>
                        </div>
                    </div> */}
                    <div className='flex-col lg:flex-row w-full mx-5 flex gap-5 justify-center items-start p-2 '>
                        
                        {/* Conference Details */}
                        <div className='flex flex-col gap-5 w-full md:w-11/12 lg:w-1/5 '>
                            <div className=' w-full bg-white rounded-xl light-shadow flex flex-col gap-5 items-center justify-center'>
                                <div className='w-full relative'>
                                    <div className='w-full'><img src='/userEvent/schedule.png' className='w-full'/></div>
                                    <div className='nameContainer flex gap-2 items-end relative px-2'>
                                        <div className='intials bg-google-blue text-2xl'>{name?.charAt(0)}{name?.split(' ').length > 1?(name?.split(' ')[name?.split(' ').length -1].charAt(0)):('')}</div>
                                        <div className='font-semibold text-xl pt-3'>{name}</div>
                                    </div>
                                </div>
                                <div className='w-full bg-dark-gray gap-2 flex flex-col p-3'>
                                    <div className='flex justify-start items-center gap-2'><span className='font-bold'>Event Name:</span> {eventName}</div>
                                    <div className='flex justify-start items-center gap-2'><span className='font-bold'><AccessTimeFilledRoundedIcon fontSize='sm'/> Duration:</span> {dur} Minutes</div>
                                    <div className='flex justify-start items-center gap-2'><span className='font-bold'><CalendarMonthIcon fontSize='sm'/> Schedule:</span> {new Date(minDate).toLocaleDateString()} - {new Date(maxDate).toLocaleDateString()}</div>
                                    <div className='flex justify-start items-center gap-2'><span className='font-bold'><HelpIcon fontSize='sm'/> Platform Guide:</span> <Link target='_blank' href='https://app.tango.us/app/workflow/A-Step-by-Step-Login-and-Scheduling-Process-for-an-Interview-5bce7cb11cf140788bdc42496d716502' className='text-google-blue'>Click Here</Link></div>
                                </div>
                            </div>
                            <div className=' w-full rounded bg-card-blue light-shadow flex flex-col justify-center'>
                                <div className='border-b-2 border-white border-solid p-3 font-semibold'>Selected Slot Details</div>
                                <div className='flex flex-col p-3 gap-2'>
                                    <div className='text-sm'>Date & Time:</div>
                                    <div  id='displaySlot'>
                                        <div className='text-red-500'>Not Selected</div>
                                        <div className='text-xs'><span className='text-red-500'>* </span>Select a time slot in order to book an interview for the event.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        {/* Date Picker */}
                        <div  className='bg-white rounded-xl flex flex-col w-full md:w-11/12 light-shadow lg:w-4/5 h-full'>
                            <div className='bg-google-blue text-google-blue font-bold w-full rounded-t-xl flex justify-center items-center py-4 ' id='monthName'> .</div>
                            <div  className='bg-white p-2 flex flex-col lg:flex-row gap-5 w-full'>
                                
                                <div className=' w-full lg:w-4/5'><DatePickerStatic minDate={minDate} maxDate={maxDate} openSlots={openSlots} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/></div>
    
                                {/* Date Slots */}
                                <div className='w-full lg:w-1/5 flex flex-col gap-5'>
                                    <div  className=' w-full bg-dark-gray rounded-xl'>
                                    <div className='flex justify-center items-center py-3 border-b-2 border-white border-solid text-lg'><div id='selectedDate' className='text-lg hidden font-semibold mb-3'></div> Select a Time Slot </div>
                                    <div id='slots' className='w-full '></div>
                                    
                                    </div>
                                    <div className='flex w-full justify-center items-center py-2'>
                                        <button className={conference.start ? 'h2s-button gap-1 flex justify-center items-center' : 'h2s-button-disabled gap-1 flex justify-center items-center'} id='schdulingButton' onClick={handleClick} disabled={!conference.start || loading}>
                                            {loading ? (<CircularProgress className='text-white' size="18px" />) : ("")}
                                            Schedule Meeting
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
               )}
       </div>
   </LoggedinLayout>
    </>
  )
}

export default Event