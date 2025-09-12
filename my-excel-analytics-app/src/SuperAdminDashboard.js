import { useAuth } from './contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  FaChartLine, FaUsers, FaCog, FaSignOutAlt, FaTrash, FaUserShield, FaFileAlt,
  FaBullhorn, FaDatabase, FaTimes, FaCheck, FaExclamationTriangle, FaSort,
  FaSortUp, FaSortDown, FaPlus, FaLock, FaArchive, FaCloudDownloadAlt,
  FaEnvelope, FaSun, FaMoon, FaBars,
} from "react-icons/fa";
import { DarkModeContext } from './contexts/DarkModeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onCancel, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 font-sans">
      <div className="bg-white/20 dark:bg-gray-800/50 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl max-w-sm w-full text-center p-6 transition-all duration-300 transform scale-105">
        <p className="text-white text-lg mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button onClick={onCancel} className="flex-1 bg-gray-600/40 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 border border-gray-500/50">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red-600/40 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 border border-red-500/50">
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
    <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-md border border-gray-300 dark:border-white/30 rounded-2xl shadow-2xl max-w-lg w-full p-6 transition-all duration-300 transform scale-105">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Add New User</h3>
        <button onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition">
          <FaTimes />
        </button>
      </div>
      <div className="space-y-4">
        <input type="text" placeholder="Full Name" value={newUser.fullname} onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })} className="w-full bg-gray-100 dark:bg-white/10 p-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 border border-gray-300 dark:border-white/20"/>
        <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-full bg-gray-100 dark:bg-white/10 p-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 border border-gray-300 dark:border-white/20"/>
        <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white p-2 rounded-lg border border-gray-300 dark:border-white/20">
          <option className="bg-white dark:bg-gray-800" value="user">User</option>
          <option className="bg-white dark:bg-gray-800" value="admin">Admin</option>
          <option className="bg-white dark:bg-gray-800" value="super-admin">Super Admin</option>
        </select>
        {['admin', 'super-admin'].includes(newUser.role) && (
          <>
            <input type="text" placeholder="Phone Number" value={newUser.phoneNumber || ''} onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })} className="w-full bg-gray-100 dark:bg-white/10 p-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 border border-gray-300 dark:border-white/20"/>
            <input type="text" placeholder="Employee ID" value={newUser.employeeId || ''} onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })} className="w-full bg-gray-100 dark:bg-white/10 p-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 border border-gray-300 dark:border-white/20"/>
          </>
        )}
        <button onClick={onAdd} className="w-full bg-green-600/80 dark:bg-green-600/40 text-white font-bold py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-colors duration-300 border border-green-500/50 shadow-lg">
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
      <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-md border border-white/30 dark:border-gray-700 rounded-2xl shadow-2xl max-w-lg w-full p-6 transition-all duration-300 transform scale-105">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-500 dark:text-red-400">Edit User Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
            <FaTimes />
          </button>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Full Name" value={editedUser.fullname} onChange={(e) => setEditedUser({ ...editedUser, fullname: e.target.value })} className="w-full bg-white/10 dark:bg-gray-800/60 p-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-400 outline-none"/>
          <input type="email" placeholder="Email" value={editedUser.email} onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })} className="w-full bg-white/10 dark:bg-gray-800/60 p-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-400 outline-none"/>
          <select value={editedUser.role} onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })} className="w-full bg-white/10 dark:bg-gray-800/60 text-gray-900 dark:text-white p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-400 outline-none">
            <option className="bg-white dark:bg-gray-800" value="user">User</option>
            <option className="bg-white dark:bg-gray-800" value="admin">Admin</option>
            <option className="bg-white dark:bg-gray-800" value="super-admin">Super Admin</option>
          </select>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button onClick={onClose} className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-300 border border-gray-400 dark:border-gray-600 shadow-lg">
              Cancel
            </button>
            <button onClick={() => onUpdate(editedUser)} className="flex-1 bg-red-500 dark:bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300 border border-red-500/50 shadow-lg">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [activeSection, setActiveSection] = useState("dashboard");
  
  // State Management
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState({});
  const [usageStats, setUsageStats] = useState({});
  const [systemHealth, setSystemHealth] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [globalSettings, setGlobalSettings] = useState({});
  const [userGrowthData, setUserGrowthData] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [announcement, setAnnouncement] = useState("");

  // Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [newUser, setNewUser] = useState({ fullname: "", email: "", role: "user", phoneNumber: "", employeeId: "" });
  
  const API_URL = "http://localhost:5000/api";

  // --- HELPERS ---
  const showTemporaryMessage = (message, type = 'success') => {
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const messageBox = document.createElement('div');
    messageBox.innerText = message;
    messageBox.className = `fixed bottom-4 right-4 ${bgColor} text-white p-4 rounded-lg shadow-xl animate-fade-in-up z-[10000]`;
    document.body.appendChild(messageBox);
    setTimeout(() => {
        if(document.body.contains(messageBox)) {
            document.body.removeChild(messageBox);
        }
    }, 4000);
  };
  
  const handleApiCall = async (endpoint, method = 'GET', body = null) => {
    try {
      const token = localStorage.getItem("token");
      const options = {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      };
      if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }
      const res = await fetch(`${API_URL}${endpoint}`, options);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `API call to ${endpoint} failed`);
      }
      if (res.status === 204 || (res.status === 200 && res.headers.get('content-length') === '0')) {
        return true;
      }
      return await res.json();
    } catch (err) {
      showTemporaryMessage(err.message, 'error');
      console.error(err);
      throw err;
    }
  };

  // --- DATA FETCHING ---
  const fetchAllData = async () => {
    try {
        setLoading(true);
        const [
            usersData, filesData, statsData, logsData,
            healthData, settingsData, growthData, profileData
        ] = await Promise.all([
            handleApiCall("/users"),
            handleApiCall("/admin/files"),
            handleApiCall("/admin/stats"),
            handleApiCall("/admin/recent-activities"),
            handleApiCall("/admin/system-health"),
            handleApiCall("/admin/settings"),
            handleApiCall("/admin/user-growth"),
            handleApiCall("/users/profile"),
        ]);

        setUsers(usersData || []);
        setFiles(filesData || []);
        setUsageStats(statsData || {});
        setAuditLogs(logsData ? logsData.map(log => ({ ...log, id: log._id })) : []);
        setSystemHealth(healthData || {});
        setGlobalSettings(settingsData || {});
        setUserGrowthData(growthData || []);
        setUser(profileData || {});

    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "super-admin") {
        navigate("/login");
    } else {
        fetchAllData();
    }
  }, [navigate]);

  useEffect(() => {
    if (activeSection === "manage-users") handleApiCall("/users").then(data => setUsers(data || []));
    if (activeSection === "file-oversight") handleApiCall("/admin/files").then(data => setFiles(data || []));
  }, [activeSection]);


const handleAddUser = () => {
    if (!newUser.fullname || !newUser.email || !newUser.role) {
      return showTemporaryMessage("Please fill all required fields.", 'error');
    }
    handleApiCall('/users', 'POST', newUser)
      .then(() => {
        showTemporaryMessage('New user added successfully!');
        setIsAddUserModalOpen(false);
        setNewUser({ fullname: "", email: "", role: "user", phoneNumber: "", employeeId: "" });
        return handleApiCall("/users");
      })
      .then(data => setUsers(data || []))
      .catch(err => {
        console.error("Error was caught in handleAddUser:", err);
      });
};
  
  const handleUpdateUser = (updatedUser) => {
    setIsEditUserModalOpen(false);
    setModalAction({
      type: 'update-user',
      data: updatedUser,
      message: `Are you sure you want to save changes for '${updatedUser.fullname}'?`
    });
    setShowConfirmModal(true);
  };

  const handleDeleteUser = (user) => {
    setModalAction({
      type: 'delete-user',
      data: user,
      message: `Are you sure you want to delete the account for '${user.email}'?`
    });
    setShowConfirmModal(true);
  };

  const handleDeleteFile = (file) => {
    setModalAction({
      type: 'delete-file',
      data: file,
      message: `Are you sure you want to delete the file '${file.fileName}'?`
    });
    setShowConfirmModal(true);
  };

  const handleApprovalChange = (id, newStatus) => {
    setModalAction({
        type: 'approve',
        data: { id, status: newStatus },
        message: `Are you sure you want to ${newStatus ? "approve" : "deactivate"} this user?`
    });
    setShowConfirmModal(true);
  };
  
  const handleRoleChange = (id, newRole) => {
    setModalAction({
        type: 'role',
        data: { id, role: newRole },
        message: `Change this user's role to ${newRole}?`
    });
    setShowConfirmModal(true);
  };

  const handleRequestPasswordReset = (email) => {
    setModalAction({
      type: 'reset-password',
      data: { email },
      message: `Send a password reset link to ${email}?`
    });
    setShowConfirmModal(true);
  };

  // --- MODAL CONFIRMATION LOGIC ---
  const handleModalConfirm = async () => {
    if (!modalAction) return;

    const { type, data } = modalAction;
    let promise;

    switch (type) {
      case 'approve':
        promise = handleApiCall(`/users/${data.id}/approve`, 'PUT', { isApproved: data.status });
        break;
      case 'role':
        promise = handleApiCall(`/users/${data.id}/role`, 'PUT', { role: data.role });
        break;
      case 'update-user':
        promise = handleApiCall(`/users/${data._id}`, 'PUT', data);
        break;
      case 'delete-user':
        promise = handleApiCall(`/users/${data._id}`, 'DELETE');
        break;
      case 'delete-file':
        promise = handleApiCall(`/admin/files/${data._id}`, 'DELETE');
        break;
      case 'reset-password':
        promise = handleApiCall('/users/request-password-reset', 'POST', { email: data.email });
        break;
      default:
        promise = Promise.reject(new Error("Unknown action type"));
    }

    promise.then(() => {
        showTemporaryMessage(`Action '${type.replace('-', ' ')}' completed successfully.`);
        if (type.includes('user') || type.includes('approve') || type.includes('role')) {
            handleApiCall("/users").then(setUsers);
        }
        if (type.includes('file')) {
            handleApiCall("/admin/files").then(setFiles);
        }
    }).catch(err => {
      console.error(err);
    });

    setShowConfirmModal(false);
    setModalAction(null);
  };

  const handleModalCancel = () => {
    setShowConfirmModal(false);
    setModalAction(null);
  };
  

  // --- SETTINGS & SYSTEM ACTIONS ---
  const handleSaveSettings = () => {
    handleApiCall('/admin/settings', 'PUT', globalSettings)
      .then(() => showTemporaryMessage('Settings saved successfully!'));
  };

  const handlePostAnnouncement = () => {
    if (!announcement.trim()) return showTemporaryMessage("Announcement cannot be empty.", 'error');
    handleApiCall('/admin/announcements', 'POST', { message: announcement })
      .then(() => {
        showTemporaryMessage('Announcement posted!');
        setAnnouncement("");
      });
  };
  
  const handleSystemAction = (action) => {
    const messages = {
      'data-integrity-check': 'Data integrity check initiated.',
      'archive-old-data': 'Archiving process initiated.',
      'trigger-security-alert': 'Security alert triggered and logged.',
      'run-system-backup': 'System backup initiated.',
    };
    console.log(`Performing action: ${action}`);
    showTemporaryMessage(messages[action]);
  };

  // --- UI & RENDERING ---
  const sortedAndFilteredUsers = useMemo(() => {
    if (!users || users.length === 0) return [];
    let processedUsers = [...users];

    if (searchTerm) {
      processedUsers = processedUsers.filter(user =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key) {
      processedUsers.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return processedUsers;
  }, [users, searchTerm, sortConfig]);

  const requestSort = (key) => {
    const direction = (sortConfig.key === key && sortConfig.direction === 'ascending') ? 'descending' : 'ascending';
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === 'ascending' ? <FaSortUp className="text-white" /> : <FaSortDown className="text-white" />;
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };
  
  const openEditModal = (user) => {
    setUserToEdit(user);
    setIsEditUserModalOpen(true);
  };

  return (
    <div className="relative flex h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black text-gray-700 dark:text-gray-300 font-sans overflow-hidden">
      <style>{`.animate-fade-in-up { animation: fadeInOutUp 4s ease-in-out forwards; } @keyframes fadeInOutUp { 0% { opacity: 0; transform: translateY(20px); } 10% { opacity: 1; transform: translateY(0); } 90% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }`}</style>
      
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      <ConfirmationModal isOpen={showConfirmModal} onCancel={handleModalCancel} onConfirm={handleModalConfirm} message={modalAction?.message} />
      <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} onAdd={handleAddUser} newUser={newUser} setNewUser={setNewUser} />
      <EditUserModal isOpen={isEditUserModalOpen} onClose={() => setIsEditUserModalOpen(false)} user={userToEdit} onUpdate={handleUpdateUser} />
      
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white/40 dark:bg-gray-900/60 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:fixed`}>
        <div className="flex flex-col items-center space-y-2 mb-12 text-center">
          <div className="bg-red-600 p-3 rounded-full shadow-lg border border-red-600 text-white">
            <FaUserShield size={26} />
          </div>
          <span className="text-red-600 dark:text-red-400 text-lg font-bold">Super Admin</span>
          <span className="px-3 py-1 bg-red-600 dark:bg-red-700 rounded-full text-sm font-semibold text-white border border-red-500">
            {user.role ? user.role.toUpperCase() : '...'}
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
          <button key={item.id} onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); }} className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 font-semibold ${activeSection === item.id ? "bg-red-600 text-white shadow-xl border border-red-500" : "hover:bg-red-100 dark:hover:bg-gray-800 hover:shadow-lg"}`}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
        </nav>
        <div className="mt-auto w-full">
          <button onClick={handleLogout} className="flex items-center justify-center space-x-3 p-3 rounded-xl w-full border border-red-500 bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto transition-all duration-300 lg:ml-64">
        <header className="mb-10 pb-6 border-b border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-gray-600 dark:text-gray-300 mr-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
              <FaBars size={24} />
            </button>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">Welcome, <span className="text-red-500">{user.fullname || "Admin"}</span>!</h1>
          </div>
          <button onClick={toggleDarkMode} className={`p-3 rounded-full shadow-md transition-colors duration-300 ${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-700/10 text-gray-600 hover:bg-gray-700/20"}`}>
            {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>
        </header>

        {loading ? <div className="flex justify-center items-center h-64 text-xl animate-pulse text-red-500">Loading Dashboard Data...</div> :
        <>
          {activeSection === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {[
                { title: "Registered Users", value: usageStats.totalUsers ?? 'N/A' },
                { title: "Total Files Uploaded", value: usageStats.totalFilesUploaded ?? 'N/A' },
                { title: "System Uptime", value: systemHealth.uptime ?? 'N/A' },
                { title: "Most Active User", value: usageStats.mostActiveUser ?? 'N/A' },
                { title: "Most Popular Report", value: usageStats.mostPopularReport ?? 'N/A' },
                { title: "Peak Usage Time", value: usageStats.peakUsageTime ?? 'N/A' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/50 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-gray-600 dark:text-gray-300">{stat.title}</h2>
                  <p className="text-2xl md:text-xl font-bold mt-2 text-red-600 dark:text-red-400 truncate">{stat.value}</p>
                </div>
              ))}
              </div>
              <div className="bg-white/50 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">System Overview: User Growth</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#4A5568" : "#E2E8F0"} />
                      <XAxis dataKey="_id" tick={{ fill: isDarkMode ? '#CBD5E0' : '#4A5568' }} />
                      <YAxis tick={{ fill: isDarkMode ? '#CBD5E0' : '#4A5568' }} />
                      <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#2D3748' : '#FFFFFF', border: '1px solid #E2E8F0' }} />
                      <Legend />
                      <Bar dataKey="count" fill="#EF4444" name="New Users" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {activeSection === "manage-users" && (
            <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl mb-8 border border-gray-300 dark:border-white/20">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400">All Registered Users</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button onClick={() => setIsAddUserModalOpen(true)} className="bg-green-600 dark:bg-green-500 text-white font-bold p-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 border border-green-500/50 flex items-center justify-center space-x-2">
                    <FaPlus /><span>Add User</span>
                  </button>
                  <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 p-2 rounded-lg border border-gray-300 dark:border-white/20 w-full sm:w-auto"/>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-white/20">
                  <thead>
                    <tr className="text-gray-700 dark:text-gray-200">
                      <th className="px-6 py-3 text-left cursor-pointer" onClick={() => requestSort("fullname")}><div className="flex items-center space-x-1"><span>Full Name</span>{renderSortIcon("fullname")}</div></th>
                      <th className="px-6 py-3 text-left cursor-pointer" onClick={() => requestSort("email")}><div className="flex items-center space-x-1"><span>Email</span>{renderSortIcon("email")}</div></th>
                      <th className="px-6 py-3 text-left cursor-pointer" onClick={() => requestSort("role")}><div className="flex items-center space-x-1"><span>Role</span>{renderSortIcon("role")}</div></th>
                      <th className="px-6 py-3 text-center cursor-pointer" onClick={() => requestSort("isApproved")}><div className="flex items-center justify-center space-x-1"><span>Approved</span>{renderSortIcon("isApproved")}</div></th>
                      <th className="px-6 py-3 text-left cursor-pointer" onClick={() => requestSort("createdAt")}><div className="flex items-center space-x-1"><span>Joined</span>{renderSortIcon("createdAt")}</div></th>
                      <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 dark:text-gray-300">
                  {sortedAndFilteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                      <td className="px-6 py-4 align-middle">{u.fullname}</td>
                      <td className="px-6 py-4 align-middle">{u.email}</td>
                      <td className="px-6 py-4 align-middle"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${ u.role === "super-admin" ? "bg-red-600 text-white" : u.role === "admin" ? "bg-indigo-600 text-white" : "bg-green-600 text-white"}`}>{u.role}</span></td>
                      <td className="px-6 py-4 align-middle text-center"><input type="checkbox" checked={u.isApproved} onChange={() => handleApprovalChange(u._id, !u.isApproved)} className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 dark:border-gray-600 focus:ring-blue-500"/></td>
                      <td className="px-6 py-4 align-middle">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex justify-center items-center space-x-2">
                          <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} className="bg-white dark:bg-gray-800 dark:text-white text-gray-900 p-1 rounded-lg border border-gray-300 dark:border-white/20">
                            <option value="user">User</option><option value="admin">Admin</option><option value="super-admin">Super Admin</option>
                          </select>
                          <button onClick={() => handleDeleteUser(u)} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 p-2 rounded-lg" title="Delete User"><FaTrash /></button>
                          <button onClick={() => handleRequestPasswordReset(u.email)} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 p-2 rounded-lg" title="Reset Password"><FaEnvelope /></button>
                          <button onClick={() => openEditModal(u)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-2 rounded-lg" title="Edit User"><FaCog /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeSection === "file-oversight" && (
            <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl mb-8 border border-gray-200/30 dark:border-white/20">
              <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Data & File Oversight</h2>
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800/60">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-red-600 dark:text-red-400">File Name</th>
                      <th className="px-6 py-3 text-left font-semibold text-red-600 dark:text-red-400">Owner</th>
                      <th className="px-6 py-3 text-left font-semibold text-red-600 dark:text-red-400">Upload Date</th>
                      <th className="px-6 py-3 text-center font-semibold text-red-600 dark:text-red-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300">
                  {files.map((file) => (
                    <tr key={file._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4 align-middle">{file.fileName}</td>
                      <td className="px-6 py-4 align-middle">{file.user ? file.user.email : "N/A"}</td>
                      <td className="px-6 py-4 align-middle">{new Date(file.uploadDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 align-middle text-center">
                        <button onClick={() => handleDeleteFile(file)} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200" title="Delete File"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Audit Logs</h3>
              <div className="h-64 overflow-y-auto bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              {auditLogs.map(log => (
                <div key={log.id} className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-red-500 dark:text-red-400 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className="font-semibold text-gray-900 dark:text-white mr-1">{log.user?.email ?? 'System'}:</span>
                  <span className="text-gray-600 dark:text-gray-400">{log.details}</span>
                </div>
              ))}
              </div>
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mt-6 mb-2">Data Health</h3>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button onClick={() => handleSystemAction('data-integrity-check')} className="flex-1 bg-yellow-500 text-white font-bold py-2 rounded-lg hover:bg-yellow-600 shadow-lg"><FaCheck className="inline mr-2" />Run Data Integrity Check</button>
                <button onClick={() => handleSystemAction('archive-old-data')} className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 shadow-lg"><FaArchive className="inline mr-2" />Archive Old Files</button>
              </div>
            </div>
          )}

          {activeSection === "system-health" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">System Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/20">
                  <h3 className="text-red-600 dark:text-red-400 font-bold">Server Load</h3>
                  <p className="text-4xl font-bold mt-2 text-gray-800 dark:text-white">{systemHealth.serverLoad}</p>
                </div>
                <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/20">
                  <h3 className="text-red-600 dark:text-red-400 font-bold">Database Status</h3>
                  <p className="text-4xl font-bold mt-2 text-gray-800 dark:text-white">{systemHealth.databaseStatus}</p>
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 border border-gray-200 dark:border-white/20">
                <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Recent Errors</h3>
                <div className="h-40 overflow-y-auto bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-white/10">
                  {auditLogs.filter(log => log.action.toLowerCase().includes('fail')).map(log => (
                    <div key={log.id} className="flex items-center space-x-2 text-red-500 dark:text-red-400 mb-2">
                        <FaExclamationTriangle />
                        <span>[{new Date(log.timestamp).toLocaleTimeString()}] {log.details} by {log.user?.email ?? 'System'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-white/20">
                <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Security & Backup</h3>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button onClick={() => handleSystemAction('trigger-security-alert')} className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 border border-red-500/50 shadow-lg"><FaLock className="inline mr-2" />Trigger Security Alert</button>
                  <button onClick={() => handleSystemAction('run-system-backup')} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 border border-blue-500/50 shadow-lg"><FaCloudDownloadAlt className="inline mr-2" />Run Full System Backup</button>
                </div>
              </div>
            </>
          )}

          {activeSection === "settings" && (
            <div className="bg-white/10 dark:bg-gray-800/40 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl mb-8 border border-white/20 dark:border-gray-700/50">
              <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Global Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-red-600 dark:text-red-400">Max File Size (MB)</label>
                  <input type="number" name="maxFileSize" value={globalSettings.maxFileSize || ''} onChange={(e) => setGlobalSettings({...globalSettings, maxFileSize: e.target.value})} className="w-full bg-white/10 dark:bg-gray-900/40 p-2 rounded-lg mt-1 border border-white/20 dark:border-gray-700/50"/>
                </div>
                <div>
                  <label className="block text-red-600 dark:text-red-400">Accepted File Formats</label>
                  <input type="text" name="acceptedFormats" value={globalSettings.acceptedFormats || ''} onChange={(e) => setGlobalSettings({...globalSettings, acceptedFormats: e.target.value})} className="w-full bg-white/10 dark:bg-gray-900/40 p-2 rounded-lg mt-1 border border-white/20 dark:border-gray-700/50"/>
                </div>
                <div>
                  <label className="block text-red-600 dark:text-red-400">Data Retention Policy</label>
                  <input type="text" name="dataRetentionPolicy" value={globalSettings.dataRetentionPolicy || ''} onChange={(e) => setGlobalSettings({...globalSettings, dataRetentionPolicy: e.target.value})} className="w-full bg-white/10 dark:bg-gray-900/40 p-2 rounded-lg mt-1 border border-white/20 dark:border-gray-700/50"/>
                </div>
                <button onClick={handleSaveSettings} className="w-full bg-red-600 dark:bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300 border border-red-500/50 shadow-lg">Save Settings</button>
              </div>
              <div className="mt-8 border-t border-white/20 dark:border-gray-700/50 pt-6">
                <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Platform Announcements</h3>
                <textarea value={announcement} onChange={(e) => setAnnouncement(e.target.value)} placeholder="Write an announcement..." className="w-full h-24 bg-white/10 dark:bg-gray-900/40 p-2 rounded-lg border border-white/20 dark:border-gray-700/50"></textarea>
                <button onClick={handlePostAnnouncement} className="mt-4 w-full bg-green-600 dark:bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 border border-green-500/50 shadow-lg"><FaBullhorn className="inline mr-2" /> Post Announcement</button>
              </div>
              <div className="mt-8 border-t border-white/20 dark:border-gray-700/50 pt-6">
                <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Integration Management</h3>
                <p className="text-gray-700 dark:text-gray-300">This section would allow for the configuration of third-party services.</p>
              </div>
            </div>
          )}
        </>
      }
      </main>
    </div>
  );
};

export default SuperAdminDashboard;