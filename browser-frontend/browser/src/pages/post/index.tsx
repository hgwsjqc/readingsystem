import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart, MessageCircle, ArrowLeft, Send, ThumbsUp } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import Loading from '@/components/Loading';
import axios from '@/api/config';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLogin } = useUserStore();
  
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // 获取文章详情
  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const postData = await axios.get(`/posts/${id}`);
        setPost(postData);
        setLikeCount(postData.totalLikes || 0);
        setCommentCount(postData.totalComments || 0);
      } catch (error) {
        console.error('获取文章详情失败', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id]);

  // 获取评论列表
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      
      try {
        const commentsData = await axios.get(`/comments/post/${id}`);
        setComments(commentsData);
      } catch (error) {
        console.error('获取评论列表失败', error);
      }
    };

    fetchComments();
  }, [id]);

  // 检查用户是否已点赞
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!id || !isLogin || !user) return;
      
      try {
        const likes = await axios.get(`/likes/post/${id}`);
        const userLike = likes.find((like: any) => like.userId === user.id);
        setIsLiked(!!userLike);
      } catch (error) {
        console.error('检查点赞状态失败', error);
      }
    };

    checkLikeStatus();
  }, [id, isLogin, user]);

  // 处理点赞
  const handleLike = async () => {
    if (!id || !isLogin) {
      alert('请先登录');
      return;
    }

    try {
      if (isLiked) {
        // 取消点赞
        await axios.delete(`/likes/post/${id}`);
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        // 点赞
        await axios.post(`/likes/post/${id}`);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error: any) {
      console.error('点赞操作失败', error);
      if (error.response?.status === 401) {
        alert('登录已过期，请重新登录');
        // 跳转到登录页面
        // navigate('/login');
      } else {
        alert('操作失败，请重试');
      }
    }
  };

  // 处理发表评论
  const handleSubmitComment = async () => {
    if (!id || !isLogin || !commentContent.trim()) {
      if (!isLogin) {
        alert('请先登录');
      } else if (!commentContent.trim()) {
        alert('请输入评论内容');
      }
      return;
    }

    try {
      setSubmitting(true);
      await axios.post('/comments', {
        content: commentContent,
        postId: parseInt(id)
      });
      
      // 重新获取评论列表
      const commentsData = await axios.get(`/comments/post/${id}`);
      setComments(commentsData);
      setCommentContent('');
      setCommentCount(prev => prev + 1);
    } catch (error: any) {
      console.error('发表评论失败', error);
      if (error.response?.status === 401) {
        alert('登录已过期，请重新登录');
        // 跳转到登录页面
        // navigate('/login');
      } else {
        alert('发表评论失败，请重试');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loading />;
  }

  if (!post) {
    return <div className="container mx-auto px-4 py-8">文章不存在</div>;
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
          <h1 className="text-lg font-semibold">文章详情</h1>
        </div>
      </div>

      {/* 文章内容 */}
      <div className="container mx-auto px-4 py-6">
        {/* 文章标题和元信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.user?.avatar} />
                <AvatarFallback>{post.user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{post.user?.name || '未知用户'}</span>
            </div>
            <span className="text-sm text-gray-500">{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</span>
          </div>

          {/* 文章内容 */}
          <div className="prose max-w-none mb-6">
            <p>{post.content}</p>
          </div>

          {/* 文章标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 文章统计和操作 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
                <span className="text-sm text-gray-600">{likeCount} 点赞</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">{commentCount} 评论</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className={`rounded-full ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        {/* 评论区 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">评论 ({commentCount})</h2>

          {/* 发表评论 */}
          <div className="mb-6">
            <Label htmlFor="comment" className="block mb-2 text-sm font-medium text-gray-700">
              发表评论
            </Label>
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  id="comment"
                  placeholder={isLogin ? '写下你的评论...' : '登录后才能发表评论'}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="resize-none"
                  rows={3}
                  disabled={!isLogin}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!isLogin || !commentContent.trim() || submitting}
                    className="flex items-center gap-2"
                  >
                    <span>{submitting ? '发布中...' : '发布'}</span>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 评论列表 */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment: any) => (
                <div key={comment.id} className="border-t border-gray-200 pt-4">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user?.avatar} />
                      <AvatarFallback>{comment.user?.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{comment.user?.name || '未知用户'}</span>
                        <span className="text-xs text-gray-500">
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{comment.content}</p>
                      {/* 回复按钮可以在这里添加 */}
                    </div>
                  </div>
                  {/* 回复列表可以在这里添加 */}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                还没有评论，快来发表第一条评论吧！
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;