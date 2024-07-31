import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    const [values, setValues] = useState({
        username: '',
        newPassword: ''
    })

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const handleReset = (event) => {
        event.preventDefault()
        axios.post('http://localhost:3000/auth/resetpassword', values)
        .then(result => {
            if(result.data.success){
                setSuccess('Password reset successfully')
                setTimeout(() => navigate('/'), 3000)
            } else {
                setError('Failed to reset password')
            }
        })
        .catch(err => console.log(err))
    }

  return (
    <div className='d-flex justify-content-center vh-100 align-items-center'>
        <div className='p-5 rounded w-50'>
            <div className='text-danger'>
                {error && error}
            </div>
            <div className='text-success'>
                {success && success}
            </div>
            <h1 className='py-3'>Reset Password</h1>
            <form onSubmit={handleReset}>
                <div className='mb-3'>
                    <label htmlFor="username"><strong>Username:</strong></label>
                    <input className='form-control rounded-0' type="text" name='username' placeholder='Enter Username'
                    onChange={(e) => setValues({...values, username: e.target.value})}/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="newPassword"><strong>New Password:</strong></label>
                    <input className='form-control rounded-0' type="password" name='newPassword' placeholder='Enter New Password'
                    onChange={(e) => setValues({...values, newPassword: e.target.value})}/>
                </div>
                <div className='btn1 text-center'>
                <button className='btn btn-success w-50 rounded-2 mb-2'>Reset Password</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default ResetPassword;
