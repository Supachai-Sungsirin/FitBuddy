# 🏋️‍♂️ FitBuddy – ผู้ช่วยเทรนเนอร์ส่วนตัวและที่ปรึกษาด้านสุขภาพด้วย AI

FitBuddy คือเว็บแอปพลิเคชัน Full-Stack ที่พัฒนาขึ้นเพื่อทำหน้าที่เป็นเทรนเนอร์ส่วนตัวและที่ปรึกษาด้านโภชนาการด้วย AI โดยใช้สถาปัตยกรรม **Retrieval-Augmented Generation (RAG)** ร่วมกับโมเดล **Meta-Llama-3-8B-Instruct** ทำงานร่วมกับ backend แบบ asynchronous ด้วย **FastAPI** และ frontend ที่ตอบสนองได้ดีบนทุกอุปกรณ์

ระบบให้คำแนะนำที่แม่นยำและเจาะจงในโดเมนด้านการออกกำลังกาย ท่าทางการเล่นที่ถูกต้อง และคำแนะนำด้านโภชนาการ โดยดึงข้อมูลจากฐานความรู้ที่ผ่านการตรวจสอบแล้วกว่า 3,200 เอกสาร เพื่อลดปัญหาการตอบผิด (hallucination) ที่พบได้ทั่วไปใน LLM

> โปรเจกต์นี้จัดทำขึ้นเพื่อส่งงานในรายวิชา (Academic Project) โดยมีวัตถุประสงค์เพื่อการศึกษาและสาธิตแนวคิดด้าน AI/Full-Stack Development

---

## 🌟 ฟีเจอร์เด่น

- **RAG Pipeline เฉพาะทาง**: ขับเคลื่อนด้วย LangChain, Hugging Face (`Meta-Llama-3-8B-Instruct`) และ FAISS สำหรับค้นหาความคล้ายคลึงของเวกเตอร์ (vector similarity search) โดยใช้ multilingual embeddings (`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`)
- **Guardrails และการจัดเส้นทางคำถาม (Prompt Routing)**: มีชุดคำสั่งระบบ (system instructions) พร้อมตรรกะจัดเส้นทางความรู้ ทั้งการดึงข้อมูลจาก context, การใช้ความรู้ทั่วไปสำรอง (fallback) และการกรองคำถามที่อยู่นอกขอบเขตหรือเกี่ยวข้องกับการแพทย์
- **หน่วยความจำการสนทนา (Session Memory)**: จดจำบริบทการสนทนาระยะสั้น เพื่อให้การตอบโต้หลายรอบ (multi-turn) มีความต่อเนื่อง พร้อมทั้งช่วยลดภาระในการดึงข้อมูลซ้ำซ้อน
- **ระบบยืนยันตัวตนที่ปลอดภัย**: การสมัครสมาชิกและเข้าสู่ระบบด้วยการเข้ารหัสผ่านแบบ **Bcrypt** และ **JSON Web Tokens (JWT)** สำหรับการยืนยันสิทธิ์แบบ stateless
- **การจัดการประวัติการสนทนา**: รองรับ CRUD ครบวงจรสำหรับเธรดการสนทนา ทั้งเปลี่ยนชื่อและลบเซสชัน โดยจัดเก็บผ่าน **MongoDB Atlas**
- **การเชื่อมต่อแบบเรียลไทม์**: เชื่อมต่อระหว่างเครื่องคอมพิวเตอร์/คลาวด์กับ frontend ผ่าน **Cloudflare Tunnel**

---

## 🏗️ สถาปัตยกรรมระบบ

```
[ ส่วนติดต่อผู้ใช้ ]
  HTML5 / CSS3 / Vanilla JS (Chat UI แบบ SPA)
         │
         │  HTTP / RESTful API (JSON)
         ▼
[ Cloudflare Tunnel / Reverse Proxy ]
         │
         ▼
[ Backend Service (FastAPI + Uvicorn) ]
   ├── ระบบยืนยันตัวตนและความปลอดภัย (JWT, Bcrypt)
   ├── ตัวจัดการเซสชันและประวัติ (MongoDB Atlas)
   └── RAG Pipeline (LangChain)
         ├── ตัวดึงข้อมูล (FAISS Vector Store)
         │     └── Multilingual Embeddings
         └── การประมวลผลโมเดล (Meta-Llama-3-8B-Instruct ผ่าน Hugging Face API)
```

---

## 🛠️ เทคโนโลยีที่ใช้

### **Frontend**

- **HTML5 & CSS3**: ออกแบบ UI แบบ responsive, chat layout และ sidebar navigation
- **JavaScript (ES6+)**: การเรียกข้อมูลแบบ asynchronous ด้วย Fetch API, การจัดการ DOM, การจัดการ token สำหรับยืนยันตัวตน และการเก็บสถานะด้วย local storage

### **Backend & API**

- **FastAPI**: เฟรมเวิร์ก REST API แบบ asynchronous ประสิทธิภาพสูง
- **Uvicorn**: ASGI web server
- **Pydantic**: ตรวจสอบข้อมูลและจัดการ schema ของ request/response
- **PyJWT & Bcrypt**: การยืนยันตัวตนด้วย token และการเข้ารหัสข้อมูลรับรอง

### **AI & Data Engineering**

- **LangChain**: จัดการ RAG pipeline, document loaders, text splitters และการประกอบ chain
- **FAISS (CPU)**: ฐานข้อมูลเวกเตอร์สำหรับค้นหาเอกสารเชิงความหมายอย่างรวดเร็ว
- **Sentence Transformers**: ใช้โมเดล `paraphrase-multilingual-MiniLM-L12-v2` สำหรับ embeddings ข้ามภาษา
- **Hugging Face Hub**: จุดเชื่อมต่อสำหรับเรียกใช้โมเดล (`Meta-Llama-3-8B-Instruct`)
- **Pandas & PyPDF**: นำเข้า ประมวลผลเบื้องต้น และทำความสะอาดข้อมูลทั้งแบบมีโครงสร้าง (CSV) และไม่มีโครงสร้าง (PDF)

### **ฐานข้อมูลและโครงสร้างพื้นฐาน**

- **MongoDB Atlas**: ฐานข้อมูล NoSQL บนคลาวด์ สำหรับเก็บบัญชีผู้ใช้ ประวัติแชท และข้อมูลเซสชัน
- **Cloudflare Tunnel**: เส้นทางเข้าถึง backend API จากภายนอก

---

## 📁 โครงสร้างโปรเจกต์

```
FitBuddy/
├── Dataset/
│   └── ...                    # ชุดข้อมูลดิบและเอกสารสำหรับสร้างฐานความรู้ (RAG)
├── backend/
│   ├── FitBuddy_Final.ipynb   # Notebook หลักของ backend (การประมวลผลข้อมูล, RAG, FastAPI)
│   ├── requirements.txt       # รายการไลบรารีที่ต้องติดตั้ง
│   └── .env.example           # ตัวอย่างไฟล์ environment variables
├── frontend/
│   ├── index.html             # หน้าหลักของแอปพลิเคชันแชท
│   ├── login.html             # หน้ายืนยันตัวตน (เข้าสู่ระบบ / สมัครสมาชิก)
│   ├── style.css              # การจัดสไตล์ของแอปพลิเคชัน
│   ├── script.js              # โลจิกหลักฝั่ง client
│   └── config.js              # การตั้งค่า API และ endpoint URL
├── .gitignore
└── README.md
```


---

## 🚀 การเริ่มต้นใช้งาน

### ข้อกำหนดเบื้องต้น

- Python 3.10 ขึ้นไป
- MongoDB Atlas cluster URI
- Hugging Face API Token (ที่มีสิทธิ์เข้าถึงโมเดลตระกูล Llama 3)

### 1. การตั้งค่า Backend

1. เข้าไปยังโฟลเดอร์ backend:

```
cd backend
```

2. ติดตั้ง dependencies:

```
pip install -r requirements.txt
```

3. สร้างไฟล์ `.env` และกำหนดค่าตัวแปรแวดล้อม:

```
HF_TOKEN="your_huggingface_api_token"
MONGO_URI="your_mongodb_connection_string"
SECRET_KEY="your_secure_jwt_secret_key"
```

4. รัน backend service (หรือรันเซลล์ต่าง ๆ ใน `FitBuddy_Final.ipynb`):

```
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. การตั้งค่า Frontend

1. เปิดไฟล์ `frontend/config.js` และแก้ไข base API URL ให้ชี้ไปยัง backend ของคุณ:

```
const API_BASE_URL = "http://localhost:8000"; // หรือโดเมน Cloudflare Tunnel ของคุณ
```

2. เปิดไฟล์ `frontend/login.html` หรือ `frontend/index.html` ได้โดยตรงผ่านเบราว์เซอร์ หรือรันผ่าน Live Server / Nginx / Vercel

---

## 🔒 แนวปฏิบัติด้านความปลอดภัย

- ห้าม commit ไฟล์ `.env` หรือ connection string ของฐานข้อมูลที่เป็นความลับขึ้น version control โดยเด็ดขาด
- รหัสผ่านทั้งหมดถูกเข้ารหัสด้วย Bcrypt (พร้อม salt) ก่อนบันทึกลง MongoDB
- ทุก endpoint ที่เกี่ยวข้องกับเซสชันผู้ใช้และการส่งข้อความแชท ต้องผ่านการตรวจสอบ JWT Bearer token

---

## ⚠️ ข้อจำกัดของโปรเจกต์

โปรเจกต์นี้เป็นผลงานส่งในรายวิชา จึงมีข้อจำกัดบางประการที่ควรทราบก่อนนำไปใช้งานจริง:

- โค้ดฝั่ง backend ปัจจุบันรวมอยู่ใน Jupyter Notebook (`FitBuddy_Final.ipynb`) เพื่อความสะดวกในการสาธิตและทดลอง ยังไม่ได้แยกเป็นโมดูล Python สำหรับ production
- ยังไม่มีชุดทดสอบอัตโนมัติ (unit test / integration test)
- เหมาะสำหรับใช้เพื่อการศึกษาและสาธิตแนวคิด ไม่ได้ออกแบบมาเพื่อรองรับผู้ใช้งานจำนวนมากในระดับ production

---

## 👨‍💻 ผู้พัฒนา

โปรเจกต์นี้พัฒนาโดย:

- **Supachai Sungsirin**
- **Nattapat Wisitcharoen**
- **Ratchawanlop Naopech**

นักศึกษาสาขาวิทยาการคอมพิวเตอร์

จัดทำขึ้นเพื่อส่งงานในรายวิชา CSI ภาคการศึกษา 2/2568
