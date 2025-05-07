import React, { useState } from 'react'
import loginImg from '../assets/img/login.jpg'
import { useNavigate } from 'react-router'

const Login = () => {
  const navigation = useNavigate()
  const [formData, setFormData] = useState({})

  function toRegister() {
    navigation({
      pathname: "/register"
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("executed 1")
      const response = await fetch('http://127.0.0.1:8000/api/students/login', {
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
    <div className='flex items-center justify-center min-h-screen'>
      <div className='mx-auto container my-5 grid grid-cols-1'>
        <h1 className='text-blue-500 font-bold text-5xl mx-4 -translate-y-10 text-center sm:text-left'>Login</h1>
        <div className='flex flex-col-reverse sm:flex-row items-center justify-between p-5 flex-wrap'>
          <div className='w-full flex flex-col gap-2 sm:w-[40%] md:w-[30%] p-10 sm:p-0'>
            <form action="" className='flex flex-col gap-5' onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder='email'
                name="email"
                id="email"
                className='focus:outline-blue-500 p-2 rounded border'
                value={formData.email || ""}
                onChange={handleChange} />
              <input
                type="password"
                placeholder='password'
                name="password"
                id="password"
                className='focus:outline-blue-500 p-2 rounded border'
                value={formData.password || ""}
                onChange={handleChange} />
              <button
                type="submit"
                className='bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white p-2 tracking-wider rounded mt-5'>Login</button>
            </form>
            <button
              onClick={toRegister}
              className='border border-blue-500 p-2 rounded  hover:cursor-pointer transition-all text-blue-500 hover:bg-blue-500 hover:text-white '>Signup</button>
          </div>
          <div>
            <img src={loginImg} alt="" className="w-50 sm:w-60 md:w-75 max-w-[350px] h-auto object-contain mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login