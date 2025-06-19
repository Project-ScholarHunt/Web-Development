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

import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import StatusDistributionPie from '../components/StatusDistributionPie';
import ScholarshipPopularityBar from '../components/ScholarshipPopularityBar';
import TopUniversitiesBar from '../components/TopUniversitiesBar';
import StatusMetrics from '../components/StatusMetrics';
import ApplicationTrendChart from '../components/ApplicationTrendChart';
import ScholarshipPerformanceTable from './ScholarshipPerformanceTable';


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
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    setError("Unauthrorized.");
                    setIsLoading(false);
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const generalStatsResponse = await axios.get(`${API_URL}/general-stats`, config);
                setGeneralStats(generalStatsResponse.data);

                const scholarshipsResponse = await axios.get(`${API_URL}/scholarships`, config);
                setScholarships(scholarshipsResponse.data);

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

    const getRegistrationTrendData = () => {
        const countsByDate = applicants.reduce((acc, app) => {
            const date = new Date(app.registration_date).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const sortedDates = Object.keys(countsByDate).sort((a, b) => new Date(a) - new Date(b));

        return {
            labels: sortedDates,
            datasets: [{
                label: 'Jumlah Pendaftar per Hari',
                data: sortedDates.map(date => countsByDate[date]),
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }],
        };
    };


    const generalStatsData = generalStats || {
        totalApplicants: 0,
        activeScholarships: 0,
        pendingApplicants: 0,
        underReviewApplicants: 0,
        approvedApplicants: 0,
        rejectedApplicants: 0,
        approvalRate: 0,
        totalQuota: 0,
        quotaFillRate: 0
    };

    const getStatusDistribution = () => {
        return {
            labels: ['Pending', 'Under Review', 'Approved', 'Rejected'],
            datasets: [
                {
                    data: [
                        generalStatsData.pendingApplicants,
                        generalStatsData.underReviewApplicants,
                        generalStatsData.approvedApplicants,
                        generalStatsData.rejectedApplicants
                    ],
                    // Warna baru ditambahkan untuk 'Under Review' (Biru)
                    backgroundColor: [
                        '#FBBF24',
                        '#3B82F6',
                        '#10B981',
                        '#EF4444'
                    ],
                    borderColor: [
                        '#92400E',
                        '#1E40AF',
                        '#064E3B',
                        '#7F1D1D'
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    const getScholarshipPerformanceData = () => {
        return scholarships.map(scholarship => {
            const relevantApplicants = applicants.filter(app => app.scholarship_id === scholarship.scholarship_id);
            const approvedApplicants = relevantApplicants.filter(
                app => app.status && app.status.trim().toLowerCase() === 'accepted'
            );
            const totalApplicants = relevantApplicants.length;
            const totalApproved = approvedApplicants.length;
            const approvalRate = totalApplicants > 0 ? parseFloat(((totalApproved / totalApplicants) * 100).toFixed(1)) : 0;


            console.log(`Scholarship: ${scholarship.scholarship_name}`);
            console.log(`Total Applicants: ${totalApplicants}, Total Approved: ${totalApproved}, Approval Rate: ${approvalRate}`);
            console.log(`Applicant Statuses:`, relevantApplicants.map(app => app.status));

            const totalGpa = relevantApplicants.reduce((sum, app) => sum + parseFloat(app.ipk), 0);
            const avgGpa = totalApplicants > 0 ? (totalGpa / totalApplicants).toFixed(2) : 'N/A';

            return {
                id: scholarship.scholarship_id,
                name: scholarship.scholarship_name,
                totalApplicants,
                totalApproved,
                approvalRate,
                avgGpa
            };
        });
    };

    const getScholarshipApplicationData = () => {
        return {
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
        const universities = [...new Set(applicants.map(app => app.university).filter(Boolean))];
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
    const scholarshipData = !isLoading && scholarships.length > 0 ? getScholarshipApplicationData() : null;
    const universityData = !isLoading && applicants.length > 0 ? getUniversityDistribution() : null;
    const registrationTrendData = !isLoading && applicants.length > 0 ? getRegistrationTrendData() : null;

    return (
        <div>
            {isLoading ?
                null
                :
                <h1 className="text-2xl mb-4 font-semibold">Analytics Dashboard</h1>
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
            ) : !error && generalStats ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Applicants"
                            value={generalStatsData.totalApplicants}
                            subtitle={`${generalStatsData.pendingApplicants} pending review`}
                            icon="ri-group-line"
                        />
                        <StatCard
                            title="Active Scholarships"
                            value={generalStatsData.activeScholarships}
                            subtitle={`${generalStatsData.totalQuota} total quota`}
                            icon="ri-award-line"
                        />
                        <StatCard
                            title="Approval Rate"
                            value={`${generalStatsData.approvalRate}%`}
                            subtitle={`${generalStatsData.quotaFillRate}% quota filled`}
                            icon="ri-check-double-line"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-2">
                            <ChartCard title="Application Status Distribution">
                                {statusData && <StatusDistributionPie data={statusData} />}
                            </ChartCard>
                        </div>
                        <div className="lg:col-span-3">
                            <ScholarshipPerformanceTable performanceData={getScholarshipPerformanceData()} />
                        </div>
                    </div>

                    <ChartCard title="Daily Application Trends">
                        {registrationTrendData && <ApplicationTrendChart data={registrationTrendData} />}
                    </ChartCard>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard title="Applications by Scholarship">
                            {scholarshipData && <ScholarshipPopularityBar data={scholarshipData} />}
                        </ChartCard>
                        <ChartCard title="Top 5 Universities by Applicants">
                            {universityData && <TopUniversitiesBar data={universityData} />}
                        </ChartCard>
                    </div>
                </div>
            ) : !isLoading && error ? (
                <div className="text-center my-10">
                    <p className="text-lg text-red-600">Could not load analytics data.</p>
                </div>
            ) : null}
        </div>
    );
};

export default AdminAnalytics;