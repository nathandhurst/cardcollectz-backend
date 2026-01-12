import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateListingDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  condition?: string;

  // first/primary image (for backwards compatibility)
  @IsOptional()
  @IsString()
  imageData?: string;

  // extra images as base64 strings
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
