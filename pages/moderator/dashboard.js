import React,{useState, useEffect} from 'react';
import LoggedinLayout from '../../common/layouts/loggedIn';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Axios for exp backend
import useAuthAxiosPrivate from '@/common/hooks/useAuthAxiosPrivate';
import CircularProgress from '@mui/material/CircularProgress';
// redux
import { useSelector } from 'react-redux';

import EventCard from '@/common/components/dashboard/EventCard';

const Dashboard = (props) => {
    const router = useRouter();
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [mounted , setMounted] = useState(false);  
    const accessToken = useSelector((state)=>state.user.accessToken);
    const [activeTab, setActiveTab]= useState('events');
    const [loading, setLoading] = useState(false);
    const page = {
      page :'dashboard', active:activeTab, setActive: setActiveTab
  };

    // axios
    const axiosPrivate = useAuthAxiosPrivate();

    const fetchData = async ()=>{
      setLoading(true)
        try{
          const response =await  axiosPrivate.get('/moderator/dashboard');
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
      <title>Moderator Dashboard</title>
    </Head>
    <LoggedinLayout leftSidebarOpen={leftSidebarOpen} setLeftSidebarOpen={setLeftSidebarOpen} fetchData={fetchData}>
     <div className='flex justify-center items-center p-4'>
     <div className='flex flex-col justify-center items-center py-4 gap-5  w-full md:w-4/5'>
        <div className='w-full text-2xl font-semibold'>My Events</div>
        <div className='w-full flex flex-wrap py-2 gap-4'>
          {loading?(<div className='w-full flex flex-wrap py-2 gap-5 justify-center mt-5'><CircularProgress size="40px" /></div>):(
            <>
            {events?.map((event, key)=>(
              <EventCard event={event} key={key}/>
            ))}
            </>
          )}
        </div>
      </div>
     </div>
    </LoggedinLayout>
    </>
  )
}

export default Dashboard