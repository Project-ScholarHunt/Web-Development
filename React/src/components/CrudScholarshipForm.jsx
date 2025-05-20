import React from 'react';

const CrudScholarshipForm = ({
    formData,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    resetForm,
    isEditing,
    isSubmitting
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-medium mb-4">
                {isEditing ? 'Edit Scholarship' : 'Add New Scholarship'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Scholarship Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Scholarship Name
                        </label>
                        <input
                            type="text"
                            name="scholarshipName"
                            value={formData.scholarshipName}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    {/* Partner */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Partner
                        </label>
                        <input
                            type="text"
                            name="partner"
                            value={formData.partner}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded h-24"
                        required
                    ></textarea>
                </div>

                {/* Terms and Conditions */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Terms and Conditions
                    </label>
                    <textarea
                        name="termsAndConditions"
                        value={formData.termsAndConditions}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded h-24"
                        required
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Quota */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Quota
                        </label>
                        <input
                            type="number"
                            name="quota"
                            value={formData.quota}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            min="1"
                            required
                        />
                    </div>

                    {/* Time Limit */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Time Limit
                        </label>
                        <input
                            type="date"
                            name="timeLimit"
                            value={formData.timeLimit}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                </div>

                {/* Logo */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Logo
                    </label>
                    <input
                        id="logoInput"
                        type="file"
                        name="logo"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        accept="image/*"
                        required={!isEditing}
                    />
                    {isEditing && formData.logoUrl && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-1">Current logo:</p>
                            <img
                                src={formData.logoUrl}
                                alt="Current Logo"
                                className="w-32 h-auto object-contain border border-gray-200 rounded"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Upload a new image only if you want to change the current logo
                            </p>
                        </div>
                    )}
                </div>

                {/* Thumbnail */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Thumbnail (Optional)
                    </label>
                    <input
                        id="thumbnailInput"
                        type="file"
                        name="thumbnail"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        accept="image/*"
                    />
                    {isEditing && formData.thumbnailUrl && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-1">Current thumbnail:</p>
                            <img
                                src={formData.thumbnailUrl}
                                alt="Current Thumbnail"
                                className="w-32 h-auto object-contain border border-gray-200 rounded"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Upload a new image only if you want to change the current thumbnail
                            </p>
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-2 pt-4">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : isEditing ? 'Update Scholarship' : 'Add Scholarship'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrudScholarshipForm;