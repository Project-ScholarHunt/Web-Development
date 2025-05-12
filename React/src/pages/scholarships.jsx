import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

// Data beasiswa yang ditingkatkan (sama dengan data dari DetailScholarship.jsx)
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

const ScholarshipsPage = () => {
    // State untuk menyimpan scholarship yang dipilih
    const [selectedScholarship, setSelectedScholarship] = useState(enhancedScholarshipsData[0]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
            <Navbar />

            {/* Main content with two-panel layout */}
            <main className="flex-grow container mx-auto px-6 py-[15vh]">
                <h1 className="text-3xl font-bold text-white mb-6">Scholarships</h1>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Panel - Scholarship List */}
                    <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md p-4 h-[70vh] overflow-y-auto scrollbar-custom">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Scholarships</h2>

                        {enhancedScholarshipsData.map((scholarship) => (
                            <div
                                key={scholarship.id}
                                onClick={() => setSelectedScholarship(scholarship)}
                                className={`p-4 mb-3 rounded-lg cursor-pointer transition-all ${selectedScholarship.id === scholarship.id
                                    ? 'bg-blue-100 border-l-4 border-blue-500'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                        <img
                                            src={scholarship.logo}
                                            alt={scholarship.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="ml-4">
                                        <h3 className="font-medium">{scholarship.name}</h3>
                                        <p className="text-sm text-gray-600">{scholarship.partner}</p>
                                        <div className="flex items-center mt-1">
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                Quota: {scholarship.quota}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Panel - Scholarship Detail */}
                    <div className="w-full md:w-4/5 bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Header with Thumbnail */}
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={selectedScholarship.thumbnail}
                                alt={selectedScholarship.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                <div className="p-6 text-white">
                                    <h1 className="text-2xl font-bold">{selectedScholarship.name}</h1>
                                    <p className="opacity-90">Offered by {selectedScholarship.partner}</p>
                                </div>
                            </div>
                        </div>

                        {/* Detail Content - Scrollable */}
                        <div className="p-6 h-[calc(70vh-16rem)] overflow-y-auto">
                            {/* Quick Info */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">Quota</p>
                                    <p className="text-lg font-semibold">{selectedScholarship.quota} Students</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">Time Limit</p>
                                    <p className="text-lg font-semibold">{selectedScholarship.timeLimit}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-2">Description</h2>
                                <div className="text-gray-600">
                                    <p>{selectedScholarship.description}</p>
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-2">Terms and Conditions</h2>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="text-gray-700">{selectedScholarship.termsAndConditions}</p>
                                </div>
                            </div>

                            {/* Apply Button */}
                            <div className="mt-6 flex justify-center">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg">
                                    Apply for Scholarship
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ScholarshipsPage;
