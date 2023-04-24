import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  accessToken:'',
  role:''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setuser:(state, action)=>{
        state.email = action.payload.email,
        state.accessToken = action.payload.accessToken
        state.role = action.payload.role
      },
      setEmail:(state, action)=>{
        state.email = action.payload;
      },
      setAccessToken:(state, action)=>{
        state.accessToken = action.payload;
        console.log("user: ", state.accessToken);
      },
      setRole:(state, action)=>{
        state.role = action.payload;
      }
    },
  })
  
  export const {setuser, setAccessToken, setEmail, setRole} = userSlice.actions
  
  export default userSlice.reducer