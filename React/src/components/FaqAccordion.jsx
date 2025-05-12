// components/FaqAccordion.jsx
import React, { useState } from 'react';

const FaqAccordion = () => {
    // FAQ data contained within the component
    const faqData = [
        {
            id: 1,
            question: "Lorem ipsum dolor sit amet?",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc."
        },
        {
            id: 2,
            question: "Consectetur adipiscing elit, sed do eiusmod tempor?",
            answer: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
        },
        {
            id: 3,
            question: "Ut enim ad minim veniam, quis nostrud exercitation?",
            answer: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet."
        }
    ];

    // State for managing which FAQ is open
    const [openFaq, setOpenFaq] = useState(null);

    // Toggle function for accordion
    const toggleFaq = (id) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    return (
        <section className="container mx-auto p-6 mb-10">
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
