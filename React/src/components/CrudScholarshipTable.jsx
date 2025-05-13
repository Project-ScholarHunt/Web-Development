import React from 'react';

const CrudScholarshipTable = ({ items, handleEdit, handleDelete, isLoading }) => {
    if (items.length === 0 && !isLoading) {
        return (
            <div className="bg-white p-6 rounded shadow-md text-center">
                <p>No scholarships found. Add your first one above.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded shadow-md overflow-x-auto">
            <table className="w-full table-auto">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quota</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Limit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {items.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img className="h-10 w-10 rounded-full object-cover" src={item.logo} alt={item.scholarshipName} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{item.scholarshipName}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.partner}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quota}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.timeLimit}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {item.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button 
                                    onClick={() => handleEdit(item.id)} 
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                    disabled={isLoading}
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(item.id)} 
                                    className="text-red-600 hover:text-red-900"
                                    disabled={isLoading}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CrudScholarshipTable;
