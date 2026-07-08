import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        // Wait for logout to complete
        await dispatch(logout()).unwrap();
        console.log('Admin logged out successfully');
        
        // Navigate to login page
        navigate('/admin');
        
        // Force reload to clear all state
        window.location.reload();
      } catch (error) {
        console.error('Logout error:', error);
        // Even if error, clear and redirect
        localStorage.clear();
        navigate('/admin');
        window.location.reload();
      }
    }
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/pending-developers', label: 'Pending Approvals' },
    { path: '/admin/apps', label: 'Apps' },
    { path: '/admin/statistics', label: 'Statistics' },
    { path: '/admin/developers', label: 'Developers' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-2">
          <img 
            src="/AyubStoreLogo.png" 
            alt="AyubStore" 
            className="h-10 w-auto"
          />
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">AyubStore Management</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200 text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-600' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;