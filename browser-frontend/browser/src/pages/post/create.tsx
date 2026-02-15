import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import Loading from '@/components/Loading';
import axios from '@/api/config';

const CreatePost = () => {
  const navigate = useNavigate();
  const { isLogin } = useUserStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };

  // 处理发布文章
  const handleSubmit = async () => {
    if (!isLogin) {
      alert('请先登录');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await axios.post('/posts', {
        title,
        content
      });

      // 发布成功，显示自定义成功提示
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 transform transition-transform duration-300 ease-in-out';
      successMessage.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>文章发布成功！</span>
      `;
      document.body.appendChild(successMessage);
      
      // 动画效果
      setTimeout(() => {
        successMessage.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => successMessage.remove(), 500);
      }, 3000);

      // 发布成功，跳转到我的文章页面
      setTimeout(() => {
        navigate('/my/articles');
      }, 1000);
    } catch (error: any) {
      console.error('发布文章失败', error);
      setError('发布文章失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white p-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">发布新文章</h1>
          </div>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            发布
          </Button>
        </div>
      </div>

      {/* 发布文章表单 */}
      <div className="container mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* 标题输入 */}
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              placeholder="请输入文章标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* 内容输入 */}
          <div className="space-y-2">
            <Label htmlFor="content">内容</Label>
            <Textarea
              id="content"
              placeholder="请输入文章内容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] resize-y"
              rows={15}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;