import axios from './config';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  publishedAt?: string;
  coverFile?: {
    id: number;
    filename: string;
    mimetype: string;
    size: number;
    width?: number;
    height?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BookListResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;
}

export interface UserBook {
  id: number;
  userId: number;
  bookId: number;
  isFinished: boolean;
  currentPage?: number;
  lastReadAt?: string;
  book: Book;
}

export const getBooks = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<BookListResponse> => {
  try {
    console.log('请求参数:', params);
    console.log('发送请求到 /reading');
    // 直接发送请求，不传递任何参数
    const response = await axios.get('/reading', {
      params: {
        search: params?.search || '',
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
      
    });
    console.log('收到响应数据:', response);
    return response;
  } catch (err) {
    console.error('获取书籍列表失败', err);
    throw err;
  }
};

export const getBookById = async (id: number): Promise<Book> => {
  try {
    return await axios.get(`/reading/${id}`);
  } catch (err) {
    console.error('获取书籍详情失败', err);
    throw err;
  }
};

export const addBookToUser = async (bookId: number): Promise<UserBook> => {
  try {
    return await axios.post(`/reading/${bookId}/add`);
  } catch (err) {
    console.error('添加书籍到书架失败', err);
    throw err;
  }
};

export const getUserBooks = async (): Promise<UserBook[]> => {
  try {
    return await axios.get('/reading/my-books');
  } catch (err) {
    console.error('获取用户书架失败', err);
    throw err;
  }
};

export const checkBookInBookshelf = async (bookId: number): Promise<{ isInBookshelf: boolean }> => {
  try {
    return await axios.get(`/reading/${bookId}/check`);
  } catch (err) {
    console.error('检查书籍是否在书架中失败', err);
    throw err;
  }
};