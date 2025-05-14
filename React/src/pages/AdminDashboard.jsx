import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import CrudScholarshipForm from '../components/CrudScholarshipForm';
import CrudScholarshipTable from '../components/CrudScholarshipTable';
import { useNavigate } from 'react-router';

const AdminDashboard = () => {
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
    const [authorized, setAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('http:127.0.0.1:8000/api/check-admin', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    setAuthorized(true);
                    console.log("Authorization success")
                    console.log(document.cookie)
                } else {
                    setAuthorized(false);
                    navigate("/NotFound")
                }
            } catch (error) {
                console.error('Error checking admin:', error);
            }
        }
        checkAdmin();
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

    function handleLogout() {
        fetch('http://127.0.0.1:8000/api/logout', {
            method: 'POST',
            credentials: 'include',
        })
            .then((res) => {
                if (res.ok) {
                    console.log("Logout berhasil");
                    window.location.href = '/login';
                } else {
                    console.error("Logout gagal");
                }
            })
            .catch((err) => {
                console.error("Logout error:", err);
            });
    }

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
                    {isMobileMenuOpen ? <i class="ri-close-large-fill text-xl"></i> : <i class="ri-dashboard-horizontal-line text-xl"></i>}
                </button>
            </div>

            {/* Sidebar - responsive */}
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6">
                <div className='flex items-center justify-between my-5'>
                    <h1 className="text-2xl font-semibold">Manage Scholarships</h1>
                    <button className='rounded p-3 text-white bg-red-500' onClick={handleLogout}>Logout</button>
                </div>
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
                />

                <CrudScholarshipTable
                    items={filteredItems}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </main>
        </div>
    );
};

export default AdminDashboard;