import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import InputBox from '../components/InputBox'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../api/api'
import { updateUserData } from '../slices/userSlice'

function EditChannelInfo() {
    const {
        handleSubmit,
        register,
        reset,
        formState: {
            errors
        }
    } = useForm()
    const user=useSelector(state=>state.user.userData)
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const dispatch=useDispatch()

    const handleUpdateInfo=async(data)=>{
       try {
         if(data.fullName==='' && data.email===''){
             setError("All fields cant be empty!!")
             return;
         }
         else{
             setError("")
             const res=await api.patch("/users/updateAccountDetails",data)
             if(res.status===200){
                dispatch(updateUserData({
                    fullName:res.data.data.fullName,
                    email:res.data.data.email,
                }))
                setSuccess("Details updated successfully")
             }
 
         }
       } catch (error) {
        console.log("error in update details!!",error)
       }
    }
    
    useEffect(() => {
        reset({
            fullName:user.fullName,
            email:user.email
        })
    }, []);
    return (
        <div className='p-3 mx-3 flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-2'>
            <div className='md:col-span-1 mb-4 md:mb-0 px-1 md:px-2'>
                <h3 className='font-bold text-lg text-white'>Channel info</h3>
                <p className='text-gray-300 text-sm mt-1'>Update your Channel details here.</p>
            </div>
            <div className='border border-gray-700 md:col-span-2 rounded-lg p-4 bg-black/20'>
                <form onSubmit={handleSubmit(handleUpdateInfo)}>
                    <div className='border-b border-gray-700 pb-4 mb-4 space-y-4'>
                        {error && <p className='text-red-400 bg-red-950/60 border border-red-700/60 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg'>{error}</p>}
                        {success && <p className='text-green-400 bg-green-950/60 border border-green-700/60 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg'>{success}</p>}
                        <InputBox
                            id="fullName"
                            label="Full Name"
                            placeholder="Enter full name"
                            register={register("fullName")}
                            error={errors.fullName?.message}
                            className="mb-4"
                        />
                        <InputBox
                            id="email"
                            type='email'
                            label="Email"
                            placeholder="Enter email"
                            register={register("email")}
                            error={errors.email?.message}
                            className='mb-2'
                        />
                    </div>
                    <div className='pt-2 flex justify-end'>
                        <button type='submit' className="w-full sm:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-6 py-2.5 rounded-full transition-colors duration-200 cursor-pointer text-sm">
                            <span>Save Changes</span>
                        </button> 
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditChannelInfo
