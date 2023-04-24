import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefresh from "./useRefresh";
import { useSelector, useDispatch } from 'react-redux';

const useAuthAxiosPrivate =() =>{
    const refresh = useRefresh();
    const auth = useSelector((state) => state.user.accessToken);
    const callRefresh = async() =>{
        await refresh();

    }
    // useEffect(()=>{
    //     callRefresh();
    // },[]);
    useEffect(()=>{
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config=>{
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth}`;
                }
                return config;
            }, (error)=> Promise.reject(error)
        )

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => {
                return response
            },
            async (error) =>{
                const prevRequest = error?.config;
                if(error?.response?.status === 401  && !prevRequest?.sent){
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );
        
        return()=>{
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [refresh,auth] );

    return axiosPrivate;
}

export default useAuthAxiosPrivate;