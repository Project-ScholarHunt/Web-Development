// components/FaqAccordion.jsx
import React, { useState } from 'react';

const FaqAccordion = () => {
    // FAQ data contained within the component
    const faqData = [
        {
            id: 1,
            question: "What is required to apply for a scholarship?",
            answer: "You need to complete a registration form that consists of 3 steps: personal information, academic information, and document upload. Required documents include a recommendation letter, a statement letter, and an academic transcript, all in PDF format and no larger than 2MB."
        },
        {
            id: 2,
            question: "What are the possible statuses of my scholarship application?",
            answer: "The application status can be: Pending, Under Review, Interview, Accepted, Rejected, or Withdrawn. You can check your latest status on the 'My Scholarships' page."
        },
        {
            id: 3,
            question: "Can I cancel my scholarship application?",
            answer: "Yes. If your application status is still Pending or Under Review, you can click the 'Withdraw Application' button to cancel your submission."
        },
    ];


    // State for managing which FAQ is open
    const [openFaq, setOpenFaq] = useState(null);

    // Toggle function for accordion
    const toggleFaq = (id) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    return (
        <section className="container mx-auto p-2 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>

            <div className="max-w-3xl mx-auto">
                {faqData.map((faq) => (
                    <div key={faq.id} className="mb-4">
                        <button
                            onClick={() => toggleFaq(faq.id)}
                            className="w-full flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <span className="font-medium text-left">{faq.question}</span>
                            <svg
                                className={`w-5 h-5 transition-transform duration-200 ${openFaq === faq.id ? 'transform rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 bg-white rounded-b-lg px-4 ${openFaq === faq.id ? 'max-h-96 py-4' : 'max-h-0'
                                }`}
                        >
                            <p className="text-gray-700">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FaqAccordion;
