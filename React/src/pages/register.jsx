import React, { useEffect, useState } from 'react'
import loginImg from '../assets/img/login.png'
import { useNavigate, Link } from 'react-router'

const Register = () => {
  const navigation = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token") || ""
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => {
        console.log("Token valid, redirecting to dashboard");
        navigation({
          pathname: "/dashboard"
        });
      })
      .catch((err) => {
        console.warn("Token invalid or expired");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      });
  }, []);

  const [formData, setFormData] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("executed 1")
      const response = await fetch('http://127.0.0.1:8000/api/students/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      console.log("executed 2 ")

      if (!response.ok) {
        throw new Error('Something went wrong!')
      }
      const data = await response.json();
      console.log('Success: ', data);

      alert('Email sent successfully!');
      setFormData({});
    } catch (error) {
      console.error('Error:', error);
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
              <button
                type="submit"
                className='bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white p-2 tracking-wider rounded mt-5'>
                  Sign up
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