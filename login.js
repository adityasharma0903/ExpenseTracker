document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const userTypeSelection = document.getElementById("userTypeSelection");
  const adminForms = document.getElementById("adminForms");
  const dashboard = document.getElementById("dashboard");

  const adminBtn = document.getElementById("adminBtn");
  const adminBackBtn = document.getElementById("adminBackBtn");

  const adminLoginForm = document.getElementById("adminLoginForm");
  const adminLoginUsername = document.getElementById("adminLoginUsername");
  const adminLoginPassword = document.getElementById("adminLoginPassword");
  const adminLoginMessage = document.getElementById("adminLoginMessage");

  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const userInfo = document.getElementById("userInfo");

  // Check if user is already logged in
  checkLoggedInStatus();

  // Event Listeners
  adminBtn.addEventListener("click", () => {
    userTypeSelection.classList.add("hidden");
    adminForms.classList.remove("hidden");
  });

  adminBackBtn.addEventListener("click", () => {
    adminForms.classList.add("hidden");
    userTypeSelection.classList.remove("hidden");
    resetForms();
  });

  // Admin Login Form Submission
  adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = adminLoginUsername.value.trim();
    const password = adminLoginPassword.value.trim();

    if (!username || !password) {
      showMessage(adminLoginMessage, "Please fill in all fields", "error");
      return;
    }

    try {
      const response = await fetch("https://expensetracker-qppb.onrender.com/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        showMessage(adminLoginMessage, "Login successful! Redirecting...", "success");
        setTimeout(() => showDashboard(), 1000);
      } else {
        showMessage(adminLoginMessage, data.message, "error");
      }
    } catch (error) {
      showMessage(adminLoginMessage, "Server error", "error");
    }
  });

  // Logout Button
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    dashboard.classList.add("hidden");
    userTypeSelection.classList.remove("hidden");
    resetForms();
  });

  // Helper Functions
  function showMessage(element, message, type) {
    element.textContent = message;
    element.className = "message " + type;

    // Clear message after 3 seconds
    setTimeout(() => {
      element.textContent = "";
      element.className = "message";
    }, 3000);
  }

  function resetForms() {
    adminLoginForm.reset();
    adminLoginMessage.textContent = "";
  }

  function showDashboard() {
    // Get logged in user
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // For admin users, redirect to dash.html
    if (loggedInUser.type === "admin") {
      window.location.href = "admin-dashboard.html";
      return;
    }

    // This code will only run if there's some other user type
    // Hide all other sections
    userTypeSelection.classList.add("hidden");
    adminForms.classList.add("hidden");

    // Show dashboard
    dashboard.classList.remove("hidden");

    // Update welcome message
    welcomeMessage.textContent = `Welcome, ${loggedInUser.username}!`;

    // Display user info
    userInfo.innerHTML = `
      <p><span>User Type:</span> <span>Administrator</span></p>
      <p><span>Username:</span> <span>${loggedInUser.username}</span></p>
      <p><span>Email:</span> <span>${loggedInUser.email}</span></p>
    `;
  }

  function checkLoggedInStatus() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
      showDashboard();
    }
  }
});