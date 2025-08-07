import React, { useEffect } from 'react';
import { FaChartLine, FaUsers, FaTasks, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col items-center">
        <div className="text-2xl font-bold mb-12">Admin Panel</div>
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
            <FaTasks />
            <span>Manage Projects</span>
          </a>
        </nav>
        <div className="mt-auto w-full">
          <button onClick={handleLogout} className="flex items-center justify-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition-colors bg-red-500 w-full">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-gray-400">Registered Users</h2>
            <p className="text-3xl font-bold mt-2">1,500</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-gray-400">Total Projects</h2>
            <p className="text-3xl font-bold mt-2">250</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-gray-400">Pending Tasks</h2>
            <p className="text-3xl font-bold mt-2">15</p>
          </div>
        </div>

        {/* Main Chart Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">System Overview</h2>
          <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">This is the Chart Area</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;