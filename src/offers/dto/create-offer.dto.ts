import { IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  listingId: number;

  @IsNumber()
  amount: number;
}
