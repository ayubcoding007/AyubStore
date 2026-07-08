import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Loading from '../../components/common/Loading';

const UpdateApp = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    appName: '',
    appDescription: '',
    category: 'Apps',
  });
  
  const [iconFile, setIconFile] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [apkFile, setApkFile] = useState(null);
  const [previewIcon, setPreviewIcon] = useState(null);

  // Fetch existing app data
  useEffect(() => {
    const fetchApp = async () => {
      try {
        const response = await axiosInstance.get(`/developer/app/${id}`);
        const app = response.data.app;
        
        setFormData({
          appName: app.appName || '',
          appDescription: app.appDescription || '',
          category: app.category || 'Apps',
        });
        
        if (app.appIcon?.url) {
          setPreviewIcon(app.appIcon.url);
        }
        
        setLoading(false);
      } catch (error) {
        // console.error('Error fetching app:', error);
        setMessage({ type: 'error', text: 'Failed to load app data' });
        setLoading(false);
      }
    };
    
    fetchApp();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewIcon(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotsChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setMessage({ type: 'error', text: 'Maximum 5 screenshots allowed' });
      return;
    }
    setScreenshots(files);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    if (!formData.appName || !formData.appDescription || !formData.category) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      setSubmitting(false);
      return;
    }

    const uploadData = new FormData();
    uploadData.append('appName', formData.appName);
    uploadData.append('appDescription', formData.appDescription);
    uploadData.append('category', formData.category);
    
    if (iconFile) {
      uploadData.append('appIcon', iconFile);
    }
    
    screenshots.forEach(file => {
      uploadData.append('appScreenshots', file);
    });
    
    if (apkFile) {
      uploadData.append('appFile', apkFile);
    }

    try {
      await axiosInstance.put(`/developer/app/${id}`, uploadData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        },
      });

      setMessage({ type: 'success', text: 'App updated successfully!' });
      setSubmitting(false);
      
      setTimeout(() => {
        navigate('/developer/my-apps');
      }, 2000);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Update failed. Please try again.' 
      });
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Update App</h1>
        <p className="text-gray-500 text-sm mt-1">Update your app details and files</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {message.text && (
            <div className={`p-3 rounded-lg text-sm border ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-600 border-green-200' 
                : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              App Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="appName"
              value={formData.appName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter your app name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              App Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="appDescription"
              value={formData.appDescription}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Describe your app..."
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              <option value="Apps">Apps</option>
              <option value="Games">Games</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              App Icon <span className="text-xs text-gray-400">(Leave empty to keep current)</span>
            </label>
            <div className="flex items-center gap-4">
              {previewIcon && (
                <img
                  src={previewIcon}
                  alt="App Icon Preview"
                  className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Screenshots <span className="text-xs text-gray-400">(Max 5 - Leave empty to keep current)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleScreenshotsChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {screenshots.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {screenshots.map((file, index) => (
                  <span key={index} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              APK File <span className="text-xs text-gray-400">(Leave empty to keep current)</span>
            </label>
            <input
              type="file"
              accept=".apk"
              onChange={(e) => setApkFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {apkFile && (
              <p className="text-xs text-green-600 mt-1">
                Selected: {apkFile.name} ({(apkFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating...' : 'Update App'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/developer/my-apps')}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateApp;