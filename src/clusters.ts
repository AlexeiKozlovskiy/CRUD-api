import cluster from 'cluster';
import * as dotenv from 'dotenv';
import { cpus } from 'os';
import { DEFAULT_PORT } from './constants';
import { server } from './server';

dotenv.config();
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

export function clusters() {
  if (!cluster.isWorker) {
    const numCPUs = cpus().length;
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork({ PORT: PORT + i });
    }
  } else {
    server.listen(PORT, () => {
      console.log(`Worker pid=${process.pid} is listening on port ${PORT}`);
    });
  }
}
