import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import logo from '../assets/images/logo.jpg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api/api'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../slices/userSlice.js'

function Navbar() {
    const user = useSelector(state => state.user.userData)
    const isLoggedin = useSelector(state => state.user.isLoggedin)
    const [search, setSearch] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const handleSearch = (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        navigate(`search?query=${encodeURIComponent(search)}`, { replace: true })
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
        <div className='p-2 border-b border-b-white position-sticky top-0 flex justify-between'>
            <div>
               <Link to='/'> <img src={logo} alt="logo" height={50} width={170} /></Link>
            </div>
            <div className='p-2'>
                <form onSubmit={handleSearch} className='border'>
                    <button className='p-2'><FontAwesomeIcon icon={faSearch} className='' /></button>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} id="search" placeholder='Search' className='text-white p-1 w-100 focus:outline-none' />
                </form>
            </div>
            {
                isLoggedin ? (
                    <div className='flex justify-between p-2'>
                        {
                            location.pathname !== "/dashboard" && (
                                <form onSubmit={logoutHandler} className='p-1'>
                                    <button className='mx-3 hover:cursor-pointer hover:text-gray-400 hover:bg-gray-600'>Logout</button>
                                </form>
                            )

                        }
                        <Link to={`/channel/${user.username}/Videos`} className='mx-3 hover:cursor-pointer hover:text-gray-400 hover:bg-gray-600'>
                            <img src={user.avatar.url} alt="avatar" className='rounded-full h-10 w-10 object-cover shadow-md' />
                        </Link>
                    </div>
                )
                    : (
                        <div className='flex justify-between p-2'>
                            <Link to="/login" className='mx-3 p-2 hover:cursor-pointer hover:text-gray-400 hover:bg-gray-600'>Login</Link>
                            <Link to='/signup' className='mx-3 p-2 hover:cursor-pointer hover:text-gray-400 hover:bg-gray-600'>Signup</Link>
                        </div>
                    )
            }
        </div>
    )
}

export default Navbar
