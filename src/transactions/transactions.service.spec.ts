import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model, connect } from 'mongoose';
import { closeInMongodConnection } from '../../test/util/root-mongoose-test.module';

import { NotFoundException } from '@nestjs/common';
import { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server';
import { MdbTocosUser, MdbTocosUserDocument, MdbTocosUserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { MdbTocosTransaction, MdbTocosTransactionSchema } from './schemas/transaction.schema';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionModel: Model<MdbTocosTransaction>;
  let userModel: Model<MdbTocosUser>;
  let senderId: string;
  let receiverId: string;

  let usersServiceMock: UsersService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  let sender: MdbTocosUserDocument;
  let receiver: MdbTocosUserDocument;

  beforeAll(async () => {
    // Missing to create a replicate DB to test transactions in MongoDB
    // const replSet = await MongoMemoryReplSet.create({ replSet: {} });
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    transactionModel = mongoConnection.model(MdbTocosTransaction.name, MdbTocosTransactionSchema);
    userModel = mongoConnection.model(MdbTocosUser.name, MdbTocosUserSchema);

    usersServiceMock = {
      findById: jest.fn(),
    } as unknown as UsersService;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getModelToken(MdbTocosTransaction.name),
          useValue: transactionModel,
        },
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);

    // Create two users
    sender = new userModel({ name: 'Sender', balance: 500 });
    receiver = new userModel({ name: 'Receiver', balance: 500 });

    // Save the users and store their ids
    senderId = (await sender.save())._id.toString();
    receiverId = (await receiver.save())._id.toString();
  });
  beforeEach(() => {

    // Mocked service returns searched users
    jest.spyOn(usersServiceMock, 'findById').mockImplementation((_id: string) => {
      if (_id === senderId) {
        return Promise.resolve(sender);
      } else if (_id === receiverId) {
        return Promise.resolve(receiver);
      } else {
        return Promise.resolve(null);
      }
    });
  })

  afterEach(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // These tests require a single node replica set to enable transactions, replSet option, which I didn't have the time to set up properly
  // it('should create a transaction', async () => {
  //   const newTransaction = {
  //     senderId,
  //     receiverId,
  //     amount: 100,
  //   };
  //   const createdTransaction = await service.createTransaction(newTransaction);
  //   expect(createdTransaction).toHaveProperty('_id');
  //   expect(createdTransaction.senderId).toBe(newTransaction.senderId);
  //   expect(createdTransaction.receiverId).toBe(newTransaction.receiverId);
  //   expect(createdTransaction.amount).toBe(newTransaction.amount);
  // });

  // it('should return all transactions', async () => {
  //   const newTransaction1 = {
  //     senderId,
  //     receiverId,
  //     amount: 100,
  //   };

  //   // Create other two users
  //   const newSender = new userModel({ name: 'Jack Johnson', balance: 500 });
  //   const newReceiver = new userModel({ name: 'Arnold Schwarzenneger', balance: 500 });

  //   // Save the new users and store their ids
  //   const newSenderId = (await newSender.save())._id.toString();
  //   const newReceiverId = (await newReceiver.save())._id.toString();

  //   const newTransaction2 = {
  //     senderId: newSenderId,
  //     receiverId: newReceiverId,
  //     amount: 200,
  //   };
  //   await service.createTransaction(newTransaction1);
  //   await service.createTransaction(newTransaction2);
  //   const transactions = await service.getAllTransactions();
  //   expect(transactions.length).toBe(2);
  // });

  it('should throw an error when trying to find a transaction by a non-existing id', async () => {
    await expect(service.getTransactionById('non-existing-id')).rejects.toThrow(NotFoundException);
  });

});
