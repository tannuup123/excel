import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaTrash,
  FaUserShield,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const role = "super-admin";

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");
    if (userRole !== "super-admin" || !token) {
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
      else console.error("Failed to fetch users");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeSection === "manage-users") {
      fetchUsers();
    }
  }, [activeSection]);

  const handleApprovalChange = async (id, newApprovalStatus) => {
  if (!window.confirm(`Are you sure to ${newApprovalStatus ? "approve" : "disapprove"} this user?`)) return;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/users/${id}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isApproved: newApprovalStatus }),
    });

    if (res.ok) {
      fetchUsers();
    } else {
      console.error("Failed to update approval");
    }
  } catch (error) {
    console.error(error);
  }
};



  const handleRoleChange = async (id, newRole) => {
    if (!window.confirm(`Change this user's role to ${newRole}?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-700 p-6 flex flex-col items-center">
        <div className="flex flex-col items-center space-y-2 mb-12">
          <div className="bg-red-500 p-3 rounded-full shadow-lg">
            <FaUserShield size={26} />
          </div>
          <span className="text-lg font-bold">Super Admin</span>
          <span className="px-3 py-1 bg-red-600 rounded-full text-sm">
            {role.toUpperCase()}
          </span>
        </div>

        <nav className="flex flex-col space-y-4 w-full">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeSection === "dashboard"
                ? "bg-red-600 text-white"
                : "hover:bg-slate-800"
            }`}
          >
            <FaChartLine />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveSection("manage-users")}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeSection === "manage-users"
                ? "bg-red-600 text-white"
                : "hover:bg-slate-800"
            }`}
          >
            <FaUsers />
            <span>Manage Users</span>
          </button>
          <button
            onClick={() => setActiveSection("settings")}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeSection === "settings"
                ? "bg-red-600 text-white"
                : "hover:bg-slate-800"
            }`}
          >
            <FaCog />
            <span>Settings</span>
          </button>
        </nav>

        <div className="mt-auto w-full">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-3 p-3 rounded-lg w-full border border-red-500 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300"
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
            <header className="mb-8 border-b border-red-500 pb-2">
              <h1 className="text-3xl font-bold text-red-400">
                Super Admin Dashboard
              </h1>
            </header>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                <h2 className="text-gray-300">Registered Users</h2>
                <p className="text-3xl font-bold mt-2">{users.length}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                <h2 className="text-gray-300">Total Projects</h2>
                <p className="text-3xl font-bold mt-2">250</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                <h2 className="text-gray-300">Pending Tasks</h2>
                <p className="text-3xl font-bold mt-2">15</p>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
              <h2 className="text-xl font-bold mb-4">System Overview</h2>
              <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-300">This is the Chart Area</p>
              </div>
            </div>
          </>
        )}

        {activeSection === "manage-users" && (
          <div className="bg-slate-800 p-6 rounded-lg shadow-md mb-8 overflow-x-auto border border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-red-400">
              All Registered Users
            </h2>
            <table className="min-w-full divide-y divide-slate-700">
              <thead>
                <tr>
                  <th className="px-6 py-3">Full Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Approved</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-700">
                    <td className="px-6 py-4">{u.fullname}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.role === "super-admin"
                            ? "bg-red-800 text-white"
                            : u.role === "admin"
                            ? "bg-indigo-600 text-white"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                    <input type="checkbox" checked={u.isApproved}
                    onChange={() => handleApprovalChange(u._id, !u.isApproved)}/> 
                    </td>
                    <td className="px-6 py-4">{u.isApproved ? "✅" : "❌"}</td>
                    <td className="px-6 py-4">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-2">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u._id, e.target.value)
                        }
                        className="bg-gray-700 text-white p-1 rounded"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super-admin">Super Admin</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "settings" && (
          <h2 className="text-xl font-bold">Settings Panel</h2>
        )}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
