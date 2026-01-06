import React from 'react'
import { MoonLoader } from 'react-spinners'

function Uploading() {
    return (
        <div>
            <div className='mx-2 my-4 p-2 border w-[95%]'>

                <h3 className='m-1 text-xl font-bold'>Uploading Video....</h3>
                <p className='m-1'>Track your video uploading process.</p>
                <div className='mx-2 my-1 p-1 flex'>
                <MoonLoader
                    size={30}
                    color="#ffffff"
                />
                <p className='my-1 mx-3'>Uploading</p>
                </div>
            </div>
        </div>
    )
}

export default Uploading
