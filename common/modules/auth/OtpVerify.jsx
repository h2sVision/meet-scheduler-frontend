import React from 'react'

const OtpVerfiy = ({props}) => {
    const {otpSubmit,
      onChangeHandler,
      stateFormData,} = props;
  return (
    <>
    <div className='requestInputContainer'>
        <label className=' text-exp-darkBlue text-lg w-full block'>OTP</label>
        {/* <input type="text" minLength="3" maxLength="30" placeholder='Enter your Email' id='otp' /> */}
        <div className='flex'>
          <input className="otpInput flex justify-center items-center m-2" name="otp1" type="text" id="first" onKeyUp={(e) => { if (e.target.value != '' && e.code !== "Backspace") { e.target.nextElementSibling.focus() } }} onChange={onChangeHandler} maxLength={1} />
          <input className="otpInput flex justify-center items-center m-2" name="otp2" type="text" id="second" onKeyDown={(e) => { if (e.target.value === '' && e.code === 'Backspace') { e.target.previousElementSibling.value = ''; e.target.previousElementSibling.focus() } }} onKeyUp={(e) => { console.log(e); if (e.target.value != '' && e.code !== "Backspace") { e.target.nextElementSibling.focus() }; }} onChange={onChangeHandler} maxLength={1} />
          <input className="otpInput flex justify-center items-center m-2" name="otp3" type="text" id="third" onKeyDown={(e) => { if (e.target.value === '' && e.code === 'Backspace') { e.target.previousElementSibling.value = ''; e.target.previousElementSibling.focus() } }} onKeyUp={(e) => { if (e.target.value != '' && e.code !== "Backspace") { e.target.nextElementSibling.focus() } }} onChange={onChangeHandler} maxLength={1} />
          <input className="otpInput flex justify-center items-center m-2" name="otp4" type="text" id="fourth" onKeyDown={(e) => { if (e.target.value === '' && e.code === 'Backspace') { e.target.previousElementSibling.value = ''; e.target.previousElementSibling.focus() } }} onKeyUp={(e) => { if (e.target.value != '' && e.code !== "Backspace") { e.target.nextElementSibling.focus() } }} onChange={onChangeHandler} maxLength={1} />
          <input className="otpInput flex justify-center items-center m-2" name="otp5" type="text" id="fifth" onKeyDown={(e) => { if (e.target.value === '' && e.code === 'Backspace') { e.target.previousElementSibling.value = ''; e.target.previousElementSibling.focus() } }} onKeyUp={(e) => { if (e.target.value != '' && e.code !== "Backspace") { e.target.nextElementSibling.focus() } }} onChange={onChangeHandler} maxLength={1} />
          <input className="otpInput flex justify-center items-center m-2" name="otp6" type="text" id="sixth" onKeyDown={(e) => { if (e.target.value === '' && e.code === 'Backspace') { e.target.previousElementSibling.value = ''; e.target.previousElementSibling.focus() } }} onChange={onChangeHandler} maxLength={1} />
        </div>
    </div>
    <div className='text-exp-blue text-xs'><span className='cursor-pointer'>Resend OTP</span></div>
    <div className='w-100 flex justify-center items-center mt-2'>
        <button className='bg-exp-blue' onClick={otpSubmit}>Verify OTP</button>
    </div>
    </>
  )
}

export default OtpVerfiy