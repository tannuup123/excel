import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaTable, FaUsers, FaArrowRight } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg p-4 flex justify-between items-center fixed w-full z-10 top-0">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-800">Excel Analytics</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</Link>
          <Link to="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</Link>
          <Link to="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Integrations</Link>
          <Link to="#" className="text-gray-600 hover:text-indigo-600 transition-colors">About Us</Link>
          <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-32 px-6 text-center mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">Unlock Deeper Insights from Your Excel Data</h1>
          <p className="text-lg md:text-xl mb-8">Powerful analytics and intuitive dashboards designed for the modern business.</p>
          <Link to="/register" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors">
            Get Started Free
          </Link>
        </div>
      </header>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Our Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <FaChartBar className="text-indigo-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Dashboards</h3>
              <p className="text-gray-600">Visualize your data with custom dashboards and interactive charts.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <FaTable className="text-indigo-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Seamless Excel Integration</h3>
              <p className="text-gray-600">Connect directly to your Excel files for real-time analysis.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <FaUsers className="text-indigo-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">Share your reports and collaborate with your team effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-indigo-600 text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Data?</h2>
          <p className="text-lg mb-8">Join thousands of users who are making smarter decisions with our platform.</p>
          <Link to="/register" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors">
            Start Your Free Trial <FaArrowRight className="inline-block ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center md:flex md:justify-between md:items-center">
          <p className="mb-4 md:mb-0">&copy; 2024 Excel Analytics. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;