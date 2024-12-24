import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import authRouter from '../routes/v1/auth';

const app = new express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/v1/auth', authRouter);


var testAccessToken;
var testRefreshToken;

const testUser = {
    emailAddress: 'new_test_acc@gmail.com',
    password: '88888888',
}
const newPassword = '99999999';

describe('Oauth Routes', function () {

    test('/v1/auth/login', async () => {
        const res = await request(app)
            .post('/v1/auth/login')
            // .set('Authorization', `Bearer ${testToken}`)
            .send(testUser)
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        testAccessToken = res.body.data[0].token.access;
        testRefreshToken = res.body.data[0].token.refresh;
    });

    test('/v1/auth/refresh', async () => {
        const res = await request(app)
            .post('/v1/auth/refresh')
            .send({
                refreshToken: testRefreshToken
            })
            .set('Authorization', `Bearer ${testAccessToken}`)
            .set('Accept', 'application/json');

        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        testAccessToken = res.body.data[0].token.access;
        testRefreshToken = res.body.data[0].token.refresh;
    });

    test('/v1/auth/change-password', async () => {
        const res = await request(app)
            .post('/v1/auth/change-password')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send({
                currentPassword: testUser.password,
                newPassword: newPassword
            })
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
    });

    test('/v1/auth/login with new password', async () => {
        const res = await request(app)
            .post('/v1/auth/login')
            .send({
                emailAddress: testUser.emailAddress,
                password: newPassword
            })
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        testAccessToken = res.body.data[0].token.access;
        testRefreshToken = res.body.data[0].token.refresh;
    });

    afterAll(async () => {
        const res = await request(app)
            .post('/v1/auth/change-password')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send({
                currentPassword: newPassword,
                newPassword: testUser.password
            })
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
    });
});