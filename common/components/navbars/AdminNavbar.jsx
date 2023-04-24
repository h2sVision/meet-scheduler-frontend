import React from 'react';

const AdminNavbar = ({ page}) => {
  return (
    <>
    <div className='flex w-full justify-center items-center py-4'>
      <div className='bg-white w-full md:w-11/12 py-2 px-2 md:px-5 flex justify-between items-center secondNav'>
            <div className='flex gap-5'>
                <div className={page.active==='conferences'? ('h2s-button whiteSpaceNoWrap text-xs px-8 md:text-base flex text-center items-center'): ('light-shadow text-xs md:text-base whiteSpaceNoWrap px-8 py-1 md:py-2 text-purple font-thin rounded-md cursor-pointer')} onClick={()=>page.setActive('conferences')}>Conferences</div>
                <div className={page.active==='manageModerators'? ('h2s-button whiteSpaceNoWrap text-xs px-8 md:text-base flex text-center items-center'): ('light-shadow text-xs md:text-base whiteSpaceNoWrap px-8 py-1 md:py-2 text-purple font-thin rounded-md cursor-pointer')}  onClick={()=>page.setActive('manageModerators')}> Manage Moderators </div>
                <div className={page.active==='manageParticipants'? ('h2s-button whiteSpaceNoWrap text-xs px-8 md:text-base flex text-center items-center'): ('light-shadow text-xs md:text-base whiteSpaceNoWrap px-8 py-1 md:py-2 text-purple font-thin rounded-md cursor-pointer')}  onClick={()=>page.setActive('manageParticipants')}> Manage participants</div>
                <div className={page.active==='editEvent'? ('h2s-button whiteSpaceNoWrap text-xs px-8 md:text-base flex text-center items-center'): ('light-shadow text-xs md:text-base whiteSpaceNoWrap px-8 py-1 md:py-2 text-purple font-thin rounded-md cursor-pointer')}  onClick={()=>page.setActive('editEvent')}> Edit Event</div>
            </div>
      </div>
    </div>
    </>
  )
}

export default AdminNavbar