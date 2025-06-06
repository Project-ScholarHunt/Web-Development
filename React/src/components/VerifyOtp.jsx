import React from 'react';
import LoginImg from '../assets/img/login.png';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = ({ email, onBackToLogin  }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [isVisible, setIsVisible] = useState(true); // Tambahkan state ini

    const startTimeRef = useRef(null);
    const intervalRef = useRef(null);
    const navigate = useNavigate();

    // Tambahkan function toLogin di sini
    const toLogin = () => {
        setIsVisible(false);
        setTimeout(() => {
            onBackToLogin(); // Panggil callback function dari parent
        }, 300);
    };

    useEffect(() => {
        startTimeRef.current = Date.now();
        startTimer();

        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            } else {
                recalculateCountdown();
                startTimer();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const recalculateCountdown = () => {
        if (startTimeRef.current && !isExpired) {
            const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
            const remainingTime = Math.max(0, 60 - elapsedTime);

            setCountdown(remainingTime);

            if (remainingTime <= 0) {
                setIsExpired(true);
            }
        }
    };

    const startTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (!isExpired && countdown > 0) {
            intervalRef.current = setInterval(() => {
                recalculateCountdown();
            }, 1000);
        }
    };

    const formatTime = (seconds) => {
        return `${seconds} seconds`;
    };

    const handleChange = (e) => {
        setOtp(e.target.value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.length !== 8) {
            setError('OTP must be 8 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/verify-otp/user', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 410 || data.message?.includes('expired')) {
                    setIsExpired(true);
                    setError('OTP code has expired. Please request a new code.');
                } else {
                    setError(data.message || 'Invalid or expired OTP code');
                }
                setLoading(false);
                return;
            }

            setLoading(false);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate('/dashboard');

        } catch (err) {
            setError('Network error. Please try again later.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-md mx-auto transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                }`}>
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
                        <h2 className="text-white font-bold text-3xl mb-2">OTP Verification</h2>
                        <p className="text-blue-100 text-base">Enter the OTP code sent to <b>{email}</b></p>

                        {!isExpired && (
                            <div className="mt-3 bg-white/20 rounded-lg p-2">
                                <p className="text-white text-sm">
                                    Code expires in:
                                    <span className={`font-bold ml-1 ${countdown <= 10 ? 'text-red-200 animate-pulse' : 'text-yellow-200'}`}>
                                        {formatTime(countdown)}
                                    </span>
                                </p>
                                {/* Progress bar */}
                                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-1000 ${countdown <= 10 ? 'bg-red-400' : countdown <= 30 ? 'bg-yellow-400' : 'bg-green-400'
                                            }`}
                                        style={{ width: `${(countdown / 60) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {isExpired && (
                            <div className="mt-3 bg-red-500/20 rounded-lg p-2 border border-red-300">
                                <p className="text-red-100 text-sm font-semibold">
                                    ⚠️ OTP code has expired
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                                    OTP Code
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="otp"
                                        maxLength={8}
                                        placeholder="Enter 8-digit OTP"
                                        value={otp}
                                        onChange={handleChange}
                                        disabled={isExpired}
                                        className={`w-full p-4 rounded-xl border-2 focus:ring-4 transition-all duration-300 bg-white/50 backdrop-blur-sm text-center text-lg tracking-widest ${isExpired
                                                ? 'border-red-300 bg-red-50 text-red-400 cursor-not-allowed'
                                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100 group-hover:border-blue-300'
                                            }`}
                                        autoFocus={!isExpired}
                                    />
                                </div>
                                {otp && !isExpired && (
                                    <div className={`text-xs mt-2 text-center transition-all duration-300 ${otp.length === 8 ? 'text-green-600' : 'text-red-500'}`}>
                                        {otp.length === 8 ? '✓ Valid OTP' : `${otp.length}/8 digits`}
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="border border-red-400 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || isExpired}
                                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${loading || isExpired
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Verifying...
                                    </div>
                                ) : isExpired ? (
                                    'Code Expired'
                                ) : (
                                    'Verify'
                                )}
                            </button>

                            {/* Redirect to Login Button */}
                            <button
                                type="button"
                                onClick={toLogin}
                                className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl"
                            >
                                Back to Login
                            </button>

                            {/* Warning ketika waktu hampir habis */}
                            {countdown <= 10 && countdown > 0 && (
                                <div className="text-center bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-600 text-sm font-semibold animate-pulse">
                                        ⚠️ OTP code will expire soon!
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
