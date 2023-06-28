// import http from 'node:http';
import http from 'http';
import * as dotenv from 'dotenv';

dotenv.config();

export const DEFAULT_PORT = 4000;

const server = http.createServer(() => {});

const PORT = process.env.PORT || DEFAULT_PORT;
server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
