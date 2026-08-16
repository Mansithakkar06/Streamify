import React, { useState } from 'react'
import logo from '../assets/images/logo.jpg'
import InputBox from '../components/InputBox'
import { useForm } from 'react-hook-form'
import { api } from '../api/api'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faKey } from '@fortawesome/free-solid-svg-icons'

function ForgotPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [resetLink, setResetLink] = useState("")
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        setError("")
        setSuccess("")
        setResetLink("")
        setLoading(true)
        try {
            const res = await api.post("/users/forgot-password", { email: data.email })
            if (res.status === 200) {
                const token = res.data?.data?.resetToken
                setSuccess("Password reset token generated successfully!")
                if (token) {
                    setResetLink(`/reset-password/${token}`)
                }
            }
        } catch (err) {
            console.error("Error in forgot password:", err)
            setError(err?.response?.data?.message || "Failed to process request. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex justify-center items-center'>
            <div className="p-5 w-full max-w-sm m-auto rounded-md shadow-lg border border-gray-700">
                <img src={logo} alt="logo" className='m-auto mb-2' />
                <h2 className='text-xl text-center font-semibold mb-3'>Forgot Password</h2>
                <p className='text-sm text-gray-300 text-center mb-4'>
                    Enter your registered email or username to receive a password reset link.
                </p>

                {error && <p className='text-red-500 text-sm text-center mb-2'>{error}</p>}
                {success && <p className='text-green-500 text-sm text-center mb-2'>{success}</p>}

                {resetLink ? (
                    <div className='text-center my-4 p-3 border border-green-600 rounded-md bg-green-950/30'>
                        <p className='text-sm text-green-300 mb-2'>Click below to reset your password:</p>
                        <Link 
                            to={resetLink} 
                            className='inline-block bg-[#ae7aff] text-black font-semibold px-4 py-2 rounded-md hover:bg-purple-400'
                        >
                            <FontAwesomeIcon icon={faKey} className='mr-2' />
                            Reset Password Now
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className='px-2 py-1'>
                        <InputBox
                            id="email"
                            label="Username or Email"
                            placeholder="Enter Username or Email"
                            register={register("email", {
                                required: "Username or Email is required!!"
                            })}
                            error={errors.email?.message}
                            required={true}
                        />

                        <button 
                            disabled={loading}
                            className='border w-full p-2 my-4 rounded-md hover:cursor-pointer hover:bg-gray-600 hover:text-black font-medium disabled:opacity-50'
                        >
                            {loading ? "Processing..." : "Generate Reset Link"}
                        </button>
                    </form>
                )}

                <div className='flex justify-between items-center mt-3 px-2'>
                    <Link to='/login' className='text-red-400 text-sm hover:underline flex items-center gap-1'>
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
