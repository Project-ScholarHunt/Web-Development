import React from 'react'

const CrudScholarshipForm = ({
    formData,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    resetForm,
    isEditing
}) => {
    return (
        <div>
            <div className="bg-white p-4 rounded shadow-md mb-6">
                <h2 className="text-lg font-medium mb-4">
                    {isEditing ? 'Edit Scholarship' : 'Add New Scholarship'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Scholarship Name</label>
                            <input
                                type="text"
                                name="scholarshipName"
                                value={formData.scholarshipName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Partner</label>
                            <input
                                type="text"
                                name="partner"
                                value={formData.partner}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                rows="3"
                                required
                            ></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Terms and Conditions</label>
                            <textarea
                                name="termsAndConditions"
                                value={formData.termsAndConditions}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                rows="3"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Quota</label>
                            <input
                                type="number"
                                name="quota"
                                value={formData.quota}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Time Limit</label>
                            <input
                                type="text"
                                name="timeLimit"
                                value={formData.timeLimit}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Logo</label>
                            <div className="flex items-center">
                                <input
                                    type="file"
                                    name="logo"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            {formData.logo && <p className="text-xs mt-1 truncate">Current: {formData.logo}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Thumbnail</label>
                            <div className="flex items-center">
                                <input
                                    type="file"
                                    name="thumbnail"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            {formData.thumbnail && <p className="text-xs mt-1 truncate">Current: {formData.thumbnail}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {isEditing ? 'Update' : 'Add'} Scholarship
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

        </div>
    )
}

export default CrudScholarshipForm