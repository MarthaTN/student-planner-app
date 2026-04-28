// Add this to the top of your dashboard script
const token = localStorage.getItem('planner_token');

if (!token) {
    window.location.href = 'index.html'; // Redirect if not logged in
}

let currentUser = null;

async function fetchProfile() {
    const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: {
            'Authorization': `Bearer ${token}` // This matches Emma's split(" ")[1] logic
        }
    });
    
    const data = await response.json();
    if (response.ok) {
        currentUser = data.user;
        document.getElementById('user-display').textContent = `Welcome, ${data.user.name}`;
        loadTasks();
        loadFriends();
    } else {
        // Token might be expired
        localStorage.removeItem('planner_token');
        window.location.href = 'index.html';
    }
}

// Task Management
async function loadTasks() {
    const response = await fetch('http://localhost:3000/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await response.json();
    displayTasks(tasks);
}

function displayTasks(tasks) {
    const taskGrid = document.getElementById('task-grid');
    taskGrid.innerHTML = '';

    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class="countdown" id="countdown-${task.id}"></div>
            <p>Priority: ${task.priority}</p>
            <p>Private: ${task.isPrivate ? 'Yes' : 'No'}</p>
            <button class="nudge-btn" onclick="nudgeTask(${task.id})">Nudge</button>
        `;
        taskGrid.appendChild(taskCard);
        updateCountdown(task.id, task.deadline);
    });
}

function updateCountdown(taskId, deadline) {
    const countdownEl = document.getElementById(`countdown-${taskId}`);
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    const distance = deadlineTime - now;

    if (distance < 0) {
        countdownEl.textContent = 'Overdue!';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    countdownEl.textContent = `${days}d ${hours}h ${minutes}m left`;
}

// Add Task
document.querySelector('.add-task-btn').addEventListener('click', () => {
    const title = prompt('Task Title:');
    const description = prompt('Description:');
    const deadline = prompt('Deadline (YYYY-MM-DDTHH:MM):');
    const priority = prompt('Priority (low/medium/high):');
    const isPrivate = confirm('Make this task private?');

    if (title && deadline) {
        createTask({ title, description, deadline, priority, isPrivate });
    }
});

async function createTask(taskData) {
    const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
    });
    if (response.ok) {
        loadTasks();
    }
}

function nudgeTask(taskId) {
    // Simple nudge: alert or something
    alert('Nudge sent! (Implement notification system)');
}

// Friends
async function loadFriends() {
    const response = await fetch('http://localhost:3000/api/friends', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const friends = await response.json();
    displayFriends(friends);
}

function displayFriends(friends) {
    const friendsList = document.getElementById('friends-list');
    friendsList.innerHTML = '';

    if (friends.length === 0) {
        friendsList.innerHTML = '<p>No friends yet. <button onclick="addFriend()">Add Friend</button></p>';
        return;
    }

    friends.forEach(friend => {
        const friendDiv = document.createElement('div');
        friendDiv.className = 'friend-item';
        friendDiv.innerHTML = `
            <h4>${friend.name}</h4>
            <button onclick="viewFriendTasks(${friend.id})">View Progress</button>
        `;
        friendsList.appendChild(friendDiv);
    });

    friendsList.innerHTML += '<button onclick="addFriend()">Add Friend</button>';
}

function addFriend() {
    const friendEmail = prompt('Enter friend\'s email:');
    if (friendEmail) {
        fetch('http://localhost:3000/api/friends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ friendEmail })
        }).then(() => loadFriends());
    }
}

async function viewFriendTasks(friendId) {
    const response = await fetch(`http://localhost:3000/api/friends/${friendId}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await response.json();
    // Display in overlay or modal
    const overlay = document.getElementById('nudge-overlay');
    overlay.innerHTML = `<h3>Friend's Tasks</h3>${tasks.map(t => `<p>${t.title} - ${t.priority}</p>`).join('')}<button onclick="closeOverlay()">Close</button>`;
    overlay.style.display = 'block';
}

function closeOverlay() {
    document.getElementById('nudge-overlay').style.display = 'none';
}

// Initialize
fetchProfile();

// Update countdowns every minute
setInterval(() => {
    if (currentUser) {
        loadTasks();
    }
}, 60000);