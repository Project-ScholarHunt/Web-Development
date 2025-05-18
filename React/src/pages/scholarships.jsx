import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import axios from 'axios';
import Loading from '../components/Loading';
import Error from '../components/Error';

const ScholarshipsPage = () => {
    const [scholarships, setScholarships] = useState([]);
    const [selectedScholarship, setSelectedScholarship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const scholarshipId = queryParams.get('id');
    const searchTerm = queryParams.get('search');

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                setLoading(true);

                if (scholarshipId) {
                    const response = await axios.get(`http://127.0.0.1:8000/api/scholarships/${scholarshipId}`);
                    setScholarships([response.data]);
                    setSelectedScholarship(response.data);
                }
                else if (searchTerm) {
                    const response = await axios.get(`http://127.0.0.1:8000/api/scholarships/search/${encodeURIComponent(searchTerm)}`);
                    setScholarships(response.data);

                    if (response.data.length > 0) {
                        setSelectedScholarship(response.data[0]);
                    }
                }
                else {
                    const response = await axios.get('http://127.0.0.1:8000/api/scholarships');
                    setScholarships(response.data);

                    if (response.data.length > 0) {
                        setSelectedScholarship(response.data[0]);
                    }
                }
            } catch (err) {
                console.error('Error fetching scholarships:', err);
                setError('Failed to load scholarships. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchScholarships();
    }, [scholarshipId, searchTerm]);

    const formatTimeLimit = (timeLimit) => {
        if (!timeLimit) return 'N/A';

        try {
            if (typeof timeLimit === 'string' && timeLimit.includes('-')) {
                const date = new Date(timeLimit);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
            return timeLimit;
        } catch (e) {
            return timeLimit;
        }
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return (
            <Error error={error}/>
        );
    }

    if (scholarships.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
                <div className="flex-grow container mx-auto px-6 py-[15vh] flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-2">No Scholarships Found</h2>
                        {searchTerm ? (
                            <p>No scholarships found matching "{searchTerm}". Please try a different search term.</p>
                        ) : (
                            <p>There are currently no scholarships available. Please check back later.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <main className="flex-grow container mx-auto px-6 py-[15vh]">
                <h1 className="text-3xl font-bold text-white mb-6">
                    {searchTerm ? `Search Results for "${searchTerm}"` : "Scholarships"}
                </h1>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Panel - Scholarship List - Only show if we're not looking at a specific scholarship */}
                    {!scholarshipId && (
                        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md p-4 h-[70vh] overflow-y-auto scrollbar-custom">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                {searchTerm ? `Found ${scholarships.length} scholarships` : "Available Scholarships"}
                            </h2>

                            {scholarships.map((scholarship) => (
                                <div
                                    key={scholarship.id}
                                    onClick={() => setSelectedScholarship(scholarship)}
                                    className={`p-4 mb-3 rounded-lg cursor-pointer transition-all ${selectedScholarship && selectedScholarship.id === scholarship.id
                                        ? 'bg-blue-100 border-l-4 border-blue-500'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                            <img
                                                src={scholarship.logo || '/placeholder-logo.png'}
                                                alt={scholarship.scholarshipName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-logo.png';
                                                }}
                                            />
                                        </div>

                                        <div className="ml-4">
                                            <h3 className="font-medium">{scholarship.scholarshipName}</h3>
                                            <p className="text-sm text-gray-600">{scholarship.partner}</p>
                                            <div className="flex items-center mt-1">
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                    Quota: {scholarship.quota}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Right Panel - Scholarship Detail */}
                    {selectedScholarship && (
                        <div className={`w-full ${!scholarshipId ? 'md:w-4/5' : ''} bg-white rounded-sm shadow-md overflow-hidden`}>
                            {/* Header with Thumbnail */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={selectedScholarship.thumbnail || '/placeholder-thumbnail.png'}
                                    alt={selectedScholarship.scholarshipName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-thumbnail.png';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                    <div className="p-6 text-white">
                                        <h1 className="text-2xl font-bold">{selectedScholarship.scholarshipName}</h1>
                                        <p className="opacity-90">Offered by {selectedScholarship.partner}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Detail Content - Scrollable */}
                            <div className="p-6 h-[calc(70vh-16rem)] overflow-y-auto">
                                {/* Quick Info */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Quota</p>
                                        <p className="text-lg font-semibold">{selectedScholarship.quota} Students</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500">Time Limit</p>
                                        <p className="text-lg font-semibold">{formatTimeLimit(selectedScholarship.timeLimit)}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold mb-2">Description</h2>
                                    <div className="text-gray-600">
                                        <p>{selectedScholarship.description}</p>
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold mb-2">Terms and Conditions</h2>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-gray-700">{selectedScholarship.termsAndConditions}</p>
                                    </div>
                                </div>

                                {/* Apply Button */}
                                <div className="mt-6 flex justify-center">
                                    <button className="bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg">
                                        Apply for Scholarship
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ScholarshipsPage;