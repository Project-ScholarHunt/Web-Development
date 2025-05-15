import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

// Mock data untuk beasiswa yang telah dilamar - disesuaikan dengan crowfoot ERD yang Anda miliki
const myApplicationsData = [
    {
        id: 1,
        scholarshipId: 1,
        name: 'Scholarship A',
        partner: 'Partner A',
        logo: 'https://via.placeholder.com/150',
        status: 'Pending',
        applicationDate: '2023-05-10',
        progressStage: 0, // 0-3: 0=Submitted, 1=Under Review, 2=Interview, 3=Decision
        applicantData: {
            studentId: '12345678',
            nextSemester: '5',
            major: 'Computer Science',
            gpa: '3.75',
        },
        uploadedDocuments: [
            { name: 'Recommendation_Letter.pdf', size: '420KB', uploadedAt: '2023-05-10' },
            { name: 'Statement_Letter.pdf', size: '350KB', uploadedAt: '2023-05-10' },
            { name: 'Grade_Transcript.pdf', size: '1.2MB', uploadedAt: '2023-05-10' },
        ],
    },
    {
        id: 2,
        scholarshipId: 3,
        name: 'Scholarship C',
        partner: 'Partner C',
        logo: 'https://via.placeholder.com/150',
        status: 'Under Review',
        applicationDate: '2023-04-25',
        progressStage: 1, // 0-3: 0=Submitted, 1=Under Review, 2=Interview, 3=Decision
        applicantData: {
            studentId: '12345678',
            nextSemester: '5',
            major: 'Computer Science',
            gpa: '3.75',
        },
        uploadedDocuments: [
            { name: 'Recommendation_Letter.pdf', size: '420KB', uploadedAt: '2023-04-25' },
            { name: 'Statement_Letter.pdf', size: '350KB', uploadedAt: '2023-04-25' },
            { name: 'Grade_Transcript.pdf', size: '1.2MB', uploadedAt: '2023-04-25' },
        ],
    },
    {
        id: 3,
        scholarshipId: 5,
        name: 'Scholarship E',
        partner: 'Partner E',
        logo: 'https://via.placeholder.com/150',
        status: 'Accepted',
        applicationDate: '2023-03-15',
        progressStage: 3, // 0-3: 0=Submitted, 1=Under Review, 2=Interview, 3=Decision
        applicantData: {
            studentId: '12345678',
            nextSemester: '5',
            major: 'Computer Science',
            gpa: '3.75',
        },
        uploadedDocuments: [
            { name: 'Recommendation_Letter.pdf', size: '420KB', uploadedAt: '2023-03-15' },
            { name: 'Statement_Letter.pdf', size: '350KB', uploadedAt: '2023-03-15' },
            { name: 'Grade_Transcript.pdf', size: '1.2MB', uploadedAt: '2023-03-15' },
        ],
    },
    {
        id: 4,
        scholarshipId: 2,
        name: 'Scholarship B',
        partner: 'Partner B',
        logo: 'https://via.placeholder.com/150',
        status: 'Rejected',
        applicationDate: '2023-02-20',
        progressStage: 3, // 0-3: 0=Submitted, 1=Under Review, 2=Interview, 3=Decision
        applicantData: {
            studentId: '12345678',
            nextSemester: '4',
            major: 'Computer Science',
            gpa: '3.75',
        },
        uploadedDocuments: [
            { name: 'Recommendation_Letter.pdf', size: '420KB', uploadedAt: '2023-02-20' },
            { name: 'Statement_Letter.pdf', size: '350KB', uploadedAt: '2023-02-20' },
            { name: 'Grade_Transcript.pdf', size: '1.2MB', uploadedAt: '2023-02-20' },
        ],
    },
];

// Fungsi untuk mendapatkan warna badge berdasarkan status
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
    const [applications, setApplications] = useState(myApplicationsData);
    const [filter, setFilter] = useState('all');

    // Inisialisasi selectedApplication pada saat halaman dimuat
    useEffect(() => {
        if (applications.length > 0 && !selectedApplication) {
            setSelectedApplication(applications[0]);
        }
    }, [applications, selectedApplication]);

    // Filter aplikasi berdasarkan status
    const filteredApplications = filter === 'all'
        ? applications
        : applications.filter(app => app.status.toLowerCase() === filter);

    // Fungsi untuk memproses withdraw application
    const handleWithdraw = (applicationId) => {
        // Di produksi, ini akan memanggil API untuk membatalkan aplikasi
        const confirmed = window.confirm("Are you sure you want to withdraw this application?");
        if (confirmed) {
            // Update status aplikasi menjadi "Withdrawn"
            const updatedApplications = applications.map(app => {
                if (app.id === applicationId) {
                    return { ...app, status: 'Withdrawn' };
                }
                return app;
            });
            setApplications(updatedApplications);

            // Update selectedApplication jika yang dibatalkan adalah yang sedang dipilih
            if (selectedApplication && selectedApplication.id === applicationId) {
                const updated = updatedApplications.find(app => app.id === applicationId);
                setSelectedApplication(updated);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
            <Navbar />

            <main className="flex-grow container mx-auto px-6 py-[15vh]">
                <h1 className="text-3xl font-bold text-white mb-6">My Scholarships</h1>

                {/* Filter options */}
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

                {filteredApplications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No applications found</h2>
                        <p className="text-gray-600 mb-6">You haven't applied for any scholarships matching this filter yet.</p>
                        <a href="/scholarships" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full">
                            Browse Available Scholarships
                        </a>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Panel - Application List */}
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
                                                    Applied: {new Date(application.applicationDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Panel - Application Detail */}
                        {selectedApplication && (
                            <div className="w-full lg:w-4/5 bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Header */}
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

                                {/* Detail Content - Scrollable */}
                                <div className="p-6 h-[calc(70vh-8rem)] overflow-y-auto">
                                    {/* Status Tracker */}
                                    <div className="mb-8">
                                        <h2 className="text-xl font-bold mb-4">Application Progress</h2>
                                        <div className="relative">
                                            {/* Progress Bar */}
                                            <div className="h-2 bg-gray-200 rounded-full">
                                                <div
                                                    className={`h-full rounded-full ${selectedApplication.status === 'Rejected'
                                                            ? 'bg-red-500'
                                                            : 'bg-blue-500'
                                                        }`}
                                                    style={{ width: `${(selectedApplication.progressStage / 3) * 100}%` }}
                                                ></div>
                                            </div>

                                            {/* Timeline Steps */}
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

                                    {/* Application Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                            <h3 className="text-lg font-semibold mb-3">Application Details</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Application Date:</span>
                                                    <span className="font-medium">{new Date(selectedApplication.applicationDate).toLocaleDateString()}</span>
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

                                    {/* Documents */}
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
                                                                <p className="text-xs text-gray-500">Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}</p>
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

                                    {/* Action Buttons */}
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

            <Footer />
        </div>
    );
};

export default MyScholarshipsPage;
