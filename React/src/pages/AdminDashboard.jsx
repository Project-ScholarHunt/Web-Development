// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import AdminScholarships from '../components/AdminScholarships';
import AdminApplicants from '../components/AdminApplicants';
import AdminAnalytics from '../components/AdminAnalytics';
import NotFound from '../pages/notfound'
import Loading from '../components/Loading'
import ScholarshipApplicants from './ScholarshipApplicants';

const AdminDashboard = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState('unauthorized');
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [viewingApplicantsForId, setViewingApplicantsForId] = useState(null);

    const handleViewApplicants = (scholarshipId) => {
        console.log("Viewing applicants for scholarship ID:", scholarshipId);
        setViewingApplicantsForId(scholarshipId);
    };

    const handleBackToScholarshipList = () => {
        setViewingApplicantsForId(null);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const rawUser = localStorage.getItem('user');
        const isAdmin = (() => {
            try {
                const parsed = JSON.parse(rawUser);
                return !!parsed.is_admin;
            } catch (e) {
                setCurrentSection('unauthorized');
                setIsAuthorized(false)
            }
        })();
        if (isAdmin) {
            setCurrentSection('loading')
            fetch("http://localhost:8000/api/admin/check-token", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.message === "Admin token is valid") {
                        console.log("Welcome admin");
                        setIsAuthorized(true)
                        setCurrentSection('scholarships')
                    } else {
                        console.log(data.message)
                        setCurrentSection('unauthorized')
                    }
                })
                .catch(err => console.error("Error verifying admin token", err));
        }
    }, []);

    const renderContent = () => {
        switch (currentSection) {
            case 'scholarships':
                return <AdminScholarships />;
            case 'applicants':
                return <AdminApplicants />;
            case 'analytics':
                return <AdminAnalytics />;
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
            case 'unauthorized':
                return <NotFound />
            case 'loading':
                return <Loading />
            default:
                return <AdminScholarships />;
        }
    };

    const render = isAuthorized ? "min-h-screen flex flex-col md:flex-row bg-gray-100" : ""

    return (
        <div className={`${render}`}>
            {isAuthorized ? (
                <>
                    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">

                    </div>
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
                    <Sidebar
                        isMobileMenuOpen={isMobileMenuOpen}
                        currentSection={currentSection}
                        setCurrentSection={setCurrentSection}
                    />
                </>
            ) : null}

            <main className="flex-1 p-4 md:p-6">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;