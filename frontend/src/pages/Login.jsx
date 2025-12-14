import React, { useState } from 'react'
import logo from '../assets/images/logo.jpg'
import InputBox from '../components/InputBox'
import { useForm } from 'react-hook-form'
import { api } from '../api/api'
import { useNavigate } from 'react-router-dom'

function Login() {
    const { register,
        handleSubmit,
        formState: { errors } } = useForm()
    const navigate=useNavigate()
    const [error,setError]=useState("")

    const onSubmit = async (data) => {
        try {
            const res=await api.post("/users/login",data)
            if(res.status===200){
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
                    />
                    <button className='border w-full p-2 my-4 rounded-md hover:cursor-pointer hover:bg-gray-600 hover:text-black'>Login</button>
                </form>
            </div>
        </div >
    )
}

export default Login
