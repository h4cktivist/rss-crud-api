import request from 'supertest';
import { server } from '../src/server';
import { userInterface, users } from '../src/users';
import { v4 as uuidv4 } from "uuid";

describe('Action tests', () => {
    beforeAll(() => {
        users.length = 0;
        const user: userInterface = {
            id: uuidv4(),
            username: 'TestUser',
            age: 18,
            hobbies: ['Test', 'Hobby']
        };
        users.push(user);
    });

    it('get one user', async () => {
        const res = await request(server).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(typeof res.body).toBe('object');
        expect(res.body).toHaveLength(1);
    });

    it('add new user', async () => {
        const newUser = {
            username: 'SomeUser',
            age: 20,
            hobbies: ['Hobby1', 'Hobby2', 'Hobby3']
        };
        const res = await request(server)
            .post('/api/users')
            .send(newUser);
        expect(res.statusCode).toBe(201);
        expect(typeof res.body).toBe('object');
        expect(res.body.username).toBe('SomeUser');
        expect(res.body.age).toBe(20)
        expect(res.body.hobbies).toHaveLength(3);
        expect(res.body.hobbies[0]).toBe('Hobby1');
        expect(res.body.hobbies[1]).toBe('Hobby2');
        expect(res.body.hobbies[2]).toBe('Hobby3');
    });

    it('get two users', async () => {
        const res = await request(server).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(typeof res.body).toBe('object');
        expect(res.body).toHaveLength(2);
    });
});
