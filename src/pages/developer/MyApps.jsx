import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyApps, deleteDeveloperApp } from '../../store/appSlice';
import Loading from '../../components/common/Loading';

const MyApps = () => {
  const dispatch = useDispatch();
  const { myApps, isLoading } = useSelector((state) => state.apps);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(getMyApps());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this app? This action cannot be undone!')) return;
    await dispatch(deleteDeveloperApp(id));
    dispatch(getMyApps());
  };

  // Filter apps by status
  const filteredApps = myApps?.filter(app => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  // Stats
  const totalApps = myApps?.length || 0;
  const pendingApps = myApps?.filter(a => a.status === 'pending').length || 0;
  const approvedApps = myApps?.filter(a => a.status === 'approved').length || 0;
  const blockedApps = myApps?.filter(a => a.status === 'blocked').length || 0;

  if (isLoading) return <Loading />;

  if (myApps?.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-700">No Apps Yet</h3>
          <p className="text-gray-500 mt-1">Upload your first app to get started</p>
          <Link to="/developer/upload-app" className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Upload App
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Apps</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all your uploaded apps</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
            Total: {totalApps}
          </span>
          <Link to="/developer/upload-app" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
            Upload New
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 text-center">
          <p className="text-xs md:text-sm text-gray-500">Total</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800">{totalApps}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 p-3 md:p-4 text-center">
          <p className="text-xs md:text-sm text-yellow-600">Pending</p>
          <p className="text-xl md:text-2xl font-bold text-yellow-700">{pendingApps}</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-3 md:p-4 text-center">
          <p className="text-xs md:text-sm text-green-600">Approved</p>
          <p className="text-xl md:text-2xl font-bold text-green-700">{approvedApps}</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-3 md:p-4 text-center">
          <p className="text-xs md:text-sm text-red-600">Blocked</p>
          <p className="text-xl md:text-2xl font-bold text-red-700">{blockedApps}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filterStatus === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({totalApps})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filterStatus === 'pending' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          }`}
        >
          Pending ({pendingApps})
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filterStatus === 'approved' 
              ? 'bg-green-600 text-white' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          Approved ({approvedApps})
        </button>
        <button
          onClick={() => setFilterStatus('blocked')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filterStatus === 'blocked' 
              ? 'bg-red-600 text-white' 
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          Blocked ({blockedApps})
        </button>
      </div>

      {/* Apps List */}
      {filteredApps?.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No apps with status: <span className="font-semibold">{filterStatus}</span></p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">App</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Downloads</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApps.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                  {/* App Name & Icon */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={app.appIcon?.url || 'https://placehold.co/40x40?text=App'} 
                        alt={app.appName} 
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{app.appName}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{app.appDescription}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{app.category}</span>
                  </td>

                  {/* Downloads */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-gray-600">{app.downloads || 0}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      app.status === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : app.status === 'blocked' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.status === 'approved' ? 'Approved' : 
                       app.status === 'blocked' ? 'Blocked' : 
                       'Pending'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/developer/update-app/${app._id}`}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          app.status === 'blocked' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                        onClick={(e) => {
                          if (app.status === 'blocked') {
                            e.preventDefault();
                            alert('Cannot update a blocked app. Please contact admin.');
                          }
                        }}
                      >
                        Update
                      </Link>
                      <button 
                        onClick={() => handleDelete(app._id)} 
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          app.status === 'blocked' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                        disabled={app.status === 'blocked'}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
            Showing {filteredApps.length} of {myApps?.length || 0} apps
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApps;