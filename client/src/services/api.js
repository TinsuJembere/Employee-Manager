import axios from 'axios';

// Use relative path for API requests (handled by Vite proxy in development)
const API_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
  withCredentials: true, // Enable sending cookies with requests
  crossDomain: true,
  credentials: 'include', // This is important for sending cookies with cross-origin requests
});

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });
        const { token } = response.data;
        
        // Update the token in localStorage
        localStorage.setItem('token', token);
        
        // Update the Authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (error) {
        // If refresh token fails, clear auth and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true,
      });
    }

    // Handle specific HTTP status codes
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return Promise.reject({
          message: data.message || 'Bad request',
          errors: data.errors,
          status,
        });
      case 401:
        // Handle unauthorized (e.g., redirect to login)
        return Promise.reject({
          message: 'Your session has expired. Please log in again.',
          status,
        });
      case 403:
        return Promise.reject({
          message: 'You do not have permission to perform this action.',
          status,
        });
      case 404:
        return Promise.reject({
          message: 'The requested resource was not found.',
          status,
        });
      case 500:
        return Promise.reject({
          message: 'An unexpected error occurred on the server.',
          status,
        });
      default:
        return Promise.reject({
          message: data.message || 'An error occurred',
          status,
        });
    }
  }
);

/**
 * Employee Service
 * Handles all employee-related API calls
 */
export const employeeService = {
  /**
   * Get all employees with optional filtering and sorting
   * @param {Object} params - Query parameters for filtering and sorting
   * @returns {Promise<Array>} - Array of employee objects
   */
  getAllEmployees: async (params = {}) => {
    try {
      const response = await api.get('/employees', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  /**
   * Get a single employee by ID
   * @param {string} id - Employee ID
   * @returns {Promise<Object>} - Employee object
   */
  getEmployeeById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data.data; // Return the data property directly
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error);
      throw error;
    }
  },

  /**
   * Add a new employee
   * @param {Object} employeeData - Employee data to be added
   * @returns {Promise<Object>} - The created employee object
   */
  addEmployee: async (employeeData) => {
    try {
      // Format the data to match the backend expectations
      const formattedData = {
        ...employeeData,
        age: parseInt(employeeData.age, 10),
      };
      
      const response = await api.post('/employees', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  },

  /**
   * Update an existing employee
   * @param {string} id - Employee ID
   * @param {Object} employeeData - Updated employee data
   * @returns {Promise<Object>} - The updated employee object
   */
  updateEmployee: async (id, employeeData) => {
    try {
      // Format the data to match the backend expectations
      const formattedData = {
        ...employeeData,
        age: employeeData.age ? parseInt(employeeData.age, 10) : undefined,
      };
      
      const response = await api.put(`/employees/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an employee
   * @param {string} id - Employee ID
   * @returns {Promise<Object>} - Success message
   */
  deleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting employee ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search employees by query string
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of matching employee objects
   */
  searchEmployees: async (query) => {
    try {
      const response = await api.get('/employees', { params: { search: query } });
      return response.data;
    } catch (error) {
      console.error('Error searching employees:', error);
      throw error;
    }
  },

  /**
   * Get employees by department
   * @param {string} department - Department name
   * @returns {Promise<Array>} - Array of employee objects in the specified department
   */
  getEmployeesByDepartment: async (department) => {
    try {
      const response = await api.get('/employees', { 
        params: { 
          department,
          sortBy: 'name',
          sortOrder: 'asc'
        } 
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching employees in ${department}:`, error);
      throw error;
    }
  },

  /**
   * Get employee statistics
   * @returns {Promise<Object>} - Employee statistics
   */
  getEmployeeStats: async () => {
    try {
      const response = await api.get('/employees/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching employee statistics:', error);
      throw error;
    }
  },
};

// Auth Service
export const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User data and auth token
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Created user data
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  /**
   * Get current authenticated user
   * @returns {Promise<Object>} - Current user data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  },

  /**
   * Logout user
   * @returns {Promise<Object>} - Success message
   */
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} - Success message
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  },

  /**
   * Reset password with token
   * @param {string} token - Password reset token
   * @param {string} password - New password
   * @returns {Promise<Object>} - Success message
   */
  resetPassword: async (token, password) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  },
};

// Export the configured axios instance for direct API calls if needed
export default api;
