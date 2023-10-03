import { Body, Controller, Get, Param, Post, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from '../shared/exception-filters/mongo-exception.filter';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { MdbTocosTransactionDocument } from './schemas/transaction.schema';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseFilters(new MongoExceptionFilter())
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<MdbTocosTransactionDocument> {
    console.log('invoked createTransaction!!!')
    return await this.transactionsService.createTransaction(createTransactionDto);
  }

  @Get()
  async getAllTransactions(): Promise<MdbTocosTransactionDocument[]> {
    return await this.transactionsService.getAllTransactions();
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: string): Promise<MdbTocosTransactionDocument> {
    return await this.transactionsService.getTransactionById(id);
  }
}
