import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllApps, blockApp, unblockApp, deleteApp, searchApps, moveToPending } from '../../store/appSlice';
import Loading from '../../components/common/Loading';

const Apps = () => {
  const dispatch = useDispatch();
  const { apps, isLoading } = useSelector((state) => state.apps);
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(getAllApps());
  }, [dispatch]);

  const handleSearch = () => {
    if (search.trim()) dispatch(searchApps(search));
    else dispatch(getAllApps());
  };

  // Approve App (For pending apps)
  const handleApprove = async (app) => {
    if (!confirm(`Approve "${app.appName}"? This will make it live on the store.`)) return;
    setProcessing(app._id);
    await dispatch(unblockApp(app._id));
    setProcessing(null);
    dispatch(getAllApps());
  };

  // Block App For approved apps
  const handleBlock = async (app) => {
    if (!confirm(`Block "${app.appName}"? This will remove it from the store.`)) return;
    setProcessing(app._id);
    await dispatch(blockApp(app._id));
    setProcessing(null);
    dispatch(getAllApps());
  };

  // Unblock App (For blocked apps)
  const handleUnblock = async (app) => {
    if (!confirm(`Unblock "${app.appName}"? This will make it live on the store again.`)) return;
    setProcessing(app._id);
    await dispatch(unblockApp(app._id));
    setProcessing(null);
    dispatch(getAllApps());
  };

  // Move to Pending 
  const handleMoveToPending = async (app) => {
    if (!confirm(`Move "${app.appName}" to pending? This will require re-approval.`)) return;
    setProcessing(app._id);
    await dispatch(moveToPending(app._id));
    setProcessing(null);
    dispatch(getAllApps());
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this app permanently? This action cannot be undone!')) return;
    setProcessing(id);
    await dispatch(deleteApp(id));
    setProcessing(null);
    dispatch(getAllApps());
  };

  // Filter apps
  const filteredApps = apps?.filter(app => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  // Stats
  const totalApps = apps?.length || 0;
  const pendingApps = apps?.filter(a => a.status === 'pending').length || 0;
  const approvedApps = apps?.filter(a => a.status === 'approved').length || 0;
  const blockedApps = apps?.filter(a => a.status === 'blocked').length || 0;

  if (isLoading) return <Loading />;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Apps Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all apps in the store</p>
        </div>
        <button
          onClick={() => dispatch(getAllApps())}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Apps</p>
          <p className="text-2xl font-bold text-gray-800">{totalApps}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 p-4">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{pendingApps}</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-4">
          <p className="text-sm text-green-600">Approved</p>
          <p className="text-2xl font-bold text-green-700">{approvedApps}</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-4">
          <p className="text-sm text-red-600">Blocked</p>
          <p className="text-2xl font-bold text-red-700">{blockedApps}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search apps by name, description, or category..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="blocked">Blocked</option>
          </select>
          <button onClick={handleSearch} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Search
          </button>
          {search && (
            <button
              onClick={() => {
                setSearch('');
                setFilterStatus('all');
                dispatch(getAllApps());
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Apps List */}
      {filteredApps?.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No apps found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div key={app._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img 
                src={app.appIcon?.url || 'https://placehold.co/50x50?text=App'} 
                alt={app.appName} 
                className="w-14 h-14 rounded-lg object-cover" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{app.appName}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
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
                </div>
                <p className="text-sm text-gray-500 truncate">{app.appDescription}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{app.category}</span>
                  <span className="text-xs text-gray-400">Downloads {app.downloads || 0}</span>
                  {app.developer && (
                    <span className="text-xs text-gray-400">{app.developer.name || 'Unknown'}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Pending → Approve */}
                {app.status === 'pending' && (
                  <button
                    onClick={() => handleApprove(app)}
                    disabled={processing === app._id}
                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {processing === app._id ? '...' : 'Approve'}
                  </button>
                )}
                
                {/* Approved → Block OR Move to Pending */}
                {app.status === 'approved' && (
                  <>
                    <button
                      onClick={() => handleBlock(app)}
                      disabled={processing === app._id}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {processing === app._id ? '...' : 'Block'}
                    </button>
                    <button
                      onClick={() => handleMoveToPending(app)}
                      disabled={processing === app._id}
                      className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    >
                      {processing === app._id ? '...' : 'Pending'}
                    </button>
                  </>
                )}
                
                {/* Blocked → Unblock OR Move to Pending */}
                {app.status === 'blocked' && (
                  <>
                    <button
                      onClick={() => handleUnblock(app)}
                      disabled={processing === app._id}
                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {processing === app._id ? '...' : 'Unblock'}
                    </button>
                    <button
                      onClick={() => handleMoveToPending(app)}
                      disabled={processing === app._id}
                      className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    >
                      {processing === app._id ? '...' : 'Pending'}
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => handleDelete(app._id)}
                  disabled={processing === app._id}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Apps;