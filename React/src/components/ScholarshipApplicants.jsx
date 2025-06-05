import React, { useEffect, useState } from 'react';
import axios from 'axios';
import loginImg from '../assets/img/login.png'

const API_URL = "http://127.0.0.1:8000/api";

const ScholarshipApplicants = ({ scholarshipId, onBack }) => {
    const [applicants, setApplicants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailApplicant, setEmailApplicant] = useState(null);
    const [emailNote, setEmailNote] = useState('');
    const [emailStatus, setEmailStatus] = useState('');
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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
        const matchesScholarship = applicant.scholarship_id === parseInt(scholarshipId);
        const matchesSearch =
            applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.nim?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            selectedStatus === 'all' ||
            applicant.status.toLowerCase() === selectedStatus;
        return matchesScholarship && matchesSearch && matchesStatus;
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
                        Authorization: `Bearer ${token}`
                    },
                });

                const applicantsResponse = await axios.get(`${API_URL}/admin/applicants`, {
                    headers: { Authorization: `Bearer ${token}` },
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
    }, [scholarshipId]);

    const handleStatusChange = async (applicantId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Authentication token is missing. Please log in again.');
                return;
            }

            const response = await axios.put(`${API_URL}/admin/applicants/${applicantId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setApplicants(applicants.map(applicant =>
                applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant
            ));

            window.dispatchEvent(new CustomEvent('statusUpdated', { detail: { applicantId, newStatus } }));

            if (viewingApplicant && viewingApplicant.id === applicantId) {
                setViewingApplicant({ ...viewingApplicant, status: newStatus });
            }

            const applicant = applicants.find(app => app.id === applicantId);
            if (newStatus.toLowerCase() === 'accepted' || newStatus.toLowerCase() === 'rejected') {
                setEmailApplicant(applicant);
                setEmailStatus(newStatus);
                setEmailNote('');
                setShowEmailModal(true);
            }
        } catch (err) {
            console.error('Failed to update status:', err.response ? err.response.data : err);
            const errorMessage = err.response?.data?.message || 'Failed to update status. Please try again.';
            if (err.response?.status === 401) {
                alert('Session expired or invalid token. Please log in again.');
                window.location.href = '/admin-login';
            } else if (err.response?.status === 403) {
                const newToken = localStorage.getItem('token');
                if (newToken) {
                    const retryResponse = await axios.put(`${API_URL}/admin/applicants/${applicantId}/status`, { status: newStatus }, {
                        headers: { Authorization: `Bearer ${newToken}` },
                    });
                    setApplicants(applicants.map(applicant =>
                        applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant
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

    const handleSendEmail = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Authentication token is missing. Please log in again.');
                return;
            }

            await axios.post(`${API_URL}/admin/selections/send-email`, {
                applicant_id: emailApplicant.id,
                status: emailStatus,
                note: emailNote,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert('Email sent successfully!');
            setShowEmailModal(false);
            setEmailApplicant(null);
            setEmailStatus('');
            setEmailNote('');
        } catch (err) {
            console.error('Failed to send email:', err.response ? err.response.data : err);
            const errorMessage = err.response?.data?.message || 'Failed to send email. Please try again.';
            alert(errorMessage);
        }
    };

    const handleCloseEmailModal = () => {
        setShowEmailModal(false);
        setEmailApplicant(null);
        setEmailStatus('');
        setEmailNote('');
    };

    const viewApplicantDetails = (applicant) => {
        setViewingApplicant(applicant);
        setShowDetailModal(true);
    };

    const getCurrentScholarship = () => {
        return scholarships.find(s => s.id === parseInt(scholarshipId));
    };

    const generateClientSidePDF = () => {
        const currentScholarship = getCurrentScholarship();
        const reportDate = new Date().toLocaleDateString('id-ID');

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
            <style>
                body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 0; 
                position: relative; 
                min-height: 100vh; 
                background-image: url('${loginImg}'); /* Use imported image */
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 50%; /* Adjust size as needed */
                background-attachment: fixed;
                }
                body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: inherit;
                background-repeat: inherit;
                background-position: inherit;
                background-size: inherit;
                opacity: 0.1;
                transform: rotate(45deg);
                transform-origin: center center;
                z-index: -1;
                pointer-events: none;
                }
                .content {
                position: relative;
                z-index: 1; /* Ensure content is above the watermark */
                }
                .header {
                text-align: center;
                padding: 20px 0;
                border-bottom: 2px solid #333;
                margin-bottom: 20px;
                }
                .title { font-size: 28px; font-weight: bold; color: #333; }
                .subtitle { font-size: 18px; color: #666; margin-top: 5px; }
                .info-section { margin: 20px; }
                .info-row { display: flex; justify-content: space-between; margin: 5px 0; }
                .stats { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px; }
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
                .stat-item { text-align: center; }
                .stat-number { font-size: 24px; font-weight: bold; color: #333; }
                .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
                table { width: 100%; border-collapse: collapse; margin: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
                th { background-color: #f2f2f2; font-weight: bold; }
                .status-pending { background-color: #fef3cd; color: #856404; }
                .status-review { background-color: #cce5ff; color: #004085; }
                .status-accepted { background-color: #d4edda; color: #155724; }
                .status-rejected { background-color: #f8d7da; color: #721c24; }
                .status-interview { background-color: #e2e3ff; color: #383d41; }
                .note-cell { max-width: 200px; word-wrap: break-word; }
                .footer { margin: 30px 20px 20px; text-align: center; font-size: 10px; color: #666; }
                @media print {
                body { margin: 0; }
                @page {
                    margin: 0;
                    @top-left { content: none; }
                    @top-center { content: none; }
                    @top-right { content: none; }
                    @bottom-left { content: none; }
                    @bottom-center { content: none; }
                    @bottom-right { content: none; }
                }
                }
                .watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 80px;
                color: #000;
                opacity: 0.4;
                white-space: nowrap;
                z-index: 0;
                pointer-events: none;
                user-select: none;
                }
            </style>
            <title>Laporan Beasiswa - Scholar Hunt</title>
            </head>
            <body>
            <div class="watermark">SCHOLAR HUNT</div>
            <div class="content">
                <div class="header">
                <div class="title">LAPORAN BEASISWA</div>
                <div class="subtitle">${currentScholarship?.scholarshipName || 'Unknown Scholarship'}</div>
                </div>
                
                <div class="info-section">
                <div class="info-row">
                    <strong>Tanggal Laporan:</strong>
                    <span>${reportDate}</span>
                </div>
                <div class="info-row">
                    <strong>Total Pelamar:</strong>
                    <span>${filteredApplicants.length} orang</span>
                </div>
                <div class="info-row">
                    <strong>Filter Status:</strong>
                    <span>${selectedStatus === 'all' ? 'Semua Status' : selectedStatus}</span>
                </div>
                </div>

                <div class="stats">
                <div class="stats-grid" style="grid-template-columns: 5fr 5fr 5fr 5fr 5fr;">
                    <div class="stat-item">
                    <div class="stat-number ">${filteredApplicants.filter(a => a.status.toLowerCase() === 'pending').length}</div>
                    <div class="stat-label ">Pending</div>
                    </div>
                    <div class="stat-item">
                    <div class="stat-number">${filteredApplicants.filter(a => a.status.toLowerCase() === 'under review').length}</div>
                    <div class="stat-label">Under Review</div>
                    </div>
                    <div class="stat-item">
                    <div class="stat-number">${filteredApplicants.filter(a => a.status.toLowerCase() === 'interview').length}</div>
                    <div class="stat-label">Interview</div>
                    </div>
                    <div class="stat-item">
                    <div class="stat-number">${filteredApplicants.filter(a => a.status.toLowerCase() === 'accepted').length}</div>
                    <div class="stat-label">Accepted</div>
                    </div>
                    <div class="stat-item">
                    <div class="stat-number">${filteredApplicants.filter(a => a.status.toLowerCase() === 'rejected').length}</div>
                    <div class="stat-label">Rejected</div>
                    </div>
                </div>
                </div>

                <table>
                <thead>
                    <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>NIM</th>
                    <th>Email</th>
                    <th>GPA</th>
                    <th>Tanggal Daftar</th>
                    <th>Status</th>
                    <th>Catatan</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredApplicants.map((applicant, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${applicant.name || '-'}</td>
                        <td>${applicant.nim || '-'}</td>
                        <td>${applicant.email || '-'}</td>
                        <td>${applicant.ipk || applicant.gpa || '-'}</td>
                        <td>${new Date(applicant.created_at).toLocaleDateString('id-ID')}</td>
                        <td class="status-${applicant.status.toLowerCase().replace(' ', '-')}">${applicant.status}</td>
                        <td class="note-cell">${applicant.note || '-'}</td>
                    </tr>
                    `).join('')}
                </tbody>
                </table>

                <div class="footer">
                <p>Laporan ini dibuat secara otomatis pada ${new Date().toLocaleString('id-ID')}</p>
                <p>Scholar Hunt</p>
                </div>
            </div>
            </body>
            </html>
        `;

        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(printContent);
        doc.close();

        iframe.onload = () => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        };
    };

    const currentScholarship = getCurrentScholarship();

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Applicants for {currentScholarship?.scholarshipName || `Scholarship ID: ${scholarshipId}`}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredApplicants.length} total applicants
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={generateClientSidePDF}
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGeneratingPDF ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <i class="ri-file-add-line mr-2"></i>
                                    Export PDF
                                </>
                            )}
                        </button>
                        <button
                            onClick={onBack}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                            ← Back to Scholarships
                        </button>
                    </div>
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by name, email, or NIM..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="under review">Under Review</option>
                        <option value="interview">Interview</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-800">
                            {filteredApplicants.filter(a => a.status.toLowerCase() === 'pending').length}
                        </div>
                        <div className="text-sm text-yellow-600">Pending</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-800">
                            {filteredApplicants.filter(a => a.status.toLowerCase() === 'under review').length}
                        </div>
                        <div className="text-sm text-blue-600">Under Review</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-800">
                            {filteredApplicants.filter(a => a.status.toLowerCase() === 'interview').length}
                        </div>
                        <div className="text-sm text-purple-600">Interview</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-800">
                            {filteredApplicants.filter(a => a.status.toLowerCase() === 'accepted').length}
                        </div>
                        <div className="text-sm text-green-600">Accepted</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-800">
                            {filteredApplicants.filter(a => a.status.toLowerCase() === 'rejected').length}
                        </div>
                        <div className="text-sm text-red-600">Rejected</div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                                        Loading applicants...
                                    </div>
                                </td>
                            </tr>
                        ) : filteredApplicants.length > 0 ? (
                            filteredApplicants.map((applicant) => (
                                <tr key={applicant.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div
                                                    className="text-sm font-medium text-gray-900">
                                                    {applicant.name.length > 15
                                                        ? applicant.name.slice(0, 15) + '...'
                                                        : applicant.name}
                                                </div>
                                                {applicant.nim && (
                                                    <div className="text-sm text-gray-500">
                                                        NIM: {applicant.nim}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{applicant.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{applicant.ipk || applicant.gpa}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(applicant.created_at).toLocaleDateString('id-ID')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(applicant.status)}`}>
                                            {applicant.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                onClick={() => viewApplicantDetails(applicant)}
                                            >
                                                View Details
                                            </button>
                                            <select
                                                className="text-sm border border-gray-300 rounded py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={applicant.status}
                                                onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Under Review">Under Review</option>
                                                <option value="Interview">Interview</option>
                                                <option value="Accepted">Accepted</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No applicants found</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {searchTerm || selectedStatus !== 'all'
                                                ? 'Try adjusting your search or filter criteria.'
                                                : 'No one has applied to this scholarship yet.'}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showEmailModal && emailApplicant && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {emailStatus.toLowerCase() === 'accepted'
                                ? 'Congratulations!'
                                : 'We\'re Sorry'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {emailStatus.toLowerCase() === 'accepted'
                                ? `Dear ${emailApplicant.name}, we are pleased to inform you that your application for the scholarship has been accepted!`
                                : `Dear ${emailApplicant.name}, we regret to inform you that your application for the scholarship has been rejected.`}
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                            <textarea
                                value={emailNote}
                                onChange={(e) => setEmailNote(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Add a note for the applicant..."
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleCloseEmailModal}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendEmail}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Send Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScholarshipApplicants;