import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import FaqAccordion from '../components/FaqAccordion';
import ApplicationTimeline from '../components/ApplicationTimeline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CarouselDashboard from '../components/CarouselDashboard';
import Error from '../components/Error';
import Loading from '../components/Loading';

const Dashboard = () => {
    const [scholarships, setScholarships] = useState([]);
    const [featuredScholarships, setFeaturedScholarships] = useState([]);
    const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [autoSlide, setAutoSlide] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://127.0.0.1:8000/api/scholarships');
                let data = response.data;

                if (data && !Array.isArray(data)) {
                    console.log("Response data is not an array:", data);
                    if (typeof data === 'object' && data !== null) {
                        data = Object.values(data);
                    } else {
                        data = [];
                    }
                }

                if (data && data.length > 0) {
                    setScholarships(data);

                    const randomScholarships = getRandomScholarships(data, 4);
                    setFeaturedScholarships(randomScholarships);
                } else {
                    setScholarships([]);
                    setFeaturedScholarships([]);
                }
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching scholarships:", err);
                setError("Failed to load scholarships. Please try again later.");
                setIsLoading(false);
                setScholarships([]);
                setFeaturedScholarships([]);
            }
        };

        fetchScholarships();
    }, []);

    const getRandomScholarships = (scholarshipsArray, count) => {
        if (!scholarshipsArray || scholarshipsArray.length === 0) return [];

        if (scholarshipsArray.length <= count) return scholarshipsArray;

        const shuffled = [...scholarshipsArray];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(0, count);
    };

    const handleNextFeatured = () => {
        if (featuredScholarships.length > 0) {
            setCurrentFeaturedIndex((prevIndex) =>
                (prevIndex + 1) % featuredScholarships.length
            );
        }
    };

    const handlePrevFeatured = () => {
        if (featuredScholarships.length > 0) {
            setCurrentFeaturedIndex((prevIndex) =>
                (prevIndex - 1 + featuredScholarships.length) % featuredScholarships.length
            );
        }
    };

    // Navigate to the scholarship page with a specific scholarship ID
    const handleViewDetails = (scholarshipId) => {
        navigate(`/scholarships?id=${scholarshipId}`);
    };

    // Navigate to see all scholarships
    const handleSeeMore = () => {
        navigate('/scholarships');
    };

    useEffect(() => {
        let interval;

        if (autoSlide && featuredScholarships.length > 1) {
            interval = setInterval(() => {
                handleNextFeatured();
            }, 5000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [autoSlide, featuredScholarships.length, currentFeaturedIndex]);

    const formatDate = (dateString) => {
        if (!dateString) return 'No deadline';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return 'Invalid date';
        }
    };

    if (isLoading) {
        return (
            <Loading error={error} />
        );
    }

    if (error) {
        return (
            <Error error={error} />
        );
    }

    const currentFeatured = featuredScholarships.length > 0 ?
        featuredScholarships[currentFeaturedIndex] : null;
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <div className="flex-grow">
                {/* Featured Scholarship - Hero Section */}
                {currentFeatured ?
                    <CarouselDashboard
                        currentFeatured={currentFeatured}
                        currentFeaturedIndex={currentFeaturedIndex}
                        featuredScholarships={featuredScholarships}
                        autoSlide={autoSlide}
                        setAutoSlide={setAutoSlide}
                        handlePrevFeatured={handlePrevFeatured}
                        handleNextFeatured={handleNextFeatured}
                        handleViewDetails={handleViewDetails}
                        formatDate={formatDate}
                    /> : (
                        <section className="relative bg-gray-700 p-0 h-80 md:h-96 overflow-hidden rounded-lg flex items-center justify-center">
                            <div className="text-white">No featured scholarship available</div>
                        </section>
                    )}

                {/* Scholarship Grid Section - Bento Box */}
                <section className="container mx-auto px-6 py-16 mt-12">
                    {/* Dynamic Header */}
                    <div className="relative mb-16">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl"></div>
                        <div className="relative p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800 mb-1">Available Scholarships</h2>
                                    <p className="text-slate-600">Find your perfect opportunity</p>
                                </div>
                            </div>
                            <button
                                onClick={handleSeeMore}
                                className="bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2 group"
                            >
                                <span>Browse All</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {scholarships && scholarships.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center">
                                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.824-2.709"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">No scholarships found</h3>
                            <p className="text-slate-500">We're working on bringing you new opportunities</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-12 gap-6">
                            {Array.isArray(scholarships) && scholarships.slice(0, 5).map((scholarship, index) => {
                                // Dynamic grid sizing untuk bento layout
                                const getGridClass = (index) => {
                                    switch (index) {
                                        case 0: return "col-span-12 md:col-span-6 lg:col-span-5 row-span-2";
                                        case 1: return "col-span-12 md:col-span-6 lg:col-span-4 row-span-1";
                                        case 2: return "col-span-12 md:col-span-6 lg:col-span-3 row-span-1";
                                        case 3: return "col-span-12 md:col-span-6 lg:col-span-4 row-span-1";
                                        case 4: return "col-span-12 md:col-span-6 lg:col-span-5 row-span-1";
                                        default: return "col-span-12 md:col-span-6 lg:col-span-4";
                                    }
                                };

                                return (
                                    <div
                                        onClick={() => handleViewDetails(scholarship.id)}
                                        key={scholarship.id}
                                        className={`${getGridClass(index)} group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-slate-200 ${index === 0 ? 'min-h-[400px]' : 'min-h-[280px]'
                                            }`}
                                    >
                                        {/* Image Section */}
                                        <div className={`relative overflow-hidden ${index === 0 ? 'h-64' : 'h-40'}`}>
                                            {scholarship.thumbnail ? (
                                                <img
                                                    src={scholarship.thumbnail}
                                                    alt={scholarship.scholarshipName}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
                                                    {scholarship.quota} spots
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h4 className={`font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors ${index === 0 ? 'text-xl' : 'text-lg'
                                                }`}>
                                                {scholarship.scholarshipName}
                                            </h4>
                                            <p className="text-slate-600 mb-4 text-sm line-clamp-1">
                                                {scholarship.partner}
                                            </p>

                                            <div className="mt-auto">
                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                    <span>Deadline</span>
                                                    <span className="font-medium">{scholarship.timeLimit}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>



                <section className="container mx-auto py-12 px-6 mt-8 bg-gradient-to-r from-[#357ABD] to-[#506AD4] rounded-none sm:rounded-sm text-white text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Scholarship?</h2>
                    <p className="mb-6 max-w-2xl mx-auto">Join thousands of students who have already found funding for their education through our platform.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/register" className="hover:bg-white hover:text-[#357ABD] transition-all border border-white px-6 py-3 rounded font-medium duration-300">
                            Create an Account
                        </a>
                        <a href="/about" className="hover:bg-white hover:text-[#357ABD] transition-all border border-white px-6 py-3 rounded font-medium duration-300">
                            Learn More
                        </a>
                    </div>
                </section>

                <ApplicationTimeline />

                <FaqAccordion />
            </div>
        </div>
    );
};

export default Dashboard;