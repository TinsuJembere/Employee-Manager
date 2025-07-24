import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        toast.error(result.message || 'Login failed');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Background image and overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage: "url('/auth.png')",
        }}
      />
      <div className="absolute inset-0 bg-black opacity-40" />

      {/* Auth card */}
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Login to your account</p>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-md p-1 mb-8">
          <button
            className="flex-1 py-2 rounded-md font-medium bg-indigo-600 text-white shadow-md"
            disabled
          >
            Login
          </button>
          <Link
            to="/register"
            state={{ from: location.state?.from }}
            className="flex-1 py-2 rounded-md font-medium text-gray-700 text-center hover:bg-gray-200 transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-left mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className={`block w-full border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              disabled={authLoading || isSubmitting}
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-left mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className={`block w-full border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              disabled={authLoading || isSubmitting}
              required
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={authLoading || isSubmitting}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-300 ease-in-out ${
              authLoading || isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {authLoading || isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Signing in...
              </div>
            ) : (
              'Login'
            )}
          </button>

          <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600">
                        don't have an account?{' '}
                        <Link
                          to="/register"
                          state={{ from: location.state?.from }}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Sign Up
                        </Link>
                      </p>
                    </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
