import React, { useState, useEffect, useMemo } from "react";
import {
  FaChartLine,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaTrash,
  FaUserShield,
  FaFileAlt,
  FaBullhorn,
  FaDatabase,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
  FaLock,
  FaArchive,
  FaCloudDownloadAlt,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onCancel, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 font-sans">
      <div className="bg-white bg-opacity-20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl max-w-sm w-full text-center p-6 transition-all duration-300 transform scale-105">
        <p className="text-white text-lg mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 border border-gray-500/50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 border border-red-500/50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Add User Modal Component
const AddUserModal = ({ isOpen, onClose, onAdd, newUser, setNewUser }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white bg-opacity-20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl max-w-lg w-full p-6 transition-all duration-300 transform scale-105">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-400">Add New User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <FaTimes />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={newUser.fullname}
            onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
            className="w-full bg-white/10 p-2 rounded-lg text-white placeholder-gray-300 border border-white/20"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full bg-white/10 p-2 rounded-lg text-white placeholder-gray-300 border border-white/20"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full bg-white/10 text-white p-2 rounded-lg border border-white/20"
          >
            <option className="bg-gray-800" value="user">User</option>
            <option className="bg-gray-800" value="admin">Admin</option>
            <option className="bg-gray-800" value="super-admin">Super Admin</option>
          </select>
          {['admin', 'super-admin'].includes(newUser.role) && (
            <>
              <input
                type="text"
                placeholder="Phone Number"
                value={newUser.phoneNumber || ''}
                onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                className="w-full bg-white/10 p-2 rounded-lg text-white placeholder-gray-300 border border-white/20"
              />
              <input
                type="text"
                placeholder="Employee ID"
                value={newUser.employeeId || ''}
                onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })}
                className="w-full bg-white/10 p-2 rounded-lg text-white placeholder-gray-300 border border-white/20"
              />
            </>
          )}
          <button
            onClick={onAdd}
            className="w-full bg-green-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 border border-green-500/50 shadow-lg"
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit User Modal Component
const EditUserModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [editedUser, setEditedUser] = useState(user);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  if (!isOpen || !editedUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white bg-opacity-20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl max-w-lg w-full p-6 transition-all duration-300 transform scale-105">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-400">Edit User Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <FaTimes />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={editedUser.fullname}
            onChange={(e) => setEditedUser({ ...editedUser, fullname: e.target.value })}
            className="w-full bg-white/10 p-2 rounded-lg text-white placeholder-gray-300 border border-white/20"
          />
          <input
            type="email"
            placeholder="Email"
            value={editedUser.email}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            className="w-full bg-white/10 p-2 rounded-lg text-white placeholder-gray-300 border border-white/20"
          />
          <select
            value={editedUser.role}
            onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
            className="w-full bg-white/10 text-white p-2 rounded-lg border border-white/20"
          >
            <option className="bg-gray-800" value="user">User</option>
            <option className="bg-gray-800" value="admin">Admin</option>
            <option className="bg-gray-800" value="super-admin">Super Admin</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 border border-gray-500/50 shadow-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onUpdate(editedUser)}
              className="flex-1 bg-blue-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 border border-blue-500/50 shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
//==========================================================

const SuperAdminDashboard = () => {
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [mockFiles, setMockFiles] = useState([]);
  const [globalSettings, setGlobalSettings] = useState({
    maxFileSize: 50,
    acceptedFormats: ".xlsx, .xls",
    dataRetentionPolicy: "1 year",
  });
  const [announcement, setAnnouncement] = useState("");
  const [systemHealth, setSystemHealth] = useState({
    uptime: "99.9%",
    serverLoad: "15%",
    databaseStatus: "🟢 Healthy",
    errors: 3,
  });
  const [usageStats, setUsageStats] = useState({
    totalUsers: 0,
    totalFiles: 0,
    mostActiveUser: "user@example.com",
    mostPopularReport: "Monthly Sales Analysis",
    peakUsage: "2:00 PM",
  });
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, type: "File Deletion", user: "admin@example.com", details: "Deleted report 'Q1_Financials.xlsx'", timestamp: "2023-10-26T10:30:00Z" },
    { id: 2, type: "Role Change", user: "super-admin@example.com", details: "Changed 'user1@example.com' role to 'admin'", timestamp: "2023-10-26T10:25:00Z" },
    { id: 3, type: "Login", user: "user2@example.com", details: "Successful login", timestamp: "2023-10-26T10:20:00Z" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ fullname: "", email: "", role: "user", phoneNumber: "", employeeId: "" });

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
      if (res.ok) {
        const usersData = await res.json();
        setUsers(usersData);
        setUsageStats((prev) => ({ ...prev, totalUsers: usersData.length }));
      } else console.error("Failed to fetch users");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const mockFilesData = [
      { id: 1, name: "Monthly_Sales.xlsx", owner: "user1@example.com", date: "2023-10-25" },
      { id: 2, name: "Q3_Report.xls", owner: "admin@example.com", date: "2023-09-30" },
      { id: 3, name: "Customer_Data.xlsx", owner: "user2@example.com", date: "2023-10-20" },
    ];
    setMockFiles(mockFilesData);
    setUsageStats((prev) => ({ ...prev, totalFiles: mockFilesData.length }));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeSection === "manage-users") {
      fetchUsers();
    }
  }, [activeSection]);

  const sortedAndFilteredUsers = useMemo(() => {
    let sortedUsers = [...users];

    if (searchTerm) {
      sortedUsers = sortedUsers.filter(
        (user) =>
          user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      sortedUsers.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'ascending'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'boolean') {
          return sortConfig.direction === 'ascending'
            ? (aValue === bValue ? 0 : (aValue ? 1 : -1))
            : (aValue === bValue ? 0 : (aValue ? -1 : 1));
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedUsers;
  }, [users, searchTerm, sortConfig]);

  // 🆕 NEW: Function to handle opening the edit modal
  const handleOpenEditModal = (user) => {
    setUserToEdit(user);
    setIsEditUserModalOpen(true);
  };
  
  // 🆕 UPDATED: Function to handle updating a user. This now just sets up the confirmation modal.
  const handleUpdateUser = (updatedUser) => {
    setIsEditUserModalOpen(false);
    setModalAction({
      type: 'confirm-update',
      user: updatedUser,
      message: `Are you sure you want to save changes for '${updatedUser.fullname}'?`
    });
    setShowModal(true);
  };

  // 🆕 NEW: Function to perform the confirmed user update API call
  const handleUpdateUserConfirmed = async (userToUpdate) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userToUpdate._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userToUpdate),
      });

      if (res.ok) {
        fetchUsers();
        const messageBox = document.createElement('div');
        messageBox.innerText = `User '${userToUpdate.fullname}' updated successfully!`;
        messageBox.className = 'fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-xl animate-fade-in-up';
        document.body.appendChild(messageBox);
        setTimeout(() => {
          document.body.removeChild(messageBox);
        }, 3000);
      } else {
        const errorData = await res.json();
        console.error("Failed to update user:", errorData.error);
        alert(`Failed to update user: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleApprovalChange = async (id, newApprovalStatus) => {
    setModalAction({
      type: "approve",
      id,
      status: newApprovalStatus,
      message: `Are you sure you want to ${newApprovalStatus ? "approve" : "deactivate"} this user?`,
    });
    setShowModal(true);
  };

  const handleRoleChange = async (id, newRole) => {
    setModalAction({
      type: "role",
      id,
      role: newRole,
      message: `Change this user's role to ${newRole}?`,
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (id, email) => {
    setModalAction({
      type: "delete",
      id,
      message: `Are you sure you want to delete this account of ${email}?`,
    });
    setShowModal(true);
  };

  const handleRequestPasswordReset = (email) => {
    setModalAction({
      type: "reset-password",
      email: email,
      message: `Are you sure you want to send a password reset link to ${email}?`,
    });
    setShowModal(true);
  };

  const handleAddUser = async () => {
    const token = localStorage.getItem("token");

    if (!newUser.fullname || !newUser.email || !newUser.role) {
      setModalAction({
        type: "alert",
        message: "Please fill in all required fields.",
      });
      setShowModal(true);
      return;
    }

    if (
      ['admin', 'super-admin'].includes(newUser.role) &&
      (!newUser.phoneNumber || !newUser.employeeId)
    ) {
      setModalAction({
        type: "alert",
        message: "Admin and Super-Admin roles require a Phone Number and Employee ID.",
      });
      setShowModal(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        setIsAddUserModalOpen(false);
        setNewUser({ fullname: "", email: "", role: "user", phoneNumber: "", employeeId: "" });
        fetchUsers();
        const messageBox = document.createElement('div');
        messageBox.innerText = `New user '${newUser.fullname}' added successfully!`;
        messageBox.className = 'fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-xl animate-fade-in-up';
        document.body.appendChild(messageBox);
        setTimeout(() => {
          document.body.removeChild(messageBox);
        }, 3000);
      } else {
        const errorData = await res.json();
        console.error("Failed to add user:", errorData.message);
        alert(`Failed to add user: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user.");
    }
  };

  const handleModalConfirm = async () => {
    setShowModal(false);
    if (!modalAction) return;

    const { type, id, status, role: newRole, email, user } = modalAction;
    const token = localStorage.getItem("token");

    let res;

    try {
      switch (type) {
        case "approve":
          res = await fetch(`http://localhost:5000/api/users/${id}/approve`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isApproved: status }),
          });
          break;

        case "role":
          res = await fetch(`http://localhost:5000/api/users/${id}/role`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ role: newRole }),
          });
          break;

        case "delete":
          res = await fetch(`http://localhost:5000/api/users/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          break;

        case "reset-password":
          console.log(`Sending password reset link to ${email}...`);
          res = { ok: true };
          break;

        case 'confirm-update':
          handleUpdateUserConfirmed(user); // Call the dedicated function for API request
          return;

        default:
          console.error(`Unknown modal action type: ${type}`);
          setModalAction(null);
          return;
      }

      if (res && res.ok) {
        fetchUsers();
        const messageBox = document.createElement('div');
        let message = '';

        switch (type) {
          case "approve":
            message = `User approved status updated successfully!`;
            break;
          case "role":
            message = `User role updated successfully!`;
            break;
          case "delete":
            message = `User deleted successfully!`;
            break;
          case "reset-password":
            message = `A password reset link has been sent to ${email}.`;
            break;
        }

        messageBox.innerText = message;
        messageBox.className = 'fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-xl animate-fade-in-up';
        document.body.appendChild(messageBox);
        setTimeout(() => {
          document.body.removeChild(messageBox);
        }, 3000);
      } else {
        const errorData = res ? await res.json() : { error: 'Unknown error' };
        console.error(`Failed to perform ${type} action:`, errorData.error);
        alert(`Failed to perform ${type} action: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setModalAction(null);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalAction(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setGlobalSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:", globalSettings);
    const messageBox = document.createElement('div');
    messageBox.innerText = 'Global settings saved successfully!';
    messageBox.className = 'fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-xl animate-fade-in-up';
    document.body.appendChild(messageBox);
    setTimeout(() => {
      document.body.removeChild(messageBox);
    }, 3000);
  };

  const handlePostAnnouncement = () => {
    console.log("Posting announcement:", announcement);
    setAnnouncement("");
    const messageBox = document.createElement('div');
    messageBox.innerText = 'Announcement posted successfully!';
    messageBox.className = 'fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-xl animate-fade-in-up';
    document.body.appendChild(messageBox);
    setTimeout(() => {
      document.body.removeChild(messageBox);
    }, 3000);
  };

  const handleRunDataCheck = () => {
    console.log("Running data integrity check...");
    const messageBox = document.createElement('div');
    messageBox.innerText = 'Data integrity check initiated. Results will be logged in audit logs.';
    messageBox.className = 'fixed bottom-4 right-4 bg-yellow-500 text-white p-4 rounded-lg shadow-xl animate-fade-in-up';
    document.body.appendChild(messageBox);
    setTimeout(() => {
      document.body.removeChild(messageBox);
    }, 4000);
  };

  const handleArchiveOldData = () => {
    console.log("Archiving old data...");
    const messageBox = document.createElement('div');
    messageBox.innerText = 'Bulk archiving of old data initiated.';
    messageBox.className = 'fixed bottom-4 right-4 bg-yellow-500 text-white p-4 rounded-lg shadow-xl animate-fade-in-up';
    document.body.appendChild(messageBox);
    setTimeout(() => {
      document.body.removeChild(messageBox);
    }, 4000);
  };

  const handleTriggerSecurityAlert = () => {
    console.log("Triggering a security alert...");
    const messageBox = document.createElement('div');
    messageBox.innerText = 'Security alert triggered. An incident report has been created.';
    messageBox.className = 'fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-xl animate-fade-in-up';
    document.body.appendChild(messageBox);
    setTimeout(() => {
      document.body.removeChild(messageBox);
    }, 4000);
  };

  const handleRunSystemBackup = () => {
    console.log("Running a full system backup...");
    const messageBox = document.createElement('div');
    messageBox.innerText = 'Full system backup initiated. This may take some time.';
    messageBox.className = 'fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-xl animate-fade-in-up';
    document.body.appendChild(messageBox);
    setTimeout(() => {
      document.body.removeChild(messageBox);
    }, 4000);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="text-gray-400" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <FaSortUp className="text-white" />;
    }
    return <FaSortDown className="text-white" />;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans overflow-hidden">
      <style>
        {`
        @keyframes fadeInOutUp {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        .animate-fade-in-up {
          animation: fadeInOutUp 3s ease-in-out forwards;
        }
        `}
      </style>
      <ConfirmationModal
        isOpen={showModal}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
        message={modalAction?.message}
      />
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAdd={handleAddUser}
        newUser={newUser}
        setNewUser={setNewUser}
      />

      <aside className="w-64 bg-white bg-opacity-10 backdrop-blur-md border-r border-white/20 p-6 flex flex-col items-center shadow-lg">
        <div className="flex flex-col items-center space-y-2 mb-12 text-white">
          <div className="bg-red-500 bg-opacity-50 p-3 rounded-full shadow-lg border border-red-400">
            <FaUserShield size={26} />
          </div>
          <span className="text-lg font-bold">Super Admin</span>
          <span className="px-3 py-1 bg-red-600 bg-opacity-50 rounded-full text-sm font-semibold border border-red-500">
            {role.toUpperCase()}
          </span>
        </div>

        <nav className="flex flex-col space-y-4 w-full">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 font-semibold ${activeSection === "dashboard"
              ? "bg-red-600 bg-opacity-40 text-white shadow-xl border border-red-500"
              : "hover:bg-white hover:bg-opacity-10 hover:shadow-lg"
              }`}
          >
            <FaChartLine />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveSection("manage-users")}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 font-semibold ${activeSection === "manage-users"
              ? "bg-red-600 bg-opacity-40 text-white shadow-xl border border-red-500"
              : "hover:bg-white hover:bg-opacity-10 hover:shadow-lg"
              }`}
          >
            <FaUsers />
            <span>Manage Users</span>
          </button>
          <button
            onClick={() => setActiveSection("file-oversight")}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 font-semibold ${activeSection === "file-oversight"
              ? "bg-red-600 bg-opacity-40 text-white shadow-xl border border-red-500"
              : "hover:bg-white hover:bg-opacity-10 hover:shadow-lg"
              }`}
          >
            <FaFileAlt />
            <span>File Oversight</span>
          </button>
          <button
            onClick={() => setActiveSection("system-health")}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 font-semibold ${activeSection === "system-health"
              ? "bg-red-600 bg-opacity-40 text-white shadow-xl border border-red-500"
              : "hover:bg-white hover:bg-opacity-10 hover:shadow-lg"
              }`}
          >
            <FaDatabase />
            <span>System Health</span>
          </button>
          <button
            onClick={() => setActiveSection("settings")}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 font-semibold ${activeSection === "settings"
              ? "bg-red-600 bg-opacity-40 text-white shadow-xl border border-red-500"
              : "hover:bg-white hover:bg-opacity-10 hover:shadow-lg"
              }`}
          >
            <FaCog />
            <span>Settings</span>
          </button>
        </nav>

        <div className="mt-auto w-full">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-3 p-3 rounded-xl w-full border border-red-500 text-red-400 font-semibold bg-red-500/20 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        user={userToEdit}
        onUpdate={handleUpdateUser}
      />

      <main className="flex-1 p-8 overflow-y-auto">
        {activeSection === "dashboard" && (
          <>
            <header className="mb-8 border-b border-red-500 pb-2">
              <h1 className="text-3xl font-bold text-red-400">
                Super Admin Dashboard
              </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
                <h2 className="text-gray-300">Registered Users</h2>
                <p className="text-4xl font-bold mt-2 text-white">{usageStats.totalUsers}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
                <h2 className="text-gray-300">Total Files Uploaded</h2>
                <p className="text-4xl font-bold mt-2 text-white">{usageStats.totalFiles}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
                <h2 className="text-gray-300">System Uptime</h2>
                <p className="text-4xl font-bold mt-2 text-white">{systemHealth.uptime}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
                <h2 className="text-gray-300">Most Active User</h2>
                <p className="text-xl font-bold mt-2 text-white">{usageStats.mostActiveUser}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
                <h2 className="text-gray-300">Most Popular Report</h2>
                <p className="text-xl font-bold mt-2 text-white">{usageStats.mostPopularReport}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
                <h2 className="text-gray-300">Peak Usage Time</h2>
                <p className="text-xl font-bold mt-2 text-white">{usageStats.peakUsage}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
              <h2 className="text-xl font-bold mb-4 text-red-400">System Overview</h2>
              <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                <p className="text-gray-300">This is the Chart Area</p>
              </div>
            </div>
          </>
        )}

        {activeSection === "manage-users" && (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 overflow-x-auto border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-400">All Registered Users</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="bg-green-600 bg-opacity-40 text-white font-bold p-2 rounded-lg hover:bg-green-700 transition-colors duration-300 border border-green-500/50 flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Add User</span>
                </button>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 text-white placeholder-gray-300 p-2 rounded-lg border border-white/20"
                />
              </div>
            </div>
            <table className="min-w-full divide-y divide-white/20">
              <thead>
                <tr>
                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => requestSort("fullname")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Full Name</span>
                      {renderSortIcon("fullname")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => requestSort("email")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      {renderSortIcon("email")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => requestSort("role")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Role</span>
                      {renderSortIcon("role")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => requestSort("isApproved")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Approved</span>
                      {renderSortIcon("isApproved")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => requestSort("createdAt")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Joined</span>
                      {renderSortIcon("createdAt")}
                    </div>
                  </th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAndFilteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5">
                    <td className="px-6 py-4">{u.fullname}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === "super-admin"
                          ? "bg-red-800 bg-opacity-50 text-white"
                          : u.role === "admin"
                            ? "bg-indigo-600 bg-opacity-50 text-white"
                            : "bg-green-600 bg-opacity-50 text-white"
                          }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={u.isApproved}
                        onChange={() => handleApprovalChange(u._id, !u.isApproved)}
                        className="form-checkbox h-5 w-5 text-red-600 bg-transparent border-red-500 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-white/10 text-white p-1 rounded-lg border border-white/20"
                      >
                        <option className="bg-gray-800" value="user">User</option>
                        <option className="bg-gray-800" value="admin">Admin</option>
                        <option className="bg-gray-800" value="super-admin">Super Admin</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-red-400 hover:text-red-600 p-2 rounded-lg"
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleRequestPasswordReset(u.email)}
                        className="text-blue-400 hover:text-blue-600 p-2 rounded-lg"
                        title="Reset Password"
                      >
                        <FaEnvelope />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(u)}
                        className="text-blue-400 hover:text-blue-600 p-2 rounded-lg"
                        title="Edit User"
                      >
                        <FaCog />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "file-oversight" && (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 overflow-x-auto border border-white/20">
            <h2 className="text-xl font-bold mb-4 text-red-400">Data & File Oversight</h2>
            <p className="mb-4 text-gray-300">Manage and monitor all uploaded files and system logs across the platform.</p>

            <h3 className="text-lg font-bold text-gray-300 mb-2">File Management</h3>
            <table className="min-w-full divide-y divide-white/20 mb-8">
              <thead>
                <tr>
                  <th className="px-6 py-3">File Name</th>
                  <th className="px-6 py-3">Owner</th>
                  <th className="px-6 py-3">Upload Date</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-white/5">
                    <td className="px-6 py-4">{file.name}</td>
                    <td className="px-6 py-4">{file.owner}</td>
                    <td className="px-6 py-4">{file.date}</td>
                    <td className="px-6 py-4">
                      <button className="text-red-400 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="text-lg font-bold text-gray-300 mb-2">Audit Logs</h3>
            <div className="h-64 overflow-y-auto bg-white/5 p-4 rounded-lg border border-white/10">
              {auditLogs.map(log => (
                <div key={log.id} className="mb-2 text-sm text-gray-300">
                  <span className="text-blue-300 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className="font-semibold text-white mr-1">{log.user}:</span>
                  <span>{log.details}</span>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold text-gray-300 mt-6 mb-2">Data Health</h3>
            <div className="flex space-x-4">
              <button
                onClick={handleRunDataCheck}
                className="flex-1 bg-yellow-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-300 border border-yellow-500/50 shadow-lg"
              >
                <FaCheck className="inline mr-2" />
                Run Data Integrity Check
              </button>
              <button
                onClick={handleArchiveOldData}
                className="flex-1 bg-purple-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300 border border-purple-500/50 shadow-lg"
              >
                <FaArchive className="inline mr-2" />
                Archive Old Files
              </button>
            </div>
          </div>
        )}

        {activeSection === "system-health" && (
          <>
            <h2 className="text-xl font-bold mb-4 text-red-400">System Performance and Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
                <h3 className="text-gray-300">Server Load</h3>
                <p className="text-4xl font-bold mt-2 text-white">{systemHealth.serverLoad}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
                <h3 className="text-gray-300">Database Status</h3>
                <p className="text-4xl font-bold mt-2 text-white">{systemHealth.databaseStatus}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-red-400">Error Logs</h3>
              <div className="h-40 overflow-y-auto bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                  <FaExclamationTriangle />
                  <span>[10:25 AM] User "user@example.com" attempted to delete file.</span>
                </div>
                <div className="flex items-center space-x-2 text-red-400 mb-2">
                  <FaTimes />
                  <span>[10:20 AM] API call to `/api/reports` failed with status 500.</span>
                </div>
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <FaCheck />
                  <span>[10:15 AM] Database connection successful.</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-red-400">Security & Backup</h3>
              <div className="flex space-x-4">
                <button
                  onClick={handleTriggerSecurityAlert}
                  className="flex-1 bg-red-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 border border-red-500/50 shadow-lg"
                  title="Trigger Security Alert"
                >
                  <FaLock className="inline mr-2" />
                  Trigger Security Alert
                </button>
                <button
                  onClick={handleRunSystemBackup}
                  className="flex-1 bg-blue-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 border border-blue-500/50 shadow-lg"
                  title="Run Full System Backup"
                >
                  <FaCloudDownloadAlt className="inline mr-2" />
                  Run Full System Backup
                </button>
              </div>
            </div>
          </>
        )}

        {activeSection === "settings" && (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 border border-white/20">
            <h2 className="text-xl font-bold mb-4 text-red-400">Global System Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300">Max File Size (MB)</label>
                <input
                  type="number"
                  name="maxFileSize"
                  value={globalSettings.maxFileSize}
                  onChange={handleSettingsChange}
                  className="w-full bg-white/10 p-2 rounded-lg mt-1 text-white border border-white/20"
                />
              </div>
              <div>
                <label className="block text-gray-300">Accepted File Formats</label>
                <input
                  type="text"
                  name="acceptedFormats"
                  value={globalSettings.acceptedFormats}
                  onChange={handleSettingsChange}
                  className="w-full bg-white/10 p-2 rounded-lg mt-1 text-white border border-white/20"
                />
              </div>
              <div>
                <label className="block text-gray-300">Data Retention Policy</label>
                <input
                  type="text"
                  name="dataRetentionPolicy"
                  value={globalSettings.dataRetentionPolicy}
                  onChange={handleSettingsChange}
                  className="w-full bg-white/10 p-2 rounded-lg mt-1 text-white border border-white/20"
                />
              </div>
              <button
                onClick={handleSaveSettings}
                className="w-full bg-blue-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 border border-blue-500/50 shadow-lg"
              >
                Save Settings
              </button>
            </div>

            <div className="mt-8 border-t border-white/20 pt-6">
              <h3 className="text-xl font-bold mb-4 text-red-400">Platform Announcements</h3>
              <textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Write your announcement here..."
                className="w-full h-24 bg-white/10 p-2 rounded-lg text-white border border-white/20 placeholder-gray-300"
              ></textarea>
              <button
                onClick={handlePostAnnouncement}
                className="mt-4 w-full bg-green-600 bg-opacity-40 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 border border-green-500/50 shadow-lg"
              >
                <FaBullhorn className="inline mr-2" />
                Post Announcement
              </button>
            </div>

            <div className="mt-8 border-t border-white/20 pt-6">
              <h3 className="text-xl font-bold mb-4 text-red-400">Integration Management</h3>
              <p className="text-gray-300">
                This section would allow for the configuration of third-party services like cloud storage or payment gateways.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;