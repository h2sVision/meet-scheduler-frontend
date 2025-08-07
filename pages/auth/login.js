

import Head from "next/head";
import { useEffect, useState } from "react";
import LoginForm from "../../common/auth/login";
import axios from '../../common/api/axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
// Redux Stuff
import { useDispatch, useSelector } from 'react-redux';
import { setPersist } from '../../common/redux/slices/persistSlice';
import { setAccessToken, setEmail, setRole} from '../../common/redux/slices/userSlice';


const FORM_DATA_LOGIN = {
  email: {
    value: "",
  },
  otp1: {
    value: '',
  },
  otp2: {
    value: '',
  },
  otp3: {
    value: '',
  },
  otp4: {
    value: '',
  },
  otp5: {
    value: '',
  },
  otp6: {
    value: '',
  },
  trust: {
    value: false
  }
};


export default function Login() {

    const [isOtpSent, setOtp] = useState(false);
    const [stateFormData, setStateFormData] = useState(FORM_DATA_LOGIN);
    const [errorValEmail, setErrorValEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorStatus, setErrorStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const aT = useSelector((state)=>state.user.accessToken)
    const userRole = useSelector((state)=>state.user.role)
   // Redirect if alredy Loggedin
    useEffect(()=>{
      console.log('this is aT: ', aT);
      if(aT != ''){
        console.log(userRole);
        if(userRole==='superAdmin'){
          router.push(`/admin/dashboard`);
        }else  if(userRole ==='innovator'){
          router.push(`/user/dashboard`);
        }else{
        if(userRole != null){
          router.push(`/${userRole}/dashboard`);
        }
        }
      }
    },[])
    // Redux Stuff
    const dispatch = useDispatch();

    // Handle changes of Email input
    function onChangeHandler(e) {
        const { name, value } = e.currentTarget;

        setStateFormData({
        ...stateFormData,
        [name]: {
            ...stateFormData[name],
            value,
        },
        });
    }

    function handleOnKeyupEmail(e) {
        const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!e.target.value) {
          setErrorValEmail("Email is required!");
        } else if (!email_regex.test(e.target.value)) {
          setErrorValEmail("This is not a valid Email format!");
        } else {
          setErrorValEmail("");
        }
      }

      const validateForm = () => {
        let onkeyupErrors =  document.getElementById("email-error");
        let formIsValid = 1;
        let email = "";
        email = stateFormData.email.value;
      
        if (email != null && onkeyupErrors!= null && onkeyupErrors.classList.contains("error-class")) {
          formIsValid = 1;
        }else if(email===''){
          formIsValid = 2;
    
        }else {
          formIsValid = 0;
        }
        return formIsValid;
      };

      // Handle changes of 
      function onCheckChangeHandler(e) {
        const { name, checked } = e.currentTarget;
        console.log('itthe toh dekho:', name, checked);
        setStateFormData({
          ...stateFormData,
          [name]: {
            ...stateFormData[name],
            value: checked,
          },
        });
      }
      async function loginSubmit(e){
        try {
          e.preventDefault();
          setLoading(true)
          let formErrorCount = 1;
          formErrorCount = validateForm(e);
          console.log("Form Error Details " + formErrorCount);
          if (formErrorCount === 1) {
            setErrorStatus(true);
            setErrorMessage("Please resolve all errors.");
          } else if(formErrorCount === 2){
            setErrorStatus(true);
            setErrorMessage("Email is Required");
      
          }else if(formErrorCount === 0){
            setErrorStatus(false);
            dispatch(setPersist(stateFormData.trust.value));
            const response = await axios.post('/auth/get-otp',JSON.stringify({email: stateFormData.email.value}),{
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            console.log('yeh wla h reponse',response);
            setErrorStatus(true);
            setErrorMessage("OTP Sent");
            setOtp(true);
          }
        }catch(error){
          console.log("error => ", error);
          if(error?.response?.data?.code== 404){
            setErrorStatus(true);
            setErrorMessage("User not Registered");  
          }else if(error?.response?.data?.code == 500){
            setErrorStatus(true);
            setErrorMessage("Internal Server Error");  
          }
        }
        setLoading(false)
    }    
    async function otpSubmit(){
        try {
          setLoading(true);
            const response = await axios.post('/auth/login',JSON.stringify({email: stateFormData.email.value, otp: stateFormData.otp1.value + stateFormData.otp2.value + stateFormData.otp3.value+ stateFormData.otp4.value+ stateFormData.otp5.value+ stateFormData.otp6.value,}),{
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            console.log( 'yanha aaraha h kya?: ', response);
            if(response.data.message === "OTP matched, user logged in"){
                dispatch(setAccessToken(response?.data?.result?.authToken));
                // dispatch(setEmail('prachi@hack2skill.com'));
                dispatch(setRole(response?.data?.result?.role));

                if(response?.data?.result?.role === 'superAdmin'){
                  router.push('/admin/dashboard');
                }else if(response?.data?.result?.role === 'moderator'){
                  router.push('/moderator/dashboard');
                }else{
                  router.push('/user/dashboard');
                }
            }
        
          }catch(e){
           if(e?.response?.status==401){
            setErrorStatus(true);
            setErrorMessage(e?.response?.data?.message);  
           }else if(e?.response?.status==404){
            setErrorStatus(true);
            setErrorMessage(e?.response?.data?.message);  
           }else if(e?.response?.status==500){
            setErrorStatus(true);
            setErrorMessage(e?.response?.data?.message);  
           }
        }
        setLoading(false);};

      const closeToast = () => {
        setErrorStatus(false);
      };
    

  return (
    <>
        <Head>
            <title>Login</title>
        </Head>
        <div className="h-screen">
            <div className="flex  items-center flex-wrap h-full g-6 dark:bg-darkBgImagelogin dark:bg-loginDarkBg loginBg">
                <div className="relative lg:order-1 md:order-2 sm:order-2 xs:order-2 col-md-5 my-md-auto small-card text-center grow-0 shrink-1  md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-full mb-12 md:mb-0 LoginImgDiv">
                  {/* left */} 
                  { !isOtpSent ? (
                  <img className='text-left w-full rightSideImage' src="/auth/newGdscCoverImage.png" />
                  ):(
                  <img className='text-left w-full rightSideImage' src="/auth/newOtpImage.png" />)}
                </div>
                {/* Right */}
                <div className="lg:order-2 order-2 md:order-1 sm:order-1 xs:order-1   offset-md-1 col-md-6 px-md-auto p-0 xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-full mb-12 md:mb-0 LoginContentDiv">
                    <div className="w-100 flex justify-end">
                    {errorStatus ? (
                        <div
                        id="toast-danger"
                        className={`flex items-center w-full max-w-xs p-4 mb-4 text-white rounded-lg shadow signup-error-div ${errorMessage === 'OTP Sent' ? 'bg-green-500': 'bg-red-500'}`}
                        role="alert"
                        >
                        <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 rounded-lg ${errorMessage === 'OTP Sent'? 'bg-green-100': ' bg-red-100 '}`}>
                            {errorMessage === 'OTP Sent'?(
                              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                              width="48" height="48"
                              viewBox="0 0 48 48">
                              <path fill="#43A047" d="M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z"></path>
                              </svg>
                            ):(
                              <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                            </svg>
                            )}
                        </div>
                        <div className="ml-3 text-sm font-normal">{errorMessage}</div>
                        <button
                            type="button"
                            className="ml-auto -mx-1.5 -my-1.5 text-white hover:text-gray-900 roundedLg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 rounded-sm"
                            data-dismiss-target="#toast-danger"
                            aria-label="Close"
                            onClick={closeToast}
                        >
                            <span className="sr-only">Close</span>
                            <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                            </svg>
                        </button>
                        </div>
                    ) : (
                        <></> 
                    )}
                    </div>
                    <div className="w-11/12 lg:w-10/12 mx-auto">
                        <h2 className="text-3xl font-semibold pt-5">Login to schedule your interview slot</h2>
                        {/* <div className="flex w-full pt-8 items-center">
                        <Link href={`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/google`} className="w-full">
                          <button className="bg-white shadow text-gray rounded-md font-normal  focus:outline-none focus:shadow-outline  flex gap-2 justify-center items-center w-full py-2 lg:py-3"> 
                            <img src="/auth/Google__G__Logo.png" width="20"/> Login in with Google 
                          </button>
                        </Link>
                        </div> */}
                        {/* <div className="w-full flex text-xs justify-center items-center text-gray pt-6 gap-2">
                          <hr className="w-1/2 bg-gray"/> or <hr className="w-1/2 bg-gray"/>
                        </div> */}
                        <LoginForm 
                            props={{
                                onChangeHandler,
                                handleOnKeyupEmail,
                                stateFormData,
                                errorValEmail,
                                validateForm,
                                loginSubmit,
                                errorStatus,
                                errorMessage,
                                isOtpSent,
                                setOtp,
                                otpSubmit,
                                onCheckChangeHandler,
                                loading
                                
                              }}
                        />
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
