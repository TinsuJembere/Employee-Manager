import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { employeeService } from '../services/api';
import EmployeeForm from '../components/EmployeeForm';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: '',
    age: '',
    email: '',
    position: '',
    department: '',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await employeeService.getEmployeeById(id);
        // Format the date for the date input
        const formattedData = {
          ...data,
          hireDate: data.hireDate ? new Date(data.hireDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        };
        setEmployee(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching employee:', err);
        setError('Failed to load employee data');
        toast.error('Failed to load employee data');
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    } else {
      setLoading(false);
      setError('No employee ID provided');
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await employeeService.updateEmployee(id, formData);
      toast.success('Employee updated successfully');
      navigate('/employees');
    } catch (err) {
      console.error('Error updating employee:', err);
      toast.error(err.response?.data?.message || 'Failed to update employee');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header/>
      <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
          <p className="text-gray-600 mt-1">Update the employee details below</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <EmployeeForm 
            initialValues={employee}
            onSubmit={handleSubmit}
            isEdit={true}
          />
        )}
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default EditEmployee;
