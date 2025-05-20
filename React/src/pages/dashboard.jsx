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

                {/* Scholarship Grid Section */}
                <section className="container mx-auto px-6 py-12 mt-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Available Scholarships</h2>
                        <button
                            onClick={handleSeeMore}
                            className="text-lg hover:text-blue-700 transition-colors hover:cursor-pointer flex items-center"
                        >
                            See more
                            <i class="ri-arrow-right-s-line text-xl"></i>
                        </button>
                    </div>

                    {scholarships && scholarships.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-lg text-white">No scholarships available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 mx-auto md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {Array.isArray(scholarships) && scholarships.slice(0, 5).map((scholarship) => (
                                <div
                                    onClick={() => handleViewDetails(scholarship.id)}
                                    key={scholarship.id}
                                    className="hover:cursor-pointer bg-white shadow-lg max-w-55 h-90 hover:shadow-sm hover:shadow-black transition-shadow flex flex-col rounded">
                                    {/* Improved image container with fixed height and proper sizing */}
                                    <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {scholarship.thumbnail ? (
                                            <img
                                                src={scholarship.thumbnail}
                                                alt={`${scholarship.scholarshipName} logo`}
                                                className="w-full h-full object-cover rounded-t-sm"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                <span className="text-lg">Thumbnail not available</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* The key change is here - making the content div flex-grow to fill remaining space */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h4 className="font-medium text-sm mb-1 line-clamp-2">
                                            {scholarship.scholarshipName}
                                        </h4>
                                        <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            From {scholarship.partner}
                                        </div>

                                        {/* Spacer to push quota text to bottom */}
                                        <div className="flex-grow"></div>
                                    </div>
                                    <div className="bg-gray-200 w-full p-3">
                                        <p className="text-sm ">Quota Remaining: {scholarship.quota}</p>
                                        <p className="text-sm">Until {scholarship.timeLimit}</p>
                                    </div>
                                </div>
                            ))}
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