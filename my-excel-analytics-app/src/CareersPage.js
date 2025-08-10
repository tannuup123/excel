import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaSun,
  FaMoon,
  FaBriefcase,
  FaUsers,
  FaHeart,
  FaChevronRight,
} from "react-icons/fa";

const CompanyLogo = ({ name }) => (
  <div className="text-gray-400 dark:text-gray-500 text-2xl font-semibold opacity-70 hover:opacity-100 transition-opacity duration-300">
    {name}
  </div>
);

const CareersPage = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

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

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "New York, USA",
    },
    {
      id: 3,
      title: "Data Analyst Intern",
      department: "Analytics",
      location: "San Francisco, USA",
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
    },
  ];

  return (
    <div className="bg-gray-900 dark:bg-gray-100 text-gray-100 dark:text-gray-900 font-sans leading-relaxed transition-colors duration-500">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 py-4 px-6 md:px-12 flex justify-between items-center bg-gray-800 dark:bg-white bg-opacity-90 dark:bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-lg transition-colors duration-500">
        <div className="text-2xl font-bold text-blue-400">
          Excel<span className="text-green-400">Analytics</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            About Us
          </Link>
          <Link
            to="/careers"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Careers
          </Link>
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

      {/* Careers Hero Section */}
      <section
        className="min-h-[60vh] flex items-center bg-cover bg-center pt-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      >
        <div className="bg-gray-900 dark:bg-white bg-opacity-70 dark:bg-opacity-70 w-full min-h-[60vh] flex items-center justify-center transition-colors duration-500">
          <div className="max-w-5xl mx-auto px-6 text-center text-white dark:text-gray-900">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-md">
              Join Our Mission to Simplify Data
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-sm">
              We're a team of innovators passionate about building tools that
              empower people.
            </p>
          </div>
        </div>
      </section>

      {/* Our Culture Section */}
      <section className="py-20 bg-gray-900 dark:bg-white text-center">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-12">
            Our Culture & Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-800 dark:bg-gray-200 p-8 rounded-2xl shadow-xl flex flex-col items-center">
              <FaUsers className="text-5xl text-blue-400 dark:text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                Team Collaboration
              </h3>
              <p className="text-gray-400 dark:text-gray-600">
                We believe in open communication and working together to solve
                challenges and build great products.
              </p>
            </div>
            <div className="bg-gray-800 dark:bg-gray-200 p-8 rounded-2xl shadow-xl flex flex-col items-center">
              <FaBriefcase className="text-5xl text-green-400 dark:text-green-600 mb-4" />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                Growth & Learning
              </h3>
              <p className="text-gray-400 dark:text-gray-600">
                We invest in our team's professional development with regular
                training and mentorship programs.
              </p>
            </div>
            <div className="bg-gray-800 dark:bg-gray-200 p-8 rounded-2xl shadow-xl flex flex-col items-center">
              <FaHeart className="text-5xl text-purple-400 dark:text-purple-600 mb-4" />
              <h3 className="text-2xl font-semibold text-white dark:text-gray-900 mb-2">
                Work-Life Balance
              </h3>
              <p className="text-gray-400 dark:text-gray-600">
                We offer flexible working hours and a remote-friendly
                environment to ensure our team is happy and healthy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="py-20 bg-gray-800 dark:bg-gray-200 text-center">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-12">
            Current Openings
          </h2>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div
                key={job.id}
                className="bg-gray-900 dark:bg-white p-6 rounded-xl shadow-md flex justify-between items-center transition-transform hover:scale-[1.02] duration-300"
              >
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-white dark:text-gray-900">
                    {job.title}
                  </h3>
                  <p className="text-gray-400 dark:text-gray-600 text-sm">
                    {job.department} <span className="mx-2">•</span>{" "}
                    {job.location}
                  </p>
                </div>
                <Link
                  to="/apply"
                  className="flex items-center text-blue-400 dark:text-blue-600 font-semibold hover:underline"
                >
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
