import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "./contexts/DarkModeContext";
import { FaSun, FaMoon, FaCheck, FaTable } from "react-icons/fa";
import Header from "./Header"; // Import the new Header component just added


const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-300 dark:border-gray-700 py-4">
      <button className="flex justify-between items-center w-full text-left font-semibold text-gray-900 dark:text-white" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <span className="text-2xl">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600 dark:text-gray-400 transition-all duration-300">{answer}</p>
      )}
    </div>
  );
};

const PricingPage = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    { question: "Can I change my plan later?", answer: "Yes, you can upgrade or downgrade your plan at any time directly from your dashboard settings." },
    { question: "Do you offer a free trial?", answer: "Yes, we offer a 14-day free trial on our Pro plan with no credit card required. You can sign up and start exploring the features." },
    { question: "What is the difference between Starter and Pro?", answer: "The Starter plan is great for individuals, while the Pro plan offers more advanced features like 3D charts, AI insights, and increased storage for teams." },
    { question: "How does billing work?", answer: "You will be billed monthly or annually, depending on your chosen plan. All payments are processed securely via Stripe or PayPal." },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans leading-relaxed transition-colors duration-500">
      
      <Header />

      <section className="py-20 bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-5xl pt-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">Simple & Transparent Pricing</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Choose the plan that's right for you and get started with a free trial on our most popular plan.</p>
        </div>
      </section>

      <section className="py-12 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
                <p className="text-gray-600 dark:text-gray-400">Perfect for individuals just starting out.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$19</span>
                  <span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center"><FaCheck className="text-green-500 mr-2" /><span>2D Chart Generation</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-500 mr-2" /><span>50 Uploads/month</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-500 mr-2" /><span>Basic Dashboard</span></li>
                </ul>
              </div>
              <Link to="/register" className="block text-center w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors">Get Started</Link>
            </div>

            <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between transform scale-105">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                </div>
                <p className="text-gray-200">The best choice for small teams and power users.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold">$49</span>
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
              <Link to="/register" className="block text-center w-full bg-white text-blue-600 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">Start Your Free Trial</Link>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
                <p className="text-gray-600 dark:text-gray-400">Tailored solutions for large organizations.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">Custom</span>
                </div>
                <ul className="space-y-3 mb-8 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center"><FaCheck className="text-green-500 mr-2" /><span>Everything in Pro</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-500 mr-2" /><span>Dedicated Account Manager</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-500 mr-2" /><span>Advanced Security & SSO</span></li>
                  <li className="flex items-center"><FaCheck className="text-green-500 mr-2" /><span>Custom Integrations</span></li>
                </ul>
              </div>
              <Link to="/contact" className="block text-center w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => <FaqItem key={index} question={faq.question} answer={faq.answer} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;