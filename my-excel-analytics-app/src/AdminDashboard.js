import { useAuth } from "./contexts/AuthContext";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaChartLine, FaUsers, FaSignOutAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import {
  ArrowUpOnSquareIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COLORS = [
  "url(#colorRole1)",
  "url(#colorRole2)",
  "url(#colorRole3)",
  "url(#colorRole4)",
  "url(#colorRole5)",
];

function fillDateGaps(growthData) {
  if (!Array.isArray(growthData) || growthData.length === 0) return [];

  // Filter out bad/undefined items
  const cleanData = growthData.filter((item) => item && item._id);

  if (cleanData.length === 0) return [];

  // Sort to ensure correct date order
  cleanData.sort((a, b) => new Date(a._id) - new Date(b._id));

  const startDate = new Date(cleanData[0]._id);
  const endDate = new Date(cleanData[cleanData.length - 1]._id);

  // Use YYYY-MM-DD format for consistency
  const dateMap = new Map(
    cleanData.map((item) => [
      new Date(item._id).toISOString().slice(0, 10),
      item.count,
    ])
  );

  let currentDate = new Date(startDate);
  const filledData = [];

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    filledData.push({
      date: dateStr,
      count: dateMap.get(dateStr) || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledData;
}

const API_URL = "http://localhost:5000/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({});
  const [growthData, setGrowthData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [fileTrends, setFileTrends] = useState([]);
  const [topUploaders, setTopUploaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]); // not null or {}
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState({
    fullname: "",
    email: "",
  });

  const usersPerPage = 10;
  const role = "admin";
  const [user, setUser] = useState({ fullname: "", email: "", role: "" });

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    const res = await fetch("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(await res.json());
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // console.log("API users response:", data); // 👀 see the shape

      // Handle both array or object response
      const allUsers = Array.isArray(data) ? data : data.users || [];

      setUsers(allUsers.filter((u) => u.role === "user"));
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  const fetchAnalytics = async () => {
    const [growth, roles, trends, uploaders, acts] = await Promise.all([
      fetch("http://localhost:5000/api/admin/user-growth", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch("http://localhost:5000/api/admin/role-distribution", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch("http://localhost:5000/api/admin/file-trends", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch("http://localhost:5000/api/admin/top-uploaders", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ]);

    const processedGrowth = fillDateGaps(growth);
    setGrowthData(processedGrowth);
    setRoleData(roles);
    setFileTrends(trends);
    setTopUploaders(uploaders);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user data.");

        const userData = await res.json();
        setUser({
          fullname: userData.fullname || "",
          email: userData.email || "",
          role: userData.role || "",
        });
      } catch (err) {
        setAlert({ show: true, message: err.message, type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (user.fullname || user.email) {
      setEditUser({
        fullname: user.fullname,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT", // assuming backend accepts PUT for update
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editUser),
      });

      if (!res.ok) throw new Error("Failed to update profile.");

      const updatedUser = await res.json();
      setUser(updatedUser);
      setAlert({
        show: true,
        message: "Profile updated successfully!",
        type: "success",
      });
      setEditMode(false);
    } catch (err) {
      setAlert({ show: true, message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || localStorage.getItem("userRole") !== "admin") {
      navigate("/login");
    }
    fetchStats();
    fetchUsers();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchAnalytics();

    const intervalId = setInterval(() => {
      fetchStats();
      fetchUsers();
      fetchAnalytics();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleDeleteUser = async (userId, userRole) => {
    if (userRole !== "user") {
      toast.error("You cannot delete admin or super-admin accounts");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      fetchStats();
    } else {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-r from-blue-50 to-indigo-100 p-6 flex flex-col shadow-xl transition-all duration-500">
        <div className="mb-12 text-center">
          <FaUsers
            size={36}
            className="text-blue-600 dark:text-blue-300 drop-shadow-md mx-auto"
          />
          <p className="text-2xl font-bold mt-2 tracking-wide">Admin Panel</p>
          <span className="px-3 py-1 mt-2 inline-block bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200 rounded-full text-sm shadow-md">
            {role.toUpperCase()}
          </span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`w-full p-3 rounded-lg font-medium flex items-center justify-center ${
              activeSection === "dashboard"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105"
                : "bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200 hover:bg-blue-400 hover:text-white"
            } transition-all duration-300 ease-in-out`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveSection("manage-users")}
            className={`w-full p-3 rounded-lg font-medium flex items-center justify-center ${
              activeSection === "manage-users"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105"
                : "bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200 hover:bg-blue-400 hover:text-white"
            } transition-all duration-300 ease-in-out`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveSection("profile")}
            className={`w-full p-3 rounded-lg font-medium flex items-center justify-center ${
              activeSection === "profile"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105"
                : "bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200 hover:bg-blue-400 hover:text-white"
            } transition-all duration-300 ease-in-out`}
          >
            Profile
          </button>
        </nav>

        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-3 bg-red-500 w-full rounded-lg 
            font-medium transition-all text-white duration-300 ease-in-out transform
            hover:bg-red-600 hover:scale-105 hover:shadow-lg"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeSection === "dashboard" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.1 }} // triggers only once when ~10% is visible
              className="space-y-6"
            >
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                {Object.entries(stats).map(([key, value]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex flex-col items-center text-center"
                  >
                    {/* Title Section */}
                    <div className="w-full h-[40px] flex items-center justify-center">
                      <h3 className="text-xs font-semibold tracking-wider uppercase text-blue-100 drop-shadow-md leading-tight text-center">
                        {key.replace(/([A-Z])/g, " $1")}
                      </h3>
                    </div>

                    {/* Count Section */}
                    <div className="w-full flex items-center justify-center mt-3">
                      <p className="text-3xl font-extrabold tracking-tight">
                        {value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <section className="space-y-6">
                {/* User Growth */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="p-4 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl"
                >
                  <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                    User Growth Over Time
                  </h2>

                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={growthData} barCategoryGap="30%">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.2}
                      />
                      <XAxis dataKey="date" tick={{ fill: "currentColor" }} />
                      <YAxis tick={{ fill: "currentColor" }} />

                      <Tooltip
                        contentStyle={{
                          background:
                            "linear-gradient(180deg, #2563eb 0%, #3b82f6 100%)",
                          color: "#fff",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        }}
                        labelStyle={{ fontWeight: "bold", color: "#fff" }}
                      />

                      <defs>
                        <linearGradient
                          id="barGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3b82f6"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                        <linearGradient
                          id="barHover"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#2563eb"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity={0.7}
                          />
                        </linearGradient>
                      </defs>

                      <Bar
                        dataKey="count"
                        fill="url(#barGradient)"
                        radius={[10, 10, 0, 0]}
                        animationDuration={800}
                        cursor={{ fill: "url(#barHover)" }}
                        activeShape={(props) => (
                          <rect {...props} fill="url(#barHover)" rx={10} />
                        )}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Role Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="p-4 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 12a9 9 0 0118 0A9 9 0 013 12z"
                        />
                      </svg>
                    </span>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      Role Distribution
                    </h2>
                  </div>

                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <defs>
                        <linearGradient
                          id="colorRole1"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                        <linearGradient
                          id="colorRole2"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient
                          id="colorRole3"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <linearGradient
                          id="colorRole4"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#db2777" />
                        </linearGradient>
                        <linearGradient
                          id="colorRole5"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                      </defs>

                      <Pie
                        data={roleData}
                        dataKey="count"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                        paddingAngle={4}
                        labelLine={false}
                      >
                        {roleData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value, name) => [
                          `${value} (${(
                            (value /
                              roleData.reduce(
                                (acc, item) => acc + item.count,
                                0
                              )) *
                            100
                          ).toFixed(0)}%)`,
                          name.charAt(0).toUpperCase() + name.slice(1),
                        ]}
                        contentStyle={{
                          backgroundColor: "white",
                          color: "#111827",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      />

                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        formatter={(value) =>
                          value.charAt(0).toUpperCase() + value.slice(1)
                        }
                        wrapperStyle={{ fontSize: "12px", marginTop: "10px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* File Upload Trends */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="p-4 rounded-2xl shadow-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900"
                >
                  {/* Header */}
                  <div className="flex items-center mb-4">
                    <ArrowUpOnSquareIcon className="w-6 h-6 text-blue-500 dark:text-blue-300 mr-2" />
                    <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      File Upload Trends
                    </h2>
                  </div>

                  {/* Chart */}
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={fileTrends}
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      {/* Gradient Fill */}
                      <defs>
                        <linearGradient
                          id="barGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3b82f6"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#60a5fa"
                            stopOpacity={0.6}
                          />
                        </linearGradient>
                      </defs>

                      {/* Grid */}
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? "#334155"
                            : "#cbd5e1"
                        }
                        opacity={0.4}
                      />

                      {/* Axes */}
                      <XAxis
                        dataKey="_id"
                        tick={{
                          fill: window.matchMedia(
                            "(prefers-color-scheme: dark)"
                          ).matches
                            ? "#e2e8f0"
                            : "#1e293b",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{
                          fill: window.matchMedia(
                            "(prefers-color-scheme: dark)"
                          ).matches
                            ? "#e2e8f0"
                            : "#1e293b",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      {/* Tooltip */}
                      <Tooltip
                        contentStyle={{
                          backgroundColor: window.matchMedia(
                            "(prefers-color-scheme: dark)"
                          ).matches
                            ? "#1e293b"
                            : "white",
                          color: window.matchMedia(
                            "(prefers-color-scheme: dark)"
                          ).matches
                            ? "#e2e8f0"
                            : "#1e293b",
                          borderRadius: "10px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          border: "none",
                          padding: "8px 12px",
                        }}
                        cursor={{
                          fill: window.matchMedia(
                            "(prefers-color-scheme: dark)"
                          ).matches
                            ? "rgba(147,197,253,0.1)"
                            : "rgba(59,130,246,0.1)",
                        }}
                      />

                      {/* Bar */}
                      <Bar
                        dataKey="count"
                        fill="url(#barGradient)"
                        radius={[6, 6, 0, 0]}
                        animationDuration={1000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </section>

              {/* Top Uploaders */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                viewport={{ once: true, amount: 0.2 }}
                className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl"
              >
                <h2 className="mb-4 text-lg font-bold text-gray-700 dark:text-gray-200 flex items-center">
                  <UserGroupIcon className="w-6 h-6 text-blue-500 dark:text-blue-300 mr-2" />
                  Top Uploaders
                </h2>

                <ul className="space-y-3">
                  {topUploaders.map((t, index) => {
                    let badgeClasses = "";
                    if (index === 0)
                      badgeClasses =
                        "bg-gradient-to-br from-yellow-400 to-yellow-300 text-white shadow-lg";
                    else if (index === 1)
                      badgeClasses =
                        "bg-gradient-to-br from-gray-400 to-gray-300 text-white shadow-md";
                    else if (index === 2)
                      badgeClasses =
                        "bg-gradient-to-br from-orange-400 to-orange-300 text-white shadow-md";
                    else
                      badgeClasses =
                        "bg-gradient-to-br from-blue-500 to-blue-400 text-white shadow";

                    return (
                      <li
                        key={t._id || `${t.name}-${index}`}
                        className="flex justify-between items-center p-3 rounded-xl shadow-md transition-transform transform hover:-translate-y-1 bg-white dark:bg-slate-700"
                      >
                        <span className="flex items-center space-x-3">
                          <span
                            className={`w-6 h-6 flex items-center justify-center rounded-full font-semibold ${badgeClasses}`}
                          >
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {t.name}
                          </span>
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {t.uploads} uploads
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            </motion.div>
          </>
        )}

        {activeSection === "manage-users" && (
          <div className="p-4 bg-blue-50 dark:bg-blue-800 rounded-lg shadow-lg">
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 w-full text-gray-900 dark:text-white bg-white dark:bg-blue-700 rounded shadow"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
              <table className="min-w-full text-sm table-auto border-collapse">
                <thead className="bg-blue-200 dark:bg-blue-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Full Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-center">Role</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center">Joined</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers
                    .slice(
                      (currentPage - 1) * usersPerPage,
                      currentPage * usersPerPage
                    )
                    .map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-blue-300 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-700"
                      >
                        <td className="px-4 py-2">{u.fullname}</td>
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2 text-center">{u.role}</td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              u.isApproved
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {u.isApproved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleDeleteUser(u._id, u.role)}
                            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white flex items-center justify-center mx-auto"
                          >
                            <FaTrash className="mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredUsers.length > usersPerPage && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-gray-800 dark:text-gray-200">
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredUsers.length / usersPerPage)}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(filteredUsers.length / usersPerPage)
                      )
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(filteredUsers.length / usersPerPage)
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {activeSection === "profile" && (
          <div className="max-w-4xl mx-auto mt-6 p-6 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
              My Profile
            </h2>

            {loading ? (
              <div className="animate-pulse flex items-center justify-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="flex flex-col space-y-4 w-1/2">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                </div>
              </div>
            ) : (
              <>
                {alert.show && (
                  <div
                    className={`mb-4 p-3 rounded ${
                      alert.type === "error"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {alert.message}
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-stretch gap-8 justify-center">
                  {/* Avatar & Name */}
                  <div className="flex flex-col items-center md:items-center gap-4 w-full md:w-1/3">
                    <div className="w-28 h-28 rounded-full bg-blue-500 dark:bg-blue-700 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                      {user.fullname ? user.fullname.charAt(0) : "U"}
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {user.fullname}
                    </h3>
                    <span className="mt-1 px-4 py-1 rounded-full text-sm font-medium bg-indigo-500 text-white shadow">
                      {user.role ? user.role.toUpperCase() : "-"}
                    </span>
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1 flex flex-col gap-6 w-full md:w-2/3">
                    <div className="p-4 bg-white dark:bg-slate-700 rounded-xl shadow flex flex-col">
                      <label className="text-gray-500 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={editUser.fullname}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              fullname: e.target.value,
                            })
                          }
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-semibold">
                          {user.fullname}
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-700 rounded-xl shadow flex flex-col">
                      <label className="text-gray-500 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      {editMode ? (
                        <input
                          type="email"
                          value={editUser.email}
                          onChange={(e) =>
                            setEditUser({ ...editUser, email: e.target.value })
                          }
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-semibold">
                          {user.email}
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 justify-start mt-2">
                      {editMode ? (
                        <>
                          <button
                            onClick={handleProfileUpdate}
                            className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition shadow-md"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditMode(false);
                              setEditUser({
                                fullname: user.fullname,
                                email: user.email,
                              });
                            }}
                            className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-xl hover:bg-gray-400 transition shadow-md"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditMode(true)}
                          className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition shadow-md"
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
