import express from 'express';
import fs from 'fs';
import path from 'path';
import { parseIgnore } from './ignore.js';

export function createSessionRouter() {
    const router = express.Router();
    const baseDir = process.cwd();
    const ignoreRules = parseIgnore(path.join(baseDir, '.chatignore'));

    router.get('/structure', (req, res) => {
        const structure = walkDir(baseDir, ignoreRules);
        res.json(structure);
    });

    router.get('/file', (req, res) => {
        const relPath = req.query.path;
        if (!relPath) return res.status(400).send('Path is required');
        const absPath = path.resolve(baseDir, relPath);

        if (!fs.existsSync(absPath)) return res.status(404).send('File not found');
        if (!fs.statSync(absPath).isFile()) return res.status(400).send('Not a file');

        res.type('text/plain').send(fs.readFileSync(absPath, 'utf8'));
    });

    const ignorePath = path.join(baseDir, '.chatignore');

    // Get .chatignore content
    router.get('/chatignore', (req, res) => {
        try {
            if (!fs.existsSync(ignorePath)) {
                return res.type('text/plain').send('');
            }
            const contents = fs.readFileSync(ignorePath, 'utf8');
            res.type('text/plain').send(contents);
        } catch (err) {
            console.error('Failed to read .chatignore:', err);
            res.status(500).type('text/plain').send('');
        }
    });

    router.get('/project-path', (req, res) => {
        res.json({ path: process.cwd() });
    });

// Save .chatignore content
    router.post('/chatignore', express.text(), (req, res) => {
        fs.writeFileSync(ignorePath, req.body, 'utf8');
        res.send({ success: true });
    });

    return router;
}

function walkDir(dir, ignoreRules) {
    const result = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/'); // normalize for Windows

        if (ignoreRules.some(rule => rule(relPath))) continue;


        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            result.push({
                type: 'dir',
                name: item,
                children: walkDir(fullPath, ignoreRules),
            });
        } else {
            result.push({ type: 'file', name: item, path: relPath });
        }
    }

    return result;
}
