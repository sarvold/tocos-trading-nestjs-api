import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

// TODO: this is unused, remove
export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) => MongooseModule.forRootAsync({
    useFactory: async () => {
        mongod = await MongoMemoryServer.create();
        const mongoUri = mongod.getUri();
        return {
            uri: mongoUri,
            ...options,
        }
    },
});

export const closeInMongodConnection = async () => {
    if (mongod) await mongod.stop();
}