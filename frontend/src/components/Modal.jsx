import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center' onClick={onClose}>
      <div className="w-[90%] bg-black/95 max-w-lg shadow-lg border"
        onClick={(e) => e.stopPropagation()}>
        {title &&
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-400 text-xl"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        }
        <div className='p-4'>
          {children}
        </div>
      </div >
    </div>
  )
}

export default Modal
