import React from 'react'

function InputBox({id,label,type="text",placeholder,register,error,required,className=""}) {
  return (
    <div className={`my-1 ${className}`}>
      <label htmlFor={id}> {label} <span className=''>{!required?"":"*"}</span></label>
        <input type={type}
         id={id} 
         placeholder={placeholder} 
         {...register} 
         className='border py-1 px-2 rounded-md w-full' />
        {
            error && (
                <p className='text-red-500 text-sm'>{error}</p>
            )
        }
    </div>
  )
}

export default InputBox
