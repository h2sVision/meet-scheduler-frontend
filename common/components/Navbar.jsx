import React from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';


const Navbar = ({leftSidebarOpen, setLeftSidebarOpen, callLogout, backToDashboard}) => {
  return (
    <>
    <div className='flex flex-col w-full shadow  sticky top-0 z-30 bg-white text-black'>
      <div className=' w-full py-2 md:py-3 px-5 flex justify-between items-center'>
          <a className='branding w-56 md:w-72' href='/'>
              <img src="/auth/newNav.png" className='w-full'/>
          </a>
          <div className='hidden md:flex fontMontserrat text-sm gap-6'>
              {/* <div className='cursor-pointer' onClick={backToDashboard}>Dashboard</div> */}
              <div className='cursor-pointer' onClick={callLogout}> <LogoutRoundedIcon fontSize='small'/> &nbsp; Logout</div>
            </div>
          <div className=' md:hidden'>
              <MenuRoundedIcon  onClick={()=>{setLeftSidebarOpen(!leftSidebarOpen)}}/>
          </div>
      </div>
      {leftSidebarOpen && (
          <div className='flex w-full justify-center items-center md:hidden'>
            <div className='flex flex-col w-5/6 gap-2 py-2 fontMontserrat text-sm gap-5'>
              {/* <div className='cursor-pointer' onClick={backToDashboard}>Dashboard</div> */}
              <div className='cursor-pointer' onClick={callLogout}> <LogoutRoundedIcon fontSize='small'/> &nbsp; &nbsp; &nbsp; Logout</div>
            </div>
          </div>
      )}
    </div>
    </>
  )
}

export default Navbar