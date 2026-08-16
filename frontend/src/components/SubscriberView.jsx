import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/api';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserXmark } from '@fortawesome/free-solid-svg-icons';

function SubscriberView({ subscriber }) {
    const {username}=useParams()
    const user = useSelector(state => state.user.userData)
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const handleSubscription = async () => {
        try {
            const channelId = subscriber.subscriber._id;
            const res = await api.post(`/subscriptions/toggleSubscription/${channelId}`)
            if (res.status === 201) {
                setIsSubscribed(true)
            }
            else {
                setIsSubscribed(false)
            }
        } catch (error) {
            console.log("error in subscription", error)
        }

    }
    useEffect(() => {
        if (!subscriber?.subscriber?.username) return;
        const fetchChannel = async () => {
            try {
                const res = await api.get(`/users/channel/${subscriber.subscriber.username}`)
                setIsSubscribed(res.data.data.isSubscribed)
                setSubscribersCount(res.data.data.subscribersCount)
            } catch (error) {
                console.log("error in fetching channel stats", error)
            }
        }
        fetchChannel()
    }, [subscriber?.subscriber?.username]);
    return (
        <div className='w-full'>
            <div className='flex justify-between items-center py-2 px-3 md:px-6 gap-2'>
                <Link to={`/channel/${subscriber?.subscriber?.username}/Videos`} replace className='flex items-center flex-1 min-w-0'>
                    <img src={subscriber?.subscriber?.avatar?.url} alt="avatar" className='rounded-full h-10 w-10 md:h-16 md:w-16 object-cover shadow-md mt-1 shrink-0' />
                    <div className='p-1 mx-1 md:mx-2 min-w-0 flex-1'>
                        <p className='text-sm md:text-lg font-normal truncate'>{(subscriber?.subscriber?.username)?.replace(/^./, char => char.toUpperCase())}</p>
                        <p className='text-xs md:text-sm text-slate-400 truncate'>{subscribersCount} {subscribersCount === 1 ? "Subscriber" : "Subscribers"}</p>
                    </div>
                </Link>
                {(subscriber?.subscriber?.username !== user?.username) &&
                    <div className='p-1 md:p-4 ml-auto shrink-0'>
                        <button className='w-full md:w-auto flex justify-center items-center gap-1.5 md:gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-3 md:px-4 py-1.5 md:py-2.5 rounded-full transition-colors duration-200 cursor-pointer text-xs md:text-base' onClick={handleSubscription}>
                            <FontAwesomeIcon icon={isSubscribed ? faUserXmark : faUserPlus} className='mx-0.5 md:mx-1' /> 
                            <span>{isSubscribed ? "Unsubscribe" : "Subscribe"}</span>
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default SubscriberView
