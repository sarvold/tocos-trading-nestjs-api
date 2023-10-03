import { Body, Controller, Get, Param, Post, Put, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from '../shared/exception-filters/mongo-exception.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MdbTocosUserDocument } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<MdbTocosUserDocument[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<MdbTocosUserDocument> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<MdbTocosUserDocument> {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  @UseFilters(new MongoExceptionFilter())
  create(@Body() createUserDto: CreateUserDto): Promise<MdbTocosUserDocument> {
    return this.usersService.createUser(createUserDto);
  }
}
