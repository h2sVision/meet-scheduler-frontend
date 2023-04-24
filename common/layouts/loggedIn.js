import React from 'react'
import { useState, useEffect } from "react";
// Persist User
import usePersist from '../hooks/usePersist';
// redux
import { intializePersist } from '../redux/slices/persistSlice';
import { useDispatch, useSelector } from 'react-redux';
// Logout
import useLogout from '../hooks/useLogout';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

const LoggedinLayout = ({leftSidebarOpen, setLeftSidebarOpen, fetchData, ...props}) => {
    const [mounted , setMounted] = useState(false); 
    const verifyRefreshToken = usePersist(fetchData);
    const router = useRouter();

    // redux
    const dispatch = useDispatch();
    const persist = useSelector((state) => state.persist.value);
    const accessToken = useSelector((state)=>state.user.accessToken);

    // Logout
    const logout = useLogout();
    const callLogout = async () => {
        return await logout();
    }
    // backToDashboard
    const backToDashboard = ()=>{
        let url = window.location.href;
        let newUrl = url.substring(0, url.lastIndexOf('/')) + '/dashboard';
        router.push(newUrl);
    }
    // refresh token status

    useEffect(()=>{
        setMounted(true);
        dispatch(intializePersist());
    },[]);
    useEffect(()=>{
        console.log("accestoken dekho: ",accessToken);
        if (persist === 'true') {
            if (typeof (accessToken) == 'undefined' || accessToken === '') {
                verifyRefreshToken();
            }
        }else if (persist === 'false') {
            if (accessToken == '' || accessToken === '') {
                callLogout();
                router.push('/auth/login');
            }
        }
    },[mounted]);

    useEffect(() => {
        
     }, []);

    if(!mounted){
        return null;
    }

    return (
    <div>
        <Navbar leftSidebarOpen={leftSidebarOpen} setLeftSidebarOpen={setLeftSidebarOpen} callLogout={callLogout} backToDashboard={backToDashboard}/>
        {props.children}    
    </div>
    );
}

export default LoggedinLayout