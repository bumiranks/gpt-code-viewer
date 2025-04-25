import fs from 'fs';
import { minimatch } from 'minimatch';

const defaultPatterns = [
    'node_modules/**',
    '.git/**',
    '.idea/**',
    '*.log',
    '*.iml',
    '.DS_Store'
];

export function parseIgnore(filePath) {
    let patterns = [...defaultPatterns];

    if (fs.existsSync(filePath)) {
        const userLines = fs.readFileSync(filePath, 'utf8')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'));

        patterns.push(...userLines);
    }

    // Return list of matcher functions
    return patterns.map(pat => (file) => minimatch(file, pat, { dot: true }));
}
