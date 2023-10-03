import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SharedModule],
  exports: [UsersService]
})
export class UsersModule {}
