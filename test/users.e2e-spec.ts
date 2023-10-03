  import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
  
  describe('UsersController (e2e)', () => {
    let app: INestApplication;
  
    beforeAll(async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [UsersModule],
      }).compile();
  
      app = moduleFixture.createNestApplication();
      await app.init();
    });

    describe('/users (POST)', () => {
        it('/users (POST)', () => {
            return request(app.getHttpServer())
                .post('/users')
                .send({ name: 'Test User', balance: 100 })
                .expect(201);
        });
    });

    describe('/users (GET)', () => {
        it('/users (GET)', () => {
            return request(app.getHttpServer())
                .get('/users')
                .expect(200)
                .expect((response) => {
                    expect(Array.isArray(response.body)).toBe(true);
                });
        });
    });

    describe.only('/users/:id (GET)', () => {
        it('should create a user, and then fetch it by its ID', async () => {
            const createdUserResponse = await request(app.getHttpServer())
                .post('/users')
                .send({ name: 'Test', balance: 100 })
                .expect(201);

            const userId = createdUserResponse.body._id;

            return request(app.getHttpServer())
                .get(`/users/${userId}`)
                .expect(200)
                .expect((response) => {
                    expect(response.body._id).toBe(userId);
                });
        });
    });

    describe('/users/:id (PUT)', () => {
        it('/users/:id (PUT)', async () => {
            const createdUserResponse = await request(app.getHttpServer())
                .post('/users')
                .send({ name: 'Test User', balance: 100 });

            const userId = createdUserResponse.body._id;

            return request(app.getHttpServer())
                .put(`/users/${userId}`)
                .send({ name: 'Updated User', balance: 200 }) // Adjust the request body as per your DTO or schema
                .expect(200) // Assuming 200 OK is the appropriate status code for successful update
                .expect((response) => {
                    expect(response.body.name).toBe('Updated User'); // Assuming the response body contains the updated user object
                });
        });

    });
});
  