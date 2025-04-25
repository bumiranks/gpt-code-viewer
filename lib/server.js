import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { createSessionRouter } from './router.js';

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function startServer() {
    const app = express();
    app.use(express.json());

    const uid = uuidv4();
    app.use(`/session/${uid}`, createSessionRouter());

    app.use('/ui/static', express.static(path.join(__dirname, '../ui')));

    app.get(`/session/${uid}/project-path`, (req, res) => {
        res.json({ path: process.cwd() });
    });

    app.get('/ui', (req, res) => {
        const htmlPath = path.join(__dirname, '../ui/index.html');
        let html = fs.readFileSync(htmlPath, 'utf8');
        html = html.replace(
            '</head>',
            `<script>const SESSION_UID = '${uid}';</script>\n</head>`
        );
        res.send(html);
    });

    app.listen(PORT, () => {
        console.log(`🚀 GPT Code Viewer is running at:`);
        console.log(`http://localhost:${PORT}/session/${uid}/structure`);
        console.log(`UI: http://localhost:${PORT}/ui`);
    });

    return uid;
}

