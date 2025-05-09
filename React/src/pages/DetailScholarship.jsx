import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

// This would typically come from an API, but for now we'll enhance your sample data
const enhancedScholarshipsData = [
    {
        id: 1,
        name: 'Scholarship A',
        partner: 'Partner A',
        quota: '10',
        description: 'This is a detailed description for Scholarship A. This scholarship aims to support students pursuing degrees in computer science and related fields. Recipients will receive financial support for tuition, books, and other educational expenses.',
        termsAndConditions: 'Applicants must maintain a GPA of 3.5 or higher. Must be enrolled in an accredited university. Must submit progress reports each semester.',
        timeLimit: '2 years',
        logo: 'https://via.placeholder.com/150',
        thumbnail: 'https://via.placeholder.com/800x400',
    },
    {
        id: 2,
        name: 'Scholarship B',
        partner: 'Partner B',
        quota: '15',
        description: 'This is a detailed description for Scholarship B. This scholarship is designed for students interested in environmental science and sustainability. It provides funding for research projects and internships.',
        termsAndConditions: 'Must be pursuing a degree in environmental science or related field. Must participate in at least one sustainability project per year. Must maintain a GPA of 3.0 or higher.',
        timeLimit: '1 year (renewable)',
        logo: 'https://via.placeholder.com/150',
        thumbnail: 'https://via.placeholder.com/800x400',
    },
    {
        id: 3,
        name: 'Scholarship C',
        partner: 'Partner C',
        quota: '20',
        description: 'This is a detailed description for Scholarship C. This scholarship supports students from underrepresented backgrounds in STEM fields. It covers tuition, living expenses, and provides mentorship opportunities.',
        termsAndConditions: 'Open to students from underrepresented groups in STEM. Must maintain a GPA of 3.0 or higher. Must attend monthly mentorship sessions.',
        timeLimit: '4 years',
        logo: 'https://via.placeholder.com/150',
        thumbnail: 'https://via.placeholder.com/800x400',
    },
    {
        id: 4,
        name: 'Scholarship D',
        partner: 'Partner D',
        quota: '5',
        description: 'This is a detailed description for Scholarship D. This elite scholarship is awarded to exceptional students showing leadership potential. It covers full tuition and provides a monthly stipend.',
        termsAndConditions: 'Must demonstrate leadership through extracurricular activities. Must maintain a GPA of 3.8 or higher. Must participate in leadership development program.',
        timeLimit: '3 years',
        logo: 'https://via.placeholder.com/150',
        thumbnail: 'https://via.placeholder.com/800x400',
    },
    {
        id: 5,
        name: 'Scholarship E',
        partner: 'Partner E',
        quota: '8',
        description: 'This is a detailed description for Scholarship E. This scholarship focuses on students pursuing careers in healthcare and medicine. It provides funding for tuition and clinical training experiences.',
        termsAndConditions: 'Must be enrolled in a healthcare-related program. Must complete 100 hours of community service annually. Must maintain a GPA of 3.2 or higher.',
        timeLimit: '2 years (renewable)',
        logo: 'https://via.placeholder.com/150',
        thumbnail: 'https://via.placeholder.com/800x400',
    },
];

const ScholarshipDetail = () => {
    const { id } = useParams();
    const [scholarship, setScholarship] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, you would fetch this data from an API
        // For now, we'll simulate a fetch with a timeout
        const timer = setTimeout(() => {
            const found = enhancedScholarshipsData.find(
                (s) => s.id === parseInt(id)
            );
            setScholarship(found);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
                <Navbar />
                <div className="flex-grow container mx-auto px-6 py-[20vh] flex items-center justify-center">
                    <div className="text-white text-xl">Loading...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!scholarship) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
                <Navbar />
                <div className="flex-grow container mx-auto px-6 py-[20vh] flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Scholarship Not Found</h2>
                        <p className="text-gray-600 mb-6">The scholarship you are looking for does not exist or has been removed.</p>
                        <Link to="/scholarships" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors">
                            Back to Scholarships
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
            <Navbar />
            <div className="flex-grow container mx-auto px-6 py-[15vh]">
                {/* Back Button */}
                <div className="mb-6">
                    <Link to="/scholarships" className="text-white hover:text-blue-200 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to All Scholarships
                    </Link>
                </div>

                {/* Scholarship Detail Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header with Thumbnail */}
                    <div className="relative h-72 overflow-hidden">
                        <img src={scholarship.thumbnail} alt={scholarship.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                            <div className="p-6 text-white">
                                <h1 className="text-3xl font-bold">{scholarship.name}</h1>
                                <p className="text-lg opacity-90">Offered by {scholarship.partner}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row md:items-center mb-8 pb-8 border-b border-gray-200">
                            {/* Logo */}
                            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8">
                                <img src={scholarship.logo} alt="Partner Logo" className="w-32 h-32 object-contain border border-gray-200 rounded-full p-2" />
                            </div>
                            
                            {/* Quick Info */}
                            <div className="flex-grow">
                                <div className="flex flex-wrap gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4 flex-1">
                                        <p className="text-sm text-gray-500">Quota</p>
                                        <p className="text-lg font-semibold">{scholarship.quota} Students</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 flex-1">
                                        <p className="text-sm text-gray-500">Time Limit</p>
                                        <p className="text-lg font-semibold">{scholarship.timeLimit}</p>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4 flex-1">
                                        <p className="text-sm text-gray-500">Status</p>
                                        <p className="text-lg font-semibold text-green-600">Open for Applications</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-4">Description</h2>
                            <div className="text-gray-600 space-y-4">
                                <p>{scholarship.description}</p>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <p className="text-gray-700">{scholarship.termsAndConditions}</p>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <div className="mt-8 flex justify-center">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg">
                                Apply for Scholarship
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ScholarshipDetail;
