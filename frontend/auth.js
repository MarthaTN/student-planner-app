const BASE_URL = 'http://localhost:3000/api/auth';

// 1. SIGNUP FUNCTION
async function handleSignup(name, email, password) {
    const response = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    if (response.status === 201) {
        alert("Account created! You can now login.");
    } else {
        alert(data.message);
    }
}

// 2. LOGIN FUNCTION
async function handleLogin(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        // Emma's backend returns { token: "..." }
        localStorage.setItem('planner_token', data.token);
        window.location.href = 'dashboard.html';
    } else {
        alert(data.message);
    }
}