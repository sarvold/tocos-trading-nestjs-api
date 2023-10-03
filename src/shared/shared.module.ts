
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { configValidationSchema } from '../config.schema';
import { MdbTocosTransaction, MdbTocosTransactionSchema } from '../transactions/schemas/transaction.schema';
import { MdbTocosUser, MdbTocosUserSchema } from '../users/schemas/user.schema';
import { MongoExceptionFilter } from './exception-filters/mongo-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: configValidationSchema,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        let uri: string = configService.get<string>('MONGODB_URI');
        if (process.env.NODE_ENV === 'test') {
          const mongod = await MongoMemoryServer.create();
          uri = mongod.getUri();
          return { uri };
        }
        return {
          uri,
          auth: { // Whitelist IP addresses at https://cloud.mongodb.com/v2/651990c62627f472d2ec9f33#/security/network/accessList
            username: configService.get<string>('MONGODB_USER'),
            password: configService.get<string>('MONGODB_PASSWORD'),
          },
          dbName: configService.get<string>('MONGODB_DATABASE'),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: MdbTocosUser.name, schema: MdbTocosUserSchema },
      { name: MdbTocosTransaction.name, schema: MdbTocosTransactionSchema },
    ]),
  ],
  providers: [
    MongoExceptionFilter,
  ],
  exports: [
    MongooseModule,
    MongoExceptionFilter,
  ],
})
export class SharedModule { }
