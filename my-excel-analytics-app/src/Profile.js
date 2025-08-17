import React, { useState, useEffect } from 'react';
import {
    FaUserEdit,
    FaCamera,
    FaEnvelope,
    FaLock,
    FaSpinner,
    FaTimes,
    FaCheckCircle,
    FaExclamationTriangle,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';

// ✅ HELPER COMPONENT FOR PASSWORD REQUIREMENTS
const RequirementItem = ({ met, text }) => (
    <div className={`flex items-center transition-colors duration-300 text-sm ${met ? 'text-green-400' : 'text-gray-500'}`}>
        {met ? <FaCheckCircle className="mr-2 flex-shrink-0 text-green-400" /> : <FaTimes className="mr-2 flex-shrink-0 text-red-400" />}
        <span>{text}</span>
    </div>
);

// ✅ CUSTOM ALERT COMPONENT ADDED DIRECTLY IN THIS FILE
const CustomAlert = ({ message, onClose, isSuccess }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 font-sans">
            <div className={`bg-white bg-opacity-20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl max-w-sm w-full text-center p-6 transition-all duration-300 transform scale-105`}>
                <div className="flex justify-between items-center mb-4">
                    <div className={`flex items-center space-x-2 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                        {isSuccess ? <FaCheckCircle size={20} /> : <FaExclamationTriangle size={20} />}
                        <p className="text-xl font-bold">{isSuccess ? "Success" : "Error"}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FaTimes />
                    </button>
                </div>
                <p className="text-white text-lg mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className={`w-full text-white font-bold py-2 rounded-lg transition-colors duration-300 border ${isSuccess ? 'bg-green-600/40 hover:bg-green-700/50 border-green-500/50' : 'bg-red-600/40 hover:bg-red-700/50 border-red-500/50'}`}
                >
                    Close
                </button>
            </div>
        </div>
    );
};


const Profile = () => {
    // --- State Management ---
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // UI State
    const [isEditMode, setIsEditMode] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Form State
    const [fullName, setFullName] = useState('');
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Security Section State
    const [activeSecurityForm, setActiveSecurityForm] = useState(null); // 'email', 'password', or null
    const [newData, setNewData] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // ✅ FIXED: Using separate states for each input
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // OTP State
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [changeType, setChangeType] = useState('');

    // ✅ NEW: PASSWORD STRENGTH STATE
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Weak', color: 'bg-red-500' });
    const [requirements, setRequirements] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
    });

    const API_URL = "http://localhost:5000";
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    // ✅ NEW: useEffect to auto-hide the alert
    useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => {
                setAlert({ show: false, message: '', type: '' });
            }, 5000); // Hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [alert]);

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

    const fetchUserProfile = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/users/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Could not fetch profile.");
            setUser(data);
            setFullName(data.fullname);

            // Safely handle the profile picture path
            if (data.profilePicture && typeof data.profilePicture === 'string') {
                const imagePath = data.profilePicture.replace(/\\/g, '/');
                setImagePreview(`${API_URL}/${imagePath}`);
            } else {
                // Fallback to a default image if none is set
                setImagePreview(`${API_URL}/uploads/default-avatar.png`);
            }

        } catch (err) {
            // ✅ CHANGED: Use setAlert for errors
            setAlert({ show: true, message: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const clearMessages = () => {
        setAlert({ show: false, message: '', type: '' }); // Clear alerts instead
    };

    const handleEditToggle = () => {
        setIsEditMode(!isEditMode);
        clearMessages();
        if (isEditMode && user) { // When exiting edit mode (clicking "Cancel")
            setFullName(user.fullname);
            if (user.profilePicture && typeof user.profilePicture === 'string') {
                const imagePath = user.profilePicture.replace(/\\/g, '/');
                setImagePreview(`${API_URL}/${imagePath}`);
            } else {
                setImagePreview(`${API_URL}/uploads/default-avatar.png`);
            }
            setProfilePictureFile(null);
            setActiveSecurityForm(null); // Close any open security forms
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10000000) { // 10MB check
                setAlert({ show: true, message: "File is too large. Maximum size is 10MB.", type: 'error' });
                return;
            }
            clearMessages();
            setProfilePictureFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleProfileUpdate = async () => {
        const token = localStorage.getItem("token");
        // ✅ CHANGE: Replaced all setError/setSuccess with setAlert
        setAlert({ show: false, message: '', type: '' });
        setIsUpdating(true);

        try {
            let successMsg = '';

            if (fullName !== user.fullname) {
                const res = await fetch(`${API_URL}/api/users/profile`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ fullname: fullName })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to update name.");
                successMsg = data.message;
            }

            if (profilePictureFile) {
                const formData = new FormData();
                formData.append('profilePicture', profilePictureFile);

                const res = await fetch(`${API_URL}/api/users/upload-picture`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to upload picture.");
                successMsg = data.message;
            }

            if (successMsg) {
                // ✅ CHANGED: Replaced setSuccess with setAlert
                setAlert({ show: true, message: "Profile updated successfully!", type: 'success' });
                setIsEditMode(false);
                fetchUserProfile();
            } else {
                setIsEditMode(false);
            }

        } catch (err) {
            // ✅ CHANGED: Use setAlert for errors
            setAlert({ show: true, message: err.message, type: 'error' });
        } finally {
            setIsUpdating(false);
        }
    };

   // ✅ UPDATED: Now uses the correct state based on 'type'
    const handleInitiateChange = async (type) => {
        const dataToChange = type === 'email' ? newEmail : newPassword;

        if (!dataToChange) {
            setAlert({ show: true, message: `Please enter a new ${type}.`, type: 'error' });
            return;
        }
        if (type === 'password' && passwordStrength.score < 4) {
            setAlert({ show: true, message: "Password is not strong enough.", type: 'error' });
            return;
        }

        setChangeType(type);
        clearMessages();
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/users/initiate-change`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setOtpSent(true);
            setAlert({ show: true, message: data.message, type: 'success' });
            setActiveSecurityForm(null);
        } catch (err) {
            setAlert({ show: true, message: err.message, type: 'error' });
        }
    };

    // ✅ UPDATED: Now sends the correct data in the payload
    const handleVerifyChange = async (e) => {
        e.preventDefault();
        clearMessages();
        const token = localStorage.getItem("token");
        const endpoint = changeType === 'email' ? 'verify-change-email' : 'verify-change-password';
        const payload = changeType === 'email' ? { newEmail, otp } : { newPassword, otp };

        try {
            const res = await fetch(`${API_URL}/api/users/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setAlert({ show: true, message: data.message, type: 'success' });
            setOtpSent(false);
            setOtp('');
            setNewEmail('');    // Clear states on success
            setNewPassword(''); // Clear states on success
            fetchUserProfile();
        } catch (err) {
            setAlert({ show: true, message: err.message, type: 'error' });
        }
    };

    // ✅ NEW: Function to cancel the OTP verification process
    const handleCancelOtpVerification = () => {
        setOtpSent(false);
        setOtp('');
        setNewEmail('');
        setNewPassword('');
        setAlert({ show: true, message: "Update process cancelled.", type: 'error' });
    };

    if (loading) return <div>Loading Profile...</div>;

    return (
        <div className="p-6 md:p-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {alert.show && (
                <CustomAlert
                    message={alert.message}
                    isSuccess={alert.type === 'success'}
                    onClose={() => setAlert({ ...alert, show: false })}
                />
            )}
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
                    <button onClick={handleEditToggle} className={`flex items-center space-x-2 text-sm font-semibold rounded-lg px-4 py-2 transition-colors duration-300 ${isEditMode ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                        <FaUserEdit />
                        <span>{isEditMode ? "Cancel" : "Edit Profile"}</span>
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-1 flex flex-col items-center">
                            <div className="relative">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="w-40 h-40 rounded-full object-cover ring-4 ring-green-500 dark:ring-green-400" />
                                ) : (
                                    <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-4 ring-green-500">
                                        <FaSpinner className="animate-spin text-4xl text-gray-400" />
                                    </div>
                                )}
                                {isEditMode && (
                                    <label htmlFor="profile-pic-upload" className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 rounded-full p-3 cursor-pointer shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                        <FaCamera className="text-green-600 dark:text-green-400" />
                                        <input id="profile-pic-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            {isEditMode ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full text-lg p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                        <p className="text-gray-500 dark:text-gray-400 text-lg p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">{user?.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{user?.fullname}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">{user?.email}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {isEditMode && (
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                             <div className="flex justify-end">
                                <button
                                    onClick={handleProfileUpdate}
                                    disabled={isUpdating}
                                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                                >
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Security</h3>
                                <div className="space-y-4">
                                    {/* --- CHANGE EMAIL FORM --- */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                        <button onClick={() => setActiveSecurityForm(activeSecurityForm === 'email' ? null : 'email')} className="w-full flex justify-between items-center text-left font-semibold text-gray-800 dark:text-gray-200">
                                            <div className="flex items-center space-x-3">
                                                <FaEnvelope />
                                                <span>Change Email Address</span>
                                            </div>
                                            <span className={`transform transition-transform duration-300 ${activeSecurityForm === 'email' ? 'rotate-180' : ''}`}>▼</span>
                                        </button>
                                        {activeSecurityForm === 'email' && (
                                            <div className="mt-4 space-y-4">
                                                <input
                                                    type="email"
                                                    value={newEmail}
                                                    onChange={(e) => setNewEmail(e.target.value)}
                                                    placeholder="Enter new email"
                                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80 dark:bg-gray-800/80 border-gray-300/50 dark:border-gray-600/50 text-gray-800 dark:text-white"
                                                />
                                                <button onClick={() => handleInitiateChange('email')} className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                                    Send Verification Code
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* --- CHANGE PASSWORD FORM --- */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                        <button onClick={() => setActiveSecurityForm(activeSecurityForm === 'password' ? null : 'password')} className="w-full flex justify-between items-center text-left font-semibold text-gray-800 dark:text-gray-200">
                                            <div className="flex items-center space-x-3">
                                                <FaLock />
                                                <span>Change Password</span>
                                            </div>
                                            <span className={`transform transition-transform duration-300 ${activeSecurityForm === 'password' ? 'rotate-180' : ''}`}>▼</span>
                                        </button>
                                        {activeSecurityForm === 'password' && (
                                            <div className="mt-4 space-y-4">
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={newPassword}
                                                        onChange={(e) => {
                                                            setNewPassword(e.target.value);
                                                            checkPasswordStrength(e.target.value);
                                                        }}
                                                        placeholder="Enter new password"
                                                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80 dark:bg-gray-800/80 border-gray-300/50 dark:border-gray-600/50 text-gray-800 dark:text-white"
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </button>
                                                </div>

                                                {newPassword && (
                                                    <div>
                                                        <div className="flex w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden mt-2">
                                                            <div className={`transition-all duration-500 ${passwordStrength.color}`} style={{ width: `${passwordStrength.score * 20}%` }}></div>
                                                        </div>
                                                        <p className="text-xs mt-1 text-left font-bold text-gray-600 dark:text-gray-300">
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

                                                <button onClick={() => handleInitiateChange('password')} className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                                    Send Verification Code
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {otpSent && (
                    <div className="mt-8 max-w-lg mx-auto">
                        <form onSubmit={handleVerifyChange} className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                            <h4 className="font-semibold text-center text-xl text-gray-800 dark:text-gray-100">Verify Your Identity</h4>
                            <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-2">An OTP has been sent to your email.</p>
                            <div className="mt-6">
                                <label htmlFor="otp" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200 text-center">Enter OTP</label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-center tracking-widest text-lg"
                                    placeholder="_ _ _ _ _ _"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mt-6">
                                <button type="button" onClick={handleCancelOtpVerification} className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                                    Verify & Update {changeType}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="mt-10 text-center">
                    <button onClick={() => setIsContactModalOpen(true)} className="text-sm text-gray-500 dark:text-gray-400 hover:underline">Contact Us</button>
                </div>

                {isContactModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={() => setIsContactModalOpen(false)}>
                        <div className="bg-white bg-opacity-20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8 w-full max-w-md text-white" onClick={e => e.stopPropagation()}>
                            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                            <p className="text-gray-200">If you need help, please email us at:</p>
                            <a href="mailto:support@example.com" className="text-indigo-300 font-semibold text-lg hover:underline block my-2">support@example.com</a>
                            <button
                                onClick={() => setIsContactModalOpen(false)}
                                className="w-full mt-6 p-2 bg-gray-600/40 hover:bg-gray-700/50 border border-gray-500/50 rounded-md transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;