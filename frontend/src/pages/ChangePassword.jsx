import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import InputBox from '../components/InputBox';
import { api } from '../api/api';

function ChangePassword() {
     const {
        handleSubmit,
        register,
        watch,
        reset,
        formState: {
            errors
        }
    } = useForm()
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const password=watch("newPassword")

    const handleUpdatepassword=async(data)=>{
       try {
         const res=await api.post("/users/change-password",{newPassword:data.newPassword,oldPassword:data.oldPassword})
         if(res.status===200){
            setSuccess("password changed successfully")
            reset()
            setError("")
         }
       } catch (error) {
        console.log("error in update password",error)
        setError("please enter valid old password!!")
       }

    }
  return (
    <div className='p-3 mx-3 flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-2'>
        <div className='md:col-span-1 mb-4 md:mb-0 px-1 md:px-2'>
            <h3 className='font-bold text-lg text-white'>Password</h3>
            <p className='text-gray-300 text-sm mt-1'>Please enter your current password to change your password.</p>
        </div>
        <div className='border border-gray-700 md:col-span-2 rounded-lg p-4 bg-black/20'>
            <form onSubmit={handleSubmit(handleUpdatepassword)}>
                <div className='border-b border-gray-700 pb-4 mb-4 space-y-4'>
                    {error && <p className='text-red-400 bg-red-950/60 border border-red-700/60 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg'>{error}</p>}
                    {success && <p className='text-green-400 bg-green-950/60 border border-green-700/60 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg'>{success}</p>}
                    <InputBox
                        id="oldPassword"
                        type='password'
                        label="Old Password"
                        placeholder="Enter old Password"
                        register={register("oldPassword",{
                            required:"old password is required"
                        })}
                        error={errors.oldPassword?.message}
                        className="mb-4"
                        required={true}
                    />
                    <InputBox
                        id="newPassword"
                        type='password'
                        label="New Password"
                        placeholder="Enter New Password"
                        register={register("newPassword",{
                            required:"new password is required!!"
                        })}
                        error={errors.newPassword?.message}
                        className='mb-4'
                        required={true}
                    />
                    <InputBox
                        id="confirmPassword"
                        type='password'
                        label="Confirm Password"
                        placeholder="Enter confirm Password"
                        register={register("confirmPassword",{
                            required:"Confirm password is required!!",
                            validate:(value)=>value===password || "new password and confirm password must be same!!"
                        })}
                        error={errors.confirmPassword?.message}
                        className='mb-4'
                        required={true}
                    />
                </div>
                <div className='pt-2 flex justify-end'>
                    <button type='submit' className="w-full sm:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-6 py-2.5 rounded-full transition-colors duration-200 cursor-pointer text-sm">
                        <span>Update Password</span>
                    </button> 
                </div>
            </form>
        </div>
    </div>
  )
}

export default ChangePassword
