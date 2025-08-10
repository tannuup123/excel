import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const CompanyLogo = ({ name }) => (
  <div className="text-gray-400 dark:text-gray-500 text-2xl font-semibold opacity-70 hover:opacity-100 transition-opacity duration-300">
    {name}
  </div>
);

const DisclaimerPage = () => {
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
        <div className="text-2xl font-bold text-blue-400">
          Excel<span className="text-green-400">Analytics</span>
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

      {/* Disclaimer Content Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-100 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-5xl pt-16">
          <h1 className="text-4xl font-bold text-white dark:text-gray-900 text-center mb-4">
            Disclaimer
          </h1>
          <p className="text-lg text-gray-400 dark:text-gray-600 text-center mb-12">
            Effective: August 8, 2025
          </p>

          <div className="space-y-8 text-gray-300 dark:text-gray-700">
            <p>
              The information provided by ExcelAnalytics ("we," "us," or "our")
              on our website is for general informational purposes only. All
              information on the Site is provided in good faith, however, we
              make no representation or warranty of any kind, express or
              implied, regarding the accuracy, adequacy, validity, reliability,
              availability, or completeness of any information on the Site.
            </p>

            <div>
              <h2 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                1. External Links Disclaimer
              </h2>
              <p>
                The Site may contain links to other websites or content
                belonging to or originating from third parties. Such external
                links are not investigated, monitored, or checked for accuracy,
                adequacy, validity, reliability, availability, or completeness
                by us. We do not warrant, endorse, guarantee, or assume
                responsibility for the accuracy or reliability of any
                information offered by third-party websites linked through the
                Site.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                2. Professional Advice Disclaimer
              </h2>
              <p>
                The information provided by the Service is not a substitute for
                professional advice. The use or reliance of any information
                contained on this site is solely at your own risk. The
                information is not intended to be a substitute for professional
                legal, financial, or other advice.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                3. Limitation of Liability
              </h2>
              <p>
                Under no circumstance shall we have any liability to you for any
                loss or damage of any kind incurred as a result of the use of
                the site or reliance on any information provided on the site.
                Your use of the site and your reliance on any information on the
                site is solely at your own risk.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                4. Changes to this Disclaimer
              </h2>
              <p>
                We may update this Disclaimer from time to time. The updated
                version will be indicated by an updated "Effective" date and
                will be effective as soon as it is accessible. We encourage you
                to review this Disclaimer frequently to be informed of how we
                are protecting your information.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DisclaimerPage;
