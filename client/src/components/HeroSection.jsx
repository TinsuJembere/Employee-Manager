// src/components/HeroSection.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

function HeroSection() {
  const { isAuthenticated, loading } = useAuth();
  return (
    <section className="relative bg-gray-900 text-white py-20 md:py-32 overflow-hidden">
      {/* Background Image/Overlay (simulated) */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/hero.png")' }}>
        <div className="absolute inset-0 bg-white opacity-60"></div>
      </div>

      <div className="container mx-auto relative z-10 text-center">
        <h1 className="text-4xl text-black md:text-5xl font-extrabold leading-tight mb-6">
          Empower Your Workforce <br className="hidden md:inline"/> with Employee Manager
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Streamline HR processes, manage employee data, and foster a productive work environment for your team.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out">
            <Link to={isAuthenticated ? "/employees" : "/login"}>Add New Employee</Link>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-black font-medium py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out border border-white border-opacity-30">
            <Link to={isAuthenticated ? "/employees" : "/login"}>View Directory</Link>
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;