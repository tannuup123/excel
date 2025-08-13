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

  // const handleEditUser = (user) => {
  //   // Example: navigate to edit form or open modal
  //   console.log("Editing user:", user);
  //   // navigate(`/edit-user/${user._id}`);
  // };

  const handleDeleteUser = async (userId) => {
    // Confirm deletion with the user
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Update the users state by removing the deleted user
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
        alert("User deleted successfully");
      } else {
        const error = await response.json();
        console.error("Failed to delete user:", error);
        alert(`Failed to delete user: ${error.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("An error occurred while deleting the user.");
    }
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
          <div className="bg-transparent p-6 rounded-lg shadow-md mb-8 overflow-x-auto border border-blue-800">
            <h2 className="text-xl font-bold mb-4 text-teal-300">
              All Registered Users
            </h2>
            <table className="min-w-full text-sm table-auto bg-gray-800 border border-gray-300/20">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-center text-gray-200 border border-gray-300/20">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-center text-gray-200 border border-gray-300/20">
                    Email
                  </th>
                  <th className="px-6 py-3 text-center text-gray-200 border border-gray-300/20">
                    Role
                  </th>
                  <th className="px-6 py-3 text-center text-gray-200 border border-gray-300/20">
                    Approved
                  </th>
                  <th className="px-6 py-3 text-center text-gray-200 border border-gray-300/20">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-center text-gray-200 border border-gray-300/20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-blue-900/10 transition">
                    <td className="px-6 py-4 border border-gray-300/20 text-left">
                      {u.fullname}
                    </td>
                    <td className="px-6 py-4 border border-gray-300/20 text-left">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 border border-gray-300/20 text-center">
                      {u.role}
                    </td>
                    <td className="px-6 py-4 border border-gray-300/20 text-center">
                      {u.isApproved ? "✅" : "❌"}
                    </td>
                    <td className="px-6 py-4 border border-gray-300/20 text-center">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 border border-gray-300/20 text-center">
                      <div className="flex justify-center gap-2">
                        {/* <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs">
                          Edit
                        </button> */}
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
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
