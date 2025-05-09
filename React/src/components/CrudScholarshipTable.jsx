import React from 'react'

const CrudScholarshipTable = ({
    items,
    handleEdit,
    handleDelete
}) => {
    return (
        <div>
            <div className="bg-white rounded shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">Name</th>
                                <th className="p-2 text-left hidden md:table-cell">Partner</th>
                                <th className="p-2 text-left hidden md:table-cell">Quota</th>
                                <th className="p-2 text-left hidden md:table-cell">Time Limit</th>
                                <th className="p-2 text-left">Status</th>
                                <th className="p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-t hover:bg-gray-50">
                                    <td className="p-2">
                                        <div>{item.scholarshipName}</div>
                                        <div className="text-xs text-gray-500 md:hidden">
                                            {item.partner} | Quota: {item.quota} | Limit: {item.timeLimit}
                                        </div>
                                    </td>
                                    <td className="p-2 hidden md:table-cell">{item.partner}</td>
                                    <td className="p-2 hidden md:table-cell">{item.quota}</td>
                                    <td className="p-2 hidden md:table-cell">{item.timeLimit}</td>
                                    <td className="p-2">
                                        <span className={`inline-block px-2 py-1 rounded text-xs ${item.status === 'active' ? 'bg-green-100 text-green-800' :
                                            item.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleEdit(item.id)}
                                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">
                                        No scholarships found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CrudScholarshipTable