#!/usr/bin/env node

import { startServer } from '../lib/server.js';
import { spawn } from 'child_process';
import readline from 'readline';
import clipboard from 'clipboardy';

const PORT = process.env.PORT || 3000;

(async () => {
    const uid = await startServer(PORT);

    console.log(`🧠 Local UI:    http://localhost:${PORT}/ui`);
    console.log(`🧠 Local API:   http://localhost:${PORT}/session/${uid}/structure`);

    // 🌐 Start cloudflared
    const tunnel = spawn('cloudflared', ['tunnel', '--url', `http://localhost:${PORT}`]);

    // 🔎 Use stdout and stderr (for Windows & Linux)
    const rlOut = readline.createInterface({ input: tunnel.stdout });
    const rlErr = readline.createInterface({ input: tunnel.stderr });

    const handleLine = (line) => {
        if (line.includes('trycloudflare.com')) {
            const urlMatch = line.match(/https:\/\/[^\s]+\.trycloudflare\.com/);
            if (urlMatch) {
                const publicURL = urlMatch[0];

                try {
                    clipboard.writeSync(`${publicURL}/ui`);
                    console.log('📋 Copied public URL to clipboard!');
                } catch (err) {
                    console.warn('⚠️ Failed to copy to clipboard:', err.message);
                }

                console.log('\n🌍 Public tunnel established!');
                console.log(`🔗 UI:    ${publicURL}/ui`);
                console.log(`📂 Tree:  ${publicURL}/session/${uid}/structure`);
                console.log(`📄 File:  ${publicURL}/session/${uid}/file?path=README.md`);
            }
        }
    };


    rlOut.on('line', handleLine);
    rlErr.on('line', handleLine);

    tunnel.on('error', (err) => {
        console.error('❌ cloudflared launch failed:', err.message);
    });

    tunnel.on('close', (code) => {
        console.log(`💤 cloudflared closed with code ${code}`);
    });
})();
