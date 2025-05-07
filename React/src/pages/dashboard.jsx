import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import headerImg from '../assets/img/contoh_header.jpg';

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
        },
        {
            id: 7,
            name: 'Lorem ipsum dolor sit amet',
            partner: 'partner',
            quota: 'quota',
            description: 'Lorem ipsum dolor sit.'
        },
        {
            id: 8,
            name: 'Lorem ipsum dolor sit amet',
            partner: 'partner',
            quota: 'quota',
            description: 'Lorem ipsum dolor sit.'
        }
    ]);

    return (
        <div className="min-h-screen flex flex-col bg-blue-200">
            <Navbar />
            <div className="flex-grow">
                {/* Featured Scholarship - Hero Section */}
                <section className="relative bg-gray-700 p-0 h-[80vh] overflow-hidden rounded-lg">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <img
                            src={headerImg}
                            alt="Scholarship Featured"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                    </div>

                    {/* Content positioned at bottom left */}
                    <div className="absolute bottom-10 p-2 w-full">
                        <div className="container mx-[2vw]">
                            <h1 className="text-3xl font-bold mb-4 text-white">scholarship name</h1>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="bg-white px-4 py-1 rounded text-gray-800">partner</span>
                                <span className="bg-white px-4 py-1 rounded text-gray-800">quota</span>
                                <span className="bg-white px-4 py-1 rounded text-gray-800">time limit</span>
                            </div>
                            <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors">
                                Apply now
                            </button>
                        </div>
                    </div>

                    {/* Pagination indicator */}
                    <div className="absolute bottom-15 right-[3vw]">
                        <span className="bg-white bg-opacity-50 px-3 py-1 rounded-full text-sm">1/5</span>
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
                                <div className="h-40 bg-white flex items-center justify-center">
                                    <div className="w-24 h-24 border border-gray-500 flex items-center justify-center">
                                        X
                                    </div>
                                </div>
                                <div className="p-4 bg-sky-300">
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
