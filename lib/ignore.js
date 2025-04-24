import fs from 'fs';

const defaultPatterns = [
    'node_modules/',
    '.git/',
    '.idea/',
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

    return patterns.map(pattern =>
        new RegExp(pattern.replace('.', '\\.').replace('*', '.*'))
    );
}
