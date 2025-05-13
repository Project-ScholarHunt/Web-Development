import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import CrudScholarshipForm from '../components/CrudScholarshipForm';
import CrudScholarshipTable from '../components/CrudScholarshipTable';
import axios from 'axios'; // Pastikan axios sudah diinstal (npm install axios)

const API_URL = "http://127.0.0.1:8000/api"; // Sesuaikan dengan URL Laravel Anda

const AdminDashboard = () => {
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch data from API
    useEffect(() => {
        fetchScholarships();
    }, []);

    const fetchScholarships = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/scholarships`);
            setItems(response.data);
        } catch (err) {
            console.error("Error fetching scholarships:", err);
            setError("Failed to load scholarships. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

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
            // Store the actual file object for later upload
            setFormData({
                ...formData,
                [name]: files[0] // Store the file object instead of just the name
            });
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            // Create FormData object for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('scholarshipName', formData.scholarshipName);
            formDataToSend.append('partner', formData.partner);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('termsAndConditions', formData.termsAndConditions);
            formDataToSend.append('quota', formData.quota);
            formDataToSend.append('timeLimit', formData.timeLimit);
            
            // Check if logo is a File object (for new/changed file)
            if (formData.logo instanceof File) {
                formDataToSend.append('logo', formData.logo);
            }
            
            // Check if thumbnail is a File object (for new/changed file)
            if (formData.thumbnail instanceof File) {
                formDataToSend.append('thumbnail', formData.thumbnail);
            }
            
            let response;
            
            if (isEditing) {
                // Update existing item - Using POST with _method=PUT for FormData
                formDataToSend.append('_method', 'PUT');
                response = await axios.post(
                    `${API_URL}/scholarships/${formData.id}`, 
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                setItems(items.map(item => item.id === formData.id ? response.data : item));
            } else {
                // Add new item
                response = await axios.post(
                    `${API_URL}/scholarships`, 
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                setItems([...items, response.data]);
            }
            
            resetForm();
        } catch (err) {
            console.error("Error submitting form:", err);
            if (err.response) {
                // Tampilkan pesan error API secara detail
                console.log("Response status:", err.response.status);
                console.log("Response data:", err.response.data);
                if (err.response.data.errors) {
                    // Error validasi dari backend
                    setError(Object.values(err.response.data.errors).flat().join(", "));
                } else if (err.response.data.error) {
                    setError(err.response.data.error);
                } else {
                    setError("Server error: " + err.response.status);
                }
            } else if (err.request) {
                setError("No response from server. Please check your backend connection.");
            } else {
                setError("Error: " + err.message);
            }
        } finally {
            setIsLoading(false);
        }
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
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this scholarship?')) {
            setIsLoading(true);
            setError(null);
            
            try {
                await axios.delete(`${API_URL}/scholarships/${id}`);
                setItems(items.filter(item => item.id !== id));
            } catch (err) {
                console.error("Error deleting scholarship:", err);
                setError("Failed to delete scholarship. Please try again later.");
            } finally {
                setIsLoading(false);
            }
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
        item.scholarshipName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partner?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    {isMobileMenuOpen ? <i className="ri-close-large-fill text-xl"></i> : <i className="ri-dashboard-horizontal-line text-xl"></i>}
                </button>
            </div>

            {/* Sidebar - responsive */}
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6">
                <h1 className="text-2xl font-semibold mb-4">Manage Scholarships</h1>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="text-center my-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                        <p className="mt-2">Loading...</p>
                    </div>
                )}

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

                <CrudScholarshipForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleFileChange={handleFileChange}
                    handleSubmit={handleSubmit}
                    resetForm={resetForm}
                    isEditing={isEditing}
                    isLoading={isLoading}
                />

                <CrudScholarshipTable
                    items={filteredItems}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    isLoading={isLoading}
                />
            </main>
        </div>
    );
};

export default AdminDashboard;
