import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyApps } from '../../store/appSlice';
import Loading from '../../components/common/Loading';

const PendingApps = () => {
  const dispatch = useDispatch();
  const { myApps, isLoading } = useSelector((state) => state.apps);

  useEffect(() => {
    dispatch(getMyApps());
  }, [dispatch]);

  // Filter only pending apps
  const pendingApps = myApps?.filter(app => app.status === 'pending') || [];

  if (isLoading) return <Loading />;

  if (pendingApps?.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-700">No Pending Apps</h3>
          <p className="text-gray-500 mt-1">All your apps have been reviewed by admin</p>
          <Link to="/developer/my-apps" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View All Apps
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
          <h1 className="text-2xl font-bold text-gray-900">Pending Apps</h1>
          <p className="text-sm text-gray-500 mt-0.5">Apps waiting for admin approval</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-lg text-sm font-medium">
            {pendingApps.length} Pending
          </span>
          <Link to="/developer/my-apps" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
            All Apps
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-yellow-200 px-4 py-3">
          <p className="text-xs text-yellow-600">Pending Apps</p>
          <p className="text-xl font-semibold text-yellow-600">{pendingApps.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
          <p className="text-xs text-gray-500">Total Apps</p>
          <p className="text-xl font-semibold text-gray-900">{myApps?.length || 0}</p>
        </div>
      </div>

      {/* Table */}
      {pendingApps.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No pending apps found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">App</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Uploaded</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingApps.map((app) => (
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
                        <p className="font-medium text-gray-900 text-sm">{app.appName}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{app.appDescription}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{app.category}</span>
                  </td>

                  {/* Uploaded Date */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
            Showing {pendingApps.length} pending apps
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApps;