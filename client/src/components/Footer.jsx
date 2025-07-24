// src/components/Footer.js
import React, { useState } from 'react';
import axios from 'axios';

function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post('/api/subscribe', { email });
      setMessage(response.data.message || 'Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gray-50 py-8 mt-16 border-t border-gray-200">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <div className="mb-4 md:mb-0">
          <span className="font-semibold text-gray-900">Employee Manager</span>
          <p className="text-xs mt-1">&copy; 2025 Employee Manager.</p>
        </div>

        {/* Newsletter Subscription */}
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <p className="text-gray-700 font-semibold mb-2">Subscribe to our newsletter</p>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Input your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
                required
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md transition duration-300 ease-in-out ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {message && (
              <p className={`mt-2 text-sm ${message.includes('Thank you') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>
        </div>

        <div className="flex space-x-4 items-center">
          <select className="bg-gray-100 border border-gray-300 rounded-md py-1 px-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>English</option>
            {/* Add other language options */}
          </select>
          <div className="flex space-x-3">
            {/* Social Icons - replace with actual SVG/Icon components */}
            <a href="#" className="text-gray-400 hover:text-indigo-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.278 3.002c1.785 0 2.012.007 2.721.039 1.125.051 1.633.243 2.03.391.566.215.932.483 1.348.899.416.416.684.782.899 1.348.148.397.34.905.391 2.03.032.709.039.936.039 2.721s-.007 2.012-.039 2.721c-.051 1.125-.243 1.633-.391 2.03-.215.566-.483.932-.899 1.348-.416.416-.782.684-1.348.899-.397.148-.905.34-2.03.391-.709.032-.936.039-2.721.039s-2.012-.007-2.721-.039c-1.125-.051-1.633-.243-2.03-.391-.566-.215-.932-.483-1.348-.899-.416-.416-.684-.782-.899-1.348-.148-.397-.34-.905-.391-2.03-.032-.709-.039-.936-.039-2.721s.007-2.012.039-2.721c.051-1.125.243-1.633.391-2.03.215-.566.483-.932.899-1.348.416-.416.782-.684 1.348-.899.397-.148.905-.34 2.03-.391.709-.032.936-.039 2.721-.039zm0 2.164c-1.789 0-2.017.006-2.727.039-1.077.049-1.57.234-1.928.368-.48.188-.78.36-.934.514-.154.154-.326.454-.514.934-.134.358-.319.851-.368 1.928-.033.71-.039.938-.039 2.727s.006 2.017.039 2.727c.049 1.077.234 1.57.368 1.928.188.48.36.78.514.934.154.154.454.326.934.514.358.134.851.319 1.928.368.71.033.938.039 2.727.039s2.017-.006 2.727-.039c1.077-.049 1.57-.234 1.928-.368.48-.188.78-.36.934-.514.154-.154.326-.454.514-.934.134-.358.319-.851.368-1.928.033-.71.039-.938.039-2.727s-.006-2.017-.039-2.727c-.049-1.077-.234-1.57-.368-1.928-.188-.48-.36-.78-.514-.934-.154-.154-.454-.326-.934-.514-.358-.134-.851-.319-1.928-.368-.71-.033-.938-.039-2.727-.039zm0 3.824a6.002 6.002 0 100 12 6.002 6.002 0 000-12zm0 2a4.002 4.002 0 110 8 4.002 4.002 0 010-8zm6.5-2.5A1.5 1.5 0 1014 6.002a1.5 1.5 0 00-1.5 1.5z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;