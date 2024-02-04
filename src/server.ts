import http from 'http';
import {handleGET, handlePOST, sendResponse} from './utils';

const CONTENT_TYPE: http.OutgoingHttpHeaders = { 'Content-Type': 'application/json' };
export const server: http.Server = http.createServer( (req: http.IncomingMessage, res: http.ServerResponse): void => {
    if (req.method === 'GET') {
        handleGET(res, req.url);
    } else if (req.method == 'POST' && req.url === '/api/users') {
        handlePOST(req, res);
    } else {
        sendResponse(res, 404, CONTENT_TYPE, {error: 'Method is not allowed!'});
    }
});
