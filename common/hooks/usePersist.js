import useRefresh from './useRefresh';
import { useSelector } from 'react-redux';

const usePersist =(fetchData) =>{
    const refresh = useRefresh();
    const persist = useSelector((state) => state.persist.value);

    const verifyRefreshToken = async() =>{
        try{
            if(persist){
                const response = await refresh();
                console.log(response);
                if(fetchData){
                    fetchData();
                }
                return response.authToken;
            }
        }catch(err){
            console.error(err);
        }
    }
    return verifyRefreshToken;
}

export default usePersist;