import LoginImg from '../assets/img/login.png';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyOtpAdmin = ({ email }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setOtp(e.target.value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.length !== 8) {
            setError('OTP harus 8 digit');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/verify-otp/admin', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'OTP tidak valid atau kadaluarsa');
                setLoading(false);
                return;
            }

            setLoading(false);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate('/admin-dashboard');
        } catch (err) {
            setError('Network error. Please try again later.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow">
            <img src={LoginImg} alt="" className="max-w-[100px] mx-auto mb-10"/>
            <h2 className="text-center text-2xl font-semibold mb-4">OTP Verification</h2>
            <p className="mb-6 text-center">Input the OTP code sent to <b>{email}</b></p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="otp"
                    maxLength={8}
                    placeholder="Masukkan 8 digit OTP"
                    value={otp}
                    onChange={handleChange}
                    className="p-2 border rounded text-center text-lg tracking-widest"
                    autoFocus
                />
                {error && (
                    <div className="border border-red-400 bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`py-2 rounded hover:cursor-pointer text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Memverifikasi...' : 'Verifikasi'}
                </button>
            </form>
        </div>
    ); 
};

export default VerifyOtpAdmin;
