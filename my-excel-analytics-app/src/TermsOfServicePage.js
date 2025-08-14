import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "./contexts/DarkModeContext";
import { FaSun, FaMoon, FaTable } from "react-icons/fa";

const TermsOfServicePage = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans leading-relaxed transition-colors duration-500">
      <header className="fixed top-0 left-0 w-full z-50 py-4 px-6 md:px-12 flex justify-between items-center bg-white/75 dark:bg-gray-900/75 backdrop-filter backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-500">
        <div className="flex items-center space-x-2">
          <img src="/Sheet insights favicon.png" alt="SheetInsights" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold truncate ml-2">
            <span className="text-black dark:text-white">Sheet</span>
            <span className="text-green-500">Insights</span>
          </span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Home</Link>
          <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">About Us</Link>
          <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
          </button>
          <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors">Register</Link>
        </div>
      </header>

      <section className="py-20 bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-4xl pt-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12">Last updated: August 8, 2025</p>
          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-loose">
            <p>Welcome to Sheet Insights. These terms and conditions ("Terms") govern your use of the Sheet Insights website and services. By accessing or using our services, you agree to be bound by these Terms.</p>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">1. Acceptance of Terms</h2>
              <p>By creating an account or using our services, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not use our services.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">2. User Accounts</h2>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>You must be at least 18 years of age to use our services.</li>
                <li>You are responsible for maintaining the confidentiality of your account password and are fully responsible for all activities that occur under your account.</li>
                <li>You agree to notify us immediately of any unauthorized use of your account.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">3. Intellectual Property</h2>
              <p>The content, features, and functionality of our service, including all information, software, text, graphics, and logos, are and will remain the exclusive property of Sheet Insights and its licensors. Our trademarks may not be used without the prior written consent of Sheet Insights.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">4. User Conduct</h2>
              <p>You agree not to use the Service in any way that is unlawful, harmful, or fraudulent. Prohibited activities include, but are not limited to, unauthorized access to our systems, distribution of malware, or engaging in any activity that interferes with the proper functioning of the Service.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">5. Disclaimer of Warranties</h2>
              <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding the Service's reliability, accuracy, or availability.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">6. Limitation of Liability</h2>
              <p>In no event shall Sheet Insights, its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from your use of the Service.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">7. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">8. Changes to Terms</h2>
              <p>We reserve the right to modify or replace these Terms at any time. We will provide at least 30 days' notice before any new terms take effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfServicePage;