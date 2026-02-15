import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useUserStore } from '@/store/useUserStore';
import Loading from '@/components/Loading';
import axios from '@/api/config';

// 获取用户评论数据
const fetchUserComments = async (userId: number, page: number = 1, limit: number = 10) => {
  try {
    // 调用后端 API 获取真实数据
    const data = await axios.get(`/users/comments?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    console.error('获取用户评论失败', error);
    // 使用模拟数据作为 fallback
    return {
      items: [],
      total: 0
    };
  }
};

export default function MyComments() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchUserComments(user.id, 1, 10);
        setComments(data.items);
      } catch (error) {
        console.error('加载评论失败', error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [user]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePostClick = (postId: number | undefined) => {
    if (postId) {
      navigate(`/post/${postId}`);
    }
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
          <h1 className="text-lg font-semibold">我的评论</h1>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="container mx-auto px-4 py-6">
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                {/* 评论内容 */}
                <p className="text-sm mb-4">
                  {comment.content}
                </p>

                {/* 评论的文章信息 */}
                <div 
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handlePostClick(comment.post?.id)}
                >
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium line-clamp-1">
                      {comment.post?.title || '未知文章'}
                    </h3>
                  </div>
                </div>

                {/* 评论时间 */}
                <div className="mt-2 text-xs text-muted-foreground text-right">
                  {new Date(comment.createdAt || Date.now()).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="mb-4 flex justify-center">
              <MessageCircle className="w-12 h-12 text-gray-300" />
            </div>
            <p className="text-gray-500 mb-4">还没有发表过评论，快去参与讨论吧！</p>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
            >
              浏览文章
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
