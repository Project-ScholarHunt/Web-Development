import React, { useEffect, useState } from 'react'
import loginImg from '../assets/img/login.png'
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
      console.log("Sending Request...")
      const response = await fetch('http://127.0.0.1:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      console.log("HTTP status:", response.status);

      const data = await response.json();
      console.log('Response JSON:', data);

      if (!response.ok) {
        console.warn('API returned error status:', data);
        throw new Error(data.message || 'Something went wrong!');
      }

      localStorage.setItem("token", data.token);
      setToken(data.token)
      localStorage.setItem("user", JSON.stringify(data.student));

      alert('Login success!');
      setFormData({});
    } catch (error) {
      console.error('Catch error:', error.message);
    }
  }

  const handleChange = (e) => {
    const obj = e.target.name;
    const value = e.target.value;
    setFormData(values => ({ ...values, [obj]: value }))
  }

  const [token, setToken] = useState(localStorage.getItem("token") || "");


  useEffect(() => {
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
  }, [token]);

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
              className='border border-blue-500 p-2 rounded  hover:cursor-pointer transition-all text-blue-500 hover:bg-blue-500 hover:text-white '>Create an Account</button>
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