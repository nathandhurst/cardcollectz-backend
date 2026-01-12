import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OffersModule } from './offers/offers.module';
import { ListingsModule } from './listings/listings.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    OffersModule,
    ListingsModule,
  ],
})
export class AppModule {}
