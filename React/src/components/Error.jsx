import React from 'react'

const Error = ({error}) => {
    return (
        <div className="min-h-screen flex flex-col gap-10 items-center justify-center bg-gray-100">
            <i class="ri-close-circle-line text-6xl font-normal text-red-600"></i>
            <div className="text-xl">{error}</div>
        </div>
    )
}

export default Error