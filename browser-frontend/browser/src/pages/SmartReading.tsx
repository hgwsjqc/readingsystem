import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, X, Sparkles } from 'lucide-react';
import Loading from '@/components/Loading';
import { useSmartReadingStore } from '@/store/SmartReading';

export default function SmartReading() {
  const navigate = useNavigate();
  const { loading, result, error, analyzeImage, reset } = useSmartReadingStore();
  const [image, setImage] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !question.trim()) return;

    await analyzeImage(image, question);
  };

  const handleReset = () => {
    reset();
    setImage(null);
    setImagePreview(null);
    setQuestion('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600"
          >
            <ArrowLeft size={20} />
            <span>返回</span>
          </button>
          <h1 className="text-lg font-semibold">智能阅读</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 图片上传 */}
          <div className="space-y-2">
            <Label htmlFor="image">上传图片</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="预览" 
                    className="max-h-60 mx-auto rounded-md"
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-sm text-gray-500">点击或拖拽上传图片</span>
                    <span className="text-xs text-gray-400">支持 JPG、PNG 格式</span>
                  </div>
                  <input 
                    id="image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                </label>
              )}
            </div>
          </div>

          {/* 问题输入 */}
          <div className="space-y-2">
            <Label htmlFor="question">问题</Label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="请输入你的问题，例如：这张图片讲了什么内容？"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
              disabled={loading || !image || !question.trim()}
            >
              {loading ? (
                <>
                  <Loading size={16} className="mr-2" />
                  处理中...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  发送
                </>
              )}
            </Button>

            {result && (
              <Button 
                type="button"
                variant="outline"
                onClick={handleReset}
                className="py-6"
              >
                <X size={16} className="mr-2" />
                清空
              </Button>
            )}
          </div>
        </form>

        {/* 错误提示 */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* 回答结果 */}
        {result && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold">回答结果</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-800 whitespace-pre-wrap">{result}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
