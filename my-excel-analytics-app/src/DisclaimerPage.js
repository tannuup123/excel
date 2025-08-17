import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "./contexts/DarkModeContext";
import { FaSun, FaMoon, FaTable } from "react-icons/fa";
import Header from "./Header"; // Import the new Header component just added

const DisclaimerPage = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans leading-relaxed transition-colors duration-500">
      
      <Header />

      <section className="py-20 bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-4xl pt-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">Disclaimer</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12">Effective: August 8, 2025</p>
          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-loose">
            <p>The information provided by Sheet Insights ("we," "us," or "our") on our website is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.</p>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">1. External Links Disclaimer</h2>
              <p>The Site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the Site.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">2. Professional Advice Disclaimer</h2>
              <p>The information provided by the Service is not a substitute for professional advice. The use or reliance of any information contained on this site is solely at your own risk. The information is not intended to be a substitute for professional legal, financial, or other advice.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">3. Limitation of Liability</h2>
              <p>Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">4. Changes to this Disclaimer</h2>
              <p>We may update this Disclaimer from time to time. The updated version will be indicated by an updated "Effective" date and will be effective as soon as it is accessible. We encourage you to review this Disclaimer frequently to be informed of how we are protecting your information.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DisclaimerPage;