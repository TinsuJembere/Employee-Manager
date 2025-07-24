// src/pages/SignUp.jsx
import React, { useState } from 'react';

function SignUp() {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Sign Up

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log("Sign Up form submitted!");
  };

  return (
    // Background container for the whole page
    <div className="relative min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url('/auth.png')" }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Auth Card */}
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome</h2>
        <p className="text-gray-600 mb-6">Login to your account</p>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-md p-1 mb-8">
          <button
            className="flex-1 py-2 rounded-md font-medium transition duration-300 text-gray-700 bg-gray-200'
            "
          >
            Login
          </button>
          <button
            className="flex-1 py-2 rounded-md font-medium transition duration-300 bg-indigo-600 text-white"
          >
            Sign Up
          </button>
        </div>

        {/* Sign Up Form */}
          <form onSubmit={handleSignUpSubmit} className="space-y-6">
             <div>
              <label htmlFor="signupName" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="signupName"
                name="fullName"
                placeholder="Jane Doe"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Email
              </label>
              <input
                type="email"
                id="signupEmail"
                name="email"
                placeholder="your.email@example.com"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Password
              </label>
              <input
                type="password"
                id="signupPassword"
                name="password"
                placeholder="**********"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="**********"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Sign Up
            </button>
            <div className='flex justify-center text-sm'>do you an have account? <a href="#" className="ml-1 text-indigo-600 hover:text-indigo-800">
                Login
            </a></div>
          </form>
      </div>
    </div>
  );
}

export default SignUp;