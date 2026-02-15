import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useReadingStore } from '@/store/reading';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import { useNavigate, useSearchParams } from 'react-router-dom';

// 轮播图数据


export default function ReadingSearch() {
  console.log('ReadingSearch.tsx 组件加载');    
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('query') || '';
  const [inputValue, setInputValue] = useState(urlSearchQuery);
  const { books, loading, fetchBooks, addToBookshelf, hasMore, loadMore } = useReadingStore();
  
  // 组件加载时获取搜索结果
  useEffect(() => {
    console.log('搜索页面加载，调用 fetchBooks()', urlSearchQuery);
    fetchBooks(urlSearchQuery, 1);
  }, [urlSearchQuery]);

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('搜索:', inputValue);
    // 更新URL参数并重新获取数据
    navigate(`/reading/search?query=${encodeURIComponent(inputValue)}`);
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
        <div className="flex items-center max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/reading')}
            className="mr-2"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Button>
          <form onSubmit={handleSearch} className="relative flex-grow">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
            <Input
              placeholder="搜索书籍或作者..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              <Search size={16} />
            </Button>
          </form>
        </div>
      </div>
      <div className="pt-20 p-4 space-y-4"></div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-6">
        {/* 搜索结果 */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {urlSearchQuery ? `搜索结果: ${urlSearchQuery}` : '搜索书籍'}
            </h2>
          </div>
          
          <InfiniteScroll
            hasMore={hasMore}
            isLoading={loading}
            onLoadMore={loadMore}
          >
            {books.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {books.map((book) => (
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
                      <button 
                        className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation(); // 阻止事件冒泡
                          handleAddBook(book.id);
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="text-base font-semibold text-gray-800 mb-1">{book.title}</h3>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : loading ? (
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
              <div className="col-span-2 text-center py-8 text-gray-500">
                暂无搜索结果
              </div>
            )}
          </InfiniteScroll>
        </section>
      </div>
    </div>
  );
}