import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPendingDevelopers, approveDeveloper, rejectDeveloper } from '../../store/developerSlice';
import { getAllApps, blockApp, unblockApp, deleteApp } from '../../store/appSlice';
import Loading from '../../components/common/Loading';

const PendingApprovals = () => {
  const dispatch = useDispatch();
  const { pendingDevelopers, isLoading: devLoading } = useSelector((state) => state.developers);
  const { apps, isLoading: appsLoading } = useSelector((state) => state.apps);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    dispatch(getPendingDevelopers());
    dispatch(getAllApps());
  }, [dispatch]);

  // Developer Approve
  const handleApproveDev = async (id) => {
    if (!confirm('Approve this developer?')) return;
    setProcessing(id);
    await dispatch(approveDeveloper(id));
    setProcessing(null);
    dispatch(getPendingDevelopers());
  };

  // Developer Reject
  const handleRejectDev = async (id) => {
    if (!confirm('Reject this developer?')) return;
    setProcessing(id);
    await dispatch(rejectDeveloper(id));
    setProcessing(null);
    dispatch(getPendingDevelopers());
  };

  // App Approve (Unblock)
  const handleApproveApp = async (app) => {
    if (!confirm(`Approve "${app.appName}"?`)) return;
    setProcessing(app._id);
    await dispatch(unblockApp(app._id));
    setProcessing(null);
    dispatch(getAllApps());
  };

  // App Block
  const handleBlockApp = async (app) => {
    if (!confirm(`Block "${app.appName}"?`)) return;
    setProcessing(app._id);
    await dispatch(blockApp(app._id));
    setProcessing(null);
    dispatch(getAllApps());
  };

  // App Delete
  const handleDeleteApp = async (id) => {
    if (!confirm('Delete this app permanently?')) return;
    setProcessing(id);
    await dispatch(deleteApp(id));
    setProcessing(null);
    dispatch(getAllApps());
  };

  // Filter only pending apps
  const pendingApps = apps?.filter(app => app.status === 'pending') || [];

  if (devLoading || appsLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Approvals</h1>
      <p className="text-gray-500 text-sm mb-6">Review and approve developers and apps</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Pending Developers</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingDevelopers?.length || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Pending Apps</p>
          <p className="text-2xl font-bold text-blue-600">{pendingApps?.length || 0}</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Pending Developers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Pending Developers</h2>
            <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
              {pendingDevelopers?.length || 0}
            </span>
          </div>

          {pendingDevelopers?.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-sm">No pending developers</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {pendingDevelopers.map((dev) => (
                <div key={dev._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{dev.name}</h3>
                      <p className="text-sm text-gray-500">{dev.email}</p>
                      {dev.company && <p className="text-sm text-gray-600">{dev.company}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        Registered: {new Date(dev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⏳ Pending
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleApproveDev(dev._id)}
                      disabled={processing === dev._id}
                      className="flex-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {processing === dev._id ? '...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleRejectDev(dev._id)}
                      disabled={processing === dev._id}
                      className="flex-1 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {processing === dev._id ? '...' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Pending Apps */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Pending Apps</h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {pendingApps?.length || 0}
            </span>
          </div>

          {pendingApps?.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              
              <p className="text-gray-500 text-sm">No pending apps</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {pendingApps.map((app) => (
                <div key={app._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <img
                      src={app.appIcon?.url || 'https://placehold.co/50x50?text=App'}
                      alt={app.appName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800 truncate">{app.appName}</h3>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          ⏳ Pending
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{app.appDescription}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {app.category}
                        </span>
                        <span className="text-xs text-gray-400">{app.developer?.name || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleApproveApp(app)}
                      disabled={processing === app._id}
                      className="flex-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {processing === app._id ? '...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleBlockApp(app)}
                      disabled={processing === app._id}
                      className="flex-1 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {processing === app._id ? '...' : 'Block'}
                    </button>
                    <button
                      onClick={() => handleDeleteApp(app._id)}
                      disabled={processing === app._id}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingApprovals;