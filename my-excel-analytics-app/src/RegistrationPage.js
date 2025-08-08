import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';

const RegistrationPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        phoneNumber: '',
        employeeId: '',
        governmentId: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const registrationData = {
            fullname: formData.fullname,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            ...(formData.role === 'admin' && {
                phoneNumber: formData.phoneNumber,
                employeeId: formData.employeeId,
                // governmentId: formData.governmentId,
            }),
        };

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
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
        <div className={`relative flex items-center justify-center h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
             style={{
                 backgroundImage: !isDarkMode ? "url('/images/bg-login.jpg')" : 'none',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
             }}>
            <button
                onClick={toggleDarkMode}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
            >
                {isDarkMode ? <FaSun className="h-6 w-6" /> : <FaMoon className="h-6 w-6" />}
            </button>

            <div className="glass-container p-10 rounded-2xl shadow-2xl max-w-lg w-full text-center border border-white border-opacity-20 backdrop-filter backdrop-blur-lg">

                <div className="p-8 rounded-xl">
                    <h2 className={`text-3xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create an Account</h2>
                    <p className={`mb-8 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Please fill out the form to register.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 flex justify-center items-center space-x-6">
                            <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Register as:</p>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} className="form-radio text-blue-500 h-4 w-4" />
                                <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>User</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleChange} className="form-radio text-blue-500 h-4 w-4" />
                                <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Admin</span>
                            </label>
                        </div>
                        
                        <div className="mb-4">
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`}
                            />
                        </div>

                        {/* Additional fields for Admin registration */}
                        {formData.role === 'admin' && (
                            <>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`}
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="employeeId"
                                        value={formData.employeeId}
                                        onChange={handleChange}
                                        placeholder="Employee ID"
                                        className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`}
                                    />
                                </div>
                                {/* <div className="mb-6">
                                    <input
                                        type="text"
                                        name="governmentId"
                                        value={formData.governmentId}
                                        onChange={handleChange}
                                        placeholder="Government ID"
                                        className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`}
                                    />
                                </div> */}
                            </>
                        )}
                        
                        <div className="mb-4">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`}
                            />
                        </div>
                        <div className="mb-6">
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`}
                            />
                        </div>

                        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-700 transition-colors duration-300 tracking-wide">
                            Register
                        </button>
                    </form>
                </div>

                <div className="mt-8">
                    <p className={`mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Already have an account?</p>
                    <Link to="/login" className="inline-block bg-blue-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-300 tracking-wide">
                        LOGIN NOW
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;