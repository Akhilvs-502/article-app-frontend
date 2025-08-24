'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import ArticleModal from '@/components/ArticleModal';
import { Article } from '@/types/article';
import { mockArticles } from '@/data/mockArticles';

const categories = ['All', 'Technology', 'Science', 'Health', 'Sports', 'Space', 'Environment'];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'title'>('date');
  const [articles, setArticles] = useState(mockArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles.filter(article => {
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

  const handleLike = (articleId: number) => {
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
  };

  const handleDislike = (articleId: number) => {
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
  };

  const handleReadMore = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleBlock = (articleId: number) => {
    setArticles(prev => prev.filter(article => article.id !== articleId));
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Article Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/settings" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Settings
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Dashboard
              </Link>
              <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

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
                key={article.id}
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
