import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import logo from '../../public/images/logo.jpg'

function Navbar() {
  return (
    <div className='p-2 border-b border-b-white position-sticky top-0 flex justify-between'>
        <div>
            <img src={logo} alt="" height={50} width={170} />
        </div>
        <div className='p-2'>
            <form action="" className='border'>
                <button className='p-2'><FontAwesomeIcon icon={faSearch} className='mx-2'/>Search</button>
                <input type="text" name="" id="" className='text-white p-1 w-100' />
            </form>
        </div>
        <div className='flex justify-between p-2'>
            <button className='mx-3 hover:cursor-pointer hover:text-gray-400'>Login</button>
            <button className='mx-5 hover:cursor-pointer hover:text-gray-400'>Signup</button>
        </div>
    </div>
  )
}

export default Navbar
