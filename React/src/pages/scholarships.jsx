import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const scholarshipsData = [
    {
        id: 1,
        name: 'Scholarship A',
        partner: 'Partner A',
        quota: '10',
        description: 'This is a description for Scholarship A.',
    },
    {
        id: 2,
        name: 'Scholarship B',
        partner: 'Partner B',
        quota: '15',
        description: 'This is a description for Scholarship B.',
    },
    {
        id: 3,
        name: 'Scholarship C',
        partner: 'Partner C',
        quota: '20',
        description: 'This is a description for Scholarship C.',
    },
    {
        id: 4,
        name: 'Scholarship D',
        partner: 'Partner D',
        quota: '5',
        description: 'This is a description for Scholarship D.',
    },
    {
        id: 5,
        name: 'Scholarship E',
        partner: 'Partner E',
        quota: '8',
        description: 'This is a description for Scholarship E.',
    },
];

const Scholarships = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
            <Navbar />
            {/* Scholarships Page Content */}
            <main className="flex-grow container mx-auto px-6 py-[20vh]">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">All Scholarships</h1>
                    <p className="text-lg font-medium text-gray-200">
                        Total Scholarships: <span className="text-yellow-300 font-bold">{scholarshipsData.length}</span>
                    </p>
                </div>

                {/* Scholarship Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scholarshipsData.map((scholarship) => (
                        <div
                            key={scholarship.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-40 bg-gray-100 flex items-center justify-center">
                                <div className="w-24 h-24 border border-gray-300 rounded-full flex items-center justify-center text-gray-400">
                                    Logo
                                </div>
                            </div>
                            <div className="p-5 bg-sky-300">
                                <h3 className="font-medium text-lg mb-2">{scholarship.name}</h3>
                                <div className="flex items-center text-sm text-gray-600 mb-3">
                                    <span className="mr-3">{scholarship.partner}</span>
                                    <span className="px-2 py-1 bg-sky-200 rounded-full text-xs">{scholarship.quota}</span>
                                </div>
                                <p className="text-sm">{scholarship.description}</p>
                                <Link 
                                    to={`/scholarships/${scholarship.id}`} 
                                    className="mt-4 text-blue-700 hover:text-blue-900 text-sm font-medium flex items-center">
                                    View Details
                                    <svg
                                        className="w-4 h-4 ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        ></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Scholarships;
