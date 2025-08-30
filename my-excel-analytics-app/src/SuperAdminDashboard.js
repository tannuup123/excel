import { useAuth } from './contexts/AuthContext';
import { Link } from "react-router-dom";
import React, { useState, useEffect, useMemo, useContext } from "react";
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
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from './contexts/DarkModeContext';


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
  <div className="bg-white/70 dark:bg-white/10 backdrop-blur-md border border-gray-300 dark:border-white/30 rounded-2xl shadow-2xl max-w-lg w-full p-6 transition-all duration-300 transform scale-105">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Add New User</h3>
      <button
        onClick={onClose}
        className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition"
      >
        <FaTimes />
      </button>
    </div>

    <div className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={newUser.fullname}
        onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
        className="w-full bg-gray-100 dark:bg-white/10 p-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 border border-gray-300 dark:border-white/20"
      />
      <input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        className="w-full bg-gray-100 dark:bg-white/10 p-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 border border-gray-300 dark:border-white/20"
      />
      <select
        value={newUser.role}
        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        className="w-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white p-2 rounded-lg border border-gray-300 dark:border-white/20"
      >
        <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value="user">User</option>
        <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value="admin">Admin</option>
        <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value="super-admin">Super Admin</option>
      </select>

      {['admin', 'super-admin'].includes(newUser.role) && (
        <>
          <input
            type="text"
            placeholder="Phone Number"
            value={newUser.phoneNumber || ''}
            onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
            className="w-full bg-gray-100 dark:bg-white/10 p-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 border border-gray-300 dark:border-white/20"
          />
          <input
            type="text"
            placeholder="Employee ID"
            value={newUser.employeeId || ''}
            onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })}
            className="w-full bg-gray-100 dark:bg-white/10 p-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 border border-gray-300 dark:border-white/20"
          />
        </>
      )}

      <button
        onClick={onAdd}
        className="w-full bg-green-600/80 dark:bg-green-600/40 text-white font-bold py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-colors duration-300 border border-green-500/50 shadow-lg"
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans">
  <div className="bg-white dark:bg-gray-900 bg-opacity-20 dark:bg-opacity-30 backdrop-blur-md border border-white/30 dark:border-gray-700 rounded-2xl shadow-2xl max-w-lg w-full p-6 transition-all duration-300 transform scale-105">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold text-red-500 dark:text-red-400">Edit User Details</h3>
      <button onClick={onClose} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
        <FaTimes />
      </button>
    </div>

    <div className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={editedUser.fullname}
        onChange={(e) => setEditedUser({ ...editedUser, fullname: e.target.value })}
        className="w-full bg-white/10 dark:bg-gray-800/60 p-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-400 outline-none"
      />

      <input
        type="email"
        placeholder="Email"
        value={editedUser.email}
        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
        className="w-full bg-white/10 dark:bg-gray-800/60 p-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-400 outline-none"
      />

      <select
        value={editedUser.role}
        onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
        className="w-full bg-white/10 dark:bg-gray-800/60 text-gray-900 dark:text-white p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-400 outline-none"
      >
        <option className="bg-white dark:bg-gray-800 text-black dark:text-white" value="user">User</option>
        <option className="bg-white dark:bg-gray-800 text-black dark:text-white" value="admin">Admin</option>
        <option className="bg-white dark:bg-gray-800 text-black dark:text-white" value="super-admin">Super Admin</option>
      </select>

      <div className="flex space-x-2">
        <button
          onClick={onClose}
          className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-300 border border-gray-400 dark:border-gray-600 shadow-lg"
        >
          Cancel
        </button>
        <button
          onClick={() => onUpdate(editedUser)}
          className="flex-1 bg-red-500 dark:bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300 border border-red-500/50 shadow-lg"
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
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get the logout function from context
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [mockFiles, setMockFiles] = useState([]);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [user, setUser] = useState({ fullname: "", email: "", role: "" });
    const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
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
  const role = "super-admin";
  const API_URL = "http://localhost:5000/api";

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
    logout(); // This will clear the context state and localStorage
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
    <div className="flex h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black text-gray-700 dark:text-gray-300 font-sans overflow-hidden">
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

  {/* Confirmation & Modals */}
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
  <EditUserModal
    isOpen={isEditUserModalOpen}
    onClose={() => setIsEditUserModalOpen(false)}
    user={userToEdit}
    onUpdate={handleUpdateUser}
  />

  {/* Sidebar */}
  <aside className="w-64 bg-white/40 dark:bg-gray-900/60 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center shadow-lg">
    <div className="flex flex-col items-center space-y-2 mb-12 text-center">
      <div className="bg-red-600 p-3 rounded-full shadow-lg border border-red-600 text-white">
        <FaUserShield size={26} />
      </div>
      <span className="text-red-600 dark:text-red-400 text-lg font-bold">Super Admin</span>
      <span className="px-3 py-1 bg-red-600 dark:bg-red-700 rounded-full text-sm font-semibold text-white border border-red-500">
        {role.toUpperCase()}
      </span>
    </div>

    <nav className="flex flex-col space-y-4 w-full">
      {[
        { id: "dashboard", label: "Dashboard", icon: <FaChartLine /> },
        { id: "manage-users", label: "Manage Users", icon: <FaUsers /> },
        { id: "file-oversight", label: "File Oversight", icon: <FaFileAlt /> },
        { id: "system-health", label: "System Health", icon: <FaDatabase /> },
        { id: "settings", label: "Settings", icon: <FaCog /> }
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveSection(item.id)}
          className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 font-semibold ${
            activeSection === item.id
              ? "bg-red-600 text-white shadow-xl border border-red-500"
              : "hover:bg-red-100 dark:hover:bg-gray-800 hover:shadow-lg"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>

    <div className="mt-auto w-full">
      <button
        onClick={handleLogout}
        className="flex items-center justify-center space-x-3 p-3 rounded-xl w-full border border-red-500 bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg"
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </div>
  </aside>

  {/* Main Content */}
  <main className="flex-1 p-8 overflow-y-auto">
    <header className="mb-10 pb-6 border-b border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
                      <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Welcome, <span className="text-red-500">{user.fullname || "User"}</span> !</h1>
                       
                      </div>
                      <button onClick={toggleDarkMode} className={`p-3 rounded-full shadow-md transition-colors duration-300 ${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-700/10 text-gray-600 hover:bg-gray-700/20"}`}>
                        {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
                      </button>
                    </header>
    {activeSection === "dashboard" && (
      <>
        <header className="mb-8 border-b border-red-600 pb-2">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Super Admin Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Registered Users", value: usageStats.totalUsers },
            { title: "Total Files Uploaded", value: usageStats.totalFiles },
            { title: "System Uptime", value: systemHealth.uptime },
            { title: "Most Active User", value: usageStats.mostActiveUser },
            { title: "Most Popular Report", value: usageStats.mostPopularReport },
            { title: "Peak Usage Time", value: usageStats.peakUsage }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/50 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-gray-600 dark:text-gray-300">{stat.title}</h2>
              <p className="text-2xl md:text-4xl font-bold mt-2 text-red-600 dark:text-red-400">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/50 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">System Overview</h2>
          <div className="h-64 bg-white/20 dark:bg-gray-700/40 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
            <p className="text-gray-500 dark:text-gray-400">This is the Chart Area</p>
          </div>
        </div>
      </>
    )}

        {activeSection === "manage-users" && (
  <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 overflow-x-auto border border-gray-300 dark:border-white/20">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
        All Registered Users
      </h2>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-green-600 dark:bg-green-500 text-white font-bold p-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 border border-green-500/50 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add User</span>
        </button>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 p-2 rounded-lg border border-gray-300 dark:border-white/20"
        />
      </div>
    </div>

    <table className="min-w-full divide-y divide-gray-300 dark:divide-white/20">
      <thead>
        <tr className="text-gray-700 dark:text-gray-200">
          <th
            className="px-6 py-3 text-left cursor-pointer"
            onClick={() => requestSort("fullname")}
          >
            <div className="flex items-center space-x-1">
              <span>Full Name</span>
              {renderSortIcon("fullname")}
            </div>
          </th>
          <th
            className="px-6 py-3 text-left cursor-pointer"
            onClick={() => requestSort("email")}
          >
            <div className="flex items-center space-x-1">
              <span>Email</span>
              {renderSortIcon("email")}
            </div>
          </th>
          <th
            className="px-6 py-3 text-left cursor-pointer"
            onClick={() => requestSort("role")}
          >
            <div className="flex items-center space-x-1">
              <span>Role</span>
              {renderSortIcon("role")}
            </div>
          </th>
          <th
            className="px-6 py-3 text-center cursor-pointer"
            onClick={() => requestSort("isApproved")}
          >
            <div className="flex items-center justify-center space-x-1">
              <span>Approved</span>
              {renderSortIcon("isApproved")}
            </div>
          </th>
          <th
            className="px-6 py-3 text-left cursor-pointer"
            onClick={() => requestSort("createdAt")}
          >
            <div className="flex items-center space-x-1">
              <span>Joined</span>
              {renderSortIcon("createdAt")}
            </div>
          </th>
          <th className="px-6 py-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody className="text-gray-800 dark:text-gray-300">
        {sortedAndFilteredUsers.map((u) => (
          <tr
            key={u._id}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <td className="px-6 py-4 align-middle">{u.fullname}</td>
            <td className="px-6 py-4 align-middle">{u.email}</td>
            <td className="px-6 py-4 align-middle">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  u.role === "super-admin"
                    ? "bg-red-600 text-white"
                    : u.role === "admin"
                    ? "bg-indigo-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {u.role}
              </span>
            </td>
            <td className="px-6 py-4 align-middle text-center">
              <input
                type="checkbox"
                checked={u.isApproved}
                onChange={() => handleApprovalChange(u._id, !u.isApproved)}
                className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 dark:border-gray-600 focus:ring-blue-500"
              />
            </td>
            <td className="px-6 py-4 align-middle">
              {new Date(u.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 align-middle">
              <div className="flex justify-center items-center space-x-2">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  className="bg-white dark:bg-gray-800 dark:text-white text-gray-900 p-1 rounded-lg border border-gray-300 dark:border-white/20"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
                <button
                  onClick={() => handleDeleteUser(u._id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 p-2 rounded-lg"
                  title="Delete User"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => handleRequestPasswordReset(u.email)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 p-2 rounded-lg"
                  title="Reset Password"
                >
                  <FaEnvelope />
                </button>
                <button
                  onClick={() => handleOpenEditModal(u)}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-2 rounded-lg"
                  title="Edit User"
                >
                  <FaCog />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


       {activeSection === "file-oversight" && (
  <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 overflow-x-auto border border-gray-200/30 dark:border-white/20">
    <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
      Data & File Oversight
    </h2>
    <p className="mb-4 text-gray-600 dark:text-gray-300">
      Manage and monitor all uploaded files and system logs across the platform.
    </p>

    {/* === File Management === */}
    <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
      File Management
    </h3>
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mb-8">
      <thead className="bg-gray-100 dark:bg-gray-800/60">
        <tr>
          <th className="px-6 py-3 text-left font-semibold text-red-600 dark:text-red-400">File Name</th>
          <th className="px-6 py-3 text-left font-semibold text-red-600 dark:text-red-400">Owner</th>
          <th className="px-6 py-3 text-left font-semibold text-red-600 dark:text-red-400">Upload Date</th>
          <th className="px-6 py-3 text-center font-semibold text-red-600 dark:text-red-400">Actions</th>
        </tr>
      </thead>

      <tbody className="text-gray-700 dark:text-gray-300">
        {mockFiles.map((file) => (
          <tr
            key={file.id}
            className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
          >
            <td className="px-6 py-4 align-middle">{file.name}</td>
            <td className="px-6 py-4 align-middle">{file.owner}</td>
            <td className="px-6 py-4 align-middle">{file.date}</td>
            <td className="px-6 py-4 align-middle">
              <div className="flex justify-center items-center">
                <button
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                  title="Delete File"
                >
                  <FaTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* === Audit Logs === */}
    <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
      Audit Logs
    </h3>
    <div className="h-64 overflow-y-auto bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      {auditLogs.map(log => (
        <div key={log.id} className="mb-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="text-red-500 dark:text-red-400 mr-2">
            [{new Date(log.timestamp).toLocaleTimeString()}]
          </span>
          <span className="font-semibold text-gray-900 dark:text-white mr-1">{log.user}:</span>
          <span className="text-gray-600 dark:text-gray-400">{log.details}</span>
        </div>
      ))}
    </div>

    {/* === Data Health === */}
    <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mt-6 mb-2">
      Data Health
    </h3>
    <div className="flex space-x-4">
      <button
        onClick={handleRunDataCheck}
        className="flex-1 bg-red-600 dark:bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-400 transition-colors duration-300 border border-yellow-500/50 shadow-lg"
      >
        <FaCheck className="inline mr-2" />
        Run Data Integrity Check
      </button>
      <button
        onClick={handleArchiveOldData}
        className="flex-1 bg-green-600 dark:bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-400 transition-colors duration-300 border border-purple-500/50 shadow-lg"
      >
        <FaArchive className="inline mr-2" />
        Archive Old Files
      </button>
    </div>
  </div>
)}

        {activeSection === "system-health" && (
  <>
    <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
      System Performance and Health
    </h2>

    {/* Server & DB Status */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/20 transition-colors">
        <h3 className="text-red-600 dark:text-red-400 font-bold">Server Load</h3>
        <p className="text-4xl font-bold mt-2 text-gray-800 dark:text-white">
          {systemHealth.serverLoad}
        </p>
      </div>
      <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/20 transition-colors">
        <h3 className="text-red-600 dark:text-red-400 font-bold">Database Status</h3>
        <p className="text-4xl font-bold mt-2 text-gray-800 dark:text-white">
          {systemHealth.databaseStatus}
        </p>
      </div>
    </div>

    {/* Error Logs */}
    <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 border border-gray-200 dark:border-white/20 transition-colors">
      <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Error Logs</h3>
      <div className="h-40 overflow-y-auto bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-white/10 transition-colors">
        <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400 mb-2">
          <FaExclamationTriangle />
          <span>[10:25 AM] User "user@example.com" attempted to delete file.</span>
        </div>
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 mb-2">
          <FaTimes />
          <span>[10:20 AM] API call to `/api/reports` failed with status 500.</span>
        </div>
        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 mb-2">
          <FaCheck />
          <span>[10:15 AM] Database connection successful.</span>
        </div>
      </div>
    </div>

    {/* Security & Backup */}
    <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/20 transition-colors">
      <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Security & Backup</h3>
      <div className="flex space-x-4">
        <button
          onClick={handleTriggerSecurityAlert}
          className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 border border-red-500/50 shadow-lg"
          title="Trigger Security Alert"
        >
          <FaLock className="inline mr-2" />
          Trigger Security Alert
        </button>
        <button
          onClick={handleRunSystemBackup}
          className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 border border-blue-500/50 shadow-lg"
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
  <div className="bg-white/10 dark:bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 border border-white/20 dark:border-gray-700/50 transition-colors duration-300">
    <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Global System Settings</h2>

    <div className="space-y-4">
      <div>
        <label className="block text-red-600 dark:text-red-400">Max File Size (MB)</label>
        <input
          type="number"
          name="maxFileSize"
          value={globalSettings.maxFileSize}
          onChange={handleSettingsChange}
          className="w-full bg-white/10 dark:bg-gray-900/40 p-2 rounded-lg mt-1 text-gray-700 dark:text-gray-100 border border-white/20 dark:border-gray-700/50 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <div>
        <label className="block text-red-600 dark:text-red-400">Accepted File Formats</label>
        <input
          type="text"
          name="acceptedFormats"
          value={globalSettings.acceptedFormats}
          onChange={handleSettingsChange}
          className="w-full bg-white/10 dark:bg-gray-900/40 p-2 rounded-lg mt-1 text-gray-700 dark:text-gray-100 border border-white/20 dark:border-gray-700/50 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <div>
        <label className="block text-red-600 dark:text-red-400">Data Retention Policy</label>
        <input
          type="text"
          name="dataRetentionPolicy"
          value={globalSettings.dataRetentionPolicy}
          onChange={handleSettingsChange}
          className="w-full bg-white/10 dark:bg-gray-900/40 p-2 rounded-lg mt-1 text-gray-700 dark:text-gray-100 border border-white/20 dark:border-gray-700/50 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <button
        onClick={handleSaveSettings}
        className="w-full bg-red-600 dark:bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300 border border-red-500/50 shadow-lg"
      >
        Save Settings
      </button>
    </div>

    {/* Platform Announcements */}
    <div className="mt-8 border-t border-white/20 dark:border-gray-700/50 pt-6">
      <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Platform Announcements</h3>
      <textarea
        value={announcement}
        onChange={(e) => setAnnouncement(e.target.value)}
        placeholder="Write your announcement here..."
        className="w-full h-24 bg-white/10 dark:bg-gray-900/40 p-2 rounded-lg text-gray-700 dark:text-gray-100 border border-white/20 dark:border-gray-700/50 placeholder-gray-600 dark:placeholder-gray-400"
      ></textarea>
      <button
        onClick={handlePostAnnouncement}
        className="mt-4 w-full bg-green-600 dark:bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 border border-green-500/50 shadow-lg"
      >
        <FaBullhorn className="inline mr-2" />
        Post Announcement
      </button>
    </div>

    {/* Integration Management */}
    <div className="mt-8 border-t border-white/20 dark:border-gray-700/50 pt-6">
      <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Integration Management</h3>
      <p className="text-gray-700 dark:text-gray-300">
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