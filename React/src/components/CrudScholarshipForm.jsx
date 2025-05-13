import React from 'react';

const CrudScholarshipForm = ({ 
    formData, 
    handleInputChange, 
    handleFileChange, 
    handleSubmit, 
    resetForm, 
    isEditing,
    isLoading 
}) => {
    return (
        <div className="bg-white p-6 rounded shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Scholarship' : 'Add New Scholarship'}</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
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
                    
                    <div className="mb-4">
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
                </div>
                
                <div className="mb-4">
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
                
                <div className="mb-4">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Quota</label>
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
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Time Limit</label>
                        <input 
                            type="date" 
                            name="timeLimit" 
                            value={formData.timeLimit && typeof formData.timeLimit === 'string' ? formData.timeLimit.substring(0, 10) : formData.timeLimit} 
                            onChange={handleInputChange} 
                            className="w-full p-2 border border-gray-300 rounded" 
                            required 
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Logo</label>
                        <input 
                            type="file" 
                            name="logo" 
                            onChange={handleFileChange} 
                            className="w-full p-2 border border-gray-300 rounded"
                            accept="image/*"
                            // Only required for new scholarships
                            required={!isEditing} 
                        />
                        {/* Show preview if logo exists and is a string (URL) */}
                        {formData.logo && typeof formData.logo === 'string' && (
                            <div className="mt-2">
                                <img 
                                    src={formData.logo} 
                                    alt="Logo Preview" 
                                    className="w-32 h-32 object-contain border border-gray-300" 
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Thumbnail (Optional)</label>
                        <input 
                            type="file" 
                            name="thumbnail" 
                            onChange={handleFileChange} 
                            className="w-full p-2 border border-gray-300 rounded"
                            accept="image/*" 
                        />
                        {/* Show preview if thumbnail exists and is a string (URL) */}
                        {formData.thumbnail && typeof formData.thumbnail === 'string' && (
                            <div className="mt-2">
                                <img 
                                    src={formData.thumbnail} 
                                    alt="Thumbnail Preview" 
                                    className="w-32 h-32 object-contain border border-gray-300" 
                                />
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                    <button 
                        type="button" 
                        onClick={resetForm} 
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : isEditing ? 'Update Scholarship' : 'Add Scholarship'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrudScholarshipForm;
