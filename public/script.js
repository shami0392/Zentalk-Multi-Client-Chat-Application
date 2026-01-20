const socket = io();
let myUsername = '';
let currentRecipient = 'broadcast';

// --- Screen Elements ---
const signupScreen = document.getElementById('signup-screen');
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const msgInput = document.getElementById('message-input');

// --- Signup/Login Logic ---
function showSignup() { loginScreen.style.display = 'none'; signupScreen.style.display = 'flex'; }
function showLogin() { signupScreen.style.display = 'none'; loginScreen.style.display = 'flex'; }

function handleSignup() {
    const user = document.getElementById('signup-username').value.trim();
    const pass = document.getElementById('signup-password').value.trim();
    if(!user || !pass) return alert("Fill all details");
    if(localStorage.getItem('user_' + user)) alert("User exists!");
    else { localStorage.setItem('user_' + user, pass); alert("Created! Login now."); showLogin(); }
}

function handleLogin() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    if (localStorage.getItem('user_' + user) === pass) {
        myUsername = user;
        socket.emit('join', myUsername);
        loginScreen.style.display = 'none';
        chatScreen.style.display = 'flex';
        document.getElementById('my-avatar').title = myUsername;
    } else { alert("Invalid Credentials"); }
}

// --- Chat Logic ---
socket.on('userList', (users) => {
    const list = document.getElementById('user-list');
    // Save current active user ID to keep selection
    const activeId = currentRecipient;
    
    list.innerHTML = `<div class="user-item ${activeId === 'broadcast' ? 'active' : ''}" onclick="selectUser('broadcast', 'Broadcast', this)">
        <div class="avatar"></div>
        <div><h4>📢 Broadcast</h4><p style="font-size:12px; color:grey;">Message everyone</p></div>
    </div>`;
    
    for (const [id, name] of Object.entries(users)) {
        if (id !== socket.id) {
            list.innerHTML += `
                <div class="user-item ${activeId === id ? 'active' : ''}" onclick="selectUser('${id}', '${name}', this)">
                    <div class="avatar"></div>
                    <div><h4>${name}</h4><p style="font-size:12px; color:grey;">Online</p></div>
                </div>`;
        }
    }
});

function selectUser(id, name, element) {
    currentRecipient = id;
    document.getElementById('chat-name').innerText = name;
    document.getElementById('chat-status').innerText = id === 'broadcast' ? 'Public Chat' : 'Private Chat';
    document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    
    // Close menus when switching chat
    document.getElementById('dropdown-menu').style.display = 'none';
    document.getElementById('chat-search-input').style.display = 'none';
}

// --- NEW FEATURES LOGIC ---

// 1. Sidebar User Search
function filterUsers() {
    const filter = document.getElementById('user-search-input').value.toLowerCase();
    const users = document.getElementsByClassName('user-item');
    for (let i = 0; i < users.length; i++) {
        const name = users[i].getElementsByTagName('h4')[0];
        if (name) {
            const txtValue = name.textContent || name.innerText;
            users[i].style.display = txtValue.toLowerCase().indexOf(filter) > -1 ? "" : "none";
        }
    }
}

// 2. Chat Header Search (Highlight Messages)
function toggleChatSearch() {
    const box = document.getElementById('chat-search-input');
    box.style.display = box.style.display === 'block' ? 'none' : 'block';
    box.focus();
}

function searchMessages() {
    const filter = document.getElementById('chat-search-input').value.toLowerCase();
    const msgs = document.getElementsByClassName('msg');
    for (let i = 0; i < msgs.length; i++) {
        const txt = msgs[i].textContent || msgs[i].innerText;
        // Simple highlight logic: Hide messages that don't match (Filtering)
        if (filter === "") {
             msgs[i].style.display = ""; // Show all if empty
        } else {
             msgs[i].style.display = txt.toLowerCase().indexOf(filter) > -1 ? "" : "none";
        }
    }
}

// 3. Three Dots Menu & Clear Chat
function toggleMenu() {
    const menu = document.getElementById('dropdown-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function clearChat() {
    if(confirm('Are you sure you want to clear this chat history?')) {
        document.getElementById('messages').innerHTML = '';
        document.getElementById('dropdown-menu').style.display = 'none';
    }
}

// 4. Emoji Picker
function toggleEmojiPicker() {
    const picker = document.getElementById('emoji-picker');
    picker.style.display = picker.style.display === 'flex' ? 'none' : 'flex';
}

function addEmoji(emoji) {
    msgInput.value += emoji;
    document.getElementById('emoji-picker').style.display = 'none'; // Close after picking
    msgInput.focus();
}

// --- Send Message ---
function sendMessage() {
    const msg = msgInput.value;
    const file = document.getElementById('image-input').files[0];

    if (msg.trim() || file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => emitData(msg, e.target.result);
            reader.readAsDataURL(file);
        } else {
            emitData(msg, null);
        }
        msgInput.value = '';
        document.getElementById('image-input').value = '';
    }
}

function emitData(text, img) {
    socket.emit('chatMessage', { recipientId: currentRecipient, message: text, image: img });
}

msgInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

// Receive Message
socket.on('message', (data) => {
    const box = document.getElementById('messages');
    const isMine = data.fromId === socket.id;
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const imgTag = data.image ? `<img src="${data.image}">` : '';
    
    const html = `
        <div class="msg ${isMine ? 'my-msg' : 'chat'}">
            ${!isMine && currentRecipient === 'broadcast' ? `<strong style="font-size:11px; color:orange">${data.user}</strong><br>` : ''}
            ${data.text} ${imgTag}
            <span class="msg-time">${time}</span>
        </div>`;
    
    box.insertAdjacentHTML('beforeend', html);
    box.scrollTop = box.scrollHeight;
});   