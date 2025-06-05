import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import loginImg from '../assets/img/login.png'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

// API_URL sudah benar, menunjuk ke endpoint analytics admin di Laravel
const API_URL = "http://127.0.0.1:8000/api/admin/analytics";

const AdminAnalytics = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scholarships, setScholarships] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [generalStats, setGeneralStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Set loading true di awal fetch
            setError(null); // Reset error
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    setError("Authentication token not found. Please login as Admin.");
                    setIsLoading(false);
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                // Fetch General Stats
                const generalStatsResponse = await axios.get(`${API_URL}/general-stats`, config);
                setGeneralStats(generalStatsResponse.data);

                // Fetch Scholarships
                const scholarshipsResponse = await axios.get(`${API_URL}/scholarships`, config);
                setScholarships(scholarshipsResponse.data);

                // Fetch Applicants
                const applicantsResponse = await axios.get(`${API_URL}/applicants`, config);
                setApplicants(applicantsResponse.data);

            } catch (err) {
                console.error("Error fetching analytics data:", err);
                if (axios.isAxiosError(err) && err.response) {
                    if (err.response.status === 401) {
                        setError("Unauthorized. Please ensure you are logged in as an administrator and token is valid.");
                    } else if (err.response.status === 403) {
                        setError("Forbidden. You do not have permission to access this resource.");
                    } else if (err.response.status === 404) {
                        setError(`API endpoint not found: ${err.config.url}. Please check backend routes.`);
                    } else if (err.response.data && err.response.data.message) {
                        setError(`Failed to load analytics data: ${err.response.data.message}`);
                    } else {
                        setError(`An error occurred: ${err.response.status} ${err.response.statusText}`);
                    }
                } else if (axios.isAxiosError(err) && err.request) {
                    setError("Network error: No response from server. Please check if the backend is running and accessible.");
                } else {
                    setError("An unexpected error occurred while fetching data.");
                }
            } finally {
                setIsLoading(false); // Pastikan isLoading false setelah fetch selesai (sukses atau gagal)
            }
        };

        fetchData();
    }, []);

    const generalStatsData = generalStats || {
        totalApplicants: 0,
        activeScholarships: 0,
        pendingApplicants: 0,
        approvedApplicants: 0, // Tambahkan ini
        rejectedApplicants: 0, // Tambahkan ini
        approvalRate: 0,
        totalQuota: 0,
        quotaFillRate: 0
    };

    // Fungsi untuk mendapatkan status distribution data
    const getStatusDistribution = () => {
        // Gunakan data dari generalStatsData untuk konsistensi
        return {
            labels: ['Approved', 'Pending', 'Rejected'],
            datasets: [
                {
                    data: [
                        generalStatsData.approvedApplicants,
                        generalStatsData.pendingApplicants,
                        generalStatsData.rejectedApplicants
                    ],
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
            // PASTIKAN 'scholarship_name' sesuai dengan field dari backend
            labels: scholarships.map(sch => sch.scholarship_name || 'Unnamed Scholarship'), // << Sesuaikan field name
            datasets: [
                {
                    label: 'Total Applicants',
                    data: scholarships.map(sch =>
                        // PASTIKAN 'scholarship_id' sesuai dengan field primary key di scholarship
                        applicants.filter(app => app.scholarship_id === sch.scholarship_id).length // << Sesuaikan sch.scholarship_id
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

    const getUniversityDistribution = () => {
        const universities = [...new Set(applicants.map(app => app.university).filter(Boolean))]; // Filter out null/undefined universities
        const universityData = universities.map(uni => ({
            university: uni,
            count: applicants.filter(app => app.university === uni).length
        }));

        universityData.sort((a, b) => b.count - a.count);
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

    const statusData = !isLoading && generalStats ? getStatusDistribution() : null;
    const scholarshipData = !isLoading && scholarships.length > 0 && applicants.length >= 0 ? getScholarshipApplicationData() : null; // applicants bisa 0
    const universityData = !isLoading && applicants.length > 0 ? getUniversityDistribution() : null;

    return (
        <div>
            {isLoading ?
                null
                :
                <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
            }


            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {isLoading ? (
                <div className="text-center my-10">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
                    <p className="mt-4 text-lg font-medium text-gray-600">Loading analytics data...</p>
                </div>
            ) : !error && generalStats ? ( // Hanya render jika tidak loading, tidak ada error, dan generalStats ada
                <div className="space-y-6" id='pdf' ref={componentRef}>
                    {/* Main Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-700 mb-1">Total Applicants</h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-indigo-600">{generalStatsData.totalApplicants}</span>
                                <span className="ml-2 text-sm font-medium text-gray-500">applicants</span>
                            </div>
                            <div className="mt-2 flex items-center">
                                <div className="flex items-center text-sm text-yellow-600"> {/* Warna disesuaikan untuk pending */}
                                    <span className="mr-1.5"><i className="ri-time-line"></i></span> {/* Icon untuk pending */}
                                    <span>{generalStatsData.pendingApplicants} pending review</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-700 mb-1">Active Scholarships</h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-indigo-600">{generalStatsData.activeScholarships}</span>
                                <span className="ml-2 text-sm font-medium text-gray-500">scholarships</span>
                            </div>
                            <div className="mt-2 flex items-center">
                                <div className="flex items-center text-sm text-blue-600">
                                    <span className="mr-1.5"><i className="ri-award-line"></i></span> {/* Icon untuk kuota */}
                                    <span>{generalStatsData.totalQuota} total quota</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-700 mb-1">Approval Rate</h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-indigo-600">{generalStatsData.approvalRate}%</span>
                            </div>
                            <div className="mt-2 flex items-center">
                                <div className="flex items-center text-sm text-green-600"> {/* Warna disesuaikan untuk quota filled */}
                                    <span className="mr-1.5"><i className="ri-pie-chart-2-line"></i></span> {/* Icon untuk quota filled */}
                                    <span>{generalStatsData.quotaFillRate}% quota filled</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-10 shadow-lg border max-h-[300px] border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Application Status Distribution</h2>
                        </div>
                        <div className="h-30 md:h-50 flex justify-center"> {/* Tinggi disesuaikan */}
                            <div className="w-full max-w-sm md:max-w-md"> {/* Lebar disesuaikan */}
                                {statusData && <Pie data={statusData} options={{ maintainAspectRatio: false }} />}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Status Metrics & Application by Scholarship in first row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Detailed Status Metrics */}
                        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Metrics</h2>
                            <div className="space-y-5">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-base font-medium text-gray-700">Pending Applications</span>
                                        <span className="text-base font-medium text-gray-700">
                                            {generalStatsData.pendingApplicants} / {generalStatsData.totalApplicants}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-yellow-400 h-2.5 rounded-full"
                                            style={{ width: `${generalStatsData.totalApplicants > 0 ? (generalStatsData.pendingApplicants / generalStatsData.totalApplicants) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-base font-medium text-gray-700">Approved Applications</span>
                                        <span className="text-base font-medium text-gray-700">
                                            {/* Menggunakan generalStatsData untuk approved count */}
                                            {generalStatsData.approvedApplicants} / {generalStatsData.totalApplicants}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-green-500 h-2.5 rounded-full"
                                            style={{ width: `${generalStatsData.totalApplicants > 0 ? (generalStatsData.approvedApplicants / generalStatsData.totalApplicants) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-base font-medium text-gray-700">Rejected Applications</span>
                                        <span className="text-base font-medium text-gray-700">
                                            {/* Menggunakan generalStatsData untuk rejected count */}
                                            {generalStatsData.rejectedApplicants} / {generalStatsData.totalApplicants}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-red-500 h-2.5 rounded-full"
                                            style={{ width: `${generalStatsData.totalApplicants > 0 ? (generalStatsData.rejectedApplicants / generalStatsData.totalApplicants) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Quota Fill Rate Progress Bar (Optional, bisa digabung atau dipisah) */}
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-base font-medium text-gray-700">Quota Utilization</span>
                                        <span className="text-base font-medium text-gray-700">
                                            {generalStatsData.approvedApplicants} / {generalStatsData.totalQuota} {/* Menggunakan approved untuk kuota terisi */}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-500 h-2.5 rounded-full"
                                            style={{ width: `${generalStatsData.totalQuota > 0 ? (generalStatsData.approvedApplicants / generalStatsData.totalQuota) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Application by Scholarship (Now in grid) */}
                        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Applications by Scholarship</h2>
                            <div className="h-80 md:h-96"> {/* Tinggi disesuaikan */}
                                {scholarshipData && (
                                    <Bar
                                        data={scholarshipData}
                                        options={{
                                            maintainAspectRatio: false,
                                            responsive: true,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    title: {
                                                        display: true,
                                                        text: 'Count'
                                                    }
                                                },
                                                x: {
                                                    title: {
                                                        display: true,
                                                        text: 'Scholarships'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Top 5 Universities (Now Full Width at Bottom) */}
                    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Top 5 Universities by Applicants</h2>
                        <div className="h-80 md:h-96"> {/* Tinggi disesuaikan */}
                            {universityData && (
                                <Bar
                                    data={universityData}
                                    options={{
                                        maintainAspectRatio: false,
                                        responsive: true,
                                        indexAxis: 'y', // Membuatnya jadi horizontal bar chart
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
                            )}
                        </div>
                    </div>
                </div>
            ) : !isLoading && error ? ( // Jika tidak loading tapi ada error (setelah fetch)
                <div className="text-center my-10">
                    <p className="text-lg text-red-600">Could not load analytics data.</p>
                </div>
            ) : null} {/* Kasus lain (mis. data belum ada tapi tidak error juga) */}
        </div>
    );
};

export default AdminAnalytics;