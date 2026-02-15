import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async likePost(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.prisma.userLikePost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      throw new ConflictException('You have already liked this post');
    }

    return this.prisma.userLikePost.create({
      data: {
        userId,
        postId,
      },
    });
  }

  async unlikePost(userId: number, postId: number) {
    const existingLike = await this.prisma.userLikePost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existingLike) {
      throw new NotFoundException('Like not found');
    }

    return this.prisma.userLikePost.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }

  async getPostLikes(postId: number) {
    return this.prisma.userLikePost.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatars: {
              take: 1,
              orderBy: {
                id: 'desc',
              },
            },
          },
        },
      },
    });
  }
}
