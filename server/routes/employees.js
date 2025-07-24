const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Get all employees with sorting and filtering
router.get('/', async (req, res) => {
    try {
        const { search, status, department, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        // Build the query
        let query = {};
        
        // Text search across multiple fields
        if (search) {
            query.$text = { $search: search };
        }
        
        // Status filter
        if (status && status !== 'All') {
            query.status = status;
        }
        
        // Department filter
        if (department && department !== 'All') {
            query.department = department;
        }
        
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        
        const employees = await Employee.find(query)
            .sort(sort)
            .select('-__v');
            
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch employees',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get employee statistics
router.get('/stats', async (req, res) => {
    try {
        console.log('Fetching employee statistics...');
        
        // First, check if there are any employees in the database
        const employeeCount = await Employee.countDocuments();
        console.log(`Found ${employeeCount} employees in the database`);
        
        if (employeeCount === 0) {
            console.log('No employees found, returning default stats');
            return res.status(200).json({
                totalEmployees: 0,
                activeEmployees: 0,
                departmentCount: 0,
                avgTenureYears: 0,
                retentionRate: 0
            });
        }
        
        // Get distinct departments count
        const departments = await Employee.distinct('department');
        const departmentCount = departments.length;
        
        // Get active employees count
        const activeEmployees = await Employee.countDocuments({ status: 'Active' });
        
        // Calculate average tenure in years
        const avgTenureResult = await Employee.aggregate([
            {
                $project: {
                    tenureInYears: {
                        $divide: [
                            { $subtract: [new Date(), '$hireDate'] },
                            1000 * 60 * 60 * 24 * 365 // Convert milliseconds to years
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgTenure: { $avg: '$tenureInYears' }
                }
            }
        ]);
        
        const avgTenureYears = avgTenureResult.length > 0 ? 
            Math.round(avgTenureResult[0].avgTenure * 10) / 10 : 0;
        
        // Calculate retention rate
        const retentionRate = employeeCount > 0 ? 
            Math.round((activeEmployees / employeeCount) * 100) : 0;
        
        const stats = {
            totalEmployees: employeeCount,
            activeEmployees: activeEmployees,
            departmentCount: departmentCount,
            avgTenureYears: avgTenureYears,
            retentionRate: retentionRate
        };
        
        console.log('Employee statistics calculated:', stats);
        res.status(200).json(stats);
        
    } catch (error) {
        console.error('Error in /stats endpoint:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code
        });
        res.status(500).json({ 
            message: 'An unexpected error occurred while fetching employee statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get a single employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).select('-__v');
        if (!employee) {
            return res.status(404).json({ 
                success: false, 
                message: 'Employee not found' 
            });
        }
        res.json({ success: true, data: employee });
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch employee',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Add new employee
router.post('/', async (req, res) => {
    try {
        const { name, age, email, position, department, hireDate } = req.body;
        
        // Check if employee with email already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ 
                success: false, 
                message: 'An employee with this email already exists' 
            });
        }
        
        // Create new employee
        const employee = new Employee({
            name,
            age: parseInt(age, 10),
            email,
            position,
            department,
            hireDate: hireDate || new Date(),
            status: 'Active'
        });
        
        const savedEmployee = await employee.save();
        
        // Remove sensitive data before sending response
        const employeeData = savedEmployee.toObject();
        delete employeeData.__v;
        
        res.status(201).json({
            success: true,
            message: 'Employee added successfully',
            data: employeeData
        });
        
    } catch (error) {
        console.error('Error adding employee:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add employee',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Update employee
router.put('/:id', async (req, res) => {
    try {
        const { name, age, email, position, department, hireDate, status } = req.body;
        
        // Check if employee exists
        let employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ 
                success: false, 
                message: 'Employee not found' 
            });
        }
        
        // Check if email is being changed to an existing email
        if (email && email !== employee.email) {
            const existingEmployee = await Employee.findOne({ email });
            if (existingEmployee) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'An employee with this email already exists' 
                });
            }
        }
        
        // Update employee fields
        employee.name = name || employee.name;
        employee.age = age ? parseInt(age, 10) : employee.age;
        employee.email = email || employee.email;
        employee.position = position || employee.position;
        employee.department = department || employee.department;
        employee.hireDate = hireDate ? new Date(hireDate) : employee.hireDate;
        employee.status = status || employee.status;
        
        // Save the updated employee
        const updatedEmployee = await employee.save();
        
        // Remove sensitive data before sending response
        const employeeData = updatedEmployee.toObject();
        delete employeeData.__v;
        
        res.json({
            success: true,
            message: 'Employee updated successfully',
            data: employeeData
        });
        
    } catch (error) {
        console.error('Error updating employee:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update employee',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Delete employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ 
                success: false, 
                message: 'Employee not found' 
            });
        }
        
        await employee.deleteOne();
        
        res.json({ 
            success: true, 
            message: 'Employee deleted successfully' 
        });
        
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete employee',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


module.exports = router;
