# GPT Code Viewer

**GPT Code Viewer** is a lightweight, local web server that lets you securely expose your project's code structure and files to ChatGPT in a browser session — without any API keys or authentication.

## ✨ Features

- 🧠 Designed for use with **ChatGPT web interface**  
- 🛡️ Secure one-time URL access (`/session/<uid>`)
- 📁 Exposes only **non-sensitive** files (supports `.chatignore`)
- 🧩 Easily embeddable as a **npm dev dependency**
- ⚡ Quick setup — `npm run chat-gpt` and you're ready!

## 🚀 Installation

1. Install as a dev dependency:

```bash
npm install --save-dev gpt-code-viewer
```

2. Add script to `package.json`:

```json
"scripts": {
  "chat-gpt": "node ./bin/chatgpt.js"
}
```

3. Create a `.chatignore` file in your project root (see below)

4. Run the server:

```bash
npm run chat-gpt
```

---

## 🔗 Example usage

Once started, the terminal will print a URL:

```
🚀 GPT Code Viewer is running at http://localhost:3000/session/abc123/
```

You can send this URL (e.g., `http://localhost:3000/session/abc123/structure`) to ChatGPT to analyze your project structure or specific files.

---

## 📂 Available endpoints

- `GET /session/:uid/structure` — returns folder and file tree in JSON
- `GET /session/:uid/file?path=src/index.js` — returns content of a specific file

---

## 🔒 Security & Privacy

- Only files outside `.chatignore` are visible
- URLs are protected with one-time UUID keys
- Sessions are temporary (auto-expire can be added)

---

## 🛠 Example `.chatignore`

```
node_modules/
.env
*.log
.idea/
*.iml
*.key
*.pem
```

---

## 📌 Notes

- This tool is intended for **local use only**.
- It works best with tunneling tools like **ngrok**, **localtunnel**, or **cloudflared** for sharing access over the internet (optional future step).
