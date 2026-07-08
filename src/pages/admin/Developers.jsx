import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDevelopers, blockDeveloper, unblockDeveloper } from '../../store/developerSlice';
import Loading from '../../components/common/Loading';

const Developers = () => {
  const dispatch = useDispatch();
  const { allDevelopers, isLoading } = useSelector((state) => state.developers);
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    dispatch(getAllDevelopers());
  }, [dispatch]);

  const filtered = allDevelopers?.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.company?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBlock = async (id) => {
    if (!confirm('Block this developer? They will not be able to login.')) return;
    setProcessing(id);
    await dispatch(blockDeveloper(id));
    setProcessing(null);
    dispatch(getAllDevelopers());
  };

  const handleUnblock = async (id) => {
    if (!confirm('Unblock this developer?')) return;
    setProcessing(id);
    await dispatch(unblockDeveloper(id));
    setProcessing(null);
    dispatch(getAllDevelopers());
  };

  if (isLoading) return <Loading />;

  const getStatus = (dev) => {
    if (dev.status === 'blocked') return 'Blocked';
    if (dev.isApproved) return 'Approved';
    return 'Pending';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Developers</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all registered developers</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
            Total: {allDevelopers?.length || 0}
          </span>
          <button
            onClick={() => dispatch(getAllDevelopers())}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search developers by name, email or company..." 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-gray-600">Company</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered?.map((dev) => (
                <tr key={dev._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-800">{dev.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{dev.email}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{dev.company || 'N/A'}</td>
                  <td className="px-5 py-3 text-sm">{getStatus(dev)}</td>
                  <td className="px-5 py-3">
                    {dev.isApproved && dev.status !== 'blocked' ? (
                      <button
                        onClick={() => handleBlock(dev._id)}
                        disabled={processing === dev._id}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {processing === dev._id ? '...' : 'Block'}
                      </button>
                    ) : dev.status === 'blocked' ? (
                      <button
                        onClick={() => handleUnblock(dev._id)}
                        disabled={processing === dev._id}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {processing === dev._id ? '...' : 'Unblock'}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
          Showing {filtered?.length || 0} of {allDevelopers?.length || 0} developers
        </div>
      </div>
    </div>
  );
};

export default Developers;