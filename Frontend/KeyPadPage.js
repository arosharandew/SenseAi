// KeyPadPage.js - Real data only, no fallback mocks

const API_BASE = '';
const LOGS_ENDPOINT = '/api/call-logs';
const CALL_ENDPOINT = '/api/make-call';

let dialedNumber = '';

const dialerDisplay = document.getElementById('dialerNumber');
const keypadGrid = document.getElementById('keypadGrid');
const callBtn = document.getElementById('callBtn');
const clearBtn = document.getElementById('clearBtn');
const logsContainer = document.getElementById('logsContainer');
const refreshBtn = document.getElementById('refreshLogsBtn');
const statusMsg = document.getElementById('statusMsg');

function updateDialerDisplay() {
    dialerDisplay.innerHTML = dialedNumber || '📞  Ready';
}

function appendDigit(digit) {
    if (dialedNumber.length < 15) {
        dialedNumber += digit;
        updateDialerDisplay();
    }
}

function clearDialer() {
    dialedNumber = '';
    updateDialerDisplay();
    statusMsg.innerText = '';
}

async function loadCallLogs() {
    logsContainer.innerHTML = '<div class="loading-logs"><i class="fas fa-spinner fa-pulse"></i> Loading call logs from AI core...</div>';
    try {
        const response = await fetch(LOGS_ENDPOINT);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        const logs = await response.json();
        if (logs.error) throw new Error(logs.error);
        renderLogs(logs);
        statusMsg.innerText = '✅ Live data connected';
    } catch (error) {
        console.error('Log fetch error:', error);
        logsContainer.innerHTML = `<div class="loading-logs" style="color:#ff8888;"><i class="fas fa-exclamation-triangle"></i> ${error.message}<br><small>Make sure Flask is running and CSV exists at ../Simulation/Data/Engineered.csv</small></div>`;
        statusMsg.innerText = '❌ Failed to load logs - backend error';
    }
}

function renderLogs(logs) {
    if (!logs.length) {
        logsContainer.innerHTML = '<div class="loading-logs">📭 No call records found in Engineered.csv</div>';
        return;
    }
    logsContainer.innerHTML = '';
    logs.forEach(log => {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        const isDrop = log.is_drop === true;
        const dropText = isDrop ? '⚠️ Drop detected' : '✅ Stable call';
        const dropClass = isDrop ? 'drop-badge' : 'drop-badge no-drop';
        entry.innerHTML = `
            <div class="log-details">
                <span class="log-id"><i class="fas fa-id-card"></i> ${log.call_id || 'N/A'}</span>
                <span><i class="far fa-clock"></i> ${log.date || ''} ${log.time || ''}</span>
                <span><i class="fas fa-hourglass-half"></i> ${log.call_duration_sec || 0} sec</span>
                <span class="${dropClass}"><i class="fas ${isDrop ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i> ${dropText}</span>
            </div>
        `;
        logsContainer.appendChild(entry);
    });
}

async function makeCall() {
    if (!dialedNumber) {
        statusMsg.innerText = '❌ Please enter a number to dial.';
        return;
    }
    statusMsg.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Connecting AI core...';
    callBtn.disabled = true;
    try {
        const response = await fetch(CALL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: dialedNumber })
        });
        const data = await response.json();
        if (response.ok) {
            statusMsg.innerHTML = `✅ ${data.message}`;
            clearDialer();
            fetch('/api/chat/refresh', { method: 'POST' }).catch(e => console.warn('Agent refresh failed', e));
            setTimeout(() => loadCallLogs(), 800);
        } else {
            statusMsg.innerHTML = `❌ Error: ${data.message}`;
        }
    } catch (err) {
        console.error(err);
        statusMsg.innerHTML = '❌ Cannot reach backend. Is Flask running? (python Flask.py)';
    } finally {
        callBtn.disabled = false;
    }
}

function buildKeypad() {
    const keys = ['1','2','3','4','5','6','7','8','9','*','0','#'];
    keypadGrid.innerHTML = '';
    keys.forEach(key => {
        const keyDiv = document.createElement('div');
        keyDiv.className = 'key';
        if (key === '*' || key === '#') keyDiv.classList.add('special');
        keyDiv.innerText = key;
        keyDiv.addEventListener('click', () => {
            if (key === '*') clearDialer();
            else if (key === '#') makeCall();
            else appendDigit(key);
        });
        keypadGrid.appendChild(keyDiv);
    });
}

// Navigation
document.getElementById('homeBtn')?.addEventListener('click', () => window.location.href = 'Index.html');
document.getElementById('askAiBtn')?.addEventListener('click', () => window.location.href = 'askai.html');
clearBtn.addEventListener('click', clearDialer);
callBtn.addEventListener('click', makeCall);
refreshBtn?.addEventListener('click', loadCallLogs);

buildKeypad();
loadCallLogs();