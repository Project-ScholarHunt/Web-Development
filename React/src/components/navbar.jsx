import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarPNG from '../assets/img/navbar.png';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("user");

        console.log("Token:", token);
        console.log("Email:", email);

        fetch("http://localhost:8000/api/user/check-token", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-User-Email": email,
                "Accept": "application/json",
            },
        })
            .then(async (res) => {
                const data = await res.json();
                console.log("Status:", res.status);
                console.log("Response:", data);

                if (res.ok && data.message === "Token and email are valid") {
                    setIsLoggedIn(true);
                    console.log("Token valid:", data.message);
                } else {
                    setIsLoggedIn(false);
                    console.warn("Token tidak valid:", data.message);
                }
            })
            .catch((err) => {
                console.error("Fetch error:", err);
            });
    }, []);


    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate({
            pathname: "/login"
        })
    }

    const [searchKeyword, setSearchKeyword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchKeyword.trim() !== "") {
            navigate(`/scholarships?search=${encodeURIComponent(searchKeyword)}`);
        }
    };

    return (
        <div className="absolute w-full px-5 top-7 z-50">
            <nav className="relative bg-blue-200 py-4 px-5 rounded-2xl shadow-md w-full">
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
                        <Link to="/" className="text-black hover:text-gray-600 font-medium">Home</Link>
                        <Link to="/scholarships" className="text-black hover:text-gray-600 font-medium">Scholarships</Link>
                        <Link to="/my-scholarships" className="text-black hover:text-gray-600 font-medium">My Scholarships</Link>
                        {isLoggedIn ?
                            <button
                                className='bg-red-500 hover:cursor-pointer text-white rounded font-medium tracking-wider hover:bg-red-700 px-4 py-2'
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                            :
                            <Link to="/register" className="bg-gray-600 text-white px-4 py-1 rounded font-medium tracking-wider">Signup</Link>
                        }
                    </div>

                    {/* Mobile Search Bar - Visible only on small screens */}
                    <div className="md:hidden flex-1 mx-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full px-8 py-1 rounded-full border border-gray-300 bg-white text-sm"
                            />
                            <i className="ri-search-line absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"></i>
                        </div>
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
                    className={`lg:hidden absolute left-0 right-0 top-full mt-2 bg-blue-200 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                        }`}
                >
                    <div className="flex flex-col p-4 gap-3">
                        <Link to="/" className="text-black hover:text-gray-600 font-medium py-2 border-b border-blue-300">Home</Link>
                        <Link to="/scholarships" className="text-black hover:text-gray-600 font-medium py-2 border-b border-blue-300">Scholarships</Link>
                        <Link to="/my-scholarships" className="text-black hover:text-gray-600 font-medium py-2 border-b border-blue-300">My Scholarships</Link>
                        {isLoggedIn ?
                            <button
                                className="bg-red-500 hover:bg-red-700 hover:cursor-pointer text-white px-4 py-2 rounded font-medium tracking-wider text-center mt-2"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                            :
                            <Link to="/register" className="bg-gray-600 text-white px-4 py-2 rounded font-medium tracking-wider text-center mt-2">Signup</Link>
                        }
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
