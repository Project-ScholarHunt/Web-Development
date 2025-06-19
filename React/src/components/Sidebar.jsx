// Sidebar.jsx
import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ isMobileMenuOpen, currentSection, setCurrentSection }) => {
    // Array menu items untuk dirender dinamis
    const menuItems = [
        { id: 'scholarships', label: 'Scholarships', icon: 'ri-graduation-cap-line' },
        { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-2-line' },
    ];

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        
        navigate('/admin-login');
    }, []);

    const handleLogoutToUserLogin = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate('/');
    }, []);

    const navigate = useNavigate();
    return (
        <div>
            <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white shadow-md md:h-full flex flex-col`}>
                <div className="p-4 hidden md:block">
                    <h2 className="text-xl font-bold">Admin Portal</h2>
                </div>

                <nav className="mt-2 md:mt-6 flex-1">
                    <ul className='px-2'>
                        {menuItems.map((item) => (
                            <li key={item.id} className={`${currentSection === item.id ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-200'} flex items-center rounded-md`}>
                                <i className={`${item.icon} text-xl ml-2`}></i>
                                <button
                                    onClick={() => setCurrentSection(item.id)}
                                    className={`block px-4 py-2 w-full text-left ${currentSection === item.id ? 'text-blue-700' : 'text-gray-700'}`}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-2 border-t border-gray-200 space-y-2">

                    <button
                        onClick={handleLogoutToUserLogin}
                        className="flex items-center w-full px-4 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-200"
                    >
                        <i className="ri-user-line text-xl mr-2"></i>
                        <span>Logout & Go to User</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-200"
                    >
                        <i className="ri-logout-box-line text-xl mr-2"></i>
                        <span>Logout</span>
                    </button>


                </div>
            </aside>
        </div>
    );
};

export default Sidebar;