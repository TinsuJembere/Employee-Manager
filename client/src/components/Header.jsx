// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="bg-white shadow-sm p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Logo */}
          <img src="/logo.png" alt="Logo" className="h-6 w-6" />
          <Link to="/" className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
            Employee Manager
          </Link>
        </div>
        
        <ul className="flex items-center space-x-6 text-gray-600 text-sm">
          {isAuthenticated ? (
            // Show these when user is authenticated
            <>
              <li>
                <Link to="/addemployee" className="hover:text-indigo-600">
                  Add Employee
                </Link>
              </li>
              <li>
                <Link to="/employees" className="hover:text-indigo-600">
                  Employee List
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="hover:text-indigo-600 focus:outline-none"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            // Show these when user is not authenticated
            <>
              <li>
                <Link to="/login" className="hover:text-indigo-600">
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;