import http from 'http';
import {getUsers, addUser, updateUser, deleteUser, sendResponse} from './utils';

const CONTENT_TYPE: http.OutgoingHttpHeaders = { 'Content-Type': 'application/json' };
export const server: http.Server = http.createServer( (req: http.IncomingMessage, res: http.ServerResponse): void => {
    if (req.method === 'GET') {
        try {
            getUsers(res, req.url);
        } catch {
            sendResponse(res, 500, CONTENT_TYPE, {error: 'Internal server error'});
        }
    } else if (req.method === 'POST' && req.url === '/api/users') {
        try {
            addUser(req, res);
        } catch {
            sendResponse(res, 500, CONTENT_TYPE, {error: 'Internal server error'});
        }
    } else if (req.method === 'PUT' && req.url?.startsWith('/api/users')) {
        try {
            updateUser(req, res, req.url);
        } catch {
            sendResponse(res, 500, CONTENT_TYPE, {error: 'Internal server error'});
        }
    } else if (req.method === 'DELETE' && req.url?.startsWith('/api/users')) {
        try {
            deleteUser(res, req.url);
        } catch {
            sendResponse(res, 500, CONTENT_TYPE, {error: 'Internal server error'});
        }
    } else {
        sendResponse(res, 404, CONTENT_TYPE, {error: 'Method is not allowed or URL is not found!'});
    }
});
