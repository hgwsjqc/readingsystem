import { create } from 'zustand';

import type { Post } from '@/types';
import { fetchPosts } from '@/api/posts';

interface HomeState {

  posts: Post[];
  loadMore: () => Promise<void>;
  loading: boolean;
  hasMore: boolean;
  page: number;
}
// set方法 用于修改状态
// get方法用户 获取最新的状态 zustand 提供
export const useHomeStore = create<HomeState>((set, get) => ({
 
  page: 1, // 响应式， page++
  loading: false,
  hasMore: true,
  posts:[],
  loadMore: async () => {
    // loading 开关状态 
    if (get().loading) return; // 避免之前的loadMore还没有执行完，又触发 
    // 加载中... 更新状态时, set 只需要传我们想更新的
    set({ loading: true });
    try {
      const { items } = await fetchPosts(get().page);
      if (items.length === 0) { // 所有数据都加载完了 
        set({hasMore: false});
      } else {
        set({
          posts: [...get().posts, ...items],
          page: get().page + 1
        })
      }
    } catch(err) {
      console.error("加载失败", err);
    } finally {
      set({ loading: false });
    }
  }
}))