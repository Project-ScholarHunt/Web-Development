import React, { useState, useRef } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
// Import ikon (gunakan React Icons atau library ikon lainnya)
// import { FiEdit2, FiKey, FiUser, FiMail, FiPhone, FiCamera, FiTrash2 } from 'react-icons/fi';

const Profile = () => {
    // State untuk data profil pengguna
    const [userData, setUserData] = useState({
        username: 'johndoe',
        email: 'johndoe@example.com',
        phone: '+62812345678',
        avatar: null // Simpan URL gambar atau null jika tidak ada
    });

    // State yang sudah ada dipertahankan
    const [isEditing, setIsEditing] = useState(false);
    const [tempUserData, setTempUserData] = useState({ ...userData });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(userData.avatar);

    // Handler-handler yang sama seperti sebelumnya
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

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                alert('Hanya file gambar yang diperbolehkan');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran gambar maksimal 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
                setTempUserData({
                    ...tempUserData,
                    avatar: e.target.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarPreview(null);
        setTempUserData({
            ...tempUserData,
            avatar: null
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setUserData(tempUserData);
        setIsEditing(false);
        alert('Profil berhasil diperbarui!');
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('Password baru dan konfirmasi password harus sama!');
            return;
        }
        alert('Password berhasil diperbarui!');
        setShowPasswordModal(false);
        setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleCancel = () => {
        setTempUserData({ ...userData });
        setAvatarPreview(userData.avatar);
        setIsEditing(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Fungsi untuk menampilkan avatar atau fallback
    const renderAvatar = () => {
        if (isEditing ? avatarPreview : userData.avatar) {
            return (
                <img
                    src={isEditing ? avatarPreview : userData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                />
            );
        } else {
            const initials = userData.username.charAt(0).toUpperCase();
            return (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#357ABD] to-[#506AD4] text-white text-4xl font-bold rounded-full">
                    {initials}
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-200">
            <div className="flex-grow container mx-auto px-4 py-10 md:py-[15vh]">
                <div className="max-w-4xl mx-auto">
                    {/* Header Card */}
                    <div className="bg-white rounded-t-xl shadow-md p-6 md:p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-[#357ABD] to-[#506AD4]"></div>

                        <div className="relative flex flex-col md:flex-row items-center gap-6 pt-12">

                            {/* User Info */}
                            <div className="text-center md:text-left flex-1 my-5">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    {userData.username}
                                </h1>
                                <p className="text-gray-500">{userData.email}</p>

                                {/* Action Buttons */}
                                <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                                    {!isEditing ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="hover:cursor-pointer flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            {/* <FiEdit2 size={16} /> */}
                                            ✏️ Edit Profil
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="submit"
                                                form="profile-form"
                                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                ✓ Simpan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                                            >
                                                ✕ Batal
                                            </button>
                                        </>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(true)}
                                        className="hover:cursor-pointer flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
                                    >
                                        {/* <FiKey size={16} /> */}
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
                                {/* Username Field */}
                                <div className="space-y-2">
                                    <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        {/* <FiUser className="text-blue-500" /> */}
                                        👤 Username
                                    </label>

                                    <div className="relative">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={tempUserData.username}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Masukkan username"
                                            />
                                        ) : (
                                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                                {userData.username}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        {/* <FiMail className="text-blue-500" /> */}
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
                                        {/* <FiPhone className="text-blue-500" /> */}
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
                                                {userData.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal untuk ubah password - Dengan desain yang diperbarui */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-down">
                        <div className="bg-gradient-to-r from-[#357ABD] to-[#506AD4] p-5">
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
        </div>
    );
};

export default Profile;
