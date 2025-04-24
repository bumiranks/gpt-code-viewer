async function loadStructure() {
    const ignoreText = document.getElementById('ignoreEditor').value;

    // Обновляем .chatignore
    await fetch(`/session/${SESSION_UID}/chatignore`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: ignoreText,
    });

    // Загружаем структуру проекта
    const res = await fetch(`/session/${SESSION_UID}/structure`);
    const data = await res.json();
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
}

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
    const output = formatTree(data);
    document.getElementById('tree').textContent = output;
}

async function loadIgnore() {
    const res = await fetch(`/session/${SESSION_UID}/chatignore`);
    const text = await res.ok ? await res.text() : '';
    document.getElementById('ignoreEditor').value = text;
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

window.onload = () => {
    loadIgnore();
    refreshStructure();
};


window.onload = () => {
    loadIgnore();
    loadStructure();
};
