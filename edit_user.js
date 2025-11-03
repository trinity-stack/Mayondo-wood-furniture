// edit_user.js
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  if (!idParam) {
    alert("No user specified.");
    window.location.href = "dashboard.html";
    return;
  }
  const id = Number(idParam);

  let users = JSON.parse(localStorage.getItem("mayondo_users")) || [];
  const userIndex = users.findIndex(u => Number(u.id) === id);
  if (userIndex === -1) {
    alert("User not found.");
    window.location.href = "dashboard.html";
    return;
  }

  const user = users[userIndex];

  // Populate form
  document.getElementById("first_name").value = user.first_name || "";
  document.getElementById("last_name").value = user.last_name || "";
  document.getElementById("username").value = user.username || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("contact").value = user.contact || "";

  const form = document.getElementById("editForm");
  const errorDiv = document.getElementById("error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorDiv.style.display = "none";
    errorDiv.textContent = "";

    // Get new values
    const first_name = document.getElementById("first_name").value.trim();
    const last_name  = document.getElementById("last_name").value.trim();
    const username   = document.getElementById("username").value.trim();
    const email      = document.getElementById("email").value.trim();
    const contact    = document.getElementById("contact").value.trim();
    const password   = document.getElementById("password").value;

    // Basic validation
    if (!first_name || !last_name || !username || !email || !contact) {
      errorDiv.textContent = "Please fill in all required fields.";
      errorDiv.style.display = "block";
      return;
    }

    if (!/^[^ ]+@[^ ]+\.[a-z]{2,}$/i.test(email)) {
      errorDiv.textContent = "Invalid email format.";
      errorDiv.style.display = "block";
      return;
    }

    // Check duplicate username/email among other users
    const duplicate = users.some((u, idx) => (idx !== userIndex) && (u.username === username || u.email === email));
    if (duplicate) {
      errorDiv.textContent = "Another user with that username or email already exists.";
      errorDiv.style.display = "block";
      return;
    }

    // Update user object
    users[userIndex].first_name = first_name;
    users[userIndex].last_name = last_name;
    users[userIndex].username = username;
    users[userIndex].email = email;
    users[userIndex].contact = contact;

    if (password && password.trim() !== "") {
      // encode new password (demo)
      users[userIndex].password = btoa(password);
    }
    users[userIndex].updated_at = new Date().toLocaleString();

    // Save back
    localStorage.setItem("mayondo_users", JSON.stringify(users));
    alert("User updated successfully!");
    window.location.href = "dashboard.html";
  });
});
