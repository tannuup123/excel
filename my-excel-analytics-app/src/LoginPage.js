import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaEyeSlash, FaEye } from "react-icons/fa";
import { DarkModeContext } from './contexts/DarkModeContext';

const LoginPage = () => {
    const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "user",
    });
    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // New state for the forgot password modal
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.error || 'Login failed. Please try again.';
                if (errorMsg.toLowerCase().includes('invalid')) {
                    setError('Invalid email or password. Please try again.');
                } else {
                    setError(errorMsg);
                }
                return;
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", data.user?.role || formData.role);
            localStorage.setItem("userEmail", data.user?.email || formData.email);

            alert("Login successful!");

            const role = data.user?.role || formData.role;
            if (role === "super-admin") {
                navigate("/super-admin");
            } else if (role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/user-dashboard");
            }
        } catch (error) {
            console.error("Network or server error:", error);
            alert("Server error. Please try again.");
        }
    };

    // Function to handle forgot password submission
    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setForgotPasswordError('');
        setForgotPasswordMessage('');

        try {
            // This URL needs to be created in your backend
            const response = await fetch("http://localhost:5000/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotPasswordEmail }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset link.');
            }

            setForgotPasswordMessage(data.message || 'Password reset link sent to your email.');
            setForgotPasswordEmail('');
            // Optional: Close modal after a delay
            // setTimeout(() => setShowForgotPasswordModal(false), 3000);
        } catch (error) {
            console.error("Forgot password error:", error);
            setForgotPasswordError(error.message);
        }
    };

    const imageUrl = "https://wallpaperbat.com/img/7899234-excel-wallpaper-for-free-download.png";

    return (
        <div
            className={`relative flex items-center justify-center min-h-screen transition-colors duration-300 ${
                isDarkMode ? "text-white" : "text-gray-800"
            }`}
        >
            {/* Background Image and Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                <div className="absolute inset-0 bg-black opacity-40"></div>
            </div>

            {/* Dark Mode Toggle - Z-index is kept high to be always on top */}
            <button
                onClick={toggleDarkMode}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors duration-300 z-50 ${
                    isDarkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-white text-gray-800 hover:bg-gray-200"
                }`}
            >
                {isDarkMode ? (
                    <FaSun className="h-6 w-6" />
                ) : (
                    <FaMoon className="h-6 w-6" />
                )}
            </button>

            {/* Login Card with Glassmorphism Effect */}
            <div className="relative z-10 w-full max-w-lg p-10 rounded-2xl shadow-2xl text-center border border-white border-opacity-20 backdrop-filter backdrop-blur-lg bg-white/20 dark:bg-gray-800/20">
                <div className="p-8 rounded-xl">
                    <h2
                        className={`text-3xl font-bold mb-10 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                        Welcome Back!
                    </h2>
                    
                    <form onSubmit={handleSubmit}>
                        {error && <p className="text-[15px] text-red-500 text-sm mb-4">{error}</p>}
                        <div className="mb-4">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    isDarkMode
                                        ? "bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400"
                                        : "bg-white/50 border-gray-300/50 text-gray-800 placeholder-gray-500"
                                }`}
                                required
                            />
                        </div>
                        <div className="mb-6 relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    isDarkMode
                                        ? "bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400"
                                        : "bg-white/50 border-gray-300/50 text-gray-800 placeholder-gray-500"
                                }`}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <div className="mb-6 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="user"
                                        checked={formData.role === "user"}
                                        onChange={handleChange}
                                        className="form-radio text-blue-500 h-4 w-4"
                                    />
                                    <span
                                        className={isDarkMode ? "text-gray-300" : "text-gray-900"}
                                    >
                                        User
                                    </span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={formData.role === "admin"}
                                        onChange={handleChange}
                                        className="form-radio text-blue-500 h-4 w-4"
                                    />
                                    <span
                                        className={isDarkMode ? "text-gray-300" : "text-gray-900"}
                                    >
                                        Admin
                                    </span>
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowForgotPasswordModal(true)}
                                className={`text-sm hover:underline ${
                                    isDarkMode
                                        ? "text-[16px] text-blue-400 hover:text-blue-300"
                                        : "text-[16px] text-blue-900 hover:text-blue-700"
                                }`}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-300 tracking-wide"
                        >
                            Login
                        </button>
                    </form>
                </div>

                <div className="flex items-center my-4">
                    <hr className="flex-grow border-gray-300 dark:border-gray-500" />
                    <span className="mx-4 text-gray-300 dark:text-gray-500">OR</span>
                    <hr className="flex-grow border-gray-300 dark:border-gray-500" />
                </div>

                {/* Register Section */}
                <div className="mt-8">
                    <p className={isDarkMode ? "text-gray-300" : "text-gray-800"}>
                        Don't have an account?
                    </p>
                    <Link
                        to="/register"
                        className="inline-block bg-green-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-green-700 transition-colors duration-300 tracking-wide mt-3"
                    >
                        REGISTER NOW
                    </Link>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
                    <div className={`p-8 rounded-xl shadow-xl max-w-sm w-full border border-white border-opacity-20 backdrop-filter backdrop-blur-lg bg-white/20 dark:bg-gray-800/20 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <h3 className="text-xl font-bold mb-4">Forgot Password</h3>
                        <p className="text-sm mb-4">Enter your email address to receive a password reset link.</p>
                        <form onSubmit={handleForgotPasswordSubmit}>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' : 'bg-gray-100/50 border-gray-300/50 text-gray-800 placeholder-gray-500'}`}
                                    required
                                />
                            </div>
                            {forgotPasswordMessage && <p className="text-green-500 text-sm mb-4">{forgotPasswordMessage}</p>}
                            {forgotPasswordError && <p className="text-red-500 text-sm mb-4">{forgotPasswordError}</p>}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPasswordModal(false)}
                                    className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300 transition-colors`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                    Send Link
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
