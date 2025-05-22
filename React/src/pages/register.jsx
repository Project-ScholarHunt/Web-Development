import React, { useEffect, useState } from 'react'
import loginImg from '../assets/img/login.png'
import { useNavigate, Link } from 'react-router'

const Register = () => {
  const navigation = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token") || ""
    if (!token) return;
  }, []);

  const [formData, setFormData] = useState({})
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.phone || !formData.name) {
      setError('Please fill the input field');
      setLoading(false);
      return;
    }

    try {
      console.log("Sending request")
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Success: ', data);

      if (!response.ok) {
        setError(data.message)
        throw new Error('Something went wrong!')
      }

      setLoading(true);
      alert('Registration successful! Please check your email to verify your account before logging in.');
      setFormData({});
    } catch (error) {
      setError("Network error. Please try again later")
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const obj = e.target.name;
    const value = e.target.value;
    setFormData(values => ({ ...values, [obj]: value }))
  }

  return (
    <div className='flex items-center justify-center min-h-screen pt-12 sm:pt-0'>
      <div className='mx-auto container my-5 grid grid-cols-1'>
        <h1 className='text-blue-500 font-bold text-5xl mx-4 -translate-y-10 text-center sm:text-left'>Register</h1>
        <div className='flex flex-col-reverse sm:flex-row items-center justify-between p-5 flex-wrap'>
          <div className='w-full flex flex-col gap-2 sm:w-[40%] md:w-[30%] p-10 sm:p-0'>
            <form action="" className='flex flex-col gap-5' onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder='name'
                name="name"
                id="name"
                className='focus:outline-blue-500 p-2 rounded border'
                value={formData.name || ""}
                onChange={handleChange}
              />
              <input
                type="email"
                placeholder='email'
                name="email"
                id="email"
                className='focus:outline-blue-500 p-2 rounded border'
                value={formData.email || ""}
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder='password'
                name="password"
                id="password"
                className='focus:outline-blue-500 p-2 rounded border'
                value={formData.password || ""}
                onChange={handleChange}
              />
              <div className='flex flex-row gap-3 items-center w-full'>
                <label htmlFor="phone">+62</label>
                <input
                  type="text"
                  placeholder='Phone number'
                  name="phone"
                  id="phone"
                  className='focus:outline-blue-500 p-2 rounded border w-full'
                  value={formData.phone || ""}
                  onChange={handleChange}
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
                className={`w-full hover:cursor-pointer text-white py-2 rounded-lg transition duration-200 ${loading ? 'bg-blue-500 opacity-50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    Signing up...
                  </div>
                ) : 'Sign up'}
              </button>
            </form>
            <Link
              to="/login"
              className='border border-blue-500 p-2 rounded text-center hover:cursor-pointer transition-all text-blue-500 hover:bg-blue-500 hover:text-white '>
              Go to Login Page
            </Link>
          </div>
          <div>
            <img src={loginImg} alt="" className="w-50 sm:w-60 md:w-75 max-w-[350px] h-auto object-contain mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}


export default Register