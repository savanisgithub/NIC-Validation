import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



 
const Login = () => {
    const [values, seteValues] = useState({
        username: '',
        password: ''
    })
    
    const [error, setError] = useState('')
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault()
        axios.post('http://localhost:3000/auth/userlogin', values)
        .then(result => {
            if(result.data.loginStatus){
                navigate('/fileupload')
            }else {
                setError(result.data.Error)
            }
        })
        .catch(err => console.log(err))   
    }

    const handleForgotPassword = () => {
        axios.post('http://localhost:3000/auth/forgotpassword', { username: values.username})
        .then(result => {
            if (result.data.exists) {
                navigate('/resetpassword')
            } else {
                setError('Username does not exist')
            }
        })
        .catch(err => console.log(err))
    }



  return (
    <div className='d-flex justify-content-center vh-100 align-items-center  loginPage'>
        <div className='p-5 rounded w-50 loginForm'>
            <div className='text-danger'>
                {error && error}
            </div>
            <h1 className='py-3'>Login </h1>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="username"><strong>Username:</strong></label>
                    <input className='form-control rounded-0' type="text" name='Username' autoComplete='off' placeholder='Enter Username'
                    onChange={(e) => seteValues({...values, username : e.target.value})}/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="password"><strong>Password:</strong></label>
                    <input className='form-control rounded-0' type="password" name='password' placeholder='Enter Password'
                    onChange={(e) => seteValues({...values, password : e.target.value})}/>
                </div>
                <div className='btn1 text-center'>
                <button className='btn btn-success w-50  rounded-2 mb-2'>Log in</button>
                </div>

                <div className='py-3' id="formFooter">
                        <a className="underlineHover" href="#" onClick={handleForgotPassword}>Forgot Password?</a>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default Login;