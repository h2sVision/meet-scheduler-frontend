import useAuthAxiosPrivate from "./useAuthAxiosPrivate";
import { useSelector, useDispatch } from "react-redux";
import { setuser } from "../redux/slices/userSlice";
import { useRouter } from "next/router";
const useLogout =() =>{
    const dispatch = useDispatch();
    const axiosPrivate = useAuthAxiosPrivate();
    const router = useRouter();
    const logout =async () =>{
        dispatch(setuser({
            email: '',
            accessToken:'',
            role:''
        }));
        console.log("in logout function");
        try{
            const response = await axiosPrivate.post('/auth/logout');
            router.push('/auth/login');
        }catch(err){
            console.error(err.code);
        }
    }

    return logout;

};
export default useLogout;