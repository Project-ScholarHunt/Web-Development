import React from 'react';

const ScholarshipPerformanceTable = ({ performanceData }) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Scholarship Performance Overview</h2>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase sticky bg-gray-50">
                        <tr className='sticky'>
                            <th scope="col" className="py-3 px-6 sticky">Scholarship Name</th>
                            <th scope="col" className="py-3 px-6 sticky">Applicants</th>
                            <th scope="col" className="py-3 px-6 sticky">Approved</th>
                            <th scope="col" className="py-3 px-6 sticky">Approval Rate</th>
                            <th scope="col" className="py-3 px-6 sticky">Avg. GPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {performanceData.map((item) => (
                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                    {item.name}
                                </th>
                                <td className="py-4 px-6">{item.totalApplicants}</td>
                                <td className="py-4 px-6">{item.totalApproved}</td>
                                <td className="py-4 px-6">{item.approvalRate}%</td>
                                <td className="py-4 px-6">{item.avgGpa}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScholarshipPerformanceTable;