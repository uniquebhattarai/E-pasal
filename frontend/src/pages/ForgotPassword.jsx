import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../slices/AuthSlice';
import { ApiConnector } from '../services/ApiConnector';
import { resetpasswordtoken } from '../services/Api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function ForgotPassword() {
    const [emailSent,setEmailSent]=useState(false);
    const [email,setEmail]=useState("");
    const {loading} = useSelector((state)=> state.auth);
    const dispatch =useDispatch();

    const submitHandler=(e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent));
    }

    const getPasswordResetToken=(email,setEmailSent)=>{
        return async(dispatch)=>{
            dispatch(setLoading(true));
            try {
                const response = await ApiConnector("POST",resetpasswordtoken.RESET_PASSWORD_TOKEN_API,{email})
                toast.success("Reset Email Sent");
                setEmailSent(true);
            } catch (error) {
                console.log(error);
            }
            dispatch(setLoading(false));
        }
    }
  return (
    <div>
        {
            loading?(
                <div>
                    loading .....
                </div>
            ):(
                <div>
                    <h1>
                        {
                            !emailSent?"Reset your password":"check your Email"
                        }
                    </h1>
                    <p>
                        {
                            !emailSent?"please enter your valid mail for password reset":`we have sent the reset email to ${email}`
                        }
                    </p>

                    <form onSubmit={submitHandler} >
                        {
                            !emailSent&&(
                                <label >
                                    <p>Email Address:</p>
                                    <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}  placeholder='Enter Your Email Address'/>
                                </label>
                            )
                        }
                        <button type='submit'>
                        {
                            !emailSent?"Reset Password":"Resend Email"
                        }
                    </button>
                    </form>

                    <div>
                        <Link to="/login">
                        <p>Back to Login</p>
                        </Link>
                    </div>
                    
                </div>
            )
        }
    </div>
  )
}

export default ForgotPassword