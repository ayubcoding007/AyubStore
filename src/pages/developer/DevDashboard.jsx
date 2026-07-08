import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getMyApps } from '../../store/appSlice';

const DevDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { myApps, isLoading } = useSelector((state) => state.apps);
  const dispatch = useDispatch();
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    dispatch(getMyApps());
  }, [dispatch]);

  useEffect(() => {
    if (myApps && myApps.length > 0) {
      // Sort by createdAt and get latest 3
      const sorted = [...myApps].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentApps(sorted.slice(0, 3));
    }
  }, [myApps]);

  // Calculate stats
  const totalApps = myApps?.length || 0;
  const totalDownloads = myApps?.reduce((sum, app) => sum + (app.downloads || 0), 0) || 0;
  const approvedApps = myApps?.filter(app => app.status === 'approved').length || 0;
  const pendingApps = myApps?.filter(app => app.status === 'pending' || app.status === 'blocked').length || 0;

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Developer Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your apps and track performance</p>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'D'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome, {user?.name || user?.email || 'Developer'}! 
            </h2>
            <p className="text-gray-500 text-sm">
              You have {totalApps} app{totalApps !== 1 ? 's' : ''} in the store
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Total Apps</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalApps}</p>
          <p className="text-xs text-gray-400 mt-1">Uploaded apps</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Total Downloads</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalDownloads}</p>
          <p className="text-xs text-gray-400 mt-1">All time downloads</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Approved Apps</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{approvedApps}</p>
          <p className="text-xs text-gray-400 mt-1">Live on store</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Pending Apps</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingApps}</p>
          <p className="text-xs text-gray-400 mt-1">Under review</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <Link 
          to="/developer/my-apps"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">My Apps</h3>
              <p className="text-sm text-gray-500 mt-1">View and manage all your uploaded apps</p>
              <span className="inline-block mt-2 text-sm text-blue-600 font-medium group-hover:underline">
                View {totalApps} Apps →
              </span>
            </div>
          </div>
        </Link>

        <Link 
          to="/developer/upload-app"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">Upload App</h3>
              <p className="text-sm text-gray-500 mt-1">Upload a new app to the store</p>
              <span className="inline-block mt-2 text-sm text-green-600 font-medium group-hover:underline">
                Upload New →
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Apps */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Apps</h3>
          {totalApps > 0 && (
            <Link to="/developer/my-apps" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : recentApps.length > 0 ? (
          <div className="space-y-3">
            {recentApps.map((app) => (
              <div key={app._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img 
                  src={app.appIcon?.url || 'https://placehold.co/40x40?text=App'} 
                  alt={app.appName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-800">{app.appName}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      app.status === 'approved' ? 'bg-green-100 text-green-700' :
                      app.status === 'blocked' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.status || 'pending'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{app.category} • Downloads {app.downloads || 0}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-gray-500 text-sm">No apps uploaded yet</p>
            <Link to="/developer/upload-app" className="mt-3 text-sm text-green-600 hover:underline">
              Upload your first app →
            </Link>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-gray-800">Need help?</h4>
            <p className="text-sm text-gray-500">Check out our documentation or contact support</p>
          </div>
          <div className="flex gap-3">
            <a 
              href="#" 
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Documentation
            </a>
            <a 
              href="#" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevDashboard;