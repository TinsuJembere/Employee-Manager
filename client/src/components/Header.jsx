// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu visibility

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = (
    <>
      {isAuthenticated ? (
        // Show these when user is authenticated
        <>
          <li>
            <Link to="/addemployee" className="hover:text-indigo-600" onClick={() => setIsOpen(false)}>
              Add Employee
            </Link>
          </li>
          <li>
            <Link to="/employees" className="hover:text-indigo-600" onClick={() => setIsOpen(false)}>
              Employee List
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
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
            <Link to="/login" className="hover:text-indigo-600" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className="bg-white shadow-sm p-4">
      {/* Add 'relative' to the header if not already there, for absolute positioning of mobile menu */}
      <nav className="container mx-auto flex justify-between items-center relative"> {/* Ensure nav is relative */}
        {/* Logo and App Title */}
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-6 w-6" />
          <Link to="/" className="text-lg font-semibold text-gray-900 hover:text-indigo-600 whitespace-nowrap">
            Employee Manager
          </Link>
        </div>

        {/* Desktop Navigation - Visible only on md and up */}
        <div className="hidden md:flex items-center space-x-6 text-gray-600 text-sm">
          <ul className="flex items-center space-x-6">
            {navLinks}
          </ul>
        </div>

        {/* Mobile Hamburger and Menu Container */}
        <div className="md:hidden flex items-center">
          {/* Hamburger menu button for small devices */}
          <button onClick={toggleMenu} className="text-gray-600 hover:text-indigo-600 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                // Close icon (X) when menu is open
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Hamburger icon (three lines) when menu is closed
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu - Rendered outside the immediate button container
            but still within the main nav. This allows its 'absolute' positioning
            to be relative to the 'nav' element, which should be 'relative'.
            Crucially, this div only appears when isOpen is true. */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md p-4 z-20">
            <ul className="flex flex-col space-y-4 text-gray-600 text-sm">
              {navLinks}
            </ul>
          </div>
        )}

      </nav>
    </header>
  );
}

export default Header;