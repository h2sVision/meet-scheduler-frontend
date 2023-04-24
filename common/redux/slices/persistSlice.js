import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: false,
}

export const persistSlice = createSlice({
    name: 'persist',
    initialState,
    reducers: {
      intializePersist:(state)=>{
        state.value = window.localStorage.getItem('persist') || false;
      },
      setPersist:(state, action)=>{
        state.value = action.payload;
        window.localStorage.setItem('persist', action.payload);
      }
    },
  })
  
  export const { intializePersist, setPersist} = persistSlice.actions
  
  export default persistSlice.reducer