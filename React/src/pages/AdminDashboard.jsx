// AdminDashboard.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AdminScholarships from '../components/AdminScholarships';
import AdminApplicants from '../components/AdminApplicants';

const AdminDashboard = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState('scholarships'); // Default section

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Render content berdasarkan section yang dipilih
    const renderContent = () => {
        switch (currentSection) {
            case 'scholarships':
                return <AdminScholarships />;
            case 'applicants':
                return <AdminApplicants />;
            case 'users':
                return <div className="p-4 bg-white rounded-lg shadow-md">
                    <h1 className="text-xl font-bold mb-4">User Management</h1>
                    <p>User management feature will be implemented soon.</p>
                </div>;
            case 'settings':
                return <div className="p-4 bg-white rounded-lg shadow-md">
                    <h1 className="text-xl font-bold mb-4">Settings</h1>
                    <p>Settings panel will be implemented soon.</p>
                </div>;
            default:
                return <AdminScholarships />;
        }
    };
    useEffect(() => {
        console.log("useEffect executed")
        fetch("http://localhost:8000/api/admin/check-token", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Accept": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === "Admin token is valid") {
                    fetchScholarships();
                    console.log("Welcome admin");
                } else {
                    console.warn("Unauthorized");
                }
            })
            .catch(err => console.error("Error verifying admin token", err));
    }, []);
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
            {/* Mobile Header with Menu Button */}
            <div className="bg-white p-4 flex items-center justify-between md:hidden shadow-md">
                <h2 className="text-xl font-bold">Admin Portal</h2>
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                    {isMobileMenuOpen ?
                        <i className="ri-close-line text-xl"></i> :
                        <i className="ri-menu-line text-xl"></i>
                    }
                </button>
            </div>

            {/* Sidebar - responsive */}
            <Sidebar
                isMobileMenuOpen={isMobileMenuOpen}
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
            />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;