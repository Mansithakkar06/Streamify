import React from 'react'
import logo from '../assets/images/logo.jpg'
import InputBox from '../components/InputBox'

function Register() {
    return (
        <div className='p-5 border w-100 m-auto rounded-md'>
            <img src={logo} alt="logo" className='' />
            <form action="" className='px-4 py-2'>
                <InputBox id="username" label="Username" placeholder="Enter Username" />
                <InputBox type='email' id="email" label="Email" placeholder="Enter Email" />
                <InputBox id="fullName" label="Full Name" placeholder="Enter Full Name" />

            </form>
        </div>
    )
}

export default Register
