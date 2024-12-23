import request from 'supertest';
import app from '../app';

const test_user_info = {
    emailAddress: 'test@example.com',
    password: '1234561341',
    newPassword: '11111111',
    userName: 'test_user_payload',
    role: 1
}

describe('Auth Routes', () => {
    let test_user_payload = {
        token: {}
    };

    describe('Auth -> overall validation process', () => {
        test('POST /auth/register', async () => {
            const res = await request(app).post('/v1/auth/register').send({
                emailAddress: test_user_info.emailAddress,
                password: test_user_info.password,
                userName: test_user_info.userName,
                role: test_user_info.role
            });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data[0].emailAddress).toBe(test_user_info.emailAddress);
            expect(res.body.data[0].userName).toBe(test_user_info.userName);
            expect(res.body.data[0].role).toBe(test_user_info.role);
            expect(res.body).toHaveProperty('v_token');

            test_user_payload.v_token = res.body.v_token;
        });

        test('GET /auth/account-verification/:v', async () => {
            const res = await request(app).get(`/v1/auth/account-verification/${test_user_payload.v_token}`);
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
        });

        test('POST /auth/login', async () => {
            const res = await request(app).post('/v1/auth/login').send({
                emailAddress: test_user_info.emailAddress,
                password: test_user_info.password
            });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data[0]).toHaveProperty('token');
            expect(res.body.data[0].token).toHaveProperty('access');
            expect(res.body.data[0].token).toHaveProperty('refresh');

            test_user_payload.token.access = res.body.data[0].token.access;
            test_user_payload.token.refresh = res.body.data[0].token.refresh;
        });

        test('GET /auth/me', async () => {
            const res = await request(app).get('/v1/auth/me').set('Authorization', `Bearer ${test_user_payload.token.access}`);
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data[0].emailAddress).toBe(test_user_info.emailAddress);
            expect(res.body.data[0].userName).toBe(test_user_info.userName);
            expect(res.body.data[0].role).toBe(test_user_info.role);
        });

        test('POST /auth/change-password', async () => {
            const res = await request(app).post('/v1/auth/change-password').send({
                currentPassword: test_user_info.password,
                newPassword: test_user_info.newPassword
            }).set('Authorization', `Bearer ${test_user_payload.token.access}`);
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data[0].emailAddress).toBe(test_user_info.emailAddress);
            expect(res.body.data[0].userName).toBe(test_user_info.userName);
            expect(res.body.data[0].role).toBe(test_user_info.role);
        });

        test('POST /auth/delete', async () => {
            const res = await request(app).post('/v1/auth/delete').send({
                emailAddress: test_user_info.emailAddress,
                password: test_user_info.newPassword
            });
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
        });
    });

    // describe('Auth -> refresh access token validation process', () => {

    // }); 
});