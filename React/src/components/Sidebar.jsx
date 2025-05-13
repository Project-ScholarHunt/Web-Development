import React from 'react'
import { Link } from 'react-router'

const Sidebar = ({ isMobileMenuOpen }) => {
    return (
        <div>
            <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white shadow-md md:h-full`}>
                <div className="p-4 hidden md:block">
                    <h2 className="text-xl font-bold">Admin Portal</h2>
                </div>
                <nav className="mt-2 md:mt-6">
                    <ul className='px-2'>
                        <li className="hover:bg-gray-200 flex items-center">
                            <i class="ri-file-line text-xl"></i>
                            <Link to="/" className="block px-4 py-2 text-gray-700">
                                Applicants
                            </Link>
                        </li>
                        <li className="bg-blue-100 hover:bg-blue-200 flex items-center">
                            <i class="ri-graduation-cap-line text-xl"></i>
                            <Link to="/scholarships" className="block px-4 py-2 text-blue-700">
                                Scholarships
                            </Link>
                        </li>
                        <li className="hover:bg-gray-200 flex items-center">
                            <i class="ri-user-3-line text-xl"></i>
                            <Link to="/users" className="block px-4 py-2 text-gray-700">
                                Users
                            </Link>
                        </li>
                        <li className="hover:bg-gray-200 flex items-center">
                            <i class="ri-settings-2-line text-xl"></i>
                            <Link to="/settings" className="block px-4 py-2 text-gray-700">
                                Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    )
}

export default Sidebar