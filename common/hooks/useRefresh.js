import axios from '../api/axios';
import { useSelector, useDispatch } from 'react-redux';
import { setAccessToken, setEmail,setRole } from "../redux/slices/userSlice";
import { useRouter } from "next/router";
const useRefresh = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const accessToken = useSelector((state)=> state.user.accessToken);
    const refresh= async()=>{
        try{
            const response = await axios.post('/auth/refresh-token',{
                withCredentials:true
            });
            console.log('refresh function k andar ka response: ', response);
            dispatch(setAccessToken(response.data.result.authToken));
            dispatch(setEmail(response.data.result.email));
            dispatch(setRole(response.data.result.role));

            return {authToken: response.data.result.authToken, role: response.data.result.role};
        }catch(error){
            router.push('/auth/login');
        }
        
    }



  return refresh
}

export default useRefresh