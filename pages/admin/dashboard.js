import React,{useState, useEffect} from 'react';
import LoggedinLayout from '../../common/layouts/loggedIn';
import { useRouter } from 'next/router';
import Head from "next/head";

// Axios for exp backend
import useAuthAxiosPrivate from '@/common/hooks/useAuthAxiosPrivate';
import Link from 'next/link';
// redux
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';

import useLogout from '@/common/hooks/useLogout';
import EventCard from '@/common/components/dashboard/EventCard';
const Dashboard = (props) => {
    const router = useRouter();
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [mounted , setMounted] = useState(false);  
    const accessToken = useSelector((state)=>state.user.accessToken);
    const [loading, setLoading] = useState(false);

    // axios
    const axiosPrivate = useAuthAxiosPrivate();

    const fetchData = async ()=>{
        setLoading(true)
        try{
          const response =await  axiosPrivate.get('/admin/dashboard');
          setEvents(response?.data?.result);
        }catch(e){
          console.log(e)
        }
        setLoading(false)
    }
    // Fetching Data intially
    useEffect(()=>{
        if(mounted && accessToken){
          fetchData();
        }
    },[mounted])
    useEffect(()=>{setMounted(true)},[])
  return (
    <>
    <Head>
        <title>Admin Dashboard</title>
    </Head>
    <LoggedinLayout leftSidebarOpen={leftSidebarOpen} setLeftSidebarOpen={setLeftSidebarOpen} fetchData={fetchData}>
       <div className='flex justify-center items-center w-full '>
          <div className='flex flex-col gap-3 w-full md:w-11/12 p-4 justify-center items-center'>
          <Link className='createEvent w-full flex h2s-button mx-4 rounded-xl items-center justify-between text-xl' href='/admin/createEvent'>Create Event <div className='bg-white text-purple text-3xl w-10 h-10 flex justify-center items-center rounded-md font-bold'>+</div></Link>
          <div className='flex flex-col justify-center items-center py-4 gap-5  w-full '>
              <div className='w-full text-2xl font-semibold'>My Events</div>
              <div className='w-full flex flex-wrap py-2 gap-5 justify-center md:justify-start'>
                {loading?(<div className='w-full flex flex-wrap py-2 gap-5 justify-center mt-5'><CircularProgress size="40px" /></div>):(
                  <>
                      {events?.map((event, key)=>(
                        <EventCard event={event} key={key} role='admin'/>
                      ))}
                  </>
                )}
               </div>
          </div>
          </div>
       </div>
    </LoggedinLayout>
    </>
  )
}

export default Dashboard