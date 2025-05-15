import React, { useState } from 'react'
import LoginImg from '../assets/img/login.png'

const AdminLogin = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();


            if (!response.ok) {
                console.error("HTTP status:", response.status);
                console.error("Message: ", data.message)
                setError(data.message || 'Terjadi kesalahan');
                return;
            }
            if (response.ok) {
                console.log("HTTP status:", response.status);
                console.log("Message: ", data.message)
                console.log('Response JSON:', data);
                localStorage.setItem('token', data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
            }
            alert('Login berhasil!');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError('Terjadi kesalahan jaringan.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div>
                    <img src={LoginImg} alt="" className="w-full max-h-40 object-contain mb-4" />
                    <h1 className="text-2xl font-bold mb-6 text-center">Please Login</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                            placeholder="admin@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    {error && (
                        <div className="border border-red-400 bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white py-2 rounded-lg transition duration-200 ${loading ? 'bg-blue-500 opacity-50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;