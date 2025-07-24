import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AtAGlance from "../components/AtAGlance";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

function Home() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const StatCard = ({ value, label, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
      <div className="text-indigo-600 mb-2">
        {/* Icon Placeholder - replace with actual SVG/Icon component */}
        <svg
          className="h-10 w-10 mx-auto"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
        </svg>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
        {label}
      </h3>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not authenticated, show the public landing page
  return (
    <div className="font-sans antialiased text-gray-800 bg-gray-50 min-h-screen">
      <Header />
      <main>
        <HeroSection />
        {isAuthenticated ? (
          <AtAGlance />
        ) : (
          <section className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold mb-12">At a Glance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard
                value="0"
                label="Total Employees"
                description="Across all departments and locations."
              />
              <StatCard
                value="0"
                label="Departments"
                description="Structured for efficient collaboration."
              />
              <StatCard
                value="0 Years"
                label="Average Tenure"
                description="Dedicated and experienced workforce."
              />
              <StatCard
                value="0%"
                label="Retention Rate"
                description="Committed to employee satisfaction."
              />
            </div>
          </section>
        )}
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
