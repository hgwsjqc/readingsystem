import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from "lucide-react";
import { useUserStore } from '@/store/useUserStore';
import Loading from '@/components/Loading';
import axios from '@/api/config';

// 获取用户点赞数据
const fetchUserLikes = async (userId: number, page: number = 1, limit: number = 10) => {
  try {
    // 调用后端 API 获取真实数据
    const data = await axios.get(`/users/likes?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    console.error('获取用户点赞失败', error);
    // 使用模拟数据作为 fallback
    return {
      items: [],
      total: 0
    };
  }
};

export default function MyLikes() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [likes, setLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLikes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchUserLikes(user.id, 1, 10);
        setLikes(data.items);
      } catch (error) {
        console.error('加载点赞失败', error);
      } finally {
        setLoading(false);
      }
    };

    loadLikes();
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
          <h1 className="text-lg font-semibold">我的点赞</h1>
        </div>
      </div>

      {/* 点赞列表 */}
      <div className="container mx-auto px-4 py-6">
        {likes.length > 0 ? (
          <div className="space-y-4">
            {likes.map((like) => (
              <div
                key={like.id}
                className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handlePostClick(like.post?.id)}
              >
                {/* 文章信息 */}
                <h3 className="text-base font-semibold mb-2 line-clamp-1">
                  {like.post?.title || '未知文章'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {like.post?.brief || like.post?.content?.substring(0, 100) || '暂无内容'}
                </p>

                {/* 点赞时间 */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                    <span>已点赞</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(like.createdAt || Date.now()).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="mb-4 flex justify-center">
              <Heart className="w-12 h-12 text-gray-300" />
            </div>
            <p className="text-gray-500 mb-4">还没有点赞过任何文章，快去发现喜欢的内容吧！</p>
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
