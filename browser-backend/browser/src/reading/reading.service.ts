import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Book, UserBook, Prisma } from '@prisma/client';
import { BookQueryDto } from './dto/book-query.dto';

@Injectable()
export class ReadingService {
  constructor(private readonly prisma: PrismaService) {}

  // 获取书籍列表
  async getBooks(query: BookQueryDto): Promise<{
    books: Book[];
    total: number;
    page: number;
    limit: number;
  }> {
     const { search='', page=1, limit=10 } = query;
    console.log(query);
    const skip = (page - 1) * limit;
  
    const where: Prisma.BookWhereInput = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              author: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: {
          coverFile: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.book.count({ where }),
    ]);
    console.log(books);
    return {
      books,
      total,
      page,
      limit,
    };
  }

  // 获取书籍详情
  async getBookById(id: number): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        coverFile: true,
      },
    });
  }

  // 添加书籍到用户书架
  async addBookToUser(userId: any, bookId: number): Promise<UserBook> {
    console.log(userId, bookId);
    // 确保 userId 是数字类型
    const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    
    // 检查书籍是否存在
    const bookExists = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!bookExists) {
      throw new NotFoundException('Book not found');
    }

    // 检查是否已经在书架中
    try {
      const existingUserBook = await this.prisma.userBook.findFirst({
        where: {
          userId: numericUserId,
          bookId,
        },
      });

      if (existingUserBook) {
        return existingUserBook;
      }

      // 添加到书架
      return this.prisma.userBook.create({
        data: {
          userId: numericUserId,
          bookId,
          isFinished: false,
          currentPage: 0,
          lastReadAt: new Date(),
        },
        include: {
          book: {
            include: {
              coverFile: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error adding book to user:', error);
      throw error;
    }
  }

  // 获取用户书架
  async getUserBooks(userId: any): Promise<UserBook[]> {
    // 确保 userId 是数字类型
    const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    
    return this.prisma.userBook.findMany({
      where: { userId: numericUserId },
      include: {
        book: {
          include: {
            coverFile: true,
          },
        },
      },
      orderBy: {
        lastReadAt: 'desc',
      },
    });
  }

  // 检查书籍是否在用户书架中
  async isBookInUserBookshelf(userId: any, bookId: number): Promise<boolean> {
    // 确保 userId 是数字类型
    const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    
    const userBook = await this.prisma.userBook.findFirst({
      where: {
        userId: numericUserId,
        bookId,
      },
    });
    
    return !!userBook;
  }

  // 从用户书架中移除书籍
  async removeBookFromUser(userId: any, bookId: number): Promise<{ success: boolean }> {
    // 确保 userId 是数字类型
    const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    
    try {
      await this.prisma.userBook.delete({
        where: {
          userId_bookId: {
            userId: numericUserId,
            bookId,
          },
        },
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error removing book from user:', error);
      return { success: false };
    }
  }
}
