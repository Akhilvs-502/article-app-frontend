'use client';

import { useState, useEffect } from 'react';
import { getUserProfile } from '@/services/ProfileService';
import CategoryPreferenceCard from '@/components/CategoryPreferenceCard';
import { updateUserPreference } from '@/services/preferenceService';

export default function PreferencesSettings() {
  const [userCategories, setUserCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load user profile to get categories
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getUserProfile();
      const userData = response?.data?.user;
      
      console.log("prefernce data",userData);
      
      // Extract categories from user profile
      const categories = userData?.preferences || userData?.categories || [];
      setUserCategories(categories);
      setSelectedCategories(categories); // Initialize selected categories
      
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setMessage({ type: 'error', text: 'Failed to load preferences. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryToggle = (category: string, isSelected: boolean) => {
    setSelectedCategories(prev => 
      isSelected 
        ? [...prev, category]
        : prev.filter(c => c !== category)
    );
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      // TODO: Replace with your actual API call to save preferences
      // const response = await updateUserPreferences(selectedCategories);
      
      // Mock API call for now
          
      setUserCategories(selectedCategories);
    

      const response=await updateUserPreference(selectedCategories)

      setMessage({ type: 'success', text: 'Preferences updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setMessage({ type: 'error', text: 'Failed to update preferences. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Available categories - you can get these from your backend or keep them static
  const availableCategories = [
    'Sports', 'Politics', 'Space', 'Technology', 'Health', 'Science', 
    'Entertainment', 'Business', 'Education', 'Environment'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading preferences...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Category Preferences</h3>
        <p className="text-sm text-gray-600 mt-1">
          Select the categories you're interested in. Articles from these topics will appear in your feed.
        </p>
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

      {/* Categories */}
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableCategories.map((category) => (
                          <CategoryPreferenceCard
                key={category}
                category={category}
                userCategories={selectedCategories}
                onToggle={handleCategoryToggle}
              />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Select your preferred categories and click Save to update your preferences.
        </p>
      </div>

      {/* Current Selection Summary */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Categories</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          {selectedCategories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <span 
                  key={category}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No categories selected yet.</p>
          )}
        </div>
        
        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSavePreferences}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2 font-medium"
          >
            {isSaving && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 