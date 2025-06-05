import React, { useEffect, useState } from 'react'
import loginImg from '../assets/img/login.png'
import { useNavigate, Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const toLogin = () => {
    setIsVisible(false)
    setTimeout(() => {
      navigate('/login')
    }, 300)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password || !formData.phone || !formData.name) {
      toast.error('Semua field wajib diisi!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password harus minimal 8 karakter!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return
    }

    if (formData.phone.length < 9 || formData.phone.length > 13) {
      toast.error('Nomor telepon harus 9-13 digit!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Format email tidak valid!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return
    }

    try {
      console.log("Sending request")
      setLoading(true)

      const response = await fetch('http://127.0.0.1:8000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      console.log('Success: ', data)

      if (!response.ok) {
        toast.error(data.message || 'Terjadi kesalahan saat registrasi!', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        throw new Error('Something went wrong!')
      }

      toast.success('🎉 Registrasi berhasil! Silakan cek email Anda untuk verifikasi akun sebelum login.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })

      setFormData({})
      setLoading(false)

      setTimeout(() => {
        toLogin()
      }, 2000)

    } catch (error) {
      toast.error("Terjadi kesalahan jaringan. Silakan coba lagi nanti.", {
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

  const handleChange = (e) => {
    const obj = e.target.name
    const value = e.target.value
    setFormData(values => ({ ...values, [obj]: value }))
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value

    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 13)

    setFormData(values => ({ ...values, phone: numericValue }))
  }

  const handlePhoneKeyPress = (e) => {
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)) {
      return
    }

    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4'>
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
      <div className={`w-full max-w-6xl mx-auto transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}>

        {/* **Glass Card Effect** */}
        <div className='bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden'>

          {/* **Header with Gradient** */}
          <div className='bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-center'>
            <h1 className='text-white font-bold text-4xl md:text-5xl mb-2 animate-pulse'>
              Find Your Path,
              Seize Your Future.
            </h1>
            <p className='text-indigo-100 text-lg'>Create your account to get started</p>
          </div>

          {/* **Content Area** */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-8'>

            {/* **Form Section** */}
            <div className='space-y-6 order-2 lg:order-1'>
              <form className='space-y-6' onSubmit={handleSubmit}>

                {/* **Name Input** */}
                <div className='group'>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Full Name
                  </label>
                  <div className='relative'>
                    <input
                      type="text"
                      placeholder='Enter your full name'
                      name="name"
                      id="name"
                      className='w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-indigo-300'
                      value={formData.name || ""}
                      onChange={handleChange}
                    />
                    <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                      <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                      </svg>
                    </div>
                  </div>
                </div>

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
                      className='w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-indigo-300'
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
                      placeholder='Create a strong password'
                      name="password"
                      id="password"
                      className='w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-indigo-300'
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
                    <div className={`text-xs mt-2 transition-all duration-300 ${formData.password.length >= 8 ? 'text-green-600' : 'text-red-500'
                      }`}>
                      {formData.password.length >= 8 ? '✓ Password meets requirements' : `${formData.password.length}/8 characters minimum`}
                    </div>
                  )}
                </div>

                {/* **Phone Input** */}
                <div className='group'>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Phone Number
                  </label>
                  <div className='flex gap-3'>
                    <div className='flex items-center px-4 py-4 bg-gray-100 rounded-xl border-2 border-gray-200 text-gray-600 font-medium'>
                      +62
                    </div>
                    <div className='flex-1 relative'>
                      <input
                        type="text"
                        placeholder='Enter phone number'
                        name="phone"
                        id="phone"
                        className='w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-indigo-300'
                        value={formData.phone || ""}
                        onChange={handlePhoneChange}
                        onKeyDown={handlePhoneKeyPress}
                        maxLength={13}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                      <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                        <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* **Phone Indicator** */}
                  {formData.phone && (
                    <div className={`text-xs mt-2 transition-all duration-300 ${formData.phone.length >= 9 && formData.phone.length <= 13
                        ? 'text-green-600'
                        : 'text-red-500'
                      }`}>
                      {formData.phone.length >= 9 && formData.phone.length <= 13
                        ? '✓ Phone number is valid'
                        : `${formData.phone.length}/9-13 digits required`}
                    </div>
                  )}
                </div>

                {/* **Register Button** */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Create Account</span>
                      <i class="ri-user-add-line"></i>
                    </div>
                  )}
                </button>
              </form>

              {/* **Login Link** */}
              <div className='text-center'>
                <p className='text-gray-600 mb-4'>Already have an account?</p>
                <button
                  onClick={toLogin}
                  className='w-full py-4 rounded-xl border-2 border-indigo-500 text-indigo-600 font-semibold hover:bg-indigo-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95'
                >
                  Sign In Instead
                </button>
              </div>
            </div>

            {/* **Image Section** */}
            <div className='flex items-center justify-center order-1 lg:order-2'>
              <div className='relative'>
                <div className='absolute inset-0'></div>
                <img
                  src={loginImg}
                  alt="Register illustration"
                  className="relative w-full max-w-md h-auto object-contain animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register