import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        listings: {
          select: { id: true }, // for quick count
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { listings, ...rest } = user;

    return {
      ...rest,
      listingsCount: listings.length,
    };
  }

  async getByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        listings: {
          select: { id: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { listings, ...rest } = user;

    return {
      ...rest,
      listingsCount: listings.length,
    };
  }

  async updateAvatar(userId: number, profileImageBase64: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { profileImage: profileImageBase64 },
      select: {
        id: true,
        username: true,
        profileImage: true,
      },
    });

    return user;
  }

  async updateProfile(userId: number, bio?: string | null) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { bio },
      select: {
        id: true,
        username: true,
        bio: true,
        rating: true,
        ratingCount: true,
        tradesCount: true,
        isVerified: true,
        profileImage: true,
        createdAt: true,
      },
    });

    return user;
  }
}
