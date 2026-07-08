import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/authSlice';

// Admin Components
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingDevelopers from './pages/admin/PendingDevelopers';
import Apps from './pages/admin/Apps';
import Statistics from './pages/admin/Statistics';
import Developers from './pages/admin/Developers';

// Developer Components
import DevLogin from './pages/developer/DevLogin';
import DevRegister from './pages/developer/DevRegister';
import DevLayout from './components/developer/DevLayout';
import DevDashboard from './pages/developer/DevDashboard';
import MyApps from './pages/developer/MyApps';
import UploadApp from './pages/developer/UploadApp';
import UpdateApp from './pages/developer/UpdateApp';
import PendingApps from './pages/developer/PendingApps'; 

import Loading from './components/common/Loading';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, role } = useSelector((state) => state.auth);
  
  if (isLoading) {
    return <Loading />;
  }
  
  if (!isAuthenticated) {
    const path = window.location.pathname;
    if (path.includes('/admin')) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// App Component
function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('App Mounted - Token:', token ? 'Exists' : 'Not Found');
    console.log('App Mounted - Role:', role);
    console.log('App Mounted - isAuthenticated:', isAuthenticated);
    
    if (token && role && !isAuthenticated) {
      console.log('Dispatching checkAuth...');
      dispatch(checkAuth());
    }
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  console.log('App Render - isAuthenticated:', isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>

        {/* Developer Routes  "/" */}
        <Route 
          path="/" 
          element={
            isAuthenticated && localStorage.getItem('role') === 'developer' 
              ? <Navigate to="/developer/dashboard" replace /> 
              : <DevLogin />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/developer/dashboard" replace /> : <DevRegister />
          } 
        />

        <Route path="/developer" element={<ProtectedRoute allowedRoles={['developer']}><DevLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<DevDashboard />} />
          <Route path="my-apps" element={<MyApps />} />
          <Route path="upload-app" element={<UploadApp />} />
          <Route path="pending-apps" element={<PendingApps />} />
          <Route path="update-app/:id" element={<UpdateApp />} /> 
        </Route>

        {/* Admin Routes - "/admin" */}
        <Route 
          path="/admin" 
          element={
            isAuthenticated && localStorage.getItem('role') === 'admin'
              ? <Navigate to="/admin/dashboard" replace />
              : <AdminLogin />
          } 
        />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="pending-developers" element={<PendingDevelopers />} />
          <Route path="apps" element={<Apps />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path='developers' element={<Developers />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-blue-600">404</h1>
              <p className="text-gray-500 mt-2">Page not found</p>
              <a href="/" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Go Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;