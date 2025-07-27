function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");

  if (sidebar.classList.contains("open")) {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:4000/auth/me", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.name) {
          document.querySelector("#sidebar .profile img").src = data.image_url || "https://via.placeholder.com/90";
          document.querySelector("#sidebar .profile h3").textContent = data.name;
          document.querySelector("#sidebar .profile p").textContent = data.email;
        }
      });
  }
}

function logout() {
  sessionStorage.removeItem("token");
  window.location.href = "index.html";
}
