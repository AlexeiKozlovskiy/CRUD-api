export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum Message {
  INVALID_USER_ID = 'Invalid user ID',
  USER_NOT_FOUND = 'User not found',
  INVALID_REQEST_BODY = 'Invalid request body',
  ENDPOINT_NOT_FOUND = 'Endpoint not found',
  MISSING_REQUIRED_FIELDS = 'Missing required fields',
}

export const DEFAULT_PORT = 4000;
export const baseUrl = '/api/users';
export const CLUSTER_MODE = 'cluster';
