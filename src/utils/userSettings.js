// ============================================
// ⚙️ USER SETTINGS UTILITIES
// ============================================
// Manage user profile and app settings in localStorage

const SETTINGS_KEY = 'cali_user_settings';

const DEFAULT_SETTINGS = {
  // Personal Profile
  profile: {
    name: '',
    email: '',
    weight: null,
    weightUnit: 'kg', // 'kg' or 'lbs'
    height: null,
    heightUnit: 'cm', // 'cm' or 'ft'
    heightFeet: null, // for ft/in format
    heightInches: null,
    age: null
  },
  
  // App Preferences
  preferences: {
    notificationsEnabled: true,
    timerSoundsEnabled: true,
    defaultRestTime: 60, // seconds
    defaultExerciseTime: 45, // seconds
    weekStartsOn: 'monday', // 'sunday' or 'monday'
    dateFormat: 'long' // 'long' or 'short'
  },
  
  // Theme (for future use)
  theme: {
    primaryColor: '#0ba5ec',
    darkMode: true
  }
};

/**
 * Get all user settings
 * @returns {Object} User settings object
 */
export const getUserSettings = () => {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    if (settings) {
      const parsed = JSON.parse(settings);
      // Merge with defaults to ensure all fields exist
      return {
        profile: { ...DEFAULT_SETTINGS.profile, ...parsed.profile },
        preferences: { ...DEFAULT_SETTINGS.preferences, ...parsed.preferences },
        theme: { ...DEFAULT_SETTINGS.theme, ...parsed.theme }
      };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error reading user settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Save user settings
 * @param {Object} settings - Settings object to save
 * @returns {boolean} Success status
 */
export const saveUserSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving user settings:', error);
    return false;
  }
};

/**
 * Update specific setting section
 * @param {string} section - 'profile', 'preferences', or 'theme'
 * @param {Object} updates - Object with updates
 * @returns {boolean} Success status
 */
export const updateSettings = (section, updates) => {
  try {
    const settings = getUserSettings();
    settings[section] = { ...settings[section], ...updates };
    return saveUserSettings(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return false;
  }
};

/**
 * Get user's display name
 * @returns {string} User name or default
 */
export const getUserName = () => {
  const settings = getUserSettings();
  return settings.profile.name || 'Athlete';
};

/**
 * Get formatted weight
 * @returns {string} Weight with unit or null
 */
export const getFormattedWeight = () => {
  const settings = getUserSettings();
  const { weight, weightUnit } = settings.profile;
  if (!weight) return null;
  return `${weight} ${weightUnit}`;
};

/**
 * Get formatted height
 * @returns {string} Height with unit or null
 */
export const getFormattedHeight = () => {
  const settings = getUserSettings();
  const { height, heightUnit, heightFeet, heightInches } = settings.profile;
  
  if (heightUnit === 'ft' && heightFeet) {
    return `${heightFeet}'${heightInches || 0}"`;
  }
  
  if (height) {
    return `${height} ${heightUnit}`;
  }
  
  return null;
};

/**
 * Convert weight between units
 * @param {number} value - Weight value
 * @param {string} fromUnit - 'kg' or 'lbs'
 * @param {string} toUnit - 'kg' or 'lbs'
 * @returns {number} Converted weight
 */
export const convertWeight = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;
  
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return Math.round(value * 2.20462 * 10) / 10;
  }
  
  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return Math.round(value / 2.20462 * 10) / 10;
  }
  
  return value;
};

/**
 * Convert height between units
 * @param {number} value - Height value in cm
 * @param {string} toUnit - 'cm' or 'ft'
 * @returns {Object} Converted height {cm, feet, inches}
 */
export const convertHeight = (value, toUnit) => {
  if (toUnit === 'cm') {
    return { cm: value };
  }
  
  const totalInches = value / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  
  return { feet, inches };
};

/**
 * Reset settings to defaults
 * @returns {boolean} Success status
 */
export const resetSettings = () => {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    return true;
  } catch (error) {
    console.error('Error resetting settings:', error);
    return false;
  }
};
