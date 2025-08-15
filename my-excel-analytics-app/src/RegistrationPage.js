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

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onCancel, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
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
  );
};

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

  // State and ref for custom dropdown
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
    if (score === 2) { text = 'Weak'; color = 'bg-orange-500'; }
    if (score === 3) { text = 'Fair'; color = 'bg-yellow-500'; }
    if (score === 4) { text = 'Good'; color = 'bg-blue-500'; }
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

  const imageUrl = "https://wallpaperbat.com/img/7899234-excel-wallpaper-for-free-download.png";
  
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };
  const roles = [ { value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' } ];

  return (
    <div className={`relative flex items-center justify-center min-h-screen transition-colors duration-300 ${ isDarkMode ? "text-white" : "text-gray-800" }`}>
      {showAlert && <CustomAlert message={alertMessage} onClose={handleCloseAlert} isSuccess={isAlertSuccess} />}
      <ConfirmationModal isOpen={showConfirmation} onCancel={() => setShowConfirmation(false)} onConfirm={handleRegistration} message="Are you sure you want to register?" />

      <div className="absolute inset-0 bg-fixed bg-cover bg-center z-0" style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      <button onClick={toggleDarkMode} className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors duration-300 z-50 ${ isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-gray-800 hover:bg-gray-200" }`}>
        {isDarkMode ? <FaSun className="h-6 w-6" /> : <FaMoon className="h-6 w-6" />}
      </button>

      <div className="relative z-10 w-full max-w-lg p-10 rounded-2xl shadow-2xl text-center border border-white/20 backdrop-filter backdrop-blur-lg bg-white/20 dark:bg-gray-800/20">
        <div className="p-8 rounded-xl">
          <h2 className={`text-3xl font-bold mb-6 transition-colors duration-300 ${ isDarkMode ? "text-white" : "text-gray-900" }`}>Create an Account</h2>
          <p className={`mb-8 transition-colors duration-300 ${ isDarkMode ? "text-gray-300" : "text-gray-700" }`}>Please fill out the form to register.</p>

          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            
            {/* Custom Animated Dropdown */}
            <div className="mb-4 relative" ref={dropdownRef}>
              <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} aria-haspopup="listbox" aria-expanded={isDropdownOpen} className={`w-full flex justify-between items-center text-left pl-5 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${ isDarkMode ? "bg-gray-800/50 border-gray-700/50 text-white" : "bg-white/50 border-gray-300/50 text-gray-800" }`}>
                <span>Register as: {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}</span>
                <div className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  <svg className={`fill-current h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} role="listbox" className={`absolute top-full mt-2 w-full rounded-xl border shadow-lg z-20 backdrop-filter backdrop-blur-lg overflow-hidden ${ isDarkMode ? "bg-gray-800/70 border-gray-700/50" : "bg-white/70 border-gray-300/50" }`}>
                    {roles.map((role) => (
                      <div key={role.value} role="option" aria-selected={formData.role === role.value} onClick={() => { handleChange({ target: { name: 'role', value: role.value } }); setIsDropdownOpen(false); }} className={`px-5 py-3 cursor-pointer text-left transition-colors duration-200 ${ formData.role === role.value ? (isDarkMode ? 'bg-blue-500/50 text-white' : 'bg-blue-500 text-white') : (isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200/50') }`}>
                        {role.label}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* End Custom Dropdown */}

            <div className="mb-4">
              <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Full Name" required className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${ isDarkMode ? "bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400" : "bg-white/50 border-gray-300/50 text-gray-800 placeholder-gray-500" }`}/>
            </div>
            <div className="mb-4">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${ isDarkMode ? "bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400" : "bg-white/50 border-gray-300/50 text-gray-800 placeholder-gray-500" }`}/>
            </div>

            <AnimatePresence>
              {formData.role === "admin" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                  <div className="mb-4">
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${ isDarkMode ? "bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400" : "bg-white/50 border-gray-300/50 text-gray-800 placeholder-gray-500" }`}/>
                  </div>
                  <div className="mb-4">
                    <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Employee ID" required className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${ isDarkMode ? "bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400" : "bg-white/50 border-gray-300/50 text-gray-800 placeholder-gray-500" }`}/>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-4 relative">
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${ isDarkMode ? "bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400" : "bg-white/50 border-gray-300/50 text-gray-800 placeholder-gray-500" }`}/>
              <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {formData.password && (
              <div className="mb-4">
                <div className="flex w-full h-2 bg-gray-600 rounded-full overflow-hidden mt-2">
                  <div className={`transition-all duration-500 ${passwordStrength.color}`} style={{ width: `${passwordStrength.score * 20}%` }}></div>
                </div>
                <p className={`text-xs mt-1 text-left font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Strength: {passwordStrength.text}
                </p>
                <div className="text-left text-xs mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                  <RequirementItem met={requirements.length} text="At least 8 characters" />
                  <RequirementItem met={requirements.uppercase} text="One uppercase letter" />
                  <RequirementItem met={requirements.lowercase} text="One lowercase letter" />
                  <RequirementItem met={requirements.number} text="One number" />
                  <RequirementItem met={requirements.special} text="One special character" />
                </div>
              </div>
            )}

            <div className="mb-6 relative">
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${ isDarkMode ? "bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400" : "bg-white/50 border-gray-300/50 text-gray-800 placeholder-gray-500" }`}/>
              <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-700 transition-colors duration-300 tracking-wide">
              Register
            </button>
          </form>
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300 dark:border-gray-500" />
          <span className="mx-4 text-gray-300 dark:text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-500" />
        </div>

        <div className="mt-8">
          <p className={isDarkMode ? "text-gray-300" : "text-gray-800"}>Already have an account?</p>
          <Link to="/login" className="inline-block bg-blue-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-300 tracking-wide mt-3">
            LOGIN NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;

// import React, { useState, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

// // Colors
// const THEME_GREEN = "#28c47c";
// const THEME_WHITE = "#ffffff";
// const SHADOW = "0 8px 32px 0 rgba(60, 200, 140, 0.19)";

// const RequirementItem = ({ met, text }) => (
//   <li style={{
//     display: "flex",
//     alignItems: "center",
//     marginBottom: 8,
//     color: met ? THEME_GREEN : "#ccc"
//   }}>
//     <FaCheckCircle style={{ marginRight: 8, opacity: met ? 1 : 0.4 }} />
//     <span>{text}</span>
//   </li>
// );

// const RegistrationPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [input, setInput] = useState({ email: "", password: "", confirmPassword: "" });
//   const [formState, setFormState] = useState({ status: null, message: "" });

//   const navigate = useNavigate();

//   // Mock requirements
//   const requirements = [
//     { check: input.password.length >= 8, label: "At least 8 characters" },
//     { check: /[A-Z]/.test(input.password), label: "1 uppercase letter" },
//     { check: /[0-9]/.test(input.password), label: "1 number" },
//   ];

//   // Form submission
//   const handleSubmit = e => {
//     e.preventDefault();
//     if (input.password !== input.confirmPassword) {
//       setFormState({ status: "error", message: "Passwords do not match!" });
//       return;
//     }
//     // Add actual registration logic here
//     setFormState({ status: "success", message: "Registered successfully!" });
//     // navigate("/login"); // on success
//   };

//   // Animations
//   const containerVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         background: THEME_WHITE,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         style={{
//           background: "rgba(255,255,255,0.7)",
//           boxShadow: SHADOW,
//           borderRadius: 20,
//           padding: "44px 38px",
//           maxWidth: 400,
//           width: "100%",
//           border: `1.5px solid ${THEME_GREEN}20`,
//           backdropFilter: "blur(18px)", // glass effect
//         }}
//       >
//         <h2 style={{
//           textAlign: "center",
//           color: THEME_GREEN,
//           fontWeight: "700",
//           marginBottom: 24,
//           letterSpacing: "1px"
//         }}>
//           Create Your Account
//         </h2>

//         <AnimatePresence>
//           {formState.status && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               style={{
//                 marginBottom: 20,
//                 padding: 12,
//                 borderRadius: 8,
//                 background: formState.status === "success" ? THEME_GREEN : "#ffeded",
//                 color: formState.status === "success" ? "#fff" : "#b50000",
//                 display: "flex",
//                 alignItems: "center",
//                 boxShadow: "0 2px 12px rgba(60,200,140,0.15)"
//               }}
//             >
//               {formState.status === "success" ? (
//                 <FaCheckCircle style={{ marginRight: 8 }} />
//               ) : (
//                 <FaExclamationTriangle style={{ marginRight: 8 }} />
//               )}
//               <span>{formState.message}</span>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <form onSubmit={handleSubmit} style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 22,
//         }}>
//           {/* Email */}
//           <div style={{ position: "relative" }}>
//             <input
//               type="email"
//               placeholder="Email"
//               value={input.email}
//               onChange={e => setInput(i => ({ ...i, email: e.target.value }))}
//               required
//               style={{
//                 width: "100%",
//                 padding: "12px 16px",
//                 borderRadius: 7,
//                 border: `1.5px solid ${THEME_GREEN}70`,
//                 fontSize: "1rem",
//                 outline: "none",
//                 marginBottom: 3,
//                 transition: "border 0.22s"
//               }}
//               onFocus={e => e.target.style.border = `2px solid ${THEME_GREEN}`}
//               onBlur={e => e.target.style.border = `1.5px solid ${THEME_GREEN}70`}
//             />
//           </div>

//           {/* Password */}
//           <div style={{ position: "relative" }}>
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={input.password}
//               onChange={e => setInput(i => ({ ...i, password: e.target.value }))}
//               required
//               style={{
//                 width: "100%",
//                 padding: "12px 44px 12px 16px",
//                 borderRadius: 7,
//                 border: `1.5px solid ${THEME_GREEN}70`,
//                 fontSize: "1rem",
//                 outline: "none",
//                 marginBottom: 3,
//                 transition: "border 0.22s"
//               }}
//               onFocus={e => e.target.style.border = `2px solid ${THEME_GREEN}`}
//               onBlur={e => e.target.style.border = `1.5px solid ${THEME_GREEN}70`}
//             />
//             <span
//               onClick={() => setShowPassword(s => !s)}
//               style={{
//                 position: "absolute",
//                 right: 14,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 cursor: "pointer",
//                 color: THEME_GREEN,
//                 fontSize: 20,
//                 opacity: 0.8,
//                 transition: "color 0.18s"
//               }}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>

//           {/* Confirm Password */}
//           <div style={{ position: "relative" }}>
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Confirm Password"
//               value={input.confirmPassword}
//               onChange={e => setInput(i => ({ ...i, confirmPassword: e.target.value }))}
//               required
//               style={{
//                 width: "100%",
//                 padding: "12px 44px 12px 16px",
//                 borderRadius: 7,
//                 border: `1.5px solid ${THEME_GREEN}70`,
//                 fontSize: "1rem",
//                 outline: "none",
//                 marginBottom: 3,
//                 transition: "border 0.22s"
//               }}
//               onFocus={e => e.target.style.border = `2px solid ${THEME_GREEN}`}
//               onBlur={e => e.target.style.border = `1.5px solid ${THEME_GREEN}70`}
//             />
//             <span
//               onClick={() => setShowPassword(s => !s)}
//               style={{
//                 position: "absolute",
//                 right: 14,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 cursor: "pointer",
//                 color: THEME_GREEN,
//                 fontSize: 20,
//                 opacity: 0.8,
//                 transition: "color 0.18s"
//               }}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>

//           {/* Password requirements */}
//           <ul style={{
//             listStyle: "none",
//             paddingLeft: 0,
//             marginBottom: 5
//           }}>
//             {requirements.map((r, idx) => (
//               <RequirementItem key={idx} met={r.check} text={r.label} />
//             ))}
//           </ul>

//           {/* Register */}
//           <motion.button
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//             type="submit"
//             style={{
//               background: THEME_GREEN,
//               color: THEME_WHITE,
//               border: "none",
//               borderRadius: 8,
//               padding: "12px 0",
//               fontWeight: "600",
//               fontSize: "1.05rem",
//               boxShadow: SHADOW,
//               cursor: "pointer",
//               transition: "background 0.22s",
//               marginTop: 8,
//               letterSpacing: "0.5px"
//             }}
//           >
//             Register
//           </motion.button>
//         </form>

//         <div style={{
//           textAlign: "center",
//           marginTop: 18,
//           fontSize: "0.98rem"
//         }}>
//           Already have an account?
//           <Link to="/login" style={{
//             color: THEME_GREEN,
//             textDecoration: "none",
//             fontWeight: "bold",
//             marginLeft: 6,
//             transition: "color 0.15s"
//           }}>
//             Login Now
//           </Link>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default RegistrationPage;
