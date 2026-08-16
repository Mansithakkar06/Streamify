import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import logo from '../assets/images/logo.jpg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api/api'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../slices/userSlice.js'

function Navbar({ toggleSidebar }) {
    const user = useSelector(state => state.user.userData)
    const isLoggedin = useSelector(state => state.user.isLoggedin)
    const [search, setSearch] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const handleSearch = (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        navigate(`/search?query=${encodeURIComponent(search)}`, { replace: true })
    }
    const logoutHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/users/logout');
            if (res.status === 200) {
                dispatch(logout())
                navigate("/")
            }
        } catch (error) {
            console.log("error in logout", error)
        }
    }

    return (
        <div className='p-2 sm:p-3 border-b border-b-white/20 sticky top-0 bg-[#242424] z-30 flex items-center justify-between gap-2 sm:gap-4'>
            <div className='flex items-center gap-2'>
                <button 
                    onClick={toggleSidebar}
                    className='p-2 text-white md:hidden hover:bg-gray-800 rounded-md'
                    aria-label="Toggle menu"
                >
                    <FontAwesomeIcon icon={faBars} className='text-lg' />
                </button>
                <Link to='/'> 
                    <img src={logo} alt="logo" className='h-8 sm:h-10 w-auto object-contain' />
                </Link>
            </div>
            
            <div className='flex-1 max-w-md mx-1 sm:mx-2'>
                <form onSubmit={handleSearch} className='flex border border-gray-600 rounded-md overflow-hidden bg-black/20'>
                    <button className='px-2 sm:px-3 py-1 text-gray-300 hover:text-white bg-transparent'>
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                    <input 
                        type="text" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        id="search" 
                        placeholder='Search' 
                        className='bg-transparent text-white p-1 w-full focus:outline-none text-sm sm:text-base' 
                    />
                </form>
            </div>

            {
                isLoggedin && user ? (
                    <div className='flex items-center gap-2'>
                        {
                            location.pathname !== "/dashboard" && (
                                <form onSubmit={logoutHandler} className='hidden md:block'>
                                    <button className='px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md hover:bg-gray-700 cursor-pointer'>
                                        Logout
                                    </button>
                                </form>
                            )
                        }
                        <Link to={`/channel/${user?.username}/Videos`}>
                            <img src={user?.avatar?.url} alt="avatar" className='rounded-full h-8 w-8 sm:h-10 sm:w-10 object-cover shadow-md' />
                        </Link>
                    </div>
                )
                    : (
                        <div className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm'>
                            <Link to="/login" className='px-2 sm:px-3 py-1 border rounded-md hover:bg-gray-700'>Login</Link>
                            <Link to='/signup' className='px-2 sm:px-3 py-1 bg-[#ae7aff] text-black font-medium rounded-md hover:bg-purple-400'>Signup</Link>
                        </div>
                    )
            }
        </div>
    )
}

export default Navbar
