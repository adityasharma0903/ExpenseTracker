// import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))

  if (!loggedInUser || loggedInUser.type !== "admin") {
    // Redirect to login page if not logged in as admin
    window.location.href = "login.html"
    return
  }

  // Global data store
  let dashboardData = null

  // Global chart objects
  window.charts = {
    clubExpensesChart: null,
    expenseCategoriesChart: null,
    monthlyExpensesChart: null,
    expenseDistributionChart: null,
    clubComparisonChart: null,
  }

  // DOM Elements
  // const sidebarToggle = document.getElementById("sidebarToggle")
  const mobileHeaderToggle = document.getElementById("mobileHeaderToggle");
  const sidebar = document.querySelector(".sidebar")
  const mainContent = document.querySelector(".main-content")
  const navItems = document.querySelectorAll(".nav-item")
  const tabContents = document.querySelectorAll(".tab-content")
  const profileDropdownBtn = document.getElementById("profileDropdownBtn")
  const profileDropdown = document.getElementById("profileDropdown")
  const logoutBtn = document.getElementById("logoutBtn")
  const logoutLink = document.getElementById("logoutLink")
  const currentDate = document.getElementById("currentDate")
  const viewAllButtons = document.querySelectorAll(".view-all-btn")
  const adminName = document.getElementById("adminName")

  // Event Details Modal Elements
  const eventDetailsModal = document.getElementById("eventDetailsModal")
  const closeEventDetailsModal = document.getElementById("closeEventDetailsModal")
  const closeEventDetailsBtn = document.getElementById("closeEventDetailsBtn")

  // Club Details Modal Elements
  const clubDetailsModal = document.getElementById("clubDetailsModal")
  const closeClubDetailsModal = document.getElementById("closeClubDetailsModal")
  const closeClubDetailsBtn = document.getElementById("closeClubDetailsBtn")

  // Toast Elements
  const toast = document.getElementById("toast")
  const toastClose = document.querySelector(".toast-close")

  // API Base URL
  const API_BASE_URL = "https://expensetracker-qppb.onrender.com/api"

  // Set admin name
  if (loggedInUser && loggedInUser.username) {
    adminName.textContent = loggedInUser.username
    document.querySelector(".profile-btn span").textContent = loggedInUser.username
  }

  // Set current date
  const now = new Date()
  currentDate.textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Mobile sidebar functionality
  function setupMobileSidebar() {
    const sidebarToggle = document.getElementById("sidebarToggle")
    const mobileHeaderToggle = document.getElementById("mobileHeaderToggle")
    const sidebar = document.querySelector(".sidebar")
    const mobileOverlay = document.getElementById("mobileOverlay")
    const mainContent = document.querySelector(".main-content")
  
    if (!sidebar) return
  
    // Handle sidebar toggle from within sidebar
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", () => {
        if (window.innerWidth <= 992) {
          sidebar.classList.toggle("active")
          if (mobileOverlay) {
            mobileOverlay.classList.toggle("active")
          }
        } else {
          sidebar.classList.toggle("collapsed")
          mainContent.classList.toggle("expanded")
        }
      })
    }
  
    // Handle mobile header toggle button
    if (mobileHeaderToggle) {
      mobileHeaderToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active")
        if (mobileOverlay) {
          mobileOverlay.classList.toggle("active")
        }
      })
    }
  
    // Close sidebar when overlay is clicked
    if (mobileOverlay) {
      mobileOverlay.addEventListener("click", () => {
        sidebar.classList.remove("active")
        mobileOverlay.classList.remove("active")
      })
    }
  
    // Close sidebar when nav items are clicked (on mobile)
    const navItems = document.querySelectorAll(".nav-item")
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (window.innerWidth <= 992) {
          sidebar.classList.remove("active")
          if (mobileOverlay) {
            mobileOverlay.classList.remove("active")
          }
        }
      })
    })
  
    // Handle window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        // Reset to desktop view
        sidebar.classList.remove("active")
        if (mobileOverlay) {
          mobileOverlay.classList.remove("active")
        }
      }
    })
  }

  // Call after DOM is loaded
  document.addEventListener("DOMContentLoaded", function () {
    setupMobileSidebar();
  });


  // Toggle sidebar
  mobileHeaderToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("expanded");
  });

  // Tab navigation
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()

      const tabId = this.getAttribute("data-tab")

      // Remove active class from all nav items and tab contents
      navItems.forEach((navItem) => navItem.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked nav item and corresponding tab content
      this.classList.add("active")
      document.getElementById(tabId).classList.add("active")

      // If expenses tab is selected, update charts
      if (tabId === "expenses" && dashboardData) {
        updateExpensesData()
      }

      // If events tab is selected, update events table
      if (tabId === "events" && dashboardData) {
        updateEventsTable()
      }

      // If clubs tab is selected, update clubs grid
      if (tabId === "clubs" && dashboardData) {
        updateClubsGrid()
      }
    })
  })



  async function fetchClubData(clubId) {
    try {
      const response = await fetch(`/api/events/club/${clubId}`);
      if (!response.ok) throw new Error("Failed to fetch club data");
      const data = await response.json();
      return data.events;
    } catch (err) {
      console.error("Error fetching club data:", err);
      return [];
    }
  }

  async function initializeDashboard() {
    const clubId = localStorage.getItem("clubId");

    if (!clubId) {
      console.error("No club ID found in localStorage");
      return;
    }

    try {
      const events = await fetchClubData(clubId);
      console.log("Fetched club events:", events);

      document.getElementById("total-events").textContent = events.length;

      let totalBudget = 0;
      let totalRegistrations = 0;
      let upcomingCount = 0;

      const today = new Date();

      events.forEach(event => {
        totalBudget += event.totalBudget || 0;
        if (new Date(event.startDate) > today) {
          upcomingCount++;
        }
      });

      document.getElementById("total-budget").textContent = `₹${totalBudget}`;
      document.getElementById("total-registrations").textContent = totalRegistrations;
      document.getElementById("upcoming-events").textContent = upcomingCount;

    } catch (err) {
      console.error("Dashboard init error:", err);
    }
  }




  // View All buttons
  viewAllButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Find the nav item with the corresponding data-tab attribute
      const navItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`)

      if (navItem) {
        navItem.click()
      }
    })
  })

  // Profile dropdown
  profileDropdownBtn.addEventListener("click", () => {
    profileDropdown.classList.toggle("active")
  })

  // Close profile dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!profileDropdownBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
      profileDropdown.classList.remove("active")
    }
  })

  // Logout functionality
  logoutBtn.addEventListener("click", logout)
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault()
    logout()
  })

  function logout() {
    localStorage.removeItem("loggedInUser")
    localStorage.removeItem("authToken")
    window.location.href = "login.html"
  }

  // Close Event Details Modal
  closeEventDetailsModal.addEventListener("click", () => {
    closeModal(eventDetailsModal)
  })

  closeEventDetailsBtn.addEventListener("click", () => {
    closeModal(eventDetailsModal)
  })

  // Close Club Details Modal
  closeClubDetailsModal.addEventListener("click", () => {
    closeModal(clubDetailsModal)
  })

  closeClubDetailsBtn.addEventListener("click", () => {
    closeModal(clubDetailsModal)
  })

  // Close Toast
  toastClose.addEventListener("click", () => {
    toast.classList.remove("active")
  })

  // Initialize Dashboard
  initializeDashboard()

  // Settings Form Submissions
  document.getElementById("adminProfileForm").addEventListener("submit", handleAdminProfileUpdate)
  document.getElementById("changePasswordForm").addEventListener("submit", handlePasswordChange)
  document.getElementById("notificationSettingsForm").addEventListener("submit", handleNotificationSettingsUpdate)
  document.getElementById("systemSettingsForm").addEventListener("submit", handleSystemSettingsUpdate)

  // Functions
  function initializeDashboard() {
    // Show loading state
    showToast("Loading", "Fetching dashboard data...", "info")

    // Fetch all clubs data
    fetchAllClubsData(clubId)
      .then((data) => {
        try {
          // Store data globally
          dashboardData = data

          // Update overview stats
          updateOverviewStats(data)

          // Initialize charts first
          initializeCharts(data)

          // Update recent events table
          updateRecentEventsTable()

          // Update clubs grid
          updateClubsGrid()

          // Update events table
          updateEventsTable()

          // Update expenses data after charts are initialized
          updateExpensesData()

          // Initialize calendar
          initializeCalendar(data)

          // Hide loading toast
          toast.classList.remove("active")
        } catch (error) {
          console.error("Error processing dashboard data:", error)
          showToast("Error", "Error processing dashboard data", "error")
        }
      })
      .catch((error) => {
        console.error("Error initializing dashboard:", error)
        showToast("Error", "Failed to initialize dashboard", "error")
      })
  }

  async function fetchAllClubsData() {
    try {
      const response = await fetch("https://expensetracker-qppb.onrender.com/api/admin/club-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("authToken") || "", // if using JWT
        },
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.clubData)) {
        return data.clubData;
      } else {
        console.error("Invalid response format from /club-data:", data);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch club data:", error);
      return [];
    }
  }


  // async function fetchClubData(clubId) {
  //   try {
  //     const response = await fetch(`/api/events/club/${clubId}`);
  //     if (!response.ok) throw new Error("Failed to fetch club data");
  //     const data = await response.json();
  //     return data.events;
  //   } catch (err) {
  //     console.error("Error fetching club data:", err);
  //     return [];
  //   }
  // }

  async function initializeDashboard() {
    showToast("Loading", "Fetching dashboard data...", "info");

    try {
      const data = await fetchAllClubsData();
      dashboardData = data;

      updateOverviewStats(data);
      initializeCharts(data);
      updateRecentEventsTable();
      updateClubsGrid();
      updateEventsTable();
      updateExpensesData();
      initializeCalendar(data);

      toast.classList.remove("active");
    } catch (err) {
      console.error("Dashboard initialization failed:", err);
      showToast("Error", "Failed to load dashboard data", "error");
    }
  }




  // async function fetchClubData(clubId) {
  //   try {
  //     const response = await fetch(`/api/events/club/${clubId}`);
  //     if (!response.ok) throw new Error("Failed to fetch club data");
  //     const data = await response.json();
  //     return data.events;
  //   } catch (err) {
  //     console.error("Error fetching club data:", err);
  //     return [];
  //   }
  // }


  // async function initializeDashboard() {
  //   const clubId = localStorage.getItem("clubId");

  //   if (!clubId) {
  //     console.error("No club ID found in localStorage");
  //     return;
  //   }

  //   try {
  //     const events = await fetchClubData(clubId);

  //     console.log("Fetched club events:", events);

  //     // ✅ Populate stats, chart, table, etc.
  //     document.getElementById("total-events").textContent = events.length;

  //     let totalBudget = 0;
  //     let totalRegistrations = 0;
  //     let upcomingCount = 0;

  //     const today = new Date();

  //     events.forEach(event => {
  //       totalBudget += event.totalBudget || 0;
  //       if (new Date(event.startDate) > today) {
  //         upcomingCount++;
  //       }
  //       // TODO: count registrations if available
  //     });

  //     document.getElementById("total-budget").textContent = `₹${totalBudget}`;
  //     document.getElementById("total-registrations").textContent = totalRegistrations;
  //     document.getElementById("upcoming-events").textContent = upcomingCount;

  //     // TODO: update charts and table with event data

  //   } catch (err) {
  //     console.error("Dashboard init error:", err);
  //   }
  // }



  function generateSampleData() {
    // Sample clubs
    const clubs = [
      { id: "osc", name: "Open Source Chandigarh" },
      { id: "ieee", name: "IEEE" },
      { id: "explore", name: "Explore Labs" },
      { id: "iei", name: "IE(I) CSE Student Chapter" },
      { id: "coe", name: "Center of Excellence" },
      { id: "ceed", name: "CEED" },
      { id: "bnb", name: "BIts N Bytes" },
      { id: "acm", name: "ACM Chapter" },
      { id: "gfg", name: "GFG CUIET" },
      { id: "gdg", name: "GDG CUIET" },
      { id: "cb", name: "Coding Blocks" },
      { id: "cn", name: "Coding Ninjas" },
      { id: "dgit", name: "DGIT Squad" },
      { id: "dice", name: "DICE" },
      { id: "hc", name: "Happiness Center" },
      { id: "nss", name: "NSS" },
    ]

    // Generate sample data for each club
    return clubs.map((club) => {
      // Generate random number of events (1-5)
      const numEvents = Math.floor(Math.random() * 5) + 1
      const events = []

      // Generate events
      for (let i = 0; i < numEvents; i++) {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) - 15) // Random date within ±15 days

        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 3) + 1) // 1-3 days after start date

        const expenses = []
        const categories = ["venue", "refreshments", "prizes", "equipment", "marketing", "other"]

        // Generate 1-3 expenses per event
        const numExpenses = Math.floor(Math.random() * 3) + 1
        let totalEventExpense = 0

        for (let j = 0; j < numExpenses; j++) {
          const amount = Math.floor(Math.random() * 5000) + 500 // Random amount between 500-5500
          totalEventExpense += amount

          expenses.push({
            category: categories[Math.floor(Math.random() * categories.length)],
            description: `Expense ${j + 1} for ${club.name} Event ${i + 1}`,
            amount: amount,
          })
        }

        events.push({
          _id: `event-${club.id}-${i}`,
          name: `${club.name} Event ${i + 1}`,
          description: `This is a sample event for ${club.name}`,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          startTime: "09:00",
          endTime: "17:00",
          venue: "University Campus",
          expenses: expenses,
          totalBudget: totalEventExpense,
          type: Math.random() > 0.5 ? "club" : "department",
        })
      }

      // Calculate total expenses
      let totalExpenses = 0
      events.forEach((event) => {
        event.expenses.forEach((expense) => {
          totalExpenses += expense.amount
        })
      })

      // Generate random number of registrations (5-20 per event)
      const totalRegistrations = events.length * (Math.floor(Math.random() * 16) + 5)

      // Count upcoming events
      const today = new Date()
      const upcomingEvents = events.filter((event) => new Date(event.endDate) >= today).length

      return {
        id: club.id,
        name: club.name,
        events: events,
        totalEvents: events.length,
        totalExpenses: totalExpenses,
        totalRegistrations: totalRegistrations,
        upcomingEvents: upcomingEvents,
      }
    })
  }

  function updateOverviewStats(data) {
    const totalClubs = document.getElementById("totalClubs")
    const totalEvents = document.getElementById("totalEvents")
    const totalExpenses = document.getElementById("totalExpenses")
    const totalRegistrations = document.getElementById("totalRegistrations")

    if (!totalClubs || !totalEvents || !totalExpenses || !totalRegistrations) {
      console.error("Overview stats elements not found")
      return
    }

    // Set total clubs
    totalClubs.textContent = data.length

    // Calculate total events
    let eventsSum = 0
    data.forEach((club) => {
      eventsSum += club.totalEvents
    })
    totalEvents.textContent = eventsSum

    // Calculate total expenses
    let expensesSum = 0
    data.forEach((club) => {
      expensesSum += club.totalExpenses
    })
    totalExpenses.textContent = formatCurrency(expensesSum)

    // Calculate total registrations
    let registrationsSum = 0
    data.forEach((club) => {
      registrationsSum += club.totalRegistrations
    })
    totalRegistrations.textContent = registrationsSum
  }

  function initializeCharts(data) {
    // Make sure Chart.js is available
    if (typeof Chart === "undefined") {
      console.error("Chart.js is not loaded. Please include Chart.js in your HTML.")
      showToast("Error", "Chart.js is not loaded", "error")
      return
    }

    try {
      // Destroy existing charts if they exist
      Object.values(window.charts).forEach((chart) => {
        if (chart) {
          chart.destroy()
        }
      })

      // Club Expenses Chart
      const clubExpensesCtx = document.getElementById("clubExpensesChart")
      if (!clubExpensesCtx) {
        console.error("clubExpensesChart canvas not found")
        return
      }

      const clubExpensesData = calculateExpensesByClub(data)
      window.charts.clubExpensesChart = new Chart(clubExpensesCtx.getContext("2d"), {
        type: "bar",
        data: {
          labels: clubExpensesData.clubs,
          datasets: [
            {
              label: "Total Expenses",
              data: clubExpensesData.amounts,
              backgroundColor: [
                "rgba(67, 97, 238, 0.7)",
                "rgba(76, 201, 240, 0.7)",
                "rgba(114, 9, 183, 0.7)",
                "rgba(243, 114, 44, 0.7)",
                "rgba(247, 37, 133, 0.7)",
                "rgba(58, 134, 255, 0.7)",
                "rgba(181, 23, 158, 0.7)",
                "rgba(0, 180, 216, 0.7)",
              ],
              borderColor: [
                "rgba(67, 97, 238, 1)",
                "rgba(76, 201, 240, 1)",
                "rgba(114, 9, 183, 1)",
                "rgba(243, 114, 44, 1)",
                "rgba(247, 37, 133, 1)",
                "rgba(58, 134, 255, 1)",
                "rgba(181, 23, 158, 1)",
                "rgba(0, 180, 216, 1)",
              ],
              borderWidth: 1,
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
                callback: (value) => "₹" + value,
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => "Total: " + formatCurrency(context.raw),
              },
            },
          },
        },
      })

      // Expense Categories Chart
      const expenseCategoriesCtx = document.getElementById("expenseCategoriesChart")
      if (!expenseCategoriesCtx) {
        console.error("expenseCategoriesChart canvas not found")
        return
      }

      const expenseCategoriesData = calculateExpensesByCategory(data)
      window.charts.expenseCategoriesChart = new Chart(expenseCategoriesCtx.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: expenseCategoriesData.categories,
          datasets: [
            {
              data: expenseCategoriesData.amounts,
              backgroundColor: [
                "rgba(67, 97, 238, 0.7)",
                "rgba(76, 201, 240, 0.7)",
                "rgba(114, 9, 183, 0.7)",
                "rgba(243, 114, 44, 0.7)",
                "rgba(247, 37, 133, 0.7)",
                "rgba(58, 134, 255, 0.7)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || ""
                  const value = context.raw || 0
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = Math.round((value / total) * 100)
                  return `${label}: ${formatCurrency(value)} (${percentage}%)`
                },
              },
            },
          },
        },
      })

      // Monthly Expenses Chart
      const monthlyExpensesCtx = document.getElementById("monthlyExpensesChart")
      if (!monthlyExpensesCtx) {
        console.error("monthlyExpensesChart canvas not found")
        return
      }

      const monthlyExpensesData = calculateExpensesByMonth(data)
      window.charts.monthlyExpensesChart = new Chart(monthlyExpensesCtx.getContext("2d"), {
        type: "line",
        data: {
          labels: monthlyExpensesData.months,
          datasets: [
            {
              label: "Total Expenses",
              data: monthlyExpensesData.amounts,
              backgroundColor: "rgba(67, 97, 238, 0.2)",
              borderColor: "rgba(67, 97, 238, 1)",
              borderWidth: 2,
              tension: 0.3,
              fill: true,
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
                callback: (value) => "₹" + value,
              },
            },
          },
        },
      })

      // Expense Distribution Chart
      const expenseDistributionCtx = document.getElementById("expenseDistributionChart")
      if (!expenseDistributionCtx) {
        console.error("expenseDistributionChart canvas not found")
        return
      }

      const expenseDistributionData = calculateExpensesByCategory(data)
      window.charts.expenseDistributionChart = new Chart(expenseDistributionCtx.getContext("2d"), {
        type: "pie",
        data: {
          labels: expenseDistributionData.categories,
          datasets: [
            {
              data: expenseDistributionData.amounts,
              backgroundColor: [
                "rgba(67, 97, 238, 0.7)",
                "rgba(76, 201, 240, 0.7)",
                "rgba(114, 9, 183, 0.7)",
                "rgba(243, 114, 44, 0.7)",
                "rgba(247, 37, 133, 0.7)",
                "rgba(58, 134, 255, 0.7)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
            },
          },
        },
      })

      // Club Comparison Chart
      const clubComparisonCtx = document.getElementById("clubComparisonChart")
      if (!clubComparisonCtx) {
        console.error("clubComparisonChart canvas not found")
        return
      }

      const clubComparisonData = calculateClubComparison(data)
      window.charts.clubComparisonChart = new Chart(clubComparisonCtx.getContext("2d"), {
        type: "bar",
        data: {
          labels: clubComparisonData.clubs,
          datasets: clubComparisonData.datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: {
                callback: (value) => "₹" + value,
              },
            },
          },
        },
      })

      // Add event listeners for chart filters
      setupChartFilterListeners()
    } catch (error) {
      console.error("Error initializing charts:", error)
      showToast("Error", "Failed to initialize charts", "error")
    }
  }

  function setupChartFilterListeners() {
    // Update charts when filters change
    const clubExpenseChartYear = document.getElementById("clubExpenseChartYear")
    if (clubExpenseChartYear) {
      clubExpenseChartYear.addEventListener("change", function () {
        updateClubExpensesChart(this.value)
      })
    }

    const expenseCategoryChartYear = document.getElementById("expenseCategoryChartYear")
    if (expenseCategoryChartYear) {
      expenseCategoryChartYear.addEventListener("change", function () {
        updateExpenseCategoriesChart(this.value)
      })
    }

    const expenseComparisonCategory = document.getElementById("expenseComparisonCategory")
    if (expenseComparisonCategory) {
      expenseComparisonCategory.addEventListener("change", function () {
        updateClubComparisonChart(this.value)
      })
    }

    const expenseTimeFilter = document.getElementById("expenseTimeFilter")
    if (expenseTimeFilter) {
      expenseTimeFilter.addEventListener("change", function () {
        updateExpensesData(this.value)
      })
    }

    const expenseClubFilter = document.getElementById("expenseClubFilter")
    if (expenseClubFilter) {
      expenseClubFilter.addEventListener("change", function () {
        const timeFilter = document.getElementById("expenseTimeFilter")?.value || "thisYear"
        updateExpensesData(timeFilter, this.value)
      })
    }

    const resetExpenseFilters = document.getElementById("resetExpenseFilters")
    if (resetExpenseFilters) {
      resetExpenseFilters.addEventListener("click", () => {
        if (document.getElementById("expenseTimeFilter")) {
          document.getElementById("expenseTimeFilter").value = "thisYear"
        }
        if (document.getElementById("expenseClubFilter")) {
          document.getElementById("expenseClubFilter").value = "all"
        }
        updateExpensesData("thisYear", "all")
      })
    }
  }

  function calculateExpensesByClub(data, year = new Date().getFullYear()) {
    const clubs = {}

    data.forEach((club) => {
      let totalExpenses = 0

      club.events.forEach((event) => {
        const eventDate = new Date(event.startDate)
        if (eventDate.getFullYear() === Number(year)) {
          if (event.expenses && Array.isArray(event.expenses)) {
            event.expenses.forEach((expense) => {
              totalExpenses += expense.amount
            })
          }
        }
      })

      clubs[club.name] = totalExpenses
    })

    // Sort clubs by expense amount (descending) and take top 8
    const sortedClubs = Object.entries(clubs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    return {
      clubs: sortedClubs.map((item) => item[0]),
      amounts: sortedClubs.map((item) => item[1]),
    }
  }

  function calculateExpensesByCategory(data, year = new Date().getFullYear(), clubId = "all") {
    const categories = {}

    data.forEach((club) => {
      if (clubId === "all" || club.id === clubId) {
        club.events.forEach((event) => {
          const eventDate = new Date(event.startDate)
          if (eventDate.getFullYear() === Number(year)) {
            if (event.expenses && Array.isArray(event.expenses)) {
              event.expenses.forEach((expense) => {
                if (!categories[expense.category]) {
                  categories[expense.category] = 0
                }
                categories[expense.category] += expense.amount
              })
            }
          }
        })
      }
    })

    // Sort categories by amount (descending)
    const sortedCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6) // Limit to top 6 categories

    return {
      categories: sortedCategories.map((item) => item[0]),
      amounts: sortedCategories.map((item) => item[1]),
    }
  }

  function calculateExpensesByMonth(data, year = new Date().getFullYear(), clubId = "all") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const amounts = Array(12).fill(0)

    data.forEach((club) => {
      if (clubId === "all" || club.id === clubId) {
        club.events.forEach((event) => {
          const eventDate = new Date(event.startDate)
          if (eventDate.getFullYear() === Number(year)) {
            if (event.expenses && Array.isArray(event.expenses)) {
              const month = eventDate.getMonth()
              event.expenses.forEach((expense) => {
                amounts[month] += expense.amount
              })
            }
          }
        })
      }
    })

    return {
      months: months,
      amounts: amounts,
    }
  }

  function calculateClubComparison(data, year = new Date().getFullYear(), selectedCategory = "all") {
    const clubs = data.map((club) => club.name)
    const categories = ["venue", "refreshments", "prizes", "equipment", "marketing", "other"]

    // Filter categories if a specific one is selected
    const filteredCategories = selectedCategory === "all" ? categories : [selectedCategory]

    // Create datasets for each category
    const datasets = filteredCategories.map((category, index) => {
      const colors = [
        "rgba(67, 97, 238, 0.7)",
        "rgba(76, 201, 240, 0.7)",
        "rgba(114, 9, 183, 0.7)",
        "rgba(243, 114, 44, 0.7)",
        "rgba(247, 37, 133, 0.7)",
        "rgba(58, 134, 255, 0.7)",
      ]

      const clubAmounts = data.map((club) => {
        let totalAmount = 0

        club.events.forEach((event) => {
          const eventDate = new Date(event.startDate)
          if (eventDate.getFullYear() === Number(year)) {
            if (event.expenses && Array.isArray(event.expenses)) {
              event.expenses.forEach((expense) => {
                if (expense.category === category) {
                  totalAmount += expense.amount
                }
              })
            }
          }
        })

        return totalAmount
      })

      return {
        label: category.charAt(0).toUpperCase() + category.slice(1),
        data: clubAmounts,
        backgroundColor: colors[index % colors.length],
        borderWidth: 1,
      }
    })

    return {
      clubs: clubs,
      datasets: datasets,
    }
  }

  function updateClubExpensesChart(year) {
    if (!dashboardData || !window.charts.clubExpensesChart) return

    const clubExpensesData = calculateExpensesByClub(dashboardData, year)

    window.charts.clubExpensesChart.data.labels = clubExpensesData.clubs
    window.charts.clubExpensesChart.data.datasets[0].data = clubExpensesData.amounts
    window.charts.clubExpensesChart.update()
  }

  function updateExpenseCategoriesChart(year) {
    if (!dashboardData || !window.charts.expenseCategoriesChart) return

    const expenseCategoriesData = calculateExpensesByCategory(dashboardData, year)

    window.charts.expenseCategoriesChart.data.labels = expenseCategoriesData.categories
    window.charts.expenseCategoriesChart.data.datasets[0].data = expenseCategoriesData.amounts
    window.charts.expenseCategoriesChart.update()
  }

  function updateClubComparisonChart(category) {
    if (!dashboardData || !window.charts.clubComparisonChart) return

    const clubComparisonData = calculateClubComparison(dashboardData, new Date().getFullYear(), category)

    window.charts.clubComparisonChart.data.labels = clubComparisonData.clubs
    window.charts.clubComparisonChart.data.datasets = clubComparisonData.datasets
    window.charts.clubComparisonChart.update()
  }

  function updateRecentEventsTable() {
    if (!dashboardData) return

    const recentEventsTable = document.getElementById("recentEventsTable")
    if (!recentEventsTable) {
      console.error("Recent events table not found")
      return
    }

    const tableBody = recentEventsTable.querySelector("tbody")
    if (!tableBody) {
      console.error("Recent events table body not found")
      return
    }

    tableBody.innerHTML = ""

    // Get all events from all clubs
    const allEvents = []
    dashboardData.forEach((club) => {
      club.events.forEach((event) => {
        allEvents.push({
          ...event,
          clubName: club.name,
          clubId: club.id,
        })
      })
    })

    // Sort events by date (most recent first)
    allEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

    // Take only the first 5 events
    const recentEvents = allEvents.slice(0, 5)

    if (recentEvents.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = `<td colspan="5" class="text-center">No events found</td>`
      tableBody.appendChild(row)
      return
    }

    recentEvents.forEach((event) => {
      const row = document.createElement("tr")

      // Calculate total expense for the event
      let totalExpense = 0
      if (event.expenses && Array.isArray(event.expenses)) {
        event.expenses.forEach((expense) => {
          totalExpense += expense.amount
        })
      }

      // Determine event status
      const status = getEventStatus(event)

      row.innerHTML = `
        <td>${event.name}</td>
        <td>${event.clubName}</td>
        <td>${formatDate(new Date(event.startDate))}</td>
        <td>${formatCurrency(totalExpense)}</td>
        <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
      `

      row.addEventListener("click", () => {
        openEventDetails(event)
      })

      tableBody.appendChild(row)
    })
  }

  function updateClubsGrid() {
    if (!dashboardData) return

    const clubGrid = document.getElementById("clubGrid")

    if (!clubGrid) {
      console.error("Club grid not found")
      return
    }

    clubGrid.innerHTML = ""

    if (dashboardData.length === 0) {
      clubGrid.innerHTML = '<p class="text-muted">No clubs found</p>'
      return
    }

    // Sort clubs by total events (most active first)
    dashboardData.sort((a, b) => b.totalEvents - a.totalEvents)

    dashboardData.forEach((club, index) => {
      const clubCard = document.createElement("div")
      clubCard.className = "club-card"
      clubCard.setAttribute("data-club-id", club.id)
      clubCard.style.opacity = "0"
      clubCard.style.transform = "translateY(20px)"

      // Calculate upcoming events
      const upcomingEvents = club.upcomingEvents

      clubCard.innerHTML = `
        <div class="club-header">
          <h3>${club.name}</h3>
          <p class="club-type">Club ID: ${club.id}</p>
        </div>
        <div class="club-content">
          <div class="club-stats">
            <div class="club-stat">
              <h4>${club.totalEvents}</h4>
              <p>Events</p>
            </div>
            <div class="club-stat">
              <h4>${formatCurrency(club.totalExpenses)}</h4>
              <p>Expenses</p>
            </div>
          </div>
          <div class="club-footer">
            <p>${upcomingEvents} upcoming events</p>
            <a href="#" class="view-btn">View Details</a>
          </div>
        </div>
      `

      clubGrid.appendChild(clubCard)

      // Animate card appearance
      setTimeout(
        () => {
          clubCard.style.transition = "opacity 0.5s ease, transform 0.5s ease"
          clubCard.style.opacity = "1"
          clubCard.style.transform = "translateY(0)"
        },
        100 + index * 100,
      )
    })

    // Add event listeners to view buttons
    setTimeout(() => {
      const viewButtons = document.querySelectorAll(".club-card .view-btn")
      viewButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
          e.preventDefault()
          const clubCard = this.closest(".club-card")
          const clubId = clubCard.getAttribute("data-club-id")
          showClubDetails(clubId)
        })
      })

      // Add click event to club cards
      const clubCards = document.querySelectorAll(".club-card")
      clubCards.forEach((card) => {
        card.addEventListener("click", function () {
          const clubId = this.getAttribute("data-club-id")
          showClubDetails(clubId)
        })
      })
    }, 500)

    // Add event listener to refresh button
    const refreshClubsBtn = document.getElementById("refreshClubsBtn")
    if (refreshClubsBtn) {
      refreshClubsBtn.addEventListener("click", () => {
        fetchAllClubsData()
          .then((data) => {
            dashboardData = data
            updateClubsGrid()
            showToast("Success", "Clubs data refreshed", "success")
          })
          .catch((error) => {
            console.error("Error refreshing clubs:", error)
            showToast("Error", "Failed to refresh clubs data", "error")
          })
      })
    }
  }

  function showClubDetails(clubId) {
    const selectedClubName = document.getElementById("selectedClubName")
    const clubContent = document.getElementById("clubContent")

    if (!selectedClubName || !clubContent || !clubDetailsModal) {
      console.error("Club details elements not found")
      return
    }

    // Find the club
    const club = dashboardData.find((c) => c.id === clubId)
    if (!club) {
      console.error("Club not found:", clubId)
      return
    }

    selectedClubName.textContent = club.name

    // Calculate expense categories
    const categories = {}
    club.events.forEach((event) => {
      if (event.expenses && Array.isArray(event.expenses)) {
        event.expenses.forEach((expense) => {
          if (categories[expense.category]) {
            categories[expense.category] += expense.amount
          } else {
            categories[expense.category] = expense.amount
          }
        })
      }
    })

    // Sort categories by amount
    const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1])

    // Create categories HTML
    let categoriesHtml = ""
    sortedCategories.forEach(([category, amount]) => {
      const percentage = Math.round((amount / club.totalExpenses) * 100)
      categoriesHtml += `
        <div class="expense-category-item">
          <div class="category-info">
            <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
            <span>${formatCurrency(amount)} (${percentage}%)</span>
          </div>
          <div class="category-bar">
            <div class="category-progress" style="width: ${percentage}%"></div>
          </div>
        </div>
      `
    })

    // Create events HTML
    let eventsHtml = ""
    const sortedEvents = [...club.events].sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

    sortedEvents.forEach((event) => {
      let eventExpenses = 0
      if (event.expenses && Array.isArray(event.expenses)) {
        event.expenses.forEach((expense) => {
          eventExpenses += expense.amount
        })
      }

      const status = getEventStatus(event)

      eventsHtml += `
        <tr>
          <td>${event.name}</td>
          <td>${formatDate(new Date(event.startDate))}</td>
          <td>${event.venue || "N/A"}</td>
          <td>${formatCurrency(eventExpenses)}</td>
          <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
        </tr>
      `
    })

    clubContent.innerHTML = `
      <div class="club-details-content">
        <div class="club-summary">
          <div class="summary-card">
            <div class="summary-icon blue">
              <i class="fas fa-calendar-check"></i>
            </div>
            <div class="summary-info">
              <h4>Total Events</h4>
              <p>${club.totalEvents}</p>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon purple">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="summary-info">
              <h4>Total Expenses</h4>
              <p>${formatCurrency(club.totalExpenses)}</p>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon green">
              <i class="fas fa-users"></i>
            </div>
            <div class="summary-info">
              <h4>Total Registrations</h4>
              <p>${club.totalRegistrations}</p>
            </div>
          </div>
        </div>

        <div class="club-expense-categories">
          <h4>Expense Categories</h4>
          <div class="expense-categories-list">
            ${categoriesHtml || '<p class="no-data">No expense data available</p>'}
          </div>
        </div>

        <div class="club-events">
          <h4>Recent Events</h4>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Expenses</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${eventsHtml || '<tr><td colspan="5" class="text-center">No events found</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  }

  function updateEventsTable() {
    if (!dashboardData) return

    const eventsTable = document.getElementById("eventsTable")
    if (!eventsTable) {
      console.error("Events table not found")
      return
    }

    const tableBody = eventsTable.querySelector("tbody")
    if (!tableBody) {
      console.error("Events table body not found")
      return
    }

    tableBody.innerHTML = ""

    // Get all events from all clubs
    const allEvents = []
    dashboardData.forEach((club) => {
      club.events.forEach((event) => {
        allEvents.push({
          ...event,
          clubName: club.name,
          clubId: club.id,
        })
      })
    })

    // Get filter values
    const searchTerm = document.getElementById("eventSearchInput")?.value?.toLowerCase() || ""
    const statusFilter = document.getElementById("eventStatusFilter")?.value || "all"
    const clubFilter = document.getElementById("eventClubFilter")?.value || "all"

    // Filter events
    let filteredEvents = [...allEvents]

    // Apply search filter
    if (searchTerm) {
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm) ||
          event.clubName.toLowerCase().includes(searchTerm) ||
          (event.venue && event.venue.toLowerCase().includes(searchTerm)),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const today = new Date()

      if (statusFilter === "upcoming") {
        filteredEvents = filteredEvents.filter((event) => {
          const startDate = new Date(event.startDate)
          return startDate > today
        })
      } else if (statusFilter === "ongoing") {
        filteredEvents = filteredEvents.filter((event) => {
          const startDate = new Date(event.startDate)
          const endDate = new Date(event.endDate)
          return startDate <= today && endDate >= today
        })
      } else if (statusFilter === "completed") {
        filteredEvents = filteredEvents.filter((event) => {
          const endDate = new Date(event.endDate)
          return endDate < today
        })
      }
    }

    // Apply club filter
    if (clubFilter !== "all") {
      filteredEvents = filteredEvents.filter((event) => event.clubId === clubFilter)
    }

    // Sort events by date (most recent first)
    filteredEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

    if (filteredEvents.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = `<td colspan="8" class="text-center">No events found</td>`
      tableBody.appendChild(row)
      return
    }

    filteredEvents.forEach((event) => {
      const row = document.createElement("tr")

      // Calculate total expense for the event
      let totalExpense = 0
      if (event.expenses && Array.isArray(event.expenses)) {
        event.expenses.forEach((expense) => {
          totalExpense += expense.amount
        })
      }

      // Determine event status
      const status = getEventStatus(event)

      row.innerHTML = `
        <td>${event.name}</td>
        <td>${event.clubName}</td>
        <td>${formatDate(new Date(event.startDate))}</td>
        <td>${formatDate(new Date(event.endDate))}</td>
        <td>${event.venue || "N/A"}</td>
        <td>${formatCurrency(totalExpense)}</td>
        <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
        <td>
          <button class="action-btn view-btn" title="View Details">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      `

      // Add event listener to view button
      const viewBtn = row.querySelector(".view-btn")
      viewBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        openEventDetails(event)
      })

      tableBody.appendChild(row)
    })

    // Add event listeners to filter controls
    const eventSearchInput = document.getElementById("eventSearchInput")
    if (eventSearchInput) {
      eventSearchInput.addEventListener("input", () => {
        updateEventsTable()
      })
    }

    const eventStatusFilter = document.getElementById("eventStatusFilter")
    if (eventStatusFilter) {
      eventStatusFilter.addEventListener("change", () => {
        updateEventsTable()
      })
    }

    const eventClubFilter = document.getElementById("eventClubFilter")
    if (eventClubFilter) {
      // Populate club options if not already done
      if (eventClubFilter.options.length <= 1) {
        dashboardData.forEach((club) => {
          const option = document.createElement("option")
          option.value = club.id
          option.textContent = club.name
          eventClubFilter.appendChild(option)
        })
      }

      eventClubFilter.addEventListener("change", () => {
        updateEventsTable()
      })
    }

    const resetEventFilters = document.getElementById("resetEventFilters")
    if (resetEventFilters) {
      resetEventFilters.addEventListener("click", () => {
        if (document.getElementById("eventSearchInput")) {
          document.getElementById("eventSearchInput").value = ""
        }
        if (document.getElementById("eventStatusFilter")) {
          document.getElementById("eventStatusFilter").value = "all"
        }
        if (document.getElementById("eventClubFilter")) {
          document.getElementById("eventClubFilter").value = "all"
        }
        updateEventsTable()
      })
    }
  }

  function updateExpensesData(timeFilter = "thisYear", clubFilter = "all") {
    if (!dashboardData) return

    // Get all expenses from all clubs
    const allExpenses = []
    dashboardData.forEach((club) => {
      club.events.forEach((event) => {
        if (event.expenses && Array.isArray(event.expenses)) {
          event.expenses.forEach((expense) => {
            allExpenses.push({
              ...expense,
              eventId: event._id || event.id,
              eventName: event.name,
              clubId: club.id,
              clubName: club.name,
              date: event.startDate,
            })
          })
        }
      })
    })

    // Filter expenses based on time period
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    let filteredExpenses = [...allExpenses]

    if (timeFilter === "thisMonth") {
      filteredExpenses = filteredExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
      })
    } else if (timeFilter === "lastMonth") {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

      filteredExpenses = filteredExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear
      })
    } else if (timeFilter === "thisYear") {
      filteredExpenses = filteredExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getFullYear() === currentYear
      })
    } else if (timeFilter === "lastYear") {
      filteredExpenses = filteredExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getFullYear() === currentYear - 1
      })
    }

    // Filter by club if specified
    if (clubFilter !== "all") {
      filteredExpenses = filteredExpenses.filter((expense) => expense.clubId === clubFilter)
    }

    // Update expense summary cards
    updateExpenseSummaryCards(filteredExpenses)

    // Update expense charts
    updateExpenseCharts(filteredExpenses)

    // Update expenses table
    updateExpensesTable(filteredExpenses)
  }

  function updateExpenseSummaryCards(expenses) {
    const expenseTotal = document.getElementById("expenseTotal")
    const expenseAverage = document.getElementById("expenseAverage")
    const expenseLowest = document.getElementById("expenseLowest")
    const expenseHighest = document.getElementById("expenseHighest")

    if (!expenseTotal || !expenseAverage || !expenseLowest || !expenseHighest) {
      console.error("Expense summary elements not found")
      return
    }

    // Calculate total
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    expenseTotal.textContent = formatCurrency(total)

    // Group expenses by event
    const eventExpenses = {}
    expenses.forEach((expense) => {
      if (eventExpenses[expense.eventId]) {
        eventExpenses[expense.eventId] += expense.amount
      } else {
        eventExpenses[expense.eventId] = expense.amount
      }
    })

    const eventAmounts = Object.values(eventExpenses)

    // Calculate average per event
    const average = eventAmounts.length > 0 ? total / eventAmounts.length : 0
    expenseAverage.textContent = formatCurrency(average)

    // Calculate lowest expense
    const lowest = eventAmounts.length > 0 ? Math.min(...eventAmounts) : 0
    expenseLowest.textContent = formatCurrency(lowest)

    // Calculate highest expense
    const highest = eventAmounts.length > 0 ? Math.max(...eventAmounts) : 0
    expenseHighest.textContent = formatCurrency(highest)
  }

  function updateExpenseCharts(expenses) {
    // Group expenses by category
    const categoriesMap = {}
    expenses.forEach((expense) => {
      if (categoriesMap[expense.category]) {
        categoriesMap[expense.category] += expense.amount
      } else {
        categoriesMap[expense.category] = expense.amount
      }
    })

    const sortedCategories = Object.entries(categoriesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)

    const categories = sortedCategories.map((item) => item[0])
    const amounts = sortedCategories.map((item) => item[1])

    // Update expense distribution chart
    if (window.charts.expenseDistributionChart) {
      window.charts.expenseDistributionChart.data.labels = categories
      window.charts.expenseDistributionChart.data.datasets[0].data = amounts
      window.charts.expenseDistributionChart.update()
    }

    // Group expenses by month
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthlyAmounts = Array(12).fill(0)

    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      const month = date.getMonth()
      monthlyAmounts[month] += expense.amount
    })

    // Update monthly expenses chart
    if (window.charts.monthlyExpensesChart) {
      window.charts.monthlyExpensesChart.data.labels = months
      window.charts.monthlyExpensesChart.data.datasets[0].data = monthlyAmounts
      window.charts.monthlyExpensesChart.update()
    }
  }

  function updateExpensesTable(expenses) {
    const expensesTable = document.getElementById("expensesTable")
    if (!expensesTable) {
      console.error("Expenses table not found")
      return
    }

    const tableBody = expensesTable.querySelector("tbody")
    if (!tableBody) {
      console.error("Expenses table body not found")
      return
    }

    tableBody.innerHTML = ""

    // Get filter values
    const searchTerm = document.getElementById("expenseSearchInput")?.value?.toLowerCase() || ""
    const categoryFilter = document.getElementById("expenseCategoryFilter")?.value || "all"

    // Filter expenses
    let filteredExpenses = [...expenses]

    // Apply search filter
    if (searchTerm) {
      filteredExpenses = filteredExpenses.filter(
        (expense) =>
          expense.eventName.toLowerCase().includes(searchTerm) ||
          expense.category.toLowerCase().includes(searchTerm) ||
          expense.clubName.toLowerCase().includes(searchTerm),
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filteredExpenses = filteredExpenses.filter((expense) => expense.category === categoryFilter)
    }

    // Sort expenses by date (most recent first)
    filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date))

    if (filteredExpenses.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = `<td colspan="5" class="text-center">No expenses found</td>`
      tableBody.appendChild(row)
      return
    }

    filteredExpenses.forEach((expense) => {
      const row = document.createElement("tr")

      row.innerHTML = `
        <td>${expense.clubName}</td>
        <td>${expense.eventName}</td>
        <td>${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</td>
        <td>${formatCurrency(expense.amount)}</td>
        <td>${formatDate(new Date(expense.date))}</td>
      `

      tableBody.appendChild(row)
    })

    // Add event listeners to filter controls
    const searchInput = document.getElementById("expenseSearchInput")
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        updateExpensesTable(expenses)
      })
    }

    const categoryFilterElement = document.getElementById("expenseCategoryFilter")
    if (categoryFilterElement) {
      categoryFilterElement.addEventListener("change", () => {
        updateExpensesTable(expenses)
      })
    }
  }

  function initializeCalendar(data) {
    const calendarMonth = document.getElementById("calendarMonth")
    const eventsCalendar = document.getElementById("eventsCalendar")
    const prevMonthBtn = document.getElementById("prevMonth")
    const nextMonthBtn = document.getElementById("nextMonth")

    if (!calendarMonth || !eventsCalendar || !prevMonthBtn || !nextMonthBtn) {
      console.error("Calendar elements not found")
      return
    }

    const currentDate = new Date()

    // Render calendar for current month
    renderCalendar(currentDate)

    // Add event listeners to navigation buttons
    prevMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1)
      renderCalendar(currentDate)
    })

    nextMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1)
      renderCalendar(currentDate)
    })

    function renderCalendar(date) {
      const year = date.getFullYear()
      const month = date.getMonth()

      // Set calendar month title
      calendarMonth.textContent = new Date(year, month, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })

      // Get first day of month and total days in month
      const firstDay = new Date(year, month, 1).getDay()
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      // Get days from previous month
      const daysInPrevMonth = new Date(year, month, 0).getDate()

      // Create calendar grid
      let calendarHtml = `
        <div class="calendar-grid">
          <div class="calendar-day-header">Sun</div>
          <div class="calendar-day-header">Mon</div>
          <div class="calendar-day-header">Tue</div>
          <div class="calendar-day-header">Wed</div>
          <div class="calendar-day-header">Thu</div>
          <div class="calendar-day-header">Fri</div>
          <div class="calendar-day-header">Sat</div>
      `

      // Add days from previous month
      for (let i = firstDay - 1; i >= 0; i--) {
        const prevMonthDay = daysInPrevMonth - i
        calendarHtml += `
          <div class="calendar-day other-month">
            <div class="calendar-day-number">${prevMonthDay}</div>
          </div>
        `
      }

      // Add days of current month
      const today = new Date()
      for (let day = 1; day <= daysInMonth; day++) {
        const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year

        // Get events for this day
        const currentDay = new Date(year, month, day)
        const dayEvents = []

        // Collect events from all clubs
        data.forEach((club) => {
          club.events.forEach((event) => {
            const startDate = new Date(event.startDate)
            const endDate = new Date(event.endDate)
            if (currentDay >= startDate && currentDay <= endDate) {
              dayEvents.push({
                ...event,
                clubName: club.name,
                clubId: club.id,
              })
            }
          })
        })

        // Create events HTML
        let eventsHtml = ""
        dayEvents.slice(0, 3).forEach((event) => {
          const clubClass = event.clubId.toLowerCase().replace(" ", "-")
          eventsHtml += `
            <div class="calendar-event ${clubClass}" data-event-id="${event._id || event.id}">
              ${event.name}
            </div>
          `
        })

        if (dayEvents.length > 3) {
          eventsHtml += `
            <div class="calendar-event-more">
              +${dayEvents.length - 3} more
            </div>
          `
        }

        calendarHtml += `
          <div class="calendar-day ${isToday ? "today" : ""}">
            <div class="calendar-day-number">${day}</div>
            <div class="calendar-events">
              ${eventsHtml}
            </div>
          </div>
        `
      }

      // Add days from next month
      const totalCells = 42 // 6 rows x 7 days
      const cellsUsed = firstDay + daysInMonth
      const nextMonthDays = totalCells - cellsUsed

      for (let day = 1; day <= nextMonthDays; day++) {
        calendarHtml += `
          <div class="calendar-day other-month">
            <div class="calendar-day-number">${day}</div>
          </div>
        `
      }

      calendarHtml += `</div>`

      // Set calendar HTML
      eventsCalendar.innerHTML = calendarHtml

      // Add event listeners to calendar events
      const calendarEvents = document.querySelectorAll(".calendar-event")
      calendarEvents.forEach((eventEl) => {
        eventEl.addEventListener("click", (e) => {
          e.stopPropagation()
          const eventId = eventEl.getAttribute("data-event-id")

          // Find the event in all clubs
          let foundEvent = null
          data.forEach((club) => {
            const event = club.events.find((e) => e._id === eventId || e.id === eventId)
            if (event) {
              foundEvent = {
                ...event,
                clubName: club.name,
                clubId: club.id,
              }
            }
          })

          if (foundEvent) {
            openEventDetails(foundEvent)
          }
        })
      })
    }
  }

  function openEventDetails(event) {
    const eventDetailsTitle = document.getElementById("eventDetailsTitle")
    const eventDetailsContent = document.getElementById("eventDetailsContent")

    if (!eventDetailsTitle || !eventDetailsContent || !eventDetailsModal) {
      console.error("Event details elements not found")
      return
    }

    eventDetailsTitle.textContent = event.name

    // Calculate total expense
    let totalExpense = 0
    if (event.expenses && Array.isArray(event.expenses)) {
      event.expenses.forEach((expense) => {
        totalExpense += expense.amount
      })
    }

    // Determine event status
    const status = getEventStatus(event)

    // Format expenses table
    let expensesHtml = ""
    if (event.expenses && Array.isArray(event.expenses)) {
      event.expenses.forEach((expense) => {
        expensesHtml += `
          <tr>
            <td>${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</td>
            <td>${expense.description}</td>
            <td>${formatCurrency(expense.amount)}</td>
          </tr>
        `
      })
    }

    eventDetailsContent.innerHTML = `
      <div class="event-details">
        <div class="event-info">
          <p><strong>Club:</strong> ${event.clubName}</p>
          <p><strong>Date:</strong> ${formatDate(new Date(event.startDate))} to ${formatDate(new Date(event.endDate))}</p>
          <p><strong>Time:</strong> ${event.startTime || "N/A"} to ${event.endTime || "N/A"}</p>
          <p><strong>Venue:</strong> ${event.venue || "N/A"}</p>
          <p><strong>Status:</strong> <span class="status-badge ${status.toLowerCase()}">${status}</span></p>
          <p><strong>Total Expense:</strong> ${formatCurrency(totalExpense)}</p>
        </div>
        
        <div class="event-description">
          <h4>Description</h4>
          <p>${event.description || "No description provided."}</p>
        </div>
        
        <div class="event-expenses">
          <h4>Expenses</h4>
          <table class="expenses-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${expensesHtml || '<tr><td colspan="3" class="text-center">No expenses found</td></tr>'}
              <tr class="total-row">
                <td colspan="2"><strong>Total</strong></td>
                <td><strong>${formatCurrency(totalExpense)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `

    // Show modal
    openModal(eventDetailsModal)
  }

  // Settings Form Handlers
  function handleAdminProfileUpdate(e) {
    e.preventDefault()

    const email = document.getElementById("adminEmail")?.value || ""
    const fullName = document.getElementById("adminFullName")?.value || ""

    if (!email || !fullName) {
      showToast("Error", "Please fill in all fields", "error")
      return
    }

    // In a real application, you would send this data to the server
    // For now, we'll just update the UI and show a success message

    // Update admin name in the sidebar
    adminName.textContent = fullName

    // Update profile dropdown
    document.querySelector(".profile-btn span").textContent = fullName

    // Show success message
    showToast("Success", "Profile updated successfully", "success")
  }

  function handlePasswordChange(e) {
    e.preventDefault()

    const currentPassword = document.getElementById("currentPassword")?.value
    const newPassword = document.getElementById("newPassword")?.value
    const confirmPassword = document.getElementById("confirmPassword")?.value

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Error", "All fields are required", "error")
      return
    }

    if (newPassword !== confirmPassword) {
      showToast("Error", "New passwords do not match", "error")
      return
    }

    // In a real application, you would send this data to the server
    // For now, we'll just show a success message

    // Clear form
    document.getElementById("currentPassword").value = ""
    document.getElementById("newPassword").value = ""
    document.getElementById("confirmPassword").value = ""

    // Show success message
    showToast("Success", "Password updated successfully", "success")
  }

  function handleNotificationSettingsUpdate(e) {
    e.preventDefault()

    // In a real application, you would send this data to the server
    // For now, we'll just show a success message

    // Show success message
    showToast("Success", "Notification preferences saved", "success")
  }

  function handleSystemSettingsUpdate(e) {
    e.preventDefault()

    // In a real application, you would send this data to the server
    // For now, we'll just show a success message

    // Show success message
    showToast("Success", "System settings updated", "success")
  }

  function getEventStatus(event) {
    const today = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)

    if (endDate < today) {
      return "Completed"
    } else if (startDate <= today && endDate >= today) {
      return "Ongoing"
    } else {
      return "Upcoming"
    }
  }

  function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "Invalid Date"
    }

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  function formatCurrency(amount) {
    return "₹" + new Intl.NumberFormat("en-IN").format(Math.round(amount))
  }

  function openModal(modal) {
    if (modal) {
      modal.style.display = "block"
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.style.display = "none"
    }
  }

  function showToast(title, message, type = "success") {
    const toast = document.getElementById("toast")
    const toastTitle = document.getElementById("toastTitle")
    const toastMessage = document.getElementById("toastMessage")
    const toastIcon = document.getElementById("toastIcon")

    if (!toast || !toastTitle || !toastMessage || !toastIcon) {
      console.error("Toast elements not found")
      return
    }

    toastTitle.textContent = title
    toastMessage.textContent = message

    // Set icon based on type
    toastIcon.innerHTML = ""
    if (type === "success") {
      toastIcon.innerHTML = '<i class="fas fa-check-circle"></i>'
      toastIcon.className = "toast-icon success"
    } else if (type === "error") {
      toastIcon.innerHTML = '<i class="fas fa-times-circle"></i>'
      toastIcon.className = "toast-icon error"
    } else if (type === "warning") {
      toastIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>'
      toastIcon.className = "toast-icon warning"
    } else if (type === "info") {
      toastIcon.innerHTML = '<i class="fas fa-info-circle"></i>'
      toastIcon.className = "toast-icon info"
    }

    // Show toast
    toast.classList.add("active")

    // Auto-hide after 5 seconds
    setTimeout(() => {
      toast.classList.remove("active")
    }, 5000)
  }
})

window.addEventListener("DOMContentLoaded", async () => {
  // const events = await fetchClubData(clubId);
});

async function fetchAllClubsData() {
  try {
    const response = await fetch("https://expensetracker-qppb.onrender.com/api/admin/club-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("authToken") || "",
      },
    });

    const data = await response.json();
    return data.clubData || [];
  } catch (err) {
    console.error("Failed to fetch club data:", err);
    return [];
  }
}

async function initializeDashboard() {
  const data = await fetchAllClubsData();
  console.log(data);
}



