document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.endsWith("index.html") || path === "/" || path === "/index") {
    // Login page logic
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const username = formData.get("username");
        const password = formData.get("password");

        try {
          const res = await fetch("https://donoclothes-server.onrender.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });

          if (!res.ok) throw new Error("Login failed");

          const data = await res.json();
          const token = data.token;

          window.location.href = `homepage.html?token=${encodeURIComponent(token)}`;
        } catch (err) {
          alert("Login error: " + err.message);
          console.error(err);
        }
      });
    }
  }

  if (path.endsWith("homepage.html")) {
    // Homepage logic
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      alert("Missing token. Please log in first.");
      return;
    }

    fetch("https://donoclothes-server.onrender.com/auth/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((user) => {
        document.getElementById("welcomeMsg").textContent = `Welcome, ${user.username}`;
        document.getElementById("userRole").textContent = `Role: ${user.role}`;
      })
      .catch((err) => console.error("Failed to fetch user info", err));

    fetch("https://donoclothes-server.onrender.com/auth/me/photo", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Photo not found");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        document.getElementById("userPhoto").src = url;
      })
      .catch((err) => console.warn("Could not load user photo:", err));
  }
});