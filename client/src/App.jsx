import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import AddEmployeePage from "./pages/AddEmployee";
import EmployeeDirectoryPage from "./pages/EmployeeDirectory";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/Register";
import EditEmployee from "./pages/EditEmployee";
import NotFound from "./pages/NotFound";

// Wrapper component for protected routes
const ProtectedLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

function AppContent() {
  return (
    <>
      <Routes>
        {/* Public routes - always accessible */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes - require authentication */}
        <Route
          path="/addemployee"
          element={
            <ProtectedLayout>
              <AddEmployeePage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedLayout>
              <EmployeeDirectoryPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/editemployee/:id"
          element={
            <ProtectedLayout>
              <EditEmployee />
            </ProtectedLayout>
          }
        />

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
