import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon, FaEyeSlash, FaEye, FaTimes, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { DarkModeContext } from './contexts/DarkModeContext';

// ================= CUSTOM ALERT MODAL ===================
const CustomAlert = ({ message, onClose, isSuccess }) => (
  <motion.div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 font-sans"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-white/40 rounded-2xl shadow-2xl max-w-sm w-full text-center p-6 ${isSuccess ? 'text-green-500' : 'text-red-400'}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          {isSuccess ? <FaCheckCircle size={20} /> : <FaExclamationTriangle size={20} />}
          <p className="text-xl font-bold">{isSuccess ? "Success" : "Error"}</p>
        </div>
        <button onClick={onClose} className="text-gray-300 hover:text-red-500 transition-colors duration-200">
          <FaTimes />
        </button>
      </div>

      {/* Message */}
      <p className="text-white text-lg mb-6">{message}</p>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full bg-red-500/60 hover:bg-red-600 border border-red-500/50 transition-all py-2 rounded-lg text-white font-semibold shadow-md"
      >
        Close
      </button>
    </motion.div>
  </motion.div>
);

const LoginPage = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });

  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertSuccess, setIsAlertSuccess] = useState(false);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Alert Helpers
  const handleShowAlert = (message, isSuccess = false) => {
    setAlertMessage(message);
    setIsAlertSuccess(isSuccess);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  // Handle Input Changes
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        handleShowAlert(data.error || "Login Failed");
        return;
      }

      if (data.token) localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", data.user?.role || formData.role);
      localStorage.setItem("userEmail", data.user?.email || formData.email);

      handleShowAlert("Login successful!", true);

      const role = data.user?.role || formData.role;
      setTimeout(() => {
        if (role === "super-admin") navigate("/super-admin");
        else if (role === "admin") navigate("/admin-dashboard");
        else navigate("/user-dashboard");
      }, 900);

    } catch (err) {
      handleShowAlert("Server error. Try again.");
    }
  };

  // Forgot Password
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reset link");
      setForgotPasswordMessage("Password reset link sent to your email.");
      setForgotPasswordEmail('');
    } catch (err) {
      setForgotPasswordError(err.message);
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.95 },
  };

  const roles = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' }
  ];

  // Soft Excel-themed gradient
  const bgGradient = "linear-gradient(135deg, #e9f7ef 0%, #c8f0da 50%, #a4e2c4 100%)";

  return (
    <div
  className={`relative flex items-center justify-center min-h-screen transition-colors duration-300 ${
    isDarkMode ? "text-white" : "text-gray-800"
  }`}
>
  {/* Alert */}
  <AnimatePresence>
    {showAlert && (
      <CustomAlert
        message={alertMessage}
        onClose={handleCloseAlert}
        isSuccess={isAlertSuccess}
      />
    )}
  </AnimatePresence>

  {/* Dark mode toggle */}
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={toggleDarkMode}
    className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all z-50 ${
      isDarkMode
        ? "bg-gray-800 text-white hover:bg-gray-700"
        : "bg-white text-gray-900 hover:bg-gray-200"
    }`}
  >
    {isDarkMode ? <FaSun /> : <FaMoon />}
  </motion.button>

  {/* Login Card */}
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="relative z-10 w-full max-w-lg p-10 rounded-2xl shadow-2xl text-center border border-white/50 backdrop-blur-lg bg-white/40 dark:bg-gray-900/40"
  >
    <h2 className="text-3xl font-extrabold mb-8 tracking-wide">
      Welcome to Sheet Insights
    </h2>

    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Role Select */}
      <div className="relative z-50" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full px-5 py-3 rounded-xl border flex justify-between items-center transition-all ${
            isDarkMode
              ? "bg-gray-800/60 text-white"
              : "bg-green-50/80 text-gray-800"
          }`}
        >
          Login as:{" "}
          {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
          <motion.span animate={{ rotate: isDropdownOpen ? 180 : 0 }}>
            ▼
          </motion.span>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className={`absolute top-full left-0 mt-2 w-full rounded-xl border shadow-lg backdrop-blur-lg overflow-hidden z-50 ${
                isDarkMode ? "bg-gray-800/80" : "bg-white/90"
              }`}
            >
              {roles.map((role) => (
                <div
                  key={role.value}
                  onClick={() => {
                    handleChange({ target: { name: "role", value: role.value } });
                    setIsDropdownOpen(false);
                  }}
                  className={`px-5 py-3 cursor-pointer transition-colors ${
                    formData.role === role.value
                      ? "bg-green-500/70 text-white"
                      : "hover:bg-green-100/70"
                  }`}
                >
                  {role.label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Email Input */}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        className="w-full px-5 py-3 rounded-xl border bg-white/70 backdrop-blur-md focus:ring-2 focus:ring-green-500"
        required
      />

      {/* Password Input */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-5 py-3 rounded-xl border bg-white/70 backdrop-blur-md focus:ring-2 focus:ring-green-500"
          required
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {/* Forgot Password */}
      <div className="text-right">
        <button
          type="button"
          onClick={() => setShowForgotPasswordModal(true)}
          className="text-sm text-green-700 hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      {/* Login Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-700"
      >
        Login
      </motion.button>
    </form>

    {/* Divider */}
    <div className="flex items-center my-6">
      <hr className="flex-grow border-gray-300" />
      <span className="mx-3 text-gray-500">OR</span>
      <hr className="flex-grow border-gray-300" />
    </div>

    {/* Register Link */}
    <Link
      to="/register"
      className="inline-block bg-green-500 text-white py-3 px-10 rounded-xl shadow-lg hover:bg-green-600"
    >
      REGISTER NOW
    </Link>
  </motion.div>
</div>

  );
};

export default LoginPage;
