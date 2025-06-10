import React from 'react'

const StatCard = ({ title, value, subtitle, icon }) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-1">{title}</h3>
            <div className="flex items-baseline">
                <span className="text-3xl font-bold text-indigo-600">{value}</span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
                {icon && <span className="mr-1.5"><i className={icon}></i></span>}
                <span>{subtitle}</span>
            </div>
        </div>
    );
};

export default StatCard;