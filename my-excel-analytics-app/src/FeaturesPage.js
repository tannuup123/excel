import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaSun, FaMoon, FaChartLine, FaCloudUploadAlt, FaCube, FaDownload, FaMicrochip, FaUsersCog, FaUserShield } from 'react-icons/fa';

const FeaturesPage = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="bg-gray-900 dark:bg-gray-100 text-gray-100 dark:text-gray-900 font-sans leading-relaxed transition-colors duration-500">
      
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 py-4 px-6 md:px-12 flex justify-between items-center bg-gray-800 dark:bg-white bg-opacity-90 dark:bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-lg transition-colors duration-500">
        <div className="text-2xl font-bold text-blue-400">
          Excel<span className="text-green-400">Analytics</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300">Home</Link>
          <Link to="/about" className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300">About Us</Link>
          <Link to="/features" className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300">Features</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-2 rounded-full text-gray-300 dark:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors duration-300">
            {theme === 'dark' ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
          </button>
          <Link to="/login" className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300">Login</Link>
          <Link 
            to="/register" 
            className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors duration-300"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Features Hero Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-100 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-5xl pt-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white dark:text-gray-900 mb-4">
            Powerful Features for Data Analysis
          </h1>
          <p className="text-lg text-gray-400 dark:text-gray-600 max-w-2xl mx-auto">
            Transform your Excel data into stunning 2D and 3D visualizations with our intuitive platform.
          </p>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-12 bg-gray-800 dark:bg-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-3xl font-bold text-white dark:text-gray-900 text-center mb-10">All-in-One Data Visualization Tool</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature Card 1: Excel Upload */}
            <div className="bg-gray-900 dark:bg-white p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105 duration-300">
              <FaCloudUploadAlt className="text-5xl text-blue-400 dark:text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white dark:text-gray-900 mb-2">Seamless Excel Upload</h3>
              <p className="text-gray-400 dark:text-gray-600">
                Effortlessly upload any .xls or .xlsx file to our platform for instant data analysis.
              </p>
            </div>
            
            {/* Feature Card 2: Interactive Charts */}
            <div className="bg-gray-900 dark:bg-white p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105 duration-300">
              <FaChartLine className="text-5xl text-green-400 dark:text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white dark:text-gray-900 mb-2">Interactive 2D & 3D Charts</h3>
              <p className="text-gray-400 dark:text-gray-600">
                Generate dynamic 2D and 3D visualizations with customizable X and Y axes directly from your data.
              </p>
            </div>
            
            {/* Feature Card 3: Downloadable Graphs */}
            <div className="bg-gray-900 dark:bg-white p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105 duration-300">
              <FaDownload className="text-5xl text-purple-400 dark:text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white dark:text-gray-900 mb-2">Downloadable Visuals</h3>
              <p className="text-gray-400 dark:text-gray-600">
                Easily download your generated graphs and charts in various formats for presentations and reports.
              </p>
            </div>
            
            {/* Feature Card 4: AI Insights */}
            <div className="bg-gray-900 dark:bg-white p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105 duration-300">
              <FaMicrochip className="text-5xl text-orange-400 dark:text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white dark:text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-400 dark:text-gray-600">
                Get smart insights and summary reports from your data using our optional AI integration.
              </p>
            </div>
            
            {/* Feature Card 5: User Dashboard */}
            <div className="bg-gray-900 dark:bg-white p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105 duration-300">
              <FaUserShield className="text-5xl text-red-400 dark:text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white dark:text-gray-900 mb-2">Personalized Dashboard</h3>
              <p className="text-gray-400 dark:text-gray-600">
                Your entire history of uploads and analysis is securely saved and visible on your personal dashboard.
              </p>
            </div>
            
            {/* Feature Card 6: Admin Management */}
            <div className="bg-gray-900 dark:bg-white p-6 rounded-2xl shadow-lg text-center transition-transform hover:scale-105 duration-300">
              <FaUsersCog className="text-5xl text-blue-300 dark:text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white dark:text-gray-900 mb-2">Admin Panel</h3>
              <p className="text-gray-400 dark:text-gray-600">
                Admins have full control to manage users and monitor data usage across the platform.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-800 py-16 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Visualize Your Data?</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Sign up today and turn your Excel sheets into actionable insights with powerful visualizations.
        </p>
        <Link to="/register" className="bg-white text-blue-600 dark:text-blue-800 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors duration-300">
          Start Your Free Trial
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-800 dark:bg-gray-200 text-gray-400 dark:text-gray-600 transition-colors duration-500">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">Excel<span className="text-green-400">Analytics</span></h3>
            <p className="text-sm">Your partner in data-driven success.</p>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300"><FaFacebook /></a>
              <a href="#" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300"><FaTwitter /></a>
              <a href="#" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300"><FaLinkedin /></a>
              <a href="#" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300"><FaInstagram /></a>
            </div>
          </div>
          {/* Products */}
          <div>
            <h4 className="font-semibold text-white dark:text-gray-900 mb-4">Products</h4>
            <ul>
              <li><Link to="features" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm">Features</Link></li>
              <li><Link to="pricing" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm">Pricing</Link></li>
              <li><Link to="dashboard" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm">Dashboards</Link></li>
              <li><Link to="report" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm">Reports</Link></li>
            </ul>
          </div>
          {/* Company */}
          <div>
            <h4 className="font-semibold text-white dark:text-gray-900 mb-4">Company</h4>
            <ul>
              <li><Link to="/about-us" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm">About Us</Link></li>
              
              {/* <li><a href="#" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm">About Us</a></li> */}
              <li><Link to="contact-us" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm">Contact</Link></li>
              <li><Link to="careers" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm">Careers</Link></li>
              <li><Link to="blog" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm">Blog</Link></li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white dark:text-gray-900 mb-4">Legal</h4>
            <ul>
              <li><Link to="privacy-policy" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm">Privacy Policy</Link></li>
              <li><Link to="terms-of-service" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm">Terms of Service</Link></li>
              <li><Link to="disclaimer" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300 text-sm">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm border-t border-gray-700 dark:border-gray-300 pt-6">
          <p>&copy; {new Date().getFullYear()} ExcelAnalytics. All rights reserved.</p>
        </div>
      </footer>
      
    </div>
  );
};

export default FeaturesPage;