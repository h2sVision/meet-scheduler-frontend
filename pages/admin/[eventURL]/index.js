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
import CircularProgress from '@mui/material/CircularProgress';
import ReactPaginate from 'react-paginate';

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
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [moderators, setModerators] = useState([]);
    const [conferences, setConferences] = useState([]);
    const [numberofConferences, setNumberofConferences] = useState(0);
    const [numberofParticipants, setNumberofParticipants] = useState(0);
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
                setLoading(true)
                console.log("submit yeh hoga: ", stateFormData);
                  const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/edit`,JSON.stringify({event:{eventName: stateFormData.eventName.value, start: stateFormData.start.value, end: stateFormData.end.value, duration: stateFormData.duration.value}}),{
                      headers: {
                          "Content-Type": "application/json"
                      },
                      withCredentials: true
                  });
                  console.log(response);
    
              }catch(error){
                  console.log(error)
              }
              setLoading(false);
          }    
    // axios
    const axiosPrivate = useAuthAxiosPrivate();

    //Pagination - Conferences
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage =10;
    const endOffset = itemOffset + itemsPerPage;
    const [pageCount,setPageCount] = useState(Math.ceil(numberofConferences / itemsPerPage));
    // Invoke when user click to request another page.
    const handlePageClick = async(event) => {
        setLoading(true);
      const newOffset = (event.selected * itemsPerPage) % numberofConferences;
        try{
            const response = await axiosPrivate.get(`/admin/${window.location.href.split('/')[4]}/conferences/${event.selected +1}`,{},{
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            console.log(response);
            setConferences(response?.data?.result)
        }catch(e){
            console.log(e);
        }
      setItemOffset(newOffset);
      setLoading(false);
    };
    //Pagination - Participants
    const [pitemOffset, setPItemOffset] = useState(0);
    const PitemsPerPage =10;
    const pendOffset = pitemOffset + PitemsPerPage;
    const [ppageCount, setPPageCount] = useState(1);
  
    // Invoke when user click to request another page.
    const phandlePageClick = async(event) => {
        setLoading(true);
      const pnewOffset = (event.selected * PitemsPerPage) % numberofParticipants;
      console.log(
        `User requested page number ${event.selected}, which is offset ${pnewOffset}`

      );
        try{
            const response = await axiosPrivate.get(`/admin/${window.location.href.split('/')[4]}/participants/${event.selected +1}`,{},{
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            console.log(response);
            setParticipants(response?.data?.result);
        }catch(e){
            console.log(e);
        }
      setPItemOffset(pnewOffset);
      setLoading(false);
    };

    const fetchData = async (dataType) => {
        setLoading(true);
        try {
          await fetchEvent();
          switch (dataType) {
            case 'conferences':
                await fetchConferences(1);
                break;
            case 'manageModerators':
                await fetchModerators();
                break;
            case 'manageParticipants':
                await fetchParticipants(1);
                break;
            default:
                break;
          }
        } catch (e) {
          console.log(e);
        }
        setLoading(false);
      };

    const addModerator =async()=>{
        setLoading(true)
        try{
            const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/addModerator`,JSON.stringify({email: document.getElementById('moderatorEmail').value, name: document.getElementById('moderatorName').value}),{
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            await fetchModerators();
        }catch(e){
            console.log(e);
        }
        setLoading(false);
    }
    const removeModerator =async(moderatorId)=>{
        setLoading(true)
        try{
            const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/remove-moderator`,JSON.stringify({moderatorId: moderatorId}),{
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            await fetchModerators();
        }catch(e){
            console.log(e);
        }
        setLoading(false);
    }

    const fetchModerators = async()=>{
        setLoading(true);
        try{
            const response = await axiosPrivate.get(`/admin/${window.location.href.split('/')[4]}/moderators`,{},{
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            console.log(response);
            setModerators(response?.data?.result);
        }catch(e){
            console.log(e)
        }
        setLoading(false);
    }
    const fetchConferences = async(page)=>{
        setLoading(true);
        try{
            const response = await axiosPrivate.get(`/admin/${window.location.href.split('/')[4]}/conferences/${page}`,{},{
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            console.log(response);
            setConferences(response?.data?.result);
            setNumberofConferences(response?.data?.number);
            setPageCount(Math.ceil(response?.data?.number/ itemsPerPage));
            
        }catch(e){
            console.log(e);
        }
        setLoading(false);
    };
    const removeConference = async(row)=>{
        setLoading(true);
        try{
            const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/remove-conference`,JSON.stringify({email: row?.email, moderatorEmail: row?.moderatorEmail}),{
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            await fetchConferences(1);
        }catch(e){
            console.log(e)
        }
        setLoading(false);
    }
    const [rescheduleModalOpen,setRescheduleModalOpen] = useState(false);
    const [currentConference, setCurrentConference] = useState({});
    const OpenrescheduleModal =(conf)=>{
        setCurrentConference(conf);
        setRescheduleModalOpen(true);
    }
    const [switchModModalOpen,setSwitchModModalOpen] = useState(false);
    const OpenSwitchModModal =async (conf)=>{
        try{
            await fetchModerators();
            setCurrentConference(conf);
            setSwitchModModalOpen(true);
        }catch(e){
            console.log(e);
        }
    }
    const rescheduleConference = async()=>{
        setLoading(true)
        try{
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
        await fetchConferences(1);
        }catch(e){
            console.log(e)
        }
        setLoading(false);

    }
    const resendInvite = async(email, moderatorEmail)=>{
        try{
            const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/resend-invite`,JSON.stringify({email: email, moderatorEmail: moderatorEmail}),{
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            console.log(response);
        }catch(e){
            console.log(e);
        }
    }
    const fetchEvent = async()=>{
        try{
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
        }catch(e){
            console.log(e);
        }

    };
    const fetchParticipants  = async(page)=>{
        try{
            const response = await axiosPrivate.get(`/admin/${window.location.href.split('/')[4]}/participants/${page}`,{},{
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            // console.log(response);
            setParticipants(response?.data?.result);
            setNumberofParticipants(response?.data?.number);
            setPPageCount(Math.ceil(response?.data?.number / 10));
        }catch(e){
            console.log(e);
        }
    };
    const deleteParticipant = async(participantEmail) =>{
        try{
            const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/remove-participants`,JSON.stringify({participantEmail: participantEmail}),{
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            console.log(response);
           await fetchParticipants();
        }catch(e){
            console.log(e);
        }
    }
    const [file, setFile] = useState(null)

    const handleChange = file => {
        setFile(file);
      };

    const addParticipants = async()=>{
        try{
            const formData = new FormData();
        formData.append('file', file);
        console.log(file);
        formData.append('username', 'johndoe');
        const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/add-participants`,formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
              }
        });
        await fetchParticipants();
        }catch(e){
            console.log(e);
        }
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
    const switchMod = async()=>{
        setLoading(true);
        try{
            const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/switch-moderator`,{email: currentConference?.email, moderatorEmail: currentConference?.moderatorEmail, newModerator: document.getElementById('newMod').value});
            console.log(response);
            if(response.status ===200){
                await fetchConferences(1);
                setSwitchModModalOpen(false);
            }
            await fetchConferences(1);
        }catch(e){
            console.log(e);
        }
        setLoading(false);
    }

    // Download Function
    const download = async(e)=>{
        const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/conferences/download`);
        console.log(response);
        let csvData = response?.data;
        const contentType = response.headers.get('content-type');
        const blob = new Blob([csvData], { type: contentType });
      
        const url = URL.createObjectURL(blob);
      
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.csv';
        link.click();
      
        URL.revokeObjectURL(url);
    }

    const searchInConferences =async(query, page)=>{
        setLoading(true);
        try{
            const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/search-conferences`,{query: query});
            console.log(response);
            setConferences(response?.data?.result);
            setPageCount(1);
       }catch(e){
        console.log(e);
       }
       setLoading(false);
    }
    const searchInParticipants =async(query)=>{
        setLoading(true);
        try{
            const response = await axiosPrivate.post(`/admin/${window.location.href.split('/')[4]}/search-conferences`,{query: query});
            console.log(response);
            setParticipants(response?.data?.result);
            setPPageCount(1);
       }catch(e){
        console.log(e);
       }
       setLoading(false);
    }

    // Fetching Data intially
    useEffect(() => {
        if (mounted && accessToken) {
            fetchData('conferences');
        } 
    }, [mounted]);
      
    useEffect(() => { 
    fetchData(activeTab);
    }, [activeTab]);

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
                    <div className='text-2xl font-bold'>{event?.eventName}:&nbsp;<span className='font-thin'>No of Conferences - {numberofConferences}</span></div>
                    {loading? (<CircularProgress/>) :(
                        <>
                        {/* {conferences?.length===0? (
                            
                            <div className='text-lg text-gray w-full text-center'> No Conferences Scheduled Yet</div>
                        ):( */}
                            <>
                            <div className='x-scroll py-4 px-2'>
                                <Table download={download} tableHeaders={['#','Full Name', 'Email ID', 'Date & Time', 'Moderator Email','Link', 'Action', 'Action', 'Switch Moderator']} tableContent={conferences} tableName={'conferencesbyEventURL'} resend={resendInvite} remove={removeConference} switchMod={OpenSwitchModModal} search={searchInConferences}/>
                            </div>
                            </>
                        {/* )} */}
                        </>
                    )}
                    <div className='flex justify-center items-center pb-5 paginationContainer'>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="<"
                            renderOnZeroPageCount={null}
                        />
                    </div>
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
                        {loading? (<CircularProgress/>) :(
                            <>
                            {moderators.length === 0 ?(
                                <div className='text-lg text-gray w-full text-center'> No Moderators added Yet</div>
                            ):(
                                <div className='w-full x-scroll py-4 px-2'>
                                    <Table download={download} tableHeaders={['#','Full Name', 'Email ID', 'Availability','Total Slots', 'Booked Slots', 'Conferences Today', 'Remove Moderator']} tableContent={moderators} eventName={event?.eventURL} tableName={'moderatorsByEventURL'} remove={removeModerator}/>
                                </div>
                            )}
                            </>
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
                        {loading? (<CircularProgress/>) :(
                            <>
                            {/* {participants.length === 0?(
                                <div className='text-lg text-gray w-full text-center'> No Participants added Yet</div>
                            ):( */}
                                <>
                                <div className='text-xl px-5'>Total number of Participants - {numberofParticipants}</div>
                                <div className='w-full x-scroll py-4 px-2'>
                                    <Table search={searchInParticipants} download={download} tableHeaders={['#','Full Name', 'Email ID', 'Conference Scheduled', 'Action', 'Genrate OTP']} tableContent={participants} tableName={'participantsByEventURL'} remove={deleteParticipant} genrateOTP={genrateOTP}/>
                                </div>
                                </>
                            {/* )} */}
                            </>
                        )}
                        <div className='flex justify-center items-center pb-5 paginationContainer'>
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel=">"
                                onPageChange={phandlePageClick}
                                pageRangeDisplayed={5}
                                pageCount={ppageCount}
                                previousLabel="<"
                                renderOnZeroPageCount={null}
                            />
                        </div>
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
                                    page:'editEvent',
                                    loading
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
                        <select className='border-solid border-2 border-gray rounded-md p-1' id='newMod'>
                            {moderators.map((mod, key)=>(
                                <option key={key}>{mod.email}</option>
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