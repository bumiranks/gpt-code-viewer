
function formatTree(data, prefix = '') {
    return data.map((item, idx) => {
        const isLast = idx === data.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const newPrefix = prefix + (isLast ? '    ' : '│   ');

        if (item.type === 'dir') {
            return `${prefix}${connector}${item.name}/\n${formatTree(item.children || [], newPrefix)}`;
        } else {
            return `${prefix}${connector}${item.name}`;
        }
    }).join('\n');
}

async function refreshStructure() {
    const ignoreText = document.getElementById('ignoreEditor').value;

    // Сохраняем .chatignore
    await fetch(`/session/${SESSION_UID}/chatignore`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: ignoreText,
    });

    // Загружаем структуру
    const res = await fetch(`/session/${SESSION_UID}/structure`);
    const data = await res.json();
    document.getElementById('tree').textContent = formatTree(data);
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

window.onload = async () => {
    await loadIgnore();       // загружаем .chatignore
    await refreshStructure(); // потом дерево
};
