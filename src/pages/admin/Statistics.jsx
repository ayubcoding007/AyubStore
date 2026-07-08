import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppStats } from '../../store/appSlice';
import Loading from '../../components/common/Loading';

const Statistics = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.apps);

  useEffect(() => {
    dispatch(getAppStats());
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  const statCards = [
    { title: 'Total Apps', value: stats?.totalApps || 0 },
    { title: 'Approved Apps', value: stats?.approvedApps || 0 },
    { title: 'Blocked Apps', value: stats?.blockedApps || 0 },
    { title: 'Categories', value: stats?.categoryStats?.length || 0 },
    { title: 'Total Downloads', value: stats?.topApps?.reduce((sum, a) => sum + (a.downloads || 0), 0) || 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Statistics</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {stats?.categoryStats?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {stats.categoryStats.map((cat, i) => {
              const pct = stats.totalApps > 0 ? ((cat.count / stats.totalApps) * 100).toFixed(1) : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{cat._id}</span>
                    <span className="text-gray-700">{cat.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 rounded-full h-2" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stats?.topApps?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Downloaded Apps</h3>
          <div className="space-y-3">
            {stats.topApps.map((app, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-bold text-gray-400 w-8">#{i + 1}</span>
                <img src={app.appIcon?.url || 'https://via.placeholder.com/40'} alt={app.appName} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{app.appName}</p>
                </div>
                <span className="font-bold text-gray-700">Download {app.downloads || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;