import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "./contexts/DarkModeContext";
import { FaSun, FaMoon, FaTable } from "react-icons/fa";
import Header from "./Header"; 

const TermsOfServicePage = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans leading-relaxed transition-colors duration-500">
      
      <Header />

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