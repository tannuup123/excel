import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaSun,
  FaMoon,
  FaTable,
} from "react-icons/fa";

const CompanyLogo = ({ name }) => (
  <div className="text-gray-400 dark:text-gray-500 text-2xl font-semibold opacity-70 hover:opacity-100 transition-opacity duration-300">
    {name}
  </div>
);

const TermsOfServicePage = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-900 dark:bg-gray-100 text-gray-100 dark:text-gray-900 font-sans leading-relaxed transition-colors duration-500">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 py-4 px-6 md:px-12 flex justify-between items-center bg-gray-800 dark:bg-white bg-opacity-90 dark:bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-lg transition-colors duration-500">
        <div className="flex items-center space-x-2">
          <div className="text-green-600 dark:text-green-400 cursor-pointer select-none">
            <FaTable className="text-4xl" />
          </div>

          <span className="text-2xl font-bold truncate ml-2">
            <span className="text-white dark:text-black">Sheet</span>{" "}
            <span className="text-green-500">Insights</span>
          </span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-300 dark:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors duration-300"
          >
            {theme === "dark" ? (
              <FaSun className="h-5 w-5" />
            ) : (
              <FaMoon className="h-5 w-5" />
            )}
          </button>
          <Link
            to="/login"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors duration-300"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Terms of Service Content Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-100 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-5xl pt-16">
          <h1 className="text-4xl font-bold text-white dark:text-gray-900 text-center mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-400 dark:text-gray-600 text-center mb-12">
            Last updated: August 8, 2025
          </p>

          <div className="space-y-8 text-gray-300 dark:text-gray-700">
            <p>
              Welcome to ExcelAnalytics. These terms and conditions ("Terms")
              govern your use of the ExcelAnalytics website and services. By
              accessing or using our services, you agree to be bound by these
              Terms.
            </p>

            <div>
              <h2 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By creating an account or using our services, you confirm that
                you have read, understood, and agree to be bound by these Terms.
                If you do not agree with any part of these Terms, you may not
                use our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                2. User Accounts
              </h2>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>
                  You must be at least 18 years of age to use our services.
                </li>
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account password and are fully responsible for all
                  activities that occur under your account.
                </li>
                <li>
                  You agree to notify us immediately of any unauthorized use of
                  your account.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                3. Intellectual Property
              </h2>
              <p>
                The content, features, and functionality of our service,
                including all information, software, text, graphics, and logos,
                are and will remain the exclusive property of ExcelAnalytics and
                its licensors. Our trademarks may not be used without the prior
                written consent of ExcelAnalytics.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                4. User Conduct
              </h2>
              <p>
                You agree not to use the Service in any way that is unlawful,
                harmful, or fraudulent. Prohibited activities include, but are
                not limited to, unauthorized access to our systems, distribution
                of malware, or engaging in any activity that interferes with the
                proper functioning of the Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                5. Disclaimer of Warranties
              </h2>
              <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
                We make no warranties, express or implied, regarding the
                Service's reliability, accuracy, or availability.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                6. Limitation of Liability
              </h2>
              <p>
                In no event shall ExcelAnalytics, its directors, employees, or
                partners be liable for any indirect, incidental, special,
                consequential, or punitive damages, including loss of profits,
                data, or other intangible losses, resulting from your use of the
                Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                7. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of [Your Jurisdiction], without regard to its
                conflict of law provisions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                8. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify or replace these Terms at any
                time. We will provide at least 30 days' notice before any new
                terms take effect. By continuing to access or use our Service
                after those revisions become effective, you agree to be bound by
                the revised terms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfServicePage;
