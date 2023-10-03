import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';

import { APP_FILTER } from '@nestjs/core';
import { MongoExceptionFilter } from './shared/exception-filters/mongo-exception.filter';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    UsersModule,
    TransactionsModule,
    SharedModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MongoExceptionFilter,
    },
  ],
})
export class AppModule { }
