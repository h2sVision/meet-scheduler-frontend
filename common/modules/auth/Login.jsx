import React from 'react';

const Login = ({props}) => {
    const {loginSubmit,
            onChangeHandler,
            onCheckChangeHandler,
            handleOnKeyupEmail,
            stateFormData,
            errorValEmail} = props;

  return (
    <>
    <div className='requestInputContainer'>
        <label className=' text-exp-darkBlue text-lg'>Email</label>
        <input type="text" minLength="3" maxLength="30" id='email' placeholder='Enter your Email'
                name='email'
              value={stateFormData.email.value}
              onChange={onChangeHandler}
              onKeyUp={handleOnKeyupEmail} />
        {errorValEmail ? (
            <p id="email-error" className="error-class text-exp-red block mt-1 text-left ">
            {errorValEmail}
            </p>
        ) : (
            ""
        )}
    </div>
    <div className='flex justify-start items-center'>
        {/* <label className=' text-exp-darkBlue text-lg'>Full Name</label> */}
        <input type="checkbox" minLength="3" maxLength="30" id='trust' placeholder='Enter your Full Name'
        name='trust'
        onChange={onCheckChangeHandler}
        checked={stateFormData.trust.value}/>
        &nbsp;
        <label className=' text-exp-darkBlue text-xs font-bold'> Trust this device</label>
    </div>
    <div className='w-100 flex justify-center items-center mt-2'>
        <button className='bg-exp-blue' onClick={loginSubmit}>Login</button>
    </div>
    </>
  )
}

export default Login