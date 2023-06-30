import request from 'supertest';
import { server } from '../src/server';
import { User } from '../src/types/User';
import { Message, baseUrl } from '../src/constants';

const user = { username: 'Lexa', age: 29, hobbies: ['bicycling', 'photography'] };
const userUpdate = { username: 'Sasha', age: 25, hobbies: ['drinking', 'smokimg'] };
const userNotReqFields = { age: 28, hobbies: ['drinking', 'smokimg'] };
const noExistId = '0b5656a5-9832-4bb5-aa59-b614bf5dc8c2';
const invalidId = '0w5656w5-9832-4ww5-ww59-w614ww5ww8w2';
let userId: string;

describe('Scenario 1, base', () => {
  it('should return empty array for the first GET request', async () => {
    const response = await request(server).get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return new created user for the POST request', async () => {
    const response = await request(server).post(baseUrl).send(user);
    expect(response.statusCode).toBe(201);
    expect(response.body.username).toBe(user.username);
    expect(response.body.age).toBe(user.age);
    expect(response.body.hobbies).toEqual(user.hobbies);
    userId = response.body.id;
  });

  it('should return array with created user data after POST request for the GET request', async () => {
    const response = await request(server).get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body.find((el: User) => el.id === userId)).toBeTruthy();
  });

  it('should return created user by id request', async () => {
    const response = await request(server).get(`${baseUrl}/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.username).toBe(user.username);
    expect(response.body.age).toBe(user.age);
    expect(response.body.hobbies).toEqual(user.hobbies);
  });

  it('should return update user data after the PUT request', async () => {
    const response = await request(server).put(`${baseUrl}/${userId}`).send(userUpdate);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.age).toBe(userUpdate.age);
    expect(response.body.username).toBe(userUpdate.username);
    expect(response.body.hobbies.includes(userUpdate.hobbies[0])).toBe(true);
  });

  it('should delete user for the DELETE request', async () => {
    const response = await request(server).delete(`${baseUrl}/${userId}`);
    expect(response.statusCode).toBe(204);
  });

  it('should return return user not found message after delete user for the DELETE request', async () => {
    const response = await request(server).get(`${baseUrl}/${userId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: Message.USER_NOT_FOUND });
  });
});

describe('Scenario 2, no exist user ID', () => {
  it('should return new created user for the request', async () => {
    const response = await request(server).post(baseUrl).send(user);
    expect(response.statusCode).toBe(201);
    expect(response.body.username).toBe(user.username);
    expect(response.body.age).toBe(user.age);
    expect(response.body.hobbies).toEqual(user.hobbies);
  });

  it('should return 404 and user not found message if id does not exist for the GET request', async () => {
    const response = await request(server).get(`${baseUrl}/${noExistId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: Message.USER_NOT_FOUND });
  });

  it('should return 404 and user not found message if id does not exist for the PUT request', async () => {
    const response = await request(server).put(`${baseUrl}/${noExistId}`).send(userUpdate);
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: Message.USER_NOT_FOUND });
  });

  it('should return 404 and user not found message if id does not exist for the DELETE request', async () => {
    const response = await request(server).delete(`${baseUrl}/${noExistId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: Message.USER_NOT_FOUND });
  });
});

describe('Scenario 3, invalid user ID', () => {
  it('should return array for the GET request', async () => {
    const response = await request(server).get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('should return 400 and invalid user id message if ID is invalid for the GET request', async () => {
    const response = await request(server).get(`${baseUrl}/${invalidId}`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: Message.INVALID_USER_ID });
  });

  it('should return 400 and user not found message if id does not exist for the PUT request', async () => {
    const response = await request(server).put(`${baseUrl}/${invalidId}`).send(userUpdate);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: Message.INVALID_USER_ID });
  });

  it('should return 400 and user not found message if id does not exist for the DELETE request', async () => {
    const response = await request(server).delete(`${baseUrl}/${invalidId}`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: Message.INVALID_USER_ID });
  });
});

describe('Scenario 4, required fields', () => {
  it('should return array for the GET request', async () => {
    const response = await request(server).get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('should return 400 and error message required fields if id does not exist for the POST request', async () => {
    const response = await request(server).post(baseUrl).send(userNotReqFields);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: Message.MISSING_REQUIRED_FIELDS });
  });

  it('should return 404 and endpoint not found error for no exist path GET request', async () => {
    const response = await request(server).get('/apiewe/users');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: Message.ENDPOINT_NOT_FOUND });
  });
});

afterAll(async () => {
  server.close();
});
