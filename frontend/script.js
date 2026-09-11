const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatContainer = document.getElementById('chat-container');
const typingIndicator = document.getElementById('typing');
const historyList = document.getElementById('chat-history-list');
const newChatBtn = document.getElementById('new-chat-btn');

// 🔴 อย่าลืมเปลี่ยน URL ตรงนี้เวลาเปิด Colab ใหม่

// ==========================================
// 1. ตั้งค่าระบบ Login / Token / Guest Mode
// ==========================================
let jwtToken = localStorage.getItem('fitbuddy_token');
let currentUsername = localStorage.getItem('fitbuddy_username');
let currentSessionId = localStorage.getItem('fitbuddy_current_session');

// ฟังก์ชันสร้าง Session ใหม่
function createNewSession() {
    currentSessionId = 'session_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('fitbuddy_current_session', currentSessionId);
}

createNewSession();

const displayUser = document.getElementById('display-username');
const logoutBtn = document.getElementById('logout-btn');

// เช็คสถานะ: ถ้าไม่ได้ล็อกอิน (ไม่มี Token) ให้เข้าสู่โหมด Guest
if (!jwtToken || !currentUsername) {
    if (!localStorage.getItem('fitbuddy_guest_id')) {
        // สุ่มชื่อ Guest ใหม่ถ้าเพิ่งเคยเข้าเว็บครั้งแรก
        const randomId = 'guest_' + Math.random().toString(36).substr(2, 5);
        localStorage.setItem('fitbuddy_guest_id', randomId);
    }
    currentUsername = localStorage.getItem('fitbuddy_guest_id');
    
    if (displayUser) displayUser.textContent = 'โหมดผู้เยี่ยมชม';
    if (logoutBtn) {
        logoutBtn.title = 'เข้าสู่ระบบ';
        logoutBtn.innerHTML = '<i class="fa-solid fa-user"></i>'; // เปลี่ยนไอคอนเป็นรูปคน
    }
} else {
    // ถ้าล็อกอินแล้ว ให้โชว์ชื่อผู้ใช้
    if (displayUser) displayUser.textContent = `สวัสดี, ${currentUsername}`;
}

// สร้าง Session เริ่มต้นถ้ายังไม่มี
if (!currentSessionId) {
    createNewSession();
}

// ==========================================
// 2. จัดการปุ่มออกจากระบบ (Logout) / ไปหน้า Login
// ==========================================
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('fitbuddy_token');
        localStorage.removeItem('fitbuddy_username');
        localStorage.removeItem('fitbuddy_current_session');
        window.location.href = 'login.html';
    });
}

// ==========================================
// 3. ฟังก์ชันการทำงานต่างๆ ของแชท (UI)
// ==========================================
function createNewSession() {
    currentSessionId = 'session_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('fitbuddy_current_session', currentSessionId);
}

function scrollToBottom() {
    const chatArea = document.querySelector('.chat-area');
    chatArea.scrollTop = chatArea.scrollHeight;
}

function hideWelcomeUI() {
    const quickPrompts = document.querySelector('.quick-prompts');
    const welcomeCard = document.querySelector('.welcome-card');
    if (quickPrompts) quickPrompts.style.display = 'none';
    if (welcomeCard) welcomeCard.style.display = 'none';
}

function showWelcomeUI() {
    const quickPrompts = document.querySelector('.quick-prompts');
    const welcomeCard = document.querySelector('.welcome-card');
    if (quickPrompts) quickPrompts.style.display = 'flex';
    if (welcomeCard) welcomeCard.style.display = 'flex';
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
    
    const labelDiv = document.createElement('div');
    labelDiv.classList.add('message-label');
    labelDiv.textContent = sender === 'user' ? 'คุณ' : 'FitBuddy AI';

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    // ใช้ marked ในการแปลง Markdown (ตัวหนา, list) ให้เป็น HTML
    contentDiv.innerHTML = sender === 'ai' ? marked.parse(text) : text;

    msgDiv.appendChild(labelDiv);
    msgDiv.appendChild(contentDiv);
    chatContainer.insertBefore(msgDiv, typingIndicator);
    scrollToBottom();
}

// ==========================================
// 4. การเชื่อมต่อ API (โหลดประวัติ / ส่งข้อความ)
// ==========================================
async function loadSidebarSessions() {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/${currentUsername}`, {
            headers: { 'Bypass-Tunnel-Reminder': 'true' }
        });
        if (!response.ok) return;
        const data = await response.json();
        
        historyList.innerHTML = '';
        
        data.sessions.forEach(session => {
            const container = document.createElement('div');
            container.className = `nav-item ${session.session_id === currentSessionId ? 'active' : ''}`;
            
            // ส่วนแสดงชื่อแชท
            const titleSpan = document.createElement('span');
            titleSpan.innerHTML = `<i class="fa-regular fa-message"></i> ${session.title}`;
            titleSpan.onclick = () => switchChat(session.session_id);

            // ปุ่มแก้ไขชื่อแชท
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-chat-btn';
            editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            editBtn.onclick = (e) => {
                e.stopPropagation(); // กันไม่ให้เผลอคลิกไปสลับห้องแชท
                renameChat(session.session_id, session.title);
            };
            
            // ปุ่มลบแชท (ถังขยะ)
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteBtn.title = "ลบแชท";
            deleteBtn.onclick = (e) => {
                e.stopPropagation(); 
                deleteChat(session.session_id);
            };

            container.appendChild(titleSpan);
            container.appendChild(editBtn);
            container.appendChild(deleteBtn); // เพิ่มปุ่มลบเข้าไป
            historyList.appendChild(container);
        });
    } catch (error) {
        console.error('Failed to load sessions:', error);
    }
}

async function renameChat(sessionId, oldTitle) {
    const modal = document.getElementById('rename-modal');
    const input = document.getElementById('rename-input');
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');

    modal.style.display = 'flex';
    input.value = oldTitle;
    input.focus();

    return new Promise((resolve) => {
        const closeModal = () => {
            modal.style.display = 'none';
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
        };

        confirmBtn.onclick = async () => {
            const newTitle = input.value.trim();
            if (newTitle && newTitle !== oldTitle) {
                try {
                    const response = await fetch(`${API_BASE_URL}/rename/${sessionId}`, {
                        method: 'PUT',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Bypass-Tunnel-Reminder': 'true' 
                        },
                        body: JSON.stringify({ new_title: newTitle })
                    });
                    if (response.ok) loadSidebarSessions(); 
                } catch (error) {
                    console.error("Rename failed", error);
                }
            }
            closeModal();
        };

        cancelBtn.onclick = closeModal;
    });
}

// ฟังก์ชันสำหรับสั่งลบแชท
// ตัวแปรเก็บ ID ห้องแชทที่กำลังจะถูกลบ
let sessionIdToDelete = null;

// 1. ฟังก์ชันนี้จะถูกเรียกเมื่อกดปุ่มถังขยะ
function deleteChat(sessionId) {
    sessionIdToDelete = sessionId; // จำไว้ว่ากดลบห้องไหน
    document.getElementById('delete-modal').style.display = 'flex'; // เปิด Modal ยืนยัน
}

// 2. จัดการปุ่ม "ยกเลิก" ใน Modal ลบ
document.getElementById('delete-modal-cancel').onclick = () => {
    document.getElementById('delete-modal').style.display = 'none'; // ปิด Modal
    sessionIdToDelete = null; // เคลียร์ค่าทิ้ง
};

// 3. จัดการปุ่ม "ลบแชท" (ยืนยัน) ใน Modal ลบ
document.getElementById('delete-modal-confirm').onclick = async () => {
    if (!sessionIdToDelete) return;
    
    // ปิด Modal ยืนยันไปก่อน
    document.getElementById('delete-modal').style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}/chat/${sessionIdToDelete}`, {
            method: 'DELETE',
            headers: { 'Bypass-Tunnel-Reminder': 'true' }
        });

        if (response.ok) {
            // ถ้าลบสำเร็จ
            if (sessionIdToDelete === currentSessionId) {
                document.getElementById('new-chat-btn').click(); 
            } else {
                loadSidebarSessions(); 
            }
        } else {
            showCustomAlert("ระบบขัดข้อง ไม่สามารถลบแชทได้");
        }
    } catch (error) {
        showCustomAlert("ไม่สามารถลบแชทได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
    }
    
    sessionIdToDelete = null; // เคลียร์ค่าเสมอหลังทำงานเสร็จ
};

// 4. ฟังก์ชันสำหรับเปิด Modal แจ้งเตือน (แทน alert เดิม)
function showCustomAlert(message) {
    document.getElementById('alert-message').innerText = message;
    document.getElementById('alert-modal').style.display = 'flex';
}

// 5. จัดการปุ่ม "ตกลง" ใน Modal แจ้งเตือน
document.getElementById('alert-modal-close').onclick = () => {
    document.getElementById('alert-modal').style.display = 'none';
};

async function switchChat(newSessionId) {
    currentSessionId = newSessionId;
    localStorage.setItem('fitbuddy_current_session', currentSessionId);
    
    document.querySelectorAll('.message').forEach(e => e.remove());
    hideWelcomeUI();
    
    try {
        const response = await fetch(`${API_BASE_URL}/history/${currentSessionId}`, {
            headers: { 'Bypass-Tunnel-Reminder': 'true' }
        });
        const data = await response.json();
        if (data.history && data.history.length > 0) {
            data.history.forEach(msg => appendMessage(msg.content, msg.role));
        } else {
            showWelcomeUI(); // ถ้าไม่มีประวัติแชท ให้โชว์หน้าต้อนรับ
        }
    } catch (error) {
        console.error('Failed to load chat history:', error);
        showWelcomeUI();
    }
    
    loadSidebarSessions(); 
}

newChatBtn.addEventListener('click', () => {
    createNewSession();
    document.querySelectorAll('.message').forEach(e => e.remove());
    showWelcomeUI(); 
    loadSidebarSessions(); 
});

// ฟังก์ชันหลักตอนกดส่งข้อความ
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    const isFirstMessage = document.querySelectorAll('.message').length === 0;

    hideWelcomeUI();
    appendMessage(message, 'user');
    userInput.value = '';
    typingIndicator.style.display = 'flex';
    scrollToBottom();

    // 🌟 จัดเตรียม Header (ถ้ามี Token ให้แนบไปด้วย ถ้าไม่มีก็ส่งแค่ข้อมูลพื้นฐาน)
    const requestHeaders = {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true'
    };
    if (jwtToken) {
        requestHeaders['Authorization'] = `Bearer ${jwtToken}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/ask`, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({ 
                question: message,
                session_id: currentSessionId,
                user_id: currentUsername 
            })
        });

        const data = await response.json();
        appendMessage(data.answer, 'ai');
        
        if (isFirstMessage) {
            loadSidebarSessions();
        }

    } catch (error) {
        appendMessage('**ขออภัยครับ** ระบบประมวลผลขัดข้อง กรุณาลองใหม่อีกครั้ง', 'ai');
    } finally {
        typingIndicator.style.display = 'none';
        scrollToBottom();
    }
});

// รันตอนเปิดเว็บ
// ไม่ต้องใช้ switchChat เพราะเราไม่อยากโหลดประวัติเก่าขึ้นมาโชว์ตอนเริ่ม
showWelcomeUI();         // โชว์หน้าต้อนรับ
loadSidebarSessions();   // โหลดแค่รายการแชทที่ด้านข้าง