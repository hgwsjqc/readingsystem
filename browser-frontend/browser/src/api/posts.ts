import axios from './config.ts';
import type { Post } from '@/types';

export const fetchPosts = async (page:number = 1, 
  limit:number=10) => {
    try {
      const response = await axios.get('/posts', {
        params: {
          page,
          limit
        }
      })
      console.log(response);
      return response;
    } catch(err) {

    }
}
// 发表文章
export const createPosts=async()=>{
  return axios.post('/post',{
    title:'测试标题',
    content:'测试内容'
  })
}