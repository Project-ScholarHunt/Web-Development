import React from 'react';

const ApplicationTimeline = () => {
    return (
        <section className="container mx-auto py-8 md:py-12">
            <h2 className="text-xl md:text-2xl font-bold mb-8 text-center text-gray-800">Application Process</h2>

            {/* Timeline for medium-large screens */}
            <div className="hidden md:block relative">

                <div className="space-y-16 relative z-10">
                    <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-[#357ABD]"></div>
                    {/* Step 1 - Desktop */}
                    <div className="flex items-center">
                        <div className="w-1/2 pr-12 text-right">
                            <div className="bg-white border border-gray-200 p-5 md:p-6 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:shadow-md">
                                <h3 className="text-lg font-bold text-[#357ABD] mb-2">Select a Scholarship Program</h3>
                                <p className="text-gray-600 text-sm lg:text-base">
                                    Browse through our scholarship listings and find the program that matches your academic goals and eligibility criteria.
                                </p>
                            </div>
                        </div>
                        <div className="relative flex items-center justify-center z-10">
                            <div className="z-50 border hover:cursor-pointer border-[#357ABD] rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-[#357ABD] font-medium text-sm bg-white shadow-md transition-all duration-300 ease-in-out hover:scale-110">
                                1
                            </div>
                            <div className="absolute w-12 h-1 bg-[#357ABD] -left-12"></div>
                        </div>
                        <div className="w-1/2 pl-12"></div>
                    </div>


                    {/* Step 2 - Desktop */}
                    <div className="flex items-center">
                        <div className="w-1/2 pr-12"></div>
                        <div className="relative flex items-center justify-center z-10">
                            <div className="z-50 border hover:cursor-pointer border-[#357ABD] rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-[#357ABD] font-medium text-sm bg-white shadow-md transition-all duration-300 ease-in-out hover:scale-110">
                                2
                            </div>
                            <div className="absolute w-12 h-1 bg-[#357ABD] -right-12"></div>
                        </div>
                        <div className="w-1/2 pl-12">
                            <div className="bg-white border border-gray-200 p-5 md:p-6 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:shadow-md">
                                <h3 className="text-lg font-bold text-[#357ABD] mb-2">Apply for Scholarship</h3>
                                <p className="text-gray-600 text-sm lg:text-base">
                                    Click the "Apply Now" button on the scholarship details page to begin the application process.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 - Desktop */}
                    <div className="flex items-center">
                        <div className="w-1/2 pr-12 text-right">
                            <div className="bg-white border border-gray-200 p-5 md:p-6 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:shadow-md">
                                <h3 className="text-lg font-bold text-[#357ABD] mb-2">Fill Out the Form</h3>
                                <p className="text-gray-600 text-sm lg:text-base">
                                    Complete all required information in the application form including personal details and supporting documents.
                                </p>
                            </div>
                        </div>
                        <div className="relative flex items-center justify-center z-10">
                            <div className="z-50 border hover:cursor-pointer border-[#357ABD] rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-[#357ABD] font-medium text-sm bg-white shadow-md transition-all duration-300 ease-in-out hover:scale-110">
                                3
                            </div>
                            <div className="absolute w-12 h-1 bg-[#357ABD] -left-12"></div>
                        </div>
                        <div className="w-1/2 pl-12"></div>
                    </div>

                    {/* Step 4 - Desktop */}
                    <div className="flex items-center">
                        <div className="w-1/2 pr-12"></div>
                        <div className="relative flex items-center justify-center z-10">
                            <div className="z-50 border hover:cursor-pointer border-[#357ABD] rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-[#357ABD] font-medium text-sm bg-white shadow-md transition-all duration-300 ease-in-out hover:scale-110">
                                4
                            </div>
                            <div className="absolute w-12 h-1 bg-[#357ABD] -right-12"></div>
                        </div>
                        <div className="w-1/2 pl-12">
                            <div className="bg-white border border-gray-200 p-5 md:p-6 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:shadow-md">
                                <h3 className="text-lg font-bold text-[#357ABD] mb-2">Wait for Selection</h3>
                                <p className="text-gray-600 text-sm lg:text-base">
                                    After submission, our team reviews your application. This process typically takes 2-4 weeks.
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Step 5 - Desktop */}
                    <div className="flex items-center">
                        <div className="w-1/2 pr-12 text-right">
                            <div className="bg-white border border-gray-200 p-5 md:p-6 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:shadow-md">
                                <h3 className="text-lg font-bold text-[#357ABD] mb-2">Receive Result via Email</h3>
                                <p className="text-gray-600 text-sm lg:text-base">
                                    You will receive an email notification with your selection results and further instructions.
                                </p>
                            </div>
                        </div>
                        <div className="relative flex items-center justify-center z-10">
                            <div className="z-50 border hover:cursor-pointer border-[#357ABD] rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-[#357ABD] font-medium text-sm bg-white shadow-md transition-all duration-300 ease-in-out hover:scale-110">
                                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <div className="absolute w-12 h-1 bg-[#357ABD] -left-12"></div>
                        </div>
                        <div className="w-1/2 pl-12"></div>
                    </div>
                </div>
            </div>


            {/* Timeline for small/mobile screens */}
            <div className="md:hidden relative pl-8 pr-8 space-y-16 before:absolute before:left-4 before:h-full before:w-0.5 before:bg-[#357ABD]">

                {/* Step 1 */}
                <div className="relative flex items-start space-x-6">
                    <div className="z-50 border border-[#357ABD] rounded-full min-w-10 min-h-10 flex items-center justify-center text-[#357ABD] font-medium text-sm bg-white shadow-md transition-all duration-300 ease-in-out hover:scale-110 leading-none select-none">
                        1
                    </div>
                    <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-md w-full">
                        <h3 className="text-lg font-bold text-[#357ABD] mb-2">Select a Scholarship Program</h3>
                        <p className="text-gray-600 text-sm">
                            Browse through our scholarship listings and find the program that matches your academic goals and eligibility criteria.
                        </p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-start space-x-6">
                    <div className="z-50 border border-[#357ABD] rounded-full min-w-10 min-h-10 flex items-center justify-center text-[#357ABD] font-medium text-sm bg-white shadow-md transition-all duration-300 ease-in-out hover:scale-110 leading-none select-none">
                        2
                    </div>
                    <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-md w-full">
                        <h3 className="text-lg font-bold text-[#357ABD] mb-2">Apply for Scholarship</h3>
                        <p className="text-gray-600 text-sm">
                            Click the "Apply Now" button on the scholarship details page to begin the application process.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-start space-x-6">
                    <div className="z-50 border border-[#357ABD] rounded-full min-w-10 min-h-10 flex items-center justify-center text-[#357ABD] font-medium text-sm bg-white shadow-md transition-all duration-300 ease-in-out hover:scale-110 leading-none select-none">
                        3
                    </div>
                    <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-md w-full">
                        <h3 className="text-lg font-bold text-[#357ABD] mb-2">Fill Out the Form</h3>
                        <p className="text-gray-600 text-sm">
                            Complete all required information in the application form including personal details and supporting documents.
                        </p>
                    </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-start space-x-6">
                    <div className="z-50 border border-[#357ABD] rounded-full min-w-10 min-h-10 flex items-center justify-center text-[#357ABD] font-medium text-sm bg-white shadow-md transition-all duration-300 ease-in-out hover:scale-110 leading-none select-none">
                        4
                    </div>
                    <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-md w-full">
                        <h3 className="text-lg font-bold text-[#357ABD] mb-2">Wait for Selection</h3>
                        <p className="text-gray-600 text-sm">
                            After submission, our team reviews your application. This process typically takes 2-4 weeks.
                        </p>
                    </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex items-start space-x-6">
                    <div className="z-50 border border-[#357ABD] rounded-full min-w-10 min-h-10 flex items-center justify-center text-[#357ABD] font-medium text-sm bg-white shadow-md transition-all duration-300 ease-in-out hover:scale-110 leading-none select-none">
                        <i className="ri-check-line"></i>
                    </div>
                    <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-md w-full">
                        <h3 className="text-lg font-bold text-[#357ABD] mb-2">Receive Result via Email</h3>
                        <p className="text-gray-600 text-sm">You will receive an email notification with your selection results and further instructions.</p>
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
