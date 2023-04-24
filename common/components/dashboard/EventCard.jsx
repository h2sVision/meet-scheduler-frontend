import React, { useState, useEffect } from 'react';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import {  useRouter } from 'next/router';

function EventCard(event) {
  const [isUser, setIsUser] = useState(); 
  useEffect(()=>{
    console.log(window.location.href.split('/')[3])
    if(window.location.href.split('/')[3]=== 'user'){
      setIsUser(true);
    }else{
      setIsUser(false)
    }
  },[])
    const router = useRouter();
  return (
    <div className='cursor-pointer flex flex-col gap-3 p-5 rounded-lg bg-white justify-center items-center light-shadow w-80' onClick={()=>{router.push(`/${window.location.href.split('/')[3]}/${event?.event?.eventURL}`)}}>
       <div className='font-bold text-lg'>{event?.event?.eventName}</div>
        <div className='flex gap-2'><div className='font-thin'><CalendarMonthOutlinedIcon/>&nbsp; Start Date: </div><div className='text-purple font-semibold'>{new Date(event?.event?.start).toDateString()}</div></div>
        <div className='flex gap-2'><div className='font-thin'><CalendarMonthOutlinedIcon/>&nbsp; End Date: </div><div className='text-purple font-semibold'>{new Date(event?.event?.end).toDateString()}</div></div>
        <div className='flex gap-2'><div className='font-thin'><AccessTimeRoundedIcon/>&nbsp; Duration: </div><div className='text-purple font-semibold'>{event?.event?.duration} Minutes</div></div>
        {isUser?(<div className='h2s-button'>Click to Schedule</div>):(<div className='h2s-button'>View More</div>)}
    </div>
  )
}

export default EventCard