// dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = JSON.parse(localStorage.getItem("mayondo_logged_in_user"));
  if (!loggedInUser) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("loggedUser").textContent = loggedInUser.username;

  const tableBody = document.querySelector("#userTable tbody");
  const paginationDiv = document.getElementById("pagination");
  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById("searchBtn");
  const exportBtn = document.getElementById("exportBtn");

  // Fetch users and normalize ids
  let users = JSON.parse(localStorage.getItem("mayondo_users")) || [];
  let needsSave = false;

  users = users.map(u => {
    if (!u.id) { u.id = Date.now() + Math.floor(Math.random() * 1000); needsSave = true; }
    return u;
  });

  if (needsSave) localStorage.setItem("mayondo_users", JSON.stringify(users));

  let currentPage = 1;
  const limit = 10;

  function renderTable(dataSlice, startIndex) {
    tableBody.innerHTML = "";

    if (dataSlice.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='7'>No users found.</td></tr>";
      return;
    }

    dataSlice.forEach((user, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td data-label="ID">${user.id}</td>
        <td data-label="First Name">${user.first_name}</td>
        <td data-label="Last Name">${user.last_name}</td>
        <td data-label="Username">${user.username}</td>
        <td data-label="Email">${user.email}</td>
        <td data-label="Contact">${user.contact}</td>
        <td data-label="Actions">
          <a class="action-btn edit-btn" href="edit_user.html?id=${encodeURIComponent(user.id)}">Edit</a>
          <button class="action-btn delete-btn" data-id="${user.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  function renderPagination(filtered) {
    paginationDiv.innerHTML = "";
    const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("a");
      btn.textContent = i;
      btn.className = i === currentPage ? "active" : "";
      btn.href = "#";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = i;
        displayUsers(searchInput.value.trim());
      });
      paginationDiv.appendChild(btn);
    }
  }

  function displayUsers(searchTerm = "") {
    let filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const start = (currentPage - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    renderTable(paginated, start);
    renderPagination(filtered);
  }

  searchBtn.addEventListener("click", () => {
    currentPage = 1;
    displayUsers(searchInput.value.trim());
  });

  // Delete user by id
  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = Number(e.target.dataset.id);
      const user = users.find(u => u.id === id);
      if (!user) return;
      if (confirm(`Are you sure you want to delete ${user.username}?`)) {
        users = users.filter(u => u.id !== id);
        localStorage.setItem("mayondo_users", JSON.stringify(users));
        displayUsers(searchInput.value.trim());
      }
    }
  });

  // Export CSV
  exportBtn.addEventListener("click", () => {
    if (users.length === 0) {
      alert("No users to export.");
      return;
    }

    const headers = ["ID", "First Name", "Last Name", "Username", "Email", "Contact"];
    const rows = users.map(u => [u.id, u.first_name, u.last_name, u.username, u.email, u.contact]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(r => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "mayondo_users.csv";
    link.click();
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("mayondo_logged_in_user");
    alert("You have been logged out.");
    window.location.href = "login.html";
  });

  // Initial load
  displayUsers();
});
