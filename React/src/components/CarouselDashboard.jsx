import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CarouselDashboard = ({
    currentFeatured,
    currentFeaturedIndex,
    featuredScholarships,
    autoSlide,
    setAutoSlide,
    handlePrevFeatured,
    handleNextFeatured,
    handleViewDetails,
    formatDate
}) => {
    const [applicationStatus, setApplicationStatus] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicationStatus = async () => {
            const token = localStorage.getItem('token');
            if (token && featuredScholarships.length > 0) {
                const statusPromises = featuredScholarships.map(async (scholarship) => {
                    const response = await axios.get(`http://127.0.0.1:8000/api/applicants/check/${scholarship.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    return { id: scholarship.id, applied: response.data.applied };
                });
                const statuses = await Promise.all(statusPromises);
                const statusMap = statuses.reduce((acc, curr) => {
                    acc[curr.id] = curr.applied;
                    return acc;
                }, {});
                setApplicationStatus(statusMap);
            }
        };

        fetchApplicationStatus();
    }, [featuredScholarships]);

    useEffect(() => {
        let interval;

        if (autoSlide && featuredScholarships.length > 1) {
            interval = setInterval(() => {
                handleNextFeatured();
            }, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoSlide, featuredScholarships.length, currentFeaturedIndex]);

    const handleApplyClick = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login or register to apply for this scholarship.');
            navigate('/login');
            return;
        }

        if (!applicationStatus[currentFeatured.id]) {
            handleViewDetails(currentFeatured.id);
        }
    };

    if (!currentFeatured) {
        return (
            <section className="relative bg-gray-700 p-0 h-80 md:h-96 overflow-hidden rounded-lg flex items-center justify-center">
                <div className="text-white">No featured scholarship available</div>
            </section>
        );
    }

    return (
        <section className="relative bg-gray-700 p-0 h-80">
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <button
                        className={`bg-blue-600 text-white px-6 py-3 rounded transition-colors ${applicationStatus[currentFeatured.id] ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : 'hover:bg-blue-700'}`}
                        onClick={handleApplyClick}
                        disabled={applicationStatus[currentFeatured.id]}
                    >
                        {applicationStatus[currentFeatured.id] ? 'Registered' : 'Apply now'}
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
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    );
};

export default CarouselDashboard;