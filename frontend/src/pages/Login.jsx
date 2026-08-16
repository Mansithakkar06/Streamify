import React, { useState } from 'react'
import logo from '../assets/images/logo.jpg'
import InputBox from '../components/InputBox'
import { useForm } from 'react-hook-form'
import { api } from '../api/api'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../slices/userSlice.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

function Login() {
    const { register,
        handleSubmit,
        formState: { errors } } = useForm()
    const navigate=useNavigate()
    const [error,setError]=useState("")
    const dispatch=useDispatch()
    const [success,setSuccess]=useState("")

    const onSubmit = async (data) => {
        try {
            const res=await api.post("/users/login",data)
            if(res.status===200){
                const userdata=res.data.data
                dispatch(login(userdata))
                setSuccess("Login successfull")
                navigate('/')
            }
        } catch (error) {
            console.log("error in login",error)
            if(error.response.status!==200){
                setError("Invalid Credentials!!")
            }
        }
    }

    return (
        <div className='min-h-screen flex justify-center items-center'>
            <div className="p-5 w-full max-w-sm m-auto rounded-md shadow-lg">
                <img src={logo} alt="logo" className='m-auto' />
                <p className='text-green-800'>{success&&success}</p>
                <form onSubmit={handleSubmit(onSubmit)} className='px-4 py-2'>
                    {error && <p className='text-red-600'>{error}</p>}
                    <InputBox
                        id="username"
                        label="Username/Email"
                        placeholder="Enter Username or Email"
                        register={register("username", {
                            required: "username or email is required!!"
                        })}
                        error={errors.username?.message}
                        required={true}
                    />

                    <InputBox
                        id="password"
                        type='password'
                        label="Password"
                        placeholder="Enter Password"
                        register={register("password", {
                            required: "password is required!!"
                        })}
                        error={errors.password?.message}
                        required={true}
                    />
                    <button className='border w-full p-2 my-4 rounded-md hover:cursor-pointer hover:bg-gray-600 hover:text-black'>Login</button>
                    <div className='flex justify-between items-center text-sm mb-3'>
                        <div>
                            <Link to='/'><p className='text-red-400'><FontAwesomeIcon icon={faArrowLeft} className='mr-1' />Back</p></Link>
                        </div>
                        <div>
                            <Link to='/forgot-password' className='text-purple-400 hover:underline'>
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                    <div className='text-center text-sm mt-2'>
                        <p>Don't have an account?<span className='ml-1 text-blue-500'><Link to='/signup'>signup</Link></span></p>
                    </div>
                    
                </form>
            </div>
        </div >
    )
}

export default Login
