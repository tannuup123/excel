import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaSun, FaMoon, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const CompanyLogo = ({ name }) => (
  <div className="text-gray-400 dark:text-gray-500 text-2xl font-semibold opacity-70 hover:opacity-100 transition-opacity duration-300">
    {name}
  </div>
);

const ContactPage = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted!', formData);
    alert('Thank you for your message! We will get back to you shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
          <Link to="/contact" className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300">Contact</Link>
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

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-100 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-5xl pt-16">
          <h1 className="text-4xl font-bold text-white dark:text-gray-900 text-center mb-4">Contact Us</h1>
          <p className="text-lg text-gray-400 dark:text-gray-600 text-center mb-12">
            We'd love to hear from you. Send us a message or find our contact details below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-800 dark:bg-white p-8 rounded-2xl shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 dark:text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-600 dark:border-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 dark:text-gray-700">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-600 dark:border-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 dark:text-gray-700">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-600 dark:border-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 dark:text-gray-700">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-600 dark:border-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-300"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="bg-gray-800 dark:bg-white p-8 rounded-2xl shadow-xl space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-2">Our Details</h3>
                <p className="text-gray-400 dark:text-gray-600">You can also reach us through these channels.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-blue-400 dark:text-blue-600 text-2xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-white dark:text-gray-900">Address</h4>
                    <p className="text-gray-400 dark:text-gray-600">123 Data Street, Analytics City, 10001, USA</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaEnvelope className="text-blue-400 dark:text-blue-600 text-2xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-white dark:text-gray-900">Email</h4>
                    <p className="text-gray-400 dark:text-gray-600">
                      <a href="mailto:info@excelanalytics.com" className="hover:underline">info@excelanalytics.com</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaPhone className="text-blue-400 dark:text-blue-600 text-2xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-white dark:text-gray-900">Phone</h4>
                    <p className="text-gray-400 dark:text-gray-600">
                      <a href="tel:+1234567890" className="hover:underline">+1 (234) 567-890</a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="font-semibold text-white dark:text-gray-900">Follow Us</h4>
                <div className="flex mt-2 space-x-4">
                  <a href="#" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300"><FaFacebook /></a>
                  <a href="#" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300"><FaTwitter /></a>
                  <a href="#" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300"><FaLinkedin /></a>
                  <a href="#" className="hover:text-white dark:hover:text-gray-900 transition-colors duration-300"><FaInstagram /></a>
                </div>
              </div>
            </div>
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

export default ContactPage;