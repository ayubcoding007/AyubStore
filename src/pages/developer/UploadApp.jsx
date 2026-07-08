import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

const UploadApp = () => {
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [category, setCategory] = useState('Apps');
  const [iconFile, setIconFile] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [apkFile, setApkFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewIcon, setPreviewIcon] = useState(null);
  const navigate = useNavigate();

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewIcon(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!appName || !appDescription || !iconFile || !apkFile) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('appName', appName);
    formData.append('appDescription', appDescription);
    formData.append('category', category);
    formData.append('appIcon', iconFile);
    screenshots.forEach(file => formData.append('appScreenshots', file));
    formData.append('appFile', apkFile);

    try {
      await axiosInstance.post('/developer/app', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage({ type: 'success', text: 'App uploaded successfully!' });
      setLoading(false);
      setTimeout(() => navigate('/developer/my-apps'), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Upload failed' });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload App</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {message.text && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">App Name *</label>
            <input type="text" value={appName} onChange={(e) => setAppName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="My Awesome App" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
            <textarea value={appDescription} onChange={(e) => setAppDescription(e.target.value)} rows="3" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Describe your app..." required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
              <option value="Apps">Apps</option>
              <option value="Games">Games</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">App Icon *</label>
            <div className="flex items-center gap-4">
              {previewIcon && <img src={previewIcon} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />}
              <input type="file" accept="image/*" onChange={handleIconChange} className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Screenshots (Max 5)</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setScreenshots(Array.from(e.target.files))} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
            {screenshots.length > 0 && <p className="text-xs text-green-600 mt-1">{screenshots.length} selected</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">APK File *</label>
            <input type="file" accept=".apk" onChange={(e) => setApkFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100" required />
            {apkFile && <p className="text-xs text-green-600 mt-1">{apkFile.name} ({(apkFile.size / 1024 / 1024).toFixed(2)} MB)</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50">
            {loading ? 'Uploading...' : 'Upload App'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadApp;