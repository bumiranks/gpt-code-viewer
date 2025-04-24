async function loadStructure() {
    const res = await fetch('/session/mock/structure');
    const data = await res.json();
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
}
