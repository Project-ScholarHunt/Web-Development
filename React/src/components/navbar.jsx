import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarPNG from '../assets/img/navbar.png';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [userData, setUserData] = useState({ name: "" });
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();

        window.addEventListener('storage', handleStorageChange);

        window.addEventListener('userLoggedIn', checkAuthStatus);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userLoggedIn', checkAuthStatus);
        };
    }, []);

    const handleStorageChange = (e) => {
        if (e.key === 'token' || e.key === 'userEmail') {
            checkAuthStatus();
        }
    };

    const checkAuthStatus = () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("userEmail");

        if (token && email) {
            setIsLoggedIn(true);

            fetch("http://localhost:8000/api/user/check-token", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-User-Email": email,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
            })
                .then(async (res) => {
                    if (res.ok) {
                        const data = await res.json();
                        if (data.message === "Token and email are valid") {
                            setIsLoggedIn(true);
                            fetchUserData(token, email);
                        } else {
                            handleLogoutProcess();
                        }
                    } else {
                        if (res.status === 401) {
                            handleLogoutProcess();
                        }
                    }
                })
                .catch((err) => {
                    console.error("Auth check error:", err);
                });
        } else {
            setIsLoggedIn(false);
        }
    };

    const fetchUserData = (token, email) => {
        console.log("Fetching user profile data...");

        fetch("http://localhost:8000/api/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-User-Email": email,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    console.log("Profile data received:", data);
                    setUserData({ name: data.name || data.user?.name || "User" });
                } else {
                    console.error("Failed to fetch user data:", res.status);
                    fetchUserDirectly(token, email);
                }
            })
            .catch((err) => {
                console.error("Error fetching user data:", err);
                fetchUserDirectly(token, email);
            });
    };

    const fetchUserDirectly = (token, email) => {
        fetch("http://localhost:8000/api/user", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-User-Email": email,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    console.log("Direct user data received:", data);
                    setUserData({ name: data.name || data.user?.name || email.split('@')[0] || "User" });
                } else {
                    const username = email ? email.split('@')[0] : "User";
                    setUserData({ name: username });
                }
            })
            .catch(() => {
                const username = email ? email.split('@')[0] : "User";
                setUserData({ name: username });
            });
    };

    const handleLogoutProcess = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        setUserData({ name: "" });
        navigate("/login");
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const closeAllMenus = () => {
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
    };

    const handleLogout = () => {
        const token = localStorage.getItem("token");

        if (token) {
            fetch("http://localhost:8000/api/users/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })
                .finally(() => {
                    handleLogoutProcess();
                    closeAllMenus();
                });
        } else {
            handleLogoutProcess();
            closeAllMenus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchKeyword.trim() !== "") {
            navigate(`/scholarships?search=${encodeURIComponent(searchKeyword)}`);
            setSearchKeyword("");
            closeAllMenus();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileDropdownOpen]);

    return (
        <div className="fixed top-0 w-full z-50 shadow">
            <nav className="relative bg-white py-4 px-5 w-full">
                <div className="flex flex-row items-center justify-between w-full">

                    {/* Logo - Always visible */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center h-[3vh]">
                            <img
                                src={NavbarPNG}
                                alt="logo scholarhunt"
                                className="max-h-[45px]"
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
                                className="w-full px-10 py-1 rounded-full border border-gray-300 bg-white"
                            />
                            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                        </div>
                    </form>

                    {/* Desktop Navigation Links - Hidden on mobile, visible on large screens */}
                    <div className="hidden lg:flex items-center gap-6">
                        <Link to="/" className="text-black hover:text-blue-500 font-medium">Home</Link>
                        <Link to="/scholarships" className="text-black hover:text-blue-500 font-medium">Scholarships</Link>
                        <Link to="/my-scholarships" className="text-black hover:text-blue-500 font-medium">My Scholarships</Link>

                        {isLoggedIn ? (
                            <div className="relative profile-dropdown-container">
                                <button
                                    onClick={toggleProfileDropdown}
                                    className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 flex items-center gap-2 font-medium"
                                >
                                    {userData.name} <i className={`ri-arrow-${isProfileDropdownOpen ? 'up' : 'down'}-s-line`}></i>
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-100 w-full text-left"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <i className="ri-user-line mr-2"></i> Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-100 w-full text-left"
                                        >
                                            <i className="ri-logout-box-line mr-2"></i> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded font-medium tracking-wider mr-2">Login</Link>
                        )}

                        {!isLoggedIn && (
                            <Link to="/register" className="bg-gray-600 text-white px-4 py-2 rounded font-medium tracking-wider">Signup</Link>
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
                                    className="w-full px-8 py-1 rounded-full border border-gray-300 bg-white text-sm"
                                />
                                <i className="ri-search-line absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"></i>
                            </div>
                        </form>
                    </div>

                    {/* Mobile Menu Button - Visible only on mobile and medium screens */}
                    <button
                        className="lg:hidden flex items-center text-black"
                        onClick={toggleMobileMenu}
                    >
                        <i className={`ri-menu-line text-xl ${isMobileMenuOpen ? 'hidden' : 'block'}`}></i>
                        <i className={`ri-close-line text-xl ${isMobileMenuOpen ? 'block' : 'hidden'}`}></i>
                    </button>
                </div>

                {/* Mobile Menu Panel */}
                <div
                    className={`lg:hidden absolute left-0 right-0 top-full rounded-lg shadow-lg transition-all duration-300 bg-white ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                        }`}
                >
                    <div className="flex flex-col p-4 gap-3">
                        <Link to="/" className="text-black hover:text-blue-500 font-medium py-2 border-b border-blue-300">Home</Link>
                        <Link to="/scholarships" className="text-black hover:text-blue-500 font-medium py-2 border-b border-blue-300">Scholarships</Link>
                        <Link to="/my-scholarships" className="text-black hover:text-blue-500 font-medium py-2 border-b border-blue-300">My Scholarships</Link>

                        {isLoggedIn ? (
                            <>
                                <div className="py-2 border-b border-blue-300 text-black font-medium">
                                    <span>Logged in as: {userData.name}</span>
                                </div>
                                <Link
                                    to="/profile"
                                    className="text-black hover:text-blue-500 font-medium py-2 border-b border-blue-300"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <i className="ri-user-line mr-2"></i> Profile
                                </Link>
                                <button
                                    className="bg-red-500 hover:bg-red-700 hover:cursor-pointer text-white px-4 py-2 rounded font-medium tracking-wider text-center mt-2"
                                    onClick={handleLogout}
                                >
                                    <i className="ri-logout-box-line mr-2"></i> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded font-medium tracking-wider text-center">Login</Link>
                                <Link to="/register" className="bg-gray-600 text-white px-4 py-2 rounded font-medium tracking-wider text-center mt-2">Signup</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;