import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    // Debug logging untuk memastikan props diterima dengan benar
    useEffect(() => {
        console.log('CarouselDashboard Props:', {
            currentFeaturedIndex,
            featuredScholarshipsLength: featuredScholarships?.length,
            handlePrevFeatured: typeof handlePrevFeatured,
            handleNextFeatured: typeof handleNextFeatured,
            currentFeatured: currentFeatured?.scholarshipName
        });
    }, [currentFeaturedIndex, featuredScholarships, handlePrevFeatured, handleNextFeatured, currentFeatured]);

    // Memoized values untuk optimasi
    const isApplied = useMemo(() =>
        currentFeatured ? applicationStatus[currentFeatured.id] : false,
        [applicationStatus, currentFeatured]
    );

    const imageSrc = useMemo(() =>
        currentFeatured?.thumbnail || '/placeholder-scholarship.jpg',
        [currentFeatured?.thumbnail]
    );

    // Optimized fetch application status
    const fetchApplicationStatus = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token || featuredScholarships.length === 0) return;

        try {
            const statusPromises = featuredScholarships.map(async (scholarship) => {
                try {
                    const response = await axios.get(
                        `http://127.0.0.1:8000/api/applicants/check/${scholarship.id}`,
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    );
                    return { id: scholarship.id, applied: response.data.applied };
                } catch (error) {
                    console.warn(`Failed to check status for scholarship ${scholarship.id}`);
                    return { id: scholarship.id, applied: false };
                }
            });

            const statuses = await Promise.all(statusPromises);
            const statusMap = statuses.reduce((acc, curr) => {
                acc[curr.id] = curr.applied;
                return acc;
            }, {});

            setApplicationStatus(statusMap);
        } catch (error) {
            console.error('Error fetching application status:', error);
        }
    }, [featuredScholarships]);

    // Effect untuk fetch status
    useEffect(() => {
        fetchApplicationStatus();
    }, [fetchApplicationStatus]);

    // Auto-slide effect dengan dependency yang benar
    useEffect(() => {
        if (!autoSlide || featuredScholarships.length <= 1 || !handleNextFeatured) return;

        const interval = setInterval(() => {
            console.log('Auto-slide triggered');
            handleNextFeatured();
        }, 5000);

        return () => clearInterval(interval);
    }, [autoSlide, featuredScholarships.length, handleNextFeatured]);

    // Reset image states ketika featured scholarship berubah
    useEffect(() => {
        setImageLoaded(false);
        setImageError(false);
    }, [currentFeatured?.id]);

    // Navigation handlers dengan logging untuk debug
    const handlePrevClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Previous button clicked');

        if (handlePrevFeatured && typeof handlePrevFeatured === 'function') {
            handlePrevFeatured();
        } else {
            console.error('handlePrevFeatured is not a function:', handlePrevFeatured);
        }
    }, [handlePrevFeatured]);

    const handleNextClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Next button clicked');

        if (handleNextFeatured && typeof handleNextFeatured === 'function') {
            handleNextFeatured();
        } else {
            console.error('handleNextFeatured is not a function:', handleNextFeatured);
        }
    }, [handleNextFeatured]);

    // Auto-slide toggle handler
    const handleAutoSlideToggle = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Auto-slide toggle clicked, current state:', autoSlide);

        if (setAutoSlide && typeof setAutoSlide === 'function') {
            setAutoSlide(!autoSlide);
        } else {
            console.error('setAutoSlide is not a function:', setAutoSlide);
        }
    }, [autoSlide, setAutoSlide]);

    // Optimized apply click handler
    const handleApplyClick = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login or register to apply for this scholarship.');
            navigate('/login');
            return;
        }

        if (!isApplied && currentFeatured?.id) {
            handleViewDetails(currentFeatured.id);
        }
    }, [isApplied, currentFeatured?.id, navigate, handleViewDetails]);

    // Image handlers
    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
        setImageError(false);
    }, []);

    const handleImageError = useCallback(() => {
        setImageError(true);
        setImageLoaded(true);
    }, []);

    // Direct navigation to specific slide
    const handleDotClick = useCallback((targetIndex) => {
        console.log(`Dot clicked: ${targetIndex}, current: ${currentFeaturedIndex}`);

        if (targetIndex === currentFeaturedIndex) return;

        const diff = targetIndex - currentFeaturedIndex;
        const absSteps = Math.abs(diff);

        // Determine shortest path (forward or backward)
        const totalSlides = featuredScholarships.length;
        const forwardSteps = diff > 0 ? diff : totalSlides + diff;
        const backwardSteps = diff < 0 ? absSteps : totalSlides - diff;

        if (forwardSteps <= backwardSteps) {
            // Go forward
            for (let i = 0; i < forwardSteps; i++) {
                setTimeout(() => handleNextFeatured(), i * 100);
            }
        } else {
            // Go backward
            for (let i = 0; i < backwardSteps; i++) {
                setTimeout(() => handlePrevFeatured(), i * 100);
            }
        }
    }, [currentFeaturedIndex, featuredScholarships.length, handleNextFeatured, handlePrevFeatured]);

    // Early return untuk loading state
    if (!currentFeatured) {
        return (
            <section className="relative h-96 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
                <div className="text-white text-xl font-medium animate-pulse">
                    No featured scholarship available
                </div>
            </section>
        );
    }

    return (
        <section className="relative h-[43rem] overflow-hidden rounded-lg group">
            {/* Background Image dengan loading state */}
            <div className="absolute inset-0">
                {/* Loading skeleton */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 animate-pulse" />
                )}

                {/* Main Image */}
                <img
                    src={imageSrc}
                    alt={currentFeatured.scholarshipName}
                    className={`w-full h-full object-cover transition-all duration-700 transform group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                        } ${imageError ? 'object-contain bg-slate-200' : ''}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Animated overlay untuk hover effect */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Main Title dengan animasi */}
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight transform transition-transform duration-300 group-hover:scale-105">
                        {currentFeatured.scholarshipName}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light">
                        Presented by {currentFeatured.partner}
                    </p>

                    {/* Info Cards dengan responsive design */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-colors duration-300">
                            <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                                {currentFeatured.quota}
                            </div>
                            <div className="text-white/80 text-xs sm:text-sm uppercase tracking-wider">
                                Available Spots
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-colors duration-300">
                            <div className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                                {formatDate(currentFeatured.timeLimit)}
                            </div>
                            <div className="text-white/80 text-xs sm:text-sm uppercase tracking-wider">
                                Registration Deadline
                            </div>
                        </div>
                    </div>

                    {/* CTA Button dengan states yang jelas */}
                    <button
                        className={`px-8 sm:px-12 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 ${isApplied
                            ? 'bg-white/20 text-white/60 cursor-not-allowed backdrop-blur-sm'
                            : 'bg-white text-black hover:bg-white/90 hover:shadow-2xl active:scale-95'
                            }`}
                        onClick={handleApplyClick}
                        disabled={isApplied}
                        aria-label={isApplied ? 'Already applied to this scholarship' : 'Apply to this scholarship'}
                    >
                        {isApplied ? 'Already Applied' : 'Start Your Journey'}
                    </button>
                </div>
            </div>

            {/* Navigation Buttons dengan event handling yang diperbaiki */}
            <button
                type="button"
                onClick={handlePrevClick}
                className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 group/btn z-20"
                aria-label="Previous scholarship"
                disabled={featuredScholarships.length <= 1}
            >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transform group-hover/btn:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                type="button"
                onClick={handleNextClick}
                className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 group/btn z-20"
                aria-label="Next scholarship"
                disabled={featuredScholarships.length <= 1}
            >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Progress Indicator dengan direct navigation */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4 z-20">
                {/* Progress dots */}
                <div className="flex gap-1.5 sm:gap-2">
                    {featuredScholarships.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleDotClick(index)}
                            className={`h-1 rounded-full transition-all duration-300 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 ${index === currentFeaturedIndex
                                ? 'w-6 sm:w-8 bg-white'
                                : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/60 cursor-pointer'
                                }`}
                            aria-label={`Go to scholarship ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Auto-slide toggle */}
                <button
                    type="button"
                    onClick={handleAutoSlideToggle}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 ${autoSlide
                            ? 'bg-white text-black hover:bg-white/90 active:bg-white/80'
                            : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 active:bg-white/40'
                        }`}
                    aria-label={autoSlide ? 'Pause auto-slide' : 'Enable auto-slide'}
                >
                    {autoSlide ? (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Loading indicator untuk image */}
            {!imageLoaded && (
                <div className="absolute top-4 right-4 w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin z-20" />
            )}
        </section>
    );
};

export default React.memo(CarouselDashboard);
