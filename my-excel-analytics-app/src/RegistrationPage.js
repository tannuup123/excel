import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
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
          <h2 className="text-2xl font-bold mb-6">Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-left text-gray-700 mb-2">Register as:</label>
              <div className="flex space-x-4 justify-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} className="form-radio text-indigo-600" />
                  <span className="text-gray-700">User</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleChange} className="form-radio text-indigo-600" />
                  <span className="text-gray-700">Admin</span>
                </label>
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
              Register
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;