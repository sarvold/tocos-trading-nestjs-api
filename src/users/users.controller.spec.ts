import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MdbTocosUserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let result: MdbTocosUserDocument;
  beforeEach(async () => {
    const mockObjectId = new mongoose.Types.ObjectId();
    result = { _id: mockObjectId, name: 'Joaquin Phoenix', balance: 123 } as MdbTocosUserDocument;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: () => ({
            findAll: jest.fn(),
            findById: jest.fn(),
            updateUser: jest.fn(),
            createUser: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([result]);
      expect(await controller.findAll()).toEqual([result]);
    });
  });

  describe('findById', () => {
    it('should return a user', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(result);
      expect(await controller.findById('123')).toEqual(result);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      jest.spyOn(service, 'updateUser').mockResolvedValue(result);
      expect(await controller.updateUser('123', {name: 'Some name'} as UpdateUserDto)).toEqual(result);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      jest.spyOn(service, 'createUser').mockResolvedValue(result);
      expect(await controller.create({name: 'Joaquin Phoenix', balance: 123})).toEqual(result);
    });
  });
});
