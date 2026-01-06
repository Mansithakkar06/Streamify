import React from 'react'

function TextAreaBox({ id, label, required, placeholder, register, error, children }) {
    return (
        <div className='my-1'>
            <label htmlFor={id}> {label} <span className=''>{!required ? "" : "*"}</span></label>
            <textarea
                id={id}
                placeholder={placeholder}
                {...register}
                className='border py-1 px-2 rounded-md w-full'
                rows={5}
            >
                {children}
            </textarea>
            {
                error && (
                    <p className='text-red-500 text-sm'>{error}</p>
                )
            }
        </div>
    )
}

export default TextAreaBox
