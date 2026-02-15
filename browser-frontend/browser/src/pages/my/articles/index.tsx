import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Heart, MessageCircle, ArrowLeft } from "lucide-react";
import { useUserStore } from '@/store/useUserStore';
import Loading from '@/components/Loading';
import axios from '@/api/config';

// 获取用户文章数据
const fetchUserArticles = async (userId: number, page: number = 1, limit: number = 10) => {
  try {
    // 调用后端 API 获取真实数据
    const data = await axios.get(`/users/articles?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    console.error('获取用户文章失败', error);
    // 使用模拟数据作为 fallback
    return {
      items: [
        {
          id: 1,
          title: "软件设计模式详解",
          brief: "设计模式是解决常见软件设计问题的可复用方案，本文将详细介绍常用的设计模式及其应用场景。",
          content: "设计模式是解决常见软件设计问题的可复用方案，本文将详细介绍常用的设计模式及其应用场景。",
          tags: ["软件设计", "设计模式"],
          user: {
            id: userId,
            name: "用户名称",
            avatar: ""
          },
          totalLikes: 12,
          totalComments: 5,
          viewCount: 128,
          thumbnail: "",
          createdAt: "2026-02-10T10:00:00Z"
        },
        {
          id: 2,
          title: "React 19 新特性介绍",
          brief: "React 19 带来了许多新特性和改进，本文将介绍这些新特性及其使用方法。",
          content: "React 19 带来了许多新特性和改进，本文将介绍这些新特性及其使用方法。",
          tags: ["React", "前端开发"],
          user: {
            id: userId,
            name: "用户名称",
            avatar: ""
          },
          totalLikes: 8,
          totalComments: 3,
          viewCount: 96,
          thumbnail: "",
          createdAt: "2026-02-08T14:30:00Z"
        },
        {
          id: 3,
          title: "TypeScript 高级类型技巧",
          brief: "TypeScript 提供了丰富的类型系统，本文将介绍一些高级类型技巧，帮助你写出更类型安全的代码。",
          content: "TypeScript 提供了丰富的类型系统，本文将介绍一些高级类型技巧，帮助你写出更类型安全的代码。",
          tags: ["TypeScript", "前端开发"],
          user: {
            id: userId,
            name: "用户名称",
            avatar: ""
          },
          totalLikes: 15,
          totalComments: 7,
          viewCount: 156,
          thumbnail: "",
          createdAt: "2026-02-05T09:15:00Z"
        }
      ],
      total: 3
    };
  }
};

export default function MyArticles() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchUserArticles(user.id, 1, 10);
        setArticles(data.items);
      } catch (error) {
        console.error('加载文章失败', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [user]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleArticleClick = (articleId: number) => {
    navigate(`/post/${articleId}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">我的文章</h1>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="container mx-auto px-4 py-6">
        {articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleArticleClick(article.id)}
              >
                {/* 标签 */}
                <div className="flex items-center gap-2 mb-2">
                  {article.tags.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs"
                    >{tag}</Badge>
                  ))}
                </div>

                {/* 标题 */}
                <h2 className="text-lg font-semibold mb-2">
                  {article.title}
                </h2>

                {/* 简介 */}
                <p className="text-sm text-muted-foreground mb-4">
                  {article.brief}
                </p>

                {/* 作者信息 */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={article.user.avatar} />
                    <AvatarFallback>{article.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{article.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(article.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{article.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    <span>{article.totalLikes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span>{article.totalComments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500">还没有发表过文章，快去发布你的第一篇文章吧！</p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/mine')}
            >
              发布文章
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
