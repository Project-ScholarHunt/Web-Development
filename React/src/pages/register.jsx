import React from 'react'
import loginImg from '../assets/img/login.png'
import { useNavigate } from 'react-router'

const Register = () => {
  const navigation = useNavigate()
  function toLogin() {
    navigation({
      pathname: "/login"
    })
  }
  return (
    <div className='flex items-center justify-center min-h-screen pt-12 sm:pt-0'>
      <div className='mx-auto container my-5 grid grid-cols-1'>
        <h1 className='text-blue-500 font-bold text-5xl mx-4 -translate-y-10 text-center sm:text-left'>Register</h1>
        <div className='flex flex-col-reverse sm:flex-row items-center justify-between p-5 flex-wrap'>
          <div className='w-full flex flex-col gap-2 sm:w-[40%] md:w-[30%] p-10 sm:p-0'>
            <form action="" className='flex flex-col gap-5'>
              <input
                type="text"
                placeholder='name'
                name="name"
                id="name"
                className='focus:outline-blue-500 p-2 rounded border'
              />
              <input
                type="email"
                placeholder='email'
                name="email"
                id="email"
                className='focus:outline-blue-500 p-2 rounded border'
              />
              <input
                type="password"
                placeholder='password'
                name="password"
                id="password"
                className='focus:outline-blue-500 p-2 rounded border'
              />
              <div className='flex flex-row gap-3 items-center w-full'>
                <label htmlFor="phone">+62</label>
                <input
                  type="text"
                  placeholder='Phone number'
                  name="phone"
                  id="phone"
                  className='focus:outline-blue-500 p-2 rounded border w-full'
                />
              </div>
              <button
                type="submit"
                className='bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white p-2 tracking-wider rounded mt-5'>Login</button>
            </form>
            <button
              onClick={toLogin}
              className='border border-blue-500 p-2 rounded hover:cursor-pointer transition-all text-blue-500 hover:bg-blue-500 hover:text-white '>Signup</button>
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