import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, BookOpen, Heart, MessageCircle } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useReadingStore } from '@/store/reading';
import Loading from '@/components/Loading';
import axios from '@/api/config';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLogin } = useUserStore();
  const { userBooks, addBookToBookshelf, isBookInBookshelf } = useReadingStore();
  
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<any>(null);
  const [inBookshelf, setInBookshelf] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };

  // 获取书籍详情
  useEffect(() => {
    const fetchBookDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const bookData = await axios.get(`/reading/${id}`);
        setBook(bookData);
      } catch (error) {
        console.error('获取书籍详情失败', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  // 检查书籍是否在书架中
  useEffect(() => {
    const checkInBookshelf = async () => {
      if (!id || !isLogin) return;
      
      try {
        const response = await axios.get(`/reading/${id}/check`);
        setInBookshelf(response.isInBookshelf);
      } catch (error) {
        console.error('检查书籍是否在书架中失败', error);
      }
    };

    checkInBookshelf();
  }, [id, isLogin]);

  // 添加到书架
  const handleAddToBookshelf = async () => {
    if (!id || !isLogin) {
      alert('请先登录');
      return;
    }

    try {
      await axios.post(`/reading/${id}/add`);
      setInBookshelf(true);
      
      // 显示添加成功提示
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 transform transition-transform duration-300 ease-in-out';
      successMessage.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>已添加到书架</span>
      `;
      document.body.appendChild(successMessage);
      
      // 动画效果
      setTimeout(() => {
        successMessage.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => successMessage.remove(), 500);
      }, 3000);
    } catch (error) {
      console.error('添加到书架失败', error);
      alert('添加失败，请重试');
    }
  };

  // 处理目录项点击
  const handleChapterClick = (chapterIndex: number) => {
    setSelectedChapter(chapterIndex);
  };

  // 生成模拟章节内容
  const getChapterContent = (chapterIndex: number) => {
    // 模拟章节内容
    const contents = [
      `# 第${chapterIndex + 1}章 引言\n\n本章介绍了本书的基本概念和核心思想，包括如何理解和应用这些概念来解决实际问题。通过学习本章，你将能够建立起对本书主题的整体认识，为后续章节的学习打下坚实的基础。\n\n主要内容包括：\n- 基本概念介绍\n- 核心思想阐述\n- 应用场景分析\n- 学习方法建议`,
      `# 第${chapterIndex + 1}章 基础知识\n\n本章详细讲解了相关的基础知识，包括历史背景、发展历程、基本原理等。这些知识是理解后续章节的重要基础，建议读者认真学习。\n\n主要内容包括：\n- 历史背景\n- 发展历程\n- 基本原理\n- 关键术语解释`,
      `# 第${chapterIndex + 1}章 核心技术\n\n本章介绍了核心技术的实现原理和应用方法，包括技术架构、关键算法、实现细节等。通过学习本章，你将能够掌握核心技术的本质，为实际应用做好准备。\n\n主要内容包括：\n- 技术架构\n- 关键算法\n- 实现细节\n- 性能优化`,
      `# 第${chapterIndex + 1}章 实践指南\n\n本章提供了详细的实践指南，包括环境搭建、开发流程、最佳实践等。通过学习本章，你将能够快速上手并应用所学知识解决实际问题。\n\n主要内容包括：\n- 环境搭建\n- 开发流程\n- 最佳实践\n- 常见问题解决`,
      `# 第${chapterIndex + 1}章 案例分析\n\n本章通过实际案例分析，展示了如何将所学知识应用到实际项目中。这些案例涵盖了不同领域和场景，具有很强的参考价值。\n\n主要内容包括：\n- 案例背景\n- 解决方案\n- 实施过程\n- 效果评估`,
      `# 第${chapterIndex + 1}章 未来展望\n\n本章探讨了技术的发展趋势和未来方向，包括新技术、新应用、新挑战等。通过学习本章，你将能够了解行业的最新动态，为未来的学习和工作做好规划。\n\n主要内容包括：\n- 技术趋势\n- 应用前景\n- 挑战与机遇\n- 学习建议`
    ];
    
    return contents[chapterIndex % contents.length];
  };

  if (loading) {
    return <Loading />;
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">书籍不存在</h1>
          <Button onClick={handleBack}>返回</Button>
        </div>
      </div>
    );
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
            <h1 className="text-lg font-semibold">书籍详情</h1>
          </div>
        </div>
      </div>

      {/* 书籍详情内容 */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* 书籍封面 */}
          <div className="relative">
            <img
              src={book.coverFile?.filename ? `http://localhost:3000/uploads/${book.coverFile.filename}` : `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20${book.title}&image_size=landscape_16_9`}
              alt={book.title}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* 书籍信息 */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
                <p className="text-gray-600 mb-4">作者：{book.author}</p>
              </div>
              <Button
                onClick={handleAddToBookshelf}
                disabled={inBookshelf}
                className={inBookshelf ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}
              >
                {inBookshelf ? '已在书架' : '添加到书架'}
              </Button>
            </div>

            {/* 书籍描述 */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">内容简介</h2>
              <p className="text-gray-700 leading-relaxed">
                {book.description || '暂无简介，敬请期待'}
              </p>
            </div>

            {/* 目录 */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-3">目录</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                {book.description ? (
                  <div className="space-y-2">
                    {book.description.split('\n').map((line, index) => (
                      line.trim() ? (
                        <div 
                          key={index} 
                          className={`flex items-start gap-3 py-2 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-100 transition-colors ${selectedChapter === index ? 'bg-blue-50' : ''}`}
                          onClick={() => handleChapterClick(index)}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${selectedChapter === index ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className={`text-gray-800 ${selectedChapter === index ? 'font-semibold' : ''}`}>{line.trim()}</p>
                          </div>
                        </div>
                      ) : null
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <p>暂无目录信息</p>
                  </div>
                )}
              </div>
            </div>

            {/* 章节内容 */}
            {selectedChapter !== null && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-3">章节内容</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="prose max-w-none">
                    {getChapterContent(selectedChapter).split('\n').map((line, index) => (
                      <p key={index} className={line.startsWith('#') ? 'text-xl font-bold mb-4' : 'mb-4'}>
                        {line.replace('# ', '')}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 出版信息 */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-3">出版信息</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">ISBN</h3>
                  <p className="text-gray-800">{book.isbn || '未知'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">出版日期</h3>
                  <p className="text-gray-800">{book.publishedAt ? new Date(book.publishedAt).toLocaleDateString() : '未知'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;