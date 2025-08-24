'use client';

import { useState } from 'react';
import { mockUserPreferences, availableCategories, availableLanguages } from '@/data/mockUser';
import { UserPreferences } from '@/types/user';

export default function PreferencesSettings() {
  const [preferences, setPreferences] = useState<UserPreferences>(mockUserPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCategoryChange = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSortByChange = (sortBy: 'date' | 'likes' | 'title') => {
    setPreferences(prev => ({ ...prev, sortBy }));
  };

  const handleToggleChange = (key: keyof UserPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setPreferences(prev => ({ ...prev, theme }));
  };

  const handleLanguageChange = (language: string) => {
    setPreferences(prev => ({ ...prev, language }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Preferences updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update preferences. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Article Preferences</h3>
          <p className="text-sm text-gray-600">
            Customize your reading experience and content preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isLoading ? 'Saving...' : 'Save Preferences'}</span>
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Content Preferences */}
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Content Preferences</h4>
          
          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableCategories.map((category) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Select categories you're most interested in. Articles from these categories will be prioritized.
            </p>
          </div>

          {/* Sort Preference */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Sort Order
            </label>
            <select
              value={preferences.sortBy}
              onChange={(e) => handleSortByChange(e.target.value as 'date' | 'likes' | 'title')}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Latest First</option>
              <option value="likes">Most Popular</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>

          {/* Content Filtering */}
          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.showBlockedContent}
                onChange={() => handleToggleChange('showBlockedContent')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Show blocked content</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Display articles you've previously blocked (useful for reconsidering content)
            </p>
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Notification Preferences</h4>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={() => handleToggleChange('emailNotifications')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Email notifications</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Receive updates about new articles and important changes via email
              </p>
            </div>

            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.pushNotifications}
                  onChange={() => handleToggleChange('pushNotifications')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Push notifications</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Get real-time notifications in your browser for new content
              </p>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">App Settings</h4>
          
          {/* Theme */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <div className="flex space-x-4">
              {(['light', 'dark', 'system'] as const).map((theme) => (
                <label key={theme} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={theme}
                    checked={preferences.theme === theme}
                    onChange={() => handleThemeChange(theme)}
                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{theme}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={preferences.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Current Preferences Summary</h4>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">Categories:</span> {preferences.categories.join(', ') || 'None selected'}
          </div>
          <div>
            <span className="font-medium">Sort by:</span> {preferences.sortBy === 'date' ? 'Latest First' : preferences.sortBy === 'likes' ? 'Most Popular' : 'Alphabetical'}
          </div>
          <div>
            <span className="font-medium">Theme:</span> {preferences.theme.charAt(0).toUpperCase() + preferences.theme.slice(1)}
          </div>
          <div>
            <span className="font-medium">Language:</span> {availableLanguages.find(l => l.code === preferences.language)?.name}
          </div>
        </div>
      </div>
    </div>
  );
} 