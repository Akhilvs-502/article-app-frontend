import { User, UserPreferences } from '@/types/user';

export const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  bio: 'Tech enthusiast and avid reader. Love exploring new technologies and sharing knowledge.',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z'
};

export const mockUserPreferences: UserPreferences = {
  categories: ['Technology', 'Science', 'Space'],
  sortBy: 'date',
  showBlockedContent: false,
  emailNotifications: true,
  pushNotifications: false,
  theme: 'system',
  language: 'en'
};

export const availableCategories = [
  'Technology', 'Science', 'Health', 'Sports', 'Space', 'Environment', 
  'Business', 'Politics', 'Entertainment', 'Education', 'Travel', 'Food'
];

export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' }
]; 