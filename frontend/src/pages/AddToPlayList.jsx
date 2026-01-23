import React, { useEffect, useState } from 'react'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { api } from '../api/api';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

function AddToPlayList({ onCreate,videoid,onclose }) {
    const [playLists, setPlayLists] = useState(null);
    const user = useSelector(state => state.user.userData)
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState(null);

    const handleAdd =async (data) => {
        if(data.playlistId===null){
            setError("please select any playlist!!!")
            return
        }
        else{
            setError(null)
            try {
                const res=await api.patch(`/playLists/addVideoToPlayList/${videoid}/${data.playlistId}`)
                if(res.status===200){
                    onclose()
                }
            } catch (error) {
                console.log("error in creating playlist",error)
                setError("video already added in playlist!!!")
                return
            }
        }
    }
    useEffect(() => {
        const fetchPlayLists = async () => {
            try {
                const res = await api.get(`/playLists/getUserPlayLists/${user._id}`)
                setPlayLists(res.data.data)
            } catch (error) {
                console.log("error in fetching playlists", error)
            }
        }
        fetchPlayLists()
    }, []);
    return (
        <div>
            <form onSubmit={handleSubmit(handleAdd)}>
                {error && <p className='text-red-700 bg-red-300 font-bold px-3 py-1 m-2 rounded-lg'>{error}</p>}
                {
                    playLists && (
                        <div>
                            {
                                playLists?.map((playlist) => (
                                    <div key={playlist._id} className='mx-2 flex justify-between my-1 py-1'>
                                        <label className='text-lg' htmlFor='playlistId'>{playlist?.name?.replace(/^./, char => char.toUpperCase())}</label>
                                        <input
                                            type="radio"
                                            value={playlist._id}
                                            id="playlistId"
                                            {...register("playlistId")}
                                        />
                                    </div>
                                ))
                            }
                            <div className='flex justify-center m-2 p-2'>
                                <button type='submit' className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-10 py-2.5 rounded-full transition-colors duration-200 cursor-pointer">Add</button>
                            </div>
                        </div>
                    )
                }

            </form>



            <hr className='my-2' />
            <div className='flex justify-center'>
                <button onClick={() => onCreate()} className='bg-gray-900 py-1 px-2 rounded-sm hover:cursor-pointer'><FontAwesomeIcon icon={faPlus} /> Create PlayList</button>
            </div>
        </div >
    )
}

export default AddToPlayList
