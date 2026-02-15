import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send, Sparkles, X } from 'lucide-react';
import Loading from '@/components/Loading';
import { useRoleWorkshopStore } from '@/store/RoleWorkshop';

export default function RoleWorkshop() {
  const navigate = useNavigate();
  const { loading, result, error, generateRole, reset } = useRoleWorkshopStore();
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    await generateRole(description);
  };

  const handleReset = () => {
    reset();
    setDescription('');
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
          <h1 className="text-lg font-semibold">角色工坊</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">角色描述</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入角色描述，例如：一个穿着蓝色法师袍的年轻魔法师，站在魔法学院的图书馆里"
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
              disabled={loading}
              
            >
              {loading ? (
                <>
                  <Loading size={16} className="mr-2" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  生成角色
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

        {/* 生成结果 */}
        {result && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold">生成结果</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img 
                src={result} 
                alt="生成的角色" 
                className="w-full h-auto"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
