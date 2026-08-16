import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faEye, faHeart, faUser } from '@fortawesome/free-regular-svg-icons'
import { api } from '../api/api'
import Switch from 'react-switch'
import Modal from '../components/Modal'
import DeleteVideo from './DeleteVideo'
import AddVideo from './AddVideo'
import Uploading from './Uploading'
import Uploaded from './Uploaded'
import EditVideo from './EditVideo'

function Dashboard() {
    const user = useSelector(state => state.user.userData)
    const [dashboardData, setDashboardData] = useState(null);
    const [videos, setVideos] = useState(null);
    const [id, setId] = useState(null);
    const [modalType, setModalType] = useState(null);

    const handleChange = async (id) => {
        try {
            await api.patch(`/videos/togglePublish/${id}`);
        } catch (error) {
            console.log("error in toggle publish", error)
        }
    }

    const handleAddModal = () => setModalType("add")
    const handleUploading = () => setModalType("uploading")
    const closeModal = () => setModalType(null)
    const handleUploaded = () => setModalType("uploaded")

    const handleAfterUploaded = () => {
        closeModal()
    }
    const handleDelete = (id) => {
        setModalType("delete")
        setId(id)
    }
    const handleEdit=(id)=>{
        setModalType("edit")
        setId(id)
    }

    useEffect(() => {
        const fetchdashboardData = async () => {
            try {
                const res = await api.get("/dashboard/getChannelStats")
                setDashboardData(res.data.data)
            } catch (error) {
                console.log("error in fetching dashboard data!!", error)
            }
        }
        fetchdashboardData()
    }, []);
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await api.get('/dashboard/getChannelVideos')
                setVideos(res.data.data)
            } catch (error) {
                console.log("error in fetching videos!!", error)
            }
        }
        fetchVideos()
    }, []);

    return (
        <div>
            <div className='p-2 sm:p-4 m-1 sm:m-3'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mx-2 sm:mx-3 mb-5'>
                    <div>
                        <h3 className='font-bold text-xl sm:text-3xl'>Welcome Back, {user?.fullName}</h3>
                        <p className='text-gray-300 text-xs sm:text-sm'>Seamless Video Management, Elevated Results.</p>
                    </div>
                    <div>
                        <button className="w-full sm:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-4 py-2 sm:py-2.5 rounded-full transition-colors duration-200 cursor-pointer text-sm" onClick={handleAddModal}>
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Upload Video</span>
                        </button>
                    </div>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mx-2 sm:mx-3'>
                    <div className='border border-gray-700 rounded-md p-2 bg-black/20'>
                        <p className='bg-gray-300 rounded-full px-2 py-1 m-2 max-w-fit'><FontAwesomeIcon icon={faEye} className='text-[#9e78f8]' /></p>
                        <p className='mt-3 mx-2 text-sm text-gray-300'>Total Views</p>
                        <h3 className='text-2xl sm:text-3xl font-bold mx-2 mb-2'>{dashboardData?.totalViews || 0}</h3>
                    </div>
                    <div className='border border-gray-700 rounded-md p-2 bg-black/20'>
                        <p className='bg-gray-300 rounded-full px-2 py-1 m-2 max-w-fit'><FontAwesomeIcon icon={faUser} className='text-[#9e78f8]' /></p>
                        <p className='mt-3 mx-2 text-sm text-gray-300'>Total subscribers</p>
                        <h3 className='text-2xl sm:text-3xl font-bold mx-2 mb-2'>{dashboardData?.totalSubscribers || 0}</h3>
                    </div>
                    <div className='border border-gray-700 rounded-md p-2 bg-black/20'>
                        <p className='bg-gray-300 rounded-full px-2 py-1 m-2 max-w-fit'><FontAwesomeIcon icon={faHeart} className='text-[#9e78f8]' /></p>
                        <p className='mt-3 mx-2 text-sm text-gray-300'>Total likes</p>
                        <h3 className='text-2xl sm:text-3xl font-bold mx-2 mb-2'>{dashboardData?.totalLikes || 0}</h3>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto border border-gray-700 mx-2 sm:mx-6 my-4 rounded-md bg-black/10">
                <table className="w-full text-xs sm:text-sm text-left border-collapse min-w-[650px]">
                    <thead className="border-b border-gray-700 text-xs text-gray-400 uppercase bg-black/40">
                        <tr>
                            <th className='py-3 px-3 sm:px-4 text-center'>Toggle</th>
                            <th className='py-3 px-3 sm:px-4'>Status</th>
                            <th className='py-3 px-3 sm:px-4'>Video</th>
                            <th className='py-3 px-3 sm:px-4 text-center'>Rating</th>
                            <th className='py-3 px-3 sm:px-4 text-center'>Date Uploaded</th>
                            <th className='py-3 px-3 sm:px-4 text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-800'>
                        {
                            videos?.map((video) => (
                                <tr key={video?._id} className='hover:bg-slate-900/40 transition-colors'>
                                    <td className='py-3 px-3 sm:px-4 text-center align-middle'>
                                        <Switch 
                                            checked={video?.isPublished} 
                                            onChange={() => handleChange(video._id)}
                                            height={20}
                                            width={40}
                                        />
                                    </td>
                                    <td className='py-3 px-3 sm:px-4 align-middle'>
                                        <span className={`inline-block border ${video?.isPublished ? "border-green-500/80 text-green-400 bg-green-950/30" : "border-orange-500/80 text-orange-400 bg-orange-950/30"} text-[11px] sm:text-xs font-medium py-0.5 px-2.5 rounded-full`}>
                                            {video?.isPublished ? "Published" : "Unpublished"}
                                        </span>
                                    </td>
                                    <td className='py-3 px-3 sm:px-4 align-middle'>
                                        <div className='flex items-center gap-2.5 min-w-0'>
                                            <img src={video.thumbnail.url} alt="thumbnail" className='rounded-md h-10 w-16 object-cover shadow-sm shrink-0' />
                                            <p className='font-medium text-white truncate max-w-[120px] sm:max-w-[220px]'>{video?.title}</p>
                                        </div>
                                    </td>
                                    <td className='py-3 px-3 sm:px-4 align-middle text-center'>
                                        <div className='flex items-center gap-1.5 justify-center text-[11px] sm:text-xs'>
                                            <span className='text-green-300 bg-green-950/60 border border-green-700/50 px-2 py-0.5 rounded-md font-semibold'>{video.likesCount || 0} {video.likesCount === 1 ? "like" : "likes"}</span>
                                            <span className='text-red-300 bg-red-950/60 border border-red-700/50 px-2 py-0.5 rounded-md font-semibold'>{video.dislikesCount || 0} {video.dislikesCount === 1 ? "dislike" : "dislikes"}</span>
                                        </div>
                                    </td>
                                    <td className='py-3 px-3 sm:px-4 text-center align-middle text-gray-300 whitespace-nowrap'>{video?.createdAt?.slice(0, 10)}</td>
                                    <td className='py-3 px-3 sm:px-4 align-middle text-center'>
                                        <div className='flex gap-2 justify-center items-center'>
                                            <button className='p-1.5 hover:bg-slate-800 rounded-md text-gray-300 hover:text-purple-400 transition cursor-pointer' title="Edit Video" onClick={() => handleEdit(video._id)}>
                                                <FontAwesomeIcon icon={faEdit} className='text-sm sm:text-base' />
                                            </button>
                                            <button className='p-1.5 hover:bg-slate-800 rounded-md text-gray-300 hover:text-red-400 transition cursor-pointer' title="Delete Video" onClick={() => handleDelete(video._id)}>
                                                <FontAwesomeIcon icon={faTrash} className='text-sm sm:text-base' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <Modal isOpen={modalType !== null} onClose={closeModal} title={modalType === "add" ? "Upload Video" : modalType === "edit" ? "Edit Video" : ""}>
                {modalType === 'add' && <AddVideo onUploading={handleUploading} onUploaded={handleUploaded} />}
                {modalType === "uploading" && <Uploading />}
                {modalType === "uploaded" && <Uploaded onclose={handleAfterUploaded} />}
                {modalType === "delete" && <DeleteVideo id={id} onClose={closeModal} videos={videos} setVideos={setVideos} />}
                {modalType === 'edit' && <EditVideo onUploading={handleUploading} onUploaded={handleUploaded} id={id} />}
            </Modal>
        </div>
    )
}

export default Dashboard
