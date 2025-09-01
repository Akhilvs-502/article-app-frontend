export interface Article {
  id: string | number;
  _id?: string; // MongoDB-style ID from API
  title: string;
  category: string;
  author: string;
  date: string;
  content: string;
  image: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  isOwner: boolean;
  isBlocked: boolean;
}

export interface CreateArticleData {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  image: File | null;
}

export interface ArticleFormErrors {
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  tags?: string;
  image?: string;
} 