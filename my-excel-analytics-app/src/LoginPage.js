import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user', // Default role is user
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending login request with data:', formData); 
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Received response:', data); 

      if (response.ok) {
        alert('Login successful!');
        localStorage.setItem('userRole', data.role); 

        switch (data.role) {
          case 'super-admin':
            navigate('/super-admin');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'user':
            navigate('/user-dashboard');
            break;
          default:
            navigate('/user-dashboard');
        }
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Network or server error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100"
      style={{
        backgroundImage: "url('/images/bg-login.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg p-10 rounded-3xl shadow-xl max-w-md w-full text-center">

        <div className="bg-white p-8 rounded-2xl shadow-inner">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Username or Email"
                className="w-full px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-left text-gray-700 mb-2">Login as:</label>
              <div className="flex space-x-4 justify-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} className="form-radio text-blue-600" />
                  <span className="text-gray-700">User</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleChange} className="form-radio text-blue-600" />
                  <span className="text-gray-700">Admin</span>
                </label>
              </div>
            </div>

            <Link to="#" className="text-sm text-blue-600 hover:underline mb-6 block text-right">Forgot Password?</Link>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
              Login
            </button>
          </form>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-600">OR</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        
        <div className="mt-6">
          <p className="text-gray-700 mb-2">Don't have an account?</p>
          <Link to="/register" className="inline-block bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-green-600 hover:to-green-800 transition-colors">
            REGISTER NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;