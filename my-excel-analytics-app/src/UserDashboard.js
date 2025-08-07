import React, { useEffect } from 'react';
import { FaChartLine, FaTable, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <aside className="w-64 bg-white p-6 flex flex-col items-center shadow-lg">
        <div className="text-2xl font-bold mb-12">User Dashboard</div>
        <nav className="flex flex-col space-y-4 w-full">
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-colors bg-gray-200">
            <FaChartLine />
            <span>My Analytics</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-colors">
            <FaTable />
            <span>My Reports</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-colors">
            <FaUser />
            <span>Profile</span>
          </a>
        </nav>
        <div className="mt-auto w-full">
          <button onClick={handleLogout} className="flex items-center justify-center space-x-3 p-3 rounded-lg w-full hover:bg-red-100 text-red-600 transition-colors">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, User!</h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500">Total Projects</h2>
            <p className="text-3xl font-bold mt-2">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500">Recent Views</h2>
            <p className="text-3xl font-bold mt-2">156</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500">Last Active</h2>
            <p className="text-3xl font-bold mt-2">Today</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Your Recent Activity</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">This is the Chart Area</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;