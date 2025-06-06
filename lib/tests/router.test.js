import request from 'supertest';
import express from 'express';
import fs from 'fs';
import { createSessionRouter } from '../lib/router.js';
import { test, expect, beforeAll, afterAll } from '@jest/globals';

const app = express();
app.use('/session/test', createSessionRouter());

beforeAll(() => {
    fs.writeFileSync('testfile.txt', 'Hello, world!');
});

afterAll(() => {
    fs.unlinkSync('testfile.txt');
});

test('GET /structure returns file tree', async () => {
    const res = await request(app).get('/session/test/structure');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

test('GET /file returns file content', async () => {
    const res = await request(app).get('/session/test/file?path=testfile.txt');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Hello');
});
