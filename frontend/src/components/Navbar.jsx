import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import logo from '../assets/images/logo.jpg'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const [search,setSearch]=useState("")
    const navigate=useNavigate()
    const handleSearch=(e)=>{
        e.preventDefault();
        if(!search.trim()) return;
        navigate(`search?query=${encodeURIComponent(search)}`,{replace:true})
    }
  return (
    <div className='p-2 border-b border-b-white position-sticky top-0 flex justify-between'>
        <div>
            <img src={logo} alt="logo" height={50} width={170} />
        </div>
        <div className='p-2'>
            <form onSubmit={handleSearch} className='border'>
                <button className='p-2'><FontAwesomeIcon icon={faSearch} className=''/></button>
                <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} id="search" placeholder='Search' className='text-white p-1 w-100 focus:outline-none' />
            </form>
        </div>
        <div className='flex justify-between p-2'>
            <Link to="/login" className='mx-3 p-2 hover:cursor-pointer hover:text-gray-400 hover:bg-gray-600'>Login</Link>
            <Link to='/signup' className='mx-3 p-2 hover:cursor-pointer hover:text-gray-400 hover:bg-gray-600'>Signup</Link>
        </div>
    </div>
  )
}

export default Navbar
