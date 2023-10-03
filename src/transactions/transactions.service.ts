import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MdbTocosTransactionDocument } from './schemas/transaction.schema';
import { UsersService } from '../users/users.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { send } from 'process';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('MdbTocosTransaction') private readonly transactionModel: Model<MdbTocosTransactionDocument>,
    private readonly usersService: UsersService
  ) { }

  /**
   * Map CreateTransactionDto to TocosTransaction
   * @param createTransactionDto 
   * @returns 
   */
  private mapCreateTransactionDtoToTocosTransaction(createTransactionDto: CreateTransactionDto): MdbTocosTransactionDocument {
    return new this.transactionModel({
      ...createTransactionDto,
      date: new Date(), // Set the transaction date
    });
  }

  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<MdbTocosTransactionDocument> {
    // For safely handling transactions, so data remains consistent:
    const session = await this.transactionModel.startSession();
    session.startTransaction();
    try {
      // Validate sender and receiver balances
      const sender = await this.usersService.findById(createTransactionDto.senderId);
      const receiver = await this.usersService.findById(createTransactionDto.receiverId);

      if (!sender || !receiver) {
        throw new NotFoundException('Sender or receiver not found');
      }

      if (sender.balance < createTransactionDto.amount) {
        throw new BadRequestException(`Sender (${sender.name}) has insufficient balance`);
      }

      // Deduct balance from sender and update receiver's balance
      sender.balance -= createTransactionDto.amount;
      receiver.balance += createTransactionDto.amount;

      
      // Save balance to users within the transaction
      await sender.save({ session });
      await receiver.save({ session });

      
      // Map DTO to TocosTransaction
      const tocosTransaction = this.mapCreateTransactionDtoToTocosTransaction(createTransactionDto);
      
      // Create and save the transaction document within the same transaction
      const transaction = new this.transactionModel(tocosTransaction);
      await transaction.save({ session });
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return transaction;
    } catch (error) {
      // Rollback the transaction in case of an error
      await session.abortTransaction();
      session.endSession();

      throw error; // Rethrow the error for handling in the controller
    }
  }

  async getAllTransactions(): Promise<MdbTocosTransactionDocument[]> {
    return this.transactionModel.find().exec();
  }

  async getTransactionById(id: string): Promise<MdbTocosTransactionDocument> {
    try {
      const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;

      if (objectId) {
        const user = await this.transactionModel.findById(objectId).exec();
        if (user) {
          return user;
        } else {
          throw new NotFoundException(`Transaction with id ${id} not found`);
        }
      } else {
        throw new BadRequestException(`Invalid transaction ID: ${id}`);
      }
    } catch (error) {
      throw new NotFoundException(`Failed to find transaction by id ${id}.`);
    }
  }
}
