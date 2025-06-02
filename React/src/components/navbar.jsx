import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarPNG from '../assets/img/navbar.png';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [userData, setUserData] = useState({ name: 'User' });
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    // Throttled scroll handler
    const handleScroll = useCallback(() => {
        setIsScrolled(window.scrollY > 50);
    }, []);

    useEffect(() => {
        const scrollListener = () => {
            requestAnimationFrame(handleScroll);
        };
        window.addEventListener('scroll', scrollListener, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', scrollListener);
    }, [handleScroll]);

    // Check authentication status
    const checkAuthStatus = useCallback(async () => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('user');
        if (!token || !email) {
            setIsLoggedIn(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/user/check-token', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-User-Email': email,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data.message === 'Token and email are valid') {
                    setIsLoggedIn(true);
                    await fetchUserData(token, email);
                } else {
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        } catch (err) {
            console.error('Auth check error:', err);
            setIsLoggedIn(false);
        }
    }, []);

    // Fetch user data
    const fetchUserData = async (token, email) => {
        try {
            const response = await fetch('http://localhost:8000/api/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-User-Email': email,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUserData({ name: data.name || data.user?.name || email.split('@')[0] || 'User' });
            } else {
                setUserData({ name: email.split('@')[0] || 'User' });
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            setUserData({ name: email.split('@')[0] || 'User' });
        }
    };

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen((prev) => !prev);
        setIsProfileDropdownOpen(false);
    }, []);

    const toggleProfileDropdown = useCallback(() => {
        setIsProfileDropdownOpen((prev) => !prev);
    }, []);

    const closeAllMenus = useCallback(() => {
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserData({ name: 'User' });
        closeAllMenus();
        navigate('/login');
    }, [navigate, closeAllMenus]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (searchKeyword.trim()) {
                navigate(`/scholarships?search=${encodeURIComponent(searchKeyword)}`);
                setSearchKeyword('');
                closeAllMenus();
            }
        },
        [searchKeyword, navigate, closeAllMenus]
    );

    const handleLinkClick = useCallback(() => {
        closeAllMenus();
    }, [closeAllMenus]);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ((isMobileMenuOpen || isProfileDropdownOpen) && !event.target.closest('nav')) {
                closeAllMenus();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileMenuOpen, isProfileDropdownOpen, closeAllMenus]);

    return (
        <div
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-transparent'
                }`}
        >
            <nav className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" onClick={handleLinkClick} className="flex items-center">
                        <img src={NavbarPNG} alt="ScholarHunt Logo" className="h-10" />
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSubmit} className="hidden md:flex flex-1 mx-4 max-w-md">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="Find scholarship"
                                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/90 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                                aria-label="Find scholarship"
                            />
                            <svg
                                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </form>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-6">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                            onClick={handleLinkClick}
                        >
                            Home
                        </Link>
                        <Link
                            to="/scholarships"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                            onClick={handleLinkClick}
                        >
                            Scholarhsip
                        </Link>
                        <Link
                            to="/my-scholarships"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                            onClick={handleLinkClick}
                        >
                            My Scholarships
                        </Link>
                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={toggleProfileDropdown}
                                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-200"
                                    aria-expanded={isProfileDropdownOpen}
                                    aria-label="Menu profil"
                                >
                                    {userData.name}
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-in fade-in duration-200">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                            onClick={handleLinkClick}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-200"
                                    onClick={handleLinkClick}
                                >
                                    Masuk
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-all duration-200"
                                    onClick={handleLinkClick}
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-gray-700 hover:text-blue-600"
                        onClick={toggleMobileMenu}
                        aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white/95 backdrop-blur-lg shadow-lg transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="flex flex-col p-4 gap-4">
                        <form onSubmit={handleSubmit} className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    placeholder="Find scholarship"
                                    className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    aria-label="Find scholarship"
                                />
                                <svg
                                    className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </form>
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 font-medium py-2"
                            onClick={handleLinkClick}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/scholarships"
                            className="text-gray-700 hover:text-blue-600 font-medium py-2"
                            onClick={handleLinkClick}
                        >
                            Scholarships
                        </Link>
                        <Link
                            to="/my-scholarships"
                            className="text-gray-700 hover:text-blue-600 font-medium py-2"
                            onClick={handleLinkClick}
                        >
                            My Scholarhsips
                        </Link>
                        {isLoggedIn ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="text-gray-700 hover:text-blue-600 font-medium py-2"
                                    onClick={handleLinkClick}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-200"
                                    onClick={handleLinkClick}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-all duration-200"
                                    onClick={handleLinkClick}
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;