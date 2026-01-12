import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferStatusDto } from './dto/update-offer-status.dto';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  async create(buyerId: number, dto: CreateOfferDto) {
    const { listingId, amount } = dto;

    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { seller: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId === buyerId) {
      throw new BadRequestException('You cannot make an offer on your own listing.');
    }

    if (amount <= 0) {
      throw new BadRequestException('Offer amount must be greater than zero.');
    }

    const offer = await this.prisma.offer.create({
      data: {
        amount,
        listing: { connect: { id: listingId } },
        buyer: { connect: { id: buyerId } },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            imageData: true,
            seller: { select: { username: true } },
          },
        },
        buyer: { select: { username: true } },
      },
    });

    return this.toOfferDto(offer);
  }

  async getOffersAsBuyer(userId: number) {
    const offers = await this.prisma.offer.findMany({
      where: { buyerId: userId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            imageData: true,
            seller: { select: { username: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return offers.map((o) => this.toOfferDto(o));
  }

  async getOffersAsSeller(userId: number) {
    const offers = await this.prisma.offer.findMany({
      where: {
        listing: {
          sellerId: userId,
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            imageData: true,
            seller: { select: { username: true } },
          },
        },
        buyer: { select: { username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return offers.map((o) => this.toOfferDto(o));
  }

  async updateStatus(sellerId: number, offerId: number, dto: UpdateOfferStatusDto) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        listing: {
          select: {
            id: true,
            sellerId: true,
            title: true,
            price: true,
            imageData: true,
            seller: { select: { username: true } },
          },
        },
        buyer: { select: { username: true } },
      },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (offer.listing.sellerId !== sellerId) {
      throw new BadRequestException('You can only update offers on your own listings.');
    }

    if (offer.status !== 'pending') {
      throw new BadRequestException('Only pending offers can be updated.');
    }

    const updated = await this.prisma.offer.update({
      where: { id: offerId },
      data: {
        status: dto.status,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            imageData: true,
            seller: { select: { username: true } },
          },
        },
        buyer: { select: { username: true } },
      },
    });

    if (dto.status === 'accepted') {
      await this.prisma.offer.updateMany({
        where: {
          listingId: offer.listing.id,
          id: { not: offerId },
          status: 'pending',
        },
        data: { status: 'rejected' },
      });
    }

    return this.toOfferDto(updated);
  }

  private toOfferDto(offer: any) {
    return {
      id: offer.id,
      amount: offer.amount,
      status: offer.status,
      createdAt: offer.createdAt,
      listingId: offer.listing.id,
      listingTitle: offer.listing.title,
      listingPrice: offer.listing.price,
      imageData: offer.listing.imageData,
      sellerUsername: offer.listing.seller.username,
      buyerUsername: offer.buyer?.username ?? undefined,
    };
  }
}
