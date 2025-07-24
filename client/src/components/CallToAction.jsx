// src/components/CallToAction.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

function CallToAction() {
  const { isAuthenticated, loading } = useAuth();
  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-8">
          Start managing your team effectively. Add new employees or explore your existing directory with ease.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out">
            <Link to={isAuthenticated ? "/addemployee" : "/login"}>Add Employee</Link>
          </button>
          <button className="bg-white border border-gray-300 hover:border-indigo-600 text-gray-700 hover:text-indigo-600 font-medium py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out">
            <Link to={isAuthenticated ? "/employees" : "/login"}>View Employee List</Link>
          </button>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;