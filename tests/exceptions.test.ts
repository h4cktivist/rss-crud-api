import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { server } from '../src/server';
import { userInterface, users } from '../src/users';

describe('Exceptions tests', () => {
    const responseCheck = (res: request.Response, statusCode: number, errorMessage: string) => {
        expect(res.statusCode).toBe(statusCode);
        expect(typeof res.body).toBe('object');
        expect(res.body.error).toBe(errorMessage);
    };

    beforeAll(() => {
        users.length = 0;
        const testUser: userInterface = {
            id: uuidv4(),
            username: 'TestUser',
            age: 18,
            hobbies: ['Test', 'Hobby']
        };
        users.push(testUser);
    });

    it('get user by invalid ID', async () => {
        const invalidID = '00000a00-a0a0-000a-0a0a';
        const res = await request(server).get(`/api/users/${invalidID}`);
        responseCheck(res, 400, 'User ID is incorrect');
    });

    it('get user by non existent ID', async () => {
        const nonID = uuidv4();
        const res = await request(server).get(`/api/users/${nonID}`);
        responseCheck(res, 404, 'User is not found');
    });

    it('add new user without the required fields', async () => {
        const wrongUser = {
            username: 'Test'
        };
        const res = await request(server)
            .post('/api/users')
            .send(wrongUser);
        responseCheck(res, 400, 'Request body does not contain required fields');
    });

    it('update user by invalid ID', async () => {
        const invalidID = '00000a00-a0a0-000a-0a0a';
        const updatedUser = {
            username: 'UpdatedUser',
            age: 19,
            hobbies: ['Updated', 'Hobby']
        };
        const res = await request(server)
            .put(`/api/users/${invalidID}`)
            .send(updatedUser);
        responseCheck(res, 400, 'User ID is incorrect');
    });

    it('update user by non existent ID', async () => {
        const nonID = uuidv4();
        const updatedUser = {
            username: 'UpdatedUser',
            age: 19,
            hobbies: ['Updated', 'Hobby']
        };
        const res = await request(server)
            .put(`/api/users/${nonID}`)
            .send(updatedUser);
        responseCheck(res, 404, 'User is not found');
    });

    it('delete user by invalid ID', async () => {
        const invalidID = '00000a00-a0a0-000a-0a0a';
        const res = await request(server).delete(`/api/users/${invalidID}`);
        responseCheck(res, 400, 'User ID is incorrect');
    });

    it('delete user by non existent ID', async () => {
        const nonID = uuidv4();
        const res = await request(server).delete(`/api/users/${nonID}`);
        responseCheck(res, 404, 'User is not found');
    });
});
