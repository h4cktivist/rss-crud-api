import http from 'http';
import { validate } from 'uuid';
import { users } from './users';

const CONTENT_TYPE: http.OutgoingHttpHeaders = { 'Content-Type': 'application/json' };
export const sendResponse = (res: http.ServerResponse, code: number, contentType: http.OutgoingHttpHeaders, data: object | undefined): void => {
    const jsonData: string = JSON.stringify(data);
    res.writeHead(code, contentType);
    res.end(jsonData);
};

export const handleGET = (req: http.IncomingMessage, res: http.ServerResponse, url: string | undefined): void => {
    if (url === '/api/users') {
        sendResponse(res, 200, CONTENT_TYPE, users);
    } else if (url?.startsWith('/api/users')) {
        const id: string = url?.split('/').slice(-1)[0];
        if (validate(id)) {
            const user = users.find(u => u.id === id);
            if (user)
                sendResponse(res, 200, CONTENT_TYPE, user);
            else
                sendResponse(res, 404, CONTENT_TYPE, {error: 'User is not found'});
        } else {
            sendResponse(res, 400, CONTENT_TYPE, {error: 'User ID is incorrect'});
        }
    } else {
        sendResponse(res, 404, CONTENT_TYPE, { error: 'Endpoint is not found' });
    }
};
