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

    // Get user info to determine role
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
        targetPage = "#"; // do i need to put the third user?
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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



//////   /worker/donation-requests/:id/photo/:index

/////////////////////////////////////////////////////////////////////////////////////////

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
    runClothesRequestDetailsLogic();
  }
  if (path.endsWith("donationreqdetails.html")) {
    runDonationRequestDetailsLogic();
  }

});

async function runClothesRequestDetailsLogic() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const requestId = params.get("id");
  if (!token) {
    alert("Missing token. Please log in first.");
    window.location.href = "index.html";
    return;
  }

  // Load user info
  try {
    const userRes = await fetch("https://donoclothes-server.onrender.com/auth/me", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    if (!userRes.ok) throw new Error("Failed to fetch user info");


    const user = await userRes.json();
    const welcomeEl = document.getElementById("welcomeMsg");
    if (welcomeEl) welcomeEl.textContent = `Welcome, ${user.username}`;
  } catch (err) {
    console.error("Error fetching user info:", err);
  }

  // Load user photo
  try {
    const photoRes = await fetch("https://donoclothes-server.onrender.com/auth/me/photo", {
      headers: { Authorization: "Bearer " + token },
    });

    if (photoRes.ok) {
      const blob = await photoRes.blob();
      const imgEl = document.getElementById("userPhoto");

      if (imgEl) imgEl.src = URL.createObjectURL(blob);
    } else {
      console.warn("User photo not found");
    }
  } catch (err) {
    console.warn("Failed to load user photo:", err);
  }
  try {
    const res = await fetch(`https://donoclothes-server.onrender.com/auth/worker/clothes-request-details/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch request");

    const request = await res.json();

    const classificationDiv = document.getElementById("classification");
    classificationDiv.innerHTML = `
      <h4>Request Info</h4>
      <p><strong>Recipient:</strong> ${request.recipient?.username || 'Unknown'}</p>
      <p><strong>Gender:</strong> ${request.gender}</p>
      <p><strong>Age:</strong> ${request.age}</p>
      <p><strong>Type:</strong> ${request.type}</p>
      <p><strong>Size:</strong> ${request.size}</p>
      <p><strong>Color:</strong> ${request.color}</p>
      <p><strong>Classification:</strong> ${request.classification}</p>
    `;
    const recipientId = request.recipient?._id;
    if (!recipientId) throw new Error("Recipient not found in request");

    const userRes = await fetch(`https://donoclothes-server.onrender.com/auth/worker/user/${recipientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userRes.ok) throw new Error("Failed to fetch recipient details");

    const recipient = await userRes.json();

    // 4. Update UI (e.g., profile card section) with recipient info
    document.querySelector(".profile-card").innerHTML = `
      <img src="${recipient.photo || 'https://via.placeholder.com/100'}" alt="User" />
      <h3>${recipient.username}</h3>
      <p>${recipient.city || ''}</p>
      <div class="info">
        <p>📞 Phone: ${recipient.phonenumber}</p>
        <p>✉️ Email: ${recipient.email || 'N/A'}</p>
        <p>Age: ${recipient.age}</p>
        <p>kids: ${recipient.kids}</p>
        <p>Normal clothes request for: ${request.gender},age()</p>
        <p>Address: ${recipient.address}</p>
      </div>
      <div class="request-history">🔄 Requests History</div>
    `;////// i need to check "what the normal clothes request for:" is????
  } catch (err) {
    console.error("Error loading request:", err);
    alert("Could not load request details");
  }
}



async function runDonationRequestDetailsLogic() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const requestId = params.get("id");

  if (!token || !requestId) {
    alert("Missing token or request ID");
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch(`https://donoclothes-server.onrender.com/auth/worker/donation-request-details/${requestId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch donation request");

    const request = await res.json();

    const detailsDiv = document.getElementById("requestDetails");
    detailsDiv.innerHTML = `
      <p><strong>Donator:</strong> ${request.donator.username}</p>
      <p><strong>Gender:</strong> ${request.gender}</p>
      <p><strong>Age:</strong> ${request.age}</p>
      <p><strong>Type:</strong> ${request.type}</p>
      <p><strong>Size:</strong> ${request.size}</p>
      <p><strong>Color:</strong> ${request.color}</p>
      <p><strong>Season:</strong> ${request.classification}</p>
    `;
    const donatorId=request.donator._id;
    if(!donatorId)throw new error("donator not found");
    const donerRes=await fetch(`https://donoclothes-server.onrender.com/auth/worker/user/${donatorId}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!donerRes.ok) throw new error("failed to fetch donator details");
    const donator=await donerRes.json();
    document.querySelector(".donator-card").innerHTML=`
       <img src="${donator.photo || ''}" alt="donator"/>
       <div class="info">
       <h3>${donator.username}</h3>
       <p>${donator.phonenumber}</p>
       <p>Email: ${donator.email}</p> 
       </div>
    `;
  } catch (err) {
    console.error("Error loading donation request details:", err);
    alert("Could not load request details");
  }

  //this is for the reject and accept button
  document.querySelector(".accept-btn").addEventListener("click", async () => {
  try {
    const res = await fetch(`https://donoclothes-server.onrender.com/auth/worker/donation-request/${requestId}/accept`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await res.json();
    alert(data.message);
    window.location.href = "homepage.html?token=" + encodeURIComponent(token);
  } catch (err) {
    alert("Error accepting request: " + err.message);
  }
});

document.querySelector(".decline-btn").addEventListener("click", async () => {
  try {
    const res = await fetch(`https://donoclothes-server.onrender.com/auth/worker/donation-request/${requestId}/reject`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await res.json();
    alert(data.message);
    window.location.href = "homepage.html?token=" + encodeURIComponent(token);
  } catch (err) {
    alert("Error rejecting request: " + err.message);
  }
});

}












function renderClothesRequests(requests, token) {
  const list = document.querySelector("#clothesRequests .request-list");
  list.innerHTML = "";

  requests.forEach(r => {
    const li = document.createElement("li");
    li.className = "request-item";

    const img = document.createElement("img");
    img.style.cssText = `
      width: 50px; height: 50px; border-radius: 50%;
      object-fit: cover; margin-right: 8px; vertical-align: middle;
    `;

    // Load recipient photo
    if (r.recipient && r.recipient._id) {
      fetch(`https://donoclothes-server.onrender.com/auth/worker/clothes-requests/${r.recipient._id}/photo`, {
        headers: { Authorization: "Bearer " + token }
      })
        .then(res => {
          if (!res.ok) throw new Error("Photo not found");
          return res.blob();
        })
        .then(blob => {
          img.src = URL.createObjectURL(blob);
        })
        .catch(err => {
          console.warn("Failed to load sender photo", err);
          img.src = "placeholder-avatar.png";
        });
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
    list.appendChild(li);
    li.addEventListener("click",()=>{
        window.location.href=`clothesreqdetails.html?token=${encodeURIComponent(token)}&id=${r._id}`;
    });    
  });
}




////doners page
document.getElementById("donationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = new URLSearchParams(window.location.search).get("token");
  if (!token) {
    alert("You're not logged in");
    return;
  }

  const form = e.target;
  const formData = new FormData(form);

  try {
    const res = await fetch("https://donoclothes-server.onrender.com/auth/donation-request", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      },
      body: formData
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Unknown error");
    }

    const result = await res.json();
    alert("Donation request submitted!");
    form.reset();
  } catch (err) {
    alert("Error: " + err.message);
    console.error(err);
  }
});




//////worker for donation requests
function renderDonationRequests(requests, token) {
  const list = document.querySelector("#donationRequests .request-list");
  if (!list) {
    console.warn("Donation request list not found in HTML");
    return;
  }

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
  .then(res => {
    if (!res.ok) throw new Error("Photo not found");
    return res.blob();
  })
  .then(blob => {
    img.src = URL.createObjectURL(blob);
  })
  .catch(err => {
    console.warn("Failed to load donation photo", err);
    img.src = "placeholder-image.jpg";
  });

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
    li.addEventListener("click", () => {
      window.location.href = `donationreqdetails.html?token=${encodeURIComponent(token)}&id=${r._id}`;
    });

  });
}



//// clothesReqDetails.html js
document.addEventListener("DOMContentLoaded", async () => {
  const token = new URLSearchParams(window.location.search).get("token");
  console.log(token);
  if (!token) {
    alert("Missing token. Please log in first.");
    window.location.href = "index.html";
    return;
  }

  // Load user info (name, role)
  try {
    const userRes = await fetch("https://donoclothes-server.onrender.com/auth/me", {
      headers: { Authorization: "Bearer " + token },
    });
    console.log("User response status:", userRes.status);

    if (!userRes.ok) throw new Error("Failed to fetch user info");

    const user = await userRes.json();
    console.log("user:", user);
    const welcomeEl = document.getElementById("welcomeMsg");
    const roleEl = document.getElementById("userRole");
    if (welcomeEl) welcomeEl.textContent = `Welcome, ${user.username}`;
    if (roleEl) roleEl.textContent = `Role: ${user.role}`;
  } catch (err) {
    console.error("Error fetching user info:", err);
  }

  // Load user profile photo
  try {
    const photoRes = await fetch("https://donoclothes-server.onrender.com/auth/me/photo", {
      headers: { Authorization: "Bearer " + token },
    });
    console.log("Photo status:", photoRes.status);

    if (photoRes.ok) {
      const blob = await photoRes.blob();
      const imgEl = document.getElementById("userPhoto");

      if (imgEl) imgEl.src = URL.createObjectURL(blob);
    } else {
      console.warn("User photo not found");
    }
  } catch (err) {
    console.warn("Failed to load user photo:", err);
  }

  // You can add logic here to load the selected clothes request too
});