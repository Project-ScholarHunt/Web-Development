import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import axios from 'axios';

const Profile = () => {
    // State untuk data profile user
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tempUserData, setTempUserData] = useState({});
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Fetch user data when component mounts
    useEffect(() => {
        fetchUserData();
    }, []);

    // Function to fetch user data from API
    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            
            // Ambil token dari localStorage atau dari mana pun token Anda disimpan
            const token = localStorage.getItem('token') || 
                          sessionStorage.getItem('token') ||
                          (document.cookie.match(/token=([^;]+)/) ? document.cookie.match(/token=([^;]+)/)[1] : null);
            
            if (!token) {
                setError('Token not found. Please login again.');
                setIsLoading(false);
                return;
            }
            
            const response = await axios.get('http://127.0.0.1:8000/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            const user = response.data;
            
            // PENTING: menggunakan name bukan username sesuai dengan database Laravel
            setUserData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
            
            setTempUserData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
            
            setError(null);
        } catch (err) {
            console.error('Error fetching user data:', err);
            if (err.response && err.response.status === 401) {
                setError('Authentication error. Please login again.');
            } else {
                setError('Failed to load profile data. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempUserData({
            ...tempUserData,
            [name]: value
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm({
            ...passwordForm,
            [name]: value
        });
    };

    // Submit profile updates to API
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token') || 
                        sessionStorage.getItem('token') ||
                        (document.cookie.match(/token=([^;]+)/) ? document.cookie.match(/token=([^;]+)/)[1] : null);
            
            if (!token) {
                setError('Token not found. Please login again.');
                return;
            }
            
            // PENTING: mengirim name bukan username sesuai dengan database Laravel
            const response = await axios.put('http://127.0.0.1:8000/api/profile', 
                {
                    name: tempUserData.name,
                    email: tempUserData.email,
                    phone: tempUserData.phone
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            // Update user data with response
            setUserData({
                ...userData,
                ...response.data.user
            });
            setIsEditing(false);
            alert('Profil berhasil diperbarui!');
        } catch (err) {
            console.error('Error updating profile:', err);
            if (err.response && err.response.status === 401) {
                setError('Authentication error. Please login again.');
            } else if (err.response && err.response.data) {
                alert(`Error: ${err.response.data.message || 'Gagal memperbarui profil'}`);
            } else {
                alert('Gagal memperbarui profil. Silakan coba lagi.');
            }
        }
    };

    // Submit password change to API
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('Password baru dan konfirmasi password harus sama!');
            return;
        }
        
        try {
            const token = localStorage.getItem('token') || 
                        sessionStorage.getItem('token') ||
                        (document.cookie.match(/token=([^;]+)/) ? document.cookie.match(/token=([^;]+)/)[1] : null);
            
            if (!token) {
                setError('Token not found. Please login again.');
                return;
            }
            
            await axios.post('http://127.0.0.1:8000/api/profile/password',
                {
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                    newPassword_confirmation: passwordForm.confirmPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            alert('Password berhasil diperbarui!');
            setShowPasswordModal(false);
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            console.error('Error updating password:', err);
            if (err.response && err.response.status === 401) {
                setError('Authentication error. Please login again.');
            } else if (err.response && err.response.data) {
                alert(`Error: ${err.response.data.message || 'Gagal memperbarui password'}`);
            } else {
                alert('Gagal memperbarui password. Silakan coba lagi.');
            }
        }
    };

    const handleCancel = () => {
        setTempUserData({ ...userData });
        setIsEditing(false);
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-white text-xl">Loading profile data...</div>
                </div>
                <Footer />
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold text-red-500 mb-4">Error</h2>
                        <p className="text-gray-700">{error}</p>
                        <button 
                            onClick={fetchUserData}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
            <Navbar />

            <div className="flex-grow container mx-auto px-4 py-10 md:py-[15vh]">
                <div className="max-w-4xl mx-auto">
                    {/* Header Card */}
                    <div className="bg-white rounded-t-xl shadow-md p-6 md:p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-600 to-cyan-500"></div>

                        <div className="relative flex flex-col md:flex-row items-center gap-6 pt-12">
                            {/* User Info */}
                            <div className="text-center md:text-left flex-1 my-5">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    {userData.name}
                                </h1>
                                <p className="text-gray-500">{userData.email}</p>

                                {/* Action Buttons */}
                                <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                                    {!isEditing ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            ✏️ Edit Profil
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="submit"
                                                form="profile-form"
                                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                ✅ Simpan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                                            >
                                                ❌ Batal
                                            </button>
                                        </>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(true)}
                                        className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
                                    >
                                        🔑 Ubah Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="bg-white rounded-b-xl shadow-md p-6 md:p-8 mt-1">
                        <form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        👤 Name
                                    </label>

                                    <div className="relative">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={tempUserData.name}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Masukkan nama"
                                            />
                                        ) : (
                                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                                {userData.name}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        ✉️ Email
                                    </label>

                                    <div className="relative">
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={tempUserData.email}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Masukkan email"
                                            />
                                        ) : (
                                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                                {userData.email}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        📱 Nomor Telepon
                                    </label>

                                    <div className="relative">
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={tempUserData.phone}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Masukkan nomor telepon"
                                            />
                                        ) : (
                                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                                {userData.phone || '-'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal untuk ubah password */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-down">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5">
                            <h2 className="text-xl font-bold text-white">Ubah Password</h2>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                    Password Saat Ini
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Konfirmasi Password Baru
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Profile;
