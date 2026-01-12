import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  async findAll(@Query('seller') seller?: string) {
    return this.listingsService.findAll(seller);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.listingsService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() dto: CreateListingDto) {
    const userId = req.user.userId;
    return this.listingsService.create(userId, {
      ...dto,
      price: Number(dto.price),
    });
  }
}
