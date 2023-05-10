import React,{useState} from 'react'
import { useRouter } from 'next/router'
import { Search } from '@mui/icons-material';

const Table = ({tableHeaders, tableContent,tableName, remove, resend, resechdule, activeDate,genrateOTP, switchMod, eventName, download, search}) => {
    const router = useRouter();
    const [selectDate, setSelectDate] = useState('');
  return (
    <>
    <div className='w-full flex justify-between items-center pb-4'>
        <div className='flex gap-3'>
            {tableName === 'conferencesbyEventURL' &&(<><input id='searchValue' className='border-2 border-solid border-gray px-2 rounded'/><button className='h2s-button' onClick={()=>search(document.getElementById('searchValue').value, 1)}>Search</button></>)}
            {tableName === 'participantsByEventURL' &&(<><input id='searchValue' className='border-2 border-solid border-gray px-2 rounded'/><button className='h2s-button' onClick={()=>search(document.getElementById('searchValue').value, 1)}>Search</button></>)}
        </div>
        {tableName === 'conferencesbyEventURL' &&(<div className='flex gap-2 '><div><input id='filterDate' onChange={(e)=>{setSelectDate(e.target.value)}} className="border-2 border-solid border-black rounded px-2" type='date'/></div>{selectDate!='' ?(<div className='h2s-button' onClick={()=>{download(new Date(document.getElementById('filterDate').value))}}>Download</div>):(<div className='h2s-button disabled' disabled>Download</div>)}</div>)}
    </div>
    <table className='light-shadow rounded-xl w-full'>
        <thead className='bg-google-blue text-white rounded-t-xl'>
            <tr>
            {tableHeaders?.map((tableHeader, key)=>(
                <td className={` text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin  ${key===0 ? ('rounded-tl-xl'):(key === tableHeaders?.length-1 ? ('rounded-tr-xl'):(''))}`} key={key}>{tableHeader}</td>
            ))}
            </tr>
        </thead>
        <tbody>
            {tableName === 'conferencesbyEventURL' &&(
                <>
                {tableContent?.map((row, key)=>(
                    <tr key={key}>
                        <td  className='text-xs md:text-base p-2 md:p-4 font-thin'>{key+1}</td>
                        <td  className='text-xs md:text-base p-2 md:p-4 font-thin'>{row.fullName}</td>
                        <td  className='text-xs md:text-base p-2 md:p-4 font-thin'>{row.email}</td>
                        <td  className='text-xs md:text-base p-2 md:p-4 font-thin'>{new Date(row.start).toString()}</td>
                        <td  className='text-xs md:text-base p-2 md:p-4 font-thin'>{row.moderatorEmail}</td>
                        <td  className='text-xs md:text-base p-2 md:p-4 font-thin'>{row.link}</td>
                        <td  className='text-xs md:text-base p-2 md:p-4 font-thin'><button className='h2s-button bg-blue' onClick={()=>resend(row.email, row.moderatorEmail)}>Resend</button></td>
                        <td  className='text-xs md:text-base p-2 md:p-4 font-thin'><button className='h2s-button bg-blue' onClick={()=>{remove(row)}}>Remove</button></td>
                        <td  className='text-xs md:text-base p-2 md:p-4 font-thin'><button className='h2s-button bg-blue' onClick={()=>{switchMod(row)}}>Switch</button></td>
                    </tr>
                ))}
                </>
            )}
            {tableName === 'moderatorsByEventURL' &&(
                <>
                {tableContent?.map((row, key)=>{
                    let conferncesToday =0;
                    for(let i =0; i<row.conferences.length; i++){
                        if(new Date(row.conferences[i].start).getDate() === new Date().getDate()){
                            conferncesToday++;
                        }
                    }
                    return (
                    <tr key={key}>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{key+1}</td>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{row.fullName}</td>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{row.email}</td>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin text-google-blue cursor-pointer' onClick={()=>{router.push(`${eventName}/${row.email}/availability`)}}> View Availability</td>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{row?.totalSlots}</td>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{row.conferences.length}</td>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{conferncesToday}</td>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'><button className='h2s-button bg-blue' onClick={()=>remove(row._id)}>Remove</button></td>
                    </tr>
                    )
                })}
                </>
            )}
            {tableName === 'participantsByEventURL' &&(
                <>
                {tableContent?.map((row, key)=>(
                    <tr key={key} id={row.email}>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{key+1}</td>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{row.fullName}</td>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{row.email}</td>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{row.scheduledConference? ('Scheduled'):('Not Scheduled')}</td>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'><button className='h2s-button bg-blue' onClick={()=>remove(row.email)}>Remove</button></td>
                        <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'><button className='h2s-button bg-blue' onClick={()=>genrateOTP(row.email)}>Genrate</button></td>
                    </tr>
                ))}
                </>
            )}
            {tableName === 'calendarBookedConferences' &&(
                <>
                {tableContent?.map((row, key)=>{
                    console.log('row',row);
                    if(new Date(row.start).toDateString()=== new Date(activeDate).toDateString()){
                    return(
                            <tr key={key}>
                                <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin border-2 border-solid border-border-gray'><span className='text-blue'>{new Date(row.start).toLocaleTimeString()}</span></td>
                                <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin border-2 border-solid border-border-gray text-blue'>{row.email}</td>
                            </tr>
                    )}
                })}
                </>
            )}
            {tableName === 'moderatorEventConferences' &&(
                <>
                {tableContent?.map((row, key)=>(
                    <tr key={key}>
                    <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{key+1}</td>
                    <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{row.fullName}</td>
                    <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{row.email}</td>
                    <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{new Date(row.start).toLocaleString()}</td>
                    <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'>{row.link}</td>
                    <td  className='text-xs md:text-base whiteSpaceNoWrap p-2 md:p-4 font-thin'><button className='h2s-button bg-blue' onClick={()=>resend(row.email, row.moderatorEmail)}>Resend</button></td>
                    </tr>
                ))}
                </>
            )}
        </tbody>
    </table>
    </>
  )
}

export default Table