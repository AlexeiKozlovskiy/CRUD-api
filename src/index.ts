import * as dotenv from 'dotenv';
import { server } from './server';
import { DEFAULT_PORT, CLUSTER_MODE } from './constants';
import { clusters } from './clusters';

dotenv.config();
const PORT = process.env.PORT || DEFAULT_PORT;
const clusterMode = process.argv[2] === CLUSTER_MODE;

if (clusterMode) {
  clusters();
} else {
  loadServer();
}

function loadServer() {
  server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
}
