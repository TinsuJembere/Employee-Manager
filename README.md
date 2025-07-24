# Employee Manager

A full-stack employee management system with user authentication and newsletter subscription functionality.

## Features

- **Employee Management**
  - View all employees
  - Add new employees
  - Edit employee details
  - Delete employees

- **User Authentication**
  - User registration and login
  - Protected routes
  - JWT-based authentication

- **Newsletter Subscription**
  - Email subscription form in footer
  - Input validation
  - Success/error feedback

## Tech Stack

### Frontend
- React
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- RESTful API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd employee-manager
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   - Create a `.env` file in the root directory with the following variables:
     ```
     NODE_ENV=development
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRE=30d
     JWT_COOKIE_EXPIRE=30
     ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd ../client
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add a new employee
- `PUT /api/employees/:id` - Update an employee
- `DELETE /api/employees/:id` - Delete an employee

### Subscription
- `POST /api/subscribe` - Subscribe to newsletter

## Project Structure

```
employee-manager/
├── client/                 # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # React context
│       ├── pages/          # Page components
│       └── App.jsx         # Main App component
│
└── server/                 # Backend Express application
    ├── config/            # Configuration files
    ├── controllers/       # Route controllers
    ├── middleware/        # Custom middleware
    ├── models/            # Mongoose models
    ├── routes/            # API routes
    └── utils/             # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact [Your Name] at [your.email@example.com]
