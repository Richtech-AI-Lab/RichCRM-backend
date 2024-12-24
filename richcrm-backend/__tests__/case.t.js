import request from 'supertest';
import express from 'express';
import caseRouter from '../routes/v1/case';
import clientRouter from '../routes/v1/client';
import contactRouter from '../routes/v1/contact';
import organizationRouter from '../routes/v1/organization';
import premisesRouter from '../routes/v1/premises';
import tagRouter from '../routes/v1/tag';
import bodyParser from 'body-parser';
import { clientType } from '../db/types';
import authRouter from '../routes/v1/auth';



const app = new express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/v1/case', caseRouter);
app.use('/v1/client', clientRouter);
app.use('/v1/contact', contactRouter);
app.use('/v1/organization', organizationRouter);
app.use('/v1/premises', premisesRouter);
app.use('/v1/tag', tagRouter);
app.use('/v1/auth', authRouter);

var testCaseId;

var testAccessToken;
var testRefreshToken;

const tagObj1 = {
    label: "Other",
    color1: "#000000",
    color2: "#FFFFFF",
    tagType: 0,
}

const clientObj1 = {
    clientType: 0,
    tags: ["Other"],
    firstName: "Testy",
    lastName: "McTest",
    cellNumber: "8880909765",
    email: "testymc@gmail.com",
}
const clientObj2 = {
    clientType: 0,
    tags: ["Other"],
    firstName: "Testson",
    lastName: "McTestment",
    cellNumber: "6667539201",
    email: "testson@gmail.com",
}

const contactObj1 = {
    tags: ["Other"],
    firstName: "TestContact",
    lastName: "McTestContact",
    company: "Test Inc.",
    position: "CTO",
    mailingAddress: "Jersey City NJ 07302-6312#P2",
}

const organizationObj1 = {
    organizationName: "Testy Organization Test",
    organizationType: 2
}

var caseObj = {
    premisesId: "cbf8e709-7af2-4433-9276-7d5ba9113950",
    creatorId: "test1@gmail.com",
    stage: 0,
    caseType: 1,
    clientType: 0,
    additionalClients: [],
    contacts: [],
    additionalOrganizations: [],
}

const test_user1 = {
    emailAddress: 'new_test_acc@gmail.com', 
    password: '88888888'
}

describe('Case Routes', function () {

    beforeAll(async () => {
        const res = await request(app)
            .post('/v1/auth/login')
            .send(test_user1)
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        testAccessToken = res.body.data[0].token.access;
        testRefreshToken = res.body.data[0].token.refresh;
    });

    test('/tag/create', async () => {
        const res = await request(app)
            .post('/v1/tag/create')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send(tagObj1)
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
    });

    test('/client/register', async () => {
        const res = await request(app)
            .post('/v1/client/register')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send(clientObj1)
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data[0].firstName).toEqual(clientObj1.firstName);
        caseObj.clientId = res.body.data[0].clientId;

        const res2 = await request(app)
            .post('/v1/client/register')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send(clientObj2)
            .set('Accept', 'application/json');
        console.log(res2.body);
        expect(res2.statusCode).toBe(200);
        expect(res2.body.status).toEqual('success');
        expect(res2.body.data[0].firstName).toEqual(clientObj2.firstName);
        caseObj.additionalClients.push(res2.body.data[0].clientId);
    });

    test('/contact/register', async () => {
        const res = await request(app)
            .post('/v1/contact/register')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send(contactObj1)
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data[0].firstName).toEqual(contactObj1.firstName);
        caseObj.contacts.push(res.body.data[0].contactId);
    });

    test('/organization/register', async () => {
        const res = await request(app)
            .post('/v1/organization/register')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send(organizationObj1)
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data[0].organizationName).toEqual(organizationObj1.organizationName);
        caseObj.additionalOrganizations.push(res.body.data[0].organizationId);
    });


    test('/case/create', async () => {
        const res = await request(app)
            .post('/v1/case/create')
            .set('Authorization', `Bearer ${testAccessToken}`)
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
        expect(res.body.data[0].clientType).toEqual(caseObj.clientType);
        expect(res.body.data[0].clientId).toEqual(caseObj.clientId);
        expect(res.body.data[0].additionalClients).toEqual(caseObj.additionalClients);
        expect(res.body.data[0].contacts).toEqual(caseObj.contacts);
        expect(res.body.data[0].additionalOrganizations).toEqual(caseObj.additionalOrganizations);
    });

    test('case/:id', async () => {
        const res = await request(app)
            .get(`/v1/case/${testCaseId}`)
            .set('Authorization', `Bearer ${testAccessToken}`);

        console.log(res.body.data[0]);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data[0].caseId).toEqual(testCaseId);
        expect(res.body.data[0].creatorId).toEqual(caseObj.creatorId);
        expect(res.body.data[0].premisesId).toEqual(caseObj.premisesId);
        expect(res.body.data[0].stage).toEqual(caseObj.stage);
        expect(res.body.data[0].caseType).toEqual(caseObj.caseType);
        expect(res.body.data[0].clientType).toEqual(caseObj.clientType);
        expect(res.body.data[0].clientId).toEqual(caseObj.clientId);
        expect(res.body.data[0].additionalClients).toEqual(caseObj.additionalClients);
        expect(res.body.data[0].contacts).toEqual(caseObj.contacts);
    });

    test('case/all', async () => {

        const res = await request(app)
            .post('/v1/case/all')
            .set('Authorization', `Bearer ${testAccessToken}`)
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
        const res = await request(app)
            .post('/v1/case/query/client')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send({
                clientId: caseObj.additionalClients[0],
            })
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data[0].additionalClients).toContain(caseObj.additionalClients[0]);
    });

    test('case/update', async () => {
        const caseObj = {
            caseId: testCaseId,
            premisesId: "cbf8e709-7af2-4433-9276-7d5ba9113950",
            creatorId: "test1@gmail.com",
            stage: 1,
            closeAt: "2024-07-20T20:24:24.740Z",
            closingDate: "2024-07-20T20:24:24.740Z",
            mortgageContingencyDate: "2024-07-20T20:24:24.740Z",
            additionalClients: ["738ffc97-299b-423a-b759-2116a402b18d"],
            contacts: ["8d587c04-0d59-4b70-8264-922d26bf6f00"]
        }

        const res = await request(app)
            .post('/v1/case/update')
            .set('Authorization', `Bearer ${testAccessToken}`)
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
        const res = await request(app)
            .post('/v1/case/delete')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send({caseId: testCaseId})
            .set('Accept', 'application/json');

        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
    });

    test('/client/delete', async () => {
        const res = await request(app)
            .post('/v1/client/delete')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send({clientId: caseObj.clientId})
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');

        const res2 = await request(app)
            .post('/v1/client/delete')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send({clientId: caseObj.additionalClients[0]})
            .set('Accept', 'application/json');
        console.log(res2.body);
        expect(res2.statusCode).toBe(200);
        expect(res2.body.status).toEqual('success');
    });

    test('/contact/delete', async () => {
        const res = await request(app)
            .post('/v1/contact/delete')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send({contactId: caseObj.contacts[0]})
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
    });

    test('/organization/delete', async () => {
        const res = await request(app)
            .post('/v1/organization/delete')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send({organizationId: caseObj.additionalOrganizations[0]})
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
    });

    test('/tag/delete', async () => {
        const res = await request(app)
            .post('/v1/tag/delete')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send({label: tagObj1.label})
            .set('Accept', 'application/json');
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toEqual('success');
    });

});