import http from 'http';
import { validate, v4 as uuidv4 } from 'uuid';
import { userInterface, users } from './users';

const CONTENT_TYPE: http.OutgoingHttpHeaders = { 'Content-Type': 'application/json' };
export const sendResponse = (res: http.ServerResponse, code: number, contentType: http.OutgoingHttpHeaders, data: object | undefined): void => {
    const jsonData: string = JSON.stringify(data);
    res.writeHead(code, contentType);
    res.end(jsonData);
};

const validateBody = (user: object): boolean => {
    return (
        'username' in user &&
        'age' in user &&
        'hobbies' in user &&
        user.username !== '' &&
        user.age !== ''
    );
};

export const getUsers = (res: http.ServerResponse, url: string | undefined): void => {
    if (url === '/api/users') {
        sendResponse(res, 200, CONTENT_TYPE, users);
    } else if (url?.startsWith('/api/users')) {
        const id: string = url?.split('/').slice(-1)[0];
        if (validate(id)) {
            const user: userInterface | undefined = users.find(u => u.id === id);
            if (user)
                sendResponse(res, 200, CONTENT_TYPE, user);
            else
                sendResponse(res, 404, CONTENT_TYPE, { error: 'User is not found' });
        } else {
            sendResponse(res, 400, CONTENT_TYPE, { error: 'User ID is incorrect' });
        }
    } else {
        sendResponse(res, 404, CONTENT_TYPE, { error: 'Endpoint is not found' });
    }
};

export const addUser = (req: http.IncomingMessage, res: http.ServerResponse): void => {
    let data: string = '';
    req.on('data', (chunk: string): void => {
        data += chunk;
    });
    req.on('end', (): void => {
        const user: userInterface = JSON.parse(data);
        if (validateBody(user)) {
            user.id = uuidv4();
            users.push(user);
            sendResponse(res, 201, CONTENT_TYPE, user);
        } else {
            sendResponse(res, 400, CONTENT_TYPE, { error: 'Request body does not contain required fields' });
        }
    });
};

export const updateUser = (req: http.IncomingMessage, res: http.ServerResponse, url: string): void => {
    let data: string = '';
    req.on('data', (chunk: string): void => {
        data += chunk;
    });
    req.on('end', (): void => {
        const newUser: userInterface = JSON.parse(data);
        if (validateBody(newUser)) {
            const id: string = url?.split('/').slice(-1)[0];
            if (validate(id)) {
                const userIndex: number = users.findIndex(u => u.id === id);
                if (userIndex !== -1) {
                    users[userIndex] = { ...users[userIndex], ...newUser, id: id };
                    sendResponse(res, 200, CONTENT_TYPE, users[userIndex]);
                } else {
                    sendResponse(res, 404, CONTENT_TYPE, { error: 'User is not found' });
                }
            } else {
                sendResponse(res, 400, CONTENT_TYPE, { error: 'User ID is incorrect' });
            }
        } else {
            sendResponse(res, 400, CONTENT_TYPE, { error: 'Request body does not contain required fields' });
        }
    });
};

export const deleteUser = (res: http.ServerResponse, url: string): void => {
    const id: string = url?.split('/').slice(-1)[0];
    if (validate(id)) {
        const userIndex: number = users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            sendResponse(res, 204, CONTENT_TYPE, {});
        } else {
            sendResponse(res, 404, CONTENT_TYPE, { error: 'User is not found' });
        }
    } else {
        sendResponse(res, 400, CONTENT_TYPE, { error: 'User ID is incorrect' });
    }
};
