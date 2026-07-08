import React from 'react';
import { Outlet } from 'react-router-dom';
import DevSidebar from './DevSidebar';

const DevLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DevSidebar />
      <div className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">Developer Dashboard</h2>
          <p className="text-sm text-gray-500">Manage your apps</p>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DevLayout;