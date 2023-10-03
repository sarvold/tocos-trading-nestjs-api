import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { MdbTocosTransactionDocument } from './schemas/transaction.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let expectedResult: MdbTocosTransactionDocument;
  let transactionServiceStub: Partial<TransactionsService>;

  const today = new Date();

  beforeEach(async () => {
    const mockObjectId = new mongoose.Types.ObjectId();
    expectedResult = {
      _id: mockObjectId,
      senderId: 'S3nd3r',
      receiverId: 'r3c31v3r',
      amount: 10,
      date: today,
    } as MdbTocosTransactionDocument;

    transactionServiceStub = {
      createTransaction: (_) => Promise.resolve(expectedResult),
      getAllTransactions: () => Promise.resolve([expectedResult]),
      getTransactionById: (_) => Promise.resolve(expectedResult),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: transactionServiceStub,
        },],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should call createTransaction method of TransactionsService with the correct parameters', async () => {
      const createTransactionDto: CreateTransactionDto = {
        senderId: 'S3nd3r',
        receiverId: 'r3c31v3r',
        amount: 10,
      };
      jest.spyOn(transactionServiceStub, 'createTransaction');
      await controller.createTransaction(createTransactionDto);
      expect(transactionServiceStub.createTransaction).toHaveBeenCalledWith(createTransactionDto);
    });

    it('should return the result of createTransaction method of TransactionsService', async () => {
      const createTransactionDto: CreateTransactionDto = {
        senderId: 'S3nd3r',
        receiverId: 'r3c31v3r',
        amount: 10,
      };
      const result = await controller.createTransaction(createTransactionDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllTransactions', () => {
    it('should call getAllTransactions method of TransactionsService', async () => {
      jest.spyOn(transactionServiceStub, 'getAllTransactions');
      await controller.getAllTransactions();
      expect(transactionServiceStub.getAllTransactions).toHaveBeenCalled();
    });

    it('should return the result of getAllTransactions method of TransactionsService', async () => {
      const result = await controller.getAllTransactions();
      expect(result).toEqual([expectedResult]);
    });
  });

  describe('getTransactionById', () => {
    it('should call getTransactionById method of TransactionsService with the correct parameter', async () => {
      const id = '123';
      jest.spyOn(transactionServiceStub, 'getTransactionById');
      await controller.getTransactionById(id);
      expect(transactionServiceStub.getTransactionById).toHaveBeenCalledWith(id);
    });

    it('should return the result of getTransactionById method of TransactionsService', async () => {
      const id = '123';
      const result = await controller.getTransactionById(id);
      expect(result).toEqual(expectedResult);
    });
  });

});
