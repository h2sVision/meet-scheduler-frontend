import React from 'react';


const ModeratorNavbar = ({ page}) => {
  return (
    <>
    <div className='flex w-full justify-center items-center py-4'>
      <div className=' w-11/12 py-2 px-5 flex justify-between items-center'>
            <div className='flex gap-5'>
                <div className={page.active==='conferences'? ('h2s-button flex text-center items-center'): ('bg-white light-shadow px-8 py-2 text-purple font-thin rounded-md cursor-pointer')} onClick={()=>page.setActive('conferences')}>Conferences</div>
                <div className={page.active==='availability'? ('h2s-button flex text-center items-center'): ('bg-white light-shadow px-8 py-2 text-purple font-thin rounded-md cursor-pointer')}  onClick={()=>page.setActive('availability')}> My Availability </div>
            </div>
      </div>
    </div>
    </>
  )
}

export default ModeratorNavbar