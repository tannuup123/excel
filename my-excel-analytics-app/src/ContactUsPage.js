import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "./contexts/DarkModeContext";
import {
  FaSun,
  FaMoon,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTable,
} from "react-icons/fa";

const ContactPage = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted!", formData);
    alert("Thank you for your message! We will get back to you shortly.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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
          <Link to="/about-us" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">About Us</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
          </button>
          <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors">Register</Link>
        </div>
      </header>

      <section className="py-10 bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-5xl pt-24">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12">We'd love to hear from you. Send us a message or find our contact details below.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border-transparent focus:border-blue-500 focus:ring-blue-500" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border-transparent focus:border-blue-500 focus:ring-blue-500" required />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                  <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border-transparent focus:border-blue-500 focus:ring-blue-500" required />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border-transparent focus:border-blue-500 focus:ring-blue-500" required></textarea>
                </div>
                <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition-colors duration-300">Send Message</button>
              </form>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Details</h3>
                <p className="text-gray-600 dark:text-gray-400">You can also reach us through these channels.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-blue-500 text-2xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Address</h4>
                    <p className="text-gray-600 dark:text-gray-400">123 Data Street, Analytics City, 10001, USA</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaEnvelope className="text-blue-500 text-2xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                    <p className="text-gray-600 dark:text-gray-400"><a href="mailto:info@excelanalytics.com" className="hover:underline">info@excelanalytics.com</a></p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaPhone className="text-blue-500 text-2xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-400"><a href="tel:+1234567890" className="hover:underline">+1 (234) 567-890</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;