import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CarouselDashboard = ({
    currentFeatured,
    currentFeaturedIndex,
    featuredScholarships = [], // Default ke array kosong
    handlePrevFeatured,
    handleNextFeatured,
    handleSetCurrentFeaturedIndex, // Prop opsional untuk navigasi dot yang lebih baik
    handleViewDetails,
    formatDate
}) => {
    const [applicationStatus, setApplicationStatus] = useState({});
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [prevImageSrc, setPrevImageSrc] = useState(null);
    const navigate = useNavigate();

    const isApplied = useMemo(() =>
        currentFeatured ? applicationStatus[currentFeatured.id] : false,
        [applicationStatus, currentFeatured]
    );

    const imageSrc = useMemo(() =>
        currentFeatured?.thumbnail || '/placeholder-scholarship.jpg',
        [currentFeatured?.thumbnail]
    );

    useEffect(() => {
        // Reset status gambar jika sumber gambar berubah
        if (imageSrc !== prevImageSrc) {
            setImageLoaded(false);
            setImageError(false);
            setPrevImageSrc(imageSrc);
            // console.log('[Carousel] Image source changed, resetting load/error states for:', imageSrc);
        }
    }, [imageSrc, prevImageSrc]);

    const fetchApplicationStatus = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token || !featuredScholarships || featuredScholarships.length === 0) {
            return;
        }

        try {
            const statusPromises = featuredScholarships.map(async (scholarship) => {
                if (!scholarship || !scholarship.id) return { id: null, applied: false }; // Tambahan guard
                try {
                    const response = await axios.get(
                        `http://127.0.0.1:8000/api/applicants/check/${scholarship.id}`,
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    );
                    return { id: scholarship.id, applied: response.data.applied };
                } catch (error) {
                    console.warn(`[Carousel] Failed to check status for scholarship ${scholarship.id}:`, error.response?.data || error.message);
                    return { id: scholarship.id, applied: false };
                }
            });

            const statuses = await Promise.all(statusPromises);
            const statusMap = statuses.reduce((acc, curr) => {
                if (curr.id) acc[curr.id] = curr.applied;
                return acc;
            }, {});
            setApplicationStatus(statusMap);
        } catch (error) {
            console.error('[Carousel] Error fetching application statuses:', error);
        }
    }, [featuredScholarships]);

    useEffect(() => {
        fetchApplicationStatus();
    }, [fetchApplicationStatus]);



    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
        setImageError(false);
    }, []);

    const handleImageError = useCallback(() => {
        console.error('[Carousel] Image failed to load:', imageSrc);
        setImageError(true);
        setImageLoaded(true); // Tetap set true agar skeleton hilang, error styling akan aktif
    }, [imageSrc]);

    const handlePrevClick = useCallback((e) => {
        e.preventDefault(); e.stopPropagation();
        if (typeof handlePrevFeatured === 'function') handlePrevFeatured();
    }, [handlePrevFeatured]);

    const handleNextClick = useCallback((e) => {
        e.preventDefault(); e.stopPropagation();
        if (typeof handleNextFeatured === 'function') handleNextFeatured();
    }, [handleNextFeatured]);



    const handleApplyClick = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login or register to apply for this scholarship.');
            navigate('/');
            return;
        }
        if (!isApplied && currentFeatured?.id && typeof handleViewDetails === 'function') {
            handleViewDetails(currentFeatured.id);
        }
    }, [isApplied, currentFeatured?.id, navigate, handleViewDetails]);

    const handleDotClick = useCallback((targetIndex) => {
        if (typeof handleSetCurrentFeaturedIndex === 'function') {
            handleSetCurrentFeaturedIndex(targetIndex);
        } else {
            // Fallback jika handleSetCurrentFeaturedIndex tidak disediakan
            if (targetIndex === currentFeaturedIndex || !featuredScholarships || featuredScholarships.length === 0) return;

            const diff = targetIndex - currentFeaturedIndex;
            const totalSlides = featuredScholarships.length;

            const forwardSteps = diff > 0 ? diff : (totalSlides + diff);
            const backwardSteps = diff < 0 ? -diff : (totalSlides - diff);

            if (forwardSteps <= backwardSteps) {
                if (typeof handleNextFeatured === 'function') {
                    for (let i = 0; i < forwardSteps; i++) { handleNextFeatured(); }
                }
            } else {
                if (typeof handlePrevFeatured === 'function') {
                    for (let i = 0; i < backwardSteps; i++) { handlePrevFeatured(); }
                }
            }
        }
    }, [currentFeaturedIndex, featuredScholarships, handleNextFeatured, handlePrevFeatured, handleSetCurrentFeaturedIndex]);

    if (!currentFeatured || !featuredScholarships || featuredScholarships.length === 0) {
        return (
            <section className="relative h-[43rem] flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-xl">
                <div className="text-white text-xl font-medium animate-pulse p-8 text-center">
                    {(!featuredScholarships || featuredScholarships.length === 0) ? "Loading featured scholarships..." : "No featured scholarship available at the moment."}
                </div>
            </section>
        );
    }

    return (
        <section className="relative h-[43rem] overflow-hidden rounded-lg group shadow-2xl">
            <div className="absolute inset-0">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-400 to-slate-500 animate-pulse" />
                )}
                <img
                    key={imageSrc} // Penting untuk re-render img element saat src berubah
                    src={imageSrc}
                    alt={currentFeatured.scholarshipName || 'Featured scholarship image'}
                    className={`w-full h-full object-cover transition-opacity duration-700 
                        ${imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'}
                        ${imageError ? '!opacity-100 bg-slate-200' : ''} 
                        group-hover:scale-105 transform`} // sedikit scale on group hover
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/${imageError ? '0' : '80'} via-black/${imageError ? '0' : '40'} to-transparent`} />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-8">
                <div className="max-w-4xl mx-auto space-y-6 transform transition-all duration-500 group-hover:translate-y-[-10px]">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
                        {currentFeatured.scholarshipName}
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light drop-shadow-lg">
                        Presented by {currentFeatured.partner}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg">
                            <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                                {currentFeatured.quota}
                            </div>
                            <div className="text-white/80 text-xs sm:text-sm uppercase tracking-wider">
                                Available Spots
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg">
                            <div className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                                {formatDate(currentFeatured.timeLimit)}
                            </div>
                            <div className="text-white/80 text-xs sm:text-sm uppercase tracking-wider">
                                Registration Deadline
                            </div>
                        </div>
                    </div>
                    <button
                        className={`mt-4 px-8 sm:px-12 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl ${isApplied
                            ? 'bg-white/20 text-white/60 cursor-not-allowed backdrop-blur-sm'
                            : 'bg-white text-black hover:bg-gray-100 hover:shadow-2xl active:scale-95'
                            }`}
                        onClick={handleApplyClick}
                        disabled={isApplied}
                        aria-label={isApplied ? 'Already applied to this scholarship' : 'Apply to this scholarship'}
                    >
                        {isApplied ? 'Already Applied' : 'Start Your Journey'}
                    </button>
                </div>
            </div>

            {featuredScholarships.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={handlePrevClick}
                        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 group/btn z-20 opacity-50 group-hover:opacity-100"
                        aria-label="Previous scholarship"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transform group-hover/btn:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={handleNextClick}
                        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 group/btn z-20 opacity-50 group-hover:opacity-100"
                        aria-label="Next scholarship"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4 z-20">
                        <div className="flex gap-1.5 sm:gap-2">
                            {featuredScholarships.map((scholarship, index) => (
                                <button
                                    key={scholarship.id || index} // Gunakan ID unik jika ada
                                    type="button"
                                    onClick={() => handleDotClick(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 ${index === currentFeaturedIndex
                                        ? 'w-6 sm:w-8 bg-white'
                                        : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/60 cursor-pointer'
                                        }`}
                                    aria-label={`Go to scholarship ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}

            {!imageLoaded && !imageError && ( // Tampilkan spinner hanya jika loading dan belum error
                <div className="absolute top-4 right-4 w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin z-20" />
            )}
        </section>
    );
};

export default React.memo(CarouselDashboard);