document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const userTypeSelection = document.getElementById("userTypeSelection")
    const adminForms = document.getElementById("adminForms")
    const deptForm = document.getElementById("deptForm")
    const dashboard = document.getElementById("dashboard")

    const adminBtn = document.getElementById("adminBtn")
    const deptBtn = document.getElementById("deptBtn")
    const adminBackBtn = document.getElementById("adminBackBtn")
    const deptBackBtn = document.getElementById("deptBackBtn")

    const adminLoginToggle = document.getElementById("adminLoginToggle")
    const adminSignupToggle = document.getElementById("adminSignupToggle")
    const adminLoginForm = document.getElementById("adminLoginForm")
    const adminSignupForm = document.getElementById("adminSignupForm")

    const adminLoginUsername = document.getElementById("adminLoginUsername")
    const adminLoginPassword = document.getElementById("adminLoginPassword")
    const adminLoginMessage = document.getElementById("adminLoginMessage")

    const adminSignupUsername = document.getElementById("adminSignupUsername")
    const adminSignupEmail = document.getElementById("adminSignupEmail")
    const adminSignupPassword = document.getElementById("adminSignupPassword")
    const adminSignupConfirmPassword = document.getElementById("adminSignupConfirmPassword")
    const adminSignupMessage = document.getElementById("adminSignupMessage")

    const deptLoginForm = document.getElementById("deptLoginForm")
    const deptSelect = document.getElementById("deptSelect")
    const deptId = document.getElementById("deptId")
    const deptPassword = document.getElementById("deptPassword")
    const deptLoginMessage = document.getElementById("deptLoginMessage")

    const logoutBtn = document.getElementById("logoutBtn")
    const welcomeMessage = document.getElementById("welcomeMessage")
    const userInfo = document.getElementById("userInfo")

    // Check if user is already logged in
    checkLoggedInStatus()

    // Event Listeners
    adminBtn.addEventListener("click", () => {
        userTypeSelection.classList.add("hidden")
        adminForms.classList.remove("hidden")
    })

    deptBtn.addEventListener("click", () => {
        userTypeSelection.classList.add("hidden")
        deptForm.classList.remove("hidden")
    })

    adminBackBtn.addEventListener("click", () => {
        adminForms.classList.add("hidden")
        userTypeSelection.classList.remove("hidden")
        resetForms()
    })

    deptBackBtn.addEventListener("click", () => {
        deptForm.classList.add("hidden")
        userTypeSelection.classList.remove("hidden")
        resetForms()
    })

    // Toggle between admin login and signup forms
    adminLoginToggle.addEventListener("click", () => {
        adminLoginToggle.classList.add("active")
        adminSignupToggle.classList.remove("active")
        adminLoginForm.classList.remove("hidden")
        adminSignupForm.classList.add("hidden")
    })

    adminSignupToggle.addEventListener("click", () => {
        adminSignupToggle.classList.add("active")
        adminLoginToggle.classList.remove("active")
        adminSignupForm.classList.remove("hidden")
        adminLoginForm.classList.add("hidden")
    })

    // Admin Login Form Submission
    adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const username = adminLoginUsername.value.trim()
        const password = adminLoginPassword.value.trim()

        if (!username || !password) {
            showMessage(adminLoginMessage, "Please fill in all fields", "error")
            return
        }

        // Get admin users from localStorage
        const admins = JSON.parse(localStorage.getItem("admins")) || []

        // Check if admin exists
        const admin = admins.find((admin) => admin.username === username && admin.password === password)

        if (admin) {
            // Set logged in user in localStorage
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify({
                    type: "admin",
                    username: admin.username,
                    email: admin.email,
                }),
            )

            showMessage(adminLoginMessage, "Login successful! Redirecting...", "success")

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                showDashboard()
            }, 1000)
        } else {
            showMessage(adminLoginMessage, "Invalid username or password", "error")
        }
    })

    // Admin Signup Form Submission
    adminSignupForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const username = adminSignupUsername.value.trim()
        const email = adminSignupEmail.value.trim()
        const password = adminSignupPassword.value.trim()
        const confirmPassword = adminSignupConfirmPassword.value.trim()

        if (!username || !email || !password || !confirmPassword) {
            showMessage(adminSignupMessage, "Please fill in all fields", "error")
            return
        }

        if (password !== confirmPassword) {
            showMessage(adminSignupMessage, "Passwords do not match", "error")
            return
        }

        // Get admin users from localStorage
        const admins = JSON.parse(localStorage.getItem("admins")) || []

        // Check if username or email already exists
        if (admins.some((admin) => admin.username === username)) {
            showMessage(adminSignupMessage, "Username already exists", "error")
            return
        }

        if (admins.some((admin) => admin.email === email)) {
            showMessage(adminSignupMessage, "Email already exists", "error")
            return
        }

        // Add new admin to localStorage
        admins.push({
            username,
            email,
            password,
        })

        localStorage.setItem("admins", JSON.stringify(admins))

        showMessage(adminSignupMessage, "Signup successful! You can now login.", "success")

        // Reset form and switch to login
        setTimeout(() => {
            adminSignupForm.reset()
            adminLoginToggle.click()
        }, 1500)
    })

    // Department Login Form Submission
    deptLoginForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const department = deptSelect.value
        const id = deptId.value.trim()
        const password = deptPassword.value.trim()

        if (!department || !id || !password) {
            showMessage(deptLoginMessage, "Please fill in all fields", "error")
            return
        }

        // Get department users from localStorage or create default ones if none exist
        let deptUsers = JSON.parse(localStorage.getItem("deptUsers"))

        // If no department users exist yet, create some default ones for testing
        if (!deptUsers) {
            deptUsers = {
                CSE: [
                    { id: "cse001", password: "password123" },
                    { id: "cse002", password: "password123" },
                ],
                Architecture: [
                    { id: "arch001", password: "password123" },
                    { id: "arch002", password: "password123" },
                ],
                Pharma: [
                    { id: "pharma001", password: "password123" },
                    { id: "pharma002", password: "password123" },
                ],
                "Business School": [
                    { id: "biz001", password: "password123" },
                    { id: "biz002", password: "password123" },
                ],
            }
            localStorage.setItem("deptUsers", JSON.stringify(deptUsers))
        }

        // Check if department user exists
        const deptUserExists =
            deptUsers[department] && deptUsers[department].some((user) => user.id === id && user.password === password)

        if (deptUserExists) {
            // Set logged in user in localStorage
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify({
                    type: "department",
                    department: department,
                    id: id,
                }),
            )

            showMessage(deptLoginMessage, "Login successful! Redirecting...", "success")

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                showDashboard()
            }, 1000)
        } else {
            showMessage(deptLoginMessage, "Invalid department ID or password", "error")
        }
    })

    // Logout Button
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser")
        dashboard.classList.add("hidden")
        userTypeSelection.classList.remove("hidden")
        resetForms()
    })

    // Helper Functions
    function showMessage(element, message, type) {
        element.textContent = message
        element.className = "message " + type

        // Clear message after 3 seconds
        setTimeout(() => {
            element.textContent = ""
            element.className = "message"
        }, 3000)
    }

    function resetForms() {
        adminLoginForm.reset()
        adminSignupForm.reset()
        deptLoginForm.reset()
        adminLoginMessage.textContent = ""
        adminSignupMessage.textContent = ""
        deptLoginMessage.textContent = ""

        // Reset toggle buttons
        adminLoginToggle.classList.add("active")
        adminSignupToggle.classList.remove("active")
        adminLoginForm.classList.remove("hidden")
        adminSignupForm.classList.add("hidden")
    }

    function showDashboard() {
        // Hide all other sections
        userTypeSelection.classList.add("hidden")
        adminForms.classList.add("hidden")
        deptForm.classList.add("hidden")

        // Show dashboard
        dashboard.classList.remove("hidden")

        // Get logged in user
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))

        // Update welcome message
        if (loggedInUser.type === "admin") {
            welcomeMessage.textContent = `Welcome, ${loggedInUser.username}!`

            // Display user info
            userInfo.innerHTML = `
          <p><span>User Type:</span> <span>Administrator</span></p>
          <p><span>Username:</span> <span>${loggedInUser.username}</span></p>
          <p><span>Email:</span> <span>${loggedInUser.email}</span></p>
        `
        } else {
            welcomeMessage.textContent = `Welcome, ${loggedInUser.department} Department!`

            // Display user info
            userInfo.innerHTML = `
          <p><span>User Type:</span> <span>Department Staff</span></p>
          <p><span>Department:</span> <span>${loggedInUser.department}</span></p>
          <p><span>ID:</span> <span>${loggedInUser.id}</span></p>
        `
        }
    }

    function checkLoggedInStatus() {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))

        if (loggedInUser) {
            showDashboard()
        }
    }
})

