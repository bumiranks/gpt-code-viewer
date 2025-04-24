async function loadStructure() {
    const res = await fetch('/session/mock/structure');
    const data = await res.json();
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
}
async function loadIgnore() {
    const res = await fetch('/session/mock/chatignore');
    const text = await res.ok ? await res.text() : '';
    document.getElementById('ignoreEditor').value = text;
}


async function saveIgnore() {
    const text = document.getElementById('ignoreEditor').value;
    const res = await fetch('/session/mock/chatignore', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: text,
    });

    if (res.ok) {
        alert('Saved!');
        loadStructure(); // Обновить структуру файлов
    } else {
        alert('Failed to save.');
    }
}

window.onload = () => {
    loadIgnore();
    loadStructure();
};
