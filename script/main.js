const API_BASE =
  location.hostname === 'localhost' ? 'http://localhost:4000' : 'https://donoclothes-server.onrender.com';

document.getElementById('loginForm').onsubmit = async e => {
  e.preventDefault();

  const body = {
    username: e.target.username.value,
    password: e.target.password.value
  };

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (res.ok) {
      alert('Login successful!');
      // window.location.href = 'dashboard.html';
    } else {
      alert('Login failed: ' + (data.error || 'Unknown error'));
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Could not reach server. Is it running?');
  }
};
