import React from 'react';

const ProgressBar = ({ label, value, total, color }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-gray-700">{label}</span>
            <span className="text-base font-medium text-gray-700">{value} / {total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className={`${color} h-2.5 rounded-full`}
                style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
            ></div>
        </div>
    </div>
);


const StatusMetrics = ({ stats }) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 h-full flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Detailed Status Metrics</h2>
            <div className="space-y-5">
                <ProgressBar label="Pending" value={stats.pendingApplicants} total={stats.totalApplicants} color="bg-yellow-400" />
                <ProgressBar label="Approved" value={stats.approvedApplicants} total={stats.totalApplicants} color="bg-green-500" />
                <ProgressBar label="Rejected" value={stats.rejectedApplicants} total={stats.totalApplicants} color="bg-red-500" />
            </div>
        </div>
    );
};

export default StatusMetrics;