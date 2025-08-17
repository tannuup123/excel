import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "./contexts/DarkModeContext";
import { FaSun, FaMoon, FaArrowRight, FaTable } from "react-icons/fa";
import Header from "./Header"; // Import the new Header component just added


const BlogPage = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Data Visualization in Excel",
      date: "August 8, 2025",
      summary: "Explore new trends and tools that are transforming how we visualize data directly within Excel.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b2baf?q=80&w=2670&auto=format&fit=crop",
      link: "/blog/post-1",
    },
    {
      id: 2,
      title: "5 Tips to Automate Your Excel Reports",
      date: "July 25, 2025",
      summary: "Learn how to save time and reduce errors by automating your daily, weekly, and monthly reports with our platform.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop",
      link: "/blog/post-2",
    },
    {
      id: 3,
      title: "Getting Started with Power BI for Excel Users",
      date: "July 10, 2025",
      summary: "A beginner-friendly guide to bridging your Excel skills with the powerful features of Microsoft Power BI.",
      image: "https://images.unsplash.com/photo-1543286386-713bdd593766?q=80&w=2670&auto=format&fit=crop",
      link: "/blog/post-3",
    },
    {
      id: 4,
      title: "How to Build a Dynamic Dashboard in Minutes",
      date: "June 30, 2025",
      summary: "Follow this step-by-step tutorial to create a professional-looking and fully interactive dashboard from scratch.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2725&auto=format&fit=crop",
      link: "/blog/post-4",
    },
  ];

  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans leading-relaxed transition-colors duration-500">
      
      <Header />

      <section className="py-20 bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-5xl pt-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stay up-to-date with the latest trends in data analytics, expert tips for Excel, and company news.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto px-6 max-w-5xl">
          <Link to={featuredPost.link} className="block rounded-2xl overflow-hidden shadow-xl mb-12 transition-transform hover:scale-[1.01] duration-300">
            <div className="relative">
              <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{featuredPost.title}</h2>
                  <p className="text-gray-200 text-lg">{featuredPost.summary}</p>
                </div>
              </div>
            </div>
          </Link>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Link to={post.link} key={post.id} className="block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md transition-transform hover:scale-[1.05] duration-300">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{post.date}</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-4">{post.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{post.summary}</p>
                  <div className="flex items-center text-blue-500 dark:text-blue-400 mt-4 font-semibold">
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