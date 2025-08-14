import React, { useState, useEffect } from "react";
import { FaChartLine, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

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
    const res = await fetch("http://localhost:5000/api/admin/stats", { headers: { Authorization: `Bearer ${token}` }});
    setStats(await res.json());
  };

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users", { headers: { Authorization: `Bearer ${token}` }});
    const allUsers = await res.json();
    setUsers(allUsers.filter(u => u.role === "user"));
  };

  const fetchAnalytics = async () => {
    const [growth, roles, trends, uploaders, acts] = await Promise.all([
      fetch("http://localhost:5000/api/admin/user-growth", { headers: { Authorization: `Bearer ${token}` }}).then(r => r.json()),
      fetch("http://localhost:5000/api/admin/role-distribution", { headers: { Authorization: `Bearer ${token}` }}).then(r => r.json()),
      fetch("http://localhost:5000/api/admin/file-trends", { headers: { Authorization: `Bearer ${token}` }}).then(r => r.json()),
      fetch("http://localhost:5000/api/admin/top-uploaders", { headers: { Authorization: `Bearer ${token}` }}).then(r => r.json()),
      fetch("http://localhost:5000/api/admin/recent-activities", { headers: { Authorization: `Bearer ${token}` }}).then(r => r.json())
    ]);
    setGrowthData(growth);
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
    navigate("/login");
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

  const filteredUsers = users.filter(u =>
    u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 p-6 flex flex-col">
        <div className="mb-12 text-center">
          <FaUsers size={28} className="text-teal-300" />
          <p className="text-xl font-bold">Admin Panel</p>
          <span className="px-3 py-1 bg-blue-700 text-white rounded-full text-sm">
            {role.toUpperCase()}
          </span>
        </div>
        <nav className="space-y-2">
          <button onClick={() => setActiveSection("dashboard")} className={`w-full p-2 ${activeSection==="dashboard"?"bg-teal-600":"bg-blue-800"}`}>
            Dashboard
          </button>
          <button onClick={() => setActiveSection("manage-users")} className={`w-full p-2 ${activeSection==="manage-users"?"bg-teal-600":"bg-blue-800"}`}>
            Manage Users
          </button>
        </nav>
        <div className="mt-auto">
          <button onClick={handleLogout} className="flex items-center justify-center p-2 bg-red-600 w-full">
            <FaSignOutAlt/> <span className="ml-2">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeSection === "dashboard" && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="bg-blue-800 p-4 rounded shadow">
                  <h3 className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</h3>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <h2 className="mb-2">User Growth Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={growthData}><CartesianGrid/><XAxis dataKey="_id"/><YAxis/><Tooltip/><Line dataKey="count" stroke="#82ca9d"/></LineChart>
            </ResponsiveContainer>

            <h2 className="mt-6 mb-2">Role Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={roleData} dataKey="count" nameKey="_id" label>
                  {roleData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                </Pie>
                <Tooltip/><Legend/>
              </PieChart>
            </ResponsiveContainer>

            <h2 className="mt-6 mb-2">File Upload Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={fileTrends}><CartesianGrid/><XAxis dataKey="_id"/><YAxis/><Tooltip/><Bar dataKey="count" fill="#8884d8"/></BarChart>
            </ResponsiveContainer>

            {/* Top Uploaders */}
            <h2 className="mt-6 mb-2">Top Uploaders</h2>
            <ul className="list-disc ml-6">{topUploaders.map(t => <li key={t.name}>{t.name} - {t.uploads} uploads</li>)}</ul>

            {/* Recent Activities */}
            <h2 className="mt-6 mb-2">Recent Activities</h2>
            <ul>{activities.map(a => <li key={a._id}>{a.user?.fullname} - {a.action} ({new Date(a.timestamp).toLocaleString()})</li>)}</ul>
          </>
        )}

        {activeSection === "manage-users" && (
          <div className="bg-gray-800 p-4 rounded">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 w-full text-black rounded"
              />
            </div>
            <table className="min-w-full text-sm table-auto">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2">Full Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Approved</th>
                  <th className="px-4 py-2">Joined</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u._id} className="border-b border-gray-600">
                    <td className="px-4 py-2">{u.fullname}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.role}</td>
                    <td className="px-4 py-2">{u.isApproved ? "✅" : "❌"}</td>
                    <td className="px-4 py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleDeleteUser(u._id, u.role)} className="bg-red-500 px-3 py-1 rounded text-white">Delete</button>
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
