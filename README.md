# 🏋️‍♂️ FitBuddy – Full-Stack AI Personal Trainer & Health Assistant

FitBuddy is an end-to-end full-stack AI web application designed to act as a personal fitness trainer and nutrition advisor. It leverages a **Retrieval-Augmented Generation (RAG)** architecture with **Meta-Llama-3-8B-Instruct**, an asynchronous **FastAPI** backend, and a responsive frontend interface. 

The system delivers accurate, domain-specific guidance on workout routines, exercise execution forms, and dietary advice by retrieving vetted information from a curated knowledge base of over 3,200 documents, mitigating common LLM hallucinations.

---

## 🌟 Key Features

- **Domain-Specific RAG Pipeline**: Powered by LangChain, Hugging Face (`Meta-Llama-3-8B-Instruct`), and FAISS vector similarity search using multilingual embeddings (`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`).
- **Strict Guardrails & Prompt Routing**: Tailored system instructions with knowledge routing logic (context retrieval, general fitness knowledge fallback, and strict boundary filtering for out-of-scope/medical queries).
- **Session & Conversation Memory**: Maintains short-term conversation context to provide coherent multi-turn dialogue while optimizing retrieval query efficiency.
- **Secure Authentication**: User registration and login utilizing **Bcrypt** password hashing and **JSON Web Tokens (JWT)** for stateless, secure session authorization.
- **Chat History & Session Management**: Full CRUD capabilities for conversation threads—including custom renaming and session deletion backed by **MongoDB Atlas**.
- **Real-Time Tunneling**: Seamless integration between local/cloud compute and frontend via **Cloudflare Tunnel**.

---

## 🏗️ System Architecture

```text
[ User Interface ]
  HTML5 / CSS3 / Vanilla JS (SPA-style Chat UI)
         │
         │  HTTP / RESTful API (JSON)
         ▼
[ Cloudflare Tunnel / Reverse Proxy ]
         │
         ▼
[ Backend Service (FastAPI + Uvicorn) ]
   ├── Authentication & Security (JWT, Bcrypt)
   ├── Session & History Manager (MongoDB Atlas)
   └── RAG Pipeline (LangChain)
         ├── Query Retriever (FAISS Vector Store)
         │     └── Multilingual Embeddings
         └── LLM Inference (Meta-Llama-3-8B-Instruct via Hugging Face API)
```

---

## 🛠️ Tech Stack

### **Frontend**
- **HTML5 & CSS3**: Responsive UI styling, chat layout, and sidebar navigation.
- **JavaScript (ES6+)**: Asynchronous Fetch API, DOM manipulation, authentication token handling, and local storage state persistence.

### **Backend & APIs**
- **FastAPI**: High-performance asynchronous REST API framework.
- **Uvicorn**: ASGI web server implementation.
- **Pydantic**: Data validation and request/response schema parsing.
- **PyJWT & Bcrypt**: Token-based authentication and secure credential hashing.

### **AI & Data Engineering**
- **LangChain**: RAG orchestration, document loaders, text splitters, and runnable chain composition.
- **FAISS (CPU)**: Vector database for fast semantic document retrieval.
- **Sentence Transformers**: `paraphrase-multilingual-MiniLM-L12-v2` for cross-language embeddings.
- **Hugging Face Hub**: Hosted model inference endpoint (`Meta-Llama-3-8B-Instruct`).
- **Pandas & PyPDF**: Ingestion, pre-processing, and cleaning of structured (CSV) and unstructured (PDF) documents.

### **Database & Infrastructure**
- **MongoDB Atlas**: Cloud NoSQL database storing user accounts, chat logs, and session metadata.
- **Cloudflare Tunnel**: Public ingress routing for backend APIs.

---

## 📁 Repository Structure

```text
fitbuddy-ai-trainer/
├── backend/
│   ├── FitBuddy_Final.ipynb   # Complete backend notebook (Data processing, RAG, FastAPI)
│   ├── requirements.txt       # Python package dependencies
│   └── .env.example           # Environment variables template
├── frontend/
│   ├── index.html             # Main chat application dashboard
│   ├── login.html             # Authentication (Login / Register) page
│   ├── style.css              # Application styling
│   ├── script.js             # Core client-side application logic
│   └── config.js              # API configuration & endpoint URLs
├── data/
│   └── README.md              # Dataset descriptions, sources, and schema documentation
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- MongoDB Atlas cluster URI
- Hugging Face API Token (with access to Llama 3 models)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables by creating a `.env` file:
   ```env
   HF_TOKEN="your_huggingface_api_token"
   MONGO_URI="your_mongodb_connection_string"
   SECRET_KEY="your_secure_jwt_secret_key"
   ```

4. Run the backend service (or execute cells in `FitBuddy_Final.ipynb`):
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### 2. Frontend Setup

1. Navigate to `frontend/config.js` and update the base API URL to point to your backend:
   ```javascript
   const API_BASE_URL = "http://localhost:8000"; // Or your Cloudflare tunnel domain
   ```

2. Open `frontend/login.html` or `frontend/index.html` directly in any modern web browser or serve it using Live Server / Nginx / Vercel.

---

## 🔒 Security Best Practices
- Never commit `.env` or sensitive database connection strings to version control.
- Passwords are salted and hashed using Bcrypt before persistence in MongoDB.
- API endpoints for user sessions and chat submissions enforce JWT Bearer token validation.

---

## 👨‍💻 Author & Contributions
Developed by **Supachai Sungsirin**,**Nattapat Wisitcharoen**,**Ratchawanlop Naopech**
Computer Science Student | Passionate about Full-Stack Engineering & AI Systems