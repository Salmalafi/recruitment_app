import React, { useState } from 'react';

import recrutement from '../assets/Resume-amico.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', {
          email,
          password,
        });

        const { token } = response.data;

        localStorage.setItem('token', token);

      
        navigate('/profile'); 
      } catch (error) {
        console.error('Signup error:', error);

      }
    } else {
      console.log('Form has errors');
    }
  };

  return (
    <div className="font-[sans-serif] bg-buttonColor3 text-gray-800">
      <div className="min-h-screen flex fle-col items-center justify-center lg:p-6 p-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
          <div>
            <a href="/">
              <img src={recrutement} alt="logo" className="w-85 mb-12 animate-flip" />
            </a>
          </div>

          <form onSubmit={handleSignUp} className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md md:ml-auto w-full">
            <h3 className="text-3xl font-extrabold mb-12">Sign Up</h3>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="text-sm text-right">
              <a href="javascript:void(0);" className="text-blue-600 font-semibold hover:underline">
                Forgot your password?
              </a>
            </div>

            <div>
              <button type="submit" className="w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white bg-gray-800 hover:bg-[#222] focus:outline-none">
                Sign Up
              </button>
            </div>

            <p className="my-6 text-sm text-gray-400 text-center">or continue with</p>

            <div className="space-x-6 flex justify-center">
              <button type="button" className="border-none outline-none">
                {/* Your SVG icon */}
              </button>
              <button type="button" className="border-none outline-none">
                {/* Your SVG icon */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

