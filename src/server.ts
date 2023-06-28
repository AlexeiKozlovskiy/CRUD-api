import http, { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { User } from './types/User';
import { Method, Message, baseUrl } from './constants';
import { validUuid } from './utils';
import { sendResponse, sendErrorResponse } from './responseServise';

const users: User[] = [];

function parseRequestBody(req: IncomingMessage, callback: (error: Error | null, body: object | null) => void) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const parsedBody = JSON.parse(body);
      callback(null, parsedBody);
    } catch (error) {
      callback(error as Error, null);
    }
  });
}

export const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const { url, method } = req;

  if (url === baseUrl && method === Method.GET) {
    sendResponse(res, 200, users);
  } else if (url?.startsWith(baseUrl) && method === Method.GET) {
    const userId = url.split('/')[3];
    const user = users.find((el) => el.id === userId);

    if (!userId || !validUuid(userId)) {
      sendErrorResponse(res, 400, Message.INVALID_USER_ID);
    } else if (!user) {
      sendErrorResponse(res, 404, Message.USER_NOT_FOUND);
    } else {
      sendResponse(res, 200, user);
    }
  } else if (url === baseUrl && method === Method.POST) {
    parseRequestBody(req, (error, body) => {
      if (error) {
        sendErrorResponse(res, 400, Message.INVALID_REQEST_BODY);
      } else {
        const { username, age, hobbies } = body as User;

        if (!username || !age) {
          sendErrorResponse(res, 400, Message.MISSING_REQUIRED_FIELDS);
        } else {
          const newUser: User = {
            id: uuidv4(),
            username,
            age,
            hobbies: hobbies || [],
          };
          users.push(newUser);
          sendResponse(res, 201, newUser);
        }
      }
    });
  } else if (url?.startsWith(baseUrl) && method === Method.PUT) {
    const userId = url.split('/')[3];
    parseRequestBody(req, (error, body) => {
      if (error) {
        sendErrorResponse(res, 400, Message.INVALID_REQEST_BODY);
      } else {
        const { username, age, hobbies } = body as User;
        const userIndex = users.findIndex((el) => el.id === userId);

        if (!userId || !validUuid(userId)) {
          sendErrorResponse(res, 400, Message.INVALID_USER_ID);
        } else if (userIndex === -1) {
          sendErrorResponse(res, 404, Message.USER_NOT_FOUND);
        } else {
          const updatedUser = {
            ...users[userIndex],
            username: username || users[userIndex].username,
            age: age || users[userIndex].age,
            hobbies: hobbies || users[userIndex].hobbies,
          };
          users[userIndex] = updatedUser;
          sendResponse(res, 200, updatedUser);
        }
      }
    });
  } else if (url?.startsWith(baseUrl) && method === Method.DELETE) {
    const userId = url.split('/')[3];
    const userIndex = users.findIndex((el) => el.id === userId);

    if (!userId || !validUuid(userId)) {
      sendErrorResponse(res, 400, Message.INVALID_USER_ID);
    } else if (userIndex === -1) {
      sendErrorResponse(res, 404, Message.USER_NOT_FOUND);
    } else {
      users.splice(userIndex, 1);
      sendResponse(res, 204, '');
    }
  } else {
    sendErrorResponse(res, 404, Message.ENDPOINT_NOT_FOUND);
  }
});
