import React from 'react'
import loginImg from '../assets/img/login.jpg'
import { useNavigate } from 'react-router'

const Login = () => {
  const navigation = useNavigate()

  function toRegister() {
    navigation({
      pathname: "/register"
    })
  }
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='mx-auto container my-5 grid grid-cols-1'>
        <h1 className='text-blue-500 font-bold text-5xl mx-4 -translate-y-10 text-center sm:text-left'>Login</h1>
        <div className='flex flex-col-reverse sm:flex-row items-center justify-between p-5 flex-wrap'>
          <div className='w-full flex flex-col gap-2 sm:w-[40%] md:w-[30%] p-10 sm:p-0'>
            <form action="" className='flex flex-col gap-5'>
              <input
                type="email"
                placeholder='email'
                name="email"
                id="email"
                className='focus:outline-blue-500 p-2 rounded border' />
              <input
                type="password"
                placeholder='password'
                name="password"
                id="password"
                className='focus:outline-blue-500 p-2 rounded border' />
              <button
                type="submit"
                className='bg-blue-500 hover:cursor-pointer hover:bg-blue-700 text-white p-2 tracking-wider rounded mt-5'>Login</button>
            </form>
            <button
              onClick={toRegister}
              className='border border-blue-500 p-2 rounded  hover:cursor-pointer transition-all text-blue-500 hover:bg-blue-500 hover:text-white '>Signup</button>
          </div>
          <div>
            <img src={loginImg} alt="" className='w-[200px] h-[100px] sm:w-[300px] sm:h-auto object-contain' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login