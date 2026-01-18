import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/api';
import { FadeLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUpload, faDashboard, faPlayCircle, faPlus, faUserPlus, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import VideoCardView from '../components/VideoCardView';
import ChannelVideos from './ChannelVideos';
import Playlist from './ChannelPlaylist';
import ChannelPlaylist from './ChannelPlaylist';
import ChannelSubscribers from './ChannelSubscribers';
import { useDispatch, useSelector } from 'react-redux';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import Modal from '../components/Modal';
import AddVideo from './AddVideo';
import Uploading from './Uploading';
import Uploaded from './Uploaded';
import EditChannelInfo from './EditChannelInfo';
import ChangePassword from './ChangePassword';
import { updateUserData } from '../slices/userSlice';

function Channel() {
  const { username, activeTab } = useParams()
  const user = useSelector(state => state.user.userData)
  const [channel, setChannel] = useState(null)
  const [isActive, setIsActive] = useState("Videos")
  const [videos, setVideos] = useState([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const tabs = ["Videos", "Playlist", "Subscribers"]
  const editTabs = ["Channel information", "Change Password"]
  const [isEditable, setIsEditable] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleSubscription = async () => {
    try {
      const channelId = channel._id;
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

  const handleAddModal = () => setModalType("add")
  const handleUploading = () => setModalType("uploading")
  const closeModal = () => setModalType(null)
  const handleUploaded = () => setModalType("uploaded")

  const handleAfterUploaded = () => {
    closeModal()
  }

  const handleEdit = () => {
    setIsEditable(true)
    setIsActive("Channel information")
  }

  const handleViewChannel = () => {
    setIsActive("Videos")
    setIsEditable(false)
  }

  const handleUpdateAvatar = async (e) => {
    try {
      const formdata = new FormData();
      formdata.append("avatar", e.target.files[0])
      setLoading(true)
      const res = await api.patch("/users/updateAvtar", formdata)
      if (res.status === 200) {
        dispatch(updateUserData({
          avatar: {
            url: res.data.data.user.avatar.url,
            public_id: res.data.data.user.avatar.public_id
          }
        }))
        setLoading(false)
      }

    } catch (error) {
      console.log("error in update avatar", error)
    }
  }

  const handleUpdateCoverImage = async (e) => {
    try {
      const formdata = new FormData();
      formdata.append("coverImage", e.target.files[0])
      setLoading(true)
      const res = await api.patch("/users/updateCoverImage", formdata)
      if (res.status === 200) {
        dispatch(updateUserData({
          coverImage: {
            url: res.data.data.user.coverImage.url,
            public_id: res.data.data.user.coverImage.public_id
          }
        }))
        setLoading(false)

      }

    } catch (error) {
      console.log("error in update cover image", error)
    }
  }

  useEffect(() => {
    setIsActive(activeTab)
  }, [activeTab]);

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await api.get(`/users/channel/${username}`)
      setChannel(res.data.data)
      setIsSubscribed(res.data.data.isSubscribed)
    }
    fetchChannel()
  }, [username, isSubscribed, user, channel]);

  useEffect(() => {
    console.log("Modal Type:", modalType);
  }, [modalType]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await api.get("/videos/getAllVideos", {
        params: {
          userId: channel?._id
        }
      })
      setVideos(res.data.data)
    }
    fetchVideos()

  }, [channel,videos]);
  if (!channel || loading) {
    return (
      <div className='p-4 flex items-center m-auto justify-center h-screen w-full'>
        <div className='m-auto items-center'>
          <FadeLoader
            color="#f3faff"
            height={11}
            width={9}
            radius={3}
          />
          <p>Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="w-full h-32 md:h-52 overflow-hidden relative">
          <img
            src={channel.coverImage.url ? channel.coverImage.url : "https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=2670&auto=format&fit=crop"}
            alt="cover image"
            className="w-full h-full object-cover"
          />
          {isEditable && <label htmlFor='coverImage' className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          bg-black/10 text-white p-2 rounded-lg cursor-pointer hover:bg-black/20 transition'>
            <FontAwesomeIcon icon={faCloudUpload} className='text-[#8B5CF6] text-xl' />
          </label>
          }
          <input
            type="file"
            id="coverImage"
            hidden
            accept="image/*"
            onChange={handleUpdateCoverImage}
          />
        </div>

        <div className="px-4 md:px-12 pb-4">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <div className="relative -mt-6 md:-mt-10 z-10 shrink-0">
              <img
                src={channel.avatar.url}
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-3 shadow-lg"
              />
              {isEditable && <label htmlFor='avatar' className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/10 text-white p-2 rounded-lg cursor-pointer
          hover:bg-black/20 transition'>
                <FontAwesomeIcon icon={faCloudUpload} className='text-[#8B5CF6] text-xl' />
              </label>}
              <input
                type="file"
                id="avatar"
                hidden
                accept="image/*"
                onChange={handleUpdateAvatar}
              />
            </div>

            <div className="grow flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 md:gap-0 md:pt-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  {channel.fullName}
                </h1>
                <div className="flex flex-col text-gray-400 text-sm md:text-base">
                  <span className="font-medium text-gray-400">@{channel.username}</span>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <span>{channel.subscribersCount} {channel.subscribersCount === 1 ? "Subscriber" : "Subscribers"}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span>{channel.channelsSubscribedToCount} Subscribed</span>
                  </div>
                </div>
              </div>

              <div className="md:ml-auto w-full md:w-auto">
                {
                  username === user.username ? (
                    !isEditable ?
                      <div className='flex justify-between gap-3'>
                        <button className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-4 py-2.5 rounded-full transition-colors duration-200 cursor-pointer" onClick={handleAddModal}>
                          <FontAwesomeIcon icon={faPlus} />
                          <span>Add Video</span>
                        </button>
                        <button className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-4 py-2.5 rounded-full transition-colors duration-200 cursor-pointer" onClick={handleEdit}>
                          <FontAwesomeIcon icon={faEdit} />
                          <span>Edit</span>
                        </button>
                        <Link to="/dashboard" className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-4 py-2.5 rounded-full transition-colors duration-200 cursor-pointer" onClick={handleEdit}>
                          <FontAwesomeIcon icon={faDashboard} />
                          <span>Dashboard</span>
                        </Link>
                      </div> :
                      <div className='flex justify-between gap-3'>
                        <button className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-6 py-2.5 rounded-full transition-colors duration-200 cursor-pointer" onClick={handleViewChannel}>
                          <span>View Channel</span>
                        </button>
                      </div>
                  ) :
                    (
                      <button className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-6 py-2.5 rounded-full transition-colors duration-200 cursor-pointer" onClick={handleSubscription}>
                        <FontAwesomeIcon icon={isSubscribed ? faUserXmark : faUserPlus} />
                        <span>{isSubscribed ? "Unsubscribe" : "Subscribe"}</span>
                      </button>
                    )
                }
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className='p-3 mx-3 '>
        <ul className='flex justify-between mb-2 text-center text-gray-400 '>
          {
            isEditable ?
              editTabs.map((tab) => (
                <div key={tab}>
                  <button className='cursor-pointer' onClick={() => setIsActive(tab)}>
                    <li className={`text-center shrink-0 px-32 py-2 ${isActive === tab ? "bg-slate-100 border-b-2" : ""}`}>{tab}</li>
                  </button>
                </div>
              ))
              :
              tabs.map((tab) => (
                <div key={tab}>
                  <button className='cursor-pointer' onClick={() => setIsActive(tab)}>
                    <li className={`text-center shrink-0 px-32 py-2 ${isActive === tab ? "bg-slate-100 border-b-2" : ""}`}>{tab}</li>
                  </button>
                </div>
              ))
          }
        </ul>
        <hr />
      </div>
      {
        (
          () => {
            switch (isActive) {
              case "Videos":
                return <ChannelVideos videos={videos} />
              case "Playlist":
                return <ChannelPlaylist />
              case "Subscribers":
                return <ChannelSubscribers channel={channel} isSubscribed={isSubscribed} />
              case "Channel information":
                return <EditChannelInfo />
              case "Change Password":
                return <ChangePassword />
            }
          }

        )()
      }
      <Modal isOpen={modalType !== null} onClose={closeModal} title={modalType === "add" ? "Upload Video" : modalType === "edit" ? "Edit Video" : ""}>
        {modalType === 'add' && <AddVideo onUploading={handleUploading} onUploaded={handleUploaded} />}
        {modalType === "uploading" && <Uploading />}
        {modalType === "uploaded" && <Uploaded onclose={handleAfterUploaded} />}
      </Modal>
    </div>

  );

}

export default Channel
