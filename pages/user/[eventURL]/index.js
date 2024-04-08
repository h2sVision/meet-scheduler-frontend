import React,{useState, useEffect} from 'react';
import LoggedinLayout from '../../../common/layouts/loggedIn';
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
    const [userData, setUserData] = useState([]);
    const [mounted , setMounted] = useState(false);  
    const accessToken = useSelector((state)=>state.user.accessToken);
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [uploadedImageLink, setUploadedImageLink] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // axios
    const axiosPrivate = useAuthAxiosPrivate();

    const fetchData = async (role)=>{
        setLoading(true)
        try{
            const response = await  axiosPrivate.get(`/user/${window.location.href.split('/')[4]}/userEventInfo`);
            setUserData(response?.data?.result);
            var userUpdated = response?.data?.result.detailsUpdated;
            if (userUpdated === 'true'){
              router.push(`/user/${window.location.href.split('/')[4]}/slot-booking`)
            }
        }catch(e){
          if(e?.response?.status === 300){
            router.push(`/user/${e?.response?.data?.message}`)
            // console.log(e)
          }else{
            console.log(e)
          }
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
    const handleInputChange = (e) => {
        const { name, checked } = e.target;
        setUserData(prevUserData => ({
          ...prevUserData,
          [name]: checked ? "on" : "off"
        }));
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the user has selected a file and there's a link available
        if (!uploadedImageLink) {
            setErrorMessage('Please upload your ID card before proceeding.');
            return; // Exit the function without submitting the form
        }

        // Clear any previous error message if submission is successful
        setErrorMessage('');

        const response = await axiosPrivate.post(`/user/${window.location.href.split('/')[4]}/updateUserEventInfo`, {userData, idCardImageURL: uploadedImageLink});

        var serverResponse = response?.data?.message;

        // Handle form submission, if needed
        console.log("Form submitted:", userData);

        if (serverResponse === "User Updated") {
            router.push(`/user/${window.location.href.split('/')[4]}/slot-booking`)
        }
    };
    

      const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        
        // Create a FormData object to send the file to the backend
        const formData = new FormData();
        formData.append('image', file);
        
        try {
            // Send a POST request to your backend server to upload the image using axios
            const response = await axiosPrivate.post('/user/uploadImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // Handle the response
            if (response.status === 200) {
                console.log('Image uploaded successfully');
                const idCardImageURL = response.data.result;
                setUploadedImageLink(idCardImageURL);
                setUploadStatus('Image uploaded successfully');
                setErrorMessage('');
            } else {
                console.error('Failed to upload image');
                setUploadStatus('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setUploadStatus('Error uploading image');
        }
    };
    
  return (
    <>
    <Head>
      <title>Participant Dashboard</title>
    </Head>
    <LoggedinLayout leftSidebarOpen={leftSidebarOpen} setLeftSidebarOpen={setLeftSidebarOpen} fetchData={fetchData}>
    <div className="max-w-screen-sm	mx-auto bg-white rounded-xl overflow-hidden shadow-lg p-6 mt-10">
        <h5 className="text-2xl font-bold text-center">
        Welcome {userData.fullName}
        </h5>
        <h4 className='font-bold text-xl text-center text-stone-800	'>
            Kindly confirm your details to move forward
        </h4>
        <small className='text-center text-stone-800 block pt-2'>
          <b className='font-bold'>Note:</b> It is mandatory to upload your ID card before proceeding, the other details will not be allowed to be changed. <br/> If you wish to change any details please contact the moderator while you are giving your interview.
        </small>
      <form onSubmit={handleSubmit} className="">
        <div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div class="sm:col-span-12">
                <label for="fullName" class="block text-sm font-bold leading-6 text-gray-900">Full Name (can not modify)</label>
                <div class="mt-2">
                <input type="text" 
                name="fullName" 
                id="fullName" 
                autocomplete="given-name" 
                value={userData.fullName}
                onChange={handleInputChange}
                disabled
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-zinc-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
            </div>
            <div class="sm:col-span-12">
                <label for="email" class="block text-sm font-bold leading-6 text-gray-900">Email ID (can not modify)</label>
                <div class="mt-2">
                <input type="text" 
                name="email" 
                id="email" 
                autocomplete="given-name" 
                value={userData.email}
                onChange={handleInputChange}
                disabled
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                <small className='text-red text-xs'>The Email ID can not be updated.</small>
            </div>
            <div className="sm:col-span-12">
                <label for="gender" className="w-full block text-sm font-bold leading-6 text-gray-900">Gender (can not modify)</label>
                <div className="mt-2">
                    <select id="gender" name="gender" disabled className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        <option value="Male" selected={userData.gender === "Male" ? true : false}>Male</option>
                        <option value="Female" selected={userData.gender === "Female" ? true : false}>Female</option>
                        <option value="Transgender" selected={userData.gender === "Transgender" ? true : false}>Transgender</option>
                        <option value="PreferNotToSay" selected={userData.gender === "PreferNotToSay" ? true : false}>Prefer not to say</option>
                        <option value="Other" selected={userData.gender === "Other" ? true : false}>Other</option>
                    </select>
                </div>
            </div>
            <div class="sm:col-span-12">
                <label for="mobileNumber" class="block text-sm font-bold leading-6 text-gray-900">Mobile Number (can not modify)</label>
                <div class="mt-2">
                <input type="text" 
                name="mobileNumber" 
                id="mobileNumber" 
                autocomplete="given-name" 
                value={userData.mobileNumber}
                onChange={handleInputChange}
                disabled
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
            </div>
            <div class="sm:col-span-12">
                <label for="chapterName" class="block text-sm font-bold leading-6 text-gray-900">Chapter/College Name (can not modify)</label>
                <div class="mt-2">
                <input type="text" 
                name="chapterName" 
                id="chapterName" 
                autocomplete="given-name" 
                value={userData.chapterName}
                onChange={handleInputChange}
                disabled
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
            </div>
            <div class="sm:col-span-12">
                <label for="linkedInURL" class="block text-sm font-bold leading-6 text-gray-900">LinkedIn URL (can not modify)</label>
                <div class="mt-2">
                <input type="text" 
                name="linkedInURL" 
                id="linkedInURL" 
                autocomplete="given-name" 
                value={userData.linkedInURL}
                onChange={handleInputChange}
                disabled
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
            </div>
            <div className="sm:col-span-12">
                <label for="passingYear" class="block text-sm font-bold leading-6 text-gray-900">Graduation/Passing Year (can not modify)</label>
                <div class="mt-2">
                <input type="text" 
                name="passingYear" 
                id="passingYear" 
                autocomplete="given-name" 
                value={userData.passingYear}
                onChange={handleInputChange}
                disabled
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
            </div>
            <div className="sm:col-span-12">
                <label htmlFor="imageUpload" className="block text-sm font-bold leading-6 text-gray-900">
                  Upload your college ID card (<span className='text-red-500'>REQUIRED</span>)
                  <br/>
                  Note: If you do not have an ID card you can upload a document that mentions your college passing year (Example: Bonafide Certificate)</label>
                <div className="mt-2">
                    <input 
                        type="file"
                        id="imageUpload"
                        name="imageUpload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full rounded-md border-gray-300 py-1.5 px-3 text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                    <input name='idCardImageURL' id='idCardImageURL' onChange={handleInputChange} value={uploadedImageLink} hidden/>
                    <small>
                        Image must be less than 10 MB.
                    </small>
                    <br/>
                    <small>
                        {uploadStatus && (
                            <p className={uploadStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}>
                                {uploadStatus}
                            </p>
                        )}
                    </small>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </div>
            </div>
            <div class="sm:col-span-12 flex gap-x-3">
                <div class="flex h-6 items-center">
                <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    className="h-4 w-full rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    required={true}
                    checked={userData.consent === "on"}
                    onChange={handleInputChange}
                    />
                </div>
                <div class="text-sm leading-6">
                    <label for="consent" class="font-medium text-gray-900">
                        You are agree for Google Developer Student Clubs team to contact you to get better clarity of how your institution operates in case of any confusion
                    </label>
                </div>
            </div>
            <input id="detailsUpdated" 
                    name="detailsUpdated" 
                    type="input" 
                    class="h-4 w-full rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    value={userData.detailsUpdated = "true"}
                    hidden="true"/>
        </div>
        <button type="submit" className="bg-google-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-5 w-full">
          Proceed to Next
        </button>
      </form>
    </div>
    </LoggedinLayout>
    </>
  )
}

export default Dashboard