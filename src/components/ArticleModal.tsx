'use client';

import { useState } from 'react';
import { Article } from '@/types/article';

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (id: number | string) => void;
  onDislike: (id: number | string) => void;
  onBlock: (id: number | string) => void;
}

export default function ArticleModal({ 
  article, 
  isOpen, 
  onClose, 
  onLike, 
  onDislike, 
  onBlock 
}: ArticleModalProps) {
  const [isBlocked, setIsBlocked] = useState(false);

  // Debug logging
  console.log('ArticleModal props:', { article, isOpen, isBlocked });

  if (!isOpen || !article) {
    console.log('Modal not showing:', { isOpen, hasArticle: !!article });
    return null;
  }

  // Validate article data
  if (!article.title || !article.content) {
    console.error('Invalid article data:', article);
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-6 py-4">
              <h3 className="text-lg font-medium text-red-600">Error Loading Article</h3>
              <p className="mt-2 text-sm text-gray-500">The article data is incomplete or corrupted.</p>
              <button
                onClick={onClose}
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBlock = () => {
    setIsBlocked(true);
    onBlock(article._id || article.id);
    // Close modal after blocking
    setTimeout(() => {
      onClose();
      setIsBlocked(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(article.date)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white">
            {/* Image */}
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Details */}
            <div className="px-6 py-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h2>
              
              <div className="flex items-center space-x-4 mb-6 text-sm text-gray-600">
                <span>By <span className="font-medium text-gray-800">{article.author}</span></span>
                <span>•</span>
                <span>{formatDate(article.date)}</span>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
                <p className="whitespace-pre-wrap">{article.content}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onLike(article._id || article.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      article.isLiked 
                        ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={article.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="font-medium">{article.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => onDislike(article._id || article.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      article.isDisliked 
                        ? 'bg-red-100 text-red-700 ring-2 ring-red-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={article.isDisliked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2" />
                    </svg>
                    <span className="font-medium">{article.dislikes}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleBlock}
                    disabled={isBlocked}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isBlocked
                        ? 'bg-red-100 text-red-700 cursor-not-allowed'
                        : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <span className="font-medium">
                      {isBlocked ? 'Blocked!' : 'Block Article'}
                    </span>
                  </button>

                  <button
                    onClick={onClose}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 