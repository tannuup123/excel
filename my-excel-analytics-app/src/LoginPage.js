import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';

const LoginPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'user',
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
        try {
            // console.log('Sending login request with data:', formData);
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            // console.log('Received response:', data);

            if (response.ok) {
                alert('Login successful!');
                localStorage.setItem('isLoggedIn','true')
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
                    <h2 className={`text-3xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome Back!</h2>
                    <p className={`mb-8 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Please log in to your account.</p>

                    <form onSubmit={handleSubmit}>
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
                        <div className="mb-6">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`}
                            />
                        </div>

                        <div className="mb-6 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} className="form-radio text-blue-500 h-4 w-4" />
                                    <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>User</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleChange} className="form-radio text-blue-500 h-4 w-4" />
                                    <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Admin</span>
                                </label>
                            </div>
                            <Link to="#" className={`text-sm transition-colors duration-300 hover:underline ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                                Forgot Password?
                            </Link>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-300 tracking-wide">
                            Sign In
                        </button>
                    </form>
                </div>

                <div className="mt-8">
                    <p className={`mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Don't have an account?</p>
                    <Link to="/register" className="inline-block bg-green-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-green-700 transition-colors duration-300 tracking-wide">
                        REGISTER NOW
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;