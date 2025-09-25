import React, { useState, useEffect, useContext, useRef } from "react";
import { useAuth } from './contexts/AuthContext';
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon, FaEyeSlash, FaEye, FaTimes, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { DarkModeContext } from './contexts/DarkModeContext';

// Custom Glassmorphism Alert Component
const CustomAlert = ({ message, onClose, isSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 font-sans">
      <div className={`bg-white bg-opacity-20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl max-w-sm w-full text-center p-6 transition-all duration-300 transform scale-105 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            {isSuccess ? <FaCheckCircle size={20} /> : <FaExclamationTriangle size={20} />}
            <p className="text-xl font-bold">{isSuccess ? "Success" : "Error"}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <FaTimes />
          </button>
        </div>
        <p className="text-white text-lg mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-red-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 border border-red-500/50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { login } = useAuth(); // Get the login function from context
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertSuccess, setIsAlertSuccess] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');

  // State and ref for custom dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleShowAlert = (message, isSuccess = false) => {
    setAlertMessage(message);
    setIsAlertSuccess(isSuccess);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.error || 'Login failed. Please try again.';
        handleShowAlert(errorMsg.toLowerCase().includes('invalid') ? 'Invalid email or password.' : errorMsg);
        return;
      }
      if (data.token) {
        login(data.token, data.user?.role || formData.role);
      }
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", data.user?.role || formData.role);
      localStorage.setItem("userEmail", data.user?.email || formData.email);
      handleShowAlert("Login successful!", true);
      const role = data.user?.role || formData.role;
      setTimeout(() => {
        if (role === "super-admin") navigate("/super-admin", { replace: true });
        else if (role === "admin") navigate("/admin-dashboard", { replace: true });
        else navigate("/user-dashboard", { replace: true });
      }, 900);
    } catch (error) {
      console.error("Network or server error:", error);
      handleShowAlert("Server error. Please try again.");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordMessage('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send reset link.');
      setForgotPasswordMessage(data.message || 'Password reset link sent to your email.');
      setForgotPasswordEmail('');
    } catch (error) {
      console.error("Forgot password error:", error);
      setForgotPasswordError(error.message);
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };
  const roles = [{ value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }];
  
  const videoUrl = "https://cdn.pixabay.com/video/2016/09/21/5441-184226793_medium.mp4";
  const layoutTransition = { type: "spring", stiffness: 500, damping: 50 };

  return (
    <div className={`relative flex items-start sm:items-center justify-center min-h-screen py-10 sm:py-0 transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      {showAlert && <CustomAlert message={alertMessage} onClose={handleCloseAlert} isSuccess={isAlertSuccess} />}

      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src={videoUrl}
        />
        <div className={`absolute inset-0 transition-colors duration-300 ${isDarkMode ? 'bg-black bg-opacity-50' : 'bg-white bg-opacity-10'}`}></div>
      </div>

      <button onClick={toggleDarkMode} className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors duration-300 z-50 ${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-gray-800 hover:bg-gray-200"}`}>
        {isDarkMode ? <FaSun className="h-6 w-6" /> : <FaMoon className="h-6 w-6" />}
      </button>

      <motion.div 
        layout
        transition={layoutTransition}
        className="relative z-10 w-full max-w-lg p-6 md:p-10 rounded-2xl shadow-2xl text-center border border-white/20 backdrop-filter backdrop-blur-lg bg-white/20 dark:bg-gray-800/20"
      >
        <div className="p-8 rounded-xl">
          <h2 className={`text-3xl font-bold mb-10 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Welcome Back!</h2>

          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="mb-4 relative" ref={dropdownRef}>
              <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} aria-haspopup="listbox" aria-expanded={isDropdownOpen} className={`w-full flex justify-between items-center text-left px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode ? "bg-gray-800/50 border-gray-700/50 text-white" : "bg-white/50 border-gray-300/50 text-gray-800"}`}>
                <span>Login as: {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}</span>
                <div className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  <svg className={`fill-current h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} role="listbox" className={`absolute top-full mt-2 w-full rounded-xl border shadow-lg z-20 backdrop-filter backdrop-blur-lg overflow-hidden ${isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-300/50"}`}>
                    {roles.map((role) => (
                      <div key={role.value} role="option" aria-selected={formData.role === role.value} onClick={() => { handleChange({ target: { name: 'role', value: role.value } }); setIsDropdownOpen(false); }} className={`px-5 py-3 cursor-pointer text-left transition-colors duration-200 ${formData.role === role.value ? (isDarkMode ? 'bg-blue-500/50 text-white' : 'bg-blue-500 text-white') : (isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200/50')}`}>
                        {role.label}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mb-4">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? "bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400" : "bg-white/50 border-gray-300/50 text-gray-800 placeholder-gray-500"}`} />
            </div>
            <div className="mb-4 relative">
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? "bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400" : "bg-white/50 border-gray-300/50 text-gray-800 placeholder-gray-500"}`} />
              <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>

            <div className="mb-6 text-right">
              <button type="button" onClick={() => setShowForgotPasswordModal(true)} className={`text-sm hover:underline ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-700 hover:text-blue-900"}`}>
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-300 tracking-wide">
              Login
            </button>
          </form>
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300 dark:border-gray-500" />
          <span className="mx-4 text-gray-300 dark:text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-500" />
        </div>

        <div className="mt-8">
          <p className={isDarkMode ? "text-gray-300" : "text-gray-800"}>Don't have an account?</p>
          <Link to="/register" className="inline-block bg-green-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-green-700 transition-colors duration-300 tracking-wide mt-3">
            REGISTER NOW
          </Link>
        </div>
      </motion.div>

      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`p-8 rounded-xl shadow-xl max-w-sm w-full border border-white/20 backdrop-filter backdrop-blur-lg bg-white/20 dark:bg-gray-800/20 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            <h3 className="text-xl font-bold mb-4">Forgot Password</h3>
            <p className="text-sm mb-4">Enter your email to receive a password reset link.</p>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="mb-4">
                <input type="email" value={forgotPasswordEmail} onChange={(e) => setForgotPasswordEmail(e.target.value)} placeholder="Email Address" required className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400' : 'bg-gray-100/50 border-gray-300/50 text-gray-800 placeholder-gray-500'}`} />
              </div>
              {forgotPasswordMessage && <p className="text-green-500 text-sm mb-4">{forgotPasswordMessage}</p>}
              {forgotPasswordError && <p className="text-red-500 text-sm mb-4">{forgotPasswordError}</p>}
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setShowForgotPasswordModal(false)} className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300 transition-colors`}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Send Link
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;