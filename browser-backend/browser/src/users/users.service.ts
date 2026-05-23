import {
  Injectable,
  BadRequestException // 错误处理
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
  }
  async register(createUserDto: CreateUserDto) {
    const { name, password } = createUserDto;
    const existingUser = await this.prisma.user.findUnique({
      where: {
        name
      }
    })
    if (existingUser) {
      // 抛出异常 
      // nest 企业级 捕获并返回给用户错误信息
      // 弱类型， 单线程， 出错可能灾难性

      throw new BadRequestException("用户名已存在")
    }
    // 10 加密算法的强度 
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        name,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true
      }
    })

    return user
  }

  async getUserStats(userId: number) {
    const [articles, comments, likes] = await Promise.all([
      this.prisma.post.count({ where: { userId } }),
      this.prisma.comment.count({ where: { userId } }),
      this.prisma.userLikePost.count({ where: { userId } })
    ]);

    return {
      articles,
      comments,
      likes
    };
  }

  async getUserArticles(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [total, posts] = await Promise.all([
      this.prisma.post.count({ where: { userId } }),
      this.prisma.post.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatars: {
                select: {
                  filename: true
                }
              }
            }
          },
          tags: {
            select: {
              tag: {
                select: {
                  name: true
                }
              }
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          },
          files: {
            where: {
              mimetype: { startsWith: "image/"},
            },
            select: { filename: true }
          }
        }
      })
    ]);

    // 整理数据
    const data = posts.map(post => ({
      id: post.id,
      title: post.title,
      brief: post.content ? post.content.substring(0, 100) : '',
      content: post.content,
      user: {
        id: post.user?.id,
        name: post.user?.name,
        avatar: `http://localhost:3000/uploads/avatar/resized/${post.user?.avatars[0]?.filename}-small.jpg`
      },
      tags: post.tags.map(t => t.tag.name),
      totalLikes: post._count.likes,
      totalComments: post._count.comments,
      viewCount: 0,
      thumbnail: post.files[0]?.filename ? `http://localhost:3000/uploads/${post.files[0].filename}` : "",
      createdAt: new Date().toISOString()
    }));

    return {
      items: data,
      total
    };
  }

  async updateUserProfile(userId: number, updateData: { name?: string; bio?: string }) {
    if (updateData.name) {
      const existingUser = await this.prisma.user.findUnique({
        where: { name: updateData.name }
      });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException("用户名已存在");
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        bio: true,
        avatars: {
          select: {
            filename: true
          }
        }
      }
    });
  }

  async getUserComments(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [total, comments] = await Promise.all([
      this.prisma.comment.count({ where: { userId } }),
      this.prisma.comment.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          post: {
            select: {
              id: true,
              title: true
            }
          }
        }
      })
    ]);

    // 整理数据
    const data = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      post: {
        id: comment.post?.id,
        title: comment.post?.title
      },
      createdAt: new Date().toISOString()
    }));

    return {
      items: data,
      total
    };
  }

  async getUserLikes(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [total, likes] = await Promise.all([
      this.prisma.userLikePost.count({ where: { userId } }),
      this.prisma.userLikePost.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          post: {
            select: {
              id: true,
              title: true
            }
          }
        }
      })
    ]);

    // 整理数据
    const data = likes.map(like => ({
      id: `${like.userId}-${like.postId}`,
      post: {
        id: like.post?.id,
        title: like.post?.title
      },
      createdAt: new Date().toISOString()
    }));

    return {
      items: data,
      total
    };
  }
}
