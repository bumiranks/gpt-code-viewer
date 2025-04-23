import express from 'express';
import { createSessionRouter } from './router.js';

const PORT = process.env.PORT || 3000;

export function startServer() {
    const app = express();
    app.use(express.json());

    app.use('/session/:uid', createSessionRouter());

    app.listen(PORT, () => {
        console.log(`🚀 GPT Code Viewer is running at http://localhost:${PORT}/session/<uid>/`);
    });
}
