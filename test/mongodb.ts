import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;
// TODO: file unused, remove
// export const setupDB = async () => {
  // mongod = await MongoMemoryServer.create();
  // const uri = mongod.getUri();
  // process.env.DB_CONNECTION_STRING = uri;
  // process.env.MONGODB_URI = uri;
// };

export const teardownDB = async () => {
  await mongod.stop();
};
