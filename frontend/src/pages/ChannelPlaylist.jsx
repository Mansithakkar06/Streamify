import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { api } from '../api/api';
import { useSelector } from 'react-redux';
import PlayListView from '../components/PlayListView';

function ChannelPlaylist() {
  const user=useSelector(state=>state.user.userData)
  const [playLists, setPlayLists] = useState(null);

  useEffect(() => {
    if(!user?._id)return;
    const fetchPlaylists=async()=>{
      try {
        const res=await api.get(`/playLists/getUserPlayLists/${user?._id}`)
        setPlayLists(res.data.data)
      } catch (error) {
        console.log("error in fetching playlists",error)
      }
    }
    fetchPlaylists()
  }, []);

   return (!playLists || playLists.length===0) ?(
    <div>
      <div className='p-4 flex items-center m-auto justify-center'>
        <div className='m-auto'>
          <p className='text-3xl text-center m-2 '> <FontAwesomeIcon icon={faPlayCircle} /> </p>
          <h2 className='text-center text-xl'>No playlist created!!</h2>
          <p className='text-md w-100 text-center my-1'>There are no playlist created on this channel.</p>
        </div>
      </div>
    </div>
  ):
  (
    <div className='p-4 grid grid-cols-2 gap-x-5 gap-y-1'>
      {
        playLists.map((playlist)=>(
          <div key={playlist._id}>
            <PlayListView playlist={playlist} />
          </div>
        ))
      }
    </div>
  )
}

export default ChannelPlaylist
