import React, { useState, useEffect } from 'react';
import { FaChartLine, FaUsers, FaCog, FaSignOutAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'super-admin') {
      navigate('/login');
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        alert('Failed to fetch users.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('An error occurred while fetching users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        alert('User role updated successfully!');
        fetchUsers();
      } else {
        alert('Failed to update user role.');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('An error occurred while updating the role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('User deleted successfully!');
        fetchUsers();
      } else {
        alert('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-6 flex flex-col items-center">
        <div className="text-2xl font-bold mb-12">Super Admin</div>
        <nav className="flex flex-col space-y-4 w-full">
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors bg-gray-700">
            <FaChartLine />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
            <FaUsers />
            <span>Manage Users</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
            <FaCog />
            <span>Settings</span>
          </a>
        </nav>
        <div className="mt-auto w-full">
          <button onClick={handleLogout} className="flex items-center justify-center space-x-3 p-3 rounded-lg w-full hover:bg-red-600 transition-colors bg-red-500">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Manage Users</h1>
        </header>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">All Registered Users</h2>
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.fullname}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'super-admin' ? 'bg-red-800 text-red-100' :
                        user.role === 'admin' ? 'bg-indigo-600 text-indigo-100' : 'bg-green-600 text-green-100'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <select
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
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