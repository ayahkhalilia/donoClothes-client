async function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
  const params= new URLSearchParams(window.location.search);
  const token=params.get("token");
  if (sidebar.classList.contains("open")) {
    if (!token) return;

        try {
    const userRes = await fetch("http://localhost:4000/auth/me", {
      headers: { Authorization: "Bearer " + token },
    });

    if (!userRes.ok) throw new Error("Failed to fetch user info");

    const user = await userRes.json();
    const username = document.querySelector("#sidebar .profile h3");
    if (username) username.textContent = `${user.username}`;
    const email = document.querySelector("#sidebar .profile p");
    if (email) email.textContent = `${user.email}`;
    const userId=user._id;
    console.log(userId);
  } catch (err) {
    console.error("Error fetching user info:", err);
  }

    try {
    const photoRes = await fetch("http://localhost:4000/auth/me/photo", {
      headers: { Authorization: "Bearer " + token },
    });

    if (photoRes.ok) {
      const blob = await photoRes.blob();
      const imgEl = document.querySelector("#sidebar .profile img");
      if (imgEl) imgEl.src = URL.createObjectURL(blob);
    } else {
      console.warn("User photo not found");
    }
  } catch (err) {
    console.warn("Failed to load user photo:", err);
  }

  }
}

function logout() {
  //sessionStorage.removeItem("token");
  window.location.href = "index.html";
}
