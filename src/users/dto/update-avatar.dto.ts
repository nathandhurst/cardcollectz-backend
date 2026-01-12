import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateAvatarDto {
  @IsString()
  @IsNotEmpty()
  profileImageBase64: string;
}
