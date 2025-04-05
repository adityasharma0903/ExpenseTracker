document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const userTypeSelection = document.getElementById("userTypeSelection");
  const adminForms = document.getElementById("adminForms");
  const deptForm = document.getElementById("deptForm");
  const dashboard = document.getElementById("dashboard");

  const adminBtn = document.getElementById("adminBtn");
  const deptBtn = document.getElementById("deptBtn");
  const adminBackBtn = document.getElementById("adminBackBtn");
  const deptBackBtn = document.getElementById("deptBackBtn");

  const adminLoginToggle = document.getElementById("adminLoginToggle");
  const adminSignupToggle = document.getElementById("adminSignupToggle");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const adminSignupForm = document.getElementById("adminSignupForm");

  const adminLoginUsername = document.getElementById("adminLoginUsername");
  const adminLoginPassword = document.getElementById("adminLoginPassword");
  const adminLoginMessage = document.getElementById("adminLoginMessage");

  const adminSignupUsername = document.getElementById("adminSignupUsername");
  const adminSignupEmail = document.getElementById("adminSignupEmail");
  const adminSignupPassword = document.getElementById("adminSignupPassword");
  const adminSignupConfirmPassword = document.getElementById("adminSignupConfirmPassword");
  const adminSignupMessage = document.getElementById("adminSignupMessage");

  const deptLoginForm = document.getElementById("deptLoginForm");
  const deptSelect = document.getElementById("deptSelect");
  const deptId = document.getElementById("deptId");
  const deptPassword = document.getElementById("deptPassword");
  const deptLoginMessage = document.getElementById("deptLoginMessage");

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

  deptBtn.addEventListener("click", () => {
    userTypeSelection.classList.add("hidden");
    deptForm.classList.remove("hidden");
  });

  adminBackBtn.addEventListener("click", () => {
    adminForms.classList.add("hidden");
    userTypeSelection.classList.remove("hidden");
    resetForms();
  });

  deptBackBtn.addEventListener("click", () => {
    deptForm.classList.add("hidden");
    userTypeSelection.classList.remove("hidden");
    resetForms();
  });

  // Toggle between admin login and signup forms
  adminLoginToggle.addEventListener("click", () => {
    adminLoginToggle.classList.add("active");
    adminSignupToggle.classList.remove("active");
    adminLoginForm.classList.remove("hidden");
    adminSignupForm.classList.add("hidden");
  });

  adminSignupToggle.addEventListener("click", () => {
    adminSignupToggle.classList.add("active");
    adminLoginToggle.classList.remove("active");
    adminSignupForm.classList.remove("hidden");
    adminLoginForm.classList.add("hidden");
  });

  // Admin Login Form Submission
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
    const response = await fetch("http://localhost:5000/api/admin/login", {
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
  // Admin Signup Form Submission
  // Admin Signup Form Submission
adminSignupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = adminSignupUsername.value.trim();
  const email = adminSignupEmail.value.trim();
  const password = adminSignupPassword.value.trim();
  const confirmPassword = adminSignupConfirmPassword.value.trim();

  if (!username || !email || !password || !confirmPassword) {
    showMessage(adminSignupMessage, "Please fill in all fields", "error");
    return;
  }

  if (password !== confirmPassword) {
    showMessage(adminSignupMessage, "Passwords do not match", "error");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/admin/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();

    if (data.success) {
      showMessage(adminSignupMessage, "Signup successful! You can now login.", "success");
      setTimeout(() => {
        adminSignupForm.reset();
        adminLoginToggle.click();
      }, 1500);
    } else {
      showMessage(adminSignupMessage, data.message, "error");
    }
  } catch (error) {
    showMessage(adminSignupMessage, "Server error", "error");
  }
});

  // Department Login Form Submission
  // Department Login Form Submission
deptLoginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const department = deptSelect.value;
  const id = deptId.value.trim();
  const password = deptPassword.value.trim();

  if (!department || !id || !password) {
    showMessage(deptLoginMessage, "Please fill in all fields", "error");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/department/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department, id, password }),
    });
    const data = await response.json();

    if (data.success) {
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      showMessage(deptLoginMessage, "Login successful! Redirecting...", "success");
      setTimeout(() => showDashboard(), 1000);
    } else {
      showMessage(deptLoginMessage, data.message, "error");
    }
  } catch (error) {
    showMessage(deptLoginMessage, "Server error", "error");
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
    adminSignupForm.reset();
    deptLoginForm.reset();
    adminLoginMessage.textContent = "";
    adminSignupMessage.textContent = "";
    deptLoginMessage.textContent = "";

    // Reset toggle buttons
    adminLoginToggle.classList.add("active");
    adminSignupToggle.classList.remove("active");
    adminLoginForm.classList.remove("hidden");
    adminSignupForm.classList.add("hidden");
  }

  function showDashboard() {
    // Get logged in user
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // If department user, redirect to department dashboard
    if (loggedInUser.type === "department") {
      window.location.href = "department-dashboard.html";
      return;
    }

    // For admin users, redirect to dash.html
    if (loggedInUser.type === "admin") {
      window.location.href = "dash.html";
      return;
    }

    // This code will only run if there's some other user type
    // Hide all other sections
    userTypeSelection.classList.add("hidden");
    adminForms.classList.add("hidden");
    deptForm.classList.add("hidden");

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