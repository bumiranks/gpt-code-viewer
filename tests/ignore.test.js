import fs from 'fs';
import path from 'path';
import { parseIgnore } from '../lib/ignore.js';

const tmpPath = path.join(process.cwd(), '.chatignore');

beforeAll(() => {
    fs.writeFileSync(tmpPath, `
.env
node_modules/
*.log
  `.trim());
});

afterAll(() => {
    fs.unlinkSync(tmpPath);
});

test('parseIgnore returns regex list from .chatignore', () => {
    const rules = parseIgnore(tmpPath);
    expect(rules).toHaveLength(3);
    expect(rules[0].test('.env')).toBe(true);
    expect(rules[1].test('node_modules/')).toBe(true);
    expect(rules[2].test('error.log')).toBe(true);
});
