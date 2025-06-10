import React from 'react'

const ChartCard = ({ title, children }) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
            <div className="h-96"> 
                {children}
            </div>
        </div>
    );
};

export default ChartCard;