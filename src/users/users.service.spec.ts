import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model, connect } from 'mongoose';
// import { closeInMongodConnection, rootMongooseTestModule } from '../../test/util/root-mongoose-test.module';
import { NotFoundException } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MdbTocosUser, MdbTocosUserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<MdbTocosUser>;
  
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  beforeAll(async () => {
    // userModel = model(MdbTocosUser.name, MdbTocosUserSchema);
    
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(MdbTocosUser.name, MdbTocosUserSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(MdbTocosUser.name),
          useValue: userModel,
        },
      ],
      imports: [
        // rootMongooseTestModule(),
        // MongooseModule.forFeature([
        //   { name: MdbTocosUser.name, schema: MdbTocosUserSchema },
        //   // { name: MdbTocosTransaction.name, schema: MdbTocosTransactionSchema },
        // ]),
      ],
    }).compile();
    
    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });
  // afterEach(async () => {
  //   await closeInMongodConnection();
  // });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const newUser = {
      name: 'abc',
      balance: 100,
    };
    const createdUser = await service.createUser(newUser);
    expect(createdUser).toHaveProperty('_id');
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.balance).toBe(newUser.balance);
  }, 10000);

  it('should update a user', async () => {
    const newUser = {
      name: 'Test User',
      balance: 100,
    };
    const createdUser = await service.createUser(newUser);
    const updateUser = {
      name: 'Updated User',
      balance: 200,
    };
    const updatedUser = await service.updateUser(createdUser._id.toString(), updateUser);
    expect(updatedUser).toHaveProperty('_id');
    expect(updatedUser.name).toBe(updateUser.name);
    expect(updatedUser.balance).toBe(updateUser.balance);
  });

  it('should return all users', async () => {
    const newUser1 = {
      name: 'Test User 1',
      balance: 100,
    };
    const newUser2 = {
      name: 'Test User 2',
      balance: 200,
    };
    await service.createUser(newUser1);
    await service.createUser(newUser2);
    const users = await service.findAll();
    expect(users.length).toBe(2);
  });

  it('should return a user by id', async () => {
    const newUser = {
      name: 'Test User 1',
      balance: 100,
    };
    const createdUser = await service.createUser(newUser);
    const user = await service.findById(createdUser._id.toString());
    expect(user).toHaveProperty('_id');
    expect(user.name).toBe(newUser.name);
    expect(user.balance).toBe(newUser.balance);
  });
  it('should throw an error when trying to find a user by a non-existing id', async () => {
    await expect(service.findById('non-existing-id')).rejects.toThrow(NotFoundException);
  });
  
});
