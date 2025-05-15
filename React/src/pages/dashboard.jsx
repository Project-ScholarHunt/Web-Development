import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import FaqAccordion from '../components/FaqAccordion';
import ApplicationTimeline from '../components/ApplicationTimeline';
import axios from 'axios'; // Make sure to install axios: npm install axios

const Dashboard = () => {
    // State for scholarship data
    const [scholarships, setScholarships] = useState([]);
    const [featuredScholarships, setFeaturedScholarships] = useState([]);
    const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [autoSlide, setAutoSlide] = useState(true);

    // Fetch scholarships from API
    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                setIsLoading(true);
                // Changed to match Laravel API route
                const response = await axios.get('http://127.0.0.1:8000/api/scholarships');
                let data = response.data;

                // Check if data is an array, if not and it's an object, convert it
                if (data && !Array.isArray(data)) {
                    console.log("Response data is not an array:", data);
                    // If it's an object with numeric keys, convert to array
                    if (typeof data === 'object' && data !== null) {
                        data = Object.values(data);
                    } else {
                        // If not convertible, initialize as empty array
                        data = [];
                    }
                }

                // Make sure we have data
                if (data && data.length > 0) {
                    setScholarships(data);

                    // Select 4 random scholarships for the carousel
                    const randomScholarships = getRandomScholarships(data, 4);
                    setFeaturedScholarships(randomScholarships);
                } else {
                    // Ensure scholarships is always an array
                    setScholarships([]);
                    setFeaturedScholarships([]);
                }
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching scholarships:", err);
                setError("Failed to load scholarships. Please try again later.");
                setIsLoading(false);
                // Ensure scholarships is always an array
                setScholarships([]);
                setFeaturedScholarships([]);
            }
        };

        fetchScholarships();
    }, []);

    // Function to get random scholarships
    const getRandomScholarships = (scholarshipsArray, count) => {
        if (!scholarshipsArray || scholarshipsArray.length === 0) return [];

        // If there are fewer scholarships than requested, return all of them
        if (scholarshipsArray.length <= count) return scholarshipsArray;

        // Create a copy of the array to avoid modifying the original
        const shuffled = [...scholarshipsArray];

        // Fisher-Yates (Knuth) shuffle algorithm
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Return the first 'count' elements
        return shuffled.slice(0, count);
    };

    // Handle carousel navigation
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

    // Auto slide feature
    useEffect(() => {
        let interval;

        if (autoSlide && featuredScholarships.length > 1) {
            interval = setInterval(() => {
                handleNextFeatured();
            }, 5000); // Change slide every 5 seconds
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [autoSlide, featuredScholarships.length, currentFeaturedIndex]);

    // Format date for display
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

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-teal-500">
                <div className="text-white text-xl">Loading scholarships...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-teal-500">
                <div className="text-white text-xl">{error}</div>
            </div>
        );
    }

    // Get current featured scholarship
    const currentFeatured = featuredScholarships.length > 0 ?
        featuredScholarships[currentFeaturedIndex] : null;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
            <Navbar />
            <div className="flex-grow">
                {/* Featured Scholarship - Hero Section */}
                {currentFeatured ? (
                    <section className="relative bg-gray-700 p-0 h-80 md:h-96 overflow-hidden rounded-lg">
                        {/* Hero background */}
                        <div className="absolute inset-0">
                            <img
                                src={currentFeatured.thumbnail || '/placeholder-scholarship.jpg'}
                                alt={currentFeatured.scholarshipName}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                        </div>

                        {/* Navigation arrows */}
                        <div className="absolute inset-y-0 left-0 flex items-center z-10">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handlePrevFeatured();
                                }}
                                className="bg-opacity-30 text-white p-4 rounded-r-md hover:bg-opacity-50 cursor-pointer"
                                aria-label="Previous scholarship"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="absolute inset-y-0 right-0 flex items-center z-10">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleNextFeatured();
                                }}
                                className="bg-opacity-30 text-white p-4 rounded-l-md hover:bg-opacity-50 cursor-pointer"
                                aria-label="Next scholarship"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Content positioned at bottom left */}
                        <div className="absolute bottom-10 p-2 w-full">
                            <div className="container mx-[2vw]">
                                <h1 className="text-3xl font-bold mb-4 text-white">{currentFeatured.scholarshipName}</h1>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="bg-white px-4 py-1 rounded text-gray-800">{currentFeatured.partner}</span>
                                    <span className="bg-white px-4 py-1 rounded text-gray-800">Quota: {currentFeatured.quota}</span>
                                    <span className="bg-white px-4 py-1 rounded text-gray-800">Deadline: {formatDate(currentFeatured.timeLimit)}</span>
                                </div>
                                <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors">
                                    Apply now
                                </button>
                            </div>
                        </div>

                        {/* Pagination indicator and auto-slide toggle */}
                        <div className="absolute bottom-10 right-[3vw] flex items-center gap-2">
                            <button
                                onClick={() => setAutoSlide(!autoSlide)}
                                className={`p-2 rounded-full ${autoSlide ? 'bg-blue-600' : 'bg-gray-400'}`}
                                title={autoSlide ? "Pause auto-slide" : "Enable auto-slide"}
                            >
                                {autoSlide ? (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                )}
                            </button>
                            <span className="bg-white bg-opacity-50 px-3 py-1 rounded-full text-sm">
                                {currentFeaturedIndex + 1}/{featuredScholarships.length}
                            </span>
                        </div>
                    </section>
                ) : (
                    <section className="relative bg-gray-700 p-0 h-80 md:h-96 overflow-hidden rounded-lg flex items-center justify-center">
                        <div className="text-white">No featured scholarship available</div>
                    </section>
                )}

                {/* Scholarship Grid Section */}
                <section className="container mx-auto px-6 py-12 mt-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Available Scholarships</h2>
                        <a href="/scholarships" className="text-lg hover:text-blue-700 transition-colors flex items-center">
                            See more
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>

                    {scholarships && scholarships.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-lg text-white">No scholarships available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.isArray(scholarships) && scholarships.slice(0, 6).map((scholarship) => (
                                <div key={scholarship.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                                    {/* Improved image container with fixed height and proper sizing */}
                                    <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {scholarship.logo ? (
                                            <img
                                                src={scholarship.logo}
                                                alt={`${scholarship.scholarshipName} logo`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                <span className="text-lg">Logo not available</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* The key change is here - making the content div flex-grow to fill remaining space */}
                                    <div className="p-5 bg-sky-300 flex flex-col flex-grow">
                                        <h3 className="font-medium text-lg mb-2">{scholarship.scholarshipName}</h3>
                                        <div className="flex items-center text-sm text-gray-600 mb-3">
                                            <span className="mr-3">{scholarship.partner}</span>
                                            <span className="px-2 py-1 bg-sky-200 rounded-full text-xs">Quota: {scholarship.quota}</span>
                                        </div>
                                        <p className="text-sm">{scholarship.description && scholarship.description.substring(0, 100)}...</p>
                                        {/* Move the link to margin-top: auto to push it to the bottom */}
                                        <div className="mt-auto pt-4">
                                            <a
                                                href={`/scholarships/${scholarship.id}`}
                                                className="text-blue-700 hover:text-blue-900 text-sm font-medium flex items-center"
                                            >
                                                View Details
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Call-to-Action Section - only shown for logged out users */}
                <section className="container mx-auto py-12 px-6 mt-8 bg-blue-600 rounded-lg text-white text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Scholarship?</h2>
                    <p className="mb-6 max-w-2xl mx-auto">Join thousands of students who have already found funding for their education through our platform.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/register" className="bg-white text-blue-600 px-6 py-3 rounded font-medium">Create Account</a>
                        <a href="/about" className="border border-white px-6 py-3 rounded font-medium">Learn More</a>
                    </div>
                </section>

                {/* Application Timeline Section */}
                <ApplicationTimeline />

                {/* FAQ Accordion Section */}
                <FaqAccordion />
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;