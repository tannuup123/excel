import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaTable, FaShieldAlt, FaTools, FaQuoteLeft, FaCheck, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaSun, FaMoon } from 'react-icons/fa';

const CompanyLogo = ({ name }) => (
  <div className="text-gray-400 dark:text-gray-500 text-2xl font-semibold opacity-70 hover:opacity-100 transition-opacity duration-300">
    {name}
  </div>
);

const LandingPage = () => {
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
          <a href="#features" className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300">Features</a>
          <a href="#how-it-works" className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300">How It Works</a>
          <a href="#pricing" className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300">Pricing</a>
          <a href="#testimonials" className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300">Testimonials</a>
          <a href="#faq" className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300">FAQ</a>
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

      {/* Hero Section */}
      <section className="min-h-screen flex items-center bg-cover bg-center pt-20"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}>
        <div className="bg-gray-900 dark:bg-white bg-opacity-70 dark:bg-opacity-70 w-full min-h-screen flex items-center justify-center transition-colors duration-500">
          <div className="max-w-5xl mx-auto px-6 text-center text-white dark:text-gray-900">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-md">
              Unlock the <span className="text-blue-400 dark:text-blue-600">Hidden Potential</span> of Your Excel Data
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-sm">
              Our advanced platform helps you effortlessly visualize, analyze, and automate reports from your spreadsheets, so you can focus on what matters.
            </p>
            <Link 
              to="/register" 
              className="bg-green-500 text-white text-lg px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-colors duration-300 shadow-lg transform hover:scale-105"
            >
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-gray-800 dark:bg-gray-200 text-center transition-colors duration-500">
        <div className="container mx-auto px-6">
          <h3 className="text-xl font-semibold text-gray-400 dark:text-gray-600 mb-8">Trusted by data teams at leading companies</h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <CompanyLogo name="TechCorp" />
            <CompanyLogo name="Innovate Inc." />
            <CompanyLogo name="DataFlow" />
            <CompanyLogo name="Global Solutions" />
            <CompanyLogo name="Future Labs" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900 dark:bg-white transition-colors duration-500">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-4">Features Built for Data Professionals</h2>
          <p className="text-lg text-gray-400 dark:text-gray-600 mb-12 max-w-3xl mx-auto">
            From seamless data import to collaborative sharing, our tools are designed to streamline your workflow and boost productivity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-gray-800 dark:bg-gray-200 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
              <FaChartLine className="text-5xl text-blue-400 dark:text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">Dynamic Dashboards</h3>
              <p className="text-gray-400 dark:text-gray-600">Build beautiful, interactive dashboards and visualize your data without complex coding.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-gray-800 dark:bg-gray-200 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
              <FaTable className="text-5xl text-green-400 dark:text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">Effortless Data Import</h3>
              <p className="text-gray-400 dark:text-gray-600">Import your .xlsx and .csv files with a single click and start analyzing instantly.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-gray-800 dark:bg-gray-200 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
              <FaTools className="text-5xl text-purple-400 dark:text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-400 dark:text-gray-600">Use our powerful tools to uncover trends, forecast future outcomes, and make smarter decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-800 dark:bg-gray-200 transition-colors duration-500">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-400 dark:text-gray-600 mb-12">
            Our platform simplifies the entire process in three easy steps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            {/* Step 1 */}
            <div>
              <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Excel File Upload" className="rounded-lg shadow-xl mb-4 h-64 w-full object-cover" />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">1. Upload Your Data</h3>
              <p className="text-gray-400 dark:text-gray-600">Securely upload your Excel files from your local machine or cloud storage.</p>
            </div>
            {/* Step 2 */}
            <div>
              <img src="https://images.unsplash.com/photo-1605379399843-5870eea9b7be?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Data Visualization" className="rounded-lg shadow-xl mb-4 h-64 w-full object-cover" />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">2. Analyze & Visualize</h3>
              <p className="text-gray-400 dark:text-gray-600">Use our drag-and-drop interface to build powerful visualizations.</p>
            </div>
            {/* Step 3 */}
            <div>
              <img src="https://images.unsplash.com/photo-1549923746-c502d488b317?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Team Collaboration" className="rounded-lg shadow-xl mb-4 h-64 w-full object-cover" />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">3. Share & Collaborate</h3>
              <p className="text-gray-400 dark:text-gray-600">Share live dashboards with your team and make collaborative decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-900 dark:bg-white transition-colors duration-500">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-400 dark:text-gray-600 mb-12">
            Choose a plan that scales with your team's needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Basic Plan */}
            <div className="bg-gray-800 dark:bg-gray-200 p-8 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-4">Basic</h3>
                <div className="text-white dark:text-gray-900 text-5xl font-bold mb-4">$19<span className="text-lg text-gray-400 dark:text-gray-600 font-normal">/month</span></div>
                <ul className="text-gray-300 dark:text-gray-700 mb-6 list-none space-y-2 text-left">
                  <li className="flex items-center"><FaCheck className="text-green-400 mr-2" />Up to 5 Excel Files</li>
                  <li className="flex items-center"><FaCheck className="text-green-400 mr-2" />Basic Visualizations</li>
                  <li className="flex items-center"><FaCheck className="text-green-400 mr-2" />Standard Support</li>
                </ul>
              </div>
              <Link to="/register" className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors duration-300 mt-auto">Get Started</Link>
            </div>
            {/* Pro Plan - Highlighted */}
            <div className="bg-gray-700 dark:bg-gray-300 p-10 rounded-2xl shadow-2xl transform scale-105 border-2 border-blue-400 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-4">Pro</h3>
                <div className="text-white dark:text-gray-900 text-5xl font-bold mb-4">$49<span className="text-lg text-gray-400 dark:text-gray-600 font-normal">/month</span></div>
                <ul className="text-gray-300 dark:text-gray-700 mb-6 list-none space-y-2 text-left">
                  <li className="flex items-center"><FaCheck className="text-green-400 mr-2" />Unlimited Excel Files</li>
                  <li className="flex items-center"><FaCheck className="text-green-400 mr-2" />Advanced Visualizations</li>
                  <li className="flex items-center"><FaCheck className="text-green-400 mr-2" />Advanced Analytics</li>
                  <li className="flex items-center"><FaCheck className="text-green-400 mr-2" />Team Collaboration</li>
                </ul>
              </div>
              <Link to="/register" className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300 mt-auto">Upgrade Now</Link>
            </div>
            {/* Enterprise Plan */}
            <div className="bg-gray-800 dark:bg-gray-200 p-8 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-4">Enterprise</h3>
                <div className="text-white dark:text-gray-900 text-5xl font-bold mb-4">Custom</div>
                <ul className="text-gray-300 dark:text-gray-700 mb-6 list-none space-y-2 text-left">
                  <li className="flex items-center"><FaCheck className="text-green-400 mr-2" />Custom Solutions</li>
                  <li className="flex items-center"><FaCheck className="text-green-400 mr-2" />Dedicated Support</li>
                  <li className="flex items-center"><FaCheck className="text-green-400 mr-2" />Scalable Infrastructure</li>
                  <li className="flex items-center"><FaCheck className="text-green-400 mr-2" />Advanced Security</li>
                </ul>
              </div>
              <a href="#contact" className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-600 transition-colors duration-300 mt-auto">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-800 dark:bg-gray-200 text-center transition-colors duration-500">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-400 dark:text-gray-600 mb-12">
            Hear from our users about how our platform has transformed their data workflow.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Testimonial 1 */}
            <div className="bg-gray-900 dark:bg-white p-8 rounded-2xl shadow-xl text-left">
              <FaQuoteLeft className="text-4xl text-blue-400 dark:text-blue-600 mb-4" />
              <p className="italic text-gray-300 dark:text-gray-700 mb-4">"The best tool for turning our chaotic spreadsheets into clean, insightful dashboards. The automation feature is a lifesaver!"</p>
              <div className="flex items-center">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Customer Jane Doe" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-semibold text-white dark:text-gray-900">Jane Doe</p>
                  <p className="text-sm text-gray-400 dark:text-gray-600">Data Analyst at Global Solutions</p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-gray-900 dark:bg-white p-8 rounded-2xl shadow-xl text-left">
              <FaQuoteLeft className="text-4xl text-green-400 dark:text-green-600 mb-4" />
              <p className="italic text-gray-300 dark:text-gray-700 mb-4">"I used to spend hours manually updating reports. Now, I just upload my Excel file and everything is done automatically. Highly recommended!"</p>
              <div className="flex items-center">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Customer John Smith" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-semibold text-white dark:text-gray-900">John Smith</p>
                  <p className="text-sm text-gray-400 dark:text-gray-600">Operations Manager at Innovate Inc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-900 dark:bg-white transition-colors duration-500">
          <div className="container mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-400 dark:text-gray-600 mb-12">
                  Find answers to the most common questions about our platform.
              </p>
              <div className="max-w-4xl mx-auto space-y-4 text-left">
                  <div className="bg-gray-800 dark:bg-gray-200 p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-semibold text-white dark:text-gray-900">How do I get started?</h3>
                      <p className="text-gray-400 dark:text-gray-600 mt-2">
                          Simply click on the "Start Your Free Trial" button, register for an account, and you can start uploading your Excel files right away.
                      </p>
                  </div>
                  <div className="bg-gray-800 dark:bg-gray-200 p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-semibold text-white dark:text-gray-900">What file formats are supported?</h3>
                      <p className="text-gray-400 dark:text-gray-600 mt-2">
                          We support standard Excel file formats (.xlsx, .xls) and also comma-separated values (.csv) files.
                      </p>
                  </div>
                  <div className="bg-gray-800 dark:bg-gray-200 p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-semibold text-white dark:text-gray-900">Is my data secure?</h3>
                      <p className="text-gray-400 dark:text-gray-600 mt-2">
                          Yes, we use industry-standard encryption and security protocols to ensure your data is always safe and confidential.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-500 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Data Workflow?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Join thousands of professionals who are already making data-driven decisions. Sign up today and get a free trial.
          </p>
          <Link 
            to="/register" 
            className="bg-white text-blue-600 text-lg px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors duration-300 shadow-lg transform hover:scale-105"
          >
            Start Your Free Trial
          </Link>
        </div>
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

export default LandingPage;