import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaSun, FaMoon, FaCheck } from 'react-icons/fa';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-700 dark:border-gray-300 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-white dark:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className="text-2xl">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-400 dark:text-gray-600 transition-all duration-300">{answer}</p>
      )}
    </div>
  );
};

const PricingPage = () => {
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

  const faqs = [
    { question: "Can I change my plan later?", answer: "Yes, you can upgrade or downgrade your plan at any time directly from your dashboard settings." },
    { question: "Do you offer a free trial?", answer: "Yes, we offer a 14-day free trial on our Pro plan with no credit card required. You can sign up and start exploring the features." },
    { question: "What is the difference between Starter and Pro?", answer: "The Starter plan is great for individuals, while the Pro plan offers more advanced features like 3D charts, AI insights, and increased storage for teams." },
    { question: "How does billing work?", answer: "You will be billed monthly or annually, depending on your chosen plan. All payments are processed securely via Stripe or PayPal." },
  ];

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
          <Link to="/pricing" className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300">Pricing</Link>
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

      {/* Pricing Hero Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-100 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-5xl pt-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white dark:text-gray-900 mb-4">
            Simple & Transparent Pricing
          </h1>
          <p className="text-lg text-gray-400 dark:text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for you and get started with a free trial on our most popular plan.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-12 bg-gray-800 dark:bg-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Plan 1: Starter */}
            <div className="bg-gray-900 dark:bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-400 dark:text-gray-600">Perfect for individuals just starting out.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white dark:text-gray-900">$9</span>
                  <span className="text-lg text-gray-400 dark:text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-gray-300 dark:text-gray-700">
                  <li className="flex items-center"><FaCheck className="text-green-400 dark:text-green-600 mr-2" /><span>2D Chart Generation</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-400 dark:text-green-600 mr-2" /><span>50 Uploads/month</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-400 dark:text-green-600 mr-2" /><span>Basic Dashboard</span></li>
                </ul>
              </div>
              <Link to="/register" className="block text-center w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300">
                Get Started
              </Link>
            </div>
            
            {/* Plan 2: Pro (Most Popular) */}
            <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between transform scale-105">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                </div>
                <p className="text-gray-200">The best choice for small teams and power users.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold">$29</span>
                  <span className="text-lg text-gray-200">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-gray-100">
                  <li className="flex items-center"><FaCheck className="text-green-300 mr-2" /><span>Everything in Starter</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-300 mr-2" /><span>Unlimited Uploads</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-300 mr-2" /><span>Interactive 3D Charts</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-300 mr-2" /><span>AI-Powered Insights</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-300 mr-2" /><span>Priority Support</span></li>
                </ul>
              </div>
              <Link to="/register" className="block text-center w-full bg-white text-blue-600 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300">
                Start Your Free Trial
              </Link>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="bg-gray-900 dark:bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-400 dark:text-gray-600">Tailored solutions for large organizations.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white dark:text-gray-900">Custom</span>
                  <span className="text-lg text-gray-400 dark:text-gray-600">/quote</span>
                </div>
                <ul className="space-y-3 mb-8 text-gray-300 dark:text-gray-700">
                  <li className="flex items-center"><FaCheck className="text-green-400 dark:text-green-600 mr-2" /><span>Everything in Pro</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-400 dark:text-green-600 mr-2" /><span>Dedicated Account Manager</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-400 dark:text-green-600 mr-2" /><span>Advanced Security & SSO</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-400 dark:text-green-600 mr-2" /><span>Custom Integrations</span></li>
                </ul>
              </div>
              <Link to="/contact" className="block text-center w-full bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900 py-3 rounded-full font-semibold hover:bg-gray-600 dark:hover:bg-gray-300 transition-colors duration-300">
                Contact Sales
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-100">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-4xl font-bold text-white dark:text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
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

export default PricingPage;