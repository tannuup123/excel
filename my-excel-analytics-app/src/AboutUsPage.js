import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaSun,
  FaMoon,
  FaBullseye,
  FaLightbulb,
  FaRocket,
  FaTable,
} from "react-icons/fa";

const CompanyLogo = ({ name }) => (
  <div className="text-gray-400 dark:text-gray-500 text-2xl font-semibold opacity-70 hover:opacity-100 transition-opacity duration-300">
    {name}
  </div>
);

const AboutUsPage = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 0 },
    visible: { opacity: 1, y: 1 },
  };

  const [key, setKey] = useState(0);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-900 dark:bg-gray-100 text-gray-100 dark:text-gray-900 font-sans leading-relaxed transition-colors duration-500">
      <header className="fixed top-0 left-0 w-full z-50 py-4 px-6 md:px-12 flex justify-between items-center bg-gray-800 dark:bg-white bg-opacity-90 dark:bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-lg transition-colors duration-500">
        <div className="flex items-center space-x-2">
          <div className="text-green-600 dark:text-green-400 cursor-pointer select-none">
            <FaTable className="text-4xl" />
          </div>

          <span className="text-2xl font-bold truncate ml-2">
            <span className="text-white dark:text-black">Sheet</span>{" "}
            <span className="text-green-500">Insights</span>
          </span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Home
          </Link>
          <a
            href="#story"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Our Story
          </a>
          <a
            href="#mission"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Our Mission
          </a>
          <a
            href="#team"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Our Team
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-300 dark:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors duration-300"
          >
            {theme === "dark" ? (
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

      {/* About Us Hero Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        onViewportEnter={() => setKey((prev) => prev + 1)}
        transition={{ duration: 0.6 }}
        className="relative min-h-[100vh] flex items-center bg-cover bg-center pt-20 "
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gray-900 dark:bg-white bg-opacity-70 dark:bg-opacity-70 transition-colors duration-500"></div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white dark:text-gray-900">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 drop-shadow-md ">
            We Are Passionate About Data
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-sm mb-8 leading-relaxed mt-7 font-['Work_Sans']">
            Helping businesses turn complex spreadsheets into simple, actionable
            insights.
          </p>

          <p className="text-base md:text-lg font-light max-w-3xl mx-auto mb-10 -mt-4 text-gray-300 dark:text-gray-700 leading-relaxed tracking-wide font-['Work_Sans']">
            At the heart of our work lies a simple belief: data should empower,
            not overwhelm. We partner with businesses to uncover patterns,
            streamline workflows, and turn raw information into a competitive
            advantage.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#mission"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition font-medium tracking-wide"
            >
              Learn More
            </a>
            <a
              href="/contact-us"
              className="px-6 py-3 bg-green-500 text-white hover:bg-green-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 rounded-full shadow-lg transition font-medium tracking-wide"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        onViewportEnter={() => setKey((prev) => prev + 1)}
        transition={{ duration: 0.6 }}
        id="story"
        className="py-20 bg-gray-900 dark:bg-white scroll-mt-36"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Image */}
            <div className="md:w-1/2 flex justify-start">
              <img
                src="https://images.unsplash.com/photo-1615992174118-9b8e9be025e7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0"
                alt="Our Story"
                className="rounded-2xl shadow-xl w-[120%] h-auto -ml-20"
              />
            </div>

            {/* Text */}
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-4">
                Our Story
              </h2>
              <p className="text-lg text-gray-400 dark:text-gray-600 mb-4 text-justify">
                ExcelAnalytics was born out of a simple frustration: the
                difficulty of getting meaningful insights from Excel files
                without spending hours on manual work. Our founders, a group of
                data analysts and software engineers, envisioned a platform that
                could automate this process, making powerful data analysis
                accessible to everyone.
              </p>
              <p className="text-lg text-gray-400 dark:text-gray-600 text-justify">
                Since our inception in 2022, we have been dedicated to building
                a user-friendly and powerful tool that empowers businesses to
                make smarter, faster decisions. We believe that with the right
                tools, anyone can become a data expert.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        onViewportEnter={() => setKey((prev) => prev + 1)}
        transition={{ duration: 0.6 }}
        id="mission"
        className="py-20 bg-gray-800 dark:bg-gray-200 text-center scroll-mt-36"
      >
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-12">
            Our Mission & Vision
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-900 dark:bg-white p-8 rounded-2xl shadow-xl">
              <FaBullseye className="text-5xl text-blue-400 dark:text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                Our Mission
              </h3>
              <p className="text-gray-400 dark:text-gray-600">
                To simplify data analysis for businesses worldwide, enabling
                them to leverage their data for growth and innovation.
              </p>
            </div>
            <div className="bg-gray-900 dark:bg-white p-8 rounded-2xl shadow-xl">
              <FaLightbulb className="text-5xl text-green-400 dark:text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                Our Vision
              </h3>
              <p className="text-gray-400 dark:text-gray-600">
                To be the leading platform for turning raw data into powerful,
                actionable insights, making every user a data wizard.
              </p>
            </div>
            <div className="bg-gray-900 dark:bg-white p-8 rounded-2xl shadow-xl">
              <FaRocket className="text-5xl text-purple-400 dark:text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                Our Values
              </h3>
              <p className="text-gray-400 dark:text-gray-600">
                Innovation, Simplicity, Customer-Centricity, and Integrity are
                at the core of everything we do.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Meet Our Team Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        onViewportEnter={() => setKey((prev) => prev + 1)}
        transition={{ duration: 0.6 }}
        id="team"
        className="py-20 pb-28 bg-gray-900 dark:bg-white text-center scroll-mt-2"
      >
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center">
              <img
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Team Member John Doe"
                className="w-40 h-40 rounded-full object-cover shadow-lg mb-4"
              />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900">
                John Doe
              </h3>
              <p className="text-blue-400 dark:text-blue-600 text-lg">
                CEO & Founder
              </p>
            </div>
            {/* Team Member 2 */}
            <div className="flex flex-col items-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Team Member Jane Smith"
                className="w-40 h-40 rounded-full object-cover shadow-lg mb-4"
              />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900">
                Jane Smith
              </h3>
              <p className="text-blue-400 dark:text-blue-600 text-lg">
                Chief Technology Officer
              </p>
            </div>
            {/* Team Member 3 */}
            <div className="flex flex-col items-center">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Team Member Mike Johnson"
                className="w-40 h-40 rounded-full object-cover shadow-lg mb-4"
              />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900">
                Mike Johnson
              </h3>
              <p className="text-blue-400 dark:text-blue-600 text-lg">
                Head of Product
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUsPage;
