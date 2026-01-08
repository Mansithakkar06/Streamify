import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faEye, faHeart, faUser } from '@fortawesome/free-regular-svg-icons'
import { api } from '../api/api'
import Switch from 'react-switch'

function Dashboard() {
    const user = useSelector(state => state.user.userData)
    const [dashboardData, setDashboardData] = useState(null);
    const [videos, setVideos] = useState(null);
    const handleAddModal = () => {

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
        const fetchVideos=async()=>{
            try {
                const res=await api.get('/dashboard/getChannelVideos')
                setVideos(res.data.data)
            } catch (error) {
                console.log("error in fetching videos!!",error)
            }
        }
        fetchVideos()
    }, []);
    
    return (
        <div>
            <Navbar />
            <div className='p-3 m-3'>
                <div className='flex justify-between mx-3 mb-5'>
                    <div>
                        <h3 className='font-bold text-3xl'>Welcome Back, {user?.fullName}</h3>
                        <p className='text-gray-300 text-sm'>Seamless Video Management, Elevated Results.</p>
                    </div>
                    <div>
                        <button className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-4 py-2.5 rounded-full transition-colors duration-200 cursor-pointer" onClick={handleAddModal}>
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Upload Video</span>
                        </button>
                    </div>
                </div>
                <div className='grid grid-cols-3 gap-5 mx-3'>
                    <div className='border p-2'>
                        <p className='bg-gray-300 rounded-full px-1 py-0.5 m-3 max-w-fit'><FontAwesomeIcon icon={faEye} className='text-[#9e78f8] ' /></p>
                        <p className='mt-5 mx-3 text-md'>Total Views</p>
                        <h3 className='text-3xl font-bold mx-3 mb-2'>{dashboardData?.totalViews}</h3>
                    </div>
                    <div className='border p-2'>
                        <p className='bg-gray-300 rounded-full px-1 py-0.5 m-3 max-w-fit'><FontAwesomeIcon icon={faUser} className='text-[#9e78f8] ' /></p>
                        <p className='mt-5 mx-3 text-md'>Total subscribers</p>
                        <h3 className='text-3xl font-bold mx-3 mb-2'>{dashboardData?.totalSubscribers}</h3>
                    </div>
                    <div className='border p-2'>
                        <p className='bg-gray-300 rounded-full px-1 py-0.5 m-3 max-w-fit'><FontAwesomeIcon icon={faHeart} className='text-[#9e78f8] ' /></p>
                        <p className='mt-5 mx-3 text-md'>Total likes</p>
                        <h3 className='text-3xl font-bold mx-3 mb-2'>{dashboardData?.totalLikes}</h3>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto border mx-9">
                <table className="w-full text-sm">
                    <thead className="border-b border text-lg">
                        <tr>
                            <th className='py-3 px-4'>Status</th>
                            <th className='py-3 px-4'>Status</th>
                            <th className='py-3 px-4'>Uploaded</th>
                            <th className='py-3 px-4'>Rating</th>
                            <th className='py-3 px-4'>Date uploaded</th>
                            <th className='py-3 px-4'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            videos?.map((video)=>(
                                <tr key={video?._id} className='border border-b-[#ad8bfb]'>
                                    <td className='py-3 px-4'>
                                       <Switch checked={video?.isPublished}/> 
                                    </td>
                                    <td className='py-3 px-4'><p className={`border ${video?.isPublished?"border-green-500 text-green-500":"border-orange-500 text-orange-500"}  font-semibold w-fit py-1 px-3 rounded-2xl`}>{video?.isPublished?"Published":"Unpublished"}</p></td>
                                    <td className='py-3 px-4 flex gap-2'>
                                        <img src={video.owner.avatar.url} alt="avatar" className='rounded-full h-10 w-10 object-cover shadow-md' />
                                        <p className='p-2 font-semibold'>{video?.title}</p></td>
                                    <td className='py-3 px-4'>
                                       <div className='flex gap-2 justify-center'>
                                         <p className='text-green-800 bg-green-100 px-3 py-1 rounded-xl font-semibold'>{video.likesCount} {video.likesCount===1?"like":"likes"}</p>
                                        <p className='text-red-800 bg-red-100 px-3 py-1 rounded-xl font-semibold'>{video.dislikesCount} {video.dislikesCount===1?"like":"likes"}</p>
                                       </div>
                                    </td>
                                    <td className='py-3 px-4 text-center'>{video?.createdAt.slice(0,10)}</td>
                                    <td className='py-3 px-4'>
                                        <div className='flex gap-3 justify-center'>
                                            <FontAwesomeIcon icon={faEdit} className='text-lg'/>
                                            <FontAwesomeIcon icon={faTrash} className='text-lg'/>
                                            </div>
                                            </td>     
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default Dashboard
