import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Calendar, Shield, LogOut, Trash2, Save, Camera,
  CheckCircle, AlertCircle, Loader2, Key, Cloud, History,
  FileText, Map, Calculator, BarChart3, Settings, ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import useUserSettings from '../store/useUserSettings';
import useTranslationHistory from '../store/useTranslationHistory';

const ProfilePage = () => {
  const { user, profile, isAuthenticated, signOut, updateProfile, updatePassword } = useAuth();
  const { translationsCount, anthropicApiKey } = useUserSettings();
  const { history, getStats } = useTranslationHistory();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const historyStats = getStats();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await updateProfile({ display_name: displayName });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await updatePassword(newPassword);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setShowPasswordChange(false);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900/50 to-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white">
              {(profile?.display_name || user.email)?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {profile?.display_name || 'CLEAR User'}
              </h1>
              <p className="text-slate-400">{user.email}</p>
              <p className="text-sm text-slate-500 mt-1">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Usage Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Translations</span>
            </div>
            <div className="text-2xl font-bold text-white">{historyStats.total || 0}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Avg Risk Score</span>
            </div>
            <div className="text-2xl font-bold text-white">{historyStats.avgRiskScore || '—'}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">This Week</span>
            </div>
            <div className="text-2xl font-bold text-white">{historyStats.thisWeek || 0}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Key className="w-4 h-4" />
              <span className="text-sm">API Key</span>
            </div>
            <div className="text-lg font-bold text-white">
              {anthropicApiKey ? (
                <span className="text-green-400">Active</span>
              ) : (
                <span className="text-slate-500">Not Set</span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Edit
              </button>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Display Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white">{profile?.display_name || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <p className="text-white flex items-center gap-2">
                {user.email}
                {user.email_confirmed_at && (
                  <CheckCircle className="w-4 h-4 text-green-400" title="Verified" />
                )}
              </p>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setDisplayName(profile?.display_name || '');
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}

            {message.text && (
              <div className={`p-3 rounded-lg flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {message.text}
              </div>
            )}
          </div>
        </div>

        {/* Security */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>

          <div className="p-6 space-y-4">
            {!showPasswordChange ? (
              <button
                onClick={() => setShowPasswordChange(true)}
                className="text-blue-400 hover:text-blue-300"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium"
                  >
                    {isSaving ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setNewPassword('');
                      setConfirmNewPassword('');
                    }}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center gap-3">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Quick Links</h2>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4">
            <Link
              to="/settings"
              className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Key className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">API Settings</p>
                <p className="text-sm text-slate-400">Manage your API key</p>
              </div>
            </Link>
            <Link
              to="/tools/plainspeak-ai"
              className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <FileText className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white font-medium">PlainSpeak AI</p>
                <p className="text-sm text-slate-400">Translation history</p>
              </div>
            </Link>
            <Link
              to="/tools/processmap"
              className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Map className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-white font-medium">ProcessMap</p>
                <p className="text-sm text-slate-400">Your saved progress</p>
              </div>
            </Link>
            <Link
              to="/calculator"
              className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Calculator className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-medium">Calculator</p>
                <p className="text-sm text-slate-400">Complexity assessments</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Sign Out */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
