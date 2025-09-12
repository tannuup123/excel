import { useAuth } from "./contexts/AuthContext";
import React, { useState, useEffect, useContext } from "react";
import { FaSun, FaMoon, FaUsers, FaSignOutAlt, FaTrash, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { DarkModeContext } from './contexts/DarkModeContext';
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

// Helper function to create temporary pop-up notifications
const showNotification = (message, type = 'success') => {
  const messageBox = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  messageBox.innerText = message;
  messageBox.className = `fixed bottom-5 right-5 ${bgColor} text-white p-4 rounded-lg shadow-xl z-[10000] animate-fade-in-up`;

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fadeInOutUp {
      0% { opacity: 0; transform: translateY(20px); }
      10% { opacity: 1; transform: translateY(0); }
      90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-20px); }
    }
    .animate-fade-in-up {
      animation: fadeInOutUp 3s ease-in-out forwards;
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(messageBox);

  setTimeout(() => {
    if (document.body.contains(messageBox)) {
      document.body.removeChild(messageBox);
    }
    if (document.head.contains(style)) {
      document.head.removeChild(style);
    }
  }, 3000);
};

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onCancel, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full text-center p-6"
      >
        <p className="text-lg mb-6 text-slate-800 dark:text-slate-200">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};


const COLORS = [
  "url(#colorRole1)",
  "url(#colorRole2)",
  "url(#colorRole3)",
  "url(#colorRole4)",
  "url(#colorRole5)",
];

// All logic functions are unchanged
function fillDateGaps(growthData) {
  if (!Array.isArray(growthData) || growthData.length === 0) return [];
  const cleanData = growthData.filter((item) => item && item._id);
  if (cleanData.length === 0) return [];
  cleanData.sort((a, b) => new Date(a._id) - new Date(b._id));
  const startDate = new Date(cleanData[0]._id);
  const endDate = new Date(cleanData[cleanData.length - 1]._id);
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
  // --- All state and logic hooks remain unchanged ---
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
  const [editMode, setEditMode] = useState(false);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [editUser, setEditUser] = useState({
    fullname: "",
    email: "",
  });

  const usersPerPage = 10;
  const role = "admin";
  const [user, setUser] = useState({ fullname: "", email: "", role: "" });

  const token = localStorage.getItem("token");

  // --- All data fetching and handling functions remain unchanged ---
  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const allUsers = Array.isArray(data) ? data : data.users || [];
        setUsers(allUsers.filter((u) => u.role === "user"));
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const [growth, roles, trends, uploaders] = await Promise.all([
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

      setGrowthData(fillDateGaps(growth));
      setRoleData(roles);
      setFileTrends(trends);
      setTopUploaders(uploaders);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (!token || userRole !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
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
        showNotification(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [token]);

  useEffect(() => {
    if (user.fullname || user.email) {
      setEditUser({
        fullname: user.fullname,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editUser),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile.");
      }
      const updatedUser = await res.json();
      setUser(updatedUser);
      showNotification("Profile updated successfully!", 'success');
      setEditMode(false);
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      const fetchData = () => {
        fetchStats();
        fetchUsers();
        fetchAnalytics();
      };
      fetchData();
      const intervalId = setInterval(fetchData, 60000);
      return () => clearInterval(intervalId);
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleDeleteUser = (userId, userEmail, userRole) => {
    if (userRole !== "user") {
      showNotification("You cannot delete admin or super-admin accounts", "error");
      return;
    }
    setModalAction({
      type: 'delete-user',
      userId: userId,
      message: `Are you sure you want to delete user: ${userEmail}?`
    });
    setShowConfirmationModal(true);
  };

  const handleModalConfirm = async () => {
    if (!modalAction || modalAction.type !== 'delete-user') return;

    const { userId } = modalAction;
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      showNotification("User deleted successfully", 'success');
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      fetchStats();
    } else {
      showNotification("Failed to delete user", 'error');
    }

    setShowConfirmationModal(false);
    setModalAction(null);
  };

  const handleModalCancel = () => {
    setShowConfirmationModal(false);
    setModalAction(null);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
        message={modalAction?.message}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside className={`fixed lg:relative w-64 h-full bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6 flex flex-col shadow-xl transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="mb-12 text-center">
          <FaUsers
            size={36}
            className="text-blue-600 dark:text-blue-300 drop-shadow-md mx-auto"
          />
          <p className="text-2xl font-bold mt-2 tracking-wide text-gray-900 dark:text-gray-100">
            Admin Panel
          </p>
          <span className="px-3 py-1 mt-2 inline-block bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-200 rounded-full text-sm shadow-md">
            {role.toUpperCase()}
          </span>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'manage-users', label: 'Manage Users' },
            { id: 'profile', label: 'Profile' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id)
                setIsSidebarOpen(false);
              }}
              className={`w-full p-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ease-in-out ${activeSection === item.id
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105"
                : "bg-blue-200 dark:bg-gray-700 text-blue-900 dark:text-gray-200 hover:bg-blue-400 dark:hover:bg-gray-600 hover:text-white"
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-3 bg-red-500 w-full rounded-lg 
            font-medium transition-all text-white duration-300 ease-in-out transform
            hover:bg-red-600 hover:scale-105 hover:shadow-lg dark:bg-red-600 dark:hover:bg-red-700"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <header className="mb-10 pb-6 border-b border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 mr-4 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FaBars size={24} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">Welcome, <span className="text-blue-500">{user.fullname || "Admin"}</span>!</h1>
            </div>
          </div>
          <button onClick={toggleDarkMode} className={`p-3 rounded-full shadow-md transition-colors duration-300 ${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-700/10 text-gray-600 hover:bg-gray-700/20"}`}>
            {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>
        </header>

        {activeSection === "dashboard" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* FONT & OVERFLOW FIX APPLIED HERE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {Object.entries(stats).map(([key, value]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.05, translateY: -5 }}
                    className="p-5 rounded-xl shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex flex-col justify-between min-h-[120px]"
                  >
                    <h3 className="text-xl font-semibold capitalize tracking-wide text-blue-100">
                      {key.replace(/([A-Z])/g, " $1")}
                    </h3>
                    <p className={`tracking-tight mt-2 ${(typeof value === 'string' && value.length > 15)
                      ? 'text-base font-semibold break-words text-left' // Style for long strings
                      : 'text-3xl font-extrabold text-right' // Style for numbers
                      }`}>
                      {value}
                    </p>
                  </motion.div>
                ))}
              </div>

              <section className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-md"
                >
                  <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500 dark:text-blue-300" />
                    User Growth Over Time
                  </h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={growthData} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                      <XAxis dataKey="date" tick={{ fill: isDarkMode ? "#e2e8f0" : "#1e293b", fontSize: 12 }} />
                      <YAxis tick={{ fill: isDarkMode ? "#e2e8f0" : "#1e293b", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          background: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(5px)',
                          color: isDarkMode ? '#e2e8f0' : '#1e293b',
                          borderRadius: "8px",
                          border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        labelStyle={{ fontWeight: "bold" }}
                      />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-md"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                      Role Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <defs>
                          <linearGradient id="colorRole1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#2563eb" /></linearGradient>
                          <linearGradient id="colorRole2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#059669" /></linearGradient>
                          <linearGradient id="colorRole3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#d97706" /></linearGradient>
                          <linearGradient id="colorRole4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ec4899" /><stop offset="100%" stopColor="#db2777" /></linearGradient>
                          <linearGradient id="colorRole5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient>
                        </defs>
                        <Pie data={roleData} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={4} labelLine={false}>
                          {roleData.map((_, i) => (
                            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [
                            `${value} (${((value / roleData.reduce((acc, item) => acc + item.count, 0)) * 100).toFixed(0)}%)`,
                            name.charAt(0).toUpperCase() + name.slice(1),
                          ]}
                          contentStyle={{
                            backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(5px)',
                            borderRadius: "8px",
                            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                          }}
                          itemStyle={{
                            color: isDarkMode ? '#e2e8f0' : '#1e293b', // ✅ This controls text color inside the tooltip
                            fontSize: '15px',
                          }}
                        />
                        <Legend verticalAlign="bottom" align="center" iconType="circle" formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} wrapperStyle={{ fontSize: "12px", marginTop: "10px", color: isDarkMode ? "#e2e8f0" : "#111827" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-md"
                  >
                    <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center">
                      <ArrowUpOnSquareIcon className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                      File Upload Trends
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={fileTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="fileBarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#cbd5e1"} opacity={0.4} />
                        <XAxis dataKey="_id" tick={{ fill: isDarkMode ? "#e2e8f0" : "#1e293b", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: isDarkMode ? "#e2e8f0" : "#1e293b", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#1e293b" : "white", color: isDarkMode ? "#e2e8f0" : "#1e293b", borderRadius: "10px" }} />
                        <Bar dataKey="count" fill="url(#fileBarGradient)" radius={[6, 6, 0, 0]} animationDuration={1000} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-md"
                >
                  <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center">
                    <UserGroupIcon className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                    Top Uploaders
                  </h2>
                  <ul className="space-y-3">
                    {topUploaders.map((t, index) => (
                      <li
                        key={t._id || `${t.name}-${index}`}
                        className="flex justify-between items-center p-3 rounded-lg transition-colors bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700"
                      >
                        <span className="flex items-center space-x-3 min-w-0">
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full font-semibold text-xs ${index === 0 ? "bg-yellow-400 text-white" : index === 1 ? "bg-gray-400 text-white" : index === 2 ? "bg-orange-400 text-white" : "bg-blue-500 text-white"}`}>
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{t.name}</span>
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 ml-4 flex-shrink-0">{t.uploads} uploads</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </section>
            </motion.div>
          </>
        )}

        {activeSection === "manage-users" && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 w-full text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="overflow-x-auto w-full">
              <table className="min-w-full text-sm table-auto">
                <thead className="bg-gray-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-2 text-left">Full Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-center">Role</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center">Joined</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage).map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{u.fullname}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{u.email}</td>
                      <td className="px-4 py-3 text-center">{u.role}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.isApproved ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300"}`}>
                          {u.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDeleteUser(u._id, u.email, u.role)}
                          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white flex items-center justify-center mx-auto text-xs"
                        >
                          <FaTrash className="mr-1.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length > usersPerPage && (
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 dark:border-slate-700 gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Page {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-slate-600">
                    Previous
                  </button>
                  <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredUsers.length / usersPerPage)))} disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)} className="px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-slate-600">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === "profile" && (
          <div className="max-w-4xl mx-auto mt-6 p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">My Profile</h2>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
                  <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-md">
                    {user.fullname ? user.fullname.charAt(0).toUpperCase() : "A"}
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{user.fullname}</h3>
                    <span className="mt-1 px-4 py-1 rounded-full text-sm font-medium bg-indigo-500 text-white shadow">
                      {user.role ? user.role.toUpperCase() : "-"}
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-6 w-full md:w-2/3">
                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-700 divide-y divide-gray-200 dark:divide-slate-700">
                    <div className="p-4">
                      <label className="text-sm text-gray-500 dark:text-gray-400">Full Name</label>
                      {editMode ? (
                        <input type="text" value={editUser.fullname} onChange={(e) => setEditUser({ ...editUser, fullname: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-600" />
                      ) : (
                        <p className="font-semibold text-lg">{user.fullname}</p>
                      )}
                    </div>
                    <div className="p-4">
                      <label className="text-sm text-gray-500 dark:text-gray-400">Email Address</label>
                      {editMode ? (
                        <input type="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-600" />
                      ) : (
                        <p className="font-semibold text-lg">{user.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2">
                    {editMode ? (
                      <>
                        <button onClick={handleProfileUpdate} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-sm">Save Changes</button>
                        <button onClick={() => setEditMode(false)} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => setEditMode(true)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">Edit Profile</button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;