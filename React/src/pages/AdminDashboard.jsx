import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import CrudScholarshipForm from '../components/CrudScholarshipForm';
import CrudScholarshipTable from '../components/CrudScholarshipTable';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api";

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
        thumbnail: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
            setError("Failed to load scholarships. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'quota' ? parseInt(value) || '' : value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'logo' || key === 'thumbnail') {
                if (formData[key] instanceof File) {
                    formDataToSend.append(key, formData[key]);
                }
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            let response;
            if (isEditing) {
                formDataToSend.append('_method', 'PUT');
                response = await axios.post(`${API_URL}/scholarships/${formData.id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setItems(items.map(item => item.id === formData.id ? response.data : item));
            } else {
                response = await axios.post(`${API_URL}/scholarships`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setItems([...items, response.data]);
            }
            resetForm();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (id) => {
        const itemToEdit = items.find(item => item.id === id);
        setFormData({
            id: itemToEdit.id,
            scholarshipName: itemToEdit.scholarshipName,
            partner: itemToEdit.partner,
            description: itemToEdit.description,
            termsAndConditions: itemToEdit.termsAndConditions,
            quota: itemToEdit.quota,
            timeLimit: itemToEdit.timeLimit,
            logo: '', // Reset file input for editing
            thumbnail: '' // Reset file input for editing
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this scholarship?')) {
            setIsLoading(true);
            setError(null);
            try {
                await axios.delete(`${API_URL}/scholarships/${id}`);
                setItems(items.filter(item => item.id !== id));
            } catch (err) {
                setError("Failed to delete scholarship. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        }
    };

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
            thumbnail: ''
        });
        setIsEditing(false);
    };

    const filteredItems = items.filter(item =>
        item.scholarshipName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partner?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
            <div className="bg-white p-4 flex items-center justify-between md:hidden shadow-md">
                <h2 className="text-xl font-bold">Admin Portal</h2>
                <button onClick={toggleMobileMenu} className="p-2 rounded bg-gray-100 hover:bg-gray-200">
                    {isMobileMenuOpen ? <i className="ri-close-large-fill text-xl"></i> : <i className="ri-dashboard-horizontal-line text-xl"></i>}
                </button>
            </div>
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} />
            <main className="flex-1 p-4 md:p-6">
                <h1 className="text-2xl font-semibold mb-4">Add New Scholarship</h1>
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}
                {isLoading && <div className="text-center my-4">Loading...</div>}
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