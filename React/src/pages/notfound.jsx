import React from 'react'
import NotFound from '../assets/img/notfound.jpg'
import { Link } from 'react-router'

const notfound = () => {
    return (
        <div className='min-h-screen container flex flex-col items-center justify-center mx-auto'>
            <img
                src={NotFound}
                alt="Image by Freepik"
                className='w-64 object-contain -translate-y-10'
            />
            <div className='text-center'>
                <h1 className='font-bold text-4xl text-blue-500'>404 Not Found</h1>
                <p className='text-gray-700 mb-5'>The page you're looking for is not found</p>
                <Link to="/" className='rounded transition-all hover:cursor-pointer border border-blue-500 bg-white hover:bg-blue-500 p-2 hover:text-white'>Back to Dashboard</Link>
            </div>
        </div>
    )
}

export default notfound