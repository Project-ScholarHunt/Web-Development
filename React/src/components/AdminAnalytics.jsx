import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement
);

const API_URL = "http://127.0.0.1:8000/api";

const AdminAnalytics = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scholarships, setScholarships] = useState([]);
    const [applicants, setApplicants] = useState([]);

    // Data dummy untuk beasiswa
    const dummyScholarships = [
        { id: 1, scholarshipName: "Beasiswa Pendidikan Indonesia", quota: 150, status: "active", partner: "Kemendikbud" },
        { id: 2, scholarshipName: "LPDP Scholarship", quota: 500, status: "active", partner: "Kementerian Keuangan" },
        { id: 3, scholarshipName: "Beasiswa Unggulan Kemendikbud", quota: 200, status: "active", partner: "Kemendikbud" },
        { id: 4, scholarshipName: "Beasiswa Djarum", quota: 100, status: "active", partner: "Djarum Foundation" },
        { id: 5, scholarshipName: "Beasiswa Bank Indonesia", quota: 75, status: "active", partner: "Bank Indonesia" }
    ];

    // Data dummy untuk applicants
    const dummyApplicants = [
        {
            id: 1, name: "Budi Santoso", email: "budi.santoso@gmail.com", nim: "1301190001",
            university: "Universitas Indonesia", ipk: "3.85", scholarship_id: 1,
            scholarship: { id: 1, scholarshipName: "Beasiswa Pendidikan Indonesia" },
            status: "pending", created_at: "2023-05-10T08:30:00Z"
        },
        {
            id: 2, name: "Dewi Lestari", email: "dewi.lestari@gmail.com", nim: "1301190045",
            university: "Institut Teknologi Bandung", ipk: "3.92", scholarship_id: 2,
            scholarship: { id: 2, scholarshipName: "LPDP Scholarship" },
            status: "approved", created_at: "2023-05-05T10:15:00Z"
        },
        {
            id: 3, name: "Arif Wijaya", email: "arif.wijaya@gmail.com", nim: "1301190078",
            university: "Universitas Gadjah Mada", ipk: "3.65", scholarship_id: 3,
            scholarship: { id: 3, scholarshipName: "Beasiswa Unggulan Kemendikbud" },
            status: "rejected", created_at: "2023-05-08T14:45:00Z"
        },
        {
            id: 4, name: "Siti Nurhaliza", email: "siti.nurhaliza@gmail.com", nim: "1301190112",
            university: "Universitas Diponegoro", ipk: "3.78", scholarship_id: 4,
            scholarship: { id: 4, scholarshipName: "Beasiswa Djarum" },
            status: "pending", created_at: "2023-05-12T09:20:00Z"
        },
        {
            id: 5, name: "Rudi Hartono", email: "rudi.hartono@gmail.com", nim: "1301190156",
            university: "Universitas Airlangga", ipk: "3.52", scholarship_id: 5,
            scholarship: { id: 5, scholarshipName: "Beasiswa Bank Indonesia" },
            status: "approved", created_at: "2023-05-03T11:10:00Z"
        },
        {
            id: 6, name: "Lina Wati", email: "lina.wati@gmail.com", nim: "1301190201",
            university: "Universitas Brawijaya", ipk: "3.70", scholarship_id: 1,
            scholarship: { id: 1, scholarshipName: "Beasiswa Pendidikan Indonesia" },
            status: "approved", created_at: "2023-05-07T13:25:00Z"
        },
        {
            id: 7, name: "Andi Saputra", email: "andi.saputra@gmail.com", nim: "1301190234",
            university: "Universitas Padjadjaran", ipk: "3.45", scholarship_id: 2,
            scholarship: { id: 2, scholarshipName: "LPDP Scholarship" },
            status: "rejected", created_at: "2023-04-28T15:30:00Z"
        },
        {
            id: 8, name: "Maya Sari", email: "maya.sari@gmail.com", nim: "1301190267",
            university: "Institut Teknologi Sepuluh November", ipk: "3.89", scholarship_id: 3,
            scholarship: { id: 3, scholarshipName: "Beasiswa Unggulan Kemendikbud" },
            status: "pending", created_at: "2023-05-09T07:45:00Z"
        },
        {
            id: 9, name: "Dimas Permana", email: "dimas.permana@gmail.com", nim: "1301190289",
            university: "Universitas Hasanuddin", ipk: "3.60", scholarship_id: 4,
            scholarship: { id: 4, scholarshipName: "Beasiswa Djarum" },
            status: "approved", created_at: "2023-04-30T09:55:00Z"
        },
        {
            id: 10, name: "Nina Safitri", email: "nina.safitri@gmail.com", nim: "1301190312",
            university: "Universitas Indonesia", ipk: "3.75", scholarship_id: 5,
            scholarship: { id: 5, scholarshipName: "Beasiswa Bank Indonesia" },
            status: "pending", created_at: "2023-05-11T10:40:00Z"
        },
        // Tambahkan 10 data lagi untuk analisis yang lebih baik
        {
            id: 11, name: "Faisal Rahman", email: "faisal.rahman@gmail.com", nim: "1301190348",
            university: "Institut Pertanian Bogor", ipk: "3.67", scholarship_id: 1,
            scholarship: { id: 1, scholarshipName: "Beasiswa Pendidikan Indonesia" },
            status: "pending", created_at: "2023-04-25T14:20:00Z"
        },
        {
            id: 12, name: "Rina Fitriani", email: "rina.fitriani@gmail.com", nim: "1301190376",
            university: "Universitas Diponegoro", ipk: "3.83", scholarship_id: 2,
            scholarship: { id: 2, scholarshipName: "LPDP Scholarship" },
            status: "approved", created_at: "2023-05-02T11:05:00Z"
        },
        {
            id: 13, name: "Bima Sakti", email: "bima.sakti@gmail.com", nim: "1301190402",
            university: "Universitas Gadjah Mada", ipk: "3.91", scholarship_id: 3,
            scholarship: { id: 3, scholarshipName: "Beasiswa Unggulan Kemendikbud" },
            status: "approved", created_at: "2023-05-06T08:15:00Z"
        },
        {
            id: 14, name: "Laras Setiawati", email: "laras.setiawati@gmail.com", nim: "1301190437",
            university: "Institut Teknologi Bandung", ipk: "3.58", scholarship_id: 4,
            scholarship: { id: 4, scholarshipName: "Beasiswa Djarum" },
            status: "rejected", created_at: "2023-04-29T16:10:00Z"
        },
        {
            id: 15, name: "Hadi Purnama", email: "hadi.purnama@gmail.com", nim: "1301190468",
            university: "Universitas Brawijaya", ipk: "3.72", scholarship_id: 5,
            scholarship: { id: 5, scholarshipName: "Beasiswa Bank Indonesia" },
            status: "pending", created_at: "2023-05-13T09:30:00Z"
        },
        {
            id: 16, name: "Sri Rahayu", email: "sri.rahayu@gmail.com", nim: "1301190501",
            university: "Universitas Indonesia", ipk: "3.86", scholarship_id: 1,
            scholarship: { id: 1, scholarshipName: "Beasiswa Pendidikan Indonesia" },
            status: "approved", created_at: "2023-04-27T13:45:00Z"
        },
        {
            id: 17, name: "Joko Susilo", email: "joko.susilo@gmail.com", nim: "1301190538",
            university: "Universitas Airlangga", ipk: "3.49", scholarship_id: 2,
            scholarship: { id: 2, scholarshipName: "LPDP Scholarship" },
            status: "rejected", created_at: "2023-05-01T10:25:00Z"
        },
        {
            id: 18, name: "Anisa Putri", email: "anisa.putri@gmail.com", nim: "1301190572",
            university: "Institut Teknologi Sepuluh November", ipk: "3.94", scholarship_id: 3,
            scholarship: { id: 3, scholarshipName: "Beasiswa Unggulan Kemendikbud" },
            status: "approved", created_at: "2023-05-04T15:15:00Z"
        },
        {
            id: 19, name: "Yusuf Hidayat", email: "yusuf.hidayat@gmail.com", nim: "1301190607",
            university: "Universitas Padjadjaran", ipk: "3.62", scholarship_id: 4,
            scholarship: { id: 4, scholarshipName: "Beasiswa Djarum" },
            status: "pending", created_at: "2023-05-14T08:55:00Z"
        },
        {
            id: 20, name: "Dina Maulida", email: "dina.maulida@gmail.com", nim: "1301190645",
            university: "Universitas Hasanuddin", ipk: "3.78", scholarship_id: 5,
            scholarship: { id: 5, scholarshipName: "Beasiswa Bank Indonesia" },
            status: "rejected", created_at: "2023-04-26T14:35:00Z"
        }
    ];

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

    // Fungsi untuk mendapatkan statistik umum
    const getGeneralStats = () => {
        const totalApplicants = applicants.length;
        const activeScholarships = scholarships.length;
        const pendingApplicants = applicants.filter(app => app.status === 'pending').length;
        const approvalRate = (applicants.filter(app => app.status === 'approved').length / totalApplicants) * 100;
        const totalQuota = scholarships.reduce((sum, sch) => sum + sch.quota, 0);
        const quotaFillRate = (totalApplicants / totalQuota) * 100;

        return {
            totalApplicants,
            activeScholarships,
            pendingApplicants,
            approvalRate: approvalRate.toFixed(1),
            totalQuota,
            quotaFillRate: quotaFillRate.toFixed(1)
        };
    };

    // Fungsi untuk mendapatkan status distribution data
    const getStatusDistribution = () => {
        const statuses = ['approved', 'pending', 'rejected'];
        return {
            labels: ['Approved', 'Pending', 'Rejected'],
            datasets: [
                {
                    data: statuses.map(status =>
                        applicants.filter(app => app.status === status).length
                    ),
                    backgroundColor: ['#10B981', '#FBBF24', '#EF4444'],
                    borderColor: ['#064E3B', '#92400E', '#7F1D1D'],
                    borderWidth: 1,
                },
            ],
        };
    };

    // Fungsi untuk mendapatkan scholarship application data
    const getScholarshipApplicationData = () => {
        return {
            labels: scholarships.map(sch => sch.scholarshipName),
            datasets: [
                {
                    label: 'Total Applicants',
                    data: scholarships.map(sch =>
                        applicants.filter(app => app.scholarship_id === sch.id).length
                    ),
                    backgroundColor: '#3B82F6',
                    borderColor: '#1E40AF',
                    borderWidth: 1,
                },
                {
                    label: 'Quota',
                    data: scholarships.map(sch => sch.quota),
                    backgroundColor: '#F59E0B',
                    borderColor: '#B45309',
                    borderWidth: 1,
                },
            ],
        };
    };

    // Fungsi untuk mendapatkan university distribution
    const getUniversityDistribution = () => {
        const universities = [...new Set(applicants.map(app => app.university))];
        const universityData = universities.map(uni => ({
            university: uni,
            count: applicants.filter(app => app.university === uni).length
        }));

        // Sort by count in descending order
        universityData.sort((a, b) => b.count - a.count);

        // Take top 5
        const topUniversities = universityData.slice(0, 5);

        return {
            labels: topUniversities.map(item => item.university),
            datasets: [
                {
                    label: 'Number of Applicants',
                    data: topUniversities.map(item => item.count),
                    backgroundColor: '#EC4899',
                    borderColor: '#9D174D',
                    borderWidth: 1,
                },
            ],
        };
    };

    // Fungsi untuk mendapatkan application trend over time

    const generalStats = isLoading ? null : getGeneralStats();
    const statusData = isLoading ? null : getStatusDistribution();
    const scholarshipData = isLoading ? null : getScholarshipApplicationData();
    const universityData = isLoading ? null : getUniversityDistribution();

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Analytics Dashboard</h1>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    <p>{error}</p>
                </div>
            )}

            {/* Loading Indicator */}
            {isLoading ? (
                <div className="text-center my-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                    <p className="mt-2">Loading analytics data...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Main Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-700 mb-1">Total Applicants</h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-indigo-600">{generalStats.totalApplicants}</span>
                                <span className="ml-2 text-sm font-medium text-gray-500">applicants</span>
                            </div>
                            <div className="mt-2 flex items-center">
                                <div className="flex items-center text-sm text-green-600">
                                    <span className="mr-1.5"><i className="ri-user-add-line"></i></span>
                                    <span>{generalStats.pendingApplicants} pending review</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-700 mb-1">Active Scholarships</h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-indigo-600">{generalStats.activeScholarships}</span>
                                <span className="ml-2 text-sm font-medium text-gray-500">scholarships</span>
                            </div>
                            <div className="mt-2 flex items-center">
                                <div className="flex items-center text-sm text-blue-600">
                                    <span className="mr-1.5"><i className="ri-graduation-cap-line"></i></span>
                                    <span>{generalStats.totalQuota} total quota</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-700 mb-1">Approval Rate</h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-indigo-600">{generalStats.approvalRate}%</span>
                                <span className="ml-2 text-sm font-medium text-gray-500">approved</span>
                            </div>
                            <div className="mt-2 flex items-center">
                                <div className="flex items-center text-sm text-yellow-600">
                                    <span className="mr-1.5"><i className="ri-pie-chart-line"></i></span>
                                    <span>{generalStats.quotaFillRate}% quota filled</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Application Status Distribution */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-700">Application Status Distribution</h2>
                        </div>
                        <div className="h-64 flex justify-center">
                            <div className="w-full max-w-md">
                                <Pie data={statusData} />
                            </div>
                        </div>
                    </div>

                    {/* Chart Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Scholarship Applications vs Quota */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Applications by Scholarship</h2>
                            <div className="h-80">
                                <Bar
                                    data={scholarshipData}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: 'Count'
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Top Universities */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Top 5 Universities</h2>
                            <div className="h-80">
                                <Bar
                                    data={universityData}
                                    options={{
                                        maintainAspectRatio: false,
                                        indexAxis: 'y',
                                        scales: {
                                            x: {
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: 'Number of Applicants'
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Detailed Status Metrics */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Status Metrics</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Pending Applications</span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {applicants.filter(a => a.status === 'pending').length} / {generalStats.totalApplicants}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full"
                                            style={{ width: `${(applicants.filter(a => a.status === 'pending').length / generalStats.totalApplicants) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Approved Applications</span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {applicants.filter(a => a.status === 'approved').length} / {generalStats.totalApplicants}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${(applicants.filter(a => a.status === 'approved').length / generalStats.totalApplicants) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Rejected Applications</span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {applicants.filter(a => a.status === 'rejected').length} / {generalStats.totalApplicants}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ width: `${(applicants.filter(a => a.status === 'rejected').length / generalStats.totalApplicants) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Quota Fill Rate</span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {generalStats.totalApplicants} / {generalStats.totalQuota}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${(generalStats.totalApplicants / generalStats.totalQuota) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAnalytics;