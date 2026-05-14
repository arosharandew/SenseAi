// askai.js – with server restart detection

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const backHomeBtn = document.getElementById('backHomeBtn');

// Storage keys
const STORAGE_MESSAGES = 'chat_messages';
const STORAGE_SERVER_START = 'chat_server_start';

async function checkServerRestart() {
    try {
        const response = await fetch('/api/chat/status');
        const data = await response.json();
        const currentStart = data.server_start;
        const storedStart = localStorage.getItem(STORAGE_SERVER_START);

        if (!storedStart || parseFloat(storedStart) !== currentStart) {
            // Server restarted – clear all stored messages
            localStorage.removeItem(STORAGE_MESSAGES);
            localStorage.setItem(STORAGE_SERVER_START, currentStart);
            return true; // restart detected
        }
        return false;
    } catch (err) {
        console.warn('Could not check server status', err);
        return false;
    }
}

function addMessage(text, sender, saveToStorage = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    const content = document.createElement('div');
    content.className = 'content';
    content.innerHTML = text.replace(/\n/g, '<br>');
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    chatMessages.appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (saveToStorage) {
        const messages = JSON.parse(localStorage.getItem(STORAGE_MESSAGES) || '[]');
        messages.push({ text, sender });
        if (messages.length > 100) messages.shift();
        localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(messages));
    }
}

function loadMessages() {
    const saved = localStorage.getItem(STORAGE_MESSAGES);
    if (saved) {
        const messages = JSON.parse(saved);
        messages.forEach(msg => {
            addMessage(msg.text, msg.sender, false);
        });
    } else {
        // Default welcome message after restart or first visit
        addMessage("📞 Hybrid Call Assistant ready.<br>Ask anything about call logs (call ID, last call, drops, etc.)", 'assistant', false);
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;

    // Typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.innerHTML = '<div class="avatar"><i class="fas fa-microchip"></i></div><div class="content"><i class="fas fa-spinner fa-pulse"></i> Thinking...</div>';
    chatMessages.appendChild(typingDiv);
    typingDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        const data = await response.json();
        typingDiv.remove();
        if (response.ok) {
            addMessage(data.response, 'assistant');
        } else {
            addMessage(`⚠️ Error: ${data.response || 'Unknown error'}`, 'assistant');
        }
    } catch (err) {
        typingDiv.remove();
        addMessage('❌ Cannot connect to AI backend.', 'assistant');
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

// Function to refresh agent data (called from KeyPadPage)
async function refreshAgentData() {
    try {
        const response = await fetch('/api/chat/refresh', { method: 'POST' });
        const data = await response.json();
        if (data.status === 'success') console.log('Agent refreshed');
    } catch (err) { console.warn(err); }
}
window.refreshAgentData = refreshAgentData;

// Initialisation
(async () => {
    const restarted = await checkServerRestart();
    if (restarted) {
        // Clear the chat UI and show fresh welcome
        chatMessages.innerHTML = '';
        loadMessages();
    } else {
        loadMessages();
    }
    userInput.focus();
})();

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
backHomeBtn.addEventListener('click', () => {
    window.location.href = '/';
});

// Optional: sync across tabs (keeps consistency)
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_MESSAGES) {
        chatMessages.innerHTML = '';
        loadMessages();
    }
});