'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Article } from '@/types/article';
import { mockArticles } from '@/data/mockArticles';
import { getUserFeedsService, articleActionService } from '@/services/dashboard';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await getUserFeedsService();
        const apiData = response?.data?.data ?? [];
        
        if (apiData && apiData.length > 0) {
          // Normalize the API data to match Article interface
          const normalizedArticles = apiData.map((item: { _id?: string; id?: string; title?: string; content?: string; description?: string; category?: string; author?: string; createdAt?: string; imageUrl?: string; image?: string; likes?: number; dislikes?: number; isLiked?: boolean; isDisliked?: boolean }) => ({
            id: item._id || item.id,
            _id: item._id,
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

          const articleId = params.id as string;
          const foundArticle = normalizedArticles.find((a: { _id?: string; id?: string | number }) => a._id === articleId || a.id === articleId);
          
          if (foundArticle) {
            setArticle(foundArticle);
          } else {
            // Article not found, redirect to home
            router.push('/home');
          }
        } else {
          // Fallback to mock data
          const articleId = parseInt(params.id as string);
          const foundArticle = mockArticles.find(a => a.id === articleId);
          
          if (foundArticle) {
            setArticle(foundArticle);
          } else {
            router.push('/home');
          }
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        // Fallback to mock data on error
        const articleId = parseInt(params.id as string);
        const foundArticle = mockArticles.find(a => a.id === articleId);
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          router.push('/home');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/home"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </Link>
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

  const handleLike = async () => {
    try {
      await articleActionService(article._id || article.id, 'like');
      setArticle(prev => {
        if (!prev) return prev;
        if (prev.isLiked) {
          return { ...prev, isLiked: false, likes: prev.likes - 1 };
        } else {
          return { ...prev, isLiked: true, isDisliked: false, likes: prev.likes + 1 };
        }
      });
    } catch (error) {
      console.error("Failed to like article:", error);
    }
  };

  const handleDislike = async () => {
    try {
      await articleActionService(article._id || article.id, 'dislike');
      setArticle(prev => {
        if (!prev) return prev;
        if (prev.isDisliked) {
          return { ...prev, isDisliked: false, dislikes: prev.dislikes - 1 };
        } else {
          return { ...prev, isDisliked: true, isLiked: false, dislikes: prev.dislikes + 1 };
        }
      });
    } catch (error) {
      console.error("Failed to dislike article:", error);
    }
  };

  const handleBlock = async () => {
    try {
      await articleActionService(article._id || article.id, 'block');
      setIsBlocked(true);
      // Redirect after blocking
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    } catch (error) {
      console.error("Failed to block article:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Image */}
          <div className="relative h-64 sm:h-80 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {article.category}
              </span>
            </div>
          </div>

          {/* Article Info */}
          <div className="p-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
              <span>By <span className="font-medium text-gray-800">{article.author}</span></span>
              <span>•</span>
              <span>{formatDate(article.date)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLike}
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
                  onClick={handleDislike}
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
                  {isBlocked ? 'Blocked! Redirecting...' : 'Block Article'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="whitespace-pre-wrap">{article.content}</p>
          </div>
        </div>

        {/* Related Articles Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockArticles
              .filter(a => a.id !== article.id && a.category === article.category)
              .slice(0, 2)
              .map((relatedArticle) => (
                <Link 
                  key={relatedArticle.id} 
                  href={`/article/${relatedArticle.id}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-32 overflow-hidden">
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      By {relatedArticle.author} • {formatDate(relatedArticle.date)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 