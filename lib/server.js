import express from 'express';
import { createSessionRouter } from './router.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3000;

export function startServer() {
    const app = express();
    app.use(express.json());

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const uid = uuidv4();
    app.use(`/session/${uid}`, createSessionRouter());
    app.use('/ui', express.static(path.join(__dirname, '../ui')));

    app.listen(PORT, () => {
        console.log(`🚀 GPT Code Viewer is running at:`);
        console.log(`http://localhost:${PORT}/session/${uid}/structure`);
    });
}
