import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Uploaded({ onclose }) {
    return (
        <div>
            <div className='mx-2 my-4 p-2 border w-[95%]'>

                <h3 className='m-1 text-xl font-bold'>Video Uploaded.</h3>
                <p className='m-1'>Track your video uploading process.</p>
                <div className='mx-2 my-1 p-1 flex'>
                    <FontAwesomeIcon icon={faCheckCircle} className='my-1 py-1 text-xl text-[#8B5CF6]' />
                    <p className='my-1 mx-3'>Uploaded Successfully</p>
                </div>
                </div>
                <div className='flex justify-end mx-4'>
                <button className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-black font-semibold px-6 py-2.5 rounded-full transition-colors duration-200 cursor-pointer" onClick={onclose}>Finish</button>
            </div>
        </div>
    )
}

export default Uploaded
