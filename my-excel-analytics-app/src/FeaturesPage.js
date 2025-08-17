import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DarkModeContext } from "./contexts/DarkModeContext";
import Header from "./Header"; 
import {
  FaSun,
  FaMoon,
  FaChartLine,
  FaCloudUploadAlt,
  FaDownload,
  FaMicrochip,
  FaUsersCog,
  FaUserShield,
  FaTable,
} from "react-icons/fa";

const FeaturesPage = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: FaCloudUploadAlt,
      color: "text-blue-500",
      title: "Seamless Excel Upload",
      description: "Effortlessly upload any .xls or .xlsx file to our platform for instant data analysis.",
    },
    {
      icon: FaChartLine,
      color: "text-green-500",
      title: "Interactive 2D & 3D Charts",
      description: "Generate dynamic 2D and 3D visualizations with customizable X and Y axes directly from your data.",
    },
    {
      icon: FaDownload,
      color: "text-purple-500",
      title: "Downloadable Visuals",
      description: "Easily download your generated graphs and charts in various formats for presentations and reports.",
    },
    {
      icon: FaMicrochip,
      color: "text-orange-500",
      title: "AI-Powered Insights",
      description: "Get smart insights and summary reports from your data using our optional AI integration.",
    },
    {
      icon: FaUserShield,
      color: "text-red-500",
      title: "Personalized Dashboard",
      description: "Your entire history of uploads and analysis is securely saved and visible on your personal dashboard.",
    },
    {
      icon: FaUsersCog,
      color: "text-yellow-500",
      title: "Admin Panel",
      description: "Admins have full control to manage users and monitor data usage across the platform.",
    },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans leading-relaxed transition-colors duration-500">
      
      <Header />

      <section className="py-20 bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-5xl pt-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">Powerful Features for Data Analysis</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Transform your Excel data into stunning 2D and 3D visualizations with our intuitive platform.</p>
        </div>
      </section>

      <section id="features" className="py-12 bg-gray-200 dark:bg-gray-800 scroll-mt-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">All-in-One Data Visualization Tool</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  <feature.icon className={`text-5xl ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Visualize Your Data?</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">Sign up today and turn your Excel sheets into actionable insights with powerful visualizations.</p>
        <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-200 transition-colors duration-300">
          Start Your Free Trial
        </Link>
      </section>
    </div>
  );
};

export default FeaturesPage;