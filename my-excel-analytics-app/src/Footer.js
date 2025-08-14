import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }} // Animation will only play once
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sheet<span className="text-green-500">Insights</span>
            </h3>
            <p className="text-sm">Your partner in data-driven success.</p>
            <div className="flex mt-4 space-x-4">
              <a
                href="#"
                className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="#"
                className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 tracking-wide">
              Products
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="features" className="hover:text-green-500 dark:hover:text-green-400 transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link to="pricing" className="hover:text-green-500 dark:hover:text-green-400 transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-green-500 dark:hover:text-green-400 transition-colors text-sm">
                  Dashboards
                </Link>
              </li>
              <li>
                <Link to="report" className="hover:text-green-500 dark:hover:text-green-400 transition-colors text-sm">
                  Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 tracking-wide">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about-us" className="hover:text-green-500 dark:hover:text-green-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-green-500 dark:hover:text-green-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="careers" className="hover:text-green-500 dark:hover:text-green-400 transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="blog" className="hover:text-green-500 dark:hover:text-green-400 transition-colors text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 tracking-wide">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="privacy-policy" className="hover:text-green-500 dark:hover:text-green-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="terms-of-service" className="hover:text-green-500 dark:hover:text-green-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="disclaimer" className="hover:text-green-500 dark:hover:text-green-400 transition-colors text-sm">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center text-sm border-t border-gray-300 dark:border-gray-700 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>
              &copy; {new Date().getFullYear()} SheetInsights. All rights reserved.
            </p>
            <div className="flex items-center space-x-2">
              <span>Developed by:</span>
              <ul className="flex space-x-3 font-medium">
                <li>
                  <a href="https://www.linkedin.com/in/rajneeshvrma/" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
                    RAJNEESH
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/developer2" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
                    TANMAY
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/developer3" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
                    LOGESH
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
                    & 3 More
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;