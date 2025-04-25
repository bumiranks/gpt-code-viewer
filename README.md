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

## 🌍 Optional: Enable Public Access via Cloudflared

If you'd like to share your local GPT Code Viewer instance over the internet (e.g., for ChatGPT access), you can use [Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/).

### 🐧 Linux Installation

You can install Cloudflared via the Cloudflare Package Repository (recommended):
[https://pkg.cloudflare.com/](https://pkg.cloudflare.com/)

Or download a specific binary directly:

| Type  | amd64 / x86-64 | x86 (32-bit) | ARM | ARM64 |
|-------|----------------|--------------|-----|--------|
| Binary | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64) | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-386) | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm) | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64) |
| .deb   | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb) | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-386.deb) | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm.deb) | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb) |
| .rpm   | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-x86_64.rpm) | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-386.rpm) | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm.rpm) | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-aarch64.rpm) |

---

### 🍏 macOS Installation

If you use Homebrew, install with:

```bash
brew install cloudflared
```

Alternatively, download the latest release directly:

- [Darwin arm64](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-arm64)
- [Darwin amd64](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-amd64)

### 🪟 Windows Installation (via winget)
```bash
winget install --id Cloudflare.cloudflared
```
Alternatively, download the latest release directly:

| Type  | 32-bit | 64-bit |
|-------|--------------|----------------|
| Executable | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-386.exe) | [Download](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe) |


> Note. Instances of cloudflared do not automatically update on Windows. You will need to perform manual updates.

---
### 🚀 Starting the Tunnel
Once installed, you can start a tunnel like this:

```bash
cloudflared tunnel --url http://localhost:3000
```

This will output a public link like:

```
https://yourproject.trycloudflare.com
```

You can access:

- UI: `https://yourproject.trycloudflare.com/ui`
- Project structure: `https://yourproject.trycloudflare.com/session/<uid>/structure`
- Specific file: `https://yourproject.trycloudflare.com/session/<uid>/file?path=...`

> Note: You do **not** need a Cloudflare account to use this feature. This is ideal for development and experimentation.

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
- It works best with tunneling tools like **cloudflared** for sharing access over the internet (optional future step).

## 📄 License

This project is licensed under the MIT License.  
See the [LICENSE](./LICENSE) file for details.
