import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function ChannelPlaylist() {
  return (
    <div>
      <div className='p-4 flex items-center m-auto justify-center'>
        <div className='m-auto'>
          <p className='text-3xl text-center m-2 '> <FontAwesomeIcon icon={faPlayCircle} /> </p>
          <h2 className='text-center text-xl'>No playlist created!!</h2>
          <p className='text-md w-100 text-center my-1'>There are no playlist created on this channel.</p>
        </div>
      </div>
    </div>
  )
}

export default ChannelPlaylist
