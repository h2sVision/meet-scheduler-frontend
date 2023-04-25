import React,{useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
// Axios for exp backend
import useAuthAxiosPrivate from '@/common/hooks/useAuthAxiosPrivate';

// Components
import AdminNavbar from '@/common/components/navbars/AdminNavbar';
import Table from '@/common/components/Table';
import LoggedinLayout from '@/common/layouts/loggedIn';

// redux
import { useSelector } from 'react-redux';

// Dropper
import { FileUploader } from "react-drag-drop-files";
import CreateEvent from '@/common/modules/admin/CreateEvent';
const fileTypes = ["CSV"];
// Modal
import Modal from '@mui/material/Modal';

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
const Event = (props) => {
    const router = useRouter();
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [moderators, setModerators] = useState([]);
    const [conferences, setConferences] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [event, setEvent] = useState({});
    const [mounted , setMounted] = useState(false);  
    const accessToken = useSelector((state)=>state.user.accessToken);
    const [activeTab, setActiveTab]= useState('conferences');
    const page = {
        active:activeTab, setActive: setActiveTab
    };
    const [stateFormData, setStateFormData] = useState(FORM_DATA_CREATE_EVENT);
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
              try {
                console.log("submit yeh hoga: ", stateFormData);
                  const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/edit`,JSON.stringify({event:{eventName: stateFormData.eventName.value, start: stateFormData.start.value, end: stateFormData.end.value, duration: stateFormData.duration.value}}),{
                      headers: {
                          "Content-Type": "application/json"
                      },
                      withCredentials: true
                  });
                  console.log(response);
                  if(response?.data?.code === 200){
                    router.push(`/admin/${response?.data?.result?.eventURL}`);
                  }
    
              }catch(error){
                  console.log(error)
              }
          }    
    // axios
    const axiosPrivate = useAuthAxiosPrivate();

    const fetchData = async ()=>{
            fetchConferences();
            fetchModerators();
            fetchEvent();
            fetchParticipants();
    }

    const addModerator =async()=>{
        const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/addModerator`,JSON.stringify({email: document.getElementById('moderatorEmail').value, name: document.getElementById('moderatorName').value}),{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        fetchModerators();
    }
    const removeModerator =async(moderatorId)=>{
        console.log('inside remove moderator function: ', moderatorId);
        const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/remove-moderator`,JSON.stringify({moderatorId: moderatorId}),{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        fetchModerators();
    }

    const fetchModerators = async()=>{
        const response = await axiosPrivate.get(`/admin/${window.location.href.split('/')[4]}/moderators`,{},{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        console.log(response);
        setModerators(response?.data?.result);
    }
    const fetchConferences = async()=>{
        const response = await axiosPrivate.get(`/admin/${window.location.href.split('/')[4]}/conferences`,{},{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        console.log(response);
        setConferences(response?.data?.result)
    };
    const [rescheduleModalOpen,setRescheduleModalOpen] = useState(false);
    const [currentConference, setCurrentConference] = useState({});
    const OpenrescheduleModal =(conf)=>{
        setCurrentConference(conf);
        setRescheduleModalOpen(true);
    }
    const [switchModModalOpen,setSwitchModModalOpen] = useState(false);
    const OpenSwitchModModal =(conf)=>{
        setCurrentConference(conf);
        setSwitchModModalOpen(true);
    }
    const rescheduleConference = async()=>{
        const rescheduleDate = document.getElementById('rescheduleDate').value;
        const rescheduleTime = document.getElementById('rescheduleTime').value;
        console.log('start: ' ,new Date(rescheduleDate+ ' ' +rescheduleTime ));
        let start = new Date(rescheduleDate+ ' ' +rescheduleTime );
        let end = new Date(start);
        end.setMinutes(end.getMinutes() + event?.duration);
        console.log('end: ', end);
        const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/reschedule-invite`,JSON.stringify({email: currentConference?.email, moderatorEmail: currentConference?.moderatorEmail,rescheduleStart:start.toISOString(), rescheduleEnd: end.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }),{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        fetchConferences();
    }
    const resendInvite = async(email, moderatorEmail)=>{
        const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/resend-invite`,JSON.stringify({email: email, moderatorEmail: moderatorEmail}),{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        console.log(response);
    }
    const fetchEvent = async()=>{
        const response = await axiosPrivate.get(`/admin/${window.location.href.split('/')[4]}`,{},{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        console.log(response);
        setEvent(response?.data?.result);
        setStateFormData({
            eventName:{
                value: response?.data?.result?.eventName
            },
            eventURL: {
                value: response?.data?.result?.eventURL
            },
            start:{
                value: response?.data?.result?.start
            },
            end:{
                value:response?.data?.result?.end
            },
            duration:{
                value:response?.data?.result?.duration
            }
          })

    };
    const fetchParticipants  = async()=>{
        const response = await axiosPrivate.get(`/admin/${window.location.href.split('/')[4]}/participants`,{},{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        console.log(response);
        setParticipants(response?.data?.result);
    };
    const deleteParticipant = async(participantEmail) =>{
        const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/remove-participants`,JSON.stringify({participantEmail: participantEmail}),{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
        console.log(response);
        fetchParticipants();
    }
    const [file, setFile] = useState(null)

    const handleChange = file => {
        setFile(file);
      };

    const addParticipants = async()=>{
        const formData = new FormData();
        formData.append('file', file);
        console.log(file);
        formData.append('username', 'johndoe');
        const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/add-participants`,formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
              }
        });
        fetchParticipants();
    }

    const genrateOTP =async(email)=>{
        try{
            const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/genrateOTP`,{email: email});
            console.log(response);
            document.getElementById(email).children[document.getElementById(email).children.length-1].innerHTML =response?.data?.result;
        }catch(e){
            console.log(e);
        }
    }
    const switchMod = async(row)=>{
        console.log(row);
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
        <title>{event?.eventName} | Admin</title>
    </Head>
    <LoggedinLayout leftSidebarOpen={leftSidebarOpen} setLeftSidebarOpen={setLeftSidebarOpen} fetchData={fetchData}>
        <AdminNavbar page={page}/>
        <div className='w-full flex justify-center items-center'>
            {activeTab === 'conferences' &&(
                <div className='w-11/12  px-5 flex flex-col gap-5'>
                    <div className='text-2xl font-bold'>{event?.eventName}:&nbsp;<span></span></div>
                    {conferences.length===0? (
                        
                        <div className='text-lg text-gray w-full text-center'> No Conferences Scheduled Yet</div>
                    ):(
                        <div className='w-full x-scroll py-4 px-2'>
                            <Table tableHeaders={['#','Full Name', 'Email ID', 'Date & Time', 'Moderator Email', 'Action', 'Action', 'Switch Moderator']} tableContent={conferences} tableName={'conferencesbyEventURL'} resend={resendInvite} resechdule={OpenrescheduleModal} switchMod={OpenSwitchModModal}/>
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'manageModerators' &&(
                <div className='w-full flex flex-col gap-5 justify-center items-center'>
                    <div className='w-11/12 flex flex-col gap-5'>
                        {/* Add Moderator Form */}
                        <div className='flex flex-col light-shadow p-8 rounded-xl justify-center items-center'>
                            <div className='w-11/12 flex flex-col gap-3'>
                                <div className='font-bold text-xl'>
                                    Add Moderator
                                </div>
                                <div className='w-full flex flex-col md:flex-row gap-4'>
                                    <input type='text' className='border-2 border-border-gray border-solid px-4 rounded-md' id='moderatorName' placeholder='Enter moderator Name'/>
                                    <input type='text' className='border-2 border-border-gray border-solid px-4 rounded-md' id='moderatorEmail' placeholder='Enter moderator Email'/>
                                    <button className='h2s-button' onClick={addModerator}>Add Moderator</button>
                                </div>
                            </div>
                        </div>
                        {/* Moderator Management Table */}
                        <div>
                            {moderators.length === 0 ?(
                                <div className='text-lg text-gray w-full text-center'> No Moderators added Yet</div>
                            ):(
                                <div className='w-full x-scroll py-4 px-2'>
                                    <Table tableHeaders={['#','Full Name', 'Email ID', 'Total Slots', 'Booked Slots', 'Conferences Today', 'Remove Moderator']} tableContent={moderators} tableName={'moderatorsByEventURL'} remove={removeModerator}/>
                                </div>
                            )}
                        
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'manageParticipants' &&(
                <>
                <div className='w-full flex flex-col gap-5 justify-center items-center'>
                    <div className='p-6 w-full md:w-11/12 flex flex-col gap-5'>
                        {/* Add Participant Form */}
                        <div className='flex flex-col light-shadow p-2 rounded-xl justify-center items-center'>
                            <div className='w-11/12 flex flex-col gap-3'>
                                <div className='font-bold text-xl'>
                                    Upload New Users
                                </div>
                                <div className='w-full flex flex-col justify-center items-center gap-4 dropperHere'>
                                    <FileUploader 
                                        handleChange={handleChange} 
                                        id='participantCSV'
                                        name="file" 
                                        types={fileTypes} 
                                        className='w-full p-5 flex justify-center items-center'
                                    />
                                    <button onClick={addParticipants} className='h2s-button text-sm md:text-base'>Add Participants</button>
                                </div>
                            </div>
                        </div>
                        {/* Participant Management Table */}
                        <div>
                            {participants.length === 0?(
                                <div className='text-lg text-gray w-full text-center'> No Participants added Yet</div>
                            ):(
                                <div className='w-full x-scroll py-4 px-2'>
                                    <Table tableHeaders={['#','Full Name', 'Email ID', 'Conference Scheduled', 'Action', 'Genrate OTP']} tableContent={participants} tableName={'participantsByEventURL'} remove={deleteParticipant} genrateOTP={genrateOTP}/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                </>
            )}
            {activeTab === 'editEvent' &&(
                <>
                <div className='w-full flex flex-col gap-5 justify-center items-center'>
                    <div className='w-10/12 flex flex-col gap-5 justify-center items-center'>
                        {/* Edit Event Form */}
                        <div className='flex flex-col light-shadow p-2 rounded-xl justify-center items-center w-full m-2 md:w-2/3'>
                            <div className=' p-2 md:w-11/12 flex flex-col gap-3'>
                                <div className='w-full flex flex-wrap justify-between gap-4'>
                                <CreateEvent props={{submitHandler,
                                    onChangeHandler,
                                    stateFormData,
                                    page:'editEvent'
                                    }}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </>
            )}
             <Modal
                open={rescheduleModalOpen}
                onClose={()=>{setRescheduleModalOpen(false)}}
                className='flex justify-center items-center'>
                <div className='w-2/5 h-96 bg-white border-0 outline-0 rounded-lg p-8 flex flex-col gap-5'>
                    <div className='font-bold text-dark-blue text-xl'>Reschedule Conference</div>
                    <div><span className='text-dark-blue font-semibold'>Participant Email: </span> {currentConference?.email}</div>
                    <div><span className='text-dark-blue font-semibold'> Current Date & Time: </span> {new Date(currentConference?.start).toLocaleString()}</div>
                    <div><span className='text-dark-blue font-semibold'> Duration: </span> {event?.duration} Minutes</div>
                    <div><span className='text-dark-blue font-semibold'> Enter New Date: </span> &nbsp; <input id='rescheduleDate' className='border-2 border-border-gray rounded-md px-2 border-solid' type='date'/></div>
                    <div><span className='text-dark-blue font-semibold'> Enter New Time: </span> &nbsp; <input id='rescheduleTime' className='border-2 border-border-gray rounded-md px-2 border-solid' type='time'/></div>
                    <button className='h2s-button' onClick={rescheduleConference}>Reschedule</button>
                </div>
            </Modal>
             <Modal
                open={switchModModalOpen}
                onClose={()=>{setSwitchModModalOpen(false)}}
                className='flex justify-center items-center'>
                <div className='w-2/5 bg-white border-0 outline-0 rounded-lg p-8 flex flex-col gap-5'>
                    <div className='font-bold text-dark-blue text-xl'>Switch Moderator</div>
                    <div><span className='text-dark-blue font-semibold'>Participant Email: </span> {currentConference?.email}</div>
                    <div><span className='text-dark-blue font-semibold'>Date & Time: </span> {new Date(currentConference?.start).toLocaleString()}</div>
                    <div><span className='text-dark-blue font-semibold'>Current Moderator: </span> {currentConference?.moderatorEmail}</div>
                    <div><span className='text-dark-blue font-semibold'>Select New Moderator: </span>
                        <select className='border-solid border-2 border-gray rounded-md p-1'>
                            {moderators.map((mod)=>(
                                <option>{mod.email}</option>
                            ))}
                        </select>
                    </div>
                    <button className='h2s-button' onClick={switchMod}>Switch</button>
                </div>
            </Modal>
        </div>
    
    </LoggedinLayout>
    </>
  )
}

export default Event