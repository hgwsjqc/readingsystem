import axios from './config';

export interface Comment {
  id: number;
  content: string;
  postId: number;
  userId: number;
  parentId?: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatars: Array<{
      id: number;
      filename: string;
    }>;
  };
  replies?: Comment[];
}

export interface CreateCommentData {
  content: string;
  postId: number;
  parentId?: number;
}

export const getCommentsByPost = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await axios.get(`/comments/post/${postId}`);
    return response.data;
  } catch (err) {
    console.error('获取评论失败', err);
    throw err;
  }
};

export const createComment = async (data: CreateCommentData): Promise<Comment> => {
  try {
    const response = await axios.post('/comments', data);
    return response.data;
  } catch (err) {
    console.error('创建评论失败', err);
    throw err;
  }
};

export const deleteComment = async (commentId: number): Promise<void> => {
  try {
    await axios.delete(`/comments/${commentId}`);
  } catch (err) {
    console.error('删除评论失败', err);
    throw err;
  }
};
