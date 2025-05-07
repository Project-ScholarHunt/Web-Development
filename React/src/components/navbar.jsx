import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="absolute w-full px-5 top-5 z-50">
            <nav className="relative bg-gray-200 py-4 px-5 rounded-lg shadow-md w-full">
                <div className="flex flex-row items-center justify-between border w-full">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <div className="w-16 h-10 border border-gray-500 flex items-center justify-center">
                                <div className="w-10 h-6 border border-gray-500 flex items-center justify-center">
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full px-10 py-2 rounded-md border border-gray-300 bg-white"
                            />
                            <span className="absolute left-3 top-2.5">✉️</span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center">
                        <Link to="/" className="text-black hover:text-gray-600">home</Link>
                        <Link to="/scholarships" className="text-black hover:text-gray-600">Scholarships</Link>
                        <Link to="/my-scholarships" className="text-black hover:text-gray-600">My Scholarships</Link>
                        <Link to="/register" className="bg-gray-600 text-white px-4 py-1 rounded">signup</Link>
                    </div>
                </div>
            </nav>
        </div>


    );
};

export default Navbar;
