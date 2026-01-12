import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferStatusDto } from './dto/update-offer-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateOfferDto) {
    const userId = req.user.userId;
    return this.offersService.create(userId, {
      listingId: Number(dto.listingId),
      amount: Number(dto.amount),
    });
  }

  @Get('my-buyer')
  async myAsBuyer(@Req() req: any) {
    const userId = req.user.userId;
    return this.offersService.getOffersAsBuyer(userId);
  }

  @Get('my-seller')
  async myAsSeller(@Req() req: any) {
    const userId = req.user.userId;
    return this.offersService.getOffersAsSeller(userId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateOfferStatusDto,
  ) {
    const userId = req.user.userId;
    return this.offersService.updateStatus(userId, Number(id), dto);
  }
}
