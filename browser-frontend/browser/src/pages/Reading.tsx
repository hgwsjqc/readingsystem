import React, { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SlideShow from '@/components/SlideShow';
import { useReadingStore } from '@/store/reading';
import { useUserStore } from '@/store/useUserStore';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import { useNavigate } from 'react-router-dom';

// 轮播图数据
const carouselData = [
  {
    id: 1,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=programmer%20books%20stack%20of%20coding%20books%20programming%20self-improvement&image_size=landscape_16_9',
    title: '程序员修炼之道'
  },
  {
    id: 2,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=clean%20code%20book%20programming%20best%20practices&image_size=landscape_16_9',
    title: '代码整洁之道'
  },
  {
    id: 3,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=zero%20to%20one%20book%20startup%20entrepreneurship&image_size=landscape_16_9',
    title: '从0到1'
  }
];

export default function Reading() {
  console.log('Reading.tsx 组件加载');
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { isLogin } = useUserStore();
  const { books, loading, fetchBooks, addToBookshelf, hasMore, loadMore, setSearch, bookInBookshelf, fetchUserBooks } = useReadingStore();
  
  // 组件加载时获取书籍数据
  useEffect(() => {
    setSearch('');
    console.log('组件加载，调用 fetchBooks()');
    fetchBooks();
    loadMore();
    // 只有登录用户才获取书架数据
    if (isLogin) {
      fetchUserBooks();
    }
  }, [isLogin]);

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('搜索:', searchQuery);
    // 跳转到搜索页面，传递搜索参数
   
    setSearch(searchQuery);
    navigate(`/reading/search?query=${searchQuery}`);
  };

  // 处理添加书籍到书架
  const handleAddBook = async (bookId: number) => {
    try {
      await addToBookshelf(bookId);
      console.log('添加书籍到书架成功:', bookId);
    } catch (err) {
      console.error('添加书籍失败', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部搜索栏 */}
      <div className="fixed top-0 left-0 right-0 px-4 py-2 bg-white shadow-sm z-10">
        <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <Input
            placeholder="搜索书籍或作者..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
          />
          <Button 
            type="submit" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <Search size={16} />
          </Button>
        </form>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-6 pt-20">
        {/* 轮播图 */}
        <section className="mb-8">
          <SlideShow 
            slides={carouselData} 
            autoPlay={true} 
            autoPlayDelay={3000} 
          />
        </section>

        {/* 热门书籍 */}
         <InfiniteScroll
              hasMore={hasMore}
              isLoading={loading}
              onLoadMore={loadMore}
              >
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">热门书籍</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {books.length > 0 ? (
                books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/reading/${book.id}`)}
                  >
                    <div className="relative">
                      <img
                        src={book.coverFile?.filename ? `http://localhost:3000/uploads/${book.coverFile.filename}` : `https://gd-hbimg.huaban.com/5fed28fedc45288cd822a0cfdc93423dc5f0268131e3-3b6BgB_fw658`}
                        alt={book.title}
                        className="w-full h-48 object-cover"
                      />
                      {!bookInBookshelf.get(book.id) && (
                        <button 
                          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation(); // 阻止事件冒泡
                            handleAddBook(book.id);
                          }}
                        >
                          +
                        </button>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-base font-semibold text-gray-800 mb-1">{book.title}</h3>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  暂无书籍
                </div>
              )}
            </div>
          )}
        </section>
        </InfiniteScroll>
      </div>
    </div>
  );
}