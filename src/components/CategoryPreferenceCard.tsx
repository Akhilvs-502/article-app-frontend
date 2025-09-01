'use client';

import { useState, useEffect } from 'react';

interface CategoryPreferenceCardProps {
  category: string;
  userCategories: string[];
  onToggle?: (category: string, isSelected: boolean) => void;
}

export default function CategoryPreferenceCard({ 
  category, 
  userCategories,
  onToggle 
}: CategoryPreferenceCardProps) {
  const [isSelected, setIsSelected] = useState(false);

  // Load initial preference state from userCategories prop
  useEffect(() => {
    setIsSelected(userCategories.includes(category));
  }, [category, userCategories]);

  const handleToggle = () => {
    const newSelection = !isSelected;
    
    // Update local state immediately for better UX
    setIsSelected(newSelection);
    
    // Notify parent component about the change
    onToggle?.(category, newSelection);
  };



  return (
    <label className="relative cursor-pointer group">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleToggle}

        className="sr-only"
      />
      <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 text-blue-900'
          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
      }`}>
        <div className="text-center">
          <div className={`w-6 h-6 rounded-full border-2 mx-auto mb-2 transition-all duration-200 ${
            isSelected
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300'
          }`}>
            {isSelected ? (
              <svg className="w-4 h-4 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : null}
          </div>
          <span className="font-medium text-sm">{category}</span>
        </div>
      </div>
    </label>
  );
}