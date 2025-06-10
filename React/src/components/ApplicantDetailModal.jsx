import React from 'react';

const ApplicantDetailModal = ({ applicant, isOpen, onClose }) => {
    if (!isOpen || !applicant) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
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

    const openDocument = (url, docName) => {
        console.log('Attempting to open URL:', url);
        if (url) {
            window.open(url, '_blank');
        } else {
            alert(`Document ${docName} not available`);
        }
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Applicant Details</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {applicant.scholarship?.scholarshipName || 'N/A'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <i class="ri-close-large-line text-2xl"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Personal Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-24">Name:</span>
                                        <span className="text-sm text-gray-900">{applicant.name || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-24">Email:</span>
                                        <span className="text-sm text-gray-900">{applicant.email || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-24">NIM:</span>
                                        <span className="text-sm text-gray-900">{applicant.nim || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    </svg>
                                    Academic Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-24">University:</span>
                                        <span className="text-sm text-gray-900">{applicant.university || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-24">Major:</span>
                                        <span className="text-sm text-gray-900">{applicant.major || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-24">Semester:</span>
                                        <span className="text-sm text-gray-900">{applicant.semester || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-24">GPA:</span>
                                        <span className="text-sm text-gray-900 font-semibold">{applicant.ipk || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Address Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <span className="text-sm font-medium text-gray-600 w-24">Address:</span>
                                        <span className="text-sm text-gray-900">{applicant.address || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-24">City:</span>
                                        <span className="text-sm text-gray-900">{applicant.city || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-24">Province:</span>
                                        <span className="text-sm text-gray-900">{applicant.province || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-24">Postal:</span>
                                        <span className="text-sm text-gray-900">{applicant.postal_code || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Application Status & Documents */}
                        <div className="space-y-6">
                            {/* Application Status */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Application Status
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-32">Current Status:</span>
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(applicant.status)}`}>
                                            {applicant.status || 'Pending'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-32">Applied Date:</span>
                                        <span className="text-sm text-gray-900">{formatDate(applicant.created_at)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-32">Registration:</span>
                                        <span className="text-sm text-gray-900">{formatDate(applicant.registration_date)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Scholarship Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    Scholarship Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-32">Scholarship:</span>
                                        <span className="text-sm text-gray-900">{applicant.scholarship?.scholarshipName || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600 w-32">ID:</span>
                                        <span className="text-sm text-gray-900">{applicant.scholarship_id || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Documents
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-900">Recommendation Letter</span>
                                        </div>
                                        <button
                                            onClick={() => openDocument(applicant.recommendation_letter, 'Recommendation Letter')}
                                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                            disabled={!applicant.recommendation_letter}
                                        >
                                            {applicant.recommendation_letter ? 'View' : 'N/A'}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-900">Statement Letter</span>
                                        </div>
                                        <button
                                            onClick={() => openDocument(applicant.statement_letter, 'Statement Letter')}
                                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                            disabled={!applicant.statement_letter}
                                        >
                                            {applicant.statement_letter ? 'View' : 'N/A'}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-900">Grade Transcript</span>
                                        </div>
                                        <button
                                            onClick={() => openDocument(applicant.grade_transcript, 'Grade Transcript')}
                                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                            disabled={!applicant.grade_transcript}
                                        >
                                            {applicant.grade_transcript ? 'View' : 'N/A'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {applicant.note && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Notes
                                    </h3>
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-gray-700">{applicant.note}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicantDetailModal;