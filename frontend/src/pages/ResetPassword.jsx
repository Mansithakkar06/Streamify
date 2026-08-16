import React, { useState } from 'react'
import logo from '../assets/images/logo.jpg'
import InputBox from '../components/InputBox'
import { useForm } from 'react-hook-form'
import { api } from '../api/api'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

function ResetPassword() {
    const { token } = useParams()
    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)
    const [isResetDone, setIsResetDone] = useState(false)

    const newPasswordValue = watch("newPassword", "")

    const onSubmit = async (data) => {
        setError("")
        setSuccess("")
        setLoading(true)
        try {
            const res = await api.post(`/users/reset-password/${token}`, {
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            })
            if (res.status === 200) {
                setSuccess("Password has been reset successfully!")
                setIsResetDone(true)
            }
        } catch (err) {
            console.error("Error in reset password:", err)
            setError(err?.response?.data?.message || "Failed to reset password. Token may be invalid or expired.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex justify-center items-center'>
            <div className="p-5 w-full max-w-sm m-auto rounded-md shadow-lg border border-gray-700">
                <img src={logo} alt="logo" className='m-auto mb-2' />
                <h2 className='text-xl text-center font-semibold mb-3'>Reset Password</h2>

                {error && <p className='text-red-500 text-sm text-center mb-2'>{error}</p>}
                {success && <p className='text-green-500 text-sm text-center mb-2'>{success}</p>}

                {isResetDone ? (
                    <div className='text-center my-4 p-3 border border-green-600 rounded-md bg-green-950/30'>
                        <FontAwesomeIcon icon={faCheckCircle} className='text-green-400 text-4xl mb-2' />
                        <p className='text-gray-200 text-sm mb-3'>Your password has been updated. You can now login with your new password.</p>
                        <button 
                            onClick={() => navigate('/login')}
                            className='bg-[#ae7aff] text-black font-semibold px-4 py-2 rounded-md hover:bg-purple-400 w-full'
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className='px-2 py-1'>
                        <InputBox
                            id="newPassword"
                            type='password'
                            label="New Password"
                            placeholder="Enter New Password"
                            register={register("newPassword", {
                                required: "New password is required!!",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long!!"
                                }
                            })}
                            error={errors.newPassword?.message}
                            required={true}
                        />

                        <InputBox
                            id="confirmPassword"
                            type='password'
                            label="Confirm Password"
                            placeholder="Confirm New Password"
                            register={register("confirmPassword", {
                                required: "Please confirm your password!!",
                                validate: value => value === newPasswordValue || "Passwords do not match!!"
                            })}
                            error={errors.confirmPassword?.message}
                            required={true}
                        />

                        <button 
                            disabled={loading}
                            className='border w-full p-2 my-4 rounded-md hover:cursor-pointer hover:bg-gray-600 hover:text-black font-medium disabled:opacity-50'
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                {!isResetDone && (
                    <div className='flex justify-between items-center mt-3 px-2'>
                        <Link to='/login' className='text-red-400 text-sm hover:underline flex items-center gap-1'>
                            <FontAwesomeIcon icon={faArrowLeft} /> Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResetPassword
