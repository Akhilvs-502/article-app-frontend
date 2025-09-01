'use client';

import { useState, useMemo, useEffect } from 'react';
import ArticleCard from '@/components/ArticleCard';
import ArticleModal from '@/components/ArticleModal';
import { Article } from '@/types/article';
import { getUserFeedsService, articleActionService } from '@/services/dashboard';

const categories = ['All', 'Technology', 'Science', 'Health', 'Sports', 'Space', 'Environment'];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'title'>('date');
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAndSortedArticles = useMemo(() => {
    const filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'likes':
          return b.likes - a.likes;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [articles, searchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getUserFeedsService();
        const apiData = response?.data?.data ?? [];
        console.log('API Response:', apiData);
        
        if (apiData && apiData.length > 0) {
          // Normalize the API data to match Article interface
          const normalizedArticles = apiData.map((item: { _id?: string; id?: string; title?: string; content?: string; description?: string; category?: string; author?: string; createdAt?: string; imageUrl?: string; image?: string; likes?: number; dislikes?: number; isLiked?: boolean; isDisliked?: boolean }) => ({
            id: item._id || item.id,
            _id: item._id, // Keep the original _id for API calls
            title: item.title || '',
            category: item.category || 'General',
            author: item.author || 'Unknown',
            date: item.createdAt || new Date().toISOString(),
            image: item.image || item.imageUrl || 'https://via.placeholder.com/800x400',
            content: item.content || item.description || '',
            likes: item.likes || 0,
            dislikes: item.dislikes || 0,
            isLiked: item.isLiked || false,
            isDisliked: item.isDisliked || false
          }));
          setArticles(normalizedArticles);
        } 
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        // Fallback to mock data on error
    
      }
    };

    fetchArticles();
  }, []);

  const handleLike = async (articleId: number | string) => {
    try {
      console.log(articleId, "articleId");
      await articleActionService(articleId, 'like');
      // Update local state after successful API call
      setArticles(prev => prev.map(article => {
        if (article.id === articleId) {
          if (article.isLiked) {
            return { ...article, isLiked: false, likes: article.likes - 1 };
          } else {
            return { ...article, isLiked: true, isDisliked: false, likes: article.likes + 1 };
          }
        }
        return article;
      }));
    } catch (error) {
      console.error("Failed to like article:", error);
    }
  };

  const handleDislike = async (articleId: number | string) => {
    try {
      await articleActionService(articleId, 'dislike');
      // Update local state after successful API call
      setArticles(prev => prev.map(article => {
        if (article.id === articleId) {
          if (article.isDisliked) {
            return { ...article, isDisliked: false, dislikes: article.dislikes - 1 };
          } else {
            return { ...article, isDisliked: true, isLiked: false, dislikes: article.dislikes + 1 };
          }
        }
        return article;
      }));
    } catch (error) {
      console.error("Failed to dislike article:", error);
    }
  };

  const handleReadMore = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleBlock = async (articleId: number | string) => {
    try {
      await articleActionService(articleId, 'block');
      // Remove blocked article from local state
      setArticles(prev => prev.filter(article => article.id !== articleId));
      setIsModalOpen(false);
      setSelectedArticle(null);
    } catch (error) {
      console.error("Failed to block article:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Articles
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore a diverse collection of articles across technology, science, health, sports, and more.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Articles
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

  
      

        {/* Articles Grid */}
        {filteredAndSortedArticles.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedArticles.map((article) => (
              <ArticleCard
                key={article._id}
                article={article}
                onLike={handleLike}
                onDislike={handleDislike}
                onReadMore={handleReadMore}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={closeModal}
        onLike={handleLike}
        onDislike={handleDislike}
        onBlock={handleBlock}
      />
    </div>
  );
}
