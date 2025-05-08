import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ScholarshipDashboard = () => {
    // Sample data - replace with your API call
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        scholarshipName: '',
        partner: '',
        description: '',
        termsAndConditions: '',
        quota: '',
        timeLimit: '',
        logo: '',
        thumbnail: '',
        status: 'active'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Fetch data - replace with API call
    useEffect(() => {
        // Simulating API call
        const sampleData = [
            {
                id: 1,
                scholarshipName: "Engineering Excellence Scholarship",
                partner: "Tech Solutions Inc",
                description: "Scholarship for outstanding engineering students",
                termsAndConditions: "Must maintain 3.5 GPA",
                quota: 50,
                timeLimit: "6 months",
                logo: "tech-logo.png",
                thumbnail: "tech-thumbnail.jpg",
                status: "active"
            },
            {
                id: 2,
                scholarshipName: "Business Leaders of Tomorrow",
                partner: "Global Business Association",
                description: "Supporting future business leaders",
                termsAndConditions: "Must participate in leadership program",
                quota: 25,
                timeLimit: "1 year",
                logo: "business-logo.png",
                thumbnail: "business-thumbnail.jpg",
                status: "active"
            }
        ];
        setItems(sampleData);
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'quota' ? parseInt(value) : value
        });
    };

    // Handle file uploads
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            // In a real app, you'd upload the file and get a URL
            setFormData({
                ...formData,
                [name]: files[0].name // Placeholder, would be a URL in production
            });
        }
    };

    // Submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            // Update existing item
            setItems(items.map(item => item.id === formData.id ? formData : item));
        } else {
            // Add new item
            setItems([...items, { ...formData, id: Date.now() }]);
        }
        resetForm();
    };

    // Edit an item
    const handleEdit = (id) => {
        const itemToEdit = items.find(item => item.id === id);
        setFormData(itemToEdit);
        setIsEditing(true);
        // Scroll to form when editing on mobile
        if (window.innerWidth < 768) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Delete an item
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this scholarship?')) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            id: '',
            scholarshipName: '',
            partner: '',
            description: '',
            termsAndConditions: '',
            quota: '',
            timeLimit: '',
            logo: '',
            thumbnail: '',
            status: 'active'
        });
        setIsEditing(false);
    };

    // Filter items based on search term
    const filteredItems = items.filter(item =>
        item.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
            {/* Mobile Header with Menu Button */}
            <div className="bg-white p-4 flex items-center justify-between md:hidden shadow-md">
                <h2 className="text-xl font-bold">Admin Portal</h2>
                <button 
                    onClick={toggleMobileMenu} 
                    className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                    {isMobileMenuOpen ? 'Close' : 'Menu'}
                </button>
            </div>

            {/* Sidebar - responsive */}
            <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white shadow-md md:min-h-screen`}>
                <div className="p-4 hidden md:block">
                    <h2 className="text-xl font-bold">Admin Portal</h2>
                </div>
                <nav className="mt-2 md:mt-6">
                    <ul>
                        <li className="hover:bg-gray-200">
                            <Link to="/" className="block px-4 py-2 text-gray-700">
                                Applicants
                            </Link>
                        </li>
                        <li className="bg-blue-100 hover:bg-blue-200">
                            <Link to="/scholarships" className="block px-4 py-2 text-blue-700">
                                Scholarships
                            </Link>
                        </li>
                        <li className="hover:bg-gray-200">
                            <Link to="/users" className="block px-4 py-2 text-gray-700">
                                Users
                            </Link>
                        </li>
                        <li className="hover:bg-gray-200">
                            <Link to="/settings" className="block px-4 py-2 text-gray-700">
                                Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6">
                <h1 className="text-2xl font-semibold mb-4">Manage Scholarships</h1>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search scholarships..."
                        className="w-full p-2 border border-gray-300 rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Form */}
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

                {/* List of Items */}
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
                                {filteredItems.map(item => (
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
                                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                                                item.status === 'active' ? 'bg-green-100 text-green-800' :
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
                                {filteredItems.length === 0 && (
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
            </main>
        </div>
    );
};

export default ScholarshipDashboard;
