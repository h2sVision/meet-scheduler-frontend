import React from 'react'

const CreateEvent = ({props}) => {
    const {submitHandler,
      onChangeHandler,
      stateFormData,page} = props;
  return (
    <>
    <div className='flex gap-1 flex-col w-full'>
       <label className='text-sm md:text-base text-dark-blue font-semibold'>Event Name:</label>
       <input className='border-2 border-border-gray text-sm md:text-base border-solid rounded px-2 py-1' type='text' value={stateFormData.eventName.value} onChange={onChangeHandler} name='eventName'/>
    </div>
    <div className='flex gap-1 flex-col w-full'>
       <label className='text-sm md:text-base text-dark-blue font-semibold'>Event URL:</label>
       {page==='editEvent'?(<input className='border-2 border-border-gray text-sm md:text-base border-solid rounded px-2 py-1' type='text' value={stateFormData.eventURL.value} name='eventURL' disabled/>):(<input className='border-2 border-border-gray text-sm md:text-base border-solid rounded px-2 py-1' type='text' value={stateFormData.eventURL.value} onChange={onChangeHandler} name='eventURL'/>)}
    </div>
    <div className='flex gap-1 flex-col w-full'>
       <label className='text-sm md:text-base text-dark-blue font-semibold'>Duration: [ in Minutes ]</label>
       <input className='border-2 border-border-gray text-sm md:text-base border-solid rounded px-2 py-1' type='number' value={stateFormData.duration.value} onChange={onChangeHandler} name='duration'/>
    </div>
    <div className='flex gap-1 flex-col w-full'>
       <label className='text-sm md:text-base text-dark-blue font-semibold'>Start</label>
       <input className='border-2 border-border-gray text-sm md:text-base border-solid rounded px-2 py-1' id='startDate'  min={new Date().toISOString().split('T')[0]} type='date' value={stateFormData.start.value.slice(0,10)}  onChange={onChangeHandler} name='start'/>
    </div>
    <div className='flex gap-1 flex-col w-full'>
       <label className='text-sm md:text-base text-dark-blue font-semibold'>End</label>
       <input className='border-2 border-border-gray text-sm md:text-base border-solid rounded px-2 py-1'  min={stateFormData.start.value.slice(0,10)} type='date' value={stateFormData.end.value.slice(0,10)} onChange={onChangeHandler} name='end'/>
    </div>
    <div className='w-full flex justify-center items-center mt-2'>
        {page==='editEvent'?(<button className='h2s-button' onClick={submitHandler}> Edit Event</button>):(<button className='h2s-button' onClick={submitHandler}>Create Event</button>)}
    </div>
    </>
  )
}

export default CreateEvent