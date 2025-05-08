import React from 'react';

const ApplicationTimeline = () => {
    return (
        <section className="container mx-auto px-4 py-8 md:py-12">
            <h2 className="text-xl md:text-2xl font-bold mb-8 text-center">Application Process</h2>

            {/* Timeline for medium-large screens */}
            <div className="hidden md:block relative">
                {/* Vertical connector line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-300"></div>

                <div className="space-y-16">
                    {/* Step 1 - Desktop */}
                    <div className="flex items-center">
                        <div className="w-1/2 pr-12 text-right">
                            <h3 className="text-lg font-bold text-blue-600 mb-2">Select a Scholarship Program</h3>
                            <p className="text-gray-600 text-sm lg:text-base">Browse through our scholarship listings and find the program that matches your academic goals and eligibility criteria.</p>
                        </div>
                        <div className="relative flex items-center justify-center z-10">
                            <div className="bg-blue-600 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-white font-bold text-xl shadow-lg">1</div>
                            <div className="absolute w-12 h-1 bg-blue-300 -left-12"></div>
                        </div>
                        <div className="w-1/2 pl-12"></div>
                    </div>

                    {/* Step 2 - Desktop */}
                    <div className="flex items-center">
                        <div className="w-1/2 pr-12"></div>
                        <div className="relative flex items-center justify-center z-10">
                            <div className="bg-blue-600 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-white font-bold text-xl shadow-lg">2</div>
                            <div className="absolute w-12 h-1 bg-blue-300 -right-12"></div>
                        </div>
                        <div className="w-1/2 pl-12">
                            <h3 className="text-lg font-bold text-blue-600 mb-2">Apply for Scholarship</h3>
                            <p className="text-gray-600 text-sm lg:text-base">Click the "Apply Now" button on the scholarship details page to begin the application process.</p>
                        </div>
                    </div>

                    {/* Step 3 - Desktop */}
                    <div className="flex items-center">
                        <div className="w-1/2 pr-12 text-right">
                            <h3 className="text-lg font-bold text-blue-600 mb-2">Fill Out the Form</h3>
                            <p className="text-gray-600 text-sm lg:text-base">Complete all required information in the application form including personal details and supporting documents.</p>
                        </div>
                        <div className="relative flex items-center justify-center z-10">
                            <div className="bg-blue-600 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-white font-bold text-xl shadow-lg">3</div>
                            <div className="absolute w-12 h-1 bg-blue-300 -left-12"></div>
                        </div>
                        <div className="w-1/2 pl-12"></div>
                    </div>

                    {/* Step 4 - Desktop */}
                    <div className="flex items-center">
                        <div className="w-1/2 pr-12"></div>
                        <div className="relative flex items-center justify-center z-10">
                            <div className="bg-blue-600 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-white font-bold text-xl shadow-lg">4</div>
                            <div className="absolute w-12 h-1 bg-blue-300 -right-12"></div>
                        </div>
                        <div className="w-1/2 pl-12">
                            <h3 className="text-lg font-bold text-blue-600 mb-2">Wait for Selection</h3>
                            <p className="text-gray-600 text-sm lg:text-base">After submission, our team reviews your application. This process typically takes 2-4 weeks.</p>
                        </div>
                    </div>

                    {/* Step 5 - Desktop */}
                    <div className="flex items-center">
                        <div className="w-1/2 pr-12 text-right">
                            <h3 className="text-lg font-bold text-blue-600 mb-2">Receive Results via Email</h3>
                            <p className="text-gray-600 text-sm lg:text-base">You will receive an email notification with your selection results and further instructions.</p>
                        </div>
                        <div className="relative flex items-center justify-center z-10">
                            <div className="bg-green-600 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <div className="absolute w-12 h-1 bg-blue-300 -left-12"></div>
                        </div>
                        <div className="w-1/2 pl-12"></div>
                    </div>
                </div>
            </div>

            {/* Timeline for small/mobile screens */}
            <div className="md:hidden">
                <div className="relative pl-8 space-y-8 before:absolute before:left-4 before:h-full before:w-0.5 before:bg-blue-300">
                    {/* Step 1 - Mobile */}
                    <div className="relative">
                        <div className="absolute -left-8 top-0 mt-1.5 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold z-10">
                            1
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-600 mb-1">Select a Scholarship Program</h3>
                            <p className="text-gray-600 text-sm">Browse through our scholarship listings and find the program that matches your goals.</p>
                        </div>
                    </div>

                    {/* Step 2 - Mobile */}
                    <div className="relative">
                        <div className="absolute -left-8 top-0 mt-1.5 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold z-10">
                            2
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-600 mb-1">Apply for Scholarship</h3>
                            <p className="text-gray-600 text-sm">Click the "Apply Now" button to begin the application process.</p>
                        </div>
                    </div>

                    {/* Step 3 - Mobile */}
                    <div className="relative">
                        <div className="absolute -left-8 top-0 mt-1.5 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold z-10">
                            3
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-600 mb-1">Fill Out the Form</h3>
                            <p className="text-gray-600 text-sm">Complete all required information and upload documents.</p>
                        </div>
                    </div>

                    {/* Step 4 - Mobile */}
                    <div className="relative">
                        <div className="absolute -left-8 top-0 mt-1.5 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold z-10">
                            4
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-600 mb-1">Wait for Selection</h3>
                            <p className="text-gray-600 text-sm">Our team reviews your application (2-4 weeks).</p>
                        </div>
                    </div>

                    {/* Step 5 - Mobile */}
                    <div className="relative">
                        <div className="absolute -left-8 top-0 mt-1.5 bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white z-10">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-600 mb-1">Receive Results via Email</h3>
                            <p className="text-gray-600 text-sm">Get notified about your selection status.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Timeline Information */}
            <div className="mt-10 bg-white p-4 md:p-6 rounded-lg shadow-md">
                <h3 className="text-md md:text-lg font-bold mb-3">Timeline Notes:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm md:text-base">
                    <li>The full application process typically takes 4-6 weeks from submission to final decision</li>
                    <li>Keep an eye on your email (including spam folder) for communication</li>
                    <li>Check your application status anytime in your dashboard</li>
                    <li>If selected, confirm your acceptance within 7 days</li>
                </ul>
            </div>
        </section>
    );
};

export default ApplicationTimeline;
