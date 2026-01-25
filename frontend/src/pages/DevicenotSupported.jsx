import React from 'react'

function DevicenotSupported() {
  return (
     <div className="h-screen flex items-center justify-center text-white px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold mb-3">
          Desktop View Only 💻
        </h1>
        <p className="text-gray-300">
          This project is currently optimized for laptop screens.
          Mobile responsiveness is under development.
        </p>
      </div>
    </div>
  )
}

export default DevicenotSupported
