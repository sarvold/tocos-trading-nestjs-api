import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TransactionsModule } from '../src/transactions/transactions.module';

describe('TransactionsController (e2e)', () => {
    let app: INestApplication;
    let senderId: string;
    let receiverId: string;
    let transactionId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [TransactionsModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        const createdSenderResponse = await request(app.getHttpServer())
            .post('/users')
            .send({ name: 'Joaquin Phoenix', balance: 99999 });
        senderId = createdSenderResponse.body._id;
        const createdReceiverResponse = await request(app.getHttpServer())
            .post('/users')
            .send({ name: 'Lewis Hamilton', balance: 99999 });
        receiverId = createdReceiverResponse.body._id;

    });

    // Unable to test transactions using in memory DB until I find the way to create a replica set
    describe('/transactions (POST)', () => {
        // it('create transaction successfully', async () => {
        //     console.log('senderId: ', senderId)
        //     console.log('receiverId: ', receiverId)
        //     const createTransactionResponse = await request(app.getHttpServer())
        //         .post('/transactions')
        //         .send({
        //             senderId,
        //             receiverId,
        //             amount: 100,
        //         })
        //         .expect(201);
        //     transactionId = createTransactionResponse.body._id;
        // });
        it('create fail', () => {
            return request(app.getHttpServer())
                .post('/transactions')
                .send({
                    senderId: 'inexistentID',
                    receiverId,
                    amount: 100,
                })
                .expect(404);
        });
    });

    // describe('/transactions (GET)', () => {
    //     it('should succeed and return list', () => {
    //         return request(app.getHttpServer())
    //             .get('/transactions')
    //             .expect(200)
    //             .expect((res) => {
    //                 // Should return list of transactions
    //                 expect(Array.isArray(res?.body)).toBe(true);
    //                 expect(Array.isArray(!!res?.body.length)).toBe(true);
    //             });
    //     });
    // });

    // describe('/transactions/:id (GET)', () => {
    //     it('should successfully return transaction', async () => {
    //         return request(app.getHttpServer())
    //             .get(`/transactions/${transactionId}`)
    //             .expect(200);
    //     });
    //     it('should fail', async () => {
    //         const transactionId = 'SomeInexistentId';
    //         return request(app.getHttpServer())
    //             .get(`/transactions/${transactionId}`)
    //             .expect(404);
    //     });
    // });

    afterAll(async () => {
        await app.close();
    });
});
