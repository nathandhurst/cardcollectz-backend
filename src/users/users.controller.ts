import { Controller, Get, Param, Patch, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TEMP: fake user id until JWT is wired
  // Later, you’ll replace this with data from req.user
  private getUserId(req: any): number {
    // If you already have JWT guard setting req.user, use that:
    // return req.user.userId;
    return req.user?.userId ?? 1;
  }

  @Get('me')
  getMe(@Req() req: any) {
    const userId = this.getUserId(req);
    return this.usersService.getMe(userId);
  }

  @Get('by-username/:username')
  getByUsername(@Param('username') username: string) {
    return this.usersService.getByUsername(username);
  }

  @Patch('me/avatar')
  updateAvatar(@Req() req: any, @Body() dto: UpdateAvatarDto) {
    const userId = this.getUserId(req);
    return this.usersService.updateAvatar(userId, dto.profileImageBase64);
  }

  @Patch('me')
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    const userId = this.getUserId(req);
    return this.usersService.updateProfile(userId, dto.bio ?? null);
  }
}
