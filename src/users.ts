import { v4 as uuidv4 } from 'uuid';

export interface userInterface {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}

export let users: userInterface[] = [
    {
        id: uuidv4(),
        username: 'Test1',
        age: 20,
        hobbies: ['Football', 'Reading']
    },
    {
        id: uuidv4(),
        username: 'Test2',
        age: 25,
        hobbies: ['Programming']
    },
    {
        id: uuidv4(),
        username: 'Test3',
        age: 40,
        hobbies: []
    }
];
