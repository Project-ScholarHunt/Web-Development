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
import { Link } from 'react-router';

const Dashboard = () => {
    const [scholarships, setScholarships] = useState([]);
    const [featuredScholarships, setFeaturedScholarships] = useState([]);
    const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [autoSlide, setAutoSlide] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Dashboard';
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

    const handleViewDetails = (scholarshipId) => {
        navigate(`/scholarships?id=${scholarshipId}`);
    };

    const handleSeeMore = () => {
        navigate('/scholarships');
    };

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
                <section className="container mx-auto px-6 py-16 mt-5">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Discover Your Dream Scholarship</h2>
                        <p className="text-slate-600">Explore the best educational opportunities in Indonesia</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.isArray(scholarships) && scholarships.slice(0, 4).map((scholarship) => (
                            <div
                                key={scholarship.id}
                                onClick={() => handleViewDetails(scholarship.id)}
                                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-500"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    {scholarship.thumbnail ? (
                                        <img
                                            src={scholarship.thumbnail}
                                            alt={scholarship.scholarshipName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                        {scholarship.quota} Slots
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-semibold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600">
                                        {scholarship.scholarshipName}
                                    </h4>
                                    <p className="text-slate-600 text-sm mb-3 line-clamp-1">{scholarship.partner}</p>
                                    <div className="flex items-center text-sm text-slate-500">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <span>{formatDate(scholarship.timeLimit)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12 ">
                        <button
                            onClick={handleSeeMore}
                            className="bg-blue-600 text-white hover:cursor-pointer px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            View All Scholarships
                        </button>
                    </div>
                </section>



                <section className="container mx-auto py-12 px-6 mt-8 bg-gradient-to-r from-[#357ABD] to-[#506AD4] rounded-none sm:rounded-sm text-white text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Scholarship?</h2>
                    <p className="mb-6 max-w-2xl mx-auto">Join thousands of students who have already found funding for their education through our platform.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="hover:bg-white hover:text-[#357ABD] transition-all border border-white px-6 py-3 rounded font-medium duration-300">
                            Create an Account
                        </Link>
                    </div>
                </section>

                <ApplicationTimeline />

                <FaqAccordion />
            </div>
        </div>
    );
};

export default Dashboard;