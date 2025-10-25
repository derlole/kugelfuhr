
const socket = io();

// Nachricht vom Server empfangen
function showAndAutoHide(id, text, ms) {
    const el = document.getElementById(id);
    el.querySelector('p').innerText = text;
    el.style.display = 'block';
    el.classList.remove('fade-out');

    // Fortschrittsbalken starten: über style.animationDuration
    el.style.setProperty('--progress-time', ms + 'ms');
    el.style.setProperty('position', 'fixed'); // wichtig, damit ::after positioniert

    // direkt CSS-Animation zuweisen
    el.style.setProperty('animation', 'toast-pop-in 240ms cubic-bezier(.2,.8,.2,1)');
    el.style.setProperty('--progress-anim', 'toast-progress ' + ms + 'ms linear forwards');
    el.querySelector('p').style.marginBottom = '6px'; // bisschen Platz für Balken
    el.style.setProperty('overflow', 'hidden');

    // Balken tatsächlich animieren
    el.classList.add('with-progress');
    el.style.setProperty('--progress-anim', 'toast-progress ' + ms + 'ms linear forwards');

    el.style.setProperty('--progress-anim', 'toast-progress ' + ms + 'ms linear forwards');
    el.style.setProperty('--progress-time', ms + 'ms');
    el.style.setProperty('--progress', 'running');

    el.style.setProperty('--progress-anim', 'toast-progress ' + ms + 'ms linear forwards');
    el.style.setProperty('--progress-time', ms + 'ms');
    el.style.setProperty('--progress', 'running');

    // über Inline-Style Animation auf ::after setzen
    el.style.setProperty('--progress-anim', 'toast-progress ' + ms + 'ms linear forwards');
    el.style.setProperty('--progress-time', ms + 'ms');

    el.style.setProperty('--progress', 'running');
    el.style.setProperty('--progress-anim', 'toast-progress ' + ms + 'ms linear forwards');
    el.style.setProperty('--progress-time', ms + 'ms');

    el.style.setProperty('--progress', 'running');
    el.style.setProperty('--progress-anim', 'toast-progress ' + ms + 'ms linear forwards');
    el.style.setProperty('--progress-time', ms + 'ms');

    el.style.setProperty('--progress', 'running');
    el.style.setProperty('--progress-anim', 'toast-progress ' + ms + 'ms linear forwards');
    el.style.setProperty('--progress-time', ms + 'ms');

    el.style.setProperty('--progress', 'running');

    // Auto ausblenden nach Zeit
    setTimeout(() => {
        el.classList.add('fade-out');
        setTimeout(() => {
        el.style.display = 'none';
        el.classList.remove('fade-out', 'with-progress');
        el.querySelector('p').innerText = '';
        el.style.removeProperty('--progress-anim');
        }, 200);
    }, ms);
}

socket.on('backend_error', (msg) => {
    //if(!msg.gameIndex) return 
    if (Number(msg.gameIndex) !== Number(gameInFront.gameId)) return;
    console.error('[SOCKETIO] Backend-Fehler:', msg);
    showAndAutoHide('error-div', `Error-Message: ${msg.message}, Error-code: ${msg.code}, Thrown by backend`, 7000);
});
socket.on('backend_online', () => {
    showAndAutoHide('message-div', 'Backend online again', 2000);
});
socket.on('backend_offline', () => {
    showAndAutoHide('warning-div', 'Backend is offline', 2000);
});
socket.on('backend_warning', (msg) => {
    //if(!msg.gameIndex) return 
    if (Number(msg.gameIndex) !== Number(gameInFront.gameId)) return;
    console.warn('[SOCKETIO] Backend-Warnung:', msg);
    showAndAutoHide('warning-div', `Warnung: ${msg.message}, Code: ${msg.code}, (Backend)`, 5000);
});
socket.on('backend_info', (msg) => {
    //if(!msg.gameIndex) return 
    if (Number(msg.gameIndex) !== Number(gameInFront.gameId)) return;
    showAndAutoHide('message-div', `Info: ${msg.message}, Code: ${msg.code}`, 1500);
    console.log('[SOCKETIO] Backend-Info:', msg);
});