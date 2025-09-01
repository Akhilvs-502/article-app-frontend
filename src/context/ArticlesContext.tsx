'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export interface DashboardArticle {
  id: string | number;
  title: string;
  category: string;
  author: string;
  date: string;
  image: string;
  isOwner: boolean;
  content: string;
  description: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  isBlocked: boolean;
}

type ArticlesContextType = {
  articles: DashboardArticle[];
  setArticles: (articles: DashboardArticle[] | ((prev: DashboardArticle[]) => DashboardArticle[])) => void;
};

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export function ArticlesProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<DashboardArticle[]>([]);
  const value = useMemo(() => ({ articles, setArticles }), [articles]);
  return <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>;
}

export function useArticles() {
  const ctx = useContext(ArticlesContext);
  if (!ctx) throw new Error('useArticles must be used within ArticlesProvider');
  return ctx;
}

