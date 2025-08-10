import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaSun,
  FaMoon,
  FaArrowRight,
} from "react-icons/fa";

const CompanyLogo = ({ name }) => (
  <div className="text-gray-400 dark:text-gray-500 text-2xl font-semibold opacity-70 hover:opacity-100 transition-opacity duration-300">
    {name}
  </div>
);

const BlogPage = () => {
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

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Data Visualization in Excel",
      date: "August 8, 2025",
      summary:
        "Explore new trends and tools that are transforming how we visualize data directly within Excel.",
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b2baf?q=80&w=2670&auto=format&fit=crop",
      link: "/blog/post-1",
    },
    {
      id: 2,
      title: "5 Tips to Automate Your Excel Reports",
      date: "July 25, 2025",
      summary:
        "Learn how to save time and reduce errors by automating your daily, weekly, and monthly reports with our platform.",
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop",
      link: "/blog/post-2",
    },
    {
      id: 3,
      title: "Getting Started with Power BI for Excel Users",
      date: "July 10, 2025",
      summary:
        "A beginner-friendly guide to bridging your Excel skills with the powerful features of Microsoft Power BI.",
      image:
        "https://images.unsplash.com/photo-1543286386-713bdd593766?q=80&w=2670&auto=format&fit=crop",
      link: "/blog/post-3",
    },
    {
      id: 4,
      title: "How to Build a Dynamic Dashboard in Minutes",
      date: "June 30, 2025",
      summary:
        "Follow this step-by-step tutorial to create a professional-looking and fully interactive dashboard from scratch.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2725&auto=format&fit=crop",
      link: "/blog/post-4",
    },
  ];

  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1);

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
            to="/blog"
            className="text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
          >
            Blog
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

      {/* Blog Header Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-100 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-5xl pt-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white dark:text-gray-900 mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-gray-400 dark:text-gray-600 max-w-2xl mx-auto">
            Stay up-to-date with the latest trends in data analytics, expert
            tips for Excel, and company news.
          </p>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-12 bg-gray-800 dark:bg-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Featured Post */}
          <Link
            to={featuredPost.link}
            className="block rounded-2xl overflow-hidden shadow-xl mb-12 transition-transform hover:scale-[1.01] duration-300"
          >
            <div className="relative">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent flex items-end p-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-200 text-lg">
                    {featuredPost.summary}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Recent Posts Grid */}
          <h2 className="text-3xl font-bold text-white dark:text-gray-900 mb-8">
            Recent Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Link
                to={post.link}
                key={post.id}
                className="block bg-gray-900 dark:bg-white rounded-2xl overflow-hidden shadow-md transition-transform hover:scale-[1.05] duration-300"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <p className="text-sm text-gray-400 dark:text-gray-600">
                    {post.date}
                  </p>
                  <h3 className="text-xl font-bold text-white dark:text-gray-900 mt-2 mb-4">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 dark:text-gray-700 text-sm">
                    {post.summary}
                  </p>
                  <div className="flex items-center text-blue-400 dark:text-blue-600 mt-4 font-semibold">
                    Read More <FaArrowRight className="ml-2 text-sm" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
