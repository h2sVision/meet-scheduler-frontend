import React,{useState, useEffect} from 'react';
import LoggedinLayout from '../../common/layouts/loggedIn';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
// Axios for exp backend
import useAuthAxiosPrivate from '@/common/hooks/useAuthAxiosPrivate';
import EventCard from '@/common/components/dashboard/EventCard';
import Head from 'next/head';
import CircularProgress from '@mui/material/CircularProgress';

const Dashboard = (props) => {
    const router = useRouter();
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [mounted , setMounted] = useState(false);  
    const accessToken = useSelector((state)=>state.user.accessToken);
    const [loading, setLoading] = useState(false);
    // axios
    const axiosPrivate = useAuthAxiosPrivate();

    const fetchData = async (role)=>{
        setLoading(true)
        try{
          const response =await  axiosPrivate.get('/user/dashboard');
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
      <title>Participant Dashboard</title>
    </Head>
    <LoggedinLayout leftSidebarOpen={leftSidebarOpen} setLeftSidebarOpen={setLeftSidebarOpen} fetchData={fetchData}>
     <div className='flex justify-center items-center p-4'>
     <div className='flex flex-col justify-center items-center py-4 gap-3  w-full lg:w-11/12'>
        <div className='w-full text-2xl font-semibold px-5 md:px-8'>My Events</div>
        <div className='w-full flex flex-wrap py-2 gap-5 justify-center md:justify-start'>
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