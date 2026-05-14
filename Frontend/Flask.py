from flask import Flask, jsonify, request, send_from_directory
import pandas as pd
import subprocess
import os
import sys

# Add parent directory to import Agent modules
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)
sys.path.insert(0, PARENT_DIR)

try:
    from Agent.Orchestrator import Orchestrator
    orchestrator = Orchestrator()
    AGENT_AVAILABLE = True
    print("✅ SignalSense AI Agent loaded.")
except Exception as e:
    print(f"⚠️ Agent load failed: {e}")
    AGENT_AVAILABLE = False
    orchestrator = None

app = Flask(__name__, static_folder='.', static_url_path='')

CSV_PATH = os.path.join(PARENT_DIR, 'Simulation', 'Data', 'Engineered.csv')
RUN_SCRIPT_PATH = os.path.join(PARENT_DIR, 'Simulation', 'Run.py')
RUN_SCRIPT_DIR = os.path.dirname(RUN_SCRIPT_PATH)

def load_call_logs():
    try:
        if not os.path.exists(CSV_PATH):
            return {'error': f'CSV not found'}
        df = pd.read_csv(CSV_PATH)
        required = ['call_id', 'call_duration_sec', 'date', 'time', 'is_drop']
        if missing := [c for c in required if c not in df.columns]:
            return {'error': f'Missing columns: {missing}'}
        df['datetime'] = pd.to_datetime(df['date'] + ' ' + df['time'], errors='coerce')
        df_sorted = df.sort_values('datetime', ascending=False)
        df_sorted = df_sorted.drop(columns=['datetime'])
        df_sorted['is_drop'] = df_sorted['is_drop'].astype(bool)
        return df_sorted.to_dict(orient='records')
    except Exception as e:
        return {'error': str(e)}

@app.route('/')
def index():
    return send_from_directory('.', 'Index.html')

@app.route('/KeyPadPage.html')
def keypad_page():
    return send_from_directory('.', 'KeyPadPage.html')

@app.route('/askai.html')
def askai_page():
    return send_from_directory('.', 'askai.html')

@app.route('/api/call-logs')
def get_call_logs():
    logs = load_call_logs()
    if isinstance(logs, dict) and 'error' in logs:
        return jsonify(logs), 500
    return jsonify(logs)

@app.route('/api/make-call', methods=['POST'])
def make_call():
    data = request.get_json()
    phone_number = data.get('phone_number', '')
    if not os.path.exists(RUN_SCRIPT_PATH):
        return jsonify({'status': 'error', 'message': 'Run.py not found'}), 500
    try:
        result = subprocess.run(
            [sys.executable, RUN_SCRIPT_PATH, phone_number],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            cwd=RUN_SCRIPT_DIR,
            timeout=30
        )
        if result.returncode == 0:
            return jsonify({'status': 'success', 'message': f'Call to {phone_number} initiated.'})
        else:
            return jsonify({'status': 'error', 'message': result.stderr.strip()}), 500
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/chat', methods=['POST'])
def chat():
    if not AGENT_AVAILABLE:
        return jsonify({'response': '⚠️ AI agent not available'}), 500
    data = request.get_json()
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({'response': 'Please say something.'})
    try:
        reply = orchestrator.answer(user_message)
        return jsonify({'response': reply})
    except Exception as e:
        return jsonify({'response': f'❌ Error: {str(e)}'}), 500

@app.route('/api/chat/refresh', methods=['POST'])
def chat_refresh():
    """Force agent to reload CSV data."""
    if not AGENT_AVAILABLE:
        return jsonify({'status': 'error', 'message': 'Agent not available'}), 500
    try:
        orchestrator.reload_data()
        return jsonify({'status': 'success', 'message': 'Agent data reloaded'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/favicon.ico')
def favicon():
    return '', 204

import time

# Store the server start time
SERVER_START_TIME = time.time()

@app.route('/api/chat/status', methods=['GET'])
def chat_status():
    """Return server start timestamp so frontend can detect a restart."""
    return jsonify({'server_start': SERVER_START_TIME})

if __name__ == '__main__':
    app.run(debug=True, port=5000)