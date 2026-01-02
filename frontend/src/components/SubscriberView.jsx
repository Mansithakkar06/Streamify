import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/api';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserXmark } from '@fortawesome/free-solid-svg-icons';

function SubscriberView({ subscriber }) {
    const user=useSelector(state=>state.user.userData)
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriberData, setSubscriberData] = useState(null);
    console.log(subscriber)
    const handleSubscription = async () => {
            try {
                const channelId = subscriber.subscriber._id;
                const res = await api.post(`/subscriptions/toggleSubscription/${channelId}`)
                if(res.status===201){
                    setIsSubscribed(true)
                }
                else{
                    setIsSubscribed(false)
                }
            } catch (error) {
                console.log("error in subscription", error)
            }
    
        }
    useEffect(() => {
        const fetchChannel=async()=>{
            const res=await api.get(`/users/channel/${subscriber.subscriber.username}`)
            setSubscriberData(res.data.data)
            setIsSubscribed(res.data.data.isSubscribed)
            setSubscribersCount(res.data.data.subscribersCount)
        }
        fetchChannel()
    }, []);
    console.log(subscriberData)
    console.log(isSubscribed)
    return (
        <div>
            <div className='flex justify-between py-2 px-6'>
                <Link to={`/channel/${subscriber?.subscriber?.username}`}>
                    <div className='flex'>
                        <img src={subscriber?.subscriber?.avatar?.url} alt="avatar" className='rounded-full h-16 w-16 object-cover shadow-md mt-1' />
                        <div className='p-1 mx-2'>
                            <p className='text-lg'>{(subscriber?.subscriber?.username)?.replace(/^./, char => char.toUpperCase())}</p>
                            <p className='text-sm text-slate-400'>{subscribersCount} {subscribersCount === 1 ? "Subscriber" : "Subscribers"}</p>
                        </div>
                    </div>
                </Link>
                {subscriber?.subscriber?.username !== user?.username &&
                    <div className='p-4'>
                        <button className='w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-4 py-2.5 rounded-full transition-colors duration-200 cursor-pointer' onClick={handleSubscription}><FontAwesomeIcon icon={isSubscribed ? faUserXmark : faUserPlus} className='mx-1' /> {isSubscribed ? "Unsubscribe" : "Subscribe"}</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default SubscriberView
