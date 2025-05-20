import React from 'react'

const Loading = ({message = "Loading..."}) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-lg text-gray-600">{message}</div>
        </div>
    )
}

export default Loading