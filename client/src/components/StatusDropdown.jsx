import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { employeeService } from '../services/api';

const StatusDropdown = ({ employeeId, currentStatus, onStatusChange }) => {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'Active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'On Leave', label: 'On Leave', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Terminated', label: 'Terminated', color: 'bg-red-100 text-red-800' },
  ];

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    
    if (employeeId) {
      try {
        setIsUpdating(true);
        await employeeService.updateEmployee(employeeId, { status: newStatus });
        toast.success(`Status updated to ${newStatus}`);
        if (onStatusChange) {
          onStatusChange(employeeId, newStatus);
        }
      } catch (error) {
        console.error('Error updating status:', error);
        toast.error(error.response?.data?.message || 'Failed to update status');
        // Revert to previous status on error
        setStatus(currentStatus);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const currentStatusOption = statusOptions.find(opt => opt.value === status) || statusOptions[0];

  return (
    <div className="relative">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`block w-full pl-3 pr-10 py-1 text-sm rounded-md ${currentStatusOption.color} border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50`}
      >
        {statusOptions.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="bg-white text-gray-900"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusDropdown;
