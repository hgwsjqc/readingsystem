import {
  useEffect,
  useState
} from 'react';
import { useHomeStore } from '@/store/home'
import { useUserStore } from '@/store/useUserStore';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import PostItem from '@/components/PostItem';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BottomNav from '@/components/BottomNav';
import { throttle } from '@/utils';

export default function Home() {
  const navigate = useNavigate();
  const { 
    posts,
    hasMore,
    loadMore,
    loading
  } = useHomeStore();
  
  const { user, isLogin } = useUserStore();
  const [showTopSearch, setShowTopSearch] = useState(false);
  
  useEffect(() => {
    loadMore();
  }, []);
  
  // 滚动监听，控制顶部搜索框的显示
  // useEffect(() => {
  //   const handleScroll = throttle(() => {
  //     const scrollY = window.scrollY;
  //     setShowTopSearch(scrollY > 100); // 当滚动超过100px时显示顶部搜索框
  //   }, 100); // 使用节流，每100ms最多执行一次
    
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);
  
 
  // AI 工具箱数据
  const aiTools = [
    {
      id: 1,
      title: '角色工坊',
      icon: '🎭',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      id: 2,
      title: '智能阅读',
      icon: '📄',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 3,
      title: 'Git 助手',
      icon: '🔗',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部搜索栏 */}
      {/* {showTopSearch && (
        <div 
          className="fixed top-0 left-0 right-0 px-4 py-2 bg-white shadow-sm z-40 transition-all duration-300"
          onClick={() => navigate("/search")}
        >
          <div className="relative max-x-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input 
              readOnly
              placeholder="搜索你感兴趣的内容"
              className="pl-9 rounded-full cursor-pointer bg-muted"
            />
          </div>
        </div>
      )} */}
    
      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-6">
        {/* 主页搜索框 */}
        <section className="mb-8">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-full max-w-2xl">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </div>
              <Input
                readOnly
                placeholder="输入并搜索"
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={() => navigate('/search')}
              />
            </div>
          </div>
        </section>

        {/* AI 工具箱 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">AI 工具箱</h2>
          <div className="grid grid-cols-3 gap-4">
            {aiTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 duration-300 cursor-pointer"
                onClick={() => {
                  if (tool.title === '角色工坊') {
                    navigate('/role-workshop');
                  } else if (tool.title === '智能阅读') {
                    navigate('/smart-reading');
                  } else if (tool.title === 'Git 助手') {
                    navigate('/git');
                  }
                }}
              >
                <div className={`w-16 h-16 rounded-full ${tool.bgColor} flex items-center justify-center mb-3`}>
                  <span className="text-2xl">{tool.icon}</span>
                </div>
                <span className="text-sm font-medium">{tool.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 发现 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">发现</h2>
          <div className="space-y-4">
            <InfiniteScroll
              hasMore={hasMore}
              isLoading={loading}
              onLoadMore={loadMore}
            >
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostItem
                    key={post.id}
                    post={post}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  {loading ? '加载中...' : '暂无文章'}
                </div>
              )}
            </InfiniteScroll>
          </div>
        </section>
      </div>

      {/* 底部导航栏 */}
      <BottomNav />
    </div>
  );
}
