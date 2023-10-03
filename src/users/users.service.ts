import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MdbTocosUser, MdbTocosUserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(MdbTocosUser.name) private readonly userModel: Model<MdbTocosUser>) { }

  async createUser(newUser: CreateUserDto): Promise<MdbTocosUserDocument> {
    const user = new this.userModel(newUser);
    try {
      const userSaved = await user.save();
      return userSaved;
    } catch (error) {
      // Here we can rethrow a proper error in case of MongooseError while saving, or handle it in an exceptionsFilter
      throw error;
    }
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<MdbTocosUserDocument> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, user, { new: true });
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return updatedUser;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid user ID: ${id}`);
      }
      throw error; // Rethrow other errors for global handling
    }
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<MdbTocosUserDocument> {
    try {
      const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;

      if (!objectId) {
        throw new BadRequestException(`Invalid user ID: ${id}`);
      }
      const user = await this.userModel.findById(objectId).exec();
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new NotFoundException(`Failed to find user by id ${id}.`);
    }
  }

}
