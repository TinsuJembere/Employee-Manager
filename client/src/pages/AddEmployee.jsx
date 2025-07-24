import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import EmployeeForm from "../components/EmployeeForm";

function AddEmployeePage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast.success("Employee added successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Page Title and Description */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add New Employee
        </h1>
        <p className="text-gray-600 mb-8">
          Fill in the details to onboard a new team member to your organization.
        </p>

        {/* Illustration/Banner */}
        <div className="bg-yellow-100 rounded-lg p-6 mb-8 flex max-h-48 justify-center items-center overflow-hidden">
          {/* Placeholder for the illustration */}
          {/* In a real app, you'd use an <img> tag with your actual image */}
          <img
            src="/add.png"
            alt="Employee Onboarding"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Important Information
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Please fill in all required fields marked with an asterisk (*).
              The estimated resignation year is calculated automatically based
              on the employee's age and hire date.
            </p>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              
            </div>

            <div className="px-6 py-6">
              <EmployeeForm onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddEmployeePage;
