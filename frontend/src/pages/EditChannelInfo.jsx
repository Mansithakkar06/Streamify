import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import InputBox from '../components/InputBox'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../api/api'
import { useNavigate } from 'react-router-dom'
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
    const navigate=useNavigate()
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
                setTimeout(() => {
                    navigate(`/channel/${user?.username}/Videos`)
                }, 1000);
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
        <div className='p-1 m-2 grid grid-cols-3 gap-2'>
            <div className='px-2 mx-2'>
                <h3 className='font-bold text-lg'>Channel info</h3>
                <p className='text-gray-300'>Update your Channel details here.</p>
            </div>
            <div className='border col-span-2 rounded-lg'>
                <form onSubmit={handleSubmit(handleUpdateInfo)}>
                    <div className='border-b px-4 py-2 my-3'>
                        {error && <p className='text-red-700 bg-red-400 px-3 py-1 font-semibold m-1 rounded-lg'>{error}</p>}
                         {success && <p className='text-green-800 bg-green-500 px-3 py-1 font-semibold m-1 rounded-lg'>{success}</p>}
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
                    <div className='px-3 py-1 my-1 flex justify-end'>
                          <button type='submit' className="md:w-auto items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-5 py-2.5 rounded-full transition-colors duration-200 cursor-pointer">
                        <span>Save Changes</span>
                      </button> 
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default EditChannelInfo
