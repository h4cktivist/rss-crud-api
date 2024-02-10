import request from 'supertest';
import { server } from '../src/server';
import { users } from '../src/users';

describe('User CRUD tests', () => {
    const getUserID = async () => {
        const res = await request(server).get('/api/users');
        return  res.body[0].id;
    };

    beforeAll(() => {
        users.length = 0;
    });

    it('get all the users', async () => {
        const res = await request(server).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(typeof res.body).toBe('object');
        expect(res.body).toHaveLength(0);
    });

    it('add new user', async () => {
        const newUser = {
            username: 'TestUser',
            age: 18,
            hobbies: ['Test', 'Hobby']
        }
        const res = await request(server)
            .post('/api/users')
            .send(newUser);
        expect(res.statusCode).toBe(201);
        expect(typeof res.body).toBe('object');
        expect(res.body.username).toBe('TestUser');
        expect(res.body.age).toBe(18)
        expect(res.body.hobbies).toHaveLength(2);
        expect(res.body.hobbies[0]).toBe('Test');
        expect(res.body.hobbies[1]).toBe('Hobby');
    });

    it('get user by id', async () => {
        const userID = await getUserID();
        const res = await request(server).get(`/api/users/${userID}`);
        expect(res.statusCode).toBe(200);
        expect(typeof res.body).toBe('object');
    });

    it('update user by id', async () => {
        const userID = await getUserID();
        const updatedUser = {
            username: 'UpdatedUser',
            age: 19,
            hobbies: ['Updated', 'Hobby']
        };
        const res = await request(server)
            .put(`/api/users/${userID}`)
            .send(updatedUser);
        expect(res.statusCode).toBe(200);
        expect(typeof res.body).toBe('object');
        expect(res.body.username).toBe('UpdatedUser');
        expect(res.body.age).toBe(19);
        expect(res.body.hobbies).toHaveLength(2);
        expect(res.body.hobbies[0]).toBe('Updated');
    });

    it('delete user by id', async () => {
        const userID = await getUserID();
        const res = await request(server).delete(`/api/users/${userID}`);
        expect(res.statusCode).toBe(204);
    });
});
