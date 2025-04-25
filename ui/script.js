
function renderTree(container, data, prefix = '') {
    container.innerHTML = ''; // очистить

    function walk(nodes, prefix = '') {
        nodes.forEach((item, idx) => {
            const isLast = idx === nodes.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            const newPrefix = prefix + (isLast ? '    ' : '│   ');

            const line = document.createElement('div');
            line.classList.add('tree-line');

            if (item.type === 'file') {
                const span = document.createElement('span');
                span.classList.add('clickable');
                span.textContent = connector + item.name;
                span.onclick = () => loadFile(item.path);
                line.append(prefix, span);
            } else {
                line.textContent = prefix + connector + item.name + '/';
                container.appendChild(line);
                walk(item.children || [], newPrefix);
                return;
            }

            container.appendChild(line);
        });
    }

    walk(data, prefix);
}

async function refreshStructure() {
    const ignoreText = document.getElementById('ignoreEditor').value;

    await fetch(`/session/${SESSION_UID}/chatignore`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: ignoreText,
    });

    const res = await fetch(`/session/${SESSION_UID}/structure`);
    const data = await res.json();

    const treeContainer = document.getElementById('tree');
    renderTree(treeContainer, data);
}

async function loadIgnore() {
    try {
        const res = await fetch(`/session/${SESSION_UID}/chatignore`);
        document.getElementById('ignoreEditor').value = res.ok ? await res.text() : 'not exists';
    } catch (e) {
        console.error('Failed to load .chatignore:', e);
    }
}

async function saveIgnore() {
    const text = document.getElementById('ignoreEditor').value;
    const res = await fetch(`/session/${SESSION_UID}/chatignore`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: text,
    });

    if (res.ok) {
        alert('Saved!');
        refreshStructure(); // Обновить дерево
    } else {
        alert('Failed to save.');
    }
}

async function loadFile(path) {
    const res = await fetch(`/session/${SESSION_UID}/file?path=${encodeURIComponent(path)}`);
    if (!res.ok) {
        document.getElementById('fileContent').textContent = `Failed to load file: ${path}`;
        return;
    }

    const text = await res.text();
    document.getElementById('fileContent').textContent = text;

    // 📎 Копируем ссылку в консоль для вставки в ChatGPT
    const link = `${window.location.origin}/session/${SESSION_UID}/file?path=${encodeURIComponent(path)}`;
    console.log('Link to file:', link);
}

async function loadProjectPath() {
    const res = await fetch(`/session/${SESSION_UID}/project-path`);
    const data = await res.json();
    document.getElementById('projectPath').textContent = data.path;
}

function showPublicUrl() {
    const link = document.getElementById('publicUrl');
    const uiUrl = `${location.origin}/ui`;
    link.href = uiUrl;
    link.textContent = uiUrl;
}

function copyChatLink() {
    const structureUrl = `${location.origin}/session/${SESSION_UID}/structure`;
    navigator.clipboard.writeText(structureUrl)
        .then(() => alert('🔗 Copied structure link to clipboard for ChatGPT!'))
        .catch(() => alert('❌ Failed to copy link.'));
}

window.onload = async () => {
    await showPublicUrl();
    await loadProjectPath();
    await loadIgnore();
    await refreshStructure();
};

