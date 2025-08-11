import React, { useState, useEffect } from "react";
import { FaChartLine, FaUsers, FaTasks, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const role = "admin"; // Could be from backend or localStorage

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");
    if (userRole !== "admin" || !token) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUsers(await res.json());
      else console.error("Failed to fetch users", await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeSection === "manage-users") fetchUsers();
  }, [activeSection]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 border-r border-blue-700 p-6 flex flex-col items-center">
        <div className="flex flex-col items-center space-y-2 mb-12">
          <FaUsers size={28} className="text-teal-300" />
          <span className="text-2xl font-bold">Admin Panel</span>
          <span className="px-3 py-1 bg-blue-700 text-white rounded-full text-sm">
            {role.toUpperCase()}
          </span>
        </div>

        <nav className="flex flex-col space-y-4 w-full">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeSection === "dashboard"
                ? "bg-teal-600 text-white"
                : "hover:bg-blue-800"
            }`}
          >
            <FaChartLine />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveSection("manage-users")}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeSection === "manage-users"
                ? "bg-teal-600 text-white"
                : "hover:bg-blue-800"
            }`}
          >
            <FaUsers />
            <span>Manage Users</span>
          </button>
          <button
            onClick={() => setActiveSection("projects")}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeSection === "projects"
                ? "bg-teal-600 text-white"
                : "hover:bg-blue-800"
            }`}
          >
            <FaTasks />
            <span>Manage Projects</span>
          </button>
        </nav>

        <div className="mt-auto w-full">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-3 p-3 rounded-lg border border-teal-400 text-teal-300 hover:bg-red-500 hover:text-white transition-colors w-full"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeSection === "dashboard" && (
          <>
            <header className="mb-8 border-b border-teal-500 pb-2">
              <h1 className="text-3xl font-bold text-teal-300">
                Admin Dashboard
              </h1>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-800 p-6 rounded-lg shadow-md border border-blue-600">
                <h2 className="text-gray-300">Registered Users</h2>
                <p className="text-3xl font-bold mt-2">{users.length}</p>
              </div>
              <div className="bg-blue-800 p-6 rounded-lg shadow-md border border-blue-600">
                <h2 className="text-gray-300">Total Projects</h2>
                <p className="text-3xl font-bold mt-2">250</p>
              </div>
              <div className="bg-blue-800 p-6 rounded-lg shadow-md border border-blue-600">
                <h2 className="text-gray-300">Pending Tasks</h2>
                <p className="text-3xl font-bold mt-2">15</p>
              </div>
            </div>
          </>
        )}

        {activeSection === "manage-users" && (
          <div className="bg-blue-800 p-6 rounded-lg shadow-md mb-8 overflow-x-auto border border-blue-600">
            <h2 className="text-xl font-bold mb-4 text-teal-300">
              All Registered Users
            </h2>
            <table className="min-w-full divide-y divide-blue-700">
              <thead>
                <tr>
                  <th className="px-6 py-3">Full Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Approved</th>
                  <th className="px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) => u.role === "user") // Only show regular users
                  .map((u) => (
                    <tr key={u._id} className="hover:bg-blue-700">
                      <td className="px-6 py-4">{u.fullname}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">{u.role}</td>
                      <td className="px-6 py-4">
                        {u.isApproved ? "✅" : "❌"}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
