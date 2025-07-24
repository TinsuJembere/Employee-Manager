// src/components/AtAGlance.jsx
import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/api';

const StatCard = ({ value, label, description, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm text-center h-full">
    <div className="text-indigo-600 mb-2">
      <svg className="h-10 w-10 mx-auto" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
      </svg>
    </div>
    {loading ? (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-1"></div>
        <div className="h-3 bg-gray-100 rounded w-3/4 mx-auto"></div>
      </div>
    ) : (
      <>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">{label}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </>
    )}
  </div>
);

function AtAGlance() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departmentCount: 0,
    avgTenureYears: 0,
    retentionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getEmployeeStats();
        setStats({
          totalEmployees: data.totalEmployees || 0,
          departmentCount: data.departmentCount || 0,
          avgTenureYears: data.avgTenureYears || 0,
          retentionRate: data.retentionRate || 0
        });
      } catch (err) {
        console.error('Failed to fetch employee statistics:', err);
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
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
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-12">At a Glance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          value={stats.totalEmployees.toLocaleString()}
          label="Total Employees"
          description="Across all departments and locations."
          loading={loading}
        />
        <StatCard
          value={stats.departmentCount}
          label="Departments"
          description="Structured for efficient collaboration."
          loading={loading}
        />
        <StatCard
          value={`${stats.avgTenureYears} ${stats.avgTenureYears === 1 ? 'Year' : 'Years'}`}
          label="Average Tenure"
          description="Dedicated and experienced workforce."
          loading={loading}
        />
        <StatCard
          value={`${Math.round(stats.retentionRate)}%`}
          label="Retention Rate"
          description="Committed to employee satisfaction."
          loading={loading}
        />
      </div>
    </section>
  );
}

export default AtAGlance;