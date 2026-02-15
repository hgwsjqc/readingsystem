import axios from './config';

export interface Like {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatars: Array<{
      id: number;
      filename: string;
    }>;
  };
}

export const likePost = async (postId: number): Promise<Like> => {
  try {
    const response = await axios.post(`/likes/post/${postId}`);
    return response.data;
  } catch (err) {
    console.error('点赞失败', err);
    throw err;
  }
};

export const unlikePost = async (postId: number): Promise<void> => {
  try {
    await axios.delete(`/likes/post/${postId}`);
  } catch (err) {
    console.error('取消点赞失败', err);
    throw err;
  }
};

export const getPostLikes = async (postId: number): Promise<Like[]> => {
  try {
    const response = await axios.get(`/likes/post/${postId}`);
    return response.data;
  } catch (err) {
    console.error('获取点赞列表失败', err);
    throw err;
  }
};
