import CircularProgress from '@mui/material/CircularProgress';

function LoginForm({ props }){

    

    const {
        onChangeHandler,
        handleOnKeyupEmail,
        stateFormData,
        errorValEmail,
        loginSubmit,
        isOtpSent,
        setOtp,
        onCheckChangeHandler,
        otpSubmit,
        loading
      } = props;
 
    return(
        <>
            <div className="bg-white pt-6 pb-8 mb-4">
                { !isOtpSent ? (
                        <div className="ifOtpNotSent">
                        <div className="mb-2 formInnerBox">
                            <label className="block text-[#8D93A1] text-xs font-normal mb-3" htmlFor="username">
                                Use the email address using which you applied for GDSC Leads Application
                            </label>
                            <input 
                            className="border-solid text-[#A3A7AC] font-normal border border-[#D7DCE2] rounded block w-full  py-3 px-5  focus:outline-none focus:bg-white" 
                            placeholder="example@email.com" 
                            type="text"
                            name="email"
                            value={stateFormData.email.value}
                            onChange={onChangeHandler}
                            onKeyUp={handleOnKeyupEmail}
                            required="required"
                            id="emailField"
                            />
                            {errorValEmail ? (
                                <p id="email-error" className="error-class text-red-500 block my-1 text-left  text-xs dark:text-red-500">
                                {errorValEmail}
                                </p>
                            ) : (
                                ""
                            )}
                        </div>
                        <div className='flex justify-start items-start formInnerBox'>
                            {/* <label className=' text-exp-darkBlue text-lg'>Full Name</label> */}
                            <input type="checkbox" minLength="3" maxLength="30" id='trust' placeholder='Enter your Full Name'
                            name='trust'
                            onChange={onCheckChangeHandler}
                            checked={stateFormData.trust.value}/>
                            &nbsp;
                            <label className=' text-exp-darkBlue text-xs  text-gray mb-4'> Trust this device</label>
                        </div>
                        <div className="flex items-center justify-between loginBtnDiv">
                            <button onClick={loginSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-normal  focus:outline-none focus:shadow-outline signIn flex gap-2 justify-center items-center"  >
                               {loading?(<CircularProgress className='text-white' size="18px" />):("")} Login 
                            </button>
                        </div>
                    </div>

                ) : (
                <div className="ifOtpSent">   
                    <p className="block text-[#8D93A1] text-sm font-normal mb-3">Enter the OTP, sent on your registered mail</p>
            
                    <input className="my-2 mr-2 border-solid text-black font-normal border border-[#D7DCE2] rounded h-10 w-10 text-center form-control rounded-lg" name="otp1" type="text" id="first" onKeyUp={(e) => { if (e.target.value != '' && e.code !== "Backspace") { e.target.nextElementSibling.focus() } }} onChange={onChangeHandler} maxLength={1} />
                    <input className="m-2 border-solid text-black font-normal border border-[#D7DCE2] rounded h-10 w-10 text-center form-control rounded-lg"  name="otp2" type="text" id="second" onKeyDown={(e) => { if (e.target.value === '' && e.code === 'Backspace') { e.target.previousElementSibling.value = ''; e.target.previousElementSibling.focus() } }} onKeyUp={(e) => { console.log(e); if (e.target.value != '' && e.code !== "Backspace") { e.target.nextElementSibling.focus() }; }} onChange={onChangeHandler} maxLength={1}  />
                    <input className="m-2 border-solid text-black font-normal border border-[#D7DCE2] rounded h-10 w-10 text-center form-control rounded-lg" name="otp3" type="text" id="third" onKeyDown={(e) => { if (e.target.value === '' && e.code === 'Backspace') { e.target.previousElementSibling.value = ''; e.target.previousElementSibling.focus() } }} onKeyUp={(e) => { if (e.target.value != '' && e.code !== "Backspace") { e.target.nextElementSibling.focus() } }} onChange={onChangeHandler} maxLength={1} />
                    <input className="m-2 border-solid text-black font-normal border border-[#D7DCE2] rounded h-10 w-10 text-center form-control rounded-lg" name="otp4" type="text" id="fourth" onKeyDown={(e) => { if (e.target.value === '' && e.code === 'Backspace') { e.target.previousElementSibling.value = ''; e.target.previousElementSibling.focus() } }} onKeyUp={(e) => { if (e.target.value != '' && e.code !== "Backspace") { e.target.nextElementSibling.focus() } }} onChange={onChangeHandler} maxLength={1} />
                    <input className="m-2 border-solid text-black font-normal border border-[#D7DCE2] rounded h-10 w-10 text-center form-control rounded-lg" name="otp5" type="text" id="fifth" onKeyDown={(e) => { if (e.target.value === '' && e.code === 'Backspace') { e.target.previousElementSibling.value = ''; e.target.previousElementSibling.focus() } }} onKeyUp={(e) => { if (e.target.value != '' && e.code !== "Backspace") { e.target.nextElementSibling.focus() } }} onChange={onChangeHandler} maxLength={1}/>
                    <input className="m-2 border-solid text-black font-normal border border-[#D7DCE2] rounded h-10 w-10 text-center form-control rounded-lg" name="otp6" type="text" id="sixth" onKeyDown={(e) => { if (e.target.value === '' && e.code === 'Backspace') { e.target.previousElementSibling.value = ''; e.target.previousElementSibling.focus() } }} onChange={onChangeHandler} maxLength={1}  />

                    <div className="w-full flex justify-center md:justify-start text-xs text-gray p-2">
                        <div>Did not Received the OTP? <span className="text-google-blue" onClick={loginSubmit} >Resend</span></div>
                    </div>
                    <div className="flex items-center justify-between mt-4 loginBtnDiv">
                        <button onClick={otpSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-normal  focus:outline-none focus:shadow-outline signIn flex gap-2 justify-center items-center" >
                        {loading?(<CircularProgress className='text-white' size="18px" />):("")} Login
                        </button>
                    </div>
                </div>

                )}
                
                
            </div>
            
        </>
    )
}

export default LoginForm;