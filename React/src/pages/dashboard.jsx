import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
    // State untuk data beasiswa
    const [scholarships] = useState([
        {
            id: 1,
            name: 'Lorem ipsum dolor sit amet',
            partner: 'partner',
            quota: 'quota',
            description: 'Lorem ipsum dolor sit.'
        },
        {
            id: 2,
            name: 'Lorem ipsum dolor sit amet',
            partner: 'partner',
            quota: 'quota',
            description: 'Lorem ipsum dolor sit.'
        },
        {
            id: 3,
            name: 'Lorem ipsum dolor sit amet',
            partner: 'partner',
            quota: 'quota',
            description: 'Lorem ipsum dolor sit.'
        },
        {
            id: 4,
            name: 'Lorem ipsum dolor sit amet',
            partner: 'partner',
            quota: 'quota',
            description: 'Lorem ipsum dolor sit.'
        },
        {
            id: 5,
            name: 'Lorem ipsum dolor sit amet',
            partner: 'partner',
            quota: 'quota',
            description: 'Lorem ipsum dolor sit.'
        },
        {
            id: 6,
            name: 'Lorem ipsum dolor sit amet',
            partner: 'partner',
            quota: 'quota',
            description: 'Lorem ipsum dolor sit.'
        }
    ]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow">
                {/* Featured Scholarship - Hero Section */}
                <section className="relative bg-gray-200 p-8">
                    <div className="container mx-auto">
                        <h1 className="text-2xl font-bold mb-4">scholarship name</h1>
                        <div className="flex space-x-4 mb-6">
                            <span className="bg-white px-4 py-1 rounded">partner</span>
                            <span className="bg-white px-4 py-1 rounded">quota</span>
                            <span className="bg-white px-4 py-1 rounded">time limit</span>
                        </div>
                        <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                            Apply now
                        </button>
                        <div className="absolute bottom-4 right-8">
                            <span>1/5</span>
                        </div>
                    </div>
                </section>

                {/* Scholarship Grid Section */}
                <section className="container mx-auto p-6">
                    <div className="flex justify-end mb-4">
                        <h2 className="text-lg">See more →</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scholarships.map((scholarship) => (
                            <div key={scholarship.id} className="bg-gray-200 rounded">
                                <div className="h-40 bg-gray-300 flex items-center justify-center">
                                    <div className="w-24 h-24 border border-gray-500 flex items-center justify-center">
                                        X
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-lg">{scholarship.name}</h3>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {scholarship.partner} - {scholarship.quota}
                                    </p>
                                    <p className="text-sm">{scholarship.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;
