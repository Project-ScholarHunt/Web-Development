import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import FaqAccordion from '../components/FaqAccordion';
import ApplicationTimeline from '../components/ApplicationTimeline';
import headerImg from '../assets/img/contoh_header.jpg';

const Dashboard = () => {
    // State for scholarship data
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
    ]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
            <Navbar />
            <div className="flex-grow">
                {/* Featured Scholarship - Hero Section */}
                <section className="relative bg-gray-700 p-0 h-[80vh] overflow-hidden rounded-lg">
                    {/* Your hero section content remains the same */}
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
                    <div className="absolute bottom-10 right-[3vw]">
                        <span className="bg-white bg-opacity-50 px-3 py-1 rounded-full text-sm">1/5</span>
                    </div>
                </section>

                {/* Scholarship Grid Section - Added margin-top for better spacing */}
                <section className="container mx-auto px-6 py-12 mt-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Available Scholarships</h2>
                        <a href="/scholarships" className="text-lg hover:text-blue-700 transition-colors flex items-center">
                            See more
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scholarships.map((scholarship) => (
                            <div key={scholarship.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                                    <button className="mt-4 text-blue-700 hover:text-blue-900 text-sm font-medium flex items-center">
                                        View Details
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* hanya untuk user yang belum login akan ditampilkan */}
                {/* Call-to-Action Section */}
                <section className="container mx-auto py-12 px-6 mt-8 bg-blue-600 rounded-lg text-white text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Scholarship?</h2>
                    <p className="mb-6 max-w-2xl mx-auto">Join thousands of students who have already found funding for their education through our platform.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-blue-600 px-6 py-3 rounded font-medium">Create Account</button>
                        <button className="border border-white px-6 py-3 rounded font-medium">Learn More</button>
                    </div>
                </section>

                {/* Application Timeline Section */}
                <ApplicationTimeline />



                {/* FAQ Accordion Section */}
                <FaqAccordion />

                {/* ini aku komen karena sebagai pilihan aja kedepan mau di implemen apa engga */}
                {/* Testimonials Slider */}
                {/* <section className="container mx-auto p-6 bg-gray-100 rounded-lg mt-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Success Stories</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="w-24 h-24 rounded-full bg-gray-300 flex-shrink-0 mb-4 md:mb-0 md:mr-6"></div>
                            <div>
                                <p className="text-gray-600 italic">"This scholarship platform helped me find funding for my education when I thought there were no options left. I'm now in my second year of university!"</p>
                                <p className="font-bold mt-2">Sarah Johnson</p>
                                <p className="text-sm text-gray-500">Computer Science Student</p>
                            </div>
                        </div>
                        <div className="flex justify-center mt-4 space-x-1">
                            <button className="w-2 h-2 rounded-full bg-blue-600"></button>
                            <button className="w-2 h-2 rounded-full bg-gray-300"></button>
                            <button className="w-2 h-2 rounded-full bg-gray-300"></button>
                        </div>
                    </div>
                </section> */}

            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
