require('dotenv').config();

import { init } from './app';
import { Configuration } from './config';

const { ENVIRONMENT, PORT } = Configuration;

(async () => {
    const app = await init();

    app.listen(PORT, () => {
        console.info(`[server]: Running at http://localhost:${PORT} in mode "${ENVIRONMENT}"`);
    });
})();
