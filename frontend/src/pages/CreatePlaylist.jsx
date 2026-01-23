import React from 'react'
import InputBox from '../components/InputBox'
import { useForm } from 'react-hook-form'
import { api } from '../api/api'

function CreatePlaylist({onclose}) {
  const { register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm()

  const playListHandler=async(data)=>{
    try {
      const res=await api.post("/playLists/createPlayList",data)
      if(res.status===201){
        onclose()
      }
      
    } catch (error) {
      console.log("error in creating playlist",error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(playListHandler)}>
        <InputBox
          placeholder="enter playlist name"
          label="PlayList Name"
          id="name"
          required={true}
          register={register("name", {
            required: "PlayList name is required!!"
          })}
          error={errors.name?.message}
        />
        <div className='flex justify-center m-2 p-2'>
          <button className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-10 py-2.5 rounded-full transition-colors duration-200 cursor-pointer">Create</button>
        </div>
      </form>
    </div>
  )
}

export default CreatePlaylist
