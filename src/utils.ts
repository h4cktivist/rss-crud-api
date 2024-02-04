import http from 'http';
import { validate, v4 as uuidv4 } from 'uuid';
import { users } from './users';

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

export const handleGET = (res: http.ServerResponse, url: string | undefined): void => {
    if (url === '/api/users') {
        sendResponse(res, 200, CONTENT_TYPE, users);
    } else if (url?.startsWith('/api/users')) {
        const id: string = url?.split('/').slice(-1)[0];
        if (validate(id)) {
            const user = users.find(u => u.id === id);
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

export const handlePOST = (req: http.IncomingMessage, res: http.ServerResponse): void => {
    let data: string = '';
    req.on('data', (chunk: any): void => {
        data += chunk;
    });
    req.on('end', (): void => {
        const user = JSON.parse(data);
        if (validateBody(user)) {
            user.id = uuidv4();
            users.push(user);
            sendResponse(res, 201, CONTENT_TYPE, user);
        } else {
            sendResponse(res, 400, CONTENT_TYPE, { error: 'Request body does not contain required fields' });
        }
    });
};
