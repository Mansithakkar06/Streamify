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
    <div className='p-1 m-2 grid grid-cols-3 gap-2'>
            <div className='px-2 mx-2'>
                <h3 className='font-bold text-lg'>Password</h3>
                <p className='text-gray-300'>Please enter your current password to change your password.</p>
            </div>
            <div className='border col-span-2 rounded-lg'>
                <form onSubmit={handleSubmit(handleUpdatepassword)}>
                    <div className='border-b px-4 py-2 my-3'>
                        {error && <p className='text-red-700 bg-red-400 px-3 py-1 font-semibold m-1 rounded-lg'>{error}</p>}
                         {success && <p className='text-green-800 bg-green-500 px-3 py-1 font-semibold m-1 rounded-lg'>{success}</p>}
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
                    <div className='px-3 py-1 my-1 flex justify-end'>
                          <button type='submit' className="md:w-auto items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-5 py-2.5 rounded-full transition-colors duration-200 cursor-pointer">
                        <span>Update Password</span>
                      </button> 
                    </div>
                    
                </form>
            </div>
        </div>
  )
}

export default ChangePassword
