import React, { useEffect, useState } from 'react'
import loginImg from '../assets/img/login.png'
import { useNavigate } from 'react-router'
import Loading from '../components/Loading'
import VerifyOtp from '../components/VerifyOtp'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { alertError } from '../lib/alert'

const Login = () => {
  const navigation = useNavigate()
  const [formData, setFormData] = useState({})
  const [showVerifyOtp, setShowVerifyOtp] = useState(false)
  const [emailForOtp, setEmailForOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // **Animation on mount**
  useEffect(() => {
    setIsVisible(true)
  }, [])

  function toRegister() {
    setIsVisible(false)
    setTimeout(() => {
      navigation('/register')
    }, 300)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    if (!formData.email || !formData.password) {
      toast.error('Email dan password wajib diisi.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password harus minimal 8 karakter.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setLoading(false)
      return
    }

    try {
      console.log("Sending Request...")
      const response = await fetch('http://127.0.0.1:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      console.log('Response JSON:', data)

      if (!response.ok) {
        alertError(data.message)
        throw new Error(data.message || 'Something went wrong!')
      }

      if (response.ok) {
        setEmailForOtp(data.email)
        setLoading(false)
        setShowVerifyOtp(true)
        navigation('/dashboard')
      }

      setFormData({})
    } catch (error) {
      toast.error("Network error. Please try again later.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setLoading(false)
    }
  }

  if (showVerifyOtp) {
    return <VerifyOtp email={emailForOtp} />
  }

  const handleChange = (e) => {
    const obj = e.target.name
    const value = e.target.value
    setFormData(values => ({ ...values, [obj]: value }))
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4'>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* **Main Container with Animation** */}
      <div className={`w-full max-w-6xl mx-auto transition-all duration-500 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}>
        
        {/* **Glass Card Effect** */}
        <div className='bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden'>
          
          {/* **Header with Gradient** */}
          <div className='bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center'>
            <h1 className='text-white font-bold text-4xl md:text-5xl mb-2 animate-pulse'>
              Welcome Back
            </h1>
            <p className='text-blue-100 text-lg'>Sign in to your account</p>
          </div>

          {/* **Content Area** */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-8'>
            
            {/* **Form Section** */}
            <div className='space-y-6 order-2 lg:order-1'>
              <form className='space-y-6' onSubmit={handleSubmit}>
                
                {/* **Email Input** */}
                <div className='group'>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Email Address
                  </label>
                  <div className='relative'>
                    <input
                      type="email"
                      placeholder='Enter your email'
                      name="email"
                      id="email"
                      className='w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300'
                      value={formData.email || ""}
                      onChange={handleChange}
                    />
                    <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                      <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* **Password Input** */}
                <div className='group'>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Password
                  </label>
                  <div className='relative'>
                    <input
                      type="password"
                      placeholder='Enter your password'
                      name="password"
                      id="password"
                      className='w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300'
                      value={formData.password || ""}
                      onChange={handleChange}
                    />
                    <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                      <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                      </svg>
                    </div>
                  </div>
                  {/* **Password Indicator** */}
                  {formData.password && (
                    <div className={`text-xs mt-2 transition-all duration-300 ${
                      formData.password.length >= 8 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {formData.password.length >= 8 ? '✓ Password valid' : `${formData.password.length}/8 characters`}
                    </div>
                  )}
                </div>

                {/* **Login Button** */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign In</span>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
                      </svg>
                    </div>
                  )}
                </button>
              </form>

              {/* **Register Link** */}
              <div className='text-center'>
                <p className='text-gray-600 mb-4'>Don't have an account?</p>
                <button
                  onClick={toRegister}
                  className='w-full py-4 rounded-xl border-2 border-blue-500 text-blue-600 font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95'
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* **Image Section** */}
            <div className='flex items-center justify-center order-1 lg:order-2'>
              <div className='relative'>
                <div className='absolute inset-0 x'></div>
                <img 
                  src={loginImg} 
                  alt="Login illustration" 
                  className="relative w-full max-w-md h-auto object-contain animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* **Custom CSS for animations** */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default Login
