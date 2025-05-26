import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    const [applicationStatus, setApplicationStatus] = useState({});

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const scholarshipId = queryParams.get('id');
    const searchTerm = queryParams.get('search');

    const fetchApplicationStatus = useCallback(async (scholarshipList) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found, skipping application status fetch');
            return;
        }
        if (!scholarshipList || scholarshipList.length === 0) {
            console.log('Scholarship list is empty, skipping application status fetch');
            return;
        }

        const statusPromises = scholarshipList.map(async (scholarship) => {
            try {
                const statusResponse = await axios.get(`http://127.0.0.1:8000/api/applicants/check/${scholarship.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                return { id: scholarship.id, applied: statusResponse.data.applied };
            } catch (err) {
                console.error(`Error checking status for scholarship ${scholarship.id}:`, err.response?.data || err.message);
                return { id: scholarship.id, applied: false };
            }
        });

        const statuses = await Promise.all(statusPromises);
        const statusMap = statuses.reduce((acc, curr) => {
            acc[curr.id] = curr.applied;
            return acc;
        }, {});
        setApplicationStatus(statusMap);
    }, []);

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                setLoading(true);

                let response;
                if (scholarshipId) {
                    response = await axios.get(`http://127.0.0.1:8000/api/scholarships/${scholarshipId}`);
                    setScholarships([response.data]);
                    setSelectedScholarship(response.data);
                } else if (searchTerm) {
                    response = await axios.get(`http://127.0.0.1:8000/api/scholarships/search/${encodeURIComponent(searchTerm)}`);
                    setScholarships(response.data);
                    if (response.data.length > 0) {
                        setSelectedScholarship(response.data[0]);
                    }
                } else {
                    response = await axios.get('http://127.0.0.1:8000/api/scholarships');
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

    useEffect(() => {
        if (scholarships.length > 0) {
            fetchApplicationStatus(scholarships);
        }
    }, [scholarships, fetchApplicationStatus]);

    useEffect(() => {
        if (location.state?.refresh && scholarships.length > 0) {
            fetchApplicationStatus(scholarships);
            navigate(location.pathname + location.search, { replace: true, state: {} });
        }
    }, [location.state, scholarships, navigate, location.pathname, location.search, fetchApplicationStatus]);

    const formatTimeLimit = (timeLimit) => {
        if (!timeLimit) return 'N/A';
        try {
            if (typeof timeLimit === 'string' && timeLimit.includes('-')) {
                const date = new Date(timeLimit);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            }
            return timeLimit;
        } catch (e) {
            return timeLimit;
        }
    };

    const handleApplyClick = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login or register to apply for this scholarship.');
            navigate('/login');
            return;
        }

        if (selectedScholarship) {
            if (applicationStatus[selectedScholarship.id]) {
                alert('You have already registered for this scholarship.');
            } else {
                navigate(`/apply?scholarship_id=${selectedScholarship.id}`);
            }
        }
    };

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;
    if (scholarships.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
                <Navbar />
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
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto px-6 py-[15vh]">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    {searchTerm ? `Search Results for "${searchTerm}"` : "Scholarships"}
                </h1>
                <div className="flex flex-col md:flex-row gap-6">
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

                    {selectedScholarship && (
                        <div className={`w-full ${!scholarshipId ? 'md:w-4/5' : ''} bg-white rounded-sm shadow-md overflow-hidden`}>
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

                            <div className="p-6 h-[calc(70vh-16rem)] overflow-y-auto">
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

                                <div className="mb-6">
                                    <h2 className="text-xl font-bold mb-2">Description</h2>
                                    <div className="text-gray-600">
                                        <p>{selectedScholarship.description}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-xl font-bold mb-2">Terms and Conditions</h2>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-gray-700">{selectedScholarship.termsAndConditions}</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={handleApplyClick}
                                        className={`bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg ${applicationStatus[selectedScholarship.id] ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : 'hover:bg-blue-700'
                                            }`}
                                        disabled={applicationStatus[selectedScholarship.id] || false}
                                    >
                                        {applicationStatus[selectedScholarship.id] ? 'Registered' : 'Apply for Scholarship'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ScholarshipsPage;