# 📞 Call Drop Prediction & AI Assistant

![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-lightgrey.svg)
![XGBoost](https://img.shields.io/badge/XGBoost-1.5+-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🚀 Overview

**Call Drop Prediction & AI Assistant** is an end-to-end intelligent telecom analytics platform that simulates mobile network calls, predicts potential call drops using Machine Learning, and provides a conversational AI assistant for real-time insights.

The system combines **telecom simulation**, **feature engineering**, **XGBoost-based predictive analytics**, **Retrieval-Augmented Generation (RAG)**, and **Large Language Models (LLMs)** into a unified web application.

---

## ✨ Key Features

### 📡 Telecom Call Simulation

Generate realistic second-by-second telecom telemetry including:

* RSRP (Reference Signal Received Power)
* RSRQ (Reference Signal Received Quality)
* SINR (Signal-to-Interference-plus-Noise Ratio)
* Tower Load
* Device Speed
* Network Band
* Weather Conditions (Rain Impact)

Supports multiple drop scenarios:

* RF Signal Fade
* Handover Oscillation
* Network Failure
* Stable Calls

---

### ⚙️ Feature Engineering

Transforms raw telemetry into meaningful predictive features:

* Min / Max / Mean / Standard Deviation
* Signal Slopes & Trends
* Threshold Violations
* Time Below Signal Limits
* Temporal Features
* Band Encoding
* Mobility Metrics

---

### 🤖 Machine Learning Prediction

Advanced call-drop prediction using:

* XGBoost Classifier
* SMOTE Class Balancing
* RandomizedSearchCV Hyperparameter Tuning
* Early Stopping Optimization

Provides:

* Drop Probability Score
* Binary Drop Prediction
* Performance Analytics

---

### 🧠 Hybrid AI Assistant

A conversational assistant capable of answering both structured and unstructured telecom queries.

#### Structured Queries

Examples:

* Show last 5 calls
* How many dropped calls occurred?
* Average RSRP of dropped calls
* Predict drop probability for Call 123

#### Knowledge-Based Queries

Examples:

* What causes call drops?
* Explain poor signal quality
* How does handover affect calls?

Powered by:

* FAISS Vector Database
* Sentence Transformers
* Groq Llama 4 Scout
* Retrieval-Augmented Generation (RAG)

---

### 🌐 Interactive Web Dashboard

Modern responsive interface featuring:

#### 📱 Smart Dial Pad

* Simulate telecom calls
* Generate new call records instantly

#### 📊 Live Call Logs

* View recent call history
* Monitor drop predictions
* Analyze network metrics

#### 💬 AI Chat Interface

* Ask telecom-related questions
* Query historical call data
* Receive AI-generated explanations

---

## 🛠 Technology Stack

| Layer                  | Technologies                               |
| ---------------------- | ------------------------------------------ |
| Backend                | Python, Flask                              |
| Machine Learning       | XGBoost, Scikit-Learn, SMOTE               |
| Data Processing        | Pandas, NumPy                              |
| AI & RAG               | Groq Llama 4, FAISS, Sentence Transformers |
| Frontend               | HTML5, CSS3, JavaScript                    |
| Storage                | CSV Data Pipeline                          |
| Model Persistence      | Joblib                                     |
| Environment Management | Python Dotenv                              |

---

# 🏗 System Architecture

```text
User
 │
 ▼
Web Dashboard (Flask)
 │
 ├── Call Simulation
 │        │
 │        ▼
 │   Raw Telemetry Data
 │        │
 │        ▼
 │  Feature Engineering
 │        │
 │        ▼
 │  XGBoost Prediction
 │        │
 │        ▼
 │  Engineered Dataset
 │
 └── AI Assistant
          │
          ▼
    Orchestrator
      /      \
     /        \
Query Engine   RAG Engine
     │            │
     ▼            ▼
Structured    FAISS +
Queries       LLM Retrieval
```

---

## 📂 Project Structure

```text
├── Agent/
│   ├── Orchestrator.py
│   ├── Query_Engine.py
│   ├── Rag_Engine.py
│   └── Config.py
│
├── Simulation/
│   ├── Run.py
│   ├── Simulation.py
│   ├── Feature_Engineering.py
│   ├── Prediction.py
│   └── Data/
│
├── Models/
│   └── tuned_xgb.pkl
│
├── VectorStore/
│
├── Configure/
│   └── LLM_Config.py
│
├── Web/
│   ├── Index.html
│   ├── KeyPadPage.html
│   ├── askai.html
│   ├── Styles.css
│   ├── KeyPadPage.js
│   └── askai.js
│
├── Flask.py
├── .env
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

## Prerequisites

* Python 3.8+
* pip
* Virtual Environment (Recommended)

### Clone Repository

```bash
git clone https://github.com/yourusername/call-drop-predictor.git

cd call-drop-predictor
```

### Create Virtual Environment

#### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

#### Linux / macOS

```bash
python -m venv venv

source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

Or manually:

```bash
pip install flask pandas numpy scikit-learn xgboost imbalanced-learn sentence-transformers faiss-cpu groq python-dotenv matplotlib seaborn joblib
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

---

# 🚀 Running the Application

### Generate Initial Data

```bash
python Simulation/Run.py
```

### Start Flask Server

```bash
python Flask.py
```

Application URL:

```text
http://localhost:5000
```

---

# 🧪 Model Training & Evaluation

### Dataset

* 2,000 Simulated Telecom Calls
* Approximately 7% Call Drops

### Training Pipeline

1. Feature Engineering
2. Train/Validation/Test Split (70/15/15)
3. SMOTE Class Balancing
4. Hyperparameter Optimization
5. XGBoost Training
6. Early Stopping

### Model Performance

| Metric    | Score |
| --------- | ----- |
| Accuracy  | 96%   |
| Precision | 78%   |
| Recall    | 67%   |
| ROC-AUC   | 0.966 |

---

# 📡 API Endpoints

| Endpoint          | Method | Description                  |
| ----------------- | ------ | ---------------------------- |
| /                 | GET    | Home Page                    |
| /KeyPadPage.html  | GET    | Call Simulation Dashboard    |
| /askai.html       | GET    | AI Assistant                 |
| /api/call-logs    | GET    | Retrieve Call Logs           |
| /api/make-call    | POST   | Generate New Call            |
| /api/chat         | POST   | Send Message to AI Assistant |
| /api/chat/refresh | POST   | Reload Dataset               |
| /api/chat/status  | GET    | Server Status                |

---

# 🎯 Example Questions

### Data Queries

```text
Show the last 5 calls
```

```text
How many calls dropped today?
```

```text
Average SINR of dropped calls
```

```text
Predict drop probability for Call 123
```

### Telecom Knowledge Queries

```text
Why do call drops happen?
```

```text
Explain RSRP and SINR
```

```text
How does network congestion affect calls?
```

---

# 🔮 Future Enhancements

* Real-time Streaming Data
* Multi-Class Failure Detection
* Interactive Analytics Dashboard
* PostgreSQL Integration
* Kubernetes Deployment
* Multi-Agent AI Architecture
* Voice-Based Telecom Assistant

---

# 📄 License

Distributed under the MIT License.

See the LICENSE file for more information.

---

# 🙏 Acknowledgements

* Groq for LLM APIs
* XGBoost for predictive modeling
* FAISS for vector similarity search
* Sentence Transformers for embeddings
* Flask for backend services

---

### ❤️ Built with AI, Machine Learning, and Telecom Intelligence

### Predict • Prevent • Explain Call Drops
