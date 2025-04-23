import fs from 'fs';

export function parseIgnore(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const lines = fs.readFileSync(filePath, 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));

    return lines.map(pattern =>
        new RegExp(pattern.replace('.', '\\.').replace('*', '.*'))
    );
}
