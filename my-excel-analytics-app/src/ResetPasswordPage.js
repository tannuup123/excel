import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEyeSlash, FaEye, FaCheckCircle } from "react-icons/fa";

// Helper component for the requirements checklist
const RequirementItem = ({ met, text }) => (
  <div className={`flex items-center transition-colors duration-300 text-sm ${met ? 'text-green-400' : 'text-red-400'}`}>
    <FaCheckCircle className="mr-2 flex-shrink-0" />
    <span>{text}</span>
  </div>
);

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    // State for password strength and requirements
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Weak', color: 'bg-red-500' });
    const [requirements, setRequirements] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
    });

    const checkPasswordStrength = (pass) => {
        let score = 0;
        const newReqs = {
            length: pass.length >= 8,
            lowercase: /[a-z]/.test(pass),
            uppercase: /[A-Z]/.test(pass),
            number: /[0-9]/.test(pass),
            special: /[\W_]/.test(pass),
        };
        setRequirements(newReqs);

        Object.values(newReqs).forEach(met => { if (met) score++; });

        let text = 'Very Weak', color = 'bg-red-500';
        if (score === 2) { text = 'Weak'; color = 'bg-orange-500'; }
        if (score === 3) { text = 'Fair'; color = 'bg-yellow-500'; }
        if (score === 4) { text = 'Good'; color = 'bg-blue-500'; }
        if (score === 5) { text = 'Strong'; color = 'bg-green-500'; }
        setPasswordStrength({ score, text, color });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        checkPasswordStrength(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!Object.values(requirements).every(Boolean)) {
            return setError("Your new password does not meet all the requirements.");
        }
        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }

        try {
            const response = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password.');
            }
            setMessage(data.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    const imageUrl = "https://wallpaperbat.com/img/7899234-excel-wallpaper-for-free-download.png";

    return (
        <div className="relative flex items-center justify-center min-h-screen px-4">
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                <div className="absolute inset-0 bg-black opacity-40"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-8 bg-white/20 dark:bg-gray-800/20 rounded-xl shadow-lg border border-white/30 dark:border-gray-700/30 backdrop-blur-lg">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-white mt-4 mb-2">Reset Password</h2>
                    <p className="text-gray-200">Enter your new password below to regain access.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            className="w-full p-3 pr-10 border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-white transition-colors placeholder-gray-600 dark:placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none"
                        >
                            {showNewPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                        </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {password && (
                        <div className="space-y-2">
                            <div className="flex w-full h-2 bg-gray-600/50 rounded-full overflow-hidden">
                                <div className={`transition-all duration-500 ${passwordStrength.color}`} style={{ width: `${passwordStrength.score * 20}%` }}></div>
                            </div>
                            <div className="text-left text-xs mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-gray-200">
                                <RequirementItem met={requirements.length} text="At least 8 characters" />
                                <RequirementItem met={requirements.uppercase} text="One uppercase letter" />
                                <RequirementItem met={requirements.lowercase} text="One lowercase letter" />
                                <RequirementItem met={requirements.number} text="One number" />
                                <RequirementItem met={requirements.special} text="One special character" />
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-3 pr-10 border border-white/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-white transition-colors placeholder-gray-600 dark:placeholder-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none"
                        >
                            {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors duration-300"
                    >
                        Reset Password
                    </button>
                </form>

                {message && (
                    <div className="mt-6 p-4 bg-green-500/20 text-green-300 rounded-lg text-center font-medium backdrop-blur-sm">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mt-6 p-4 bg-red-500/20 text-red-300 rounded-lg text-center font-medium backdrop-blur-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;