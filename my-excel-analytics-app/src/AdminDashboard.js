import React, { useState, useEffect } from "react";
import { FaChartLine, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

function fillDateGaps(growthData) {
  if (!growthData || growthData.length === 0) return [];
  const startDate = new Date(growthData[0]._id);
  const endDate = new Date(growthData[growthData.length - 1]._id);
  const dateMap = new Map(growthData.map(item => [item._id, item.count]));
  let currentDate = new Date(startDate);
  const filledData = [];
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    filledData.push({
      date: dateStr,
      count: dateMap.get(dateStr) || 0
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return filledData;
}


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({});
  const [growthData, setGrowthData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [fileTrends, setFileTrends] = useState([]);
  const [topUploaders, setTopUploaders] = useState([]);
  const [activities, setActivities] = useState([]);
  const role = "admin";

  const token = localStorage.getItem("token");

 const fetchStats = async () => {
    const res = await fetch("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(await res.json());
  };

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const allUsers = await res.json();
    setUsers(allUsers.filter((u) => u.role === "user"));
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
      fetch("http://localhost:5000/api/admin/recent-activities", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ]);
    // Use fillDateGaps to process growth data for continuous date labels
    const processedGrowth = fillDateGaps(growth);
    setGrowthData(processedGrowth);
    setRoleData(roles);
    setFileTrends(trends);
    setTopUploaders(uploaders);
    setActivities(acts);
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
  }, 60000); // every 60 seconds

  return () => clearInterval(intervalId);
}, []);


  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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
      setUsers(prev => prev.filter(u => u._id !== userId));
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
    <aside className="w-64 bg-blue-100 dark:bg-blue-900 p-6 flex flex-col shadow-xl transition-all duration-500">
      
      {/* Header */}
      <div className="mb-12 text-center">
        <FaUsers
          size={36}
          className="text-blue-600 dark:text-blue-300 drop-shadow-md transition-transform duration-300 hover:scale-110 mx-auto"
        />
        <p className="text-2xl font-bold mt-2 tracking-wide">Admin Panel</p>
        <span className="px-3 py-1 mt-2 inline-block bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200 rounded-full text-sm shadow-md">
          {role.toUpperCase()}
        </span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <button
          onClick={() => setActiveSection("dashboard")}
          className={`w-full p-3 rounded-md font-medium tracking-wide flex items-center justify-center
            ${
              activeSection === "dashboard"
                ? "bg-blue-500 text-white shadow-lg scale-105"
                : "bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200 hover:bg-blue-400 hover:text-white"
            } transition-all duration-300 ease-in-out`}
        >
          Dashboard
        </button>

        <button
          onClick={() => setActiveSection("manage-users")}
          className={`w-full p-3 rounded-md font-medium tracking-wide flex items-center justify-center
            ${
              activeSection === "manage-users"
                ? "bg-blue-500 text-white shadow-lg scale-105"
                : "bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200 hover:bg-blue-400 hover:text-white"
            } transition-all duration-300 ease-in-out`}
        >
          Manage Users
        </button>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center p-3 bg-red-500 w-full rounded-md 
            font-medium transition-all text-white duration-300 ease-in-out transform
            hover:bg-red-600 hover:scale-105 hover:shadow-lg"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </aside>

    {/* Main Content */}
    {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeSection === "dashboard" && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {Object.entries(stats).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-blue-100 dark:bg-blue-800 text-gray-900 dark:text-white p-4 rounded shadow flex flex-col items-center justify-center"
                >
                  <h3 className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</h3>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <section className="space-y-6">
              <div>
                <h2 className="mb-2 font-semibold">User Growth Over Time</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h2 className="mb-2 font-semibold">Role Distribution</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={roleData} dataKey="count" nameKey="_id" label>
                      {roleData.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h2 className="mb-2 font-semibold">File Upload Trends</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={fileTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Top Uploaders */}
            <div className="mt-6">
              <h2 className="mb-2 font-semibold">Top Uploaders</h2>
              <ul className="list-disc ml-6 space-y-1">
                {topUploaders.map((t) => (
                  <li key={t.name}>
                    {t.name} - {t.uploads} uploads
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Activities */}
            <div className="mt-6">
              <h2 className="mb-2 font-semibold">Recent Activities</h2>
              <ul className="space-y-1">
                {activities.map((a) => (
                  <li key={a._id}>
                    {a.user?.fullname} - {a.action} ({new Date(a.timestamp).toLocaleString()})
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {activeSection === "manage-users" && (
          <div className="bg-blue-50 dark:bg-blue-800 p-4 rounded shadow">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 w-full text-gray-900 dark:text-white bg-white dark:bg-blue-700 rounded"
              />
            </div>
            <table className="min-w-full text-sm table-auto">
              <thead className="bg-blue-200 dark:bg-blue-700">
                <tr>
                  <th className="px-4 py-2 text-left">Full Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-center">Role</th>
                  <th className="px-4 py-2 text-center">Approved</th>
                  <th className="px-4 py-2 text-center">Joined</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="border-b border-blue-300 dark:border-blue-600">
                    <td className="px-4 py-2">{u.fullname}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2 text-center">{u.role}</td>
                    <td className="px-4 py-2 text-center">{u.isApproved ? "✅" : "❌"}</td>
                    <td className="px-4 py-2 text-center">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDeleteUser(u._id, u.role)}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

    <ToastContainer />
  </div>
);


};

export default AdminDashboard;
