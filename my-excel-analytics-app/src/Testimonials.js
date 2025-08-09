import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaQuoteLeft,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    text: "The best tool for turning our chaotic spreadsheets into clean, insightful dashboards. The automation feature is a lifesaver!",
    name: "Jane Doe",
    title: "Data Analyst at Global Solutions",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop&ixlib=rb-4.0.3",
    rating: 5,
    color: "blue",
  },
  {
    id: 2,
    text: "I used to spend hours manually updating reports. Now, I just upload my Excel file and everything is done automatically. Highly recommended!",
    name: "John Smith",
    title: "Operations Manager at Innovate Inc.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop&ixlib=rb-4.0.3",
    rating: 4,
    color: "green",
  },
  {
    id: 3,
    text: "This platform has revolutionized how our team handles data. The intuitive interface and powerful analytics save us so much time.",
    name: "Emily Johnson",
    title: "Business Intelligence Lead at TechCorp",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=100&w=300&h=300&auto=format&fit=crop",
    rating: 5,
    color: "purple",
  },
  {
    id: 4,
    text: "The seamless integration with our existing systems and the real-time collaboration features have boosted our productivity immensely.",
    name: "Michael Lee",
    title: "Project Manager at Innovate Solutions",
    img: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?q=100&w=800&auto=format&fit=crop",
    rating: 4,
    color: "orange",
  },
  {
    id: 5,
    text: "User-friendly and robust. The customer support is fantastic and always quick to help with any questions or customization requests.",
    name: "Samantha Brown",
    title: "Operations Director at NextGen Analytics",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop&ixlib=rb-4.0.3",
    rating: 5,
    color: "teal",
  },
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const getColorClass = (color) => {
  switch (color) {
    case "blue":
      return "text-blue-400 dark:text-blue-600";
    case "green":
      return "text-green-400 dark:text-green-600";
    case "purple":
      return "text-purple-400 dark:text-purple-600";
    case "orange":
      return "text-orange-400 dark:text-orange-600";
    case "teal":
      return "text-teal-400 dark:text-teal-600";
    default:
      return "text-gray-400 dark:text-gray-600";
  }
};

export default function Testimonials() {
  const [[page, direction], setPage] = useState([0, 1]);
  const timeoutRef = useRef(null);

  const testimonialIndex =
    ((page % testimonials.length) + testimonials.length) % testimonials.length;

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setPage([page + 1, 1]);
    }, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [page]);

  const handleDragEnd = (e, { offset, velocity }) => {
    if (offset.x < -100 || velocity.x < -500) {
      setPage([page + 1, 1]);
    } else if (offset.x > 100 || velocity.x > 500) {
      setPage([page - 1, -1]);
    }
  };

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <section
      id="testimonials"
      className="py-20 bg-gray-800 dark:bg-gray-200 text-center transition-colors duration-500 scroll-mt-24"
      aria-label="Customer testimonials"
    >
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-4">
          What Our Customers Say
        </h2>
        <p className="text-lg text-gray-400 dark:text-gray-600 mb-12">
          Hear from our users about how our platform has transformed their data
          workflow.
        </p>

        <div className="relative w-full h-auto min-h-[300px] flex justify-center items-center">
          {/* Left Arrow */}
          <button
            aria-label="Previous testimonial"
            onClick={() => paginate(-1)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 bg-gray-700 dark:bg-gray-300 rounded-full hover:bg-gray-600 dark:hover:bg-gray-400 transition-colors z-20"
          >
            <FaChevronLeft className="text-white dark:text-gray-900" />
          </button>

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={testimonials[testimonialIndex].id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 40 }, // slower, softer spring
                opacity: { duration: 0.4 },
                scale: { duration: 0.5 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute top-0 left-0 right-0 mx-auto bg-gray-900 dark:bg-white p-8 rounded-2xl shadow-xl text-left max-w-xl cursor-grab select-none"
              style={{ willChange: "transform, opacity" }}
              aria-live="polite"
            >
              {/* Your existing testimonial content here */}
              {/* Quote Icon */}
              <motion.div
                variants={contentVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                className={`mb-4 text-4xl ${getColorClass(
                  testimonials[testimonialIndex].color
                )}`}
              >
                <FaQuoteLeft aria-hidden="true" />
              </motion.div>

              {/* Testimonial Text */}
              <motion.p
                variants={contentVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                className="italic text-gray-300 dark:text-gray-700 mb-6 select-text"
              >
                {testimonials[testimonialIndex].text}
              </motion.p>

              {/* Rating Stars */}
              <motion.div
                variants={contentVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
                className="flex mb-4"
                aria-label={`Rating: ${testimonials[testimonialIndex].rating} out of 5`}
              >
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`mr-1 ${
                      i < testimonials[testimonialIndex].rating
                        ? "text-yellow-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </motion.div>

              {/* Profile and Progress Ring */}
              <motion.div
                variants={contentVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
                className="flex items-center relative"
              >
                {/* Circular Progress SVG */}
                <svg
                  className="absolute left-0"
                  width="56"
                  height="56"
                  viewBox="0 0 56 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle
                    cx="28"
                    cy="28"
                    r="26"
                    stroke="#374151" // Tailwind slate-700
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="28"
                    cy="28"
                    r="26"
                    stroke={testimonials[testimonialIndex].color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={0}
                    style={{
                      strokeDashoffset: 2 * Math.PI * 26,
                      rotate: -90,
                      transformOrigin: "50% 50%",
                    }}
                    animate={{
                      strokeDashoffset: [2 * Math.PI * 26, 0],
                    }}
                    transition={{
                      duration: 5,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  />
                </svg>

                <img
                  src={testimonials[testimonialIndex].img}
                  alt={`Customer ${testimonials[testimonialIndex].name}`}
                  className="w-14 h-14 rounded-full mr-4 object-cover relative z-10"
                />
                <div className="relative z-10">
                  <p className="font-semibold text-white dark:text-gray-900 select-text">
                    {testimonials[testimonialIndex].name}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-600 select-text">
                    {testimonials[testimonialIndex].title}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Right Arrow */}
          <button
            aria-label="Next testimonial"
            onClick={() => paginate(1)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 bg-gray-700 dark:bg-gray-300 rounded-full hover:bg-gray-600 dark:hover:bg-gray-400 transition-colors z-20"
          >
            <FaChevronRight className="text-white dark:text-gray-900" />
          </button>
        </div>

        {/* Pagination dots */}
        <div
          className="flex justify-center mt-8 space-x-3"
          role="tablist"
          aria-label="Select testimonial"
        >
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage([i, i > testimonialIndex ? 1 : -1])}
              className={`w-3 h-3 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                i === testimonialIndex
                  ? "bg-yellow-400 ring-yellow-400"
                  : "bg-gray-500 dark:bg-gray-400"
              }`}
              aria-selected={i === testimonialIndex}
              aria-label={`Go to testimonial ${i + 1}`}
              role="tab"
              tabIndex={i === testimonialIndex ? 0 : -1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
