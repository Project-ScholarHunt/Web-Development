import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Link, useNavigate } from 'react-router';
import { alertConfirm, alertError, alertSuccess } from '../lib/alert';

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

const MyScholarships = () => {
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const fetchApplications = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('user');
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
            localStorage.setItem('token', response.data.token);
        } catch (err) {
            console.error('Token refresh failed:', err);
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
        }
    };

    useEffect(() => {
        document.title = 'My Scholarships';
        fetchApplications();

        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchApplications();
            }
        }, 120000);

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
        if (await alertConfirm('Are you sure you want to withdraw your scholarship application?')) {
            console.log('Withdrawing application:', applicationId);
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

                alertSuccess('Application withdrawn successfully.');

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
                if (err.response && err.response.status === 401) {
                    setError('User not identified. Please log in again.');
                } else {
                    console.error('Failed to withdraw application:', err);
                    alertError('Failed to withdraw application. Please try again.');
                }
            }
        }
    };

    if (error && error.includes('session has expired')) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-200">
                <main className="flex-grow container mx-auto px-6 py-[15vh]">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Session Expired</h2>
                        <p className="text-gray-600 mb-6">Your session has expired. Please log in again to continue.</p>
                        <Link
                            to="/"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full">
                            Log In
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <main className="flex-grow container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Scholarships</h1>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mb-6 bg-white p-4 rounded-lg shadow-sm">
                    <select
                        className="md:hidden bg-gray-200 text-gray-900 rounded-lg p-2 w-full"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="under review">Under Review</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <div className="hidden md:flex flex-wrap gap-2 w-full">
                        {['all', 'pending', 'under review', 'accepted', 'rejected'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900 hover:bg-blue-100'
                                    }`}
                            >
                                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center my-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading...</p>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Applications Found</h2>
                        <p className="text-gray-600 mb-6">You haven't applied for any scholarships matching this filter yet.</p>
                        <a
                            href="/scholarships"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
                        >
                            Browse Available Scholarships
                        </a>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-sm p-6 h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">My Applications</h2>
                            {filteredApplications.map((application) => (
                                <div
                                    key={application.id}
                                    onClick={() => setSelectedApplication(application)}
                                    className={`p-4 mb-3 rounded-lg cursor-pointer transition-all ${selectedApplication?.id === application.id
                                        ? 'bg-blue-50 border-l-4 border-blue-500'
                                        : 'bg-gray-50 hover:bg-blue-50'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                            <img
                                                src={application.logo}
                                                alt={application.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-3 flex-grow">
                                            <h3 className="font-medium text-gray-900 text-sm">{application.name}</h3>
                                            <p className="text-xs text-gray-600">{application.partner}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(application.status)}`}>
                                                    {application.status}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {application.applicationDate ? new Date(application.applicationDate).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedApplication && (
                            <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-sm p-6 h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                            <img
                                                src={selectedApplication.logo}
                                                alt={selectedApplication.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <h1 className="text-xl font-bold text-gray-800">{selectedApplication.name}</h1>
                                            <p className="text-sm text-gray-600">Offered by {selectedApplication.partner}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(selectedApplication.status)}`}>
                                        {selectedApplication.status}
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-base font-semibold text-gray-800 mb-3">Application Progress</h2>
                                    <div className="relative">
                                        <div className="h-2 bg-gray-200 rounded-full">
                                            <div
                                                className={`h-full rounded-full ${selectedApplication.status === 'Rejected' ? 'bg-red-500' : 'bg-blue-500'}`}
                                                style={{ width: `${(selectedApplication.progressStage / 2) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <div className={`text-center ${selectedApplication.progressStage >= 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${selectedApplication.progressStage >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    <i className="ri-check-line"></i>
                                                </div>
                                                <p className="text-xs mt-1">Submitted</p>
                                            </div>
                                            <div className={`text-center ${selectedApplication.progressStage >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${selectedApplication.progressStage >= 1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    <i className="ri-survey-line"></i>
                                                </div>
                                                <p className="text-xs mt-1">Under Review</p>
                                            </div>
                                            <div className={`text-center ${selectedApplication.progressStage >= 2 ? selectedApplication.status === 'Rejected' ? 'text-red-600' : 'text-green-600' : 'text-gray-400'}`}>
                                                <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${selectedApplication.progressStage >= 2 ? selectedApplication.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    {selectedApplication.status === 'Rejected' ? <i className="ri-close-fill"></i> : <i className="ri-medal-line"></i>}
                                                </div>
                                                <p className="text-xs mt-1">Decision</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <h3 className="text-base font-semibold text-gray-800 mb-2">Application Details</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Application Date:</span>
                                                <span className="font-medium text-gray-900">
                                                    {selectedApplication.applicationDate ? new Date(selectedApplication.applicationDate).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Status:</span>
                                                <span className={`font-medium ${selectedApplication.status === 'Accepted' ? 'text-green-600' : selectedApplication.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'}`}>
                                                    {selectedApplication.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Application ID:</span>
                                                <span className="font-medium text-gray-900">APP-{String(selectedApplication.id).padStart(4, '0')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <h3 className="text-base font-semibold text-gray-800 mb-2">Applicant Information</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Student ID (NIM):</span>
                                                <span className="font-medium text-gray-900">{selectedApplication.applicantData.studentId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Next Semester:</span>
                                                <span className="font-medium text-gray-900">{selectedApplication.applicantData.nextSemester}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Major:</span>
                                                <span className="font-medium text-gray-900">{selectedApplication.applicantData.major}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">GPA:</span>
                                                <span className="font-medium text-gray-900">{selectedApplication.applicantData.gpa}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-base font-semibold text-gray-800 mb-2">Uploaded Documents</h3>
                                    <div className="bg-gray-100 rounded-lg border border-gray-200">
                                        <ul className="divide-y divide-gray-200">
                                            {selectedApplication.uploadedDocuments.map((doc, index) => (
                                                <li key={index} className="flex items-center justify-between p-3">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center mr-3 text-sm">
                                                            <i className="ri-file-pdf-2-line"></i>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                Uploaded on {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {doc.path ? (
                                                            <a
                                                                href={doc.path}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                <i className="ri-download-2-line text-lg"></i>
                                                            </a>
                                                        ) : (
                                                            <span className="text-sm text-gray-500">No file</span>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-4">
                                    <button
                                        onClick={() => navigate(`/scholarships?id=${selectedApplication.scholarshipId}`)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
                                    >
                                        View Scholarship Details
                                    </button>
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
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};
export default MyScholarships;