export interface Article {
  id: number;
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
}

export interface CreateArticleData {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  image: File | null;
  isPublished: boolean;
}

export interface ArticleFormErrors {
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  tags?: string;
  image?: string;
} 