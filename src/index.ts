import * as dotenv from 'dotenv';
import { server } from './server';
import { DEFAULT_PORT } from './constants';

dotenv.config();

const PORT = process.env.PORT || DEFAULT_PORT;
server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
