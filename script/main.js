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
    const res = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    const token = data.token;

    // Get user info to determine role
    const userRes = await fetch("http://localhost:4000/auth/me", {
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
        targetPage = "homepageiphone.html";
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
const donationInput = document.getElementById("donationSearchInput");
const clothesInput = document.getElementById("clothesSearchInput");
   loadStorageShortage(token);

fetch("http://localhost:4000/auth/logo", {
      headers: { Authorization: "Bearer " + token },
    })
  .then((res) => {
    if (!res.ok) throw new Error("Logo not found");
    return res.blob();
  })
  .then((blob) => {
    const url = URL.createObjectURL(blob);
    document.getElementById("logoImg").src = url;
  })
  .catch((err) => {
    console.error("Failed to load logo:", err);
  });

donationInput?.addEventListener("input", () => {
  const query = donationInput.value.trim();
  searchDonations(query, token);
});

clothesInput?.addEventListener("input", () => {
  const query = clothesInput.value.trim();
  searchClothes(query, token);
});

    fetch("http://localhost:4000/auth/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((user) => {
        document.getElementById("welcomeMsg").textContent = `Hi, ${user.username}`;
      })
      .catch((err) => console.error("Failed to fetch user info", err));
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    fetch("http://localhost:4000/auth/me/photo", {
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

    fetch("http://localhost:4000/auth/worker/clothes-requests", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(requests => renderClothesRequests(requests, token))
      .catch(err => console.error("Could not load clothes requests:", err));

    fetch("http://localhost:4000/auth/worker/donation-requests", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((requests) => renderDonationRequests(requests, token))
      .catch((err) => console.error("Could not load donation requests:", err));

    // Fetch branch info
    fetch("http://localhost:4000/auth/worker/get-branch", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then((branch)=> renderBranch(branch,token))
      .catch(err => console.error("Could not load branch info:", err));


  }
   if (path.endsWith("clothesreqdetails.html")) {
    runClothesRequestDetailsLogic();
  }
  if (path.endsWith("donationreqdetails.html")) {
    runDonationRequestDetailsLogic();
  }
  if (path.endsWith("storage.html")) {
    runStoragePageLogic();
  }
  if (path.endsWith("additemtostorageform.html")) {
    runAddItemToStorageLogic();
  }

  if (path.endsWith("clothesreqhistory.html")) {
    runClothesReqHistoryPageLogic();
  }
    if (path.endsWith("homepageiphone.html")) {
    runjs();
  }
  if(path.endsWith("donatephone.html")) {
  }
});


async function runjs() {

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log(token);
  const donatebtn=document.getElementById("donatebtn");
      donatebtn.addEventListener("click", async () => {

                    window.location.href = `donatephone.html?token=${encodeURIComponent(token)}`;


    });
}



document.addEventListener("DOMContentLoaded", () => {
  const welcomeMsg = document.getElementById("welcomeMsg");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (welcomeMsg && dropdownMenu && logoutBtn) {
    welcomeMsg.addEventListener("click", () => {
      dropdownMenu.classList.toggle("hidden");
    });

    logoutBtn.addEventListener("click", async () => {
      try {
        const res = await fetch("http://localhost:4000/auth/logout", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        const data = await res.json();
        if (res.ok) {
          alert(data.message || "Logged out successfully.");
        } else {
          alert(data.message || "Logout failed. Please try again.");
        }
      } catch (err) {
        alert("Network error. Logout failed.");
      }
      window.authToken = null;
      window.location.href = "index.html";
    });
  }
});


async function loadStorageShortage(token) {
  try {
    const res = await fetch("http://localhost:4000/auth/worker/storage/shortage", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const shortages = await res.json();
console.log("ss");
    const shortageList = document.querySelector(".shortage ul");
    if (!shortageList) return;
console.log("info");
    shortageList.innerHTML = "";

    if (shortages.length === 0) {
      shortageList.innerHTML = "<li>No recent shortages.</li>";
      return;
    }

    shortages.forEach(item => {
      const li = document.createElement("li");
      const info = item._id;
      li.textContent = `${info.type}, ${info.gender}, size ${info.size}, ${info.color}, ${info.classification} — ${item.count} in stock`;
      shortageList.appendChild(li);
      
    });
  } catch (err) {
    console.error("Error fetching storage shortages:", err);
  }
}


async function runClothesRequestDetailsLogic() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const requestId = params.get("id");

  if (!token) {
    alert("Missing token. Please log in first.");
    window.location.href = "index.html";
    return;
  }
fetch("http://localhost:4000/auth/logo", {
      headers: { Authorization: "Bearer " + token },
    })
  .then((res) => {
    if (!res.ok) throw new Error("Logo not found");
    return res.blob();
  })
  .then((blob) => {
    const url = URL.createObjectURL(blob);
    document.getElementById("logoImg").src = url;
  })
  .catch((err) => {
    console.error("Failed to load logo:", err);
  });
  // Load user info
  try {
    const userRes = await fetch("http://localhost:4000/auth/me", {
      headers: { Authorization: "Bearer " + token },
    });

    if (!userRes.ok) throw new Error("Failed to fetch user info");

    const user = await userRes.json();
    const welcomeEl = document.getElementById("welcomeMsg");
    if (welcomeEl) welcomeEl.textContent = `Hi, ${user.username}`;
  } catch (err) {
    console.error("Error fetching user info:", err);
  }

  // Load user photo
  try {
    const photoRes = await fetch("http://localhost:4000/auth/me/photo", {
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

  let request;
  try {
    const res = await fetch(`http://localhost:4000/auth/worker/clothes-request-details/${requestId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch request");

    request = await res.json();

    const classificationDiv = document.getElementById("classification");
    classificationDiv.innerHTML = `
      <h4>Request Info</h4>
      <p><strong>Recipient:</strong> <span>${request.recipient?.username || 'Unknown'}</span></p>
      <p><strong>Gender:</strong> <span id="req-gender">${request.gender}</span></p>
      <p><strong>Age:</strong> <span id="req-age">${request.age}</span></p>
      <p><strong>Type:</strong> <span id="req-type">${request.type}</span></p>
      <p><strong>Size:</strong> <span id="req-size">${request.size}</span></p>
      <p><strong>Color:</strong> <span id="req-color">${request.color}</span></p>
      <p><strong>Classification:</strong> <span id="req-classification">${request.classification}</span></p>
    `;

    const recipientId = request.recipient?._id;
    if (!recipientId) throw new Error("Recipient not found");
    console.log(recipientId);
    const userRes = await fetch(`http://localhost:4000/auth/worker/user/${recipientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) throw new Error("Failed to fetch recipient details");

    const recipient = await userRes.json();

    document.querySelector(".profile-card").innerHTML = `
      <h3>${recipient.username}</h3>
      <p>${recipient.city || ''}</p>
      <div class="info">
        <p>📞 Phone: ${recipient.phonenumber}</p>
        <p>✉️ Email: ${recipient.email || 'N/A'}</p>
        <p>Age: ${recipient.age}</p>
        <p>Kids: ${recipient.kids}</p>
<p id="normalRequestInfo">Normal clothes request for: ...</p>
        <p>Address: ${recipient.address}</p>
      </div>
<div class="request-history" id="requestHistoryBtn" style="cursor: pointer;">🔄 Requests History</div>
    `;
    console.log(recipientId);
    const recipientphoto=document.getElementById("recipientphoto");
    recipientphoto.style.cssText = "width:50px; height:50px; border-radius:50%; object-fit:cover; margin-right:8px; vertical-align:middle;";
    if(recipientId){
      fetch(`http://localhost:4000/auth/worker/clothes-requests/${recipientId}/photo`, {
        headers: { Authorization: "Bearer " + token }
      })
        .then(res => {
          if (!res.ok) throw new Error("Photo not found");
          return res.blob();
        })
        .then(blob => {
          recipientphoto.src = URL.createObjectURL(blob);
        })
        .catch(err => {
          console.warn("Failed to load donation photo", err);
          recipientphoto.src = "placeholder-image.jpg";
        });
const id=recipientId;
console.log(id);
try {
  const commonRes = await fetch(`http://localhost:4000/auth/worker/clothes-requests/${id}/common`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (commonRes.ok) {
    const common = await commonRes.json();
    console.log(common);
document.getElementById("normalRequestInfo").textContent = 
  `Normal clothes request for:${common.gender}, size ${common.size}`;

  } else {
    document.getElementById("normalRequestInfo").textContent = 
      `Normal clothes request for: not enough data`;
  }
} catch (err) {
  console.warn("Failed to fetch normal request info", err);
}




    }
  } catch (err) {
    console.error("Error loading request:", err);
    alert("Could not load request details");
    return;
  }
  // Event listeners
  const checkBtn = document.getElementById("checkbtn");
  const saveBtn = document.getElementById("savebtn");
  const storageBox = document.getElementById("storage-box");
  let selectedItems = [];

  if (!checkBtn || !saveBtn || !storageBox) {
    console.error("One or more DOM elements not found");
    return;
  }

  console.log("Adding click listener to Check button");

checkBtn.addEventListener("click", async () => {
  console.log("Check Storage button clicked");

  const requestData = {
    gender: request.gender,
    age: request.age,
    type: request.type,
    size: request.size,
    color: request.color,
    classification: request.classification
  };

  try {
    const storageRes = await fetch('http://localhost:4000/auth/worker/storage/search-matching', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(requestData)
    });

    const items = await storageRes.json();
    console.log("Fetched storage items:", items);
    storageBox.innerHTML = "";

    if (!Array.isArray(items)) {
      storageBox.textContent = "Unexpected response format. Please try again later.";
      console.error("Expected an array but got:", items);
      return;
    }

    if (items.length === 0) {
      storageBox.textContent = "No matching items found in storage.";
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'storage-item-card';
      card.style.border = '1px solid #ccc';
      card.style.padding = '10px';
      card.style.margin = '10px 0';


const img = document.createElement('img');
img.style.cssText = "width:100px; height:100px; object-fit:cover; border-radius:10px; margin-bottom:10px;";
img.alt = "Storage Item Photo";

// Load first photo
fetch(`http://localhost:4000/auth/worker/storage/${item._id}/photo/0`, {
  headers: { Authorization: 'Bearer ' + token }
})
  .then(res => {
    if (!res.ok) throw new Error("No photo");
    return res.blob();
  })
  .then(blob => {
    img.src = URL.createObjectURL(blob);
  })
  .catch(() => {
    img.src = "placeholder-image.jpg";
  });

card.appendChild(img);
const details = document.createElement("div");
details.innerHTML = `
        <p><strong>Type:</strong> ${item.type}</p>
        <p><strong>Gender:</strong> ${item.gender}</p>
        <p><strong>Color:</strong> ${item.color}</p>
        <p><strong>Size:</strong> ${item.size}</p>
        <p><strong>Status:</strong> ${item.status}</p>
        <button class="select-btn" data-id="${item._id}">Select</button>
      `;
card.appendChild(details);

      storageBox.appendChild(card);
    });

    document.querySelectorAll(".select-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (selectedItems.includes(id)) {
          selectedItems=selectedItems.filter(itemId => itemId !== id);;
          btn.textContent = "Select";
          btn.classList.remove("selected");
        }else {
          selectedItems.push(id);
          btn.textContent = "Selected";
          btn.classList.add("selected");
        }
        console.log("Currently selected:", selectedItems);
      });
    });

  } catch (err) {
    console.error("Error fetching storage items:", err);
    alert("Failed to load matching items.");
  }
});


  saveBtn.addEventListener("click", async () => {
    if (selectedItems.length === 0) {
      alert("No items selected");
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/auth/worker/storage/mark-donated', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
    },
        body: JSON.stringify({ itemIds: selectedItems,
        clothesRequestId: requestId
    })
    });

      if (res.ok) {
        alert("Items marked as donated!");
        window.location.href = "homepage.html?token=" + encodeURIComponent(token);
        selectedItems = [];
        checkBtn.click(); // re-check storage
      } else {
        alert("Failed to update items");
      }
    } catch (err) {
      console.error("Error saving items:", err);
      alert("An error occurred while saving.");
    }
  });


  const historyBtn = document.getElementById("requestHistoryBtn");
if (historyBtn) {
  historyBtn.addEventListener("click", () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const recipientId = request.recipient?._id;
    if (token && recipientId) {
      window.location.href = `clothesreqhistory.html?token=${token}&recipientId=${recipientId}`;
    } else {
      alert("Missing token or recipient ID.");
    }
  });
}
}




async function runDonationRequestDetailsLogic() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const requestId = params.get("id");
  //const 
  if (!token || !requestId) {
    alert("Missing token or request ID");
    window.location.href = "index.html";
    return;
  }
fetch("http://localhost:4000/auth/logo", {
      headers: { Authorization: "Bearer " + token },
    })
  .then((res) => {
    if (!res.ok) throw new Error("Logo not found");
    return res.blob();
  })
  .then((blob) => {
    const url = URL.createObjectURL(blob);
    document.getElementById("logoImg").src = url;
  })
  .catch((err) => {
    console.error("Failed to load logo:", err);
  });
    try {
    const userRes = await fetch("http://localhost:4000/auth/me", {
      headers: { Authorization: "Bearer " + token },
    });

    if (!userRes.ok) throw new Error("Failed to fetch user info");

    const user = await userRes.json();
    const welcomeEl = document.getElementById("welcomeMsg");
    if (welcomeEl) welcomeEl.textContent = `Hi, ${user.username}`;
  } catch (err) {
    console.error("Error fetching user info:", err);
  }

  // Load user photo
  try {
    const photoRes = await fetch("http://localhost:4000/auth/me/photo", {
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
    const res = await fetch(`http://localhost:4000/auth/worker/donation-request-details/${requestId}`, {
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
  const pickupSection = document.querySelector(".pickup-schedule");
const dates = request.availablePickupDates || [];

pickupSection.innerHTML = `<h3>Request to collect the donation from house on:</h3>`;

if (dates.length > 0) {
  const dateSelect = document.createElement("select");
  dateSelect.id = "pickupDateSelect";
  dates.forEach(d => {
    const option = document.createElement("option");
    const formatted = new Date(d).toLocaleString("en-GB", { dateStyle: "medium" });
    option.value = d;
    option.textContent = formatted;
    dateSelect.appendChild(option);
  });

  pickupSection.appendChild(dateSelect);
  const btn = document.createElement("button");
  btn.textContent = "Confirm Pickup Date";
  btn.onclick = () => alert(`You selected ${dateSelect.value}`);
  pickupSection.appendChild(btn);
} else {
  pickupSection.innerHTML += "<p>No available dates provided.</p>";
}
const photoContainer = document.getElementById("photoGallery");
photoContainer.innerHTML="";
const photoCount = request.photos?.length || 0;
for (let i = 0; i < photoCount; i++) {
  const img = document.createElement("img");

  try {
    const photoRes = await fetch(`http://localhost:4000/auth/worker/donation-requests/${requestId}/photo/${i}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!photoRes.ok) throw new Error("Photo not found");

    const blob = await photoRes.blob();
    img.src = URL.createObjectURL(blob);
  } catch (err) {
    console.warn("Failed to load donation photo", err);
    img.src = "placeholder-image.jpg"; 
  }

  photoContainer.appendChild(img);
}

    const donatorId=request.donator._id;
    if(!donatorId)throw new error("donator not found");
    const donerRes=await fetch(`http://localhost:4000/auth/worker/user/${donatorId}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!donerRes.ok) throw new error("failed to fetch donator details");
    const donator=await donerRes.json();
    document.querySelector(".info2").innerHTML=`
       <div class="donname">${donator.username}</div>
       <div class="contact">
       <div class="contact-row">
       <div class="contact-item">Messanger</div>
       <div class="contact-item">${donator.phonenumber}</div>
       <div class="contact-item">WhatsApp</div>
       </div>
       <div class="email-line">Email: ${donator.email}</div> 
       
       </div>
    `;

const statsRes = await fetch(`http://localhost:4000/auth/worker/donation-request/donator/${donatorId}/stats`, {
  headers: {
    Authorization: "Bearer " + token,
  },
});

if (!statsRes.ok) throw new Error("Failed to fetch donator stats");

const stats = await statsRes.json();

const statsContainer = document.createElement("div");
statsContainer.innerHTML = `<div id="donationcount"><strong>All Donations:</strong> ${stats.acceptedCount}</div>`;
document.getElementById("scounter").appendChild(statsContainer);

if (stats.pendingRequests.length > 0) {
  const listContainer = document.getElementById("statuslist");
  listContainer.innerHTML = `<div><h4>Recent Requests:</h4>
  <div id="onwait">on wait</div></div>`;
  
  const ul = document.createElement("ul");
  stats.pendingRequests.forEach(req => {
    const li = document.createElement("li");
    li.textContent = `- 1 ${req.color}, ${req.gender}, ${req.type}`;
    ul.appendChild(li);
  });

  listContainer.appendChild(ul);
}



  } catch (err) {
    console.error("Error loading donation request details:", err);
    alert("Could not load request details");
  }


  try {
    const resp = await fetch(`http://localhost:4000/auth/worker/donation-request-details/${requestId}`, {
      headers: { Authorization: "Bearer " + token }
    });

    const reqs = await resp.json();
    const donatorId = reqs.donator?._id || reqs.donator;
    const donrphoto=document.getElementById("donerPhoto");

    if (donatorId) {
      fetch(`http://localhost:4000/auth/worker/donation-request/${donatorId}/photo`, {
        headers: { Authorization: "Bearer " + token }
      })
        .then(res => {
          if (!res.ok) throw new Error("Photo not found");
          return res.blob();
        })
        .then(blob => {
          donrphoto.src = URL.createObjectURL(blob);
        })
        .catch(err => {
          console.warn("Failed to load donation photo", err);
          donrphoto.src = "placeholder-image.jpg";
        });
    } else {
      donrphoto.src = "placeholder-image.jpg";
    }
  } catch (err) {
    console.error("Failed to load request details", err);
  }



  //this is for the reject and accept button
  document.querySelector(".accept-btn").addEventListener("click", async () => {
     const selectedPickupDate  = document.getElementById("pickupDateSelect")?.value;
  if (!selectedPickupDate ) {
    alert("Please select a pickup date before accepting.");
    return;
  }
    try {
    const res = await fetch(`http://localhost:4000/auth/worker/donation-request/${requestId}/accept`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedPickupDate :selectedPickupDate  })
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
    const res = await fetch(`http://localhost:4000/auth/worker/donation-request/${requestId}/reject`, {
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




async function renderBranch(branch,token){
  const branchinfo=document.querySelector('#branch-info .contact');
  branchinfo.innerHTML= `
     <div class="branchname">
      <h3>${branch.name}</h3>
      <p>${branch.address}</p>
      </div>
      <div class="contact">
       <div class="contact-row">
        <div class="contact-item"><strong>📍 Location</strong></div>
        <div class="contact-item"><strong>📞 ${branch.phonenumber}</strong></div>
        <div class="contact-item"><strong>💬 WhatsApp</strong></div>
       </div>
        <div class="email-line">📧 ${branch.email}</div>
      </div>
      <div class="quantity">
         <p id="countitems">Quantity in storage: <strong>Loading...</strong></p>
      </div>
    `;

fetch("http://localhost:4000/auth/worker/get-branch-photo", {
  headers: {
    Authorization: "Bearer " + token,
  },
})
  .then((res) => {
    console.log(token);
    console.log(branch);
    console.log("Photo exists:", !!branch?.photo?.data);
    if (!res.ok) throw new Error("No photo");
    return res.blob();
  })
  .then((blob) => {
    const url = URL.createObjectURL(blob);
    document.querySelector("#branchPhoto").src = url;
  })
  .catch((err) => {
    console.warn("No branch photo:", err);
  });
  try {
    const res = await fetch("http://localhost:4000/auth/worker/count-items-in-storage", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch storage count");

    const data = await res.json();

    const countitemsinstorage = document.getElementById("countitems");
    countitemsinstorage.innerHTML = `Quantity in storage: <strong>${data.availableItems}</strong>`;
  } catch (err) {
    console.error("Error counting items in storage:", err.message);
    const countitemsinstorage = document.getElementById("countitems");
    countitemsinstorage.innerHTML = `Quantity in storage: <strong>Error loading</strong>`;
  }
}




async function runStoragePageLogic(){
  const params= new URLSearchParams(window.location.search);
  const token=params.get("token");
  if(!token){
    alert("Missing token. Please log in first.");
    window.location.href="index.html";
    return;
  }
fetch("http://localhost:4000/auth/logo", {
      headers: { Authorization: "Bearer " + token },
    })
  .then((res) => {
    if (!res.ok) throw new Error("Logo not found");
    return res.blob();
  })
  .then((blob) => {
    const url = URL.createObjectURL(blob);
    document.getElementById("logoImg").src = url;
  })
  .catch((err) => {
    console.error("Failed to load logo:", err);
  });
    try {
    const userRes = await fetch("http://localhost:4000/auth/me", {
      headers: { Authorization: "Bearer " + token },
    });

    if (!userRes.ok) throw new Error("Failed to fetch user info");

    const user = await userRes.json();
    const welcomeEl = document.getElementById("welcomeMsg");
    if (welcomeEl) welcomeEl.textContent = `Hi, ${user.username}`;
  } catch (err) {
    console.error("Error fetching user info:", err);
  }

  try {
    const photoRes = await fetch("http://localhost:4000/auth/me/photo", {
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
    const res = await fetch('http://localhost:4000/auth/worker/get-all-storage-items',{
      headers: { Authorization: "Bearer " + token },
    });
    const items = await res.json();

    const container = document.createElement('div');
    container.className = 'storage-list';

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'storage-card';

      card.innerHTML = `
        <div class="photo-gallery">
          ${item.photos.map(photo => `<img src="${photo}" alt="Item photo" class="item-photo"/>`).join('')}
        </div>
    <div class="editable-fields">
      <label>Type: <input type="text" value="${item.type}" disabled class="editable-input" data-field="type" /></label>
      <label>Gender: <input type="text" value="${item.gender}" disabled class="editable-input" data-field="gender" /></label>
      <label>Size: <input type="text" value="${item.size}" disabled class="editable-input" data-field="size" /></label>
      <label>Color: <input type="text" value="${item.color}" disabled class="editable-input" data-field="color" /></label>
      <label>Season: <input type="text" value="${item.classification}" disabled class="editable-input" data-field="classification" /></label>
      <label>Status: <input type="text" value="${item.status}" disabled class="editable-input" data-field="status" /></label>
    </div>
    <div class="actions">
      <button class="edit-btn" data-id="${item._id}">Edit</button>
      <button class="save-btn hidden" data-id="${item._id}">Save</button>
      <button class="delete-btn" data-id="${item._id}">Delete</button>
    </div>
      `;

    card.querySelector('.edit-btn').addEventListener('click', () => {
    card.querySelectorAll('.editable-input').forEach(input => input.disabled = false);
    card.querySelector('.save-btn').classList.remove('hidden');
  });


  card.querySelector('.save-btn').addEventListener('click', async () => {
    const updatedData = {};
    card.querySelectorAll('.editable-input').forEach(input => {
      const field = input.dataset.field;
      updatedData[field] = input.value;
      input.disabled = true;
    });
      
        try {
          const res = await fetch(`http://localhost:4000/auth/worker/update-storage-item/${item._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(updatedData),
          });

          if (!res.ok) throw new Error('Update failed');
          card.querySelector('.save-btn').classList.add('hidden');
          alert('Item updated successfully');          
        } catch (err) {
          console.error(err);
          alert('Failed to update item');
        }
  });

  card.querySelector('.delete-btn').addEventListener('click', async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`http://localhost:4000/auth/worker/delete-storage-item/${item._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token
        }
      });

      if (!res.ok) throw new Error("Delete failed");

      card.remove();
      alert("Item deleted");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete item");
    }
  });
      container.appendChild(card);
    });

    document.body.appendChild(container);


    const addBtn = document.getElementById("addItemBtn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        window.location.href = `additemtostorageform.html?token=${token}`;
      });
    }



  } catch (err) {
    console.error("Failed to fetch storage items:", err);
  }



}




document.querySelector("#checkStorageBtn").addEventListener("click", async () => {
  const token = new URLSearchParams(window.location.search).get("token");
  if (!token) {
    alert("You're not logged in");
    return;
  }
  window.location.href = `storage.html?token=${encodeURIComponent(token)}`;
});







function renderClothesRequests(requests, token) {
  const list = document.querySelector("#clothesRequests .request-list");
  list.innerHTML = "";

  requests.forEach(r => {
    const li = document.createElement("li");
    li.className = "request-item";

    const img = document.createElement("img");
    img.style.cssText = `
      width: 80px; height: 80px; border-radius: 50%;
      object-fit: cover; margin-right: 8px; vertical-align: middle;
    `;

    // Load recipient photo
    if (r.recipient && r.recipient._id) {
      fetch(`http://localhost:4000/auth/worker/clothes-requests/${r.recipient._id}/photo`, {
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


const img = document.createElement("img");
img.style.cssText = "width:80px; height:80px; border-radius:50%; object-fit:cover; margin-right:8px; vertical-align:middle;";
if(r.donator && r.donator._id){
  fetch(`http://localhost:4000/auth/worker/donation-request/${r.donator._id}/photo`, {
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
}else {
  img.src = "placeholder-image.jpg";
}

    const span = document.createElement("span");
    span.innerHTML = `
<strong>${r.donator?.username}</strong><br>
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
    li.addEventListener("click", () => {
      window.location.href = `donationreqdetails.html?token=${encodeURIComponent(token)}&id=${r._id}`;
    });

  });
}


async function searchClothes(query, token) {
  try {
    const res = await fetch(`http://localhost:4000/auth/worker/clothes-requests/search?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    renderClothesRequests(data, token);
  } catch (err) {
    console.error("Clothes search failed:", err);
  }
}

async function searchDonations(query, token) {
  try {
    const res = await fetch(`http://localhost:4000/auth/worker/donation-requests/search?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    renderDonationRequests(data, token);
  } catch (err) {
    console.error("Donation search failed:", err);
  }
}








//// clothesReqDetails.html js
/*document.addEventListener("DOMContentLoaded", async () => {
  const token = new URLSearchParams(window.location.search).get("token");
  console.log(token);
  if (!token) {
    alert("Missing token. Please log in first.");
    window.location.href = "index.html";
    return;
  }

  try {
    const userRes = await fetch("http://localhost:4000/auth/me", {
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

  try {
    const photoRes = await fetch("http://localhost:4000/auth/me/photo", {
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

});*/

async function runAddItemToStorageLogic(){
    const params= new URLSearchParams(window.location.search);
  const token=params.get("token");
  if(!token){
    alert("Missing token. Please log in first.");
    window.location.href="index.html";
    return;
  }
fetch("http://localhost:4000/auth/logo", {
      headers: { Authorization: "Bearer " + token },
    })
  .then((res) => {
    if (!res.ok) throw new Error("Logo not found");
    return res.blob();
  })
  .then((blob) => {
    const url = URL.createObjectURL(blob);
    document.getElementById("logoImg").src = url;
  })
  .catch((err) => {
    console.error("Failed to load logo:", err);
  });
    try {
    const userRes = await fetch("http://localhost:4000/auth/me", {
      headers: { Authorization: "Bearer " + token },
    });

    if (!userRes.ok) throw new Error("Failed to fetch user info");

    const user = await userRes.json();
    const welcomeEl = document.getElementById("welcomeMsg");
    if (welcomeEl) welcomeEl.textContent = `Hi, ${user.username}`;
  } catch (err) {
    console.error("Error fetching user info:", err);
  }

  try {
    const photoRes = await fetch("http://localhost:4000/auth/me/photo", {
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


  const form = document.getElementById("addStorageForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

   const formData = new FormData(form);

    try {
      const res = await fetch("http://localhost:4000/auth/worker/add-item-to-storage", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add item");

      alert("Item added successfully!");
      window.location.href = `storage.html?token=${token}`;
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Failed to add item to storage.");
    }
  });

}



/////donator pages js
async function runDonetorHomePageLogic(){
    const params= new URLSearchParams(window.location.search);
  const token=params.get("token");
  if(!token){
    alert("Missing token. Please log in first.");
    window.location.href="index.html";
    return;
  }

    try {
    const userRes = await fetch("http://localhost:4000/auth/me", {
      headers: { Authorization: "Bearer " + token },
    });

    if (!userRes.ok) throw new Error("Failed to fetch user info");

    const user = await userRes.json();
    const welcomeEl = document.getElementById("welcomeMsg");
    if (welcomeEl) welcomeEl.textContent = `Hi, ${user.username}`;
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
      const imgEl = document.getElementById("userPhoto");
      if (imgEl) imgEl.src = URL.createObjectURL(blob);
    } else {
      console.warn("User photo not found");
    }
  } catch (err) {
    console.warn("Failed to load user photo:", err);
  }
  donerform=document.getElementById("donationForm");
  donerform.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = document.getElementById("donationForm");
  const formData = new FormData(form);

  
const pickupDates = Array.from(document.querySelectorAll('.pickup-date')).map(input => input.value);
pickupDates.forEach(date => formData.append("availablePickupDates[]", date));



  try {
    const res = await fetch("http://localhost:4000/auth/donation-request", {
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
  const alertBell = document.getElementById("alertBell");
  const alertPopup = document.getElementById("alertPopup");
  const alertList = document.getElementById("alertList");
  const unreadMark = document.getElementById("unreadMark");
  alertBell.addEventListener("click", async () => {
      console.log("Bell clicked");

  alertPopup.classList.toggle("hidden");

  if (!alertPopup.classList.contains("hidden")) {
    await fetch(`http://localhost:4000/mark-read/${userId}`, {
      method: "PUT"
    });
    unreadMark.classList.add("hidden");
  }
  console.log(userId)
});
loadAlerts(userId);
setInterval(() => loadAlerts(userId), 10000);

}

async function loadAlerts(userId) {
  if (!userId) return;
  const alertList = document.getElementById("alertList");
  const unreadMark = document.getElementById("unreadMark");
  const res = await fetch(`http://localhost:4000/alert-bell/${userId}`);
  const alerts = await res.json();

  const unread = alerts.filter(a => !a.read);
  unreadMark.classList.toggle("hidden", unread.length === 0);

  alertList.innerHTML = alerts.map(alert =>
    `<li>${alert.message}</li>`).join("");
}


////// pickup date function for donation requests 
function addPickupDate() {
  const container = document.getElementById("pickupDatesContainer");
  const input = document.createElement("input");
  input.type = "date";
  input.name = "pickupDates[]";
  input.classList.add("pickup-date");
  input.required = true;
  container.appendChild(document.createElement("br"));
  container.appendChild(input);
}

async function runClothesReqHistoryPageLogic(){
  const params= new URLSearchParams(window.location.search);
  const token=params.get("token");
  const recipientId = params.get("recipientId");
  console.log(recipientId);
  if(!token){
    alert("Missing token. Please log in first.");
    window.location.href="index.html";
    return;
  }
fetch("http://localhost:4000/auth/logo", {
      headers: { Authorization: "Bearer " + token },
    })
  .then((res) => {
    if (!res.ok) throw new Error("Logo not found");
    return res.blob();
  })
  .then((blob) => {
    const url = URL.createObjectURL(blob);
    document.getElementById("logoImg").src = url;
  })
  .catch((err) => {
    console.error("Failed to load logo:", err);
  });
    try {
    const userRes = await fetch("http://localhost:4000/auth/me", {
      headers: { Authorization: "Bearer " + token },
    });

    if (!userRes.ok) throw new Error("Failed to fetch user info");

    const user = await userRes.json();
    const welcomeEl = document.getElementById("welcomeMsg");
    if (welcomeEl) welcomeEl.textContent = `Hi, ${user.username}`;
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
      const imgEl = document.getElementById("userPhoto");
      if (imgEl) imgEl.src = URL.createObjectURL(blob);
    } else {
      console.warn("User photo not found");
    }
  } catch (err) {
    console.warn("Failed to load user photo:", err);
  }

   try{
  // Fetch user requests
    const reqRes = await fetch(`http://localhost:4000/auth/worker/get-recipient-request-history/${recipientId}`, {
      headers: { Authorization: "Bearer " + token }
    });

    const requests = await reqRes.json();
    console.log("rqq",requests);
    const requestsContainer=document.getElementById("requestsList");
    if (requests.length === 0) {
      requestsContainer.innerHTML = "<p>No requests found.</p>";
      return;
    }

    requestsContainer.innerHTML = "";
    requests.forEach(req => {
      const card = document.createElement("div");
      card.className = "request-card";
      card.style.cssText = "border:1px solid #ccc; padding:15px; margin:10px 0; border-radius:8px;";

      card.innerHTML = `
        <p><strong>Type:</strong> ${req.type}</p>
        <p><strong>Gender:</strong> ${req.gender}</p>
        <p><strong>Size:</strong> ${req.size}</p>
        <p><strong>Color:</strong> ${req.color}</p>
        <p><strong>Status:</strong> ${req.status}</p>
      `;

      requestsContainer.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading request history:", err);
    alert("Failed to load request history.");
  }
}


