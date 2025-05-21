// import { Chart } from "@/components/ui/chart"
// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  showLoader() // 👈 loader starts

  // Initialize club data if not exists
  initializeClubData()

  // Setup event listeners
  setupEventListeners()

  // Check if user is logged in
  await checkLoginStatus() // agar ye async hai, warna hata do await

  // Display current date
  displayCurrentDate()

  // Mutation observer for modal
  const observer = new MutationObserver(() => {
    const modal = document.getElementById("event-detail-modal")
    if (modal && modal.style.display === "block") {
      activateEventModalTabs()
    }
  })

  observer.observe(document.body, { attributes: true, childList: true, subtree: true })

  hideLoader() // 👈 loader ends
})

let eventId = null
// Display current date

function showLoader() {
  document.getElementById("global-loader").classList.remove("hidden")
}

function hideLoader() {
  document.getElementById("global-loader").classList.add("hidden")
}
function displayCurrentDate() {
  const dateElement = document.getElementById("current-date")
  if (dateElement) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    const today = new Date()
    dateElement.textContent = today.toLocaleDateString("en-US", options)
  }
}

// Add this function to initialize the total budget in localStorage if it doesn't exist
function initializeBudgetData() {
  if (!localStorage.getItem("totalBudget")) {
    localStorage.setItem("totalBudget", "0")
  }

  if (!localStorage.getItem("expenses")) {
    localStorage.setItem("expenses", JSON.stringify([]))
  }
}

// Club data initialization
function initializeClubData() {
  if (!localStorage.getItem("clubs")) {
    const clubs = [
      { id: "osc", name: "Open Source Chandigarh", password: "osc123" },
      { id: "ieee", name: "IEEE", password: "ieee123" },
      { id: "explore", name: "Explore Labs", password: "explore123" },
      { id: "iei", name: "IE(I) CSE Student Chapter", password: "iei123" },
      { id: "coe", name: "Center of Excellence", password: "coe123" },
      { id: "ceed", name: "CEED", password: "ceed123" },
      { id: "bnb", name: "BIts N Bytes", password: "bnb123" },
      { id: "acm", name: "ACM Chapter", password: "acm123" },
      { id: "gfg", name: "GFG CUIET", password: "gfg123" },
      { id: "gdg", name: "GDG CUIET", password: "gdg123" },
      { id: "cb", name: "Coding Blocks", password: "cb123" },
      { id: "cn", name: "Coding Ninjas", password: "cn123" },
      { id: "dgit", name: "DGIT Squad", password: "dgit123" },
      { id: "dice", name: "DICE", password: "dice123" },
      { id: "hc", name: "Happiness Center", password: "hc123" },
      { id: "nss", name: "NSS", password: "nss123" },
    ]

    localStorage.setItem("clubs", JSON.stringify(clubs))
  }

  // Initialize teams data if not exists
  if (!localStorage.getItem("teams")) {
    localStorage.setItem("teams", JSON.stringify([]))
  }

  // Initialize expenses data if not exists
  if (!localStorage.getItem("expenses")) {
    localStorage.setItem("expenses", JSON.stringify([]))
  }

  // Initialize budget data
  initializeBudgetData()
}

// Setup all event listeners
function setupEventListeners() {
  // Login form submission
  document.getElementById("login-btn").addEventListener("click", handleLogin)

  // Sidebar navigation
  const navItems = document.querySelectorAll(".sidebar-nav li:not(#logout-btn)")
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const page = this.getAttribute("data-page")
      navigateTo(page)
    })
  })

  function setupAdditionalEventListeners() {
    // Event detail modal listeners
    document.addEventListener("DOMContentLoaded", () => {
      // Make sure the modal exists in the DOM
      if (!document.getElementById("event-detail-modal")) {
        console.error("Event detail modal not found in the DOM")
        return
      }

      // Setup listeners
      setupDetailModalListeners()
    })
  }

  // Logout button
  document.getElementById("logout-btn").addEventListener("click", handleLogout)

  // Mobile menu toggle
  document.querySelector(".hamburger-menu").addEventListener("click", toggleSidebar)

  // Create event button
  document.getElementById("create-event-btn").addEventListener("click", openCreateEventModal)

  // Close modal buttons
  const closeButtons = document.querySelectorAll(".close-modal")
  closeButtons.forEach((button) => {
    button.addEventListener("click", closeAllModals)
  })

  // Event DL select change
  document.getElementById("event-dl").addEventListener("change", toggleDLOptions)

  // DL type select change
  document.getElementById("dl-type").addEventListener("change", toggleDLHours)

  // Event poster upload
  document.getElementById("event-poster").addEventListener("change", handlePosterUpload)

  // Add expense button
  document.getElementById("add-expense-btn").addEventListener("click", addExpenseField)

  // Modal tab navigation
  const tabs = document.querySelectorAll(".modal-tabs .tab")
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")
      switchTab(tabId, this.parentElement)
    })
  })

  // Event tabs navigation
  const eventTabs = document.querySelectorAll(".event-tabs .tab")
  eventTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")
      switchTab(tabId, this.parentElement)
    })
  })

  // Next tab button
  document.getElementById("next-tab-btn").addEventListener("click", goToNextTab)

  // Previous tab button
  document.getElementById("prev-tab-btn").addEventListener("click", goToPrevTab)

  // Create event submit button
  document.getElementById("create-event-submit").addEventListener("click", createEvent)

  // Event filter change
  document.getElementById("event-filter").addEventListener("change", filterEvents)

  // Event sort change
  document.getElementById("event-sort").addEventListener("change", sortEvents)

  // Save profile button
  document.getElementById("save-profile-btn").addEventListener("click", saveProfile)

  // Change password button
  document.getElementById("change-password-btn").addEventListener("click", changePassword)

  // Approve team button
  document.getElementById("approve-team-btn").addEventListener("click", approveTeam)

  // Reject team button
  document.getElementById("reject-team-btn").addEventListener("click", rejectTeam)

  // Registration status filter change
  document.getElementById("registration-status").addEventListener("change", filterRegistrations)

  // View all events link
  document.getElementById("view-all-events").addEventListener("click", (e) => {
    e.preventDefault()
    navigateTo("events")
  })

  // Chart refresh buttons
  document.getElementById("refresh-budget-chart").addEventListener("click", () => {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || []
    const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))
    const clubExpenses = expenses.filter((expense) => expense.clubId === loggedInClub.id)
    renderBudgetChart(clubExpenses)
    showToast("Chart refreshed", "Budget chart data has been updated", "success")
  })

  document.getElementById("refresh-timeline-chart").addEventListener("click", () => {
    fetchEvents().then((events) => {
      const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))
      const clubEvents = events.filter((event) => event.clubId === loggedInClub.id)
      renderTimelineChart(clubEvents)
      showToast("Chart refreshed", "Timeline chart data has been updated", "success")
    })
  })

  document.getElementById("refresh-category-chart").addEventListener("click", () => {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || []
    const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))
    const clubExpenses = expenses.filter((expense) => expense.clubId === loggedInClub.id)
    renderExpenseCategoryChart(clubExpenses)
    showToast("Chart refreshed", "Category chart data has been updated", "success")
  })

  document.getElementById("refresh-event-chart").addEventListener("click", () => {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || []
    fetchEvents().then((events) => {
      const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))
      const clubExpenses = expenses.filter((expense) => expense.clubId === loggedInClub.id)
      renderExpenseEventChart(clubExpenses, events)
      showToast("Chart refreshed", "Event chart data has been updated", "success")
    })
  })

  // Expense filter change
  document.getElementById("expense-filter").addEventListener("change", filterExpenses)

  // Add expense button (main)
  document.getElementById("add-expense-btn-main").addEventListener("click", openAddExpenseModal)

  // Add expense submit button
  document.getElementById("add-expense-submit").addEventListener("click", addExpense)

  // Listen for expense amount changes to update total
  document.addEventListener("input", (e) => {
    if (e.target.classList.contains("expense-amount")) {
      updateTotalBudget()
    }
  })

  // Listen for file input change to update file name
  document.getElementById("event-poster").addEventListener("change", (e) => {
    const fileName = e.target.files.length > 0 ? e.target.files[0].name : "No file chosen"
    document.querySelector(".file-name").textContent = fileName
  })

  // Add event listener for update total budget button
  document.getElementById("update-total-budget-btn").addEventListener("click", () => {
    const totalBudgetInput = document.getElementById("total-budget-input")
    const totalBudgetValue = Number.parseFloat(totalBudgetInput.value)

    if (isNaN(totalBudgetValue) || totalBudgetValue < 0) {
      showToast("Error", "Please enter a valid budget amount", "error")
      return
    }

    // Save to localStorage
    localStorage.setItem("totalBudget", totalBudgetValue.toString())

    // Update the display
    document.getElementById("budget-total").textContent = `₹${totalBudgetValue}`

    // Calculate and update remaining budget
    updateRemainingBudget()

    // Clear input
    totalBudgetInput.value = ""

    showToast("Budget Updated", `Total budget updated to ₹${totalBudgetValue}`, "success")
  })
}

// Check if user is logged in
function checkLoginStatus() {
  const loggedInClub = localStorage.getItem("loggedInClub")

  if (loggedInClub) {
    // User is logged in, show dashboard
    const club = JSON.parse(loggedInClub)
    document.getElementById("club-name").textContent = club.name
    document.getElementById("profile-club-name").textContent = club.name
    document.getElementById("profile-club-id").textContent = `Club ID: ${club.id}`
    document.getElementById("profile-name").value = club.name
    document.getElementById("profile-id").value = club.id

    // Set email and contact if available
    if (club.email) document.getElementById("profile-email").value = club.email
    if (club.contact) document.getElementById("profile-contact").value = club.contact
    if (club.description) document.getElementById("profile-description").value = club.description

    showPage("dashboard-page")
    loadDashboardData()
    loadEvents()
    loadBudgetData()
  } else {
    // User is not logged in, show login page
    showPage("login-page")
  }
}

document.getElementById("login-btn").addEventListener("click", async () => {
  const clubId = document.getElementById("club-id").value.trim()
  const password = document.getElementById("password").value

  if (clubId && password) {
    // ✅ Save clubId in localStorage
    localStorage.setItem("clubId", clubId)

    // ✅ Redirect to dashboard page
    // window.location.href = "admin-dashboard.html";
  } else {
    document.getElementById("login-error").textContent = "Invalid credentials"
  }
})

// Handle login form submission
async function handleLogin() {
  const clubId = document.getElementById("club-id").value.trim()
  const password = document.getElementById("password").value.trim()
  const errorElement = document.getElementById("login-error")

  if (!clubId || !password) {
    errorElement.textContent = "Please enter both Club ID and Password"
    return
  }

  try {
    // First check if the club exists in localStorage
    const clubs = JSON.parse(localStorage.getItem("clubs") || "[]")
    const club = clubs.find((c) => c.id === clubId && c.password === password)

    if (!club) {
      // Club not found or password doesn't match
      errorElement.textContent = "Invalid Club ID or Password"

      // Shake animation for error
      const loginForm = document.querySelector(".login-form")
      loginForm.classList.add("shake")
      setTimeout(() => {
        loginForm.classList.remove("shake")
      }, 500)
      return
    }

    // Generate a simple token (in a real app, this would come from your backend)
    const token = btoa(`${clubId}:${Date.now()}`)

    // Login successful
    localStorage.setItem("loggedInClub", JSON.stringify(club))
    localStorage.setItem("authToken", token)

    // Update UI elements
    document.getElementById("club-name").textContent = club.name
    document.getElementById("profile-club-name").textContent = club.name
    document.getElementById("profile-club-id").textContent = `Club ID: ${club.id}`
    document.getElementById("profile-name").value = club.name
    document.getElementById("profile-id").value = club.id

    showPage("dashboard-page")
    loadDashboardData()
    loadEvents()
    loadBudgetData()

    showToast("Login Successful", `Welcome back, ${club.name}!`, "success")
  } catch (error) {
    console.error("Login error:", error)
    errorElement.textContent = "An error occurred during login"
  }
}

// Handle logout
function handleLogout() {
  localStorage.removeItem("loggedInClub")
  showPage("login-page")
  showToast("Logged Out", "You have been successfully logged out", "info")
}

// Navigate to a specific page
function navigateTo(page) {
  // Hide all content sections
  const contents = document.querySelectorAll(".content")
  contents.forEach((content) => {
    content.classList.remove("active")
  })

  // Remove active class from all nav items
  const navItems = document.querySelectorAll(".sidebar-nav li")
  navItems.forEach((item) => {
    item.classList.remove("active")
  })

  // Show the selected content
  document.getElementById(`${page}-content`).classList.add("active")

  // Add active class to the selected nav item
  document.querySelector(`.sidebar-nav li[data-page="${page}"]`).classList.add("active")

  // Refresh data based on the page
  if (page === "dashboard") {
    loadDashboardData()
  } else if (page === "events") {
    loadEvents()
  } else if (page === "budget") {
    loadBudgetData()
  }

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    document.querySelector(".sidebar").classList.remove("active")
  }
}

// Show a specific page
function showPage(pageId) {
  const pages = document.querySelectorAll(".page")
  pages.forEach((page) => {
    page.classList.remove("active")
  })

  document.getElementById(pageId).classList.add("active")
}

// Toggle sidebar on mobile
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar")
  sidebar.classList.toggle("active")
}

// Open create event modal
function openCreateEventModal() {
  const modal = document.getElementById("create-event-modal")
  const eventActions = document.querySelector(".event-detail-actions");
  if (eventActions) {
    // Check if the button already exists
    if (!document.getElementById("create-report-event")) {
      const createReportBtn = document.createElement("button");
      createReportBtn.id = "create-report-event";
      createReportBtn.className = "btn-primary-action";
      createReportBtn.innerHTML = '<i class="fas fa-file-alt"></i> Create Report of this Event';
      createReportBtn.addEventListener("click", () => {
        openReportTemplateModal(eventId);
      });
      eventActions.appendChild(createReportBtn);
    }
  }
  modal.style.display = "block"

  // Reset form
  document.getElementById("event-name").value = ""
  document.getElementById("event-description").value = ""
  document.getElementById("event-start-date").value = ""
  document.getElementById("event-end-date").value = ""
  document.getElementById("event-start-time").value = ""
  document.getElementById("event-end-time").value = ""
  document.getElementById("event-venue").value = ""
  document.getElementById("event-dl").value = "no"
  document.getElementById("dl-options").classList.add("hidden")
  document.getElementById("dl-hours").classList.add("hidden")
  document.getElementById("event-teams").value = "1"
  document.getElementById("poster-preview").style.backgroundImage = ""
  document.getElementById("poster-preview").innerHTML = '<i class="fas fa-image"></i><span>No image selected</span>'
  document.querySelector(".file-name").textContent = "No file chosen"

  // Reset expenses
  const expensesContainer = document.getElementById("expenses-container")
  expensesContainer.innerHTML = `
    <div class="expense-item">
      <div class="form-group">
        <label for="expense-category-1">Category</label>
        <select id="expense-category-1" class="expense-category">
          <option value="venue">Venue</option>
          <option value="refreshments">Refreshments</option>
          <option value="prizes">Prizes</option>
          <option value="equipment">Equipment</option>
          <option value="marketing">Marketing</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label for="expense-description-1">Description</label>
        <div class="input-with-icon">
          <i class="fas fa-align-left"></i>
          <input type="text" id="expense-description-1" class="expense-description" placeholder="Enter description">
        </div>
      </div>
      <div class="form-group">
        <label for="expense-amount-1">Amount (₹)</label>
        <div class="input-with-icon">
          <i class="fas fa-rupee-sign"></i>
          <input type="number" id="expense-amount-1" class="expense-amount" min="0" value="0">
        </div>
      </div>
      <button class="remove-expense" data-id="1"><i class="fas fa-trash-alt"></i></button>
    </div>
  `

  // Reset tabs
  switchTab("event-details", document.querySelector(".modal-tabs"))
  document.getElementById("next-tab-btn").classList.remove("hidden")
  document.getElementById("prev-tab-btn").classList.add("hidden")
  document.getElementById("create-event-submit").classList.add("hidden")

  // Add event listener to remove expense buttons
  addRemoveExpenseListeners()

  // Update total budget
  updateTotalBudget()
}

// Function to set up event card functionality
function setupEventCardFunctionality() {
  // Get all event cards
  const eventCards = document.querySelectorAll(".event-card")

  // Add click event to each card
  eventCards.forEach((card) => {
    // Add event listener for click on the card
    card.addEventListener("click", function (e) {
      // Prevent click if the action buttons were clicked
      if (e.target.closest(".event-actions") || e.target.closest(".btn-action")) {
        return
      }

      // Get the event ID from the view button inside this card
      const viewButton = this.querySelector(".view-event")
      const eventId = viewButton ? viewButton.getAttribute("data-id") : null

      if (eventId) {
        openEventDetailModal(eventId)
      }
    })

    // Add hover functionality for action buttons
    const actionButtons = document.createElement("div")
    actionButtons.className = "event-actions"
    actionButtons.innerHTML = `
      <button class="btn-action btn-edit" title="Edit Event">
        <i class="fas fa-edit"></i>
      </button>
      <button class="btn-action btn-delete" title="Delete Event">
        <i class="fas fa-trash"></i>
      </button>
    `

    // Add the action buttons to the card if they don't already exist
    if (!card.querySelector(".event-actions")) {
      card.appendChild(actionButtons)
    }

    // Add event listeners to the action buttons
    const editButton = card.querySelector(".btn-edit")
    const deleteButton = card.querySelector(".btn-delete")

    if (editButton) {
      editButton.addEventListener("click", (e) => {
        e.stopPropagation() // Prevent card click
        const eventId = card.querySelector(".view-event").getAttribute("data-id")
        openEventEditForm(eventId)
      })
    }

    if (deleteButton) {
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation() // Prevent card click
        const eventId = card.querySelector(".view-event").getAttribute("data-id")
        confirmDeleteEvent(eventId)
      })
    }
  })
}

// Function to open the event detail modal
// function openEventDetailModal(eventId) {
//   // Get the modal
//   const modal = document.getElementById('event-detail-modal');

//   // Fetch events from storage
//   fetchEvents().then(events => {
//     // Find the event
//     const event = events.find(e => e._id === eventId || e.id === eventId);

//     if (!event) {
//       showToast("Error", "Event not found", "error");
//       return;
//     }

//     // Populate the modal with event details
//     document.getElementById('detail-event-title').textContent = event.name;
//     document.getElementById('detail-event-poster').src = event.poster || "https://via.placeholder.com/300x250?text=Event";
//     document.getElementById('detail-event-description').textContent = event.description;
//     document.getElementById('detail-event-date').textContent =
//       `${formatDate(new Date(event.startDate))} - ${formatDate(new Date(event.endDate))}`;
//     document.getElementById('detail-event-time').textContent = `${event.startTime} - ${event.endTime}`;
//     document.getElementById('detail-event-venue').textContent = event.venue;
//     document.getElementById('detail-event-team-size').textContent = `${event.teamMin} - ${event.teamMax} members`;

//     // Populate additional details if available
//     if (event.about) document.getElementById('detail-event-about').textContent = event.about;
//     if (event.theme) document.getElementById('detail-event-theme').textContent = event.theme;

//     // Populate prize details
//     if (event.prizes) {
//       document.getElementById('detail-event-prize-pool').textContent = `₹${event.prizes.pool || 0}`;

//       if (event.prizes.first) {
//         document.getElementById('detail-event-first-prize').textContent =
//           `₹${event.prizes.first.amount || 0} ${event.prizes.first.description ? '- ' + event.prizes.first.description : ''}`;
//       }

//       if (event.prizes.second) {
//         document.getElementById('detail-event-second-prize').textContent =
//           `₹${event.prizes.second.amount || 0} ${event.prizes.second.description ? '- ' + event.prizes.second.description : ''}`;
//       }

//       if (event.prizes.third) {
//         document.getElementById('detail-event-third-prize').textContent =
//           `₹${event.prizes.third.amount || 0} ${event.prizes.third.description ? '- ' + event.prizes.third.description : ''}`;
//       }
//     }

//     // Populate budget
//     document.getElementById('detail-event-budget').textContent = `₹${event.totalBudget || 0}`;

//     // Set up edit and delete buttons
//     document.getElementById('btn-edit-event').setAttribute('data-id', eventId);
//     document.getElementById('btn-delete-event').setAttribute('data-id', eventId);

//     // Add event listeners to buttons if not already added
//     setupDetailModalListeners();

//     // Show the view container, hide the edit form
//     document.getElementById('event-view-container').classList.remove('hidden');
//     document.getElementById('edit-form-container').classList.add('hidden');

//     // Show the modal
//     modal.style.display = 'block';
//   });
// }

// Function to open the edit form
// function openEventEditForm(eventId) {
//   // Get the modal
//   const modal = document.getElementById('event-detail-modal');

//   // Fetch events from storage
//   fetchEvents().then(events => {
//     // Find the event
//     const event = events.find(e => e._id === eventId || e.id === eventId);

//     if (!event) {
//       showToast("Error", "Event not found", "error");
//       return;
//     }

//     // Populate the edit form with event details
//     document.getElementById('edit-event-name').value = event.name;
//     document.getElementById('edit-event-description').value = event.description;
//     document.getElementById('edit-event-start-date').value = event.startDate;
//     document.getElementById('edit-event-end-date').value = event.endDate;
//     document.getElementById('edit-event-start-time').value = event.startTime;
//     document.getElementById('edit-event-end-time').value = event.endTime;
//     document.getElementById('edit-event-venue').value = event.venue;
//     document.getElementById('edit-event-team-min').value = event.teamMin || 1;
//     document.getElementById('edit-event-team-max').value = event.teamMax || 5;

//     // Populate additional details if available
//     if (event.about) document.getElementById('edit-event-about').value = event.about;
//     if (event.theme) document.getElementById('edit-event-theme').value = event.theme;

//     // Populate prize details
//     if (event.prizes) {
//       document.getElementById('edit-event-prize-pool').value = event.prizes.pool || 0;

//       if (event.prizes.first) {
//         document.getElementById('edit-first-prize-amount').value = event.prizes.first.amount || 0;
//         document.getElementById('edit-first-prize-description').value = event.prizes.first.description || '';
//       }

//       if (event.prizes.second) {
//         document.getElementById('edit-second-prize-amount').value = event.prizes.second.amount || 0;
//         document.getElementById('edit-second-prize-description').value = event.prizes.second.description || '';
//       }

//       if (event.prizes.third) {
//         document.getElementById('edit-third-prize-amount').value = event.prizes.third.amount || 0;
//         document.getElementById('edit-third-prize-description').value = event.prizes.third.description || '';
//       }
//     }

//     // Store the event ID in the form
//     document.getElementById('edit-event-form').setAttribute('data-id', eventId);

//     // Hide the view container, show the edit form
//     document.getElementById('event-view-container').classList.add('hidden');
//     document.getElementById('edit-form-container').classList.remove('hidden');

//     // Show the modal if not already visible
//     modal.style.display = 'block';
//   });
// }

// Function to confirm event deletion
function confirmDeleteEvent(eventId) {
  if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
    deleteEvent(eventId)
  }
}

// Function to delete an event
async function deleteEvent(eventId) {
  const token = localStorage.getItem("authToken")

  try {
    const response = await fetch(`https://expensetracker-qppb.onrender.com/api/club-events/${eventId}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": token,
      },
    })

    const data = await response.json()

    if (data.success) {
      // Close the modal
      document.getElementById("event-detail-modal").style.display = "none"

      // Refresh the events list
      loadEvents()

      // Show success message
      showToast("Event Deleted", "The event has been successfully deleted", "success")
    } else {
      showToast("Error", data.message || "Failed to delete event", "error")
    }
  } catch (error) {
    console.error("Error deleting event:", error)
    showToast("Error", "Failed to connect to server", "error")
  }
}
function activateEventModalTabs() {
  const modal = document.getElementById("event-detail-modal")

  // Tabs and their content
  const tabs = modal.querySelectorAll(".event-detail-tabs .tab")
  const tabContents = modal.querySelectorAll(".event-detail-body .tab-content")

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const selectedTab = this.getAttribute("data-tab")
      const targetContentId = `${selectedTab}-tab`

      // Remove active class from all tabs and contents
      tabs.forEach((t) => t.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // Add active to current tab and its content
      this.classList.add("active")
      const contentToShow = document.getElementById(targetContentId)
      if (contentToShow) {
        contentToShow.classList.add("active")
      } else {
        console.warn(`Tab content with ID '${targetContentId}' not found.`)
      }
    })
  })
}
// Function to set up event listeners for the detail modal
function setupDetailModalListeners(eventId) {
  const modal = document.getElementById("event-detail-modal")

  // Close modal
  const closeButton = modal.querySelector(".close-detail-modal")
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      modal.style.display = "none"
    })
  }

  const createReportBtn = document.getElementById("create-report-event");
  if (createReportBtn) {
    createReportBtn.addEventListener("click", () => {
      openReportTemplateModal(eventId);
    });
  }

  // ✅ Tab Switching Logic
  const tabs = modal.querySelectorAll(".event-detail-tabs .tab")
  const tabContents = modal.querySelectorAll(".tab-content")

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab")

      // Remove active from all tabs
      tabs.forEach((t) => t.classList.remove("active"))
      // Hide all contents
      tabContents.forEach((content) => content.classList.remove("active"))

      // Activate selected
      tab.classList.add("active")
      const contentToShow = document.getElementById(`${tabId}-tab`)
      if (contentToShow) contentToShow.classList.add("active")
    })
  })

  // Filter and export listeners (already there, keep as-is)
  const statusFilter = document.getElementById("teams-status-filter")
  if (statusFilter) {
    statusFilter.addEventListener("change", function () {
      filterTeamsByStatus(eventId, this.value)
    })
  }

  const exportButton = document.getElementById("export-teams-excel")
  if (exportButton) {
    exportButton.addEventListener("click", () => {
      const eventName = document.getElementById("detail-event-title").textContent
      exportTeamsToExcel(eventId, eventName)
    })
  }
}

// Add this function to filter teams by status
async function filterTeamsByStatus(eventId, status) {
  try {
    const teams = await fetchTeamRegistrations(eventId)
    const registeredTeamsList = document.getElementById("registered-teams-list")

    let filteredTeams
    if (status === "all") {
      filteredTeams = teams
    } else {
      filteredTeams = teams.filter((team) => team.status === status)
    }

    renderTeamsList(registeredTeamsList, filteredTeams, "filtered")
  } catch (error) {
    console.error("Error filtering teams:", error)
  }
}

// Add this function to ensure the modal is properly initialized when the DOM is loaded
function initializeEventModal() {
  // Check if the modal exists in the DOM
  const modal = document.getElementById("event-detail-modal")
  if (!modal) {
    console.error("Event detail modal not found in the DOM")
    return
  }

  console.log("Initializing event detail modal")

  // Add event listener to close button
  const closeButton = modal.querySelector(".close-detail-modal")
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      modal.style.display = "none"
    })
  }
}

// Call this function when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeEventModal()
})

// Function to save event changes
function saveEventChanges(eventId) {
  const token = localStorage.getItem("authToken")
  const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))

  // Get form values
  const name = document.getElementById("edit-event-name").value.trim()
  const description = document.getElementById("edit-event-description").value.trim()
  const startDate = document.getElementById("edit-event-start-date").value
  const endDate = document.getElementById("edit-event-end-date").value
  const startTime = document.getElementById("edit-event-start-time").value
  const endTime = document.getElementById("edit-event-end-time").value
  const venue = document.getElementById("edit-event-venue").value.trim()
  const teamMin = Number.parseInt(document.getElementById("edit-event-team-min").value) || 1
  const teamMax = Number.parseInt(document.getElementById("edit-event-team-max").value) || 5
  const about = document.getElementById("edit-event-about").value.trim()
  const theme = document.getElementById("edit-event-theme").value.trim()

  // Get prize details
  const prizePool = Number.parseInt(document.getElementById("edit-event-prize-pool").value) || 0
  const firstPrizeAmount = Number.parseInt(document.getElementById("edit-first-prize-amount").value) || 0
  const firstPrizeDescription = document.getElementById("edit-first-prize-description").value.trim()
  const secondPrizeAmount = Number.parseInt(document.getElementById("edit-second-prize-amount").value) || 0
  const secondPrizeDescription = document.getElementById("edit-second-prize-description").value.trim()
  const thirdPrizeAmount = Number.parseInt(document.getElementById("edit-third-prize-amount").value) || 0
  const thirdPrizeDescription = document.getElementById("edit-third-prize-description").value.trim()

  // Create updated event object
  const updatedEvent = {
    name,
    description,
    startDate,
    endDate,
    startTime,
    endTime,
    venue,
    teamMin,
    teamMax,
    about,
    theme,
    prizes: {
      pool: prizePool,
      first: {
        amount: firstPrizeAmount,
        description: firstPrizeDescription,
      },
      second: {
        amount: secondPrizeAmount,
        description: secondPrizeDescription,
      },
      third: {
        amount: thirdPrizeAmount,
        description: thirdPrizeDescription,
      },
    },
  }

  // Send PUT request to update the event
  fetch(`https://expensetracker-qppb.onrender.com/api/club-events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
    body: JSON.stringify(updatedEvent),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Refresh the events list
        loadEvents()

        // Update the detail view with new data
        openEventDetailModal(eventId)

        // Show success message
        showToast("Event Updated", "The event has been successfully updated", "success")
      } else {
        showToast("Error", data.message || "Failed to update event", "error")
      }
    })
    .catch((error) => {
      console.error("Error updating event:", error)
      showToast("Error", "Failed to connect to server", "error")
    })
}

// Add this to your existing loadEvents function
function loadEvents() {
  // Your existing loadEvents code...

  // After rendering events, set up the event card functionality
  setTimeout(() => {
    setupEventCardFunctionality()
  }, 600) // Slightly longer than your animation delay to ensure all cards are rendered
}

// Call this when the DOM is loaded to set up the initial event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Your existing DOMContentLoaded code...

  // Set up the event detail modal listeners
  setupDetailModalListeners()
})

// Open add expense modal
function openAddExpenseModal() {
  const modal = document.getElementById("add-expense-modal")
  modal.style.display = "block"

  // Reset form
  document.getElementById("expense-description").value = ""
  document.getElementById("expense-amount").value = "0"

  // Populate event dropdown
  const eventSelect = document.getElementById("expense-event")
  eventSelect.innerHTML = ""

  const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))

  // Fetch events from MongoDB
  fetchEvents().then((events) => {
    const clubEvents = events.filter((event) => event.clubId === loggedInClub.id)

    clubEvents.forEach((event) => {
      const option = document.createElement("option")
      option.value = event._id || event.id
      option.textContent = event.name
      eventSelect.appendChild(option)
    })
  })
}

// Modify your existing addExpense function to include date and description
function addExpense() {
  const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))
  const token = localStorage.getItem("authToken")
  const eventId = document.getElementById("expense-event").value
  const category = document.getElementById("expense-category").value
  const description = document.getElementById("expense-description").value.trim()
  const amount = Number.parseInt(document.getElementById("expense-amount").value) || 0
  const date = new Date().toISOString().split("T")[0] // Get current date in YYYY-MM-DD format

  // Validate inputs
  if (!eventId || !description || amount <= 0) {
    showToast("Error", "Please fill in all fields with valid values", "error")
    return
  }

  // Create expense object
  const expense = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    eventId,
    clubId: loggedInClub.id,
    category,
    description,
    amount,
    date: date,
  }

  // Save expense to localStorage
  const expenses = JSON.parse(localStorage.getItem("expenses")) || []
  expenses.push(expense)
  localStorage.setItem("expenses", JSON.stringify(expenses))

  // Update event total budget in MongoDB
  fetchEvents().then((events) => {
    const event = events.find((e) => e._id === eventId || e.id === eventId)

    if (event) {
      // Update the event's total budget
      const updatedBudget = (event.totalBudget || 0) + amount

      // Send PUT request to update the event
      fetch(`https://expensetracker-qppb.onrender.com/api/club-events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          totalBudget: updatedBudget,
          expenses: [
            ...(event.expenses || []),
            {
              category,
              description,
              amount,
            },
          ],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Event budget updated in MongoDB")
          } else {
            console.error("Failed to update event budget in MongoDB")
          }
        })
        .catch((error) => {
          console.error("Error updating event budget:", error)
        })
    }
  })

  // Update remaining budget
  // Declare updateRemainingBudget before using it. Assuming it's a function.
  function updateRemainingBudget() {
    console.warn("updateRemainingBudget() function is a placeholder.")
  }
  updateRemainingBudget()

  // Close modal and refresh data
  closeAllModals()
  loadBudgetData()
  loadDashboardData()

  showToast("Expense Added", `Added ₹${amount} expense`, "success")
}

// Add this function to update the remaining budget
function updateRemainingBudget() {
  const totalBudget = Number.parseFloat(localStorage.getItem("totalBudget")) || 0
  const expenses = JSON.parse(localStorage.getItem("expenses")) || []
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remaining = totalBudget - totalExpenses

  // Update the display
  document.getElementById("budget-remaining").textContent = `₹${remaining}`
}

// Close all modals
function closeAllModals() {
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    modal.style.display = "none"
  })
}

// Toggle DL options based on selection
function toggleDLOptions() {
  const dlSelect = document.getElementById("event-dl")
  const dlOptions = document.getElementById("dl-options")

  if (dlSelect.value === "yes") {
    dlOptions.classList.remove("hidden")
    toggleDLHours()
  } else {
    dlOptions.classList.add("hidden")
    document.getElementById("dl-hours").classList.add("hidden")
  }
}

// Toggle DL hours based on selection
function toggleDLHours() {
  const dlType = document.getElementById("dl-type")
  const dlHours = document.getElementById("dl-hours")

  if (dlType.value === "specific-hours") {
    dlHours.classList.remove("hidden")
  } else {
    dlHours.classList.add("hidden")
  }
}

// Handle poster upload
function handlePosterUpload(e) {
  const file = e.target.files[0]
  const preview = document.getElementById("poster-preview")

  if (file) {
    // Store the file for later upload to Cloudinary
    window.posterFileToUpload = file

    // Still show preview locally
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.style.backgroundImage = `url(${e.target.result})`
      preview.innerHTML = ""
    }
    reader.readAsDataURL(file)
  } else {
    window.posterFileToUpload = null
    preview.style.backgroundImage = ""
    preview.innerHTML = '<i class="fas fa-image"></i><span>No image selected</span>'
  }
}

// Add expense field
function addExpenseField() {
  const container = document.getElementById("expenses-container")
  const expenseItems = container.querySelectorAll(".expense-item")
  const newId = expenseItems.length + 1

  const newExpense = document.createElement("div")
  newExpense.className = "expense-item"
  newExpense.innerHTML = `
    <div class="form-group">
      <label for="expense-category-${newId}">Category</label>
      <select id="expense-category-${newId}" class="expense-category">
        <option value="venue">Venue</option>
        <option value="refreshments">Refreshments</option>
        <option value="prizes">Prizes</option>
        <option value="equipment">Equipment</option>
        <option value="marketing">Marketing</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div class="form-group">
      <label for="expense-description-${newId}">Description</label>
      <div class="input-with-icon">
        <i class="fas fa-align-left"></i>
        <input type="text" id="expense-description-${newId}" class="expense-description" placeholder="Enter description">
      </div>
    </div>
    <div class="form-group">
      <label for="expense-amount-${newId}">Amount (₹)</label>
      <div class="input-with-icon">
        <i class="fas fa-rupee-sign"></i>
        <input type="number" id="expense-amount-${newId}" class="expense-amount" min="0" value="0">
      </div>
    </div>
    <button class="remove-expense" data-id="${newId}"><i class="fas fa-trash-alt"></i></button>
  `

  container.appendChild(newExpense)
  addRemoveExpenseListeners()

  // Animate the new expense item
  newExpense.style.opacity = "0"
  newExpense.style.transform = "translateY(20px)"
  setTimeout(() => {
    newExpense.style.transition = "opacity 0.3s ease, transform 0.3s ease"
    newExpense.style.opacity = "1"
    newExpense.style.transform = "translateY(0)"
  }, 10)
}

// Add event listeners to remove expense buttons
function addRemoveExpenseListeners() {
  const removeButtons = document.querySelectorAll(".remove-expense")
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const expenseItems = document.querySelectorAll(".expense-item")

      if (expenseItems.length > 1) {
        const expenseItem = this.parentElement

        // Animate removal
        expenseItem.style.transition = "opacity 0.3s ease, transform 0.3s ease"
        expenseItem.style.opacity = "0"
        expenseItem.style.transform = "translateY(20px)"

        setTimeout(() => {
          expenseItem.remove()
          updateTotalBudget()
        }, 300)
      } else {
        showToast("Error", "You must have at least one expense item", "warning")
      }
    })
  })
}

// Update total budget
function updateTotalBudget() {
  const amountInputs = document.querySelectorAll(".expense-amount")
  let total = 0

  amountInputs.forEach((input) => {
    total += Number.parseInt(input.value) || 0
  })

  document.getElementById("event-total-budget").textContent = `₹${total}`
}

// Switch tab
function switchTab(tabId, tabContainer) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content")
  tabContents.forEach((content) => {
    content.classList.remove("active")
  })

  // Remove active class from all tabs
  const tabs = tabContainer.querySelectorAll(".tab")
  tabs.forEach((tab) => {
    tab.classList.remove("active")
  })

  // Show the selected tab content
  document.getElementById(`${tabId}-tab`).classList.add("active")

  // Add active class to the selected tab
  tabContainer.querySelector(`.tab[data-tab="${tabId}"]`).classList.add("active")
}

// Create event - Modified to save to MongoDB
async function createEvent() {
  const token = localStorage.getItem("authToken")
  const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))

  const formData = new FormData()

  // Poster upload
  if (window.posterFileToUpload) {
    formData.append("poster", window.posterFileToUpload)
  }

  // Basic fields
  formData.append("clubId", loggedInClub.id)
  formData.append("name", document.getElementById("event-name").value.trim())
  formData.append("description", document.getElementById("event-description").value.trim())
  formData.append("startDate", document.getElementById("event-start-date").value)
  formData.append("endDate", document.getElementById("event-end-date").value)
  formData.append("startTime", document.getElementById("event-start-time").value)
  formData.append("endTime", document.getElementById("event-end-time").value)
  formData.append("venue", document.getElementById("event-venue").value.trim())
  formData.append("teams", document.getElementById("event-teams").value)
  formData.append("teamMin", document.getElementById("event-team-min")?.value || 1)
  formData.append("teamMax", document.getElementById("event-team-max")?.value || 5)
  formData.append("about", document.getElementById("event-about")?.value.trim() || "")
  formData.append("theme", document.getElementById("event-theme")?.value.trim() || "")

  // DL fields
  const hasDL = document.getElementById("event-dl").value === "yes"
  formData.append("hasDL", hasDL)
  if (hasDL) {
    formData.append("dlType", document.getElementById("dl-type").value)
    formData.append("dlStartTime", document.getElementById("dl-start-time").value)
    formData.append("dlEndTime", document.getElementById("dl-end-time").value)
  }

  // What to Expect
  const expectItems = [...document.querySelectorAll(".expect-input")].map(i => i.value.trim()).filter(Boolean)
  formData.append("expectItems", JSON.stringify(expectItems))

  // Eligibility
  const eligibilityCriteria = [...document.querySelectorAll(".eligibility-input")].map(i => i.value.trim()).filter(Boolean)
  formData.append("eligibilityCriteria", JSON.stringify(eligibilityCriteria))

  // Duty Leave
  const dutyLeave = {
    available: document.getElementById("event-duty-leave")?.checked || false,
    days: Number(document.getElementById("event-duty-leave-days")?.value || 0),
  }
  formData.append("dutyLeave", JSON.stringify(dutyLeave))

  // Prizes
  const prizes = {
    pool: Number(document.getElementById("event-prize-pool")?.value || 0),
    first: {
      amount: Number(document.getElementById("first-prize-amount")?.value || 0),
      description: document.getElementById("first-prize-description")?.value.trim() || "",
    },
    second: {
      amount: Number(document.getElementById("second-prize-amount")?.value || 0),
      description: document.getElementById("second-prize-description")?.value.trim() || "",
    },
    third: {
      amount: Number(document.getElementById("third-prize-amount")?.value || 0),
      description: document.getElementById("third-prize-description")?.value.trim() || "",
    },
    special: [],
    perks: [...document.querySelectorAll(".perk-input")].map(i => i.value.trim()).filter(Boolean)
  }

  document.querySelectorAll(".special-award").forEach(award => {
    const name = award.querySelector(".award-name")?.value.trim()
    if (name) {
      prizes.special.push({
        name,
        amount: Number(award.querySelector(".award-amount")?.value || 0),
        description: award.querySelector(".award-description")?.value.trim() || "",
      })
    }
  })
  formData.append("prizes", JSON.stringify(prizes))

  // Sponsors
  const sponsors = []
  document.querySelectorAll(".sponsor-item").forEach(sponsor => {
    const name = sponsor.querySelector(".sponsor-name")?.value.trim()
    if (name) {
      sponsors.push({ name, logo: null }) // Logo will be handled in backend
    }
  })
  formData.append("sponsors", JSON.stringify(sponsors))

  // Schedule
  const schedule = []
  document.querySelectorAll(".schedule-day").forEach(day => {
    const dayNumber = Number(day.getAttribute("data-day"))
    const date = day.querySelector(".day-date")?.value
    const items = []
    day.querySelectorAll(".schedule-item").forEach(item => {
      const time = item.querySelector(".item-time")?.value
      const title = item.querySelector(".item-title")?.value.trim()
      const description = item.querySelector(".item-description")?.value.trim()
      if (time && title) {
        items.push({ time, title, description })
      }
    })
    if (date && items.length) {
      schedule.push({ dayNumber, date, items })
    }
  })
  formData.append("schedule", JSON.stringify(schedule))

  // FAQs
  const faqs = []
  document.querySelectorAll(".faq-item").forEach(faq => {
    const q = faq.querySelector(".faq-question")?.value.trim()
    const a = faq.querySelector(".faq-answer")?.value.trim()
    if (q && a) faqs.push({ question: q, answer: a })
  })
  formData.append("faqs", JSON.stringify(faqs))

  // Expenses
  const expenses = []
  document.querySelectorAll(".expense-item").forEach(item => {
    const category = item.querySelector(".expense-category")?.value
    const description = item.querySelector(".expense-description")?.value.trim()
    const amount = Number(item.querySelector(".expense-amount")?.value || 0)
    if (description && amount > 0) {
      expenses.push({ category, description, amount })
    }
  })
  formData.append("expenses", JSON.stringify(expenses))

  const totalBudget = expenses.reduce((sum, e) => sum + e.amount, 0)
  formData.append("totalBudget", totalBudget)

  // Final API call
  try {
    showLoader()
    const response = await fetch("https://expensetracker-qppb.onrender.com/api/club-events", {
      method: "POST",
      headers: {
        "x-auth-token": token,
      },
      body: formData,
    })

    const result = await response.json()
    hideLoader()

    if (result.success) {
      showToast("Event Created", `${result.event.name} has been created successfully!`, "success")
      closeAllModals()
      loadEvents()
      loadDashboardData()
      loadBudgetData()
    } else {
      showToast("Error", result.message || "Failed to create event", "error")
    }
  } catch (err) {
    hideLoader()
    console.error("❌ Error creating event:", err)
    showToast("Error", "Failed to connect to server", "error")
  }
}


// Function to fetch events from MongoDB
async function fetchEvents(clubId = null) {
  try {
    const token = localStorage.getItem("authToken");
    // Build the URL: add ?clubId=xxx if clubId is provided
    let url = "https://expensetracker-qppb.onrender.com/api/club-events";
    if (clubId) {
      url += `?clubId=${encodeURIComponent(clubId)}`;
    }

    const response = await fetch(url, {
      headers: {
        "x-auth-token": token,
      },
    });

    const data = await response.json();

    // Debug output: see exactly what the API returns
    console.log("[fetchEvents] Fetched from URL:", url);
    console.log("[fetchEvents] API response:", data);

    if (data.success && Array.isArray(data.events)) {
      if (data.events.length === 0) {
        console.warn("[fetchEvents] No events found for this club.");
      }
      return data.events;
    } else {
      console.error("[fetchEvents] Failed to fetch events:", data.message || data);
      return [];
    }
  } catch (error) {
    console.error("[fetchEvents] Error fetching events:", error);
    return [];
  }
}

// Load dashboard data - Modified to use MongoDB
async function loadDashboardData() {
  const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))
  const expenses = JSON.parse(localStorage.getItem("expenses")) || []
  const teams = JSON.parse(localStorage.getItem("teams")) || []

  // Fetch events from MongoDB
  const events = await fetchEvents()

  // Filter data for the logged-in club
  const clubEvents = events.filter((event) => event.clubId === loggedInClub.id)
  const clubTeams = teams.filter((team) => {
    const event = events.find((e) => e._id === team.eventId || e.id === team.eventId)
    return event && event.clubId === loggedInClub.id
  })
  const clubExpenses = expenses.filter((expense) => expense.clubId === loggedInClub.id)

  // Calculate total budget
  const totalBudget = clubExpenses.reduce((total, expense) => total + expense.amount, 0)

  // Calculate upcoming events
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingEvents = clubEvents.filter((event) => {
    const eventStartDate = new Date(event.startDate)
    return eventStartDate >= today
  })

  // Update dashboard stats with animation
  animateCounter("total-events", clubEvents.length)
  animateCounter("total-budget", totalBudget, "₹")
  animateCounter("total-registrations", clubTeams.length)
  animateCounter("upcoming-events", upcomingEvents.length)

  // Render budget chart
  renderBudgetChart(clubExpenses)

  // Render timeline chart
  renderTimelineChart(clubEvents)

  // Render upcoming events
  renderUpcomingEvents(upcomingEvents)
}

// Animate counter
function animateCounter(elementId, targetValue, prefix = "") {
  const element = document.getElementById(elementId)
  const startValue = Number.parseInt(element.textContent.replace(/[^\d]/g, "")) || 0
  const duration = 1000 // 1 second
  const stepTime = 20
  const steps = duration / stepTime
  const increment = (targetValue - startValue) / steps

  let currentValue = startValue
  let currentStep = 0

  const timer = setInterval(() => {
    currentStep++
    currentValue += increment

    if (currentStep >= steps) {
      clearInterval(timer)
      currentValue = targetValue
    }

    element.textContent = `${prefix}${Math.round(currentValue)}`
  }, stepTime)
}

// Render budget chart
function renderBudgetChart(expenses) {
  const ctx = document.getElementById("budget-chart").getContext("2d")

  // Check if expenses exist and have length
  if (!expenses || expenses.length === 0) {
    // No data case - draw empty chart with message
    if (window.budgetChart) {
      window.budgetChart.destroy()
    }

    window.budgetChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#e5e7eb"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    })

    // Draw "No data available" text in the center
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    ctx.font = "14px Arial"
    ctx.fillStyle = "#64748b"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("No expense data available", width / 2, height / 2)

    return
  }

  // Group expenses by category
  const categories = {}
  expenses.forEach((expense) => {
    if (!categories[expense.category]) {
      categories[expense.category] = 0
    }
    categories[expense.category] += expense.amount
  })

  // Prepare data for Chart.js
  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Budget Allocation",
        data: Object.values(categories),
        backgroundColor: ["#4f46e5", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#6b7280"],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  }

  // Destroy existing chart instance if it exists
  if (window.budgetChart) {
    window.budgetChart.destroy()
  }

  // Create new chart instance
  window.budgetChart = new Chart(ctx, {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            color: "#333",
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          titleFont: {
            size: 16,
          },
          bodyFont: {
            size: 14,
          },
          callbacks: {
            label: (tooltipItem) => {
              const value = tooltipItem.raw
              const total = tooltipItem.chart._metasets[0].total
              const percentage = ((value / total) * 100).toFixed(2)
              return `${tooltipItem.label}: ₹${value} (${percentage}%)`
            },
          },
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        },
      },
    },
  })
}

// Render timeline chart
function renderTimelineChart(events) {
  const canvas = document.getElementById("timeline-chart")
  const ctx = canvas.getContext("2d")

  // Set canvas dimensions
  canvas.width = canvas.parentElement.offsetWidth
  canvas.height = 300

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Get the current year
  const currentYear = new Date().getFullYear()

  // Filter events for the current year
  const filteredEvents = events.filter((event) => {
    const eventStartYear = new Date(event.startDate).getFullYear()
    return eventStartYear === currentYear
  })

  if (filteredEvents.length === 0) {
    // No data
    ctx.font = "16px Arial"
    ctx.fillStyle = "#64748b"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`No events available for ${currentYear}`, canvas.width / 2, canvas.height / 2)
    return
  }

  // Process events for chart visualization
  const months = Array.from({ length: 12 }, (_, i) => new Date(currentYear, i, 1))
  const eventCounts = Array(12).fill(0)
  const eventNamesByMonth = Array(12)
    .fill(null)
    .map(() => [])

  filteredEvents.forEach((event) => {
    const eventMonth = new Date(event.startDate).getMonth()
    eventCounts[eventMonth]++
    eventNamesByMonth[eventMonth].push(event.name)
  })

  // Destroy existing chart instance if it exists
  if (window.timelineChart) {
    window.timelineChart.destroy()
  }

  // Create new chart instance with improved UI
  window.timelineChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: months.map((month) => month.toLocaleDateString("en-US", { month: "short" })), // Display month names
      datasets: [
        {
          label: `Events in ${currentYear}`,
          data: eventCounts,
          backgroundColor: eventCounts.map((count) => (count > 0 ? "#4f46e5" : "#e5e7eb")), // Highlight months with events
          borderColor: "#3b82f6",
          borderWidth: 1,
          hoverBackgroundColor: "#3b82f6", // Change color on hover
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Months",
            font: {
              size: 14,
              weight: "bold",
            },
            color: "#374151",
          },
          grid: {
            display: false, // Cleaner UI by removing grid lines
          },
        },
        y: {
          title: {
            display: true,
            text: "Number of Events",
            font: {
              size: 14,
              weight: "bold",
            },
            color: "#374151",
          },
          ticks: {
            stepSize: 1,
            beginAtZero: true,
            color: "#4b5563",
          },
          grid: {
            color: "#e5e7eb", // Subtle grid lines
          },
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: "#1e293b",
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 12,
          },
          bodySpacing: 6,
          padding: 10,
          callbacks: {
            title: (context) => {
              const monthIndex = context[0].dataIndex
              return `Month: ${context[0].label}`
            },
            label: (context) => {
              const monthIndex = context.dataIndex
              const eventCount = eventCounts[monthIndex]
              const eventNames = eventNamesByMonth[monthIndex]
                .map((name) => `• ${name}`) // Add bullet points to each event name
                .join("\n") // Ensure each name is on a new line
              return [`${eventCount} event${eventCount === 1 ? "" : "s"}:`].concat(eventNames.split("\n"))
            },
          },
        },
        legend: {
          display: false, // Hide legend for cleaner UI
        },
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 10,
          right: 10,
        },
      },
      animation: {
        duration: 1000, // Smooth animation for loading
        easing: "easeOutQuart",
      },
    },
  })
}

// Render upcoming events
function renderUpcomingEvents(events) {
  const container = document.getElementById("upcoming-events-list")
  container.innerHTML = ""

  if (events.length === 0) {
    container.innerHTML = '<p class="text-muted">No upcoming events</p>'
    return
  }

  // Sort events by start date
  events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

  // Take only the first 3 events
  const upcomingEvents = events.slice(0, 3)

  upcomingEvents.forEach((event, index) => {
    const eventCard = document.createElement("div")
    eventCard.className = "event-card"
    eventCard.style.opacity = "0"
    eventCard.style.transform = "translateY(20px)"

    eventCard.innerHTML = `
      <div class="event-image">
        <img src="${event.poster || "https://via.placeholder.com/300x180?text=Event"}" alt="${event.name}">
        <div class="event-date">
          <i class="fas fa-calendar-alt"></i>
          ${formatDate(new Date(event.startDate))}
        </div>
      </div>
      <div class="event-content">
        <h4 class="event-title">${event.name}</h4>
        <p class="event-description">${event.description}</p>
        <div class="event-footer">
          <div class="event-meta">
            <div class="meta-item">
              <i class="fas fa-clock"></i>
              <span>${event.startTime}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>${event.venue}</span>
            </div>
          </div>
          <div class="event-actions">
            <button class="view-event" data-id="${event._id || event.id}">View <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    `

    container.appendChild(eventCard)

    // Animate card appearance
    setTimeout(
      () => {
        eventCard.style.transition = "opacity 0.5s ease, transform 0.5s ease"
        eventCard.style.opacity = "1"
        eventCard.style.transform = "translateY(0)"
      },
      100 + index * 100,
    )
  })

  // Add event listeners to view buttons
  setTimeout(() => {
    const viewButtons = document.querySelectorAll(".view-event")
    viewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const eventId = this.getAttribute("data-id")
        openViewEventModal(eventId)
      })
    })
  }, 500)
}

// Load events - Modified to use MongoDB
async function loadEvents() {
  showLoader() // ⏳ Show loader while fetching

  const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))

  // Fetch events from MongoDB
  const events = await fetchEvents()

  // Filter events for the logged-in club
  const clubEvents = events.filter((event) => event.clubId === loggedInClub.id)

  // Render events
  renderEvents(clubEvents)

  // Render timeline chart with fetched events
  renderTimelineChart(clubEvents)

  hideLoader() // ✅ Hide loader after rendering
}

// Render events
function renderEvents(events) {
  const container = document.getElementById("events-list")
  container.innerHTML = ""

  if (events.length === 0) {
    container.innerHTML = '<p class="text-muted">No events found</p>'
    return
  }

  // Sort events by start date (newest first)
  events.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

  events.forEach((event, index) => {
    const eventCard = document.createElement("div")
    eventCard.className = "event-card"
    eventCard.style.opacity = "0"
    eventCard.style.transform = "translateY(20px)"

    const eventDate = new Date(event.startDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const isUpcoming = eventDate >= today

    eventCard.innerHTML = `
      <div class="event-image">
        <img src="${event.poster || "https://via.placeholder.com/300x180?text=Event"}" alt="${event.name}">
        <div class="event-date">
          <i class="fas fa-calendar-alt"></i>
          ${formatDate(eventDate)}
        </div>
      </div>
      <div class="event-content">
        <h4 class="event-title">${event.name}</h4>
        <p class="event-description">${event.description}</p>
        <div class="event-footer">
          <div class="event-meta">
            <div class="meta-item">
              <i class="fas fa-clock"></i>
              <span>${event.startTime}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>${event.venue}</span>
            </div>
          </div>
          <div class="event-actions">
            <button class="view-event" data-id="${event._id || event.id}">View <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    `

    container.appendChild(eventCard)

    // Animate card appearance
    setTimeout(
      () => {
        eventCard.style.transition = "opacity 0.5s ease, transform 0.5s ease"
        eventCard.style.opacity = "1"
        eventCard.style.transform = "translateY(0)"
      },
      100 + index * 100,
    )
  })

  // Add event listeners
  setTimeout(() => {
    // Event card click to view details
    const eventCards = document.querySelectorAll(".event-card")
    eventCards.forEach((card) => {
      card.addEventListener("click", function (e) {
        if (!e.target.closest(".btn-action")) {
          const eventId = this.dataset.id || this.querySelector(".view-event").getAttribute("data-id")
          if (eventId) {
            openEventDetailModal(eventId)
          } else {
            console.error("Event ID is undefined")
          }
        }
      })
    })

    // Edit button click
    const editButtons = document.querySelectorAll(".btn-edit")
    editButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation() // Prevent event card click
        const eventId = this.getAttribute("data-id")
        openEventDetailModal(eventId, true) // Open in edit mode
      })
    })

    // Delete button click
    const deleteButtons = document.querySelectorAll(".btn-delete")
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation() // Prevent event card click
        const eventId = this.getAttribute("data-id")
        confirmDeleteEvent(eventId)
      })
    })
  }, 500)
}
async function fetchTeamRegistrations(eventId) {
  try {
    const token = localStorage.getItem("authToken")
    const response = await fetch(`https://expensetracker-qppb.onrender.com/api/team-registrations?eventId=${eventId}`, {
      headers: {
        "x-auth-token": token,
      },
    })

    const data = await response.json()

    if (data.success) {
      return data.teamRegistrations
    } else {
      console.error("Failed to fetch team registrations:", data.message)
      return []
    }
  } catch (error) {
    console.error("Error fetching team registrations:", error)
    return []
  }
}
function switchModalTab(tabId) {
  const tabContents = document.querySelectorAll(".event-detail-tab-content")
  tabContents.forEach((content) => {
    content.classList.remove("active")
  })

  const selectedContent = document.getElementById(`${tabId}-tab`)
  if (selectedContent) {
    selectedContent.classList.add("active")
  }

  const tabs = document.querySelectorAll(".event-detail-tabs .tab")
  tabs.forEach((tab) => {
    tab.classList.remove("active")
  })

  const activeTab = document.querySelector(`.event-detail-tabs .tab[data-tab="${tabId}"]`)
  if (activeTab) {
    activeTab.classList.add("active")
  }
}

async function loadRegisteredTeams(eventId) {
  try {
    const teams = await fetchTeamRegistrations(eventId)
    const registeredTeamsList = document.getElementById("registered-teams-list")

    if (!registeredTeamsList) {
      console.warn("registered-teams-list element not found")
      return
    }

    if (teams.length === 0) {
      registeredTeamsList.innerHTML = `<p>No teams registered yet.</p>`
      return
    }

    // Render each team card
    registeredTeamsList.innerHTML = "" // clear previous list

    teams.forEach((team, index) => {
      const teamCard = document.createElement("div")
      teamCard.className = "team-card"

      teamCard.innerHTML = `
        <div class="team-summary" data-index="${index}">
          <strong>${team.teamName}</strong> 
          <span style="color: #555;">(Leader: ${team.leaderName || "N/A"})</span>
          <i class="fas fa-chevron-down toggle-icon" style="float:right;"></i>
        </div>

        <div class="team-details hidden">
          <p><strong>Registration Date:</strong> ${new Date(team.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${team.status}</p>
          <p><strong>Members:</strong></p>
          <ul>
            ${team.members.map((member) => `<li>${member.name} (${member.email})</li>`).join("")}
          </ul>

          <div class="team-actions">
            <button class="approve-team" data-id="${team._id}"><i class="fas fa-check"></i> Approve</button>
            <button class="reject-team" data-id="${team._id}"><i class="fas fa-times"></i> Reject</button>
          </div>
        </div>
      `

      registeredTeamsList.appendChild(teamCard)
    })

    // Dropdown toggle
    registeredTeamsList.querySelectorAll(".team-summary").forEach((summary) => {
      summary.addEventListener("click", () => {
        const details = summary.nextElementSibling
        const icon = summary.querySelector(".toggle-icon")
        details.classList.toggle("hidden")
        icon.classList.toggle("fa-chevron-down")
        icon.classList.toggle("fa-chevron-up")
      })
    })

    // Approve & Reject
    registeredTeamsList.querySelectorAll(".approve-team").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault() // Prevent default button behavior
        const id = btn.getAttribute("data-id")

        // Get team data
        const teams = await fetchTeamRegistrations(eventId)
        const team = teams.find((t) => t._id === id)

        // Get event data
        const events = await fetchEvents()
        const event = events.find((e) => e._id === eventId || e.id === eventId)

        if (team) {
          // Open email customization modal
          openEmailCustomizationModal(team, event, id)
        } else {
          showToast("Error", "Team data not found", "error")
        }
      })
    })

    registeredTeamsList.querySelectorAll(".reject-team").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault() // Prevent default button behavior
        const id = btn.getAttribute("data-id")
        // Disable all approve/reject buttons to prevent multiple clicks
        registeredTeamsList.querySelectorAll(".approve-team, .reject-team").forEach((button) => {
          button.disabled = true
        })
        await updateTeamStatus(id, "rejected")
        // Re-enable buttons after operation completes
        registeredTeamsList.querySelectorAll(".approve-team, .reject-team").forEach((button) => {
          button.disabled = false
        })
      })
    })
  } catch (err) {
    console.error("Error loading teams:", err)
    document.getElementById("registered-teams-list").innerHTML = `<p>Error loading teams.</p>`
  }
}

async function fetchApprovedTeams(eventId) {
  const token = localStorage.getItem("authToken")
  const response = await fetch(`https://expensetracker-qppb.onrender.com/api/approved-teams?eventId=${eventId}`, {
    headers: {
      "x-auth-token": token,
    },
  })

  const data = await response.json()
  return data.success ? data.teams : []
}
async function loadApprovedTeams(eventId) {
  const teams = await fetchApprovedTeams(eventId)
  const approvedList = document.getElementById("accepted-teams-list")

  if (!approvedList) return

  if (teams.length === 0) {
    approvedList.innerHTML = "<p>No approved teams yet.</p>"
    return
  }

  approvedList.innerHTML = teams
    .map(
      (team) => `
    <div class="team-card">
      <strong>${team.teamName}</strong> (Leader: ${team.leaderName})
      <p>${team.members.map((m) => m.name).join(", ")}</p>
    </div>
  `,
    )
    .join("")
}

async function openEventDetailModal(id) {
  showLoader() // 🌀 Show loader before anything

  eventId = id
  try {
    if (!eventId) {
      console.error("Invalid event ID:", eventId)
      showToast("Error", "Invalid event ID", "error")
      hideLoader()
      return
    }

    console.log("Fetching details for Event ID:", eventId)

    const token = localStorage.getItem("authToken")
    const response = await fetch(`https://expensetracker-qppb.onrender.com/api/club-events/${eventId}`, {
      headers: {
        "x-auth-token": token,
      },
    })

    console.log("Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error Response Body:", errorText)
      throw new Error(`Failed to fetch event details. Status: ${response.status}`)
    }

    const data = await response.json()
    // console.log("API Response:", data)

    if (!data || !data.success || !data.event) {
      showToast("Error", "Event not found or invalid response", "error")
      hideLoader()
      return
    }

    const event = data.event

    const modal = document.getElementById("event-detail-modal")
    modal.setAttribute("data-event-id", eventId)
    document.getElementById("detail-event-title").textContent = event.name
    document.getElementById("detail-event-poster").src =
      event.poster || "https://via.placeholder.com/300x250?text=Event"
    document.getElementById("detail-event-description").textContent = event.description
    document.getElementById("detail-event-date").textContent =
      `${formatDate(new Date(event.startDate))} - ${formatDate(new Date(event.endDate))}`
    document.getElementById("detail-event-time").textContent = `${event.startTime} - ${event.endTime}`
    document.getElementById("detail-event-venue").textContent = event.venue
    document.getElementById("detail-event-team-size").textContent = `${event.teamMin} - ${event.teamMax} members`
    document.getElementById("detail-event-about").textContent = event.about || "No details provided"
    document.getElementById("detail-event-theme").textContent = event.theme || "No theme specified"
    document.getElementById("detail-event-prize-pool").textContent = `₹${event.prizes?.pool || 0}`
    document.getElementById("detail-event-first-prize").textContent = event.prizes?.first?.amount
      ? `₹${event.prizes.first.amount} - ${event.prizes.first.description || ""}`
      : "None"
    document.getElementById("detail-event-second-prize").textContent = event.prizes?.second?.amount
      ? `₹${event.prizes.second.amount} - ${event.prizes.second.description || ""}`
      : "None"
    document.getElementById("detail-event-third-prize").textContent = event.prizes?.third?.amount
      ? `₹${event.prizes.third.amount} - ${event.prizes.third.description || ""}`
      : "None"
    document.getElementById("detail-event-budget").textContent = `₹${event.totalBudget || 0}`

    await fetchTeamRegistrations(eventId)
    loadTeamRegistrations(eventId)
    loadRegisteredTeams(eventId)
    loadApprovedTeams(eventId)

    switchModalTab("event-info")

    document.getElementById("btn-delete-event").addEventListener("click", () => {
      deleteEvent(eventId)
    })

    modal.style.display = "block"
    setupDetailModalListeners(eventId)

    console.log("Setup completed, modal should be visible now")
  } catch (error) {
    console.error("Error fetching event details:", error)
    showToast("Error", `Failed to fetch event details: ${error.message}`, "error")
  } finally {
    hideLoader() // ✅ Always hide loader
  }
}

// Add event listener for the Create Report button
document.getElementById("btn-create-report").addEventListener("click", () => {
  const eventId = document.getElementById("event-detail-modal").getAttribute("data-event-id");
  openReportTemplateModal(eventId);
});

function openReportTemplateModal(eventId) {
  const modal = document.getElementById("report-template-modal");
  modal.setAttribute("data-event-id", eventId);

  // Reset form
  document.getElementById("report-template").value = "";
  document.querySelector("#report-template-modal .file-name").textContent = "No file chosen";
  document.getElementById("template-preview").innerHTML = '<i class="fas fa-file-alt"></i><span>No template selected</span>';

  // Add event listener to file input
  const fileInput = document.getElementById("report-template");
  fileInput.addEventListener("change", handleTemplateUpload);

  // Add event listener to create report button
  document.getElementById("create-report-btn").addEventListener("click", () => {
    generateEventReport(eventId);
  });

  // Show modal
  modal.style.display = "block";

  // Add event listener to close button
  modal.querySelector(".close-modal").addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// Function to handle template upload
function handleTemplateUpload(e) {
  const file = e.target.files[0];
  const preview = document.getElementById("template-preview");
  const fileNameDisplay = document.querySelector("#report-template-modal .file-name");

  if (file) {
    // Store the file for later use
    window.reportTemplateFile = file;

    // Update file name display
    fileNameDisplay.textContent = file.name;

    // Update preview
    preview.innerHTML = `
      <i class="fas fa-file-word" style="color: #2b579a;"></i>
      <span>${file.name}</span>
    `;

    // Enable create report button
    document.getElementById("create-report-btn").disabled = false;
  } else {
    window.reportTemplateFile = null;
    fileNameDisplay.textContent = "No file chosen";
    preview.innerHTML = '<i class="fas fa-file-alt"></i><span>No template selected</span>';
    document.getElementById("create-report-btn").disabled = true;
  }
}
async function fetchEventById(eventId) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`/api/club-events/${eventId}`, {
      headers: {
        "x-auth-token": token,
      },
    });

    const data = await response.json();

    if (!data.success || !data.event) {
      throw new Error("Failed to fetch event details");
    }

    return data.event;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}
// Function to generate event report
async function generateEventReport(eventId) {
  showLoader();

  try {
    if (!window.reportTemplateFile) {
      showToast("Error", "Please upload a template file", "error");
      hideLoader();
      return;
    }

    // Fetch all events, ensure they're loaded
    const events = await fetchEvents();
    console.log("[ReportGen] Searching for eventId:", eventId, "Type:", typeof eventId);

    // Debug: print all event IDs
    events.forEach(ev => {
      console.log("[ReportGen] Event:", ev.name, "ID:", ev._id, "id:", ev.id);
    });

    // Try to find the event by _id or id, as string (handles both types)
    const event = events.find(ev =>
      String(ev._id) === String(eventId) ||
      (ev.id && String(ev.id) === String(eventId))
    );

    if (!event) {
      showToast("Error", `Event not found (ID: ${eventId})`, "error");
      console.error("[ReportGen] Event not found. eventId:", eventId, "All IDs:", events.map(ev => ev._id || ev.id));
      hideLoader();
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("template", window.reportTemplateFile);
    formData.append("eventId", event._id || event.id); // Use the backend's expected key

    // Prepare event details for the report
    const eventDetails = {
      eventName: event.name,
      eventDate: `${formatDate(new Date(event.startDate))} - ${formatDate(new Date(event.endDate))}`,
      eventTime: `${event.startTime} - ${event.endTime}`,
      eventVenue: event.venue,
      eventDescription: event.description,
      eventBudget: event.totalBudget || 0,
      clubName: event.clubId,
      teamCount: event.teams || 0,
      prizePool: event.prizes?.pool || 0
    };
    formData.append("eventDetails", JSON.stringify(eventDetails));

    // Send to the server
    const response = await fetch("https://expensetracker-qppb.onrender.com/api/generate-report", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to generate report");
    }

    // Download the generated report
    const downloadUrl = `https://expensetracker-qppb.onrender.com${data.downloadUrl}`;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${event.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_report.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast("Success", "Report generated successfully", "success");
    hideLoader();
  } catch (error) {
    console.error("Error generating report:", error);
    showToast("Error", "Failed to generate report: " + error.message, "error");
    hideLoader();
  }
}

async function showDocxPreview(blob) {
  const container = document.getElementById("docx-preview-container");
  container.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading preview...</div>';

  try {
    // Convert DOCX to HTML using mammoth.js (loaded from CDN)
    if (typeof mammoth === 'undefined') {
      // Load mammoth.js if not already loaded
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.0/mammoth.browser.min.js");
    }

    const result = await mammoth.convertToHtml({ arrayBuffer: await blob.arrayBuffer() });

    // Display the HTML
    container.innerHTML = `<div class="document-content">${result.value}</div>`;

    // Store the text content for editing
    window.docxTextContent = result.value;
    document.getElementById("docx-content-editor").value = result.value;

  } catch (error) {
    console.error("Error previewing DOCX:", error);
    container.innerHTML = `<div class="error-message">Error previewing document: ${error.message}</div>`;
  }
}

function setupDocxPreviewListeners(eventId, eventName) {
  const previewModal = document.getElementById("docx-preview-modal");
  const editBtn = document.getElementById("edit-docx-btn");
  const downloadDocxBtn = document.getElementById("download-docx-btn");
  const downloadPdfBtn = document.getElementById("download-pdf-btn");
  const saveBtn = document.getElementById("save-docx-content");
  const previewContainer = document.getElementById("docx-preview-container");
  const editContainer = document.getElementById("docx-edit-container");

  // Close button
  previewModal.querySelector(".close-modal").addEventListener("click", () => {
    previewModal.style.display = "none";
  });

  // Edit button
  editBtn.addEventListener("click", () => {
    previewContainer.classList.add("hidden");
    editContainer.classList.remove("hidden");
    editBtn.innerHTML = '<i class="fas fa-eye"></i> Show Preview';

    // Toggle button function
    editBtn.onclick = () => {
      if (previewContainer.classList.contains("hidden")) {
        // Switch to preview
        previewContainer.classList.remove("hidden");
        editContainer.classList.add("hidden");
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Content';
      } else {
        // Switch to edit
        previewContainer.classList.add("hidden");
        editContainer.classList.remove("hidden");
        editBtn.innerHTML = '<i class="fas fa-eye"></i> Show Preview';
      }
    };
  });

  // Save button
  saveBtn.addEventListener("click", async () => {
    const newContent = document.getElementById("docx-content-editor").value;

    // Update preview
    previewContainer.querySelector(".document-content").innerHTML = newContent;

    // Update stored content
    window.docxTextContent = newContent;

    // Switch to preview
    previewContainer.classList.remove("hidden");
    editContainer.classList.add("hidden");
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Content';

    showToast("Success", "Content updated", "success");

    // Send updated content to server to regenerate DOCX
    try {
      showLoader();

      const response = await fetch("/api/update-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          eventId,
          htmlContent: newContent
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      // Get the updated blob
      const blob = await response.blob();
      window.generatedDocxBlob = blob;

      hideLoader();
    } catch (error) {
      console.error("Error updating report:", error);
      showToast("Warning", "Preview updated but failed to update document for download", "warning");
      hideLoader();
    }
  });

  // Download DOCX button
  downloadDocxBtn.addEventListener("click", () => {
    if (!window.generatedDocxBlob) {
      showToast("Error", "No document available for download", "error");
      return;
    }

    // Create download link
    const url = URL.createObjectURL(window.generatedDocxBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_report.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Download PDF button
  downloadPdfBtn.addEventListener("click", async () => {
    try {
      showLoader();

      // Send request to convert DOCX to PDF
      const formData = new FormData();
      formData.append("docx", window.generatedDocxBlob);

      const response = await fetch("/api/convert-to-pdf", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      // Get the PDF blob
      const pdfBlob = await response.blob();

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${eventName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      hideLoader();
    } catch (error) {
      console.error("Error converting to PDF:", error);
      showToast("Error", "Failed to convert to PDF: " + error.message, "error");
      hideLoader();
    }
  });
}

// Function to generate report content
function generateReportContent(event) {
  const today = new Date();
  const formattedDate = formatDate(today);

  return `
    <div class="report-header">
      <h1>${event.name} - Event Report</h1>
      <p>Generated on ${formattedDate}</p>
    </div>
    
    <div class="report-section">
      <h2>Event Overview</h2>
      <p><strong>Description:</strong> ${event.description}</p>
      <p><strong>Date:</strong> ${formatDate(new Date(event.startDate))} - ${formatDate(new Date(event.endDate))}</p>
      <p><strong>Time:</strong> ${event.startTime} - ${event.endTime}</p>
      <p><strong>Venue:</strong> ${event.venue}</p>
      <p><strong>Team Size:</strong> ${event.teamMin} - ${event.teamMax} members</p>
    </div>
    
    <div class="report-section">
      <h2>Event Details</h2>
      <p>${event.about || "No additional details provided."}</p>
      ${event.theme ? `<p><strong>Theme:</strong> ${event.theme}</p>` : ""}
    </div>
    
    <div class="report-section">
      <h2>Prize Distribution</h2>
      <p><strong>Total Prize Pool:</strong> ₹${event.prizes?.pool || 0}</p>
      
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Prize Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>First Prize</td>
            <td>₹${event.prizes?.first?.amount || 0}</td>
            <td>${event.prizes?.first?.description || "-"}</td>
          </tr>
          <tr>
            <td>Second Prize</td>
            <td>₹${event.prizes?.second?.amount || 0}</td>
            <td>${event.prizes?.second?.description || "-"}</td>
          </tr>
          <tr>
            <td>Third Prize</td>
            <td>₹${event.prizes?.third?.amount || 0}</td>
            <td>${event.prizes?.third?.description || "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="report-section">
      <h2>Budget Overview</h2>
      <p><strong>Total Budget:</strong> ₹${event.totalBudget || 0}</p>
      
      ${event.expenses && event.expenses.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${event.expenses.map(expense => `
              <tr>
                <td>${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</td>
                <td>${expense.description}</td>
                <td>₹${expense.amount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<p>No expenses recorded for this event.</p>'}
    </div>
    
    <div class="report-footer">
      <p>This report was automatically generated by UNIBUX Club Management System.</p>
      <p>© ${today.getFullYear()} UNIBUX</p>
    </div>
  `;
}

// Function to setup report view listeners
function setupReportViewListeners(event) {
  const reportModal = document.getElementById("report-view-modal");
  const reportContent = document.getElementById("report-content");
  const editBtn = document.getElementById("edit-report-btn");
  const downloadBtn = document.getElementById("download-report-btn");

  // Close button
  reportModal.querySelector(".close-modal").addEventListener("click", () => {
    reportModal.style.display = "none";
  });

  // Edit button
  editBtn.addEventListener("click", () => {
    const isEditable = reportContent.getAttribute("contenteditable") === "true";

    if (isEditable) {
      // Save changes
      reportContent.setAttribute("contenteditable", "false");
      editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
      showToast("Success", "Report changes saved", "success");
    } else {
      // Enable editing
      reportContent.setAttribute("contenteditable", "true");
      reportContent.focus();
      editBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    }
  });

  // Download button
  downloadBtn.addEventListener("click", () => {
    downloadReportAsPDF(event.name);
  });
}

// Function to download report as PDF
function downloadReportAsPDF(eventName) {
  showLoader();

  try {
    const reportContent = document.getElementById("report-content");
    const reportTitle = document.getElementById("report-title").textContent;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');

    // Add content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
          }
          .report-content {
            max-width: 800px;
            margin: 0 auto;
          }
          .report-header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #ddd;
          }
          .report-section {
            margin-bottom: 2rem;
          }
          .report-footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #ddd;
            font-size: 0.9rem;
            color: #666;
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
          }
          table, th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
            text-align: left;
          }
          h1, h2, h3 {
            margin-top: 1.5rem;
            margin-bottom: 1rem;
          }
          p {
            margin-bottom: 1rem;
          }
          @media print {
            body {
              padding: 0;
            }
            .report-content {
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-content">
          ${reportContent.innerHTML}
        </div>
      </body>
      </html>
    `);

    // Wait for content to load
    printWindow.document.close();
    printWindow.onload = function () {
      // Print the window to PDF
      printWindow.print();
      hideLoader();
    };
  } catch (error) {
    console.error("Error downloading report:", error);
    showToast("Error", "Failed to download report", "error");
    hideLoader();
  }
}

// Function to close event detail modal
function closeEventDetailModal() {
  document.getElementById("event-detail-modal").style.display = "none"
}

async function deleteEvent(eventId) {
  const token = localStorage.getItem("authToken")

  try {
    // Send DELETE request to the backend
    const response = await fetch(`https://expensetracker-qppb.onrender.com/api/club-events/${eventId}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": token,
      },
    })

    const data = await response.json()

    if (data.success) {
      // Close the modal
      closeEventDetailModal()

      // Refresh the events list
      loadEvents()

      // Refresh dashboard data
      loadDashboardData()

      // Show success message
      showToast("Success", `Event has been deleted successfully`, "success")
    } else {
      showToast("Error", data.message || "Failed to delete event", "error")
    }
  } catch (error) {
    console.error("Error deleting event:", error)
    showToast("Error", "Failed to connect to server", "error")
  }
}

// Function to confirm delete event
function confirmDeleteEvent(eventId) {
  if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
    deleteEvent(eventId)
  }
}

async function loadTeamRegistrations(eventId) {
  const registeredTeamsList = document.getElementById("registered-teams-list")
  const acceptedTeamsList = document.getElementById("accepted-teams-list")

  registeredTeamsList.innerHTML =
    '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading teams...</div>'
  acceptedTeamsList.innerHTML =
    '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading teams...</div>'

  try {
    const teams = await fetchTeamRegistrations(eventId)

    // Filter teams based on status
    const pendingTeams = teams.filter((team) => team.status === "pending")
    const acceptedTeams = teams.filter((team) => team.status === "approved")

    // Render registered teams
    renderTeamsList(registeredTeamsList, pendingTeams, "pending")

    // Render accepted teams
    renderTeamsList(acceptedTeamsList, acceptedTeams, "accepted")

    // Add event listeners for team status filter
    document.getElementById("teams-status-filter").addEventListener("change", function () {
      const status = this.value
      let filteredTeams

      if (status === "all") {
        filteredTeams = teams
      } else {
        filteredTeams = teams.filter((team) => team.status === status)
      }

      renderTeamsList(registeredTeamsList, filteredTeams, "filtered")
    })

    // Add event listener for export to Excel button
    document.getElementById("export-teams-excel").addEventListener("click", () => {
      exportTeamsToExcel(acceptedTeams, document.getElementById("detail-event-title").textContent)
    })
  } catch (error) {
    console.error("Error loading team registrations:", error)
    registeredTeamsList.innerHTML = '<div class="error-message">Failed to load teams. Please try again.</div>'
    acceptedTeamsList.innerHTML = '<div class="error-message">Failed to load teams. Please try again.</div>'
  }
}

async function updateTeamStatus(teamId, newStatus) {
  showLoader() // Show loader when starting the operation
  const token = localStorage.getItem("authToken")

  try {
    // First update the team status
    const response = await fetch(`https://expensetracker-qppb.onrender.com/api/team-registrations/${teamId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ status: newStatus }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Failed to update team status")
    }

    // If custom email data is provided and status is approved, send custom email
    if (customEmail && newStatus === "approved") {
      // In a real implementation, you would send the custom email data to the server
      console.log("Custom email would be sent:", customEmail)
    }

    showToast("Status Updated", `Team marked as ${newStatus}`, "success")

    // Refresh team list
    const eventId = document.getElementById("event-detail-modal").getAttribute("data-event-id")
    loadRegisteredTeams(eventId)

    return data
  } catch (error) {
    console.error("Error updating status:", error)
    showToast("Error", error.message || "Server issue", "error")
    throw error
  } finally {
    hideLoader() // Always hide loader when operation completes
  }
}

function renderTeamsList(container, teams, statusContext = "all") {
  if (!teams || teams.length === 0) {
    container.innerHTML = `<p>No teams found.</p>`
    return
  }

  container.innerHTML = "" // Clear old content

  teams.forEach((team, index) => {
    const teamCard = document.createElement("div")
    teamCard.className = "team-card"

    // Add status tag to the team summary
    teamCard.innerHTML = `
      <div class="team-summary" data-index="${index}">
        <strong>${team.teamName}</strong> 
        <span style="color: #555;">(Leader: ${team.leaderName || "N/A"})</span>
        <span class="status-tag status-${team.status}">${team.status}</span>
        <i class="fas fa-chevron-down toggle-icon" style="float:right;"></i>
      </div>

      <div class="team-details hidden">
        <p><strong>Registration Date:</strong> ${new Date(team.createdAt).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${team.status}</p>
        <p><strong>Members:</strong></p>
        <ul>
          ${team.members.map((member) => `<li>${member.name} (${member.email})</li>`).join("")}
        </ul>

        <div class="team-actions">
          ${team.status === "pending"
        ? `
            <button class="approve-team" data-id="${team._id}"><i class="fas fa-check"></i> Approve</button>
            <button class="reject-team" data-id="${team._id}"><i class="fas fa-times"></i> Reject</button>
          `
        : ""
      }
        </div>
      </div>
    `

    container.appendChild(teamCard)
  })

  // Dropdown toggle
  container.querySelectorAll(".team-summary").forEach((summary) => {
    summary.addEventListener("click", () => {
      const details = summary.nextElementSibling
      const icon = summary.querySelector(".toggle-icon")
      details.classList.toggle("hidden")
      icon.classList.toggle("fa-chevron-down")
      icon.classList.toggle("fa-chevron-up")
    })
  })

  // Approve & Reject
  container.querySelectorAll(".approve-team").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id")
      await updateTeamStatus(id, "approved")
    })
  })

  container.querySelectorAll(".reject-team").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id")
      await updateTeamStatus(id, "rejected")
    })
  })
}

// Function to approve team registration
async function approveTeamRegistration(teamId) {
  try {
    const token = localStorage.getItem("authToken")
    const response = await fetch(`https://expensetracker-qppb.onrender.com/api/team-registrations/${teamId}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    })

    const data = await response.json()

    if (data.success) {
      showToast("Success", "Team has been approved", "success")

      // Reload team registrations
      const eventId = document.getElementById("event-detail-modal").getAttribute("data-event-id")
      loadTeamRegistrations(eventId)
    } else {
      showToast("Error", data.message || "Failed to approve team", "error")
    }
  } catch (error) {
    console.error("Error approving team:", error)
    showToast("Error", "Failed to connect to server", "error")
  }
}

// Function to reject team registration
async function rejectTeamRegistration(teamId) {
  try {
    const token = localStorage.getItem("authToken")
    const response = await fetch(`https://expensetracker-qppb.onrender.com/api/team-registrations/${teamId}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    })

    const data = await response.json()

    if (data.success) {
      showToast("Success", "Team has been rejected", "success")

      // Reload team registrations
      const eventId = document.getElementById("event-detail-modal").getAttribute("data-event-id")
      loadTeamRegistrations(eventId)
    } else {
      showToast("Error", data.message || "Failed to reject team", "error")
    }
  } catch (error) {
    console.error("Error rejecting team:", error)
    showToast("Error", "Failed to connect to server", "error")
  }
}

function exportTeamsToExcel(teams, eventName) {
  if (teams.length === 0) {
    showToast("Warning", "No teams to export", "warning")
    return
  }

  try {
    // Create a workbook
    const XLSX = window.XLSX
    if (!XLSX) {
      // If XLSX is not available, load it dynamically
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"
      script.onload = () => {
        exportTeamsToExcel(teams, eventName)
      }
      document.head.appendChild(script)
      return
    }

    // Format data for Excel
    const worksheetData = []

    // Add header row
    worksheetData.push([
      "Team Name",
      "Status",
      "Registration Date",
      "Member Name",
      "Role",
      "Email",
      "Phone",
      "Department",
    ])

    // Add data rows
    teams.forEach((team) => {
      const registrationDate = formatDate(new Date(team.registeredAt))

      team.members.forEach((member, index) => {
        worksheetData.push([
          index === 0 ? team.teamName : "", // Only show team name for first member
          index === 0 ? team.status : "", // Only show status for first member
          index === 0 ? registrationDate : "", // Only show date for first member
          member.name,
          member.isLeader ? "Leader" : "Member",
          member.email,
          member.phone,
          member.department,
        ])
      })

      // Add empty row between teams
      worksheetData.push([])
    })

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(worksheetData)

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Teams")

    // Generate filename
    const fileName = `${eventName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_teams_${new Date().toISOString().split("T")[0]}.xlsx`

    // Export to file
    XLSX.writeFile(wb, fileName)

    showToast("Success", "Teams exported to Excel successfully", "success")
  } catch (error) {
    console.error("Error exporting to Excel:", error)
    showToast("Error", "Failed to export teams to Excel", "error")
  }
}

// Function to switch between modal tabs

// Filter events - Modified to use MongoDB
async function filterEvents() {
  const filterValue = document.getElementById("event-filter").value
  const sortValue = document.getElementById("event-sort").value
  const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))

  // Fetch events from MongoDB
  const events = await fetchEvents()

  // Filter events for the logged-in club
  let clubEvents = events.filter((event) => event.clubId === loggedInClub.id)

  // Apply filter
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (filterValue === "upcoming") {
    clubEvents = clubEvents.filter((event) => {
      const eventStartDate = new Date(event.startDate)
      return eventStartDate >= today
    })
  } else if (filterValue === "past") {
    clubEvents = clubEvents.filter((event) => {
      const eventStartDate = new Date(event.startDate)
      return eventStartDate < today
    })
  }

  // Apply sort
  if (sortValue === "date-desc") {
    clubEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  } else if (sortValue === "date-asc") {
    clubEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  } else if (sortValue === "name-asc") {
    clubEvents.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortValue === "name-desc") {
    clubEvents.sort((a, b) => b.name.localeCompare(a.name))
  }

  // Render filtered events
  renderEvents(clubEvents)
}

// Sort events
function sortEvents() {
  filterEvents()
}

// Open view event modal - Modified to use MongoDB
async function openViewEventModal(eventId) {
  // Fetch events from MongoDB
  const events = await fetchEvents();
console.log("Looking for eventId:", eventId);
console.log("Events loaded:", events.map(e => e._id || e.id));
const event = events.find(e => String(e._id) === String(eventId) || String(e.id) === String(eventId));
if (!event) {
  throw new Error("Event not found");
}

  // Find teams for this event
  const eventTeams = teams.filter((team) => team.eventId === eventId)

  // Update modal content
  document.getElementById("view-event-title").textContent = event.name
  document.getElementById("view-event-poster").src = event.poster || "https://via.placeholder.com/300x250?text=Event"
  document.getElementById("view-event-description").textContent = event.description
  document.getElementById("view-event-date").textContent =
    `${formatDate(new Date(event.startDate))} - ${formatDate(new Date(event.endDate))}`
  document.getElementById("view-event-time").textContent = `${event.startTime} - ${event.endTime}`
  document.getElementById("view-event-venue").textContent = event.venue
  document.getElementById("view-event-teams").textContent = `${eventTeams.length} / ${event.teams} Teams`
  document.getElementById("view-event-budget").textContent = `₹${event.totalBudget}`

  // Render expenses
  const expenseTable = document.getElementById("view-expense-table")
  expenseTable.innerHTML = ""

  if (!event.expenses || event.expenses.length === 0) {
    const row = document.createElement("tr")
    row.innerHTML = '<td colspan="3">No expenses</td>'
    expenseTable.appendChild(row)
  } else {
    event.expenses.forEach((expense) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</td>
        <td>${expense.description}</td>
        <td>₹${expense.amount}</td>
      `
      expenseTable.appendChild(row)
    })
  }

  // Render registrations
  renderEventRegistrations(eventTeams)

  // Store current event ID
  document.getElementById("view-event-modal").setAttribute("data-event-id", eventId)

  // Show modal
  document.getElementById("view-event-modal").style.display = "block"

  // Switch to registrations tab
  switchTab("registrations", document.querySelector("#view-event-modal .event-tabs"))
}

// Render event registrations
function renderEventRegistrations(teams) {
  const container = document.getElementById("event-registrations")
  container.innerHTML = ""

  if (teams.length === 0) {
    container.innerHTML = '<p class="text-muted">No registrations yet</p>'
    return
  }

  // Filter teams based on status
  const statusFilter = document.getElementById("registration-status").value

  if (statusFilter !== "all") {
    teams = teams.filter((team) => team.status === statusFilter)
  }

  teams.forEach((team, index) => {
    const teamItem = document.createElement("div")
    teamItem.className = "registration-item"
    teamItem.style.opacity = "0"
    teamItem.style.transform = "translateY(10px)"

    teamItem.innerHTML = `
      <div class="team-info">
        <div class="team-name">${team.name}</div>
        <div class="team-members">${team.members.length} Members</div>
      </div>
      <div class="team-status-container">
        <span class="team-status status-${team.status}">${team.status.charAt(0).toUpperCase() + team.status.slice(1)}</span>
        <button class="view-team" data-id="${team.id}">View <i class="fas fa-arrow-right"></i></button>
      </div>
    `

    container.appendChild(teamItem)

    // Animate item appearance
    setTimeout(() => {
      teamItem.style.transition = "opacity 0.3s ease, transform 0.3s ease"
      teamItem.style.opacity = "1"
      teamItem.style.transform = "translateY(0)"
    }, 50 * index)
  })

  // Add event listeners to view buttons
  setTimeout(() => {
    const viewButtons = document.querySelectorAll(".view-team")
    viewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const teamId = this.getAttribute("data-id")
        openViewTeamModal(teamId)
      })
    })
  }, 300)
}

// Filter registrations
function filterRegistrations() {
  const eventId = document.getElementById("view-event-modal").getAttribute("data-event-id")
  const teams = JSON.parse(localStorage.getItem("teams")) || []

  // Find teams for this event
  const eventTeams = teams.filter((team) => team.eventId === eventId)

  // Render filtered registrations
  renderEventRegistrations(eventTeams)
}

// Open view team modal
function openViewTeamModal(teamId) {
  const teams = JSON.parse(localStorage.getItem("teams")) || []

  // Find team
  const team = teams.find((t) => t.id === teamId)

  if (!team) {
    return
  }

  // Find event
  fetchEvents().then((events) => {
    const event = events.find((e) => e._id === team.eventId || e.id === team.eventId)

    // Update modal content
    document.getElementById("view-team-title").textContent = `Team: ${team.name}`
    document.getElementById("view-team-name").textContent = team.name
    document.getElementById("view-team-event").textContent = event ? event.name : "Unknown Event"
    document.getElementById("view-team-date").textContent = formatDate(new Date(team.registeredAt))
    document.getElementById("view-team-status").textContent = team.status.charAt(0).toUpperCase() + team.status.slice(1)
    document.getElementById("view-team-status").className = `status-${team.status}`

    // Render team members
    const membersContainer = document.getElementById("team-members-list")
    membersContainer.innerHTML = ""

    team.members.forEach((member, index) => {
      const memberItem = document.createElement("div")
      memberItem.className = "team-member"
      memberItem.style.opacity = "0"
      memberItem.style.transform = "translateY(10px)"

      memberItem.innerHTML = `
        <div class="member-name"><i class="fas fa-user"></i> ${member.name}</div>
        <div class="member-details">
          <div class="member-email"><i class="fas fa-envelope"></i> ${member.email}</div>
          <div class="member-phone"><i class="fas fa-phone"></i> ${member.phone}</div>
        </div>
      `

      membersContainer.appendChild(memberItem)

      // Animate item appearance
      setTimeout(() => {
        memberItem.style.transition = "opacity 0.3s ease, transform 0.3s ease"
        memberItem.style.opacity = "1"
        memberItem.style.transform = "translateY(0)"
      }, 50 * index)
    })

    // Show/hide action buttons based on status
    const approveBtn = document.getElementById("approve-team-btn")
    const rejectBtn = document.getElementById("reject-team-btn")

    if (team.status === "pending") {
      approveBtn.style.display = "flex"
      rejectBtn.style.display = "flex"
    } else {
      approveBtn.style.display = "none"
      rejectBtn.style.display = "none"
    }

    // Store current team ID
    document.getElementById("view-team-modal").setAttribute("data-team-id", teamId)

    // Show modal
    document.getElementById("view-team-modal").style.display = "block"
  })
}

// Approve team
function approveTeam() {
  const teamId = document.getElementById("view-team-modal").getAttribute("data-team-id")
  const teams = JSON.parse(localStorage.getItem("teams")) || []

  // Find team
  const teamIndex = teams.findIndex((t) => t.id === teamId)

  if (teamIndex === -1) {
    return
  }

  // Update team status
  teams[teamIndex].status = "approved"

  // Save to localStorage
  localStorage.setItem("teams", JSON.stringify(teams))

  // Close modal and refresh teams
  closeAllModals()

  // Refresh event registrations if event modal is open
  const eventModal = document.getElementById("view-event-modal")
  if (eventModal.style.display === "block") {
    const eventId = eventModal.getAttribute("data-event-id")
    const eventTeams = teams.filter((team) => team.eventId === eventId)
    renderEventRegistrations(eventTeams)
  }

  showToast("Team Approved", `${teams[teamIndex].name} has been approved`, "success")
}

// Reject team
function rejectTeam() {
  const teamId = document.getElementById("view-team-modal").getAttribute("data-team-id")
  const teams = JSON.parse(localStorage.getItem("teams")) || []

  // Find team
  const teamIndex = teams.findIndex((t) => t.id === teamId)

  if (teamIndex === -1) {
    return
  }

  // Update team status
  teams[teamIndex].status = "rejected"

  // Save to localStorage
  localStorage.setItem("teams", JSON.stringify(teams))

  // Close modal and refresh teams
  closeAllModals()

  // Refresh event registrations if event modal is open
  const eventModal = document.getElementById("view-event-modal")
  if (eventModal.style.display === "block") {
    const eventId = eventModal.getAttribute("data-event-id")
    const eventTeams = teams.filter((team) => team.eventId === eventId)
    renderEventRegistrations(eventTeams)
  }

  showToast("Team Rejected", `${teams[teamIndex].name} has been rejected`, "error")
}

// Modify your existing loadBudgetData function to include the total budget from localStorage
function loadBudgetData() {
  const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))
  const expenses = JSON.parse(localStorage.getItem("expenses")) || []

  // Fetch events from MongoDB
  fetchEvents().then((events) => {
    // Filter expenses for the logged-in club
    const clubExpenses = expenses.filter((expense) => expense.clubId === loggedInClub.id)

    // Calculate total expenses
    const totalExpenses = clubExpenses.reduce((total, expense) => total + expense.amount, 0)

    // Get total budget from localStorage
    const totalBudget = Number.parseFloat(localStorage.getItem("totalBudget")) || 0

    // Calculate remaining budget
    const remaining = totalBudget - totalExpenses

    // Update budget stats with animation
    animateCounter("budget-total", totalBudget, "₹")
    animateCounter("expenses-total", totalExpenses, "₹")
    animateCounter("budget-remaining", remaining, "₹")

    // Render expense charts
    renderExpenseCategoryChart(clubExpenses)
    renderExpenseEventChart(clubExpenses, events)

    // Render expense table
    renderExpenseTable(clubExpenses, events)
  })
}

// Filter expenses
function filterExpenses() {
  const filterValue = document.getElementById("expense-filter").value
  const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))
  const expenses = JSON.parse(localStorage.getItem("expenses")) || []

  // Filter expenses for the logged-in club
  let clubExpenses = expenses.filter((expense) => expense.clubId === loggedInClub.id)

  // Apply category filter
  if (filterValue !== "all") {
    clubExpenses = clubExpenses.filter((expense) => expense.category === filterValue)
  }

  // Fetch events from MongoDB
  fetchEvents().then((events) => {
    // Render filtered expense table
    renderExpenseTable(clubExpenses, events)
  })
}

// Render expense category chart
function renderExpenseCategoryChart(expenses) {
  const ctx = document.getElementById("expenses-category-chart").getContext("2d")

  // Check if expenses exist and have length
  if (!expenses || expenses.length === 0) {
    // No data case - draw empty chart with message
    if (window.expenseCategoryChart) {
      window.expenseCategoryChart.destroy()
    }

    window.expenseCategoryChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#e5e7eb"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    })

    // Draw "No data available" text in the center
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    ctx.font = "14px Arial"
    ctx.fillStyle = "#64748b"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("No expense data available", width / 2, height / 2)

    return
  }

  // Group expenses by category
  const categories = {}
  expenses.forEach((expense) => {
    if (!categories[expense.category]) {
      categories[expense.category] = 0
    }
    categories[expense.category] += expense.amount
  })

  // Prepare data for Chart.js
  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categories),
        backgroundColor: ["#4f46e5", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#6b7280"],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  }

  // Destroy existing chart instance if it exists
  if (window.expenseCategoryChart) {
    window.expenseCategoryChart.destroy()
  }

  // Create new chart instance
  window.expenseCategoryChart = new Chart(ctx, {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            color: "#333",
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          titleFont: {
            size: 16,
          },
          bodyFont: {
            size: 14,
          },
          callbacks: {
            label: (tooltipItem) => {
              const value = tooltipItem.raw
              const total = tooltipItem.chart._metasets[0].total
              const percentage = ((value / total) * 100).toFixed(2)
              return `${tooltipItem.label}: ₹${value} (${percentage}%)`
            },
          },
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        },
      },
    },
  })
}

// Render expense event chart
function renderExpenseEventChart(expenses, events) {
  const ctx = document.getElementById("expenses-event-chart").getContext("2d")

  // Check if expenses exist and have length
  if (!expenses || expenses.length === 0 || !events || events.length === 0) {
    // No data case - draw empty chart with message
    if (window.expenseEventChart) {
      window.expenseEventChart.destroy()
    }

    window.expenseEventChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["No Data"],
        datasets: [
          {
            data: [0],
            backgroundColor: ["#e5e7eb"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              display: false,
            },
            grid: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    })

    // Draw "No data available" text in the center
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    ctx.font = "14px Arial"
    ctx.fillStyle = "#64748b"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("No expense data available", width / 2, height / 2)

    return
  }

  // Group expenses by event
  const eventExpenses = {}
  expenses.forEach((expense) => {
    if (!eventExpenses[expense.eventId]) {
      eventExpenses[expense.eventId] = 0
    }
    eventExpenses[expense.eventId] += expense.amount
  })

  // Get event names
  const eventNames = {}
  events.forEach((event) => {
    eventNames[event._id || event.id] = event.name
  })

  // Prepare data for Chart.js
  const data = {
    labels: Object.keys(eventExpenses).map((eventId) => eventNames[eventId] || "Unknown Event"),
    datasets: [
      {
        label: "Expenses by Event",
        data: Object.values(eventExpenses),
        backgroundColor: "#4f46e5",
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  }

  // Destroy existing chart instance if it exists
  if (window.expenseEventChart) {
    window.expenseEventChart.destroy()
  }

  // Create new chart instance
  window.expenseEventChart = new Chart(ctx, {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Events",
          },
        },
        y: {
          title: {
            display: true,
            text: "Amount (₹)",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          titleFont: {
            size: 16,
          },
          bodyFont: {
            size: 14,
          },
          callbacks: {
            label: (tooltipItem) => `₹${tooltipItem.raw}`,
          },
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        },
      },
    },
  })
}

// Modify your renderExpenseTable function to include date
function renderExpenseTable(expenses, events) {
  const tableBody = document.getElementById("expense-table-body")
  tableBody.innerHTML = ""

  if (expenses.length === 0) {
    const row = document.createElement("tr")
    row.innerHTML = '<td colspan="5">No expenses found</td>'
    tableBody.appendChild(row)
    return
  }

  // Sort expenses by date (newest first)
  expenses.sort((a, b) => new Date(b.date) - new Date(a.date))

  expenses.forEach((expense) => {
    const event = events.find((e) => e._id === expense.eventId || e.id === expense.eventId)

    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${event ? event.name : "Unknown Event"}</td>
      <td>${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</td>
      <td>${expense.description}</td>
      <td>₹${expense.amount}</td>
      <td>${formatDate(new Date(expense.date))}</td>
    `

    tableBody.appendChild(row)
  })
}

// Save profile
function saveProfile() {
  const email = document.getElementById("profile-email").value.trim()
  const contact = document.getElementById("profile-contact").value.trim()
  const description = document.getElementById("profile-description").value.trim()

  // Validate email
  if (!isValidEmail(email)) {
    showToast("Error", "Please enter a valid email address", "error")
    return
  }

  // Save profile data
  const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))
  loggedInClub.email = email
  loggedInClub.contact = contact
  loggedInClub.description = description

  localStorage.setItem("loggedInClub", JSON.stringify(loggedInClub))

  showToast("Profile Saved", "Your profile has been updated successfully", "success")
}

// Change password
function changePassword() {
  const currentPassword = document.getElementById("current-password").value.trim()
  const newPassword = document.getElementById("new-password").value.trim()
  const confirmPassword = document.getElementById("confirm-password").value.trim()

  // Validate inputs
  if (!currentPassword || !newPassword || !confirmPassword) {
    showToast("Error", "Please fill in all password fields", "error")
    return
  }

  if (newPassword !== confirmPassword) {
    showToast("Error", "New password and confirm password do not match", "error")
    return
  }

  // Verify current password
  const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"))
  const clubs = JSON.parse(localStorage.getItem("clubs"))
  const clubIndex = clubs.findIndex((c) => c.id === loggedInClub.id)

  if (clubs[clubIndex].password !== currentPassword) {
    showToast("Error", "Current password is incorrect", "error")
    return
  }

  // Update password
  clubs[clubIndex].password = newPassword
  localStorage.setItem("clubs", JSON.stringify(clubs))

  // Clear password fields
  document.getElementById("current-password").value = ""
  document.getElementById("new-password").value = ""
  document.getElementById("confirm-password").value = ""

  showToast("Password Changed", "Your password has been changed successfully", "success")
}

// Show toast notification
function showToast(title, message, type = "info") {
  const toastContainer = document.getElementById("toast-container")

  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`

  let icon = ""
  switch (type) {
    case "success":
      icon = '<i class="fas fa-check-circle"></i>'
      break
    case "error":
      icon = '<i class="fas fa-exclamation-circle"></i>'
      break
    case "warning":
      icon = '<i class="fas fa-exclamation-triangle"></i>'
      break
    default:
      icon = '<i class="fas fa-info-circle"></i>'
  }

  toast.innerHTML = `
    <div class="toast-icon ${type}">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <div class="toast-close"><i class="fas fa-times"></i></div>
  `

  toastContainer.appendChild(toast)

  // Add event listener to close button
  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.style.opacity = "0"
    toast.style.transform = "translateX(100%)"

    setTimeout(() => {
      toast.remove()
    }, 300)
  })

  // Auto close after 5 seconds
  setTimeout(() => {
    toast.style.opacity = "0"
    toast.style.transform = "translateX(100%)"

    setTimeout(() => {
      toast.remove()
    }, 300)
  }, 5000)
}

// Helper function to format date
function formatDate(date) {
  const parsedDate = date instanceof Date ? date : new Date(date)
  if (isNaN(parsedDate)) {
    console.error("Invalid date passed to formatDate:", date)
    return "Invalid Date"
  }
  const options = { year: "numeric", month: "short", day: "numeric" }
  return parsedDate.toLocaleDateString("en-US", options)
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Initialize the application with sample data
document.addEventListener("DOMContentLoaded", () => {
  // Add event listener for update total budget button
  const updateTotalBudgetBtn = document.getElementById("update-total-budget-btn")
  if (updateTotalBudgetBtn) {
    updateTotalBudgetBtn.addEventListener("click", () => {
      const totalBudgetInput = document.getElementById("total-budget-input")
      const totalBudgetValue = Number.parseFloat(totalBudgetInput.value)

      if (isNaN(totalBudgetValue) || totalBudgetValue < 0) {
        showToast("Error", "Please enter a valid budget amount", "error")
        return
      }

      // Save to localStorage
      localStorage.setItem("totalBudget", totalBudgetValue.toString())

      // Update the display
      document.getElementById("budget-total").textContent = `₹${totalBudgetValue}`

      // Calculate and update remaining budget
      updateRemainingBudget()

      // Clear input
      totalBudgetInput.value = ""

      showToast("Budget Updated", `Total budget updated to ₹${totalBudgetValue}`, "success")
    })
  }

  // Load initial data
  initializeBudgetData()
  loadBudgetData()
})

// Setup enhanced event listeners for event creation form
function setupEnhancedEventListeners() {
  // Tab navigation
  const tabs = document.querySelectorAll(".modal-tabs .tab")
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")
      switchTab(tabId, this.parentElement)
    })
  })

  // Next and Previous buttons
  document.getElementById("next-tab-btn").addEventListener("click", goToNextTab)
  document.getElementById("prev-tab-btn").addEventListener("click", goToPrevTab)

  // Add "What to Expect" item
  document.getElementById("add-expect-item").addEventListener("click", addExpectItem)

  // Add Eligibility item
  document.getElementById("add-eligibility-item").addEventListener("click", addEligibilityItem)

  // Add Special Award
  document.getElementById("add-special-award").addEventListener("click", addSpecialAward)

  // Add Participant Perk
  document.getElementById("add-participant-perk").addEventListener("click", addParticipantPerk)

  // Add Sponsor
  document.getElementById("add-sponsor").addEventListener("click", addSponsor)

  // Add Schedule Day
  document.getElementById("add-schedule-day").addEventListener("click", addScheduleDay)

  // Add Schedule Item for initial day
  document.querySelector(".add-schedule-item").addEventListener("click", function () {
    const dayElement = this.closest(".schedule-day")
    const dayNumber = dayElement.getAttribute("data-day")
    addScheduleItem(dayElement, dayNumber)
  })

  // Add FAQ Item
  document.getElementById("add-faq-item").addEventListener("click", addFaqItem)

  // Setup remove buttons for initial items
  setupRemoveButtons()
}

// Go to next tab
function goToNextTab() {
  const activeTab = document.querySelector(".modal-tabs .tab.active")
  const tabs = Array.from(document.querySelectorAll(".modal-tabs .tab"))
  const currentIndex = tabs.indexOf(activeTab)

  if (currentIndex < tabs.length - 1) {
    const nextTab = tabs[currentIndex + 1]
    const tabId = nextTab.getAttribute("data-tab")
    switchTab(tabId, document.querySelector(".modal-tabs"))

    // Show/hide prev/next/submit buttons
    document.getElementById("prev-tab-btn").classList.remove("hidden")

    if (currentIndex + 1 === tabs.length - 1) {
      document.getElementById("next-tab-btn").classList.add("hidden")
      document.getElementById("create-event-submit").classList.remove("hidden")
    } else {
      document.getElementById("next-tab-btn").classList.remove("hidden")
      document.getElementById("create-event-submit").classList.add("hidden")
    }
  }
}

// Go to previous tab
function goToPrevTab() {
  const activeTab = document.querySelector(".modal-tabs .tab.active")
  const tabs = Array.from(document.querySelectorAll(".modal-tabs .tab"))
  const currentIndex = tabs.indexOf(activeTab)

  if (currentIndex > 0) {
    const prevTab = tabs[currentIndex - 1]
    const tabId = prevTab.getAttribute("data-tab")
    switchTab(tabId, document.querySelector(".modal-tabs"))

    // Show/hide prev/next/submit buttons
    document.getElementById("next-tab-btn").classList.remove("hidden")
    document.getElementById("create-event-submit").classList.add("hidden")

    if (currentIndex - 1 === 0) {
      document.getElementById("prev-tab-btn").classList.add("hidden")
    } else {
      document.getElementById("prev-tab-btn").classList.remove("hidden")
    }
  }
}

// Add "What to Expect" item
function addExpectItem() {
  const container = document.getElementById("expect-items-container")
  const newItem = document.createElement("div")
  newItem.className = "expect-item"
  newItem.innerHTML = `
    <div class="input-with-icon">
      <i class="fas fa-star"></i>
      <input type="text" class="expect-input" placeholder="Enter an expectation item">
    </div>
    <button class="remove-expect-item"><i class="fas fa-trash-alt"></i></button>
  `
  container.appendChild(newItem)

  // Add event listener to remove button
  newItem.querySelector(".remove-expect-item").addEventListener("click", () => {
    newItem.remove()
  })

  // Animate the new item
  animateNewElement(newItem)
}

// Add Eligibility item
function addEligibilityItem() {
  const container = document.getElementById("eligibility-items-container")
  const newItem = document.createElement("div")
  newItem.className = "eligibility-item"
  newItem.innerHTML = `
    <div class="input-with-icon">
      <i class="fas fa-check-circle"></i>
      <input type="text" class="eligibility-input" placeholder="Enter eligibility criteria">
    </div>
    <button class="remove-eligibility-item"><i class="fas fa-trash-alt"></i></button>
  `
  container.appendChild(newItem)

  // Add event listener to remove button
  newItem.querySelector(".remove-eligibility-item").addEventListener("click", () => {
    newItem.remove()
  })

  // Animate the new item
  animateNewElement(newItem)
}

// Add Special Award
function addSpecialAward() {
  const container = document.getElementById("special-awards-container")
  const awardCount = container.children.length + 1
  const newAward = document.createElement("div")
  newAward.className = "special-award"
  newAward.innerHTML = `
    <div class="prize-header">
      <h4><i class="fas fa-star" style="color: #f59e0b;"></i> Special Award ${awardCount}</h4>
    </div>
    <div class="form-group">
      <label>Award Name</label>
      <div class="input-with-icon">
        <i class="fas fa-trophy"></i>
        <input type="text" class="award-name" placeholder="Enter award name (e.g., Innovation Award)">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Amount (₹)</label>
        <div class="input-with-icon">
          <i class="fas fa-rupee-sign"></i>
          <input type="number" class="award-amount" min="0" value="0">
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea class="award-description" placeholder="Describe the special award"></textarea>
      </div>
    </div>
    <button class="remove-special-award"><i class="fas fa-trash-alt"></i></button>
  `
  container.appendChild(newAward)

  // Add event listener to remove button
  newAward.querySelector(".remove-special-award").addEventListener("click", () => {
    newAward.remove()
  })

  // Animate the new award
  animateNewElement(newAward)
}

// Add Participant Perk
function addParticipantPerk() {
  const container = document.getElementById("participant-perks-container")
  const newPerk = document.createElement("div")
  newPerk.className = "participant-perk"
  newPerk.innerHTML = `
    <div class="input-with-icon">
      <i class="fas fa-gift"></i>
      <input type="text" class="perk-input" placeholder="Enter perk (e.g., T-shirts, Certificates)">
    </div>
    <button class="remove-perk"><i class="fas fa-trash-alt"></i></button>
  `
  container.appendChild(newPerk)

  // Add event listener to remove button
  newPerk.querySelector(".remove-perk").addEventListener("click", () => {
    newPerk.remove()
  })

  // Animate the new perk
  animateNewElement(newPerk)
}

// Add Sponsor
function addSponsor() {
  const container = document.getElementById("sponsors-container")
  const sponsorCount = container.children.length + 1
  const newSponsor = document.createElement("div")
  newSponsor.className = "sponsor-item"
  newSponsor.innerHTML = `
    <div class="input-with-icon">
      <i class="fas fa-building"></i>
      <input type="text" class="sponsor-name" placeholder="Sponsor name">
    </div>
    <div class="file-input-container">
      <input type="file" id="sponsor-logo-${sponsorCount}" class="sponsor-logo" accept="image/*">
      <label for="sponsor-logo-${sponsorCount}" class="file-input-label">
        <i class="fas fa-upload"></i> Upload Logo
      </label>
    </div>
    <button class="remove-sponsor"><i class="fas fa-trash-alt"></i></button>
  `
  container.appendChild(newSponsor)

  // Add event listener to remove button
  newSponsor.querySelector(".remove-sponsor").addEventListener("click", () => {
    newSponsor.remove()
  })

  // Animate the new sponsor
  animateNewElement(newSponsor)
}

// Add Schedule Day
function addScheduleDay() {
  const container = document.getElementById("schedule-days-container")
  const dayCount = container.children.length + 1
  const newDay = document.createElement("div")
  newDay.className = "schedule-day"
  newDay.setAttribute("data-day", dayCount)
  newDay.innerHTML = `
    <div class="day-header">
      <h3>Day ${dayCount}</h3>
      <div class="input-with-icon">
        <i class="fas fa-calendar"></i>
        <input type="date" class="day-date">
      </div>
    </div>
    <div class="schedule-items-container">
      <!-- Schedule items will be added here -->
    </div>
    <button class="add-schedule-item btn-secondary">
      <i class="fas fa-plus"></i> Add Schedule Item
    </button>
  `
  container.appendChild(newDay)

  // Add event listener to add schedule item button
  newDay.querySelector(".add-schedule-item").addEventListener("click", () => {
    addScheduleItem(newDay, dayCount)
  })

  // Animate the new day
  animateNewElement(newDay)
}

// Add Schedule Item
function addScheduleItem(dayElement, dayNumber) {
  const container = dayElement.querySelector(".schedule-items-container")
  const newItem = document.createElement("div")
  newItem.className = "schedule-item"
  newItem.innerHTML = `
    <div class="schedule-time">
      <div class="input-with-icon">
        <i class="fas fa-clock"></i>
        <input type="time" class="item-time" placeholder="Time">
      </div>
    </div>
    <div class="schedule-details">
      <div class="input-with-icon">
        <i class="fas fa-heading"></i>
        <input type="text" class="item-title" placeholder="Event title (e.g., Registration, Workshop)">
      </div>
      <textarea class="item-description" placeholder="Additional details (e.g., location, speaker)"></textarea>
    </div>
    <button class="remove-schedule"><i class="fas fa-trash-alt"></i></button>
  `
  container.appendChild(newItem)

  // Add event listener to remove button
  newItem.querySelector(".remove-schedule").addEventListener("click", () => {
    newItem.remove()
  })

  // Animate the new item
  animateNewElement(newItem)
}

// Add FAQ
function addFaq() {
  const container = document.getElementById("faq-items-container")
  const newItem = document.createElement("div")
  newItem.className = "faq-item"
  newItem.innerHTML = `
    <div class="form-group">
      <label>Question</label>
      <div class="input-with-icon">
        <i class="fas fa-question-circle"></i>
        <input type="text" class="faq-question" placeholder="Enter a frequently asked question">
      </div>
    </div>
    <div class="form-group">
      <label>Answer</label>
      <textarea class="faq-answer" placeholder="Enter the answer to the question"></textarea>
    </div>
    <button class="remove-faq"><i class="fas fa-trash-alt"></i></button>
  `
  container.appendChild(newItem)

  // Add event listener to remove button
  newItem.querySelector(".remove-faq").addEventListener("click", () => {
    newItem.remove()
  })

  // Animate the new item
  animateNewElement(newItem)
}

// Add FAQ Item
function addFaqItem() {
  const container = document.getElementById("faq-items-container")
  const newItem = document.createElement("div")
  newItem.className = "faq-item"
  newItem.innerHTML = `
    <div class="form-group">
      <label>Question</label>
      <div class="input-with-icon">
        <i class="fas fa-question-circle"></i>
        <input type="text" class="faq-question" placeholder="Enter a frequently asked question">
      </div>
    </div>
    <div class="form-group">
      <label>Answer</label>
      <textarea class="faq-answer" placeholder="Enter the answer to the question"></textarea>
    </div>
    <button class="remove-faq"><i class="fas fa-trash-alt"></i></button>
  `
  container.appendChild(newItem)

  // Add event listener to remove button
  newItem.querySelector(".remove-faq").addEventListener("click", () => {
    newItem.remove()
  })

  // Animate the new item
  animateNewElement(newItem)
}

// Setup remove buttons
function setupRemoveButtons() {
  // Setup remove buttons for expect items
  document.querySelectorAll(".remove-expect-item").forEach((button) => {
    button.addEventListener("click", function () {
      this.closest(".expect-item").remove()
    })
  })

  // Setup remove buttons for eligibility items
  document.querySelectorAll(".remove-eligibility-item").forEach((button) => {
    button.addEventListener("click", function () {
      this.closest(".eligibility-item").remove()
    })
  })

  // Setup remove buttons for special awards
  document.querySelectorAll(".remove-special-award").forEach((button) => {
    button.addEventListener("click", function () {
      this.closest(".special-award").remove()
    })
  })

  // Setup remove buttons for participant perks
  document.querySelectorAll(".remove-perk").forEach((button) => {
    button.addEventListener("click", function () {
      this.closest(".participant-perk").remove()
    })
  })

  // Setup remove buttons for sponsors
  document.querySelectorAll(".remove-sponsor").forEach((button) => {
    button.addEventListener("click", function () {
      this.closest(".sponsor-item").remove()
    })
  })

  // Setup remove buttons for schedule items
  document.querySelectorAll(".remove-schedule").forEach((button) => {
    button.addEventListener("click", function () {
      this.closest(".schedule-item").remove()
    })
  })

  // Setup remove buttons for FAQs
  document.querySelectorAll(".remove-faq").forEach((button) => {
    button.addEventListener("click", function () {
      this.closest(".faq-item").remove()
    })
  })
}

// Animate new element
function animateNewElement(element) {
  element.style.opacity = "0"
  element.style.transform = "translateY(20px)"
  setTimeout(() => {
    element.style.transition = "opacity 0.3s ease, transform 0.3s ease"
    element.style.opacity = "1"
    element.style.transform = "translateY(0)"
  }, 10)
}

// Initialize the create event button
document.getElementById("create-event-btn").addEventListener("click", () => {
  openCreateEventModal()
  setupEnhancedEventListeners()
})

// Declare setupDetailModalListeners
function setupDetailModalListeners() {
  // Add your event detail modal listeners here
  console.log("Event ID:", eventId) // Add this to check the value
}

// Fetch events from server
async function fetchEvents(clubId) {
  try {
    const token = localStorage.getItem("authToken")
    const response = await fetch(`https://expensetracker-qppb.onrender.com/api/club-events?clubId=${clubId}`, {
      headers: {
        "x-auth-token": token,
      },
    })

    const data = await response.json()

    if (data.success) {
      return data.events
    } else {
      console.error("Failed to fetch events:", data.message)
      return []
    }
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

// Fetch expenses directly from server
async function fetchExpensesFromServer(clubId) {
  try {
    const token = localStorage.getItem("authToken")

    // First, get all events for this club
    const events = await fetchEvents(clubId)

    if (!events || events.length === 0) {
      return []
    }

    // Extract all expenses from events
    let allExpenses = []

    events.forEach((event) => {
      if (event.expenses && event.expenses.length > 0) {
        // Add eventId and clubId to each expense for reference
        const eventExpenses = event.expenses.map((expense) => ({
          ...expense,
          eventId: event._id || event.id,
          clubId: event.clubId,
          eventName: event.name,
          date: expense.createdAt || new Date().toISOString(),
        }))

        allExpenses = [...allExpenses, ...eventExpenses]
      }
    })

    return allExpenses
  } catch (error) {
    console.error("Error fetching expenses from server:", error)
    return []
  }
}

// Get the logged-in club's ID
function getLoggedInClubId() {
  const loggedInClub = localStorage.getItem("loggedInClub")
  if (loggedInClub) {
    const clubData = JSON.parse(loggedInClub)
    return clubData.id // Assuming the ID is stored as 'id'
  }
  console.error("No logged-in club found")
  return null
}

// Load dashboard data
async function loadDashboardData() {
  showLoader()

  try {
    const clubId = getLoggedInClubId()

    if (!clubId) {
      console.error("No logged-in club ID found. Cannot load dashboard data.")
      hideLoader()
      return
    }

    // Fetch events from server
    const events = await fetchEvents(clubId)

    // Fetch expenses from server
    const expenses = await fetchExpensesFromServer(clubId)

    // Calculate total expenses
    const totalExpenses = expenses.reduce((total, expense) => total + (expense.amount || 0), 0)

    // Get team registrations (if applicable)
    const teams = [] // You would need to implement fetchTeams() if needed

    // Calculate upcoming events
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const upcomingEvents = events.filter((event) => {
      const eventStartDate = new Date(event.startDate)
      return eventStartDate >= today
    })

    // Update dashboard stats with animation
    animateCounter("total-events", events.length)
    animateCounter("total-budget", totalExpenses, "₹")
    animateCounter("total-registrations", teams.length)
    animateCounter("upcoming-events", upcomingEvents.length)

    // Render charts
    renderBudgetChart(expenses)
    renderTimelineChart(events)
    renderUpcomingEvents(upcomingEvents)

    hideLoader()
  } catch (error) {
    console.error("Error loading dashboard data:", error)
    hideLoader()
  }
}

// Load events
async function loadEvents() {
  showLoader()

  try {
    const clubId = getLoggedInClubId()

    if (!clubId) {
      console.error("No logged-in club ID found. Cannot load events.")
      hideLoader()
      return
    }

    // Fetch events from server
    const events = await fetchEvents(clubId)

    // Render events
    renderEvents(events)

    // Render timeline chart
    renderTimelineChart(events)

    hideLoader()
  } catch (error) {
    console.error("Error loading events:", error)
    hideLoader()
  }
}

// Load budget data
async function loadBudgetData() {
  showLoader()

  try {
    const clubId = getLoggedInClubId()

    if (!clubId) {
      console.error("No logged-in club ID found. Cannot load budget data.")
      hideLoader()
      return
    }

    // Fetch expenses from server
    const expenses = await fetchExpensesFromServer(clubId)

    // Calculate total expenses
    const totalExpenses = expenses.reduce((total, expense) => total + (expense.amount || 0), 0)

    // Update budget stats with animation
    animateCounter("budget-total", totalExpenses, "₹")
    animateCounter("expenses-total", totalExpenses, "₹")
    animateCounter("budget-remaining", 0, "₹") // This would need to be calculated based on your budget logic

    // Fetch events for expense event chart
    const events = await fetchEvents(clubId)

    // Render expense charts
    renderExpenseCategoryChart(expenses)
    renderExpenseEventChart(expenses, events)

    // Render expense table
    renderExpenseTable(expenses, events)

    hideLoader()
  } catch (error) {
    console.error("Error loading budget data:", error)
    hideLoader()
  }
}

// Render expense table
function renderExpenseTable(expenses, events) {
  const tableBody = document.getElementById("expense-table-body")
  if (!tableBody) return

  tableBody.innerHTML = ""

  if (expenses.length === 0) {
    const row = document.createElement("tr")
    row.innerHTML = '<td colspan="5">No expenses found</td>'
    tableBody.appendChild(row)
    return
  }

  // Sort expenses by date (newest first)
  expenses.sort((a, b) => new Date(b.date) - new Date(a.date))

  expenses.forEach((expense) => {
    const event = events.find((e) => e._id === expense.eventId || e.id === expense.eventId)

    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${event ? event.name : "Unknown Event"}</td>
      <td>${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</td>
      <td>${expense.description}</td>
      <td>₹${expense.amount}</td>
      <td>${formatDate(new Date(expense.date))}</td>
    `

    tableBody.appendChild(row)
  })
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Add Chart.js script dynamically if not already included
  if (typeof Chart === "undefined") {
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/chart.js"
    script.onload = () => {
      console.log("Chart.js loaded successfully")
      // Initialize charts after Chart.js is loaded
      const clubId = getLoggedInClubId()
      if (clubId) {
        loadDashboardData()
      }
    }
    document.head.appendChild(script)
  } else {
    // If Chart.js is already loaded, initialize dashboard data
    const clubId = getLoggedInClubId()
    if (clubId) {
      loadDashboardData()
    }
  }
})

// Generate default email template based on team and event data
// Generate default email template based on team and event data
function generateDefaultEmailTemplate(team, event) {
  const teamName = team.teamName || "your team";
  const eventName = event?.name || "the event";
  const clubName = event?.clubId || "our club";

  // Map club IDs to readable names
  const clubMap = {
    osc: "Open Source Chandigarh",
    gfg: "GeeksForGeeks CUIET",
    ieee: "IEEE",
    coe: "Center of Excellence",
    explore: "Explore Labs",
    ceed: "CEED",
    // Add more if needed
  };

  const readableClub = clubMap[clubName] || clubName;

  return `Hi Team Members,

We're excited to let you know that your team "${teamName}" has been approved to participate in the event "${eventName}", proudly organized by ${readableClub}! 🥳

${team.projectIdea ? `Project Idea: ${team.projectIdea}` : ""}
${team.techStack ? `Tech Stack: ${team.techStack}` : ""}

Get ready to showcase your creativity and innovation! This is your moment. 🌟

Wishing you all the best,
${eventName} Team`;
}

// Function to open email customization modal with proper file handling
function openEmailCustomizationModal(team, event, teamId) {
  const modal = document.getElementById("email-customization-modal");
  const emailContent = document.getElementById("email-content");
  const attachmentsList = document.getElementById("attachments-list");
  const fileInput = document.getElementById("email-attachments");
  const fileNameDisplay = document.querySelector("#email-customization-modal .file-name");

  // Store the team ID for later use
  modal.setAttribute("data-team-id", teamId);

  // Generate default email content
  const defaultEmailContent = generateDefaultEmailTemplate(team, event);
  emailContent.value = defaultEmailContent;

  // Clear previous attachments
  attachmentsList.innerHTML = "";
  fileNameDisplay.textContent = "No files chosen";
  fileInput.value = "";

  // Handle file input change
  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      fileNameDisplay.textContent = `${this.files.length} file(s) selected`;

      // Display file names in the attachments list
      attachmentsList.innerHTML = "";
      Array.from(this.files).forEach(file => {
        const fileItem = document.createElement("div");
        fileItem.className = "attachment-item";
        fileItem.innerHTML = `
          <i class="fas fa-file"></i>
          <span>${file.name}</span>
          <span class="file-size">(${formatFileSize(file.size)})</span>
        `;
        attachmentsList.appendChild(fileItem);
      });
    } else {
      fileNameDisplay.textContent = "No files chosen";
      attachmentsList.innerHTML = "";
    }
  });

  // Handle use default email button
  document.getElementById("use-default-email").onclick = async () => {
    modal.style.display = "none";
    showLoader();
    try {
      await updateTeamStatus(teamId, "approved");
      showToast("Success", "Team approved with default email", "success");

      // Refresh team list
      const eventId = document.getElementById("event-detail-modal").getAttribute("data-event-id");
      loadRegisteredTeams(eventId);
    } catch (error) {
      console.error("Error approving team:", error);
      showToast("Error", "Failed to approve team", "error");
    } finally {
      hideLoader();
    }
  };

  // Handle send custom email button
  document.getElementById("send-custom-email").onclick = async () => {
    const customSubject = document.getElementById("email-subject").value;
    const customContent = emailContent.value;
    const attachmentFiles = fileInput.files;

    if (!customContent.trim()) {
      showToast("Error", "Email content cannot be empty", "error");
      return;
    }

    modal.style.display = "none";
    showLoader();

    try {
      // Create FormData object to handle file uploads
      const formData = new FormData();
      formData.append("subject", customSubject);
      formData.append("content", customContent);

      // Add all attachment files
      for (let i = 0; i < attachmentFiles.length; i++) {
        formData.append("attachments", attachmentFiles[i]);
      }

      // Send the custom email with attachments
      const token = localStorage.getItem("authToken");
      const response = await fetch(`https://expensetracker-qppb.onrender.com/api/team-registrations/${teamId}/custom-email`, {
        method: "POST",
        headers: {
          "x-auth-token": token,
          // Do NOT set Content-Type when using FormData
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        showToast("Success", "Team approved with custom email", "success");

        // Refresh the teams list
        const eventId = document.getElementById("event-detail-modal").getAttribute("data-event-id");
        loadRegisteredTeams(eventId);
      } else {
        showToast("Error", data.message || "Failed to send custom email", "error");
      }
    } catch (error) {
      console.error("Error sending custom email:", error);
      showToast("Error", "Failed to connect to server", "error");
    } finally {
      hideLoader();
    }
  };

  // Show the modal
  modal.style.display = "block";

  // Close modal when clicking the close button
  modal.querySelector(".close-modal").onclick = () => {
    modal.style.display = "none";
  };

  // Close modal when clicking outside
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}
// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Add CSS styles for the attachments list
const style = document.createElement("style")
style.textContent = `
  .attachments-list {
    margin-top: 10px;
    max-height: 150px;
    overflow-y: auto;
  }
  
  .attachment-item {
    display: flex;
    align-items: center;
    padding: 8px;
    background-color: #f5f5f5;
    border-radius: 4px;
    margin-bottom: 5px;
  }
  
  .attachment-item i {
    margin-right: 8px;
    color: #4f46e5;
  }
  
  .file-size {
    margin-left: auto;
    color: #6b7280;
    font-size: 0.85em;
  }
  
  .email-options {
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: flex-end;
  }
`
document.head.appendChild(style)

// Update the existing updateTeamStatus function to support custom emails
async function updateTeamStatus(teamId, newStatus, customEmail = null) {
  showLoader() // Show loader when starting the operation
  const token = localStorage.getItem("authToken")

  try {
    // First update the team status
    const response = await fetch(`https://expensetracker-qppb.onrender.com/api/team-registrations/${teamId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ status: newStatus }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Failed to update team status")
    }

    // If custom email data is provided and status is approved, send custom email
    if (customEmail && newStatus === "approved") {
      // In a real implementation, you would send the custom email data to the server
      console.log("Custom email would be sent:", customEmail)
    }

    showToast("Status Updated", `Team marked as ${newStatus}`, "success")

    // Refresh team list
    const eventId = document.getElementById("event-detail-modal").getAttribute("data-event-id")
    loadRegisteredTeams(eventId)

    return data
  } catch (error) {
    console.error("Error updating status:", error)
    showToast("Error", error.message || "Server issue", "error")
    throw error
  } finally {
    hideLoader() // Always hide loader when operation completes
  }
}
