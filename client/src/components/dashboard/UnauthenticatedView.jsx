import React from 'react';
import { Link } from 'react-router-dom';

const UnauthenticatedView = () => (
  <div className="text-center py-12">
    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
      Employee Management System
    </h1>
    <p className="mt-4 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
      Streamline your HR processes and manage your team efficiently with our comprehensive employee management solution.
    </p>
    <div className="mt-8 flex justify-center space-x-4">
      <Link
        to="/login"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Sign in
      </Link>
      <Link
        to="/register"
        className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Register
      </Link>
    </div>
  </div>
);

export default UnauthenticatedView;
