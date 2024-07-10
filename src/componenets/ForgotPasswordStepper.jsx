import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import forgotpassword from '../assets/Forgot password-rafiki.png';

const ForgotPasswordStepper = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    if (token) {
      setStep(3);
    }
  }, [location]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/password-reset/request', { email });
      setStep(2);
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');
      if (!token) throw new Error('Invalid reset token');

      await axios.post('http://localhost:3000/auth/password-reset/reset', { token, newPassword });
      setStep(4);
    } catch (error) {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="flex flex-col mt-8 items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col lg:flex-row items-center lg:items-start w-full max-w-screen-lg">
        <div className="lg:w-1/2 lg:mr-8">
        <h1 className="text-3xl mt-8 font-bold mb-5 text-gray-800 text-center">Reset Password</h1>
          <div className="flex pt-20 items-center">
            <div className="flex items-center w-full">
              <div className={`w-8 h-8 shrink-0 mx-[-1px] p-1.5 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-purple' : 'bg-gray-300'}`}>
                <span className="text-base text-white font-bold">1</span>
              </div>
              <div className={`w-full h-1 mx-4 rounded-lg ${step > 1 ? 'bg-purple' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex items-center w-full">
              <div className={`w-8 h-8 shrink-0 mx-[-1px] p-1.5 flex items-center justify-center rounded-full ${step >= 2 ? 'bg-purple' : 'bg-gray-300'}`}>
                <span className="text-base text-white font-bold">2</span>
              </div>
              <div className={`w-full h-1 mx-4 rounded-lg ${step > 2 ? 'bg-purple' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex items-center w-full">
              <div className={`w-8 h-8 shrink-0 mx-[-1px] p-1.5 flex items-center justify-center rounded-full ${step >= 3 ? 'bg-purple' : 'bg-gray-300'}`}>
                <span className="text-base text-white font-bold">3</span>
              </div>
              <div className={`w-full h-1 mx-4 rounded-lg ${step > 3 ? 'bg-purple' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 shrink-0 mx-[-1px] p-1.5 flex items-center justify-center rounded-full ${step === 4 ? 'bg-purple' : 'bg-gray-300'}`}>
                <span className="text-base text-white font-bold">4</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="mt-6 flex flex-col items-center">
              <label className="pt-15 block mb-2">Enter your email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-full border border-gbuttonColor4"
                required
              />
              <div className="flex justify-center w-full mt-4">
                <button type="submit" className="px-12 py-2 bg-purple rounded-full text-white">Send</button>
              </div>
              {error && <p className="mt-2 text-red-600">{error}</p>}
            </form>
          )}

          {step === 2 && (
            <div className="mt-6">
              <p>Check your email for the reset password link.</p>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPasswordSubmit} className="mt-6 flex flex-col items-center">
              <label className="pt-5 block mb-">Enter new password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 rounded-full  border border-buttonColor4 rounded"
                required
              />
              <label className="pt-5 block mb-2 mt-4">Confirm new password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2  rounded-full border border-buttonColor4 rounded"
                required
              />
              <div className="flex justify-center w-full mt-4">
                <button type="submit" className="px-12 rounded-full py-2 bg-purple text-white rounded">Reset Password</button>
              </div>
              {error && <p className="mt-2 text-red-600">{error}</p>}
            </form>
          )}

          {step === 4 && (
            <div className="mt-6">
              <p>Your password has been successfully reset.</p>
              <p>You can now log in with your new password.</p>
            </div>
          )}
        </div>
        <div className="lg:w-1/2 mt-6 lg:mt-0 flex justify-center">
          <img src={forgotpassword} alt="Password reset illustration" className="max-w-full h-auto rounded-lg "/>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordStepper;






