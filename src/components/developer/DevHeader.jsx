import React from 'react';
import { useSelector } from 'react-redux';

const DevHeader = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Developer Dashboard</h2>
          <p className="text-sm text-gray-500">Manage your apps</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user?.name || user?.email || 'Developer'}</span>
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Developer</span>
        </div>
      </div>
    </header>
  );
};

export default DevHeader;