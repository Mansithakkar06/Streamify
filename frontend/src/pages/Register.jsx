import React, { useState } from 'react'
import logo from '../assets/images/logo.jpg'
import InputBox from '../components/InputBox'
import { useForm } from 'react-hook-form'
import { api } from '../api/api'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../slices/userSlice.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

function Register() {
    const {
        register,
        handleSubmit,
        watch,
        formState: {
            errors
        }
    } = useForm()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [success, setSuccess] = useState("")
    const password = watch("password")
    const handleRegister = async (data) => {
        try {
            const formData = new FormData()
            formData.append("username", data.username)
            formData.append("fullName", data.fullName)
            formData.append("email", data.email)
            formData.append("password", data.password)
            formData.append("avatar", data.avatar[0])
            formData.append("coverImage", data.coverImage[0])

            const res = await api.post("/users/register", formData)
            if (res.status === 201) {
                dispatch(signup(res.data.data))
                setSuccess("Registration Successfull")
                navigate('/')
            }
        } catch (error) {
            console.log("error in register", error)
        }
    }
    return (
        <div className='min-h-screen flex justify-center items-center'>
            <div className="p-5 w-full max-w-sm m-auto rounded-md shadow-lg">
                <img src={logo} alt="logo" className='m-auto' />
                <p className='text-green-800'>{success && success}</p>
                <form onSubmit={handleSubmit(handleRegister)} className='px-4 py-2'>
                    <InputBox
                        id="username"
                        label="Username"
                        placeholder="Enter Username"
                        register={register("username", {
                            required: "username or email is required!!"
                        })}
                        error={errors.username?.message}
                        required={true}
                    />
                    <InputBox
                        id="fullName"
                        label="Full Name"
                        placeholder="Enter Full Name"
                        register={register("fullName", {
                            required: "Full Name is required!!"
                        })}
                        error={errors.fullName?.message}
                        required={true}
                    />
                    <InputBox
                        type='email'
                        id="email"
                        label="Email"
                        placeholder="Enter Email"
                        register={register("email", {
                            required: "email is required!!"
                        })}
                        error={errors.email?.message}
                        required={true}
                    />
                    <InputBox
                        type='password'
                        id="password"
                        label="Password"
                        placeholder="Enter Password"
                        register={register("password", {
                            required: "Password is required!!"
                        })}
                        error={errors.password?.message}
                        required={true}
                    />
                    <InputBox
                        type='password'
                        id="confirm_password"
                        label="Confirm Password"
                        placeholder="Enter Confirm Password"
                        register={register("confirm_password", {
                            required: "Confirm Password is required!!",
                            validate: (value) =>
                                value === password || "Password and Confirm password must be same!!"

                        })}
                        error={errors.confirm_password?.message}
                        required={true}
                    />
                    <InputBox
                        type='file'
                        id="avatar"
                        label="Avatar"
                        register={register("avatar", {
                            required: "Avatar is required!!"
                        })}
                        error={errors.avatar?.message}
                        required={true}
                    />
                    <InputBox
                        type='file'
                        id="coverImage"
                        label="Cover Image"
                        register={register("coverImage")}
                        error={errors.coverImage?.message}
                        required={false}
                    />
                    <button className='border w-full p-2 my-4 rounded-md hover:cursor-pointer hover:bg-gray-600 hover:text-black'>Register</button>
                    <div className='flex justify-between'>
                        <div>
                            <Link to='/'><p className='text-red-400'><FontAwesomeIcon icon={faArrowLeft} />Back</p></Link>
                        </div>
                        <div>
                            <p>Already have an account?<span className='mx-1 text-blue-500'><Link to='/login'>login</Link></span></p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
