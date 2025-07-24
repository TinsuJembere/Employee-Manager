const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Employee name is required']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [18, 'Employee must be at least 18 years old'],
        max: [100, 'Age must be less than 100']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    position: {
        type: String,
        required: [true, 'Position is required']
    },
    department: {
        type: String,
        required: [true, 'Department is required']
    },
    hireDate: {
        type: Date,
        required: [true, 'Hire date is required'],
        default: Date.now
    },
    resignationYear: {
        type: Number
    },
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Terminated'],
        default: 'Active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate resignation year before saving
employeeSchema.pre('save', function(next) {
    if (this.isNew) {
        const hireYear = new Date(this.hireDate).getFullYear();
        const yearsToRetirement = 65 - this.age;
        this.resignationYear = hireYear + yearsToRetirement;
    }
    next();
});

// Add text index for search functionality
employeeSchema.index({ 
    name: 'text', 
    email: 'text', 
    position: 'text',
    department: 'text'
});

module.exports = mongoose.model('Employee', employeeSchema);
