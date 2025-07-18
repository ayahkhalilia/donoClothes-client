document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();
  const token = new URLSearchParams(window.location.search).get("token");

  if (path.endsWith("index.html") || path === "/" || path === "/index") {
    // Login logic
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

          const userRes = await fetch("https://donoclothes-server.onrender.com/auth/me", {
            headers: { Authorization: "Bearer " + token }
          });

          if (!userRes.ok) throw new Error("Failed to get user info");
          const user = await userRes.json();

          let targetPage = "";
          switch (user.role) {
            case "worker":
              targetPage = "homepage.html";
              break;
            case "donator":
              targetPage = "donerPages/home.html";
              break;
            case "recipient":
              targetPage = "#";
              break;
            default:
              targetPage = "homepage.html";
          }

          window.location.href = `${targetPage}?token=${encodeURIComponent(token)}`;
        } catch (err) {
          alert("Login error: " + err.message);
          console.error(err);
        }
      });
    }
  }

  if (path.endsWith("homepage.html")) {
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
      .then((res) => res.ok ? res.blob() : Promise.reject())
      .then((blob) => {
        document.getElementById("userPhoto").src = URL.createObjectURL(blob);
      })
      .catch((err) => console.warn("Could not load user photo:", err));

    fetch("https://donoclothes-server.onrender.com/auth/worker/clothes-requests", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(requests => renderClothesRequests(requests, token))
      .catch(err => console.error("Could not load clothes requests:", err));

    fetch("https://donoclothes-server.onrender.com/auth/worker/donation-requests", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((requests) => renderDonationRequests(requests, token))
      .catch((err) => console.error("Could not load donation requests:", err));
  }

  if (path.endsWith("clothesreqdetails.html")) {
    runClothesRequestDetailsLogic(token);
  }

  const donationForm = document.getElementById("donationForm");
  if (donationForm) {
    donationForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!token) {
        alert("You're not logged in");
        return;
      }

      const formData = new FormData(donationForm);

      try {
        const res = await fetch("https://donoclothes-server.onrender.com/auth/donation-request", {
          method: "POST",
          headers: { Authorization: "Bearer " + token },
          body: formData
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Unknown error");
        }

        alert("Donation request submitted!");
        donationForm.reset();
      } catch (err) {
        alert("Error: " + err.message);
        console.error(err);
      }
    });
  }
});

async function runClothesRequestDetailsLogic(token) {
  if (!token) {
    alert("Missing token. Please log in first.");
    window.location.href = "index.html";
    return;
  }

  try {
    const userRes = await fetch("https://donoclothes-server.onrender.com/auth/me", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    if (!userRes.ok) throw new Error("Failed to fetch user info");
    const user = await userRes.json();

    document.getElementById("welcomeMsg").textContent = `Welcome, ${user.username}`;
    document.getElementById("userRole").textContent = `Role: ${user.role}`;

    const photoRes = await fetch("https://donoclothes-server.onrender.com/auth/me/photo", {
      headers: { Authorization: "Bearer " + token },
    });

    if (photoRes.ok) {
      const blob = await photoRes.blob();
      document.getElementById("userPhoto").src = URL.createObjectURL(blob);
    }
  } catch (err) {
    console.error("Error in clothesReqDetails:", err);
  }
}

function renderClothesRequests(requests, token) {
  const list = document.querySelector("#clothesRequests .request-list");
  if (!list) return;
  list.innerHTML = "";

  requests.forEach(r => {
    const li = document.createElement("li");
    li.className = "request-item";

    const img = document.createElement("img");
    img.style.cssText = `
      width: 50px; height: 50px; border-radius: 50%;
      object-fit: cover; margin-right: 8px; vertical-align: middle;
    `;

    if (r.recipient && r.recipient._id) {
      fetch(`https://donoclothes-server.onrender.com/auth/worker/clothes-requests/${r.recipient._id}/photo`, {
        headers: { Authorization: "Bearer " + token }
      })
        .then(res => res.ok ? res.blob() : Promise.reject())
        .then(blob => img.src = URL.createObjectURL(blob))
        .catch(() => img.src = "placeholder-avatar.png");
    } else {
      img.src = "placeholder-avatar.png";
    }

    const span = document.createElement("span");
    span.innerHTML = `
      <strong>${r.recipient?.username || 'Unknown'}</strong><br>
      <small>
        Gender: ${r.gender}, Age: ${r.age}<br>
        Type: ${r.type}, Size: ${r.size}, Color: ${r.color}<br>
        Season: ${r.classification}<br>
        ${r.note ? "Note: " + r.note : ""}
      </small>
    `;

    li.appendChild(img);
    li.appendChild(span);
    li.addEventListener("click", () => {
      window.location.href = `clothesReqDetails.html?token=${encodeURIComponent(token)}&id=${r._id}`;
    });
    list.appendChild(li);
  });
}

function renderDonationRequests(requests, token) {
  const list = document.querySelector("#donationRequests .request-list");
  if (!list) return;

  list.innerHTML = "";

  requests.forEach(r => {
    const li = document.createElement("li");
    li.className = "request-item";

    const imgContainer = document.createElement("div");
    for (let i = 0; i < (r.photoCount || 0); i++) {
      const img = document.createElement("img");
      img.style.cssText = "width:50px; height:50px; margin:2px; object-fit:cover; border-radius:4px;";

      fetch(`https://donoclothes-server.onrender.com/auth/worker/donation-requests/${r._id}/photo/${i}`, {
        headers: { Authorization: "Bearer " + token }
      })
        .then(res => res.ok ? res.blob() : Promise.reject())
        .then(blob => img.src = URL.createObjectURL(blob))
        .catch(() => img.src = "placeholder-image.jpg");

      imgContainer.appendChild(img);
    }

    const span = document.createElement("span");
    span.innerHTML = `
      <strong>${r.donatorName}</strong><br>
      <small>
        Gender: ${r.gender}, Age: ${r.age}<br>
        Type: ${r.type}, Size: ${r.size}, Color: ${r.color}<br>
        Season: ${r.classification}<br>
        ${r.note ? "Note: " + r.note : ""}
      </small>
    `;

    li.appendChild(imgContainer);
    li.appendChild(span);
    list.appendChild(li);
  });
}
