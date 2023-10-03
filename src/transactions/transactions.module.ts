import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { UsersModule } from '../users/users.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    SharedModule,
    UsersModule,
  ],
  exports: [TransactionsService]
})
export class TransactionsModule { }
