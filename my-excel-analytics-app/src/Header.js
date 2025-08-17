import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { DarkModeContext } from './contexts/DarkModeContext';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa'; // Import FaBars and FaTimes for the menu icon

const Header = () => {
    const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
    const { token, userRole, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control the mobile menu

    const getDashboardPath = () => {
        switch (userRole) {
            case 'admin': return '/admin-dashboard';
            case 'super-admin': return '/super-admin';
            default: return '/user-dashboard';
        }
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false); // Close menu on logout
        navigate("/", { replace: true });
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about-us' },
        { name: 'Features', path: '/features' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Contact', path: '/contact-us' },
        { name: 'Careers', path: '/careers' },
        { name: 'Blog', path: '/blog' }
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 py-4 px-6 md:px-12 flex justify-between items-center bg-white/80 dark:bg-gray-900/80 backdrop-filter backdrop-blur-lg shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-500">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center space-x-2">
                    <img src="/Sheet insights favicon.png" alt="SheetInsights" className="w-10 h-10 object-contain" />
                    <span className="text-2xl font-bold truncate ml-2">
                        <span className="text-black dark:text-white">Sheet</span>
                        <span className="text-green-500">Insights</span>
                    </span>
                </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
                {navLinks.map(link => (
                    <Link key={link.name} to={link.path} className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">{link.name}</Link>
                ))}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
                <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                    {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
                </button>
                {token ? (
                    <>
                        <Link to={getDashboardPath()} className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors">Dashboard</Link>
                        <button onClick={handleLogout} className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">Login</Link>
                        <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors">Register</Link>
                    </>
                )}
            </div>

            {/* Mobile Menu Button (Hamburger) */}
            <div className="md:hidden flex items-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 dark:text-gray-300">
                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>
            
            {/* Mobile Menu Panel */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-xl">
                    <nav className="flex flex-col items-center space-y-4 p-6">
                        {navLinks.map(link => (
                            <Link key={link.name} to={link.path} className="text-gray-700 dark:text-gray-300" onClick={() => setIsMenuOpen(false)}>{link.name}</Link>
                        ))}
                        <div className="border-t border-gray-200 dark:border-gray-700 w-full my-4"></div>
                        <div className="flex flex-col items-center space-y-4">
                            {token ? (
                                <>
                                    <Link to={getDashboardPath()} className="bg-green-500 text-white w-full text-center px-4 py-2 rounded-full font-semibold" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                                    <button onClick={handleLogout} className="text-gray-700 dark:text-gray-300">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-700 dark:text-gray-300" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                    <Link to="/register" className="bg-green-500 text-white w-full text-center px-4 py-2 rounded-full font-semibold" onClick={() => setIsMenuOpen(false)}>Register</Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;