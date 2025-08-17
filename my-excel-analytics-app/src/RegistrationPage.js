import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon, FaEyeSlash, FaEye, FaTimes, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { DarkModeContext } from './contexts/DarkModeContext';

// Helper component for the requirements checklist
const RequirementItem = ({ met, text }) => (
  <div className={`flex items-center transition-colors duration-300 text-sm ${met ? 'text-green-400' : 'text-red-400'}`}>
    <FaCheckCircle className="mr-2 flex-shrink-0" />
    <span>{text}</span>
  </div>
);

// Custom Glassmorphism Alert Component
const CustomAlert = ({ message, onClose, isSuccess }) => (
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

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onCancel, onConfirm, message }) => (
  !isOpen ? null : (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 font-sans">
      <div className="bg-white bg-opacity-20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl max-w-sm w-full text-center p-6 transition-all duration-300 transform scale-105">
        <p className="text-white text-lg mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 border border-gray-500/50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 border border-red-500/50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
);

const RegistrationPage = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    phoneNumber: "",
    employeeId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertSuccess, setIsAlertSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Weak', color: 'bg-red-500' });
  const [requirements, setRequirements] = useState({
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false,
  });
  
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


  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const checkPasswordStrength = (password) => {
    let score = 0;
    const newRequirements = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[\W_]/.test(password),
    };
    setRequirements(newRequirements);
    Object.values(newRequirements).forEach(met => { if (met) score++; });
    let text = 'Very Weak', color = 'bg-red-500';
    if (score >= 2) { text = 'Weak'; color = 'bg-orange-500'; }
    if (score >= 3) { text = 'Fair'; color = 'bg-yellow-500'; }
    if (score >= 4) { text = 'Good'; color = 'bg-blue-500'; }
    if (score === 5) { text = 'Strong'; color = 'bg-green-500'; }
    setPasswordStrength({ score, text, color });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password") {
      checkPasswordStrength(value);
    }
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

  const handleRegistration = async () => {
    setShowConfirmation(false);
    const { fullname, email, password, role, phoneNumber, employeeId } = formData;
    const registrationData = { fullname, email, password, role };
    if (role === "admin") {
      registrationData.phoneNumber = phoneNumber;
      registrationData.employeeId = employeeId;
    }
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });
      const data = await response.json();
      if (response.ok) {
        handleShowAlert("Registration successful!", true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        handleShowAlert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      handleShowAlert("An error occurred. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      handleShowAlert("Passwords do not match!");
      return;
    }
    if (!Object.values(requirements).every(Boolean)) {
      handleShowAlert("Password does not meet all requirements.");
      return;
    }
    setShowConfirmation(true);
  };

  const videoUrl = "https://cdn.pixabay.com/video/2016/09/21/5441-184226793_medium.mp4";
  
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };
  const roles = [ { value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' } ];
  const inputClass = `w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${ isDarkMode ? "bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400" : "bg-white/50 border-gray-300/50 text-gray-800 placeholder-gray-500" }`;
  const layoutTransition = { type: "spring", stiffness: 500, damping: 50 };

  return (
    <div className={`relative flex items-start sm:items-center justify-center min-h-screen py-10 sm:py-0 transition-colors duration-300 ${ isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800" }`}>
      {showAlert && <CustomAlert message={alertMessage} onClose={handleCloseAlert} isSuccess={isAlertSuccess} />}
      <ConfirmationModal isOpen={showConfirmation} onCancel={() => setShowConfirmation(false)} onConfirm={handleRegistration} message="Are you sure you want to register?" />

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

      <button onClick={toggleDarkMode} className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors duration-300 z-50 ${ isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-gray-800 hover:bg-gray-200" }`}>
        {isDarkMode ? <FaSun className="h-6 w-6" /> : <FaMoon className="h-6 w-6" />}
      </button>

      <motion.div 
        layout 
        transition={layoutTransition} 
        className="relative z-10 w-full max-w-2xl p-6 md:p-8 rounded-2xl shadow-2xl text-center border border-white/20 backdrop-filter backdrop-blur-lg bg-white/20 dark:bg-gray-800/20"
      >
        <div className="rounded-xl">
          <h2 className={`text-3xl font-bold mb-6 transition-colors duration-300 ${ isDarkMode ? "text-white" : "text-gray-900" }`}>Create an Account</h2>
          <p className={`mb-8 transition-colors duration-300 ${ isDarkMode ? "text-gray-300" : "text-gray-700" }`}>Please fill out the form to register.</p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 text-left">
            
              <div className="relative" ref={dropdownRef}>
                <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} aria-haspopup="listbox" aria-expanded={isDropdownOpen} className={`w-full flex justify-between items-center text-left pl-5 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${ isDarkMode ? "bg-gray-800/50 border-gray-700/50 text-white" : "bg-white/50 border-gray-300/50 text-gray-800" }`}>
                  <span>Register as: {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}</span>
                  <div className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    <svg className={`fill-current h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" className={`absolute top-full mt-2 w-full rounded-xl border shadow-lg z-20 backdrop-filter backdrop-blur-lg overflow-hidden ${ isDarkMode ? "bg-gray-800/70 border-gray-700/50" : "bg-white/70 border-gray-300/50" }`}>
                      {roles.map((role) => (
                        <div key={role.value} role="option" aria-selected={formData.role === role.value} onClick={() => { handleChange({ target: { name: 'role', value: role.value } }); setIsDropdownOpen(false); }} className={`px-5 py-3 cursor-pointer text-left transition-colors duration-200 ${ formData.role === role.value ? (isDarkMode ? 'bg-blue-500/50 text-white' : 'bg-blue-500 text-white') : (isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200/50') }`}>
                          {role.label}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Full Name" required className={inputClass} />
                
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className={inputClass} />

                {formData.role === "admin" && (
                  <>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required className={inputClass}/>
                    <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Employee ID" required className={inputClass}/>
                  </>
                )}

                <div className="relative md:col-span-2">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className={inputClass}/>
                  <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
            
                {formData.password && (
                  <div className="md:col-span-2 text-left">
                    <div className="flex w-full h-2 bg-gray-600 rounded-full overflow-hidden mt-1">
                      <div className={`transition-all duration-500 ${passwordStrength.color}`} style={{ width: `${passwordStrength.score * 20}%` }}></div>
                    </div>
                    <p className={`text-xs mt-1 font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Strength: {passwordStrength.text}
                    </p>
                    <div className="text-xs mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                      <RequirementItem met={requirements.length} text="At least 8 characters" />
                      <RequirementItem met={requirements.uppercase} text="One uppercase letter" />
                      <RequirementItem met={requirements.lowercase} text="One lowercase letter" />
                      <RequirementItem met={requirements.number} text="One number" />
                      <RequirementItem met={requirements.special} text="One special character" />
                    </div>
                  </div>
                )}

                <div className="relative md:col-span-2">
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required className={inputClass}/>
                  <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full !mt-6 bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-700 transition-colors duration-300 tracking-wide">
                Register
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center my-4 text-center">
          <hr className="flex-grow border-gray-300 dark:border-gray-500" />
          <span className="mx-4 text-gray-300 dark:text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-500" />
        </div>

        <div className="mt-8 text-center">
          <p className={isDarkMode ? "text-gray-300" : "text-gray-800"}>Already have an account?</p>
          <Link to="/login" className="inline-block bg-blue-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-300 tracking-wide mt-3">
            LOGIN NOW
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;