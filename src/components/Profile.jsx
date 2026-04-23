// ============================================
// 👤 PROFILE & SETTINGS COMPONENT
// ============================================
// User profile, preferences, and app settings

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Weight, 
  Ruler, 
  Bell, 
  Volume2, 
  Calendar, 
  Download, 
  Upload, 
  Trash2,
  ChevronRight,
  Check,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { getUserSettings, updateSettings, resetSettings } from '../utils/userSettings';
import { getWorkoutHistory, clearWorkoutHistory } from '../utils/localStorage';
import { getAllWorkoutPlans } from '../utils/workoutPlans';
import ConfirmModal from './ConfirmModal';

const Profile = ({ onBack }) => {
  const [settings, setSettings] = useState(getUserSettings());
  const [activeSection, setActiveSection] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  // Profile editing states
  const [editName, setEditName] = useState(settings.profile.name);
  const [editEmail, setEditEmail] = useState(settings.profile.email || '');
  const [editWeight, setEditWeight] = useState(settings.profile.weight || '');
  const [editWeightUnit, setEditWeightUnit] = useState(settings.profile.weightUnit);
  const [editHeight, setEditHeight] = useState(settings.profile.height || '');
  const [editHeightUnit, setEditHeightUnit] = useState(settings.profile.heightUnit);
  const [editHeightFeet, setEditHeightFeet] = useState(settings.profile.heightFeet || '');
  const [editHeightInches, setEditHeightInches] = useState(settings.profile.heightInches || '');
  const [editAge, setEditAge] = useState(settings.profile.age || '');

  useEffect(() => {
    const currentSettings = getUserSettings();
    setSettings(currentSettings);
  }, []);

  const handleSaveProfile = () => {
    const updates = {
      name: editName,
      email: editEmail,
      weight: editWeight ? parseFloat(editWeight) : null,
      weightUnit: editWeightUnit,
      height: editHeightUnit === 'cm' ? (editHeight ? parseFloat(editHeight) : null) : null,
      heightUnit: editHeightUnit,
      heightFeet: editHeightUnit === 'ft' ? (editHeightFeet ? parseInt(editHeightFeet) : null) : null,
      heightInches: editHeightUnit === 'ft' ? (editHeightInches ? parseInt(editHeightInches) : null) : null,
      age: editAge ? parseInt(editAge) : null
    };

    if (updateSettings('profile', updates)) {
      setSettings(getUserSettings());
      setActiveSection(null);
      showSaveSuccess();
    }
  };

  const handleTogglePreference = (key, value) => {
    const updates = { [key]: value };
    if (updateSettings('preferences', updates)) {
      setSettings(getUserSettings());
      showSaveSuccess();
    }
  };

  const showSaveSuccess = () => {
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleExportData = () => {
    try {
      const data = {
        workoutPlans: getAllWorkoutPlans(),
        workoutHistory: getWorkoutHistory(),
        userSettings: getUserSettings(),
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calilogger-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showSaveSuccess();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleClearHistory = () => {
    setConfirmAction(() => () => {
      clearWorkoutHistory();
      setShowConfirmModal(false);
      showSaveSuccess();
    });
    setShowConfirmModal(true);
  };

  const handleResetSettings = () => {
    setConfirmAction(() => () => {
      resetSettings();
      setSettings(getUserSettings());
      setEditName('');
      setEditEmail('');
      setEditWeight('');
      setEditHeight('');
      setEditAge('');
      setShowConfirmModal(false);
      showSaveSuccess();
    });
    setShowConfirmModal(true);
  };

  const history = getWorkoutHistory();
  const totalWorkouts = history.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 glass-light border-b border-white/10 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-white">Profile & Settings</h1>
                <p className="text-gray-400 text-sm">Customize your experience</p>
              </div>
            </div>
            {saveStatus === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2 px-3 py-2 bg-green-600/20 rounded-lg"
              >
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-semibold">Saved</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {settings.profile.name || 'Athlete'}
              </h2>
              <p className="text-gray-400 text-sm">
                {totalWorkouts} workouts completed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Weight</p>
              <p className="text-white font-bold">
                {settings.profile.weight ? `${settings.profile.weight} ${settings.profile.weightUnit}` : '—'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Height</p>
              <p className="text-white font-bold">
                {settings.profile.heightUnit === 'ft' && settings.profile.heightFeet
                  ? `${settings.profile.heightFeet}'${settings.profile.heightInches || 0}"`
                  : settings.profile.height
                  ? `${settings.profile.height} cm`
                  : '—'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Age</p>
              <p className="text-white font-bold">
                {settings.profile.age || '—'}
              </p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveSection(activeSection === 'profile' ? null : 'profile')}
            className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-primary-400 font-semibold transition-colors"
          >
            {activeSection === 'profile' ? 'Cancel' : 'Edit Profile'}
          </motion.button>
        </motion.div>

        {/* Edit Profile Form */}
        {activeSection === 'profile' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>

            {/* Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Weight</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={editWeight}
                  onChange={(e) => setEditWeight(e.target.value)}
                  placeholder="0"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditWeightUnit('kg')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-colors ${
                      editWeightUnit === 'kg'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    kg
                  </button>
                  <button
                    onClick={() => setEditWeightUnit('lbs')}
                    className={`px-4 py-3 rounded-xl font-semibold transition-colors ${
                      editWeightUnit === 'lbs'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    lbs
                  </button>
                </div>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Height</label>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setEditHeightUnit('cm')}
                  className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-colors ${
                    editHeightUnit === 'cm'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  cm
                </button>
                <button
                  onClick={() => setEditHeightUnit('ft')}
                  className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-colors ${
                    editHeightUnit === 'ft'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  ft/in
                </button>
              </div>

              {editHeightUnit === 'cm' ? (
                <input
                  type="number"
                  value={editHeight}
                  onChange={(e) => setEditHeight(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              ) : (
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={editHeightFeet}
                    onChange={(e) => setEditHeightFeet(e.target.value)}
                    placeholder="Feet"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <input
                    type="number"
                    value={editHeightInches}
                    onChange={(e) => setEditHeightInches(e.target.value)}
                    placeholder="Inches"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Age</label>
              <input
                type="number"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSaveProfile}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 rounded-xl text-white font-bold transition-colors"
            >
              Save Profile
            </motion.button>
          </motion.div>
        )}

        {/* App Preferences */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-2">
            App Preferences
          </h3>

          <div className="glass rounded-2xl divide-y divide-white/5">
            {/* Notifications */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Notifications</p>
                  <p className="text-gray-400 text-xs">Timer completion alerts</p>
                </div>
              </div>
              <button
                onClick={() =>
                  handleTogglePreference('notificationsEnabled', !settings.preferences.notificationsEnabled)
                }
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.preferences.notificationsEnabled ? 'bg-primary-600' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: settings.preferences.notificationsEnabled ? 24 : 0 }}
                  className="w-6 h-6 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>

            {/* Timer Sounds */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Timer Sounds</p>
                  <p className="text-gray-400 text-xs">Countdown beeps</p>
                </div>
              </div>
              <button
                onClick={() =>
                  handleTogglePreference('timerSoundsEnabled', !settings.preferences.timerSoundsEnabled)
                }
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.preferences.timerSoundsEnabled ? 'bg-primary-600' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: settings.preferences.timerSoundsEnabled ? 24 : 0 }}
                  className="w-6 h-6 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>

            {/* Default Rest Time */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Default Rest Time</p>
                  <p className="text-gray-400 text-xs">Quick timer preset</p>
                </div>
              </div>
              <div className="flex gap-2">
                {[30, 45, 60, 90, 120].map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => handleTogglePreference('defaultRestTime', seconds)}
                    className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      settings.preferences.defaultRestTime === seconds
                        ? 'bg-primary-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-2">
            Data Management
          </h3>

          <div className="glass rounded-2xl divide-y divide-white/5">
            {/* Export Data */}
            <button
              onClick={handleExportData}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                  <Download className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Export Data</p>
                  <p className="text-gray-400 text-xs">Download backup file</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            {/* Clear History */}
            <button
              onClick={handleClearHistory}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-600/20 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Clear Workout History</p>
                  <p className="text-gray-400 text-xs">{totalWorkouts} workouts</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            {/* Reset Settings */}
            <button
              onClick={handleResetSettings}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Reset Settings</p>
                  <p className="text-gray-400 text-xs">Restore defaults</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm mb-1">CaliLogger</p>
          <p className="text-gray-600 text-xs">Version 1.0.0</p>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmAction}
        title="Are you sure?"
        message="This action cannot be undone."
        variant="danger"
      />
    </div>
  );
};

export default Profile;
