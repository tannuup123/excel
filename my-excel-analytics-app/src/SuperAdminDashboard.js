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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "super-admin") {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        alert("Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("An error occurred while fetching users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change this user's role to ${newRole}?`)) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      if (response.ok) {
        alert("User role updated successfully!");
        fetchUsers();
      } else {
        alert("Failed to update user role.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("An error occurred while updating the role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        alert("User deleted successfully!");
        fetchUsers();
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 p-4 flex flex-col items-center transition-all duration-300 ease-in-out 
        ${isSidebarExpanded ? "w-64" : "w-20"}`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="mb-10 flex flex-col items-center">
          <div className="bg-red-500 p-3 rounded-full shadow-lg mb-2 transition-transform duration-300 hover:scale-110">
            <FaUserShield size={24} />
          </div>
          {isSidebarExpanded && (
            <span className="text-lg font-bold">Super Admin</span>
          )}
        </div>

        {/* Sidebar Nav */}
        <nav className="flex flex-col space-y-4 w-full">
          {[
            { icon: <FaChartLine size={28} />, label: "Dashboard" },
            { icon: <FaUsers size={28} />, label: "Manage Users" },
            { icon: <FaCog size={28} />, label: "Settings" },
          ].map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {item.icon}
              {isSidebarExpanded && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Logout button */}
        <div className="mt-auto w-full">
          <button
            onClick={handleLogout}
            className={`
    flex items-center justify-center space-x-3 p-3 rounded-lg w-full
    text-white bg-transparent
    transition-all duration-300
    hover:bg-red-500 
  `}
          >
            <FaSignOutAlt />
            {isSidebarExpanded && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Manage Users</h1>
        </header>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">All Registered Users</h2>
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="transition hover:bg-gray-700">
                  <td className="px-6 py-4">{user.fullname}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        user.role === "super-admin"
                          ? "bg-red-800 text-red-100"
                          : user.role === "admin"
                          ? "bg-indigo-600 text-indigo-100"
                          : "bg-green-600 text-green-100"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <select
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="bg-gray-700 text-white p-1 rounded"
                        value={user.role}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super-admin">Super Admin</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
