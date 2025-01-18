import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate


function AuthForm({ setIsAuthenticated, setShowAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const response = await fetch(`https://movie-master-backend.onrender.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isLogin) {
        localStorage.setItem('token', data.token); // Store token in localStorage
        setIsAuthenticated(true); // Set user as authenticated
        setShowAuth(false); // Close authentication modal
      } else {
        setIsLogin(true); // Switch to login after successful registration
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBackClick = () => {
    navigate("/main");  // Navigate to /main route
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 relative">
      <div className="absolute inset-0 bg-purple-900 overflow-hidden z-0">
        <div className="liquid-background"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-violet-900/20">
          <button
            onClick={handleBackClick}  // Call handleBackClick to navigate to /main
            className="absolute top-4 right-4 text-violet-400 hover:text-violet-300 rounded-xl"
          >
            Back
          </button>

          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400 h-5 w-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-700"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-800/50 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-700"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400 h-5 w-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-800/50 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-700"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition-colors duration-300 shadow-lg hover:shadow-2xl"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-violet-400 hover:text-violet-300 transition-colors duration-300 rounded-xl"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
