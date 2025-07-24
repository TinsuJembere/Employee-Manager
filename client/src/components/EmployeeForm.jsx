import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { employeeService } from '../services/api';

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Customer Support',
  'Other'
];

export default function EmployeeForm({ initialData = {}, isEdit = false }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    age: initialData.age || '',
    email: initialData.email || '',
    position: initialData.position || '',
    department: initialData.department || '',
    hireDate: initialData.hireDate || new Date().toISOString().split('T')[0],
    status: initialData.status || 'Active'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedResignYear, setEstimatedResignYear] = useState('N/A');

  // Calculate estimated resign year
  useEffect(() => {
    if (formData.age && formData.hireDate) {
      const hireYear = new Date(formData.hireDate).getFullYear();
      const yearsToRetirement = 65 - parseInt(formData.age, 10);
      setEstimatedResignYear(hireYear + yearsToRetirement);
    } else {
      setEstimatedResignYear('N/A');
    }
  }, [formData.age, formData.hireDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const employeeData = {
        ...formData,
        age: parseInt(formData.age, 10)
      };
      
      if (isEdit && initialData._id) {
        await employeeService.updateEmployee(initialData._id, employeeData);
        toast.success('Employee updated successfully!');
      } else {
        await employeeService.addEmployee(employeeData);
        toast.success('Employee added successfully!');
      }
      
      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error(error.response?.data?.message || 'Failed to save employee');
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {isEdit ? 'Edit Employee' : 'Add New Employee'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3`}
              disabled={isSubmitting}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age *
            </label>
            <input
              type="number"
              name="age"
              min="18"
              max="100"
              value={formData.age}
              onChange={handleChange}
              className={`block w-full border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3`}
              disabled={isSubmitting}
            />
            {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3`}
              disabled={isSubmitting}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position *
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={`block w-full border ${errors.position ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3`}
              disabled={isSubmitting}
            />
            {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`block w-full border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3`}
              disabled={isSubmitting}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hire Date *
            </label>
            <input
              type="date"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`block w-full border ${errors.hireDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3`}
              disabled={isSubmitting}
            />
            {errors.hireDate && <p className="mt-1 text-sm text-red-600">{errors.hireDate}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              disabled={isSubmitting}
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">
              Estimated Resign Year:{" "}
              <span className="font-bold text-indigo-600">{estimatedResignYear}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Automatically calculated based on age and hire date
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/employees')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEdit ? 'Updating...' : 'Adding...'}
            </span>
          ) : isEdit ? (
            'Update Employee'
          ) : (
            'Add Employee'
          )}
        </button>
      </div>
    </form>
  );
}
