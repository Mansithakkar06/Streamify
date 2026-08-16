import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { api } from '../api/api';
import SubscriberView from '../components/SubscriberView';

function ChannelSubscribers({channel,isSubscribed}) {
  const [subscribers, setSubscribers] = useState(null);
  const [subscribersLength, setsubscribersLength] = useState(0);

  useEffect(() => {
    const fetchSubscribers=async()=>{
      const res=await api.get(`/subscriptions/getChannelSubscribers/${channel._id}`)
      setSubscribers(res.data.data)
      setsubscribersLength(res.data.data.length)
    }
    fetchSubscribers()
  }, [channel,isSubscribed]);
  
  // console.log(subscribers.length)
  return subscribersLength===0 ? (
    <div>
       <div className='p-4 flex items-center m-auto justify-center'>
        <div className='m-auto'>
          <p className='text-3xl text-center m-2 '> <FontAwesomeIcon icon={faUsers} /> </p>
          <h2 className='text-center text-xl'>No Subscriptions!!</h2>
          <p className='text-md w-100 text-center my-1'>This channel has yet to subscribe a new channel.</p>
        </div>
      </div>
    </div>
  ):
  (
    <div>
      {
        subscribers.map((subscriber)=>(
          <div key={subscriber._id}>
            <SubscriberView subscriber={subscriber} />
          </div>
        ))
      }
    </div>
  )
}

export default ChannelSubscribers
