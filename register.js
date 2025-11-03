document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("regForm");

  const fields = {
    first_name: { regex: /^[A-Za-z]{2,}$/, message: "First name must contain only letters." },
    last_name: { regex: /^[A-Za-z]{2,}$/, message: "Last name must contain only letters." },
    username: { regex: /^.{4,}$/, message: "Username must be at least 4 characters long!" },
    password: { regex: /^.{6,}$/, message: "Password must be at least 6 characters long." },
    email: { regex: /^[^ ]+@[^ ]+\.[a-z]{2,3}$/, message: "Enter a valid email address!" },
    contact: { regex: /^[0-9]{9,15}$/, message: "Contact must be digits only (9–15 numbers)." }
  };

  function showError(field, message) {
    document.getElementById(`error_${field}`).textContent = message;
  }

  function clearError(field) {
    document.getElementById(`error_${field}`).textContent = "";
  }

  // Real-time validation
  Object.keys(fields).forEach(field => {
    const input = document.getElementById(field);
    input.addEventListener("input", () => {
      const { regex, message } = fields[field];
      if (!regex.test(input.value.trim())) {
        showError(field, message);
      } else {
        clearError(field);
      }
    });
  });

  // Handle form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission

    let valid = true;
    const formData = {};

    // Validate all fields
    Object.keys(fields).forEach(field => {
      const input = document.getElementById(field);
      const { regex, message } = fields[field];
      const value = input.value.trim();

      if (!regex.test(value)) {
        showError(field, message);
        valid = false;
      } else {
        clearError(field);
        formData[field] = value;
      }
    });

    if (!valid) {
      const firstError = document.querySelector(".error-msg:not(:empty)");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Retrieve existing users
    const users = JSON.parse(localStorage.getItem("mayondo_users")) || [];

    // Check for duplicates
    const exists = users.some(
      (user) => user.username === formData.username || user.email === formData.email
    );

    if (exists) {
      alert("⚠️ Username or email already exists! Try another.");
      return;
    }

    // Add unique ID and registration timestamp
    formData.id = Date.now(); // unique user ID
    formData.password = btoa(formData.password); // encode password (for demo only)
    formData.registered_at = new Date().toLocaleString();

    // Save new user
    users.push(formData);
    localStorage.setItem("mayondo_users", JSON.stringify(users));

    alert("✅ Registration successful! Redirecting to login...");
    form.reset();

    // Redirect to login page
    window.location.href = "login.html";
  });
});
