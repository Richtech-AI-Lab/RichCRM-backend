import request from 'supertest';
import express from 'express';
import caseRouter from '../routes/v1/case';
import bodyParser from 'body-parser';

const app = new express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/v1/case', caseRouter);

var testCaseId;

const caseObj = {
    premisesId: "8e5ac210-7c07-4dde-8ed2-f0d2b9f23699",
    creatorId: "test1@gmail.com",
    stage: 0,
    caseType: 1,
    sellerId: "bffc41d3-4ef5-4cc8-8889-6524971e8299",
    buyerId: null,
    additionalClients: ["738ffc97-299b-423a-b759-2116a402b18d", "86a6d1d3-9644-40cc-bec5-e2710567d882"],
    contacts: ["8d587c04-0d59-4b70-8264-922d26bf6f00", "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"]
}

describe('Case Routes', function () {

    test('/case/create', async () => {
        const res = await request(app).post('/v1/case/create')
            .send(caseObj)
            .set('Accept', 'application/json');
        
        if (res.body.data) testCaseId = res.body.data[0].caseId;
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data[0].creatorId).toEqual(caseObj.creatorId);
        expect(res.body.data[0].premisesId).toEqual(caseObj.premisesId);
        expect(res.body.data[0].stage).toEqual(caseObj.stage);
        expect(res.body.data[0].caseType).toEqual(caseObj.caseType);
        expect(res.body.data[0].sellerId).toEqual(caseObj.sellerId);
        expect(res.body.data[0].buyerId).toEqual(caseObj.buyerId);
        expect(res.body.data[0].additionalClients).toEqual(caseObj.additionalClients);
        expect(res.body.data[0].contacts).toEqual(caseObj.contacts);
    });

    test('case/:id', async () => {
        const res = await request(app).get(`/v1/case/${testCaseId}`);

        console.log(res.body.data[0]);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data[0].caseId).toEqual(testCaseId);
        expect(res.body.data[0].creatorId).toEqual(caseObj.creatorId);
        expect(res.body.data[0].premisesId).toEqual(caseObj.premisesId);
        expect(res.body.data[0].stage).toEqual(caseObj.stage);
        expect(res.body.data[0].caseType).toEqual(caseObj.caseType);
        expect(res.body.data[0].sellerId).toEqual(caseObj.sellerId);
        expect(res.body.data[0].buyerId).toEqual(caseObj.buyerId);
        expect(res.body.data[0].additionalClients).toEqual(caseObj.additionalClients);
        expect(res.body.data[0].contacts).toEqual(caseObj.contacts);
    });

    test('case/all', async () => {

        const res = await request(app).post('/v1/case/all')
            .send({
                creatorId: "test1@gmail.com",
            })
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data[0].creatorId).toEqual("test1@gmail.com");
    });

    test('case/query/client', async () => {
        const res = await request(app).post('/v1/case/query/client')
            .send({
                clientId: "738ffc97-299b-423a-b759-2116a402b18d",
            })
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data[0].additionalClients).toContain("738ffc97-299b-423a-b759-2116a402b18d");
    });

    test('case/update', async () => {
        const caseObj = {
            caseId: testCaseId,
            premisesId: "8e5ac210-7c07-4dde-8ed2-f0d2b9f23699",
            creatorId: "test1@gmail.com",
            stage: 1,
            closeAt: "2024-07-20T20:24:24.740Z",
            closingDate: "2024-07-20T20:24:24.740Z",
            mortgageContingencyDate: "2024-07-20T20:24:24.740Z",
            additionalClients: ["26ea9b74-b431-4b08-88cd-436ba25486bb"],
            contacts: ["8d587c04-0d59-4b70-8264-922d26bf6f00"]
        }

        const res = await request(app).post('/v1/case/update')
            .send(caseObj)
            .set('Accept', 'application/json');

        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data[0].stage).toEqual(caseObj.stage);
        expect(res.body.data[0].closeAt).toEqual(caseObj.closeAt);
        expect(res.body.data[0].closingDate).toEqual(caseObj.closingDate);
    });

    test('case/delete', async () => {
        const res = await request(app).post('/v1/case/delete')
            .send({caseId: testCaseId})
            .set('Accept', 'application/json');

        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
    });

});