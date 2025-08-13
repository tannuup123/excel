import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const [key, setKey] = useState(0);

  return (
    <div className="bg-gray-800 dark:bg-gray-200">
      <motion.footer
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        onViewportEnter={() => setKey((prev) => prev + 1)}
        transition={{ duration: 0.6 }}
        className="py-12 bg-gray-800 dark:bg-gray-200 text-gray-400 dark:text-gray-600 transition-colors duration-500"
      >
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">
              Excel<span className="text-green-400">Analytics</span>
            </h3>
            <p className="text-sm">Your partner in data-driven success.</p>
            <div className="flex mt-4 space-x-4">
              <a
                href="#"
                className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
              >
                <FaLinkedin />
              </a>
              <a
                href="#"
                className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
          {/* Products */}
          <div>
            <h4 className="font-semibold text-white dark:text-gray-900 mb-4">
              Products
            </h4>
            <ul>
              <li>
                <Link
                  to="features"
                  className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="pricing"
                  className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm"
                >
                  Dashboards
                </Link>
              </li>
              <li>
                <Link
                  to="report"
                  className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm"
                >
                  Reports
                </Link>
              </li>
            </ul>
          </div>
          {/* Company */}
          <div>
            <h4 className="font-semibold text-white dark:text-gray-900 mb-4">
              Company
            </h4>
            <ul>
              <li>
                <Link
                  to="/about-us"
                  className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="careers"
                  className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="blog"
                  className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white dark:text-gray-900 mb-4">
              Legal
            </h4>
            <ul>
              <li>
                <Link
                  to="privacy-policy"
                  className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="terms-of-service"
                  className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="disclaimer"
                  className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm border-t border-gray-700 dark:border-gray-300 pt-6">
          <div className="flex justify-between items-center px-4">
            <p>
              &copy; {new Date().getFullYear()} ExcelAnalytics. All rights
              reserved.
            </p>
            <div className="flex items-center space-x-4">
              <p>Developed by:</p>
              <ul className="flex space-x-4">
                <li>
                  <a
                    href="https://www.linkedin.com/in/rajneeshvrma/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 transition-colors"
                  >
                    RAJNEESH
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/developer2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 transition-colors"
                  >
                    TANMAY
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/developer3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 transition-colors"
                  >
                    LOGESH
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Footer;
