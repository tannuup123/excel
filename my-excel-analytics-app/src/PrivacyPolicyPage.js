import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "./contexts/DarkModeContext";
import { FaSun, FaMoon, FaTable } from "react-icons/fa";

const PrivacyPolicyPage = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

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
          <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">About Us</Link>
          <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
          </button>
          <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors">Register</Link>
        </div>
      </header>

      <section className="py-20 bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-4xl pt-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12">Last updated: August 8, 2025</p>
          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-loose">
            <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">1. Information We Collect</h2>
              <p>We collect several types of information for various purposes to provide and improve Our Service to You.</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>
                  <strong className="text-gray-900 dark:text-white">Personal Data:</strong>{" "}
                  While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to: Email address, First name and last name, Phone number, Address, State, Province, ZIP/Postal code, City.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white">Usage Data:</strong>{" "}
                  We may also collect information on how the Service is accessed and used. This Usage Data may include information such as Your Computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">2. How We Use Your Information</h2>
              <p>We use the collected data for various purposes:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>To provide and maintain our Service.</li>
                <li>To notify You about changes to our Service.</li>
                <li>To allow You to participate in interactive features of our Service when You choose to do so.</li>
                <li>To provide customer support.</li>
                <li>To gather analysis or valuable information so that we can improve our Service.</li>
                <li>To monitor the usage of our Service.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">3. Data Security</h2>
              <p>The security of Your Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">4. Your Data Protection Rights</h2>
              <p>Depending on your location, you may have the right to access, update or delete the information we have on you. You also have the right to withdraw your consent to data processing at any time.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">5. Changes to This Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;