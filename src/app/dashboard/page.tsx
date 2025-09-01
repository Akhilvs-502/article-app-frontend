'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ArticleManagement from '@/components/dashboard/ArticleManagement';
import { mockArticles as baseArticles } from '@/data/mockArticles';
import { getUserArticleService, editArticleService } from '@/services/dashboard';
import { useArticles, DashboardArticle } from '@/context/ArticlesContext';
import EditArticleForm, { EditArticleData } from '@/components/EditArticleForm';
import { toastError } from '@/utils/toast';




export default function DashboardPage() {

  const router = useRouter();

  const [selectedArticle, setSelectedArticle] = useState<DashboardArticle | null>(null);
  const [editingArticle, setEditingArticle] = useState<DashboardArticle | null>(null);
  const { articles, setArticles } = useArticles();


  useEffect(()=>{
    try{
      const getData = async () => {
        const response = await getUserArticleService();
        const apiData = (response as any)?.data?.data ?? [];
        const normalized: DashboardArticle[] = apiData.map((item: any) => ({
          id: (item?.id ?? item?._id) as string | number,
          title: item?.title ?? '',
          category: item?.category ?? 'General',
          author: item?.author ?? 'Unknown',
          date: item?.date ?? new Date().toISOString(),
          image: item?.image ?? 'https://via.placeholder.com/800x400',
          isOwner: Boolean(item?.isOwner ?? true),
          content: item?.content ?? '',
          description: item?.description ?? (item?.content ? String(item?.content).slice(0, 180) : ''),
          likes: Number(item?.likes ?? 0),
          dislikes: Number(item?.dislikes ?? 0),
          isLiked: Boolean(item?.isLiked ?? false),
          isDisliked: Boolean(item?.isDisliked ?? false),
          isBlocked: Boolean(item?.isBlocked ?? false)
        }));
        setArticles(normalized);
      };
      getData().catch((error) => {
        console.error("Failed to fetch articles:", error);
        
      });
    }
    catch(error){
      console.error("Error in useEffect:", error);
      
    }
  }, [setArticles])

  const handleLike = (articleId: string | number) => {
    setArticles((prev: DashboardArticle[]) => prev.map((article: DashboardArticle) => {
        if (String(article.id) === String(articleId)) {
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

  const handleDislike = (articleId: string | number) => {
    setArticles((prev: DashboardArticle[]) => prev.map((article: DashboardArticle) => {
      if (String(article.id) === String(articleId)) {
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

  const handleBlock = (articleId: string | number) => {
    setArticles((prev: DashboardArticle[]) => prev.map((article: DashboardArticle) => {
      if (String(article.id) === String(articleId)) {
        return { ...article, isBlocked: !article.isBlocked };
      }
      return article;
    }));
  };

  const handleEdit = (articleId: string | number) => {
    const target = articles.find(a => String(a.id) === String(articleId)) || null;
    setEditingArticle(target);
  };

  

  const openArticle = (article: DashboardArticle) => {
    setSelectedArticle(article);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };
  const handleEditCancel = () => setEditingArticle(null);

  const handleEditSubmit = async (data: EditArticleData) => {
    if (!editingArticle) return;
    
    try {
      // Call the edit article service with all the updated form data
      const response = await editArticleService(editingArticle.id, {
        title: data.title,
        content: data.content,
        category: data.category,
        description: data.description,
        image: data.image
      });

      // Update the local state with the edited article
      const updated: DashboardArticle = {
        ...editingArticle,
        title: data.title,
        content: data.content,
        category: data.category,
        image: data.image,
      };
      
      setArticles((prev: DashboardArticle[]) => prev.map((a) => String(a.id) === String(editingArticle.id) ? updated : a));
      setEditingArticle(null);
      
      // You can add a success message here if needed
      console.log('Article updated successfully:', response);
      
    } catch (error) {
      console.error('Failed to update article:', error);
      // You can add error handling here if needed
    }
  };


  const handleDelete = async(articleId: string | number) => {
    console.log(articleId);
    
    if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
1
    try {


      const response = await editArticleService(articleId, {isBlocked:true});
      const updated: DashboardArticle = {
        ...editingArticle!,
        isBlocked:true
      };
      // setArticles((prev: DashboardArticle[]) => prev.map((a) => String(a.id) === String(editingArticle.id) ? updated : a));
      setEditingArticle(null);
      setArticles((prev: DashboardArticle[]) => prev.filter((article: DashboardArticle) => String(article.id) !== String(articleId)));
      

      
    } catch (error) {
      console.log(error);
      toastError("error")
      
    
    }

    }
  };

  // inline edit removed; handled by dedicated page component

  const filteredArticles = articles.filter((article: DashboardArticle) => !article.isBlocked);

  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Page Header */}
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">My Articles</h1>
              <p className="text-gray-600 mt-1">Manage and view your published articles</p>
            </div>
          </div>

                    {/* Content */}
          <div className="p-6">
            <ArticleManagement
              articles={articles}
              onLike={handleLike}
              onDislike={handleDislike}
              onBlock={handleBlock}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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

      {editingArticle && (
        <EditArticleForm
          variant="modal"
          heading="Edit Article"
          initialData={{
            title: editingArticle.title,
            description: editingArticle.description,
            content: editingArticle.content,
            category: editingArticle.category,
            image: editingArticle.image
          }}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
        />
      )}

    </div>
  );
} 