'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ArticleManagement from '@/components/dashboard/ArticleManagement';

// Mock data - in a real app this would come from your backend
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  preferences: ['Sports', 'Technology', 'Science']
};

const mockArticles = [
  {
    id: 1,
    title: 'Latest Developments in Space Exploration',
    category: 'Space',
    author: 'John Doe',
    date: '2024-01-15',
    isOwner: true,
    content: 'Space exploration has seen remarkable advancements in recent years. From private companies launching missions to Mars to new discoveries about exoplanets, the field is expanding rapidly. NASA\'s Artemis program aims to return humans to the Moon, while SpaceX continues to push boundaries with reusable rockets.',
    likes: 45,
    dislikes: 3,
    isLiked: false,
    isDisliked: false,
    isBlocked: false,
    status: 'published' as const
  },
  {
    id: 2,
    title: 'The Future of Renewable Energy',
    category: 'Science',
    author: 'Jane Smith',
    date: '2024-01-14',
    isOwner: false,
    content: 'Renewable energy sources are becoming increasingly cost-effective and efficient. Solar panels have seen dramatic improvements in efficiency, while wind energy continues to grow. Battery storage technology is advancing rapidly, making renewable energy more reliable than ever before.',
    likes: 128,
    dislikes: 12,
    isLiked: true,
    isDisliked: false,
    isBlocked: false,
    status: 'published' as const
  },
  {
    id: 3,
    title: 'AI in Modern Healthcare',
    category: 'Technology',
    author: 'John Doe',
    date: '2024-01-13',
    isOwner: true,
    content: 'Artificial Intelligence is revolutionizing healthcare in unprecedented ways. From diagnostic tools that can detect diseases earlier than human doctors to robotic surgery systems that improve precision, AI is enhancing patient outcomes and reducing medical errors.',
    likes: 89,
    dislikes: 7,
    isLiked: false,
    isDisliked: false,
    isBlocked: false,
    status: 'published' as const
  },
  {
    id: 4,
    title: 'The Evolution of Football Tactics',
    category: 'Sports',
    author: 'Mike Johnson',
    date: '2024-01-12',
    isOwner: false,
    content: 'Modern football has evolved significantly from traditional formations. Teams now use data analytics to optimize player positioning, pressing strategies, and possession-based play. The role of full-backs has transformed, and pressing systems have become more sophisticated.',
    likes: 67,
    dislikes: 15,
    isLiked: false,
    isDisliked: false,
    isBlocked: false,
    status: 'published' as const
  },
  {
    id: 6,
    title: 'New Article in Progress',
    category: 'Technology',
    author: 'John Doe',
    date: '2024-01-10',
    isOwner: true,
    content: 'This is a draft article that I\'m working on. It will cover the latest trends in web development and modern frameworks.',
    likes: 0,
    dislikes: 0,
    isLiked: false,
    isDisliked: false,
    isBlocked: false,
    status: 'published' as const
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'articles' | 'preferences'>('articles');
  const [selectedArticle, setSelectedArticle] = useState<typeof mockArticles[0] | null>(null);
  const [articles, setArticles] = useState(mockArticles);

  const handleLike = (articleId: number) => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        if (article.isLiked) {
          return { ...article, isLiked: false, likes: article.likes - 1 };
        } else {
          return { 
            ...article, 
            isLiked: true, 
            isDisliked: false,
            likes: article.likes + 1,
            dislikes: article.isDisliked ? article.dislikes - 1 : article.dislikes
          };
        }
      }
      return article;
    }));
  };

  const handleDislike = (articleId: number) => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        if (article.isDisliked) {
          return { ...article, isDisliked: false, dislikes: article.dislikes - 1 };
        } else {
          return { 
            ...article, 
            isDisliked: true, 
            isLiked: false,
            dislikes: article.dislikes + 1,
            likes: article.isLiked ? article.likes - 1 : article.likes
          };
        }
      }
      return article;
    }));
  };

  const handleBlock = (articleId: number) => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        return { ...article, isBlocked: !article.isBlocked };
      }
      return article;
    }));
  };

  const handleEdit = (articleId: number) => {
    router.push(`/dashboard/edit-article/${articleId}`);
  };

  const handleDelete = (articleId: number) => {
    if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      setArticles(prev => prev.filter(article => article.id !== articleId));
    }
  };

  const openArticle = (article: typeof mockArticles[0]) => {
    setSelectedArticle(article);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  const filteredArticles = articles.filter(article => !article.isBlocked);

  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'articles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Articles
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'preferences'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preferences
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'articles' && (
              <ArticleManagement
                articles={articles}
                onLike={handleLike}
                onDislike={handleDislike}
                onBlock={handleBlock}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Article Preferences</h2>
                <p className="text-gray-600 mb-6">These are the categories you're interested in. Articles from these topics will appear in your feed.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Sports', 'Politics', 'Space', 'Technology', 'Health', 'Science', 'Entertainment', 'Business', 'Education', 'Environment'].map((category) => (
                    <label key={category} className="relative cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={mockUser.preferences.includes(category)}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        mockUser.preferences.includes(category)
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                        <div className="text-center">
                          <div className={`w-6 h-6 rounded-full border-2 mx-auto mb-2 transition-all duration-200 ${
                            mockUser.preferences.includes(category)
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {mockUser.preferences.includes(category) && (
                              <svg className="w-4 h-4 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-sm">{category}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mt-8">
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Viewer Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {selectedArticle.category}
                    </span>
                    <span>By {selectedArticle.author}</span>
                    <span>{selectedArticle.date}</span>
                  </div>
                </div>
                <button
                  onClick={closeArticle}
                  className="text-gray-400 hover:text-gray-600 ml-4"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed">{selectedArticle.content}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(selectedArticle.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedArticle.isLiked 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={selectedArticle.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="font-medium">{selectedArticle.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => handleDislike(selectedArticle.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedArticle.isDisliked 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={selectedArticle.isDisliked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2" />
                    </svg>
                    <span className="font-medium">{selectedArticle.dislikes}</span>
                  </button>
                </div>
                
                {!selectedArticle.isOwner && (
                  <button
                    onClick={() => handleBlock(selectedArticle.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedArticle.isBlocked 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {selectedArticle.isBlocked ? 'Unblock Article' : 'Block Article'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 