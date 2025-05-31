import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api";

const ScholarshipApplicants = ({ scholarshipId, onBack }) => {
    const [applicants, setApplicants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedScholarship, setSelectedScholarship] = useState('all');
    const [scholarships, setScholarships] = useState([]);
    const [viewingApplicant, setViewingApplicant] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'under review':
                return 'bg-blue-100 text-blue-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    const filteredApplicants = applicants.filter(applicant => {
        const matchesSearch =
            applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.nim?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            selectedStatus === 'all' ||
            applicant.status.toLowerCase() === selectedStatus;

        const matchesScholarship =
            selectedScholarship === 'all' ||
            applicant.scholarship_id === parseInt(selectedScholarship);

        return matchesSearch && matchesStatus && matchesScholarship;
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token is missing. Please log in again.');
                    return;
                }

                await axios.get(`${API_URL}/admin/check-token`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const applicantsResponse = await axios.get(`${API_URL}/admin/applicants`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setApplicants(applicantsResponse.data);

                const scholarshipsResponse = await axios.get(`${API_URL}/scholarships`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setScholarships(scholarshipsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                const errorMessage = err.response?.data?.message || 'Failed to load data. Please try again.';
                if (err.response?.status === 401) {
                    setError('Session expired or invalid token. Please log in again.');
                    window.location.href = '/admin-login';
                } else {
                    setError(errorMessage);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStatusChange = async (applicantId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Authentication token is missing. Please log in again.');
                return;
            }

            const response = await axios.put(`${API_URL}/admin/applicants/${applicantId}/status`, { status: newStatus }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setApplicants(applicants.map(applicant =>
                applicant.id === applicantId
                    ? { ...applicant, status: newStatus }
                    : applicant
            ));

            window.dispatchEvent(new CustomEvent('statusUpdated', { detail: { applicantId, newStatus } }));

            if (viewingApplicant && viewingApplicant.id === applicantId) {
                setViewingApplicant({ ...viewingApplicant, status: newStatus });
            }
        } catch (err) {
            console.error('Failed to update status:', err.response ? err.response.data : err);
            const errorMessage = err.response?.data?.message || 'Failed to update status. Please try again.';
            if (err.response?.status === 401) {
                alert('Session expired or invalid token. Please log in again.');
                window.location.href = '/admin-login';
            } else if (err.response?.status === 403) {
                await refreshToken();
                const newToken = localStorage.getItem('token');
                if (newToken) {
                    const retryResponse = await axios.put(`${API_URL}/admin/applicants/${applicantId}/status`, { status: newStatus }, {
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                    });
                    setApplicants(applicants.map(applicant =>
                        applicant.id === applicantId
                            ? { ...applicant, status: newStatus }
                            : applicant
                    ));
                    if (viewingApplicant && viewingApplicant.id === applicantId) {
                        setViewingApplicant({ ...viewingApplicant, status: newStatus });
                    }
                } else {
                    alert('Failed to refresh token. Please log in again.');
                    window.location.href = '/admin-login';
                }
            } else {
                alert(errorMessage);
            }
        }
    };
    return (
        <div>
            <p>Scholarship ID: {scholarshipId}</p>
            <button onClick={onBack} className='border p-3 hover:cursor-pointer hover:bg-gray-600'>Back</button>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholarship</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplicants.length > 0 ? (
                        filteredApplicants.map((applicant) => (
                            <tr key={applicant.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {applicant.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{applicant.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{applicant.ipk}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {applicant.scholarship?.scholarshipName || "N/A"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {new Date(applicant.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(applicant.status)}`}>
                                        {applicant.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-3"
                                        onClick={() => viewApplicantDetails(applicant)}
                                    >
                                        <i className="ri-eye-line mr-1.5"></i>
                                        View
                                    </button>

                                    <select
                                        className="text-sm border border-gray-300 rounded py-1"
                                        value={applicant.status}
                                        onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Under Review">Under Review</option>
                                        <option value="Interview">Interview</option>
                                        <option value="Accepted">Accepted</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                {isLoading ? 'Loading applicants...' : 'No applicants found'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default ScholarshipApplicants