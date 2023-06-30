# CRUD-api

## Installing

1. clone the repo

````bash
  https://github.com/AlexeiKozlovskiy/CRUD-api.git
```

2. move to the created folder

```bash
  cd CRUD-API
```
3. checkout to the development branch
```bash
  git checkout develop
```
4. install all dependencies
```bash
  npm imstall
```
5. rename file `.env.example` to `.env`, default is 4000

## Running

To run app in development mode use:

```bash
  npm run start:dev
```

To run app in production mode use:

```bash
  npm run start:prod
```

To run app in multi mode use:

```bash
  npm run start:multi
```

## Testing

To run tests use:

```bash
  npm run test
```

## Server API

**GET** `api/users` is used to get all persons
Server should answer with status code 200 and all users records

**GET** `api/users/${userId}`
Server answers with status code **200** and record with `id === userId` if it exists
Server answers with status code **400** and error message if `userId` is invalid
Server answers with status code **404** and error message if record with `id === userId` doesn't exist

**POST** `api/users is used` to create record about new user and store it in database
Server answers with status code **201** and newly created record
Server answers with status code **400** and error message if request body does not contain required fields

**PUT** `api/users/{userId}` is used to update existing user
Server answers with status code **200** and updated record
Server answers with status code **400** and error message if `userId` is invalid
Server answers with status code **404** and error message if record with `id === userId` doesn't exist

**DELETE** `api/users/${userId}` is used to delete existing user from database
Server answers with status code **204** if the record is found and deleted
Server answers with status code **400** and error message if `userId` is invalid
Server answers with status code **404** and error message if record with `id === userId` doesn't exist
