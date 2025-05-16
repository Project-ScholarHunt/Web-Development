// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isMobileMenuOpen, currentSection, setCurrentSection }) => {
    // Array menu items untuk dirender dinamis
    const menuItems = [
        { id: 'scholarships', label: 'Scholarships', icon: 'ri-graduation-cap-line' },
        { id: 'applicants', label: 'Applicants', icon: 'ri-file-line' },
        { id: 'users', label: 'Users', icon: 'ri-user-3-line' },
        { id: 'settings', label: 'Settings', icon: 'ri-settings-2-line' },
    ];

    return (
        <div>
            <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white shadow-md md:h-full`}>
                <div className="p-4 hidden md:block">
                    <h2 className="text-xl font-bold">Admin Portal</h2>
                </div>
                <nav className="mt-2 md:mt-6">
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
            </aside>
        </div>
    );
};

export default Sidebar;
