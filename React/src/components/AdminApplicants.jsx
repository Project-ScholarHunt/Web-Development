// AdminApplicants.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api";

const AdminApplicants = () => {
    const [applicants, setApplicants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedScholarship, setSelectedScholarship] = useState('all');
    const [scholarships, setScholarships] = useState([]);
    const [viewingApplicant, setViewingApplicant] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Data dummy untuk beasiswa
    const dummyScholarships = [
        { id: 1, scholarshipName: "Beasiswa Pendidikan Indonesia" },
        { id: 2, scholarshipName: "LPDP Scholarship" },
        { id: 3, scholarshipName: "Beasiswa Unggulan Kemendikbud" },
        { id: 4, scholarshipName: "Beasiswa Djarum" },
        { id: 5, scholarshipName: "Beasiswa Bank Indonesia" }
    ];

    // Data dummy untuk applicants
    const dummyApplicants = [
        {
            id: 1,
            name: "Budi Santoso",
            email: "budi.santoso@gmail.com",
            nim: "1301190001",
            semester: "5",
            university: "Universitas Indonesia",
            major: "Teknik Informatika",
            ipk: "3.85",
            address: "Jl. Margonda Raya No. 100",
            city: "Depok",
            province: "Jawa Barat",
            postal_code: "16424",
            recommendation_letter: "/dummy/recommendation_budi.pdf",
            statement_letter: "/dummy/statement_budi.pdf",
            grade_transcript: "/dummy/transcript_budi.pdf",
            profile_photo: "https://randomuser.me/api/portraits/men/1.jpg",
            scholarship_id: 1,
            scholarship: { id: 1, scholarshipName: "Beasiswa Pendidikan Indonesia" },
            status: "pending",
            created_at: "2023-05-10T08:30:00Z"
        },
        {
            id: 2,
            name: "Dewi Lestari",
            email: "dewi.lestari@gmail.com",
            nim: "1301190045",
            semester: "7",
            university: "Institut Teknologi Bandung",
            major: "Teknik Elektro",
            ipk: "3.92",
            address: "Jl. Ganesha No. 10",
            city: "Bandung",
            province: "Jawa Barat",
            postal_code: "40132",
            recommendation_letter: "/dummy/recommendation_dewi.pdf",
            statement_letter: "/dummy/statement_dewi.pdf",
            grade_transcript: "/dummy/transcript_dewi.pdf",
            profile_photo: "https://randomuser.me/api/portraits/women/2.jpg",
            scholarship_id: 2,
            scholarship: { id: 2, scholarshipName: "LPDP Scholarship" },
            status: "approved",
            created_at: "2023-05-05T10:15:00Z"
        },
        {
            id: 3,
            name: "Arif Wijaya",
            email: "arif.wijaya@gmail.com",
            nim: "1301190078",
            semester: "6",
            university: "Universitas Gadjah Mada",
            major: "Ilmu Komputer",
            ipk: "3.65",
            address: "Jl. Bulaksumur No. 55",
            city: "Yogyakarta",
            province: "DI Yogyakarta",
            postal_code: "55281",
            recommendation_letter: "/dummy/recommendation_arif.pdf",
            statement_letter: "/dummy/statement_arif.pdf",
            grade_transcript: "/dummy/transcript_arif.pdf",
            profile_photo: null,
            scholarship_id: 3,
            scholarship: { id: 3, scholarshipName: "Beasiswa Unggulan Kemendikbud" },
            status: "rejected",
            created_at: "2023-05-08T14:45:00Z"
        },
        {
            id: 4,
            name: "Siti Nurhaliza",
            email: "siti.nurhaliza@gmail.com",
            nim: "1301190112",
            semester: "4",
            university: "Universitas Diponegoro",
            major: "Sistem Informasi",
            ipk: "3.78",
            address: "Jl. Prof. Soedarto No. 20",
            city: "Semarang",
            province: "Jawa Tengah",
            postal_code: "50275",
            recommendation_letter: "/dummy/recommendation_siti.pdf",
            statement_letter: "/dummy/statement_siti.pdf",
            grade_transcript: "/dummy/transcript_siti.pdf",
            profile_photo: "https://randomuser.me/api/portraits/women/4.jpg",
            scholarship_id: 4,
            scholarship: { id: 4, scholarshipName: "Beasiswa Djarum" },
            status: "pending",
            created_at: "2023-05-12T09:20:00Z"
        },
        {
            id: 5,
            name: "Rudi Hartono",
            email: "rudi.hartono@gmail.com",
            nim: "1301190156",
            semester: "8",
            university: "Universitas Airlangga",
            major: "Ekonomi Bisnis",
            ipk: "3.52",
            address: "Jl. Airlangga No. 15",
            city: "Surabaya",
            province: "Jawa Timur",
            postal_code: "60286",
            recommendation_letter: "/dummy/recommendation_rudi.pdf",
            statement_letter: "/dummy/statement_rudi.pdf",
            grade_transcript: "/dummy/transcript_rudi.pdf",
            profile_photo: "https://randomuser.me/api/portraits/men/5.jpg",
            scholarship_id: 5,
            scholarship: { id: 5, scholarshipName: "Beasiswa Bank Indonesia" },
            status: "approved",
            created_at: "2023-05-03T11:10:00Z"
        }];

    // Fungsi untuk melihat detail aplikasi
    const viewApplicantDetails = (applicant) => {
        setViewingApplicant(applicant);
        setShowDetailModal(true);
    };

    useEffect(() => {
        // Simulasikan API fetch dengan setTimeout
        const fetchDummyData = () => {
            setTimeout(() => {
                setApplicants(dummyApplicants);
                setScholarships(dummyScholarships);
                setIsLoading(false);
            }, 800); // Simulasikan loading selama 800ms
        };

        fetchDummyData();
    }, []);

    // Ganti fungsi fetchApplicants dengan versi dummy
    const fetchApplicants = () => {
        setIsLoading(true);
        setTimeout(() => {
            setApplicants(dummyApplicants);
            setIsLoading(false);
        }, 800);
    };

    // Ganti fungsi fetchScholarships dengan versi dummy
    const fetchScholarships = () => {
        setTimeout(() => {
            setScholarships(dummyScholarships);
        }, 500);
    };

    // Handle status change untuk applicant (versi dummy)
    const handleStatusChange = (applicantId, newStatus) => {
        // Update local state tanpa panggilan API
        setApplicants(applicants.map(applicant =>
            applicant.id === applicantId
                ? { ...applicant, status: newStatus }
                : applicant
        ));
    };

    // Combine all filters
    const filteredApplicants = applicants.filter(applicant => {
        // Filter by search term
        const matchesSearch =
            applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.nim?.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter by status
        const matchesStatus =
            selectedStatus === 'all' ||
            applicant.status === selectedStatus;

        // Filter by scholarship
        const matchesScholarship =
            selectedScholarship === 'all' ||
            applicant.scholarship_id === parseInt(selectedScholarship);

        return matchesSearch && matchesStatus && matchesScholarship;
    });

    // Get status badge color
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Manage Applicants</h1>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    <p>{error}</p>
                </div>
            )}

            {/* Filter Controls */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search Bar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            placeholder="Name or email..."
                            className="w-full p-2 border border-gray-300 rounded"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Scholarship Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={selectedScholarship}
                            onChange={(e) => setSelectedScholarship(e.target.value)}
                        >
                            <option value="all">All Scholarships</option>
                            {scholarships.map(scholarship => (
                                <option key={scholarship.id} value={scholarship.id}>
                                    {scholarship.scholarshipName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="text-center my-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                    <p className="mt-2">Loading...</p>
                </div>
            )}

            {/* Applicants Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
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
                                        {/* Email */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{applicant.email}</div>
                                        </td>

                                        {/* GPA */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{applicant.ipk}</div>
                                        </td>

                                        {/* Scholarship */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {applicant.scholarship?.scholarshipName || "N/A"}
                                            </div>
                                        </td>

                                        {/* Application Date */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(applicant.created_at).toLocaleDateString()}
                                            </div>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${getStatusBadgeClass(applicant.status)}`}>
                                                {applicant.status || 'pending'}
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

                                            {/* Status Dropdown */}
                                            <select
                                                className="text-sm border border-gray-300 rounded py-1"
                                                value={applicant.status || 'pending'}
                                                onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approve</option>
                                                <option value="rejected">Reject</option>
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
            </div>
            {showDetailModal && viewingApplicant && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Applicant Details</h2>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="ri-close-line text-2xl"></i>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium text-lg mb-4 pb-2 border-b">Personal Information</h3>

                                <div className="mb-4">
                                    <h4 className="font-bold text-xl">{viewingApplicant.name}</h4>
                                    <p className="text-gray-600">{viewingApplicant.email}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Student ID (NIM)</p>
                                        <p>{viewingApplicant.nim}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Next Semester</p>
                                        <p>{viewingApplicant.semester}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">University</p>
                                        <p>{viewingApplicant.university}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Major</p>
                                        <p>{viewingApplicant.major}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">GPA</p>
                                        <p>{viewingApplicant.ipk} / 4.0</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Scholarship</p>
                                        <p>{viewingApplicant.scholarship?.scholarshipName || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-lg mb-4 pb-2 border-b">Address Information</h3>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">Full Address</p>
                                    <p className="mb-2">{viewingApplicant.address}</p>

                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <p className="text-sm text-gray-500">City</p>
                                            <p>{viewingApplicant.city}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Province</p>
                                            <p>{viewingApplicant.province}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Postal Code</p>
                                            <p>{viewingApplicant.postal_code}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-medium text-lg mb-4 pb-2 border-b">Application Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {viewingApplicant.recommendation_letter && (
                                    <a
                                        href={viewingApplicant.recommendation_letter}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block p-4 border rounded-lg hover:bg-gray-50 text-center"
                                    >
                                        <i className="ri-file-pdf-line text-3xl text-red-500 mb-2"></i>
                                        <p>Recommendation Letter</p>
                                    </a>
                                )}
                                {viewingApplicant.statement_letter && (
                                    <a
                                        href={viewingApplicant.statement_letter}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block p-4 border rounded-lg hover:bg-gray-50 text-center"
                                    >
                                        <i className="ri-file-pdf-line text-3xl text-red-500 mb-2"></i>
                                        <p>Statement Letter</p>
                                    </a>
                                )}
                                {viewingApplicant.grade_transcript && (
                                    <a
                                        href={viewingApplicant.grade_transcript}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block p-4 border rounded-lg hover:bg-gray-50 text-center"
                                    >
                                        <i className="ri-file-pdf-line text-3xl text-red-500 mb-2"></i>
                                        <p>Grade Transcript</p>
                                    </a>
                                )}
                                {!viewingApplicant.recommendation_letter &&
                                    !viewingApplicant.statement_letter &&
                                    !viewingApplicant.grade_transcript && (
                                        <div className="col-span-3 p-4 text-center text-gray-500">
                                            No documents have been uploaded
                                        </div>
                                    )}
                            </div>
                        </div>

                        <div className="mt-8 border-t pt-4 flex justify-between">
                            <div>
                                <span className="block text-sm text-gray-500">Application Date:</span>
                                <span>{new Date(viewingApplicant.created_at).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="block text-sm text-gray-500 text-right">Current Status:</span>
                                <span
                                    className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full 
                        ${getStatusBadgeClass(viewingApplicant.status)}`}
                                >
                                    {viewingApplicant.status || 'pending'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <select
                                className="border border-gray-300 rounded py-2 px-3 mr-2"
                                value={viewingApplicant.status || 'pending'}
                                onChange={(e) => {
                                    handleStatusChange(viewingApplicant.id, e.target.value);
                                    setViewingApplicant({ ...viewingApplicant, status: e.target.value });
                                }}
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approve</option>
                                <option value="rejected">Reject</option>
                            </select>

                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminApplicants;
