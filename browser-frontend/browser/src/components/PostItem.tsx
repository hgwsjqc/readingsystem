import * as React from 'react';
import {
  useNavigate
} from 'react-router-dom'
import type { Post } from '@/types/index'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Eye, Heart, MessageCircle, Send } from "lucide-react";
import { useState } from 'react';
import { likePost, unlikePost } from '@/api/Likes';
import { createComment, getCommentsByPost, type Comment } from '@/api/Comments';
import { useUserStore } from '@/store/useUserStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PostItemProps {
  post: Post;
}
const PostItem: React.FC<PostItemProps> = ({post}) => {
  console.log(post, '//////')
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.totalLikes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }

    try {
      if (isLiked) {
        await unlikePost(post.id);
        setIsLiked(false);
        setLikesCount(likesCount - 1);
      } else {
        await likePost(post.id);
        setIsLiked(true);
        setLikesCount(likesCount + 1);
      }
    } catch (err) {
      console.error('点赞失败', err);
      alert('操作失败，请重试');
    }
  };

  const handleLoadComments = async () => {
    if (!showComments) {
      try {
        const data = await getCommentsByPost(post.id);
        setComments(data);
        setShowComments(true);
      } catch (err) {
        console.error('加载评论失败', err);
        alert('加载评论失败');
      }
    } else {
      setShowComments(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('请先登录');
      return;
    }

    if (!commentText.trim()) {
      alert('请输入评论内容');
      return;
    }

    setLoading(true);
    try {
      const newComment = await createComment({
        content: commentText,
        postId: post.id,
      });
      setComments([newComment, ...comments]);
      setCommentText('');
    } catch (err) {
      console.error('发表评论失败', err);
      alert('发表评论失败');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div 
        className="flex border-b border-border py-4 py-2"
        // 动态路由 暴露资源 restful url 资源具有描述性 
        onClick={() => { navigate(`/post/${post.id}`)}}
      >
        <div className="flex-1 pr-4 space-y-2">
          <div className="flex items-center gap-2">
          {
            post.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="text-xs"
              >{tag}</Badge>
            ))
          }
          </div>
          {/* 列表里面行高的截取 */}
          <h2 className="text-base font-semibold leading-tight line-clamp-1">
          {post.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-1">
          { post.brief}
          </p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Avatar className="w-5 h-5">
                <AvatarImage src={post.user.avatar} />
                <AvatarFallback>{post.user.avatar}</AvatarFallback>
              </Avatar>
              <span>{post.user.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
           
            <div 
              className={`flex items-center gap-1 cursor-pointer ${isLiked ? 'text-red-500' : ''}`}
              
            >
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`}/>
              <span>{likesCount}</span>
            </div>
            <div 
              className="flex items-center gap-1 cursor-pointer"
              
            >
              <MessageCircle className="w-3 h-3"/>
              <span>{post.totalComments}</span>
            </div>
          </div>
        </div>
        {
          post.thumbnail && (
            <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden">
              <img 
                loading="lazy"
                src={post.thumbnail}
                className="w-full h-full object-cover"
              />
            </div>
          )
        }
      </div>
      {showComments && (
        <div className="border-t border-border pt-4 mt-4">
          <div className="space-y-4 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage 
                    src={comment.user.avatars[0]?.filename ? `http://localhost:3000/uploads/${comment.user.avatars[0].filename}` : undefined} 
                  />
                  <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">
                    {comment.user.name}
                  </div>
                  <div className="text-sm">{comment.content}</div>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-4">
                暂无评论
              </div>
            )}
          </div>
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <Input
              placeholder="发表评论..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={loading}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

export default PostItem