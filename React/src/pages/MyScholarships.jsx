import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const API_URL = "http://127.0.0.1:8000/api";

const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Under Review': return 'bg-blue-100 text-blue-800';
        case 'Accepted': return 'bg-green-100 text-green-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const MyScholarshipsPage = () => {
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('userEmail');
            if (!token || !email) {
                setError('No authentication token found. Please log in.');
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/my-applications`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-User-Email': email,
                    },
                });

                if (response && response.data) {
                    setApplications(response.data);
                    if (response.data.length > 0 && !selectedApplication) {
                        setSelectedApplication(response.data[0]);
                    } else if (selectedApplication) {
                        const updatedSelected = response.data.find(app => app.id === selectedApplication.id);
                        if (updatedSelected) {
                            setSelectedApplication(updatedSelected);
                        }
                    }
                    setError(null);
                }
            } catch (apiErr) {
                if (apiErr.response && apiErr.response.status === 401) {
                    await refreshToken();
                    const newToken = localStorage.getItem('token');
                    const newEmail = localStorage.getItem('userEmail');
                    if (newToken && newEmail) {
                        const retryResponse = await axios.get(`${API_URL}/my-applications`, {
                            headers: {
                                Authorization: `Bearer ${newToken}`,
                                'X-User-Email': newEmail,
                            },
                        });
                        setApplications(retryResponse.data);
                        if (retryResponse.data.length > 0 && !selectedApplication) {
                            setSelectedApplication(retryResponse.data[0]);
                        } else if (selectedApplication) {
                            const updatedSelected = retryResponse.data.find(app => app.id === selectedApplication.id);
                            if (updatedSelected) {
                                setSelectedApplication(updatedSelected);
                            }
                        }
                        setError(null);
                    } else {
                        setError('Your session has expired. Please log in again.');
                    }
                } else {
                    console.error('API error:', apiErr.response ? apiErr.response.data : apiErr.message);
                    setError('Failed to load applications. Please try again.');
                }
            }
        } catch (err) {
            console.error('General fetch error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshToken = async () => {
        try {
            const currentToken = localStorage.getItem('token');
            if (!currentToken) return;

            const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                },
            });
            localStorage.setItem('token', response.data.token); // Update token in localStorage
        } catch (err) {
            console.error('Token refresh failed:', err);
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail'); // Clear email if token refresh fails
        }
    };

    useEffect(() => {
        fetchApplications();

        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchApplications();
            }
        }, 120000); // Increase to 2 minutes

        const handleStatusUpdate = () => {
            fetchApplications();
        };
        window.addEventListener('statusUpdated', handleStatusUpdate);

        return () => {
            clearInterval(interval);
            window.removeEventListener('statusUpdated', handleStatusUpdate);
        };
    }, []);

    const filteredApplications = filter === 'all'
        ? applications
        : applications.filter(app => app.status.toLowerCase() === filter);

    const handleWithdraw = async (applicationId) => {
        const confirmed = window.confirm("Are you sure you want to withdraw this application?");
        if (confirmed) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found. Please log in.');
                    return;
                }

                await axios.delete(`${API_URL}/applicants/${applicationId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const updatedApplications = applications.map(app => {
                    if (app.id === applicationId) {
                        return { ...app, status: 'Withdrawn' };
                    }
                    return app;
                });
                setApplications(updatedApplications);

                if (selectedApplication && selectedApplication.id === applicationId) {
                    const updated = updatedApplications.find(app => app.id === applicationId);
                    setSelectedApplication(updated);
                }
            } catch (err) {
                // Special handling for authentication errors
                if (err.response && err.response.status === 401) {
                    setError('Your session has expired. Please log in again.');
                } else {
                    console.error('Failed to withdraw application:', err);
                    alert('Failed to withdraw application. Please try again.');
                }
            }
        }
    };

    // Handle session expiration error - show login button if token error
    if (error && error.includes('session has expired')) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
                <main className="flex-grow container mx-auto px-6 py-[15vh]">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Session Expired</h2>
                        <p className="text-gray-600 mb-6">Your session has expired. Please log in again to continue.</p>
                        <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full">
                            Log In
                        </a>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
            <main className="flex-grow container mx-auto px-6 py-[15vh]">
                <h1 className="text-3xl font-bold text-white mb-6">My Scholarships</h1>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <div className="mb-6 flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-white text-blue-600' : 'bg-blue-600/50 text-white'} font-medium`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-full ${filter === 'pending' ? 'bg-white text-yellow-600' : 'bg-yellow-600/50 text-white'} font-medium`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('under review')}
                        className={`px-4 py-2 rounded-full ${filter === 'under review' ? 'bg-white text-blue-600' : 'bg-blue-600/50 text-white'} font-medium`}
                    >
                        Under Review
                    </button>
                    <button
                        onClick={() => setFilter('accepted')}
                        className={`px-4 py-2 rounded-full ${filter === 'accepted' ? 'bg-white text-green-600' : 'bg-green-600/50 text-white'} font-medium`}
                    >
                        Accepted
                    </button>
                    <button
                        onClick={() => setFilter('rejected')}
                        className={`px-4 py-2 rounded-full ${filter === 'rejected' ? 'bg-white text-red-600' : 'bg-red-600/50 text-white'} font-medium`}
                    >
                        Rejected
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center my-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                        <p className="mt-2">Loading...</p>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No applications found</h2>
                        <p className="text-gray-600 mb-6">You haven't applied for any scholarships matching this filter yet.</p>
                        <a href="/scholarships" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full">
                            Browse Available Scholarships
                        </a>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-4 h-[70vh] overflow-y-auto scrollbar-custom">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">My Applications</h2>

                            {filteredApplications.map((application) => (
                                <div
                                    key={application.id}
                                    onClick={() => setSelectedApplication(application)}
                                    className={`p-4 mb-3 rounded-lg cursor-pointer transition-all ${selectedApplication?.id === application.id
                                        ? 'bg-blue-100 border-l-4 border-blue-500'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                            <img
                                                src={application.logo}
                                                alt={application.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="ml-4 flex-grow">
                                            <h3 className="font-medium">{application.name}</h3>
                                            <p className="text-sm text-gray-600">{application.partner}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(application.status)}`}>
                                                    {application.status}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Applied: {application.applicationDate ? new Date(application.applicationDate).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedApplication && (
                            <div className="w-full lg:w-4/5 bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="bg-gray-50 border-b p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                                <img
                                                    src={selectedApplication.logo}
                                                    alt={selectedApplication.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h1 className="text-2xl font-bold text-gray-800">{selectedApplication.name}</h1>
                                                <p className="text-gray-600">Offered by {selectedApplication.partner}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`inline-block px-4 py-2 rounded-full font-medium ${getStatusColor(selectedApplication.status)}`}>
                                                {selectedApplication.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 h-[calc(70vh-8rem)] overflow-y-auto">
                                    <div className="mb-8">
                                        <h2 className="text-xl font-bold mb-4">Application Progress</h2>
                                        <div className="relative">
                                            <div className="h-2 bg-gray-200 rounded-full">
                                                <div
                                                    className={`h-full rounded-full ${selectedApplication.status === 'Rejected'
                                                        ? 'bg-red-500'
                                                        : 'bg-blue-500'
                                                        }`}
                                                    style={{ width: `${(selectedApplication.progressStage / 3) * 100}%` }}
                                                ></div>
                                            </div>

                                            <div className="flex justify-between mt-2">
                                                <div className={`text-center ${selectedApplication.progressStage >= 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                    <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${selectedApplication.progressStage >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                                        ✓
                                                    </div>
                                                    <p className="text-xs mt-1">Submitted</p>
                                                </div>
                                                <div className={`text-center ${selectedApplication.progressStage >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                    <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${selectedApplication.progressStage >= 1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                                        👁️
                                                    </div>
                                                    <p className="text-xs mt-1">Under Review</p>
                                                </div>
                                                <div className={`text-center ${selectedApplication.progressStage >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                    <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${selectedApplication.progressStage >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                                        💬
                                                    </div>
                                                    <p className="text-xs mt-1">Interview</p>
                                                </div>
                                                <div className={`text-center ${selectedApplication.progressStage >= 3
                                                    ? selectedApplication.status === 'Rejected'
                                                        ? 'text-red-600'
                                                        : 'text-green-600'
                                                    : 'text-gray-400'
                                                    }`}>
                                                    <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${selectedApplication.progressStage >= 3
                                                        ? selectedApplication.status === 'Rejected'
                                                            ? 'bg-red-100 text-red-600'
                                                            : 'bg-green-100 text-green-600'
                                                        : 'bg-gray-100 text-gray-400'
                                                        }`}>
                                                        {selectedApplication.status === 'Rejected' ? '✕' : '✓'}
                                                    </div>
                                                    <p className="text-xs mt-1">Decision</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                            <h3 className="text-lg font-semibold mb-3">Application Details</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Application Date:</span>
                                                    <span className="font-medium">
                                                        {selectedApplication.applicationDate
                                                            ? new Date(selectedApplication.applicationDate).toLocaleDateString()
                                                            : 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Status:</span>
                                                    <span className={`font-medium ${selectedApplication.status === 'Accepted' ? 'text-green-600' :
                                                        selectedApplication.status === 'Rejected' ? 'text-red-600' :
                                                            'text-blue-600'
                                                        }`}>{selectedApplication.status}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Application ID:</span>
                                                    <span className="font-medium">APP-{String(selectedApplication.id).padStart(4, '0')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                            <h3 className="text-lg font-semibold mb-3">Applicant Information</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Student ID (NIM):</span>
                                                    <span className="font-medium">{selectedApplication.applicantData.studentId}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Next Semester:</span>
                                                    <span className="font-medium">{selectedApplication.applicantData.nextSemester}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Major:</span>
                                                    <span className="font-medium">{selectedApplication.applicantData.major}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">GPA:</span>
                                                    <span className="font-medium">{selectedApplication.applicantData.gpa}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold mb-3">Uploaded Documents</h3>
                                        <div className="bg-gray-50 rounded-lg border border-gray-200">
                                            <ul className="divide-y divide-gray-200">
                                                {selectedApplication.uploadedDocuments.map((doc, index) => (
                                                    <li key={index} className="flex items-center justify-between p-4">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center mr-3">
                                                                📄
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{doc.name}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    Uploaded on {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="text-sm text-gray-500 mr-4">{doc.size}</span>
                                                            <button className="text-blue-600 hover:text-blue-800">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                                        <a
                                            href={`/scholarships/${selectedApplication.scholarshipId}`}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
                                        >
                                            View Scholarship Details
                                        </a>

                                        {(selectedApplication.status === 'Pending' || selectedApplication.status === 'Under Review') && (
                                            <button
                                                onClick={() => handleWithdraw(selectedApplication.id)}
                                                className="bg-white border border-red-500 text-red-500 hover:bg-red-50 font-medium py-2 px-6 rounded-full transition-colors"
                                            >
                                                Withdraw Application
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyScholarshipsPage;