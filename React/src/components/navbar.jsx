import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarPNG from '../assets/img/navbar.png';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [userData, setUserData] = useState({ name: "" });
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    // Optimized scroll handler with throttling
    const handleScroll = useCallback(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setIsScrolled(scrollTop > 50);
    }, []);

    // Setup scroll listener with throttling
    useEffect(() => {
        let ticking = false;

        const scrollListener = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollListener, { passive: true });

        // Check initial scroll position
        handleScroll();

        return () => {
            window.removeEventListener('scroll', scrollListener);
        };
    }, [handleScroll]);

    const checkAuthStatus = useCallback(async () => {
        console.log("Check Auth Status:");
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("user");

        if (!token || !email) {
            setIsLoggedIn(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/user/check-token", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-User-Email": email,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.message === "Token and email are valid") {
                    setIsLoggedIn(true);
                    await fetchUserData(token, email);
                } else {
                    console.error(data.message);
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        } catch (err) {
            console.error("Auth check error:", err);
            setIsLoggedIn(false);
        }
    }, []);

    const fetchUserData = async (token, email) => {
        console.log("Fetching user profile data...");

        try {
            const response = await fetch("http://localhost:8000/api/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-User-Email": email,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Profile data received:", data);
                setUserData({ name: data.name || data.user?.name || "User" });
            } else {
                console.error("Failed to fetch user data:", response.status);
                await fetchUserDirectly(token, email);
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            await fetchUserDirectly(token, email);
        }
    };

    const fetchUserDirectly = async (token, email) => {
        try {
            const response = await fetch("http://localhost:8000/api/user", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-User-Email": email,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Direct user data received:", data);
                setUserData({
                    name: data.name || data.user?.name || email.split('@')[0] || "User"
                });
            } else {
                const username = email ? email.split('@')[0] : "User";
                setUserData({ name: username });
            }
        } catch (error) {
            console.error("Error fetching user directly:", error);
            const username = email ? email.split('@')[0] : "User";
            setUserData({ name: username });
        }
    };

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
        // Close profile dropdown when opening mobile menu
        if (isProfileDropdownOpen) {
            setIsProfileDropdownOpen(false);
        }
    }, [isProfileDropdownOpen]);

    const toggleProfileDropdown = useCallback(() => {
        setIsProfileDropdownOpen(prev => !prev);
    }, []);

    const closeAllMenus = useCallback(() => {
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserData({ name: "" });
        closeAllMenus();
        navigate("/login");
    }, [navigate, closeAllMenus]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (searchKeyword.trim() !== "") {
            navigate(`/scholarships?search=${encodeURIComponent(searchKeyword)}`);
            setSearchKeyword("");
            closeAllMenus();
        }
    }, [searchKeyword, navigate, closeAllMenus]);

    const handleLinkClick = useCallback(() => {
        closeAllMenus();
    }, [closeAllMenus]);

    // Check auth status on mount
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen || isProfileDropdownOpen) {
                const navbar = event.target.closest('nav');
                if (!navbar) {
                    closeAllMenus();
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMobileMenuOpen, isProfileDropdownOpen, closeAllMenus]);

    return (
        <div className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${isScrolled
                ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/20'
                : 'bg-transparent'
            }`}>
            <nav className="relative py-4 px-5 w-full">
                <div className="flex flex-row items-center justify-between w-full">
                    {/* Logo - Always visible */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center h-[3vh]" onClick={handleLinkClick}>
                            <img
                                src={NavbarPNG}
                                alt="logo scholarhunt"
                                className="max-h-[45px] transition-opacity duration-300"
                            />
                        </Link>
                    </div>

                    {/* Search Bar - Hidden on mobile, visible on medium screens and larger */}
                    <form
                        onSubmit={handleSubmit}
                        className="hidden md:flex flex-1 max-w-md mx-8"
                    >
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="Search scholarship"
                                className={`w-full px-10 py-2 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isScrolled
                                        ? 'border-gray-300 bg-white/95 backdrop-blur-sm'
                                        : 'border-gray-300 bg-white'
                                    }`}
                            />
                            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                        </div>
                    </form>

                    {/* Desktop Navigation Links - Hidden on mobile, visible on large screens */}
                    <div className="hidden lg:flex items-center gap-6">
                        <Link
                            to="/"
                            className={`font-medium transition-colors duration-200 hover:text-blue-500 ${isScrolled ? 'text-gray-800' : 'text-black'
                                }`}
                            onClick={handleLinkClick}
                        >
                            Home
                        </Link>
                        <Link
                            to="/scholarships"
                            className={`font-medium transition-colors duration-200 hover:text-blue-500 ${isScrolled ? 'text-gray-800' : 'text-black'
                                }`}
                            onClick={handleLinkClick}
                        >
                            Scholarships
                        </Link>
                        <Link
                            to="/my-scholarships"
                            className={`font-medium transition-colors duration-200 hover:text-blue-500 ${isScrolled ? 'text-gray-800' : 'text-black'
                                }`}
                            onClick={handleLinkClick}
                        >
                            My Scholarships
                        </Link>

                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={toggleProfileDropdown}
                                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    {userData.name}
                                    <i className={`ri-arrow-${isProfileDropdownOpen ? 'up' : 'down'}-s-line transition-transform duration-200`}></i>
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 animate-in slide-in-from-top-2 duration-200">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left transition-colors duration-150"
                                            onClick={handleLinkClick}
                                        >
                                            <i className="ri-user-line mr-2"></i> Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 w-full text-left transition-colors duration-150"
                                        >
                                            <i className="ri-logout-box-line mr-2"></i> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium tracking-wider transition-all duration-200 shadow-sm hover:shadow-md"
                                onClick={handleLinkClick}
                            >
                                Login
                            </Link>
                        )}

                        {!isLoggedIn && (
                            <Link
                                to="/register"
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium tracking-wider transition-all duration-200 shadow-sm hover:shadow-md"
                                onClick={handleLinkClick}
                            >
                                Signup
                            </Link>
                        )}
                    </div>

                    {/* Mobile Search Bar - Visible only on small screens */}
                    <div className="md:hidden flex-1 mx-3">
                        <form onSubmit={handleSubmit}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    className={`w-full px-8 py-1.5 rounded-full border text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isScrolled
                                            ? 'border-gray-300 bg-white/95 backdrop-blur-sm'
                                            : 'border-gray-300 bg-white'
                                        }`}
                                />
                                <i className="ri-search-line absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"></i>
                            </div>
                        </form>
                    </div>

                    {/* Mobile Menu Button - Visible only on mobile and medium screens */}
                    <button
                        className={`lg:hidden flex items-center transition-colors duration-200 ${isScrolled ? 'text-gray-800' : 'text-black'
                            }`}
                        onClick={toggleMobileMenu}
                        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        <i className={`ri-menu-line text-xl transition-all duration-200 ${isMobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}></i>
                        <i className={`ri-close-line text-xl absolute transition-all duration-200 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}></i>
                    </button>
                </div>

                {/* Mobile Menu Panel */}
                <div
                    className={`lg:hidden absolute left-0 right-0 top-full rounded-lg shadow-lg transition-all duration-300 ease-in-out bg-white/95 backdrop-blur-md border border-gray-200/50 ${isMobileMenuOpen
                            ? 'max-h-96 opacity-100 transform translate-y-0'
                            : 'max-h-0 opacity-0 overflow-hidden transform -translate-y-2'
                        }`}
                >
                    <div className="flex flex-col p-4 gap-3">
                        <Link
                            to="/"
                            className="text-gray-800 hover:text-blue-500 font-medium py-2 border-b border-blue-200 transition-colors duration-200"
                            onClick={handleLinkClick}
                        >
                            Home
                        </Link>
                        <Link
                            to="/scholarships"
                            className="text-gray-800 hover:text-blue-500 font-medium py-2 border-b border-blue-200 transition-colors duration-200"
                            onClick={handleLinkClick}
                        >
                            Scholarships
                        </Link>
                        <Link
                            to="/my-scholarships"
                            className="text-gray-800 hover:text-blue-500 font-medium py-2 border-b border-blue-200 transition-colors duration-200"
                            onClick={handleLinkClick}
                        >
                            My Scholarships
                        </Link>

                        {isLoggedIn ? (
                            <>
                                <div className="py-2 border-b border-blue-200 text-gray-800 font-medium">
                                    <span>Logged in as: {userData.name}</span>
                                </div>
                                <Link
                                    to="/profile"
                                    className="text-gray-800 hover:text-blue-500 font-medium py-2 border-b border-blue-200 transition-colors duration-200"
                                    onClick={handleLinkClick}
                                >
                                    <i className="ri-user-line mr-2"></i> Profile
                                </Link>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium tracking-wider text-center mt-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                    onClick={handleLogout}
                                >
                                    <i className="ri-logout-box-line mr-2"></i> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium tracking-wider text-center transition-all duration-200 shadow-sm hover:shadow-md"
                                    onClick={handleLinkClick}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium tracking-wider text-center mt-2 transition-all duration-200 shadow-sm hover:shadow-md"
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