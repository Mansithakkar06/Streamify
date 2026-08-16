import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { api } from '../api/api';
import { useSelector } from 'react-redux';
import PlayListView from '../components/PlayListView';

function ChannelPlaylist() {
  const user = useSelector(state => state.user.userData)
  const [playLists, setPlayLists] = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    const fetchPlaylists = async () => {
      try {
        const res = await api.get(`/playLists/getUserPlayLists/${user?._id}`)
        setPlayLists(res.data.data)
      } catch (error) {
        console.log("error in fetching playlists", error)
      }
    }
    fetchPlaylists()
  }, [user?._id]);

  const handleDeletePlaylist = (id) => {
    setPlayLists(prev => prev.filter(p => p._id !== id))
  }

  const handleUpdatePlaylist = (updated) => {
    setPlayLists(prev => prev.map(p => p._id === updated._id ? { ...p, name: updated.name } : p))
  }

  return (!playLists || playLists.length === 0) ? (
    <div>
      <div className='p-4 flex items-center m-auto justify-center'>
        <div className='m-auto'>
          <p className='text-3xl text-center m-2 '> <FontAwesomeIcon icon={faPlayCircle} /> </p>
          <h2 className='text-center text-xl'>No playlist created!!</h2>
          <p className='text-md w-100 text-center my-1'>There are no playlist created on this channel.</p>
        </div>
      </div>
    </div>
  ) :
  (
    <div className='p-3 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'>
      {
        playLists.map((playlist) => (
          <div key={playlist._id} className='w-full'>
            <PlayListView 
              playlist={playlist} 
              onDelete={handleDeletePlaylist}
              onUpdate={handleUpdatePlaylist}
            />
          </div>
        ))
      }
    </div>
  )
}

export default ChannelPlaylist
