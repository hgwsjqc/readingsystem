import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore'
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Edit, Settings, BookOpen, MessageCircle, Heart, PenTool, X, Trash2, Sparkles, Camera, Upload } from 'lucide-react';
import Loading from '@/components/Loading';
import { useReadingStore } from '@/store/reading';
import axios from '@/api/config';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

export default function Mine() {
  const navigate = useNavigate();
  const {
    user,
    logout,
    updateUser
  } = useUserStore();
  const { userBooks, fetchUserBooks } = useReadingStore();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    articles: 0,
    comments: 0,
    likes: 0
  });
  
  // 编辑个人信息状态
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: ''
  });

  // 获取用户统计信息和书架数据
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        // 调用后端 API 获取真实数据
        const data = await axios.get('/users/stats');
        setStats(data);
      } catch (error) {
        console.error('获取用户统计信息失败', error);
        // 获取失败时显示为 0
        setStats({
          articles: 0,
          comments: 0,
          likes: 0
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserStats();
      // 获取用户书架中的书籍
      fetchUserBooks();
    } else {
      // 用户未登录时显示为 0
      setStats({
        articles: 0,
        comments: 0,
        likes: 0
      });
    }
  }, [user, fetchUserBooks]);

  // 打开编辑个人信息表单
  const handleEditProfile = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || ''
      });
      setEditError('');
      setIsEditing(true);
    }
  };

  // 处理表单提交
  const handleSubmitEdit = async () => {
    if (!user) return;

    // 验证表单数据
    if (!formData.name.trim()) {
      setEditError('用户名不能为空');
      return;
    }

    setEditLoading(true);
    setEditError('');

    try {
      // 调用后端 API 更新用户信息
      const updatedUser = await axios.post('/users/profile', formData);
      
      // 更新本地用户状态
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      // 关闭编辑表单
      setIsEditing(false);
      
      // 显示成功提示（使用更友好的方式）
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2';
      successMessage.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>个人信息更新成功！</span>
      `;
      document.body.appendChild(successMessage);
      
      // 3秒后自动移除提示
      setTimeout(() => {
        successMessage.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => successMessage.remove(), 500);
      }, 3000);
    } catch (error) {
      console.error('更新个人信息失败', error);
      setEditError('更新个人信息失败，请重试');
    } finally {
      setEditLoading(false);
    }
  };

  const handlePublishArticle = () => {
    // 跳转到发布文章页面
    navigate('/post/create');
  };

  const handleMyArticles = () => {
    // 跳转到我的文章页面
    navigate('/my/articles');
  };

  const handleMyComments = () => {
    // 跳转到我的评论页面
    navigate('/my/comments');
  };

  const handleMyLikes = () => {
    // 跳转到我的点赞页面
    navigate('/my/likes');
  };

  // 从书架中移除书籍
  const handleRemoveBook = async (bookId: number) => {
    try {
      await axios.delete(`/reading/${bookId}/remove`);
      // 移除成功后，重新获取书架数据
      await fetchUserBooks();
      
      // 显示移除成功提示
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 transform transition-transform duration-300 ease-in-out';
      successMessage.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>已从书架中移除</span>
      `;
      document.body.appendChild(successMessage);
      
      // 动画效果
      setTimeout(() => {
        successMessage.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => successMessage.remove(), 500);
      }, 3000);
    } catch (error) {
      console.error('移除书籍失败', error);
      alert('移除失败，请重试');
    }
  };

  const [open, setOpen] = useState(false);
  const { aiAvatar } = useUserStore();

  const handleAction = async (type: string) => {
    setOpen(false);
    if (type === 'ai') {
      setLoading(true);
      await aiAvatar();
      setLoading(false);
    }
  };
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部用户信息 */}
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {user?.name?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader className="text-left">
                    <DrawerTitle>修改头像</DrawerTitle>
                    <DrawerDescription>
                      请选择一种方式更新您的个人头像
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-14 text-base"
                      onClick={() => handleAction('camera')}
                    >
                      <Camera className="mr-3 h-5 w-5 text-blue-500"/>
                      拍照
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start h-14 text-base"
                      onClick={() => handleAction('upload')}
                    >
                      <Upload className="mr-3 h-5 w-5 text-blue-500"/>
                      从相册上传
                    </Button>

                    <Button
                      variant="default"
                      className="w-full justify-start h-14 text-base bg-gradient-to-r from-purple-600 to-indigo-600 border-none text-white"
                      onClick={() => handleAction('ai')}
                    >
                      <Sparkles className="mr-3 h-5 w-5 text-yellow-300"/>
                      AI 生成头像
                    </Button>
                  </div>
                  <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                      <Button variant="ghost" className="w-full h-12">取消</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
            <div>
              <h1 className="text-xl font-bold">{user?.name || '我的主页'}</h1>
              <p className="text-sm text-gray-500">{user?.bio || '记录美好生活，分享技术点滴'}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEditProfile}
            className="rounded-full"
          >
            <Edit className="w-5 h-5" />
          </Button>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center cursor-pointer" onClick={handleMyArticles}>
            <div className="text-2xl font-bold">{stats.articles}</div>
            <div className="text-sm text-gray-500">我的文章</div>
          </div>
          <div className="text-center cursor-pointer" onClick={handleMyComments}>
            <div className="text-2xl font-bold">{stats.comments}</div>
            <div className="text-sm text-gray-500">我的评论</div>
          </div>
          <div className="text-center cursor-pointer" onClick={handleMyLikes}>
            <div className="text-2xl font-bold">{stats.likes}</div>
            <div className="text-sm text-gray-500">我的点赞</div>
          </div>
        </div>

        {/* 发布新文章按钮 */}
        <Button
          className="w-full h-12 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
          onClick={handlePublishArticle}
        >
          <PenTool className="w-5 h-5" />
          <span>发布新文章</span>
        </Button>
      </div>

      {/* 我的书架 */}
      <div className="bg-white p-6 mt-4">
        <h2 className="text-lg font-semibold mb-4">我的书架</h2>
        {userBooks.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {userBooks.map((userBook) => (
              <div
                key={`user-book-${userBook.userId}-${userBook.bookId}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/reading/${userBook.bookId}`)}
              >
                <div className="relative">
                  <img
                    src={userBook.book.coverFile?.filename ? `http://localhost:3000/uploads/${userBook.book.coverFile.filename}` : `https://gd-hbimg.huaban.com/5fed28fedc45288cd822a0cfdc93423dc5f0268131e3-3b6BgB_fw658`}
                    alt={userBook.book.title}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡
                      handleRemoveBook(userBook.bookId);
                    }}
                    title="移出书架"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">{userBook.book.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{userBook.book.author}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-500">还没有书籍，快去阅读栏添加吧！</p>
          </div>
        )}
      </div>

      
      <div className="bg-white p-6 mt-4">
      
        <div className="space-y-2">
          {/* 其他设置项可以在这里添加 */}
          <div 
            className="py-3 border-t border-gray-200 text-center"
            onClick={() => logout()}
          >
            <span className="text-blue-600 cursor-pointer">退出登录</span>
          </div>
        </div>
      </div>

      {/* 编辑个人信息表单 */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">编辑个人信息</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">
              {editError && (
                <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
                  {editError}
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">用户名</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入用户名"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">个人简介</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="请输入个人简介"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button 
                onClick={handleSubmitEdit}
                disabled={editLoading}
              >
                {editLoading ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}