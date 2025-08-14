import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "./contexts/DarkModeContext";
import {
  FaSun,
  FaMoon,
  FaBriefcase,
  FaUsers,
  FaHeart,
  FaChevronRight,
  FaTable,
} from "react-icons/fa";

const CareersPage = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const jobOpenings = [
    { id: 1, title: "Senior Software Engineer", department: "Engineering", location: "Remote" },
    { id: 2, title: "Product Manager", department: "Product", location: "New York, USA" },
    { id: 3, title: "Data Analyst Intern", department: "Analytics", location: "San Francisco, USA" },
    { id: 4, title: "UX/UI Designer", department: "Design", location: "Remote" },
  ];

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
          <Link to="/careers" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Careers</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
          </button>
          <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors">Register</Link>
        </div>
      </header>

      <section
        className="min-h-[60vh] flex items-center bg-cover bg-center pt-20"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop')` }}
      >
        <div className="bg-white dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-70 w-full min-h-[60vh] flex items-center justify-center transition-colors duration-500">
          <div className="max-w-5xl mx-auto px-6 text-center text-gray-900 dark:text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-md">
              Join Our Mission to Simplify Data
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-sm">
              We're a team of innovators passionate about building tools that empower people.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900 text-center">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
            Our Culture & Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-200 dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
              <FaUsers className="text-5xl text-blue-500 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Team Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-400">We believe in open communication and working together to solve challenges and build great products.</p>
            </div>
            <div className="bg-gray-200 dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
              <FaBriefcase className="text-5xl text-green-500 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Growth & Learning</h3>
              <p className="text-gray-600 dark:text-gray-400">We invest in our team's professional development with regular training and mentorship programs.</p>
            </div>
            <div className="bg-gray-200 dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
              <FaHeart className="text-5xl text-purple-500 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Work-Life Balance</h3>
              <p className="text-gray-600 dark:text-gray-400">We offer flexible working hours and a remote-friendly environment to ensure our team is happy and healthy.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-200 dark:bg-gray-800 text-center">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
            Current Openings
          </h2>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md flex justify-between items-center transition-transform hover:scale-[1.02] duration-300">
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{job.department} <span className="mx-2">•</span> {job.location}</p>
                </div>
                <Link to="/apply" className="flex items-center text-blue-500 font-semibold hover:underline">
                  Apply Now <FaChevronRight className="ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;