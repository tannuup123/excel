import React, { useState, useEffect, useRef, useContext } from "react";
import { DarkModeContext } from "./contexts/DarkModeContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ReactTyped } from "react-typed";
import CountUp from "react-countup";
import Testimonials from "./Testimonials";
import {
  FaChartLine,
  FaTable,
  FaShieldAlt,
  FaTools,
  FaQuoteLeft,
  FaCheck,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaSun,
  FaMoon,
  FaStar,
} from "react-icons/fa";

const CompanyLogo = ({ name }) => (
  <div className="text-gray-400 dark:text-gray-500 text-2xl font-semibold opacity-70 hover:opacity-100 transition-opacity duration-300">
    {name}
  </div>
);

const LandingPage = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [startTyping, setStartTyping] = useState(false);
  const [key, setKey] = useState(0);

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Pricing data with monthly and yearly prices
  const plans = [
    {
      id: "basic",
      name: "Basic",
      monthly: 19,
      yearly: 19 * 10,
      features: ["Up to 5 Excel Files", "Basic Visualizations", "Standard Support"],
      ctaText: "Get Started",
      ctaLink: "/register",
      ctaClass: "bg-green-500 hover:bg-green-600",
      bgClass: "bg-gray-800 dark:bg-gray-200",
      textClass: "text-white dark:text-gray-900",
    },
    {
      id: "pro",
      name: "Pro",
      monthly: 49,
      yearly: 49 * 10,
      features: [
        "Unlimited Excel Files",
        "Advanced Visualizations",
        "Advanced Analytics",
        "Team Collaboration",
      ],
      ctaText: "Upgrade Now",
      ctaLink: "/register",
      ctaClass: "bg-blue-500 hover:bg-blue-600",
      bgClass: "bg-gray-700 dark:bg-gray-300",
      textClass: "text-white dark:text-gray-900",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      monthly: null,
      yearly: null,
      features: [
        "Custom Solutions",
        "Dedicated Support",
        "Scalable Infrastructure",
        "Advanced Security",
      ],
      ctaText: "Contact Sales",
      ctaLink: "#contact",
      ctaClass: "bg-yellow-500 hover:bg-yellow-600 text-gray-900",
      bgClass: "bg-gray-800 dark:bg-gray-200",
      textClass: "text-white dark:text-gray-900",
    },
  ];

  // This useEffect now uses isDarkMode from the context
  // useEffect(() => {
  //   const html = document.documentElement;
  //   if (isDarkMode) {
  //     html.classList.add("dark");
  //   } else {
  //     html.classList.remove("dark");
  //   }
  // }, [isDarkMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-gray-900 dark:bg-gray-100 text-gray-100 dark:text-gray-900 font-sans leading-relaxed transition-colors duration-500">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 py-4 px-6 md:px-12 flex justify-between items-center bg-gray-800 dark:bg-white bg-opacity-90 dark:bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-lg transition-colors duration-500">
        <div className="text-2xl font-bold text-blue-400">
          Excel <span className="text-green-400">Analytics</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a
            href="#features"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Testimonials
          </a>
          <a
            href="#faq"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            FAQ
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          {/* Now using the toggleDarkMode function from the context */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-gray-300 dark:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors duration-300"
          >
            {/* Now using the isDarkMode state from the context */}
            {isDarkMode ? (
              <FaSun className="h-5 w-5" />
            ) : (
              <FaMoon className="h-5 w-5" />
            )}
          </button>
          <Link
            to="/login"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors duration-300"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        id="hero"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        onViewportEnter={() => setKey((prev) => prev + 1)}
        transition={{ duration: 0.6 }}
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center scroll-mt-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2670&auto=format&fit=crop')`,
        }}
      >
        {/* Static full overlay */}
        <div className="absolute inset-0 bg-gray-900 dark:bg-white bg-opacity-70 dark:bg-opacity-70 transition-colors duration-500" />

        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-6 text-center text-white dark:text-gray-900">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight pt-14 mb-6 drop-shadow-md">
            <ReactTyped
              key={key}
              strings={[
                `Unlock the <span class="text-blue-400 dark:text-blue-600">Hidden Potential</span> of Your <span class="text-green-400 dark:text-green-600">Excel Data</span>`,
              ]}
              typeSpeed={50}
              backSpeed={40}
              showCursor={true}
              cursorChar="|"
              smartBackspace={false}
              fadeOut={false}
              loop={false}
            />
          </h1>

          <p
            className="text-lg md:text-xl mb-8 max-w-3xl pt-4 mx-auto drop-shadow-sm"
            style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 300 }}
          >
            Our advanced platform helps you effortlessly visualize, analyze, and
            automate reports from your spreadsheets, so you can focus on what
            matters.
          </p>

          <div className="pt-4">
            <Link
              to="/register"
              className="bg-green-500 text-white text-lg px-8 py-4 rounded-full font-mono hover:bg-green-600 transition-colors duration-300 shadow-lg transform hover:scale-105"
            >
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Trusted By Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gray-800 dark:bg-gray-200 text-center transition-colors duration-500"
      >
        <div className="container mx-auto px-6">
          <h3 className="text-xl font-semibold text-gray-400 dark:text-gray-600 mb-8">
            Trusted by data teams at leading companies
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <CompanyLogo name="TechCorp" />
            <CompanyLogo name="Innovate Inc." />
            <CompanyLogo name="DataFlow" />
            <CompanyLogo name="Global Solutions" />
            <CompanyLogo name="Future Labs" />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        id="features"
        className="py-20 bg-gray-900 dark:bg-white transition-colors duration-500 scroll-mt-40"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-4">
            Features Built for Data Professionals
          </h2>
          <p className="text-lg text-gray-400 dark:text-gray-600 mb-12 max-w-3xl mx-auto">
            From seamless data import to collaborative sharing, our tools are
            designed to streamline your workflow and boost productivity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <motion.div
              className="bg-gray-800 dark:bg-gray-200 p-8 rounded-2xl shadow-xl transform transition-transform duration-300"
              whileHover="hover"
              initial="initial"
              variants={{ hover: { scale: 1.05 } }}
            >
              <motion.div
                variants={{
                  initial: { scale: 1, rotate: 0 },
                  hover: { scale: 1.2, rotate: 10 },
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaChartLine className="text-5xl text-blue-400 dark:text-blue-600 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                Dynamic Dashboards
              </h3>
              <p className="text-gray-400 dark:text-gray-600">
                Build beautiful, interactive dashboards and visualize your data
                without complex coding.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-gray-800 dark:bg-gray-200 p-8 rounded-2xl shadow-xl transform transition-transform duration-300"
              whileHover="hover"
              initial="initial"
              variants={{ hover: { scale: 1.05 } }}
            >
              <motion.div
                variants={{
                  initial: { scale: 1, rotate: 0 },
                  hover: { scale: 1.2, rotate: 10 },
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaTable className="text-5xl text-green-400 dark:text-green-600 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                Effortless Data Import
              </h3>
              <p className="text-gray-400 dark:text-gray-600">
                Import your .xlsx and .csv files with a single click and start
                analyzing instantly.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-gray-800 dark:bg-gray-200 p-8 rounded-2xl shadow-xl transform transition-transform duration-300"
              whileHover="hover"
              initial="initial"
              variants={{ hover: { scale: 1.05 } }}
            >
              <motion.div
                variants={{
                  initial: { scale: 1, rotate: 0 },
                  hover: { scale: 1.2, rotate: 10 },
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaTools className="text-5xl text-blue-400 dark:text-blue-600 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                Advanced Analytics
              </h3>
              <p className="text-gray-400 dark:text-gray-600">
                Use our powerful tools to uncover trends, forecast future
                outcomes, and make smarter decisions.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        id="how-it-works"
        className="py-20 bg-gray-800 dark:bg-gray-200 transition-colors duration-500 scroll-mt-28"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-400 dark:text-gray-600 mb-12">
            Our platform simplifies the entire process in three easy steps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            {/* Step 1 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Excel File Upload"
                className="rounded-lg shadow-xl mb-4 h-64 w-full object-cover"
              />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                1. Upload Your Data
              </h3>
              <p className="text-gray-400 dark:text-gray-600">
                Securely upload your Excel files from your local machine or
                cloud storage.
              </p>
            </motion.div>
            {/* Step 2 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Data Visualization"
                className="rounded-lg shadow-xl mb-4 h-64 w-full object-cover"
              />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                2. Analyze & Visualize
              </h3>
              <p className="text-gray-400 dark:text-gray-600">
                Use our drag-and-drop interface to build powerful
                visualizations.
              </p>
            </motion.div>
            {/* Step 3 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Team Collaboration"
                className="rounded-lg shadow-xl mb-4 h-64 w-full object-cover"
              />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                3. Share & Collaborate
              </h3>
              <p className="text-gray-400 dark:text-gray-600">
                Share live dashboards with your team and make collaborative
                decisions.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        id="pricing"
        className="py-20 bg-gray-900 dark:bg-white transition-colors duration-500 scroll-mt-20"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-4">
            Transparent Pricing, Made Simple !
          </h2>
          <p className="text-lg text-gray-400 dark:text-gray-600 mb-6">
            Choose a plan that scales with your team's needs.
          </p>

          {/* Toggle switch */}
          <div className="flex justify-center items-center mb-12 space-x-3 font-semibold">
            <span className={!isYearly ? "text-blue-400" : "text-gray-400"}>
              Monthly
            </span>
            <label
              htmlFor="billing-toggle"
              className="relative inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id="billing-toggle"
                className="sr-only"
                checked={isYearly}
                onChange={() => setIsYearly(!isYearly)}
              />
              {/* Background track */}
              <div
                className={`
        w-11 h-6 rounded-full transition-colors duration-300
        ${isYearly ? "bg-green-500" : "bg-blue-500"}
      `}
              ></div>
              {/* Sliding knob */}
              <div
                className={`
        absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300
        ${isYearly ? "translate-x-5" : "translate-x-0"}
      `}
              ></div>
            </label>
            <span className={isYearly ? "text-green-500" : "text-gray-400"}>
              Yearly (Save 2 months!)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const price = isYearly ? plan.yearly : plan.monthly;

              return (
                <motion.div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer p-8 rounded-2xl shadow-xl flex flex-col justify-between border-4
                    ${
                      isSelected
                        ? "border-blue-400 shadow-2xl"
                        : "border-transparent"
                    }
                    ${plan.bgClass}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedPlan(plan.id);
                    }
                  }}
                >
                  <div>
                    <h3
                      className={`text-2xl font-semibold mb-4 ${plan.textClass}`}
                    >
                      {plan.name}
                    </h3>
                    <div
                      className={`${plan.textClass} text-5xl font-bold mb-4 flex justify-center items-center space-x-2`}
                    >
                      {price !== null ? (
                        <CountUp
                          end={price}
                          duration={1.5}
                          prefix="$"
                          separator=","
                        />
                      ) : (
                        "Custom"
                      )}
                      {price !== null && (
                        <span className="text-lg text-gray-400 dark:text-gray-600 font-normal">
                          /{isYearly ? "year" : "month"}
                        </span>
                      )}
                    </div>
                    <ul
                      className="text-gray-300 dark:text-gray-700 mb-6 list-none space-y-2 text-left"
                      aria-label={`${plan.name} features`}
                    >
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <FaCheck className="text-green-400 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {plan.ctaLink.startsWith("http") ||
                  plan.ctaLink.startsWith("#") ? (
                    <a
                      href={plan.ctaLink}
                      className={`px-6 py-3 rounded-full font-semibold mt-auto text-white transition-colors duration-300 ${
                        isSelected ? "bg-blue-600" : plan.ctaClass
                      }`}
                    >
                      {plan.ctaText}
                    </a>
                  ) : (
                    <Link
                      to={plan.ctaLink}
                      className={`px-6 py-3 rounded-full font-semibold mt-auto text-white transition-colors duration-300 ${
                        isSelected ? "bg-blue-600" : plan.ctaClass
                      }`}
                    >
                      {plan.ctaText}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        id="faq"
        className="py-20 bg-gray-900 dark:bg-white transition-colors duration-500 scroll-mt-20"
      >
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-300 dark:text-gray-700 mb-12 leading-relaxed">
            Find answers to the most common questions about our platform.
          </p>
          <div className="space-y-6 text-left">
            <div className="bg-gray-800 dark:bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-white dark:text-gray-900">
                How do I get started?
              </h3>
              <p className="text-gray-300 dark:text-gray-700 mt-3 leading-relaxed">
                Simply click on the "Start Your Free Trial" button, register for
                an account, and you can start uploading your Excel files right
                away.
              </p>
            </div>
            <div className="bg-gray-800 dark:bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-white dark:text-gray-900">
                What file formats are supported?
              </h3>
              <p className="text-gray-300 dark:text-gray-700 mt-3 leading-relaxed">
                We support standard Excel file formats (.xlsx, .xls) and also
                comma-separated values (.csv) files.
              </p>
            </div>
            <div className="bg-gray-800 dark:bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-white dark:text-gray-900">
                Is my data secure?
              </h3>
              <p className="text-gray-300 dark:text-gray-700 mt-3 leading-relaxed">
                Yes, we use industry-standard encryption and security protocols
                to ensure your data is always safe and confidential.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Final Call to Action Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-gradient-to-r from-blue-600 to-green-500 text-white text-center scroll-mt-20"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Data Workflow?
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Join thousands of professionals who are already making data-driven
            decisions. Sign up today and get a free trial.
          </p>
          <Link
            to="/register"
            className="bg-green-500 text-white text-lg px-8 py-4 rounded-full font-mono hover:bg-green-600 transition-colors duration-300 shadow-lg transform hover:scale-105"
          >
            Start Your Free Trial
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;