import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  private toListingDto(entity: any) {
    const { seller, images, ...rest } = entity;

    const imageArray = images ? images.sort((a, b) => a.order - b.order).map((i) => i.data) : [];

    return {
      ...rest,
      sellerUsername: seller?.username ?? 'unknown',
      imageData: entity.imageData ?? (imageArray[0] || null),
      images: imageArray,
    };
  }

  async create(sellerId: number, dto: CreateListingDto) {
    const listing = await this.prisma.listing.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        price: dto.price,
        condition: dto.condition ?? null,
        imageData: dto.imageData ?? null,
        sellerId,
      },
    });

    if (dto.images && dto.images.length > 0) {
      await this.prisma.listingImage.createMany({
        data: dto.images.map((base64, index) => ({
          listingId: listing.id,
          data: base64,
          order: index,
        })),
      });
    }

    const full = await this.prisma.listing.findUnique({
      where: { id: listing.id },
      include: {
        seller: true,
        images: true,
      },
    });

    return this.toListingDto(full);
  }

  async findAll(sellerUsername?: string) {
    const listings = await this.prisma.listing.findMany({
      where: sellerUsername
        ? {
            seller: {
              username: sellerUsername,
            },
          }
        : undefined,
      include: {
        seller: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return listings.map((l) => this.toListingDto(l));
  }

  async findOne(id: number) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        seller: true,
        images: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return this.toListingDto(listing);
  }
}
