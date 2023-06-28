import { ServerResponse } from 'http';

function responseHeaders(res: ServerResponse, statusCode: number) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
}

export function sendResponse(res: ServerResponse, statusCode: number, data: object | string) {
  responseHeaders(res, statusCode);
  res.end(JSON.stringify(data));
}

export function sendErrorResponse(res: ServerResponse, statusCode: number, message: string) {
  responseHeaders(res, statusCode);
  res.end(JSON.stringify({ message }));
}
