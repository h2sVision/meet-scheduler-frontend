import React,{useState, useEffect} from 'react';
import LoggedinLayout from '../../common/layouts/loggedIn';
import { useRouter } from 'next/router';
import Head from 'next/head';
// Axios for exp backend
import useAuthAxiosPrivate from '@/common/hooks/useAuthAxiosPrivate';
import CreateEvent from '@/common/modules/admin/CreateEvent';
const FORM_DATA_CREATE_EVENT = {
    eventName:{
        value: ''
    },
    eventURL: {
        value:''
    },
    start:{
        value:''
    },
    end:{
        value:''
    },
    duration:{
        value:''
    }
  };
const Create_Event = (props) => {
    const Router = useRouter();
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    // axios
    const axiosPrivate = useAuthAxiosPrivate();

    const [stateFormData, setStateFormData] = useState(FORM_DATA_CREATE_EVENT);
    const [loading, setLoading] = useState(false);


    // functions
      // Handle changes of Email input
  function onChangeHandler(e) {
    const { name, value } = e.currentTarget;
    let newValue;
    if(name=== 'start' || name==='end'){
        newValue = new Date(value).toISOString();
        setStateFormData({
            ...stateFormData,
            [name]: {
              ...stateFormData[name],
              value:newValue,
            },
          });
    }else{
        setStateFormData({
            ...stateFormData,
            [name]: {
              ...stateFormData[name],
              value,
            },
          });
    }
    
  }

    async function submitHandler(){
      setLoading(true);
          try {
            console.log("submit yeh hoga: ", stateFormData);
              const response = await axiosPrivate.post('/admin/create-event',stateFormData,{
                  headers: {
                      "Content-Type": "application/json"
                  },
                  withCredentials: true
              });
              console.log(response);
              setLoading(false)
              if(response?.data?.code === 200){
                Router.push(`/admin/${response?.data?.result?.eventURL}`);
              }

          }catch(error){
              console.log(error)
          }
      }    
  return (
   <>
   <Head>
       <title>Create Event | Admin</title>
   </Head>
    <LoggedinLayout leftSidebarOpen={leftSidebarOpen} setLeftSidebarOpen={setLeftSidebarOpen}>
      <div className='certerPageItems bg-faint-blue'>
        <div className='bg-white light-shadow rounded-md lg:w-1/3 w-4/5 flex flex-col justify-center items-center p-5 py-12 md:p-12 gap-6'>
          <CreateEvent props={{submitHandler,
          onChangeHandler,
          stateFormData, loading}} className='w-full flex flex-col gap-12'/>
        </div>
      </div>
    </LoggedinLayout>
   </>
  )
}

export default Create_Event