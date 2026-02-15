import { create } from 'zustand';
import type { Book, UserBook } from '@/api/Reading';
import { getBooks, getBookById, addBookToUser, getUserBooks, checkBookInBookshelf } from '@/api/Reading';

interface ReadingState {
  books: Book[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  total: number;
  search: string;
  currentBook: Book | null;
  userBooks: UserBook[];
  bookInBookshelf: Map<number, boolean>;
  fetchBooks: (search?: string, page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  fetchBookById: (id: number) => Promise<void>;
  addToBookshelf: (bookId: number) => Promise<void>;
  fetchUserBooks: () => Promise<void>;
  checkBookInBookshelf: (bookId: number) => Promise<boolean>;
  setBookInBookshelf: (bookId: number, isIn: boolean) => void;
  setSearch: (search: string) => void;
  resetBooks: () => void;
}

export const useReadingStore = create<ReadingState>((set, get) => ({
  books: [],
  loading: false,
  hasMore: true,
  page: 1,
  total: 0,
  search: '',
  currentBook: null,
  userBooks: [],
  bookInBookshelf: new Map(),

  fetchBooks: async (search?: string, page = 1) => {
    set({ loading: true });
    try {
      // 直接调用 API，不传递任何参数
      const response = await getBooks({
        search: get().search || '',
        page,
        limit: 10,
      });
      
      set({
        books: response.books,
        total: response.total,
        page: response.page,
        hasMore: response.page * response.limit < response.total,
        search: search || get().search,
      });
    } catch (err) {
      console.error('获取书籍列表失败', err);
    } finally {
      set({ loading: false });
    }
  },

  loadMore: async () => {
    if (get().loading || !get().hasMore) return;
    const nextPage = get().page + 1;
    set({ loading: true });
    try {
      const response = await getBooks({
        search: get().search,
        page: nextPage,
        limit: 10,
      });
      
      set({
        books: [...get().books, ...response.books],
        page: response.page,
        hasMore: response.page * response.limit < response.total,
      });
    } catch (err) {
      console.error('加载更多书籍失败', err);
    } finally {
      set({ loading: false });
    }
  },

  fetchBookById: async (id: number) => {
    set({ loading: true });
    try {
      const book = await getBookById(id);
      set({ currentBook: book });
    } catch (err) {
      console.error('获取书籍详情失败', err);
    } finally {
      set({ loading: false });
    }
  },

  addToBookshelf: async (bookId: number) => {
    try {
      const userBook = await addBookToUser(bookId);
      set({
        userBooks: [...get().userBooks, userBook],
      });
      // 更新 bookInBookshelf 状态
      get().setBookInBookshelf(bookId, true);
    } catch (err) {
      console.error('添加书籍到书架失败', err);
      throw err;
    }
  },

  fetchUserBooks: async () => {
    set({ loading: true });
    try {
      const userBooks = await getUserBooks();
      set({ userBooks });
      // 更新 bookInBookshelf 状态
      const bookInBookshelf = new Map();
      userBooks.forEach(userBook => {
        bookInBookshelf.set(userBook.bookId, true);
      });
      set({ bookInBookshelf });
    } catch (err) {
      console.error('获取用户书架失败', err);
    } finally {
      set({ loading: false });
    }
  },

  checkBookInBookshelf: async (bookId: number) => {
    try {
      const result = await checkBookInBookshelf(bookId);
      get().setBookInBookshelf(bookId, result.isInBookshelf);
      return result.isInBookshelf;
    } catch (err) {
      console.error('检查书籍是否在书架中失败', err);
      return false;
    }
  },

  setBookInBookshelf: (bookId: number, isIn: boolean) => {
    const bookInBookshelf = new Map(get().bookInBookshelf);
    bookInBookshelf.set(bookId, isIn);
    set({ bookInBookshelf });
  },

  setSearch: (search: string) => {
    set({ search, page: 1, books: [], hasMore: true });
  },

  resetBooks: () => {
    set({
      books: [],
      loading: false,
      hasMore: true,
      page: 1,
      total: 0,
      search: '',
    });
  },
}));