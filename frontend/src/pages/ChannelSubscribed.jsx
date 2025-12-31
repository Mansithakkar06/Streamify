import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function ChannelSubscribed() {
  return (
    <div>
       <div className='p-4 flex items-center m-auto justify-center'>
        <div className='m-auto'>
          <p className='text-3xl text-center m-2 '> <FontAwesomeIcon icon={faUsers} /> </p>
          <h2 className='text-center text-xl'>No Subscriptions!!</h2>
          <p className='text-md w-100 text-center my-1'>This channel has yet to subscribe a new channel.</p>
        </div>
      </div>
    </div>
  )
}

export default ChannelSubscribed
