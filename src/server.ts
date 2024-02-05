import http from 'http';
import {getUsers, addUser, updateUser, deleteUser, sendResponse} from './utils';

const CONTENT_TYPE: http.OutgoingHttpHeaders = { 'Content-Type': 'application/json' };
export const server: http.Server = http.createServer( (req: http.IncomingMessage, res: http.ServerResponse): void => {
    if (req.method === 'GET') {
        getUsers(res, req.url);
    } else if (req.method === 'POST' && req.url === '/api/users') {
        addUser(req, res);
    } else if (req.method === 'PUT' && req.url?.startsWith('/api/users')) {
        updateUser(req, res, req.url);
    } else if (req.method === 'DELETE' && req.url?.startsWith('/api/users')) {
        deleteUser(res, req.url);
    } else {
        sendResponse(res, 404, CONTENT_TYPE, {error: 'Method is not allowed or URL is not found!'});
    }
});
