import { IsIn } from 'class-validator';

export class UpdateOfferStatusDto {
  @IsIn(['accepted', 'rejected'])
  status: 'accepted' | 'rejected';
}
