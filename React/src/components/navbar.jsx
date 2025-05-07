import React from 'react';
import { Link } from 'react-router-dom';
import NavbarPNG from '../assets/img/navbar.png'

const Navbar = () => {
    return (
        <div className="absolute w-full px-5 top-7 z-50">
            <nav className="relative bg-blue-200 py-4 px-5 rounded-lg shadow-md w-full">
                <div className="flex flex-row items-center justify-between w-full">

                    <div className="flex items-center">
                        <Link to="/" className="flex items-center h-[4vh]">
                            <img
                                src={NavbarPNG}
                                alt="logo scholarhunt"
                                className="max-h-[50px]"
                            />
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-8">
                        <div className="relative bg-">
                            <input
                                type="text"
                                placeholder="Search scholarship"
                                className="w-full px-10 py-1 rounded-full border border-gray-300 bg-white"
                            />
                            <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                            {/* <span className="absolute left-3 top-2.5">✉️</span> */}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-10">
                        <Link to="/" className="text-black hover:text-gray-600 font-medium">home</Link>
                        <Link to="/scholarships" className="text-black hover:text-gray-600 font-medium">Scholarships</Link>
                        <Link to="/my-scholarships" className="text-black hover:text-gray-600 font-medium">My Scholarships</Link>
                        <Link to="/register" className="bg-gray-600 text-white px-4 py-1 rounded font-medium tracking-wider">signup</Link>
                    </div>
                </div>
            </nav>
        </div>


    );
};

export default Navbar;
