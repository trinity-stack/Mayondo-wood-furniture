document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // prevent reloading

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    let valid = true;

    // Basic empty field check
    if (username === "") {
      document.getElementById("error_username").textContent = "Username is required.";
      valid = false;
    } else {
      document.getElementById("error_username").textContent = "";
    }

    if (password === "") {
      document.getElementById("error_password").textContent = "Password is required.";
      valid = false;
    } else {
      document.getElementById("error_password").textContent = "";
    }

    if (!valid) return;

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem("mayondo_users")) || [];

    // Find matching user
    const user = users.find(
      (u) => u.username === username && atob(u.password) === password
    );

    if (user) {
      // Save session info
      localStorage.setItem("mayondo_logged_in_user", JSON.stringify(user));

      alert(`Welcome back, ${user.first_name}!`);
      window.location.href = "dashboard.html"; // or your homepage after login
    } else {
      alert("Invalid username or password.");
    }
  });
});
