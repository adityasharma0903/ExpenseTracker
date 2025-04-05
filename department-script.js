// import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))

  if (!loggedInUser || loggedInUser.type !== "department") {
    // Redirect to login page if not logged in as department
    window.location.href = "login.html"
    return
  }

  // Set department theme based on department
  const department = loggedInUser.department
  document.body.classList.add(getDepartmentThemeClass(department))

  // Initialize department data if not exists
  initializeDepartmentData(department)

  // DOM Elements
  const departmentName = document.getElementById("departmentName")
  const departmentId = document.getElementById("departmentId")
  const currentDate = document.getElementById("currentDate")
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebar = document.querySelector(".sidebar")
  const mainContent = document.querySelector(".main-content")
  const navItems = document.querySelectorAll(".nav-item")
  const tabContents = document.querySelectorAll(".tab-content")
  const profileDropdownBtn = document.getElementById("profileDropdownBtn")
  const profileDropdown = document.getElementById("profileDropdown")
  const logoutBtn = document.getElementById("logoutBtn")
  const logoutLink = document.getElementById("logoutLink")

  // Event Form Elements
  const createEventBtn = document.getElementById("createEventBtn")
  const eventFormModal = document.getElementById("eventFormModal")
  const closeEventModal = document.getElementById("closeEventModal")
  const eventForm = document.getElementById("eventForm")
  const eventFormTitle = document.getElementById("eventFormTitle")
  const eventId = document.getElementById("eventId")
  const cancelEventBtn = document.getElementById("cancelEventBtn")
  const addExpenseBtn = document.getElementById("addExpenseBtn")
  const expenseItems = document.getElementById("expenseItems")

  // Event Details Modal Elements
  const eventDetailsModal = document.getElementById("eventDetailsModal")
  const closeEventDetailsModal = document.getElementById("closeEventDetailsModal")
  const eventDetailsTitle = document.getElementById("eventDetailsTitle")
  const eventDetailsContent = document.getElementById("eventDetailsContent")
  const editEventBtn = document.getElementById("editEventBtn")
  const deleteEventBtn = document.getElementById("deleteEventBtn")

  // Confirmation Modal Elements
  const confirmationModal = document.getElementById("confirmationModal")
  const closeConfirmationModal = document.getElementById("closeConfirmationModal")
  const confirmationTitle = document.getElementById("confirmationTitle")
  const confirmationMessage = document.getElementById("confirmationMessage")
  const cancelConfirmationBtn = document.getElementById("cancelConfirmationBtn")
  const confirmBtn = document.getElementById("confirmBtn")

  // Event Filters
  const eventSearchInput = document.getElementById("eventSearchInput")
  const eventStatusFilter = document.getElementById("eventStatusFilter")
  const eventDateFilter = document.getElementById("eventDateFilter")
  const resetEventFilters = document.getElementById("resetEventFilters")

  // Expense Filters
  const expenseCategoryFilter = document.getElementById("expenseCategoryFilter")
  const expenseEventFilter = document.getElementById("expenseEventFilter")
  const resetExpenseFilters = document.getElementById("resetExpenseFilters")
  const expensesMonthFilter = document.getElementById("expensesMonthFilter")

  // Set department info
  departmentName.textContent = department
  departmentId.textContent = loggedInUser.id

  // Set current date
  const now = new Date()
  currentDate.textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Set current month for expenses filter
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  expensesMonthFilter.value = currentMonth

  // Toggle sidebar
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed")
    sidebar.classList.toggle("expanded")
    mainContent.classList.toggle("expanded")
  })

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
      if (tabId === "expenses") {
        updateExpensesData()
      }

      // If events tab is selected, update events table
      if (tabId === "events") {
        updateEventsTable()
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
    window.location.href = "login.html"
  }

  // Create Event Button
  createEventBtn.addEventListener("click", () => {
    openEventForm()
  })

  // Close Event Modal
  closeEventModal.addEventListener("click", () => {
    closeModal(eventFormModal)
  })

  // Cancel Event Button
  cancelEventBtn.addEventListener("click", () => {
    closeModal(eventFormModal)
  })

  // Close Event Details Modal
  closeEventDetailsModal.addEventListener("click", () => {
    closeModal(eventDetailsModal)
  })

  // Close Confirmation Modal
  closeConfirmationModal.addEventListener("click", () => {
    closeModal(confirmationModal)
  })

  // Cancel Confirmation Button
  cancelConfirmationBtn.addEventListener("click", () => {
    closeModal(confirmationModal)
  })

  // Add Expense Button
  addExpenseBtn.addEventListener("click", () => {
    addExpenseItem()
  })

  // Event Form Submission
  eventForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveEvent()
  })

  // Edit Event Button
  editEventBtn.addEventListener("click", function () {
    const eventId = this.getAttribute("data-event-id")
    openEventForm(eventId)
    closeModal(eventDetailsModal)
  })

  // Delete Event Button
  deleteEventBtn.addEventListener("click", function () {
    const eventId = this.getAttribute("data-event-id")
    openConfirmationModal(
      "Delete Event",
      "Are you sure you want to delete this event? This action cannot be undone.",
      () => {
        deleteEvent(eventId)
      },
    )
  })

  // Event Filters
  eventSearchInput.addEventListener("input", () => {
    updateEventsTable()
  })

  eventStatusFilter.addEventListener("change", () => {
    updateEventsTable()
  })

  eventDateFilter.addEventListener("change", () => {
    updateEventsTable()
  })

  resetEventFilters.addEventListener("click", () => {
    eventSearchInput.value = ""
    eventStatusFilter.value = "all"
    eventDateFilter.value = "all"
    updateEventsTable()
  })

  // Expense Filters
  expenseCategoryFilter.addEventListener("change", () => {
    updateExpensesTable()
  })

  expenseEventFilter.addEventListener("change", () => {
    updateExpensesTable()
  })

  resetExpenseFilters.addEventListener("click", () => {
    expenseCategoryFilter.value = "all"
    expenseEventFilter.value = "all"
    updateExpensesTable()
  })

  expensesMonthFilter.addEventListener("change", () => {
    updateExpensesData()
  })

  // Initialize Dashboard
  initializeDashboard()

  // Functions
  function getDepartmentThemeClass(department) {
    const deptMap = {
      CSE: "cse-theme",
      Architecture: "architecture-theme",
      Pharma: "pharma-theme",
      "Business School": "business-theme",
    }

    return deptMap[department] || "cse-theme"
  }

  function initializeDepartmentData(department) {
    // Check if department data exists
    const deptData = JSON.parse(localStorage.getItem(`${department}_data`))

    if (!deptData) {
      // Create initial department data
      const initialData = {
        events: [],
        members: [
          {
            id: 1,
            name: "John Doe",
            role: "Department Head",
            email: "john.doe@example.com",
            phone: "+1 234 567 890",
            joinDate: "2022-01-15",
          },
          {
            id: 2,
            name: "Jane Smith",
            role: "Assistant",
            email: "jane.smith@example.com",
            phone: "+1 234 567 891",
            joinDate: "2022-02-20",
          },
          {
            id: 3,
            name: "Robert Johnson",
            role: "Faculty",
            email: "robert.johnson@example.com",
            phone: "+1 234 567 892",
            joinDate: "2022-03-10",
          },
          {
            id: 4,
            name: "Emily Davis",
            role: "Faculty",
            email: "emily.davis@example.com",
            phone: "+1 234 567 893",
            joinDate: "2022-04-05",
          },
        ],
        settings: {
          fullName: getDepartmentFullName(department),
          shortName: department,
          email: `${department.toLowerCase()}@university.edu`,
          phone: "+1 234 567 8900",
        },
      }

      // Add sample events based on department
      if (department === "CSE") {
        initialData.events = [
          {
            id: 1,
            name: "Annual Tech Symposium",
            club: "Tech Club",
            startDate: "2025-05-15",
            endDate: "2025-05-17",
            startTime: "09:00",
            endTime: "18:00",
            venue: "Main Auditorium",
            description: "Annual technology symposium featuring guest speakers from leading tech companies.",
            expenses: [
              { category: "Speakers", amount: 2500 },
              { category: "Food", amount: 1500 },
              { category: "Marketing", amount: 800 },
              { category: "Equipment", amount: 1200 },
            ],
          },
          {
            id: 2,
            name: "Coding Hackathon",
            club: "Coding Club",
            startDate: "2025-06-10",
            endDate: "2025-06-11",
            startTime: "10:00",
            endTime: "22:00",
            venue: "Computer Lab",
            description: "24-hour coding challenge for students to develop innovative solutions.",
            expenses: [
              { category: "Food", amount: 1000 },
              { category: "Sponsors", amount: 1500 },
              { category: "Equipment", amount: 500 },
            ],
          },
        ]
      } else if (department === "Architecture") {
        initialData.events = [
          {
            id: 1,
            name: "Design Exhibition",
            club: "Design Club",
            startDate: "2025-04-20",
            endDate: "2025-04-25",
            startTime: "10:00",
            endTime: "17:00",
            venue: "Exhibition Hall",
            description: "Annual exhibition showcasing student architectural designs and models.",
            expenses: [
              { category: "Venue", amount: 2000 },
              { category: "Equipment", amount: 1500 },
              { category: "Marketing", amount: 700 },
            ],
          },
          {
            id: 2,
            name: "Sustainable Architecture Workshop",
            club: "Green Building Club",
            startDate: "2025-05-05",
            endDate: "2025-05-06",
            startTime: "09:30",
            endTime: "16:30",
            venue: "Workshop Room",
            description: "Workshop on sustainable architectural practices and green building techniques.",
            expenses: [
              { category: "Speakers", amount: 1800 },
              { category: "Food", amount: 600 },
              { category: "Materials", amount: 1200 },
            ],
          },
        ]
      } else if (department === "Pharma") {
        initialData.events = [
          {
            id: 1,
            name: "Pharmaceutical Conference",
            club: "Pharma Society",
            startDate: "2025-03-10",
            endDate: "2025-03-12",
            startTime: "09:00",
            endTime: "17:00",
            venue: "Conference Center",
            description: "Annual conference on pharmaceutical advancements and research.",
            expenses: [
              { category: "Speakers", amount: 3000 },
              { category: "Food", amount: 2000 },
              { category: "Venue", amount: 1500 },
              { category: "Marketing", amount: 1000 },
            ],
          },
          {
            id: 2,
            name: "Medical Research Symposium",
            club: "Research Club",
            startDate: "2025-04-15",
            endDate: "2025-04-16",
            startTime: "10:00",
            endTime: "16:00",
            venue: "Research Lab",
            description: "Symposium on recent medical research and pharmaceutical innovations.",
            expenses: [
              { category: "Speakers", amount: 2000 },
              { category: "Equipment", amount: 1200 },
              { category: "Food", amount: 800 },
            ],
          },
        ]
      } else if (department === "Business School") {
        initialData.events = [
          {
            id: 1,
            name: "Entrepreneurship Summit",
            club: "Entrepreneurship Club",
            startDate: "2025-02-20",
            endDate: "2025-02-22",
            startTime: "09:00",
            endTime: "18:00",
            venue: "Business School Auditorium",
            description: "Summit on entrepreneurship featuring successful entrepreneurs and investors.",
            expenses: [
              { category: "Speakers", amount: 4000 },
              { category: "Food", amount: 2500 },
              { category: "Marketing", amount: 1500 },
              { category: "Venue", amount: 1000 },
            ],
          },
          {
            id: 2,
            name: "Marketing Workshop",
            club: "Marketing Club",
            startDate: "2025-03-15",
            endDate: "2025-03-15",
            startTime: "10:00",
            endTime: "16:00",
            venue: "Seminar Hall",
            description: "Workshop on digital marketing strategies and brand building.",
            expenses: [
              { category: "Speakers", amount: 1500 },
              { category: "Food", amount: 700 },
              { category: "Marketing", amount: 500 },
            ],
          },
        ]
      }

      // Save initial data
      localStorage.setItem(`${department}_data`, JSON.stringify(initialData))
    }
  }

  function getDepartmentFullName(department) {
    const deptMap = {
      CSE: "Computer Science & Engineering",
      Architecture: "School of Architecture",
      Pharma: "Pharmaceutical Sciences",
      "Business School": "School of Business Management",
    }

    return deptMap[department] || department
  }

  function initializeDashboard() {
    // Load department data
    const department = loggedInUser.department
    const deptData = JSON.parse(localStorage.getItem(`${department}_data`))

    // Update overview stats
    updateOverviewStats(deptData)

    // Initialize charts
    initializeCharts(deptData)

    // Update recent events table
    updateRecentEventsTable(deptData)

    // Update events table
    updateEventsTable()

    // Update expenses data
    updateExpensesData()

    // Update members grid
    updateMembersGrid(deptData)

    // Update settings form
    updateSettingsForm(deptData)

    // Populate event filter dropdown
    populateEventFilterDropdown(deptData)
  }

  function updateOverviewStats(deptData) {
    const totalEvents = document.getElementById("totalEvents")
    const totalExpenses = document.getElementById("totalExpenses")
    const totalMembers = document.getElementById("totalMembers")
    const upcomingEvents = document.getElementById("upcomingEvents")

    // Calculate total events
    totalEvents.textContent = deptData.events.length

    // Calculate total expenses
    let expensesSum = 0
    deptData.events.forEach((event) => {
      event.expenses.forEach((expense) => {
        expensesSum += expense.amount
      })
    })
    totalExpenses.textContent = formatCurrency(expensesSum)

    // Set total members
    totalMembers.textContent = deptData.members.length

    // Calculate upcoming events
    const today = new Date()
    const upcomingCount = deptData.events.filter((event) => {
      const endDate = new Date(event.endDate)
      return endDate >= today
    }).length
    upcomingEvents.textContent = upcomingCount
  }

  function initializeCharts(deptData) {
    // Expense Chart
    const expenseCtx = document.getElementById("expenseChart").getContext("2d")
    const expenseData = calculateExpensesByCategory(deptData)

    window.expenseChart = new Chart(expenseCtx, {
      type: "doughnut",
      data: {
        labels: expenseData.categories,
        datasets: [
          {
            data: expenseData.amounts,
            backgroundColor: ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"],
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
            labels: {
              boxWidth: 12,
              padding: 15,
            },
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

    // Events Chart
    const eventsCtx = document.getElementById("eventsChart").getContext("2d")
    const eventsData = calculateEventsByMonth(deptData)

    window.eventsChart = new Chart(eventsCtx, {
      type: "bar",
      data: {
        labels: eventsData.months,
        datasets: [
          {
            label: "Events",
            data: eventsData.counts,
            backgroundColor: "#4f46e5",
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
              stepSize: 1,
            },
          },
        },
      },
    })

    // Expense Breakdown Chart
    const expenseBreakdownCtx = document.getElementById("expenseBreakdownChart").getContext("2d")

    window.expenseBreakdownChart = new Chart(expenseBreakdownCtx, {
      type: "pie",
      data: {
        labels: expenseData.categories,
        datasets: [
          {
            data: expenseData.amounts,
            backgroundColor: ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"],
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
            labels: {
              boxWidth: 12,
              padding: 15,
            },
          },
        },
      },
    })

    // Monthly Expenses Chart
    const monthlyExpensesCtx = document.getElementById("monthlyExpensesChart").getContext("2d")
    const monthlyExpensesData = calculateExpensesByMonth(deptData)

    window.monthlyExpensesChart = new Chart(monthlyExpensesCtx, {
      type: "line",
      data: {
        labels: monthlyExpensesData.months,
        datasets: [
          {
            label: "Expenses",
            data: monthlyExpensesData.amounts,
            backgroundColor: "rgba(79, 70, 229, 0.2)",
            borderColor: "#4f46e5",
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
              callback: (value) => "$" + value,
            },
          },
        },
      },
    })

    // Update charts when year changes
    document.getElementById("expenseChartYear").addEventListener("change", function () {
      updateExpenseChart(deptData, this.value)
    })

    document.getElementById("eventsTimelineYear").addEventListener("change", function () {
      updateEventsChart(deptData, this.value)
    })
  }

  function calculateExpensesByCategory(deptData) {
    const categories = {}

    deptData.events.forEach((event) => {
      event.expenses.forEach((expense) => {
        if (categories[expense.category]) {
          categories[expense.category] += expense.amount
        } else {
          categories[expense.category] = expense.amount
        }
      })
    })

    const sortedCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8) // Limit to top 8 categories

    return {
      categories: sortedCategories.map((item) => item[0]),
      amounts: sortedCategories.map((item) => item[1]),
    }
  }

  function calculateEventsByMonth(deptData, year = new Date().getFullYear()) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const counts = Array(12).fill(0)

    deptData.events.forEach((event) => {
      const startDate = new Date(event.startDate)
      if (startDate.getFullYear() === Number.parseInt(year)) {
        counts[startDate.getMonth()]++
      }
    })

    return {
      months: months,
      counts: counts,
    }
  }

  function calculateExpensesByMonth(deptData, year = new Date().getFullYear()) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const amounts = Array(12).fill(0)

    deptData.events.forEach((event) => {
      const startDate = new Date(event.startDate)
      if (startDate.getFullYear() === Number.parseInt(year)) {
        const month = startDate.getMonth()

        event.expenses.forEach((expense) => {
          amounts[month] += expense.amount
        })
      }
    })

    return {
      months: months,
      amounts: amounts,
    }
  }

  function updateExpenseChart(deptData, year) {
    const expenseData = calculateExpensesByCategory(deptData, year)

    window.expenseChart.data.labels = expenseData.categories
    window.expenseChart.data.datasets[0].data = expenseData.amounts
    window.expenseChart.update()
  }

  function updateEventsChart(deptData, year) {
    const eventsData = calculateEventsByMonth(deptData, year)

    window.eventsChart.data.datasets[0].data = eventsData.counts
    window.eventsChart.update()
  }

  function updateRecentEventsTable(deptData) {
    const recentEventsTable = document.getElementById("recentEventsTable").querySelector("tbody")
    recentEventsTable.innerHTML = ""

    // Sort events by date (most recent first)
    const sortedEvents = [...deptData.events]
      .sort((a, b) => {
        return new Date(b.startDate) - new Date(a.startDate)
      })
      .slice(0, 5) // Get only the 5 most recent events

    if (sortedEvents.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = `<td colspan="4" class="text-center">No events found</td>`
      recentEventsTable.appendChild(row)
      return
    }

    sortedEvents.forEach((event) => {
      const row = document.createElement("tr")

      // Calculate total expense for the event
      let totalExpense = 0
      event.expenses.forEach((expense) => {
        totalExpense += expense.amount
      })

      row.innerHTML = `
        <td>${event.name}</td>
        <td>${formatDate(event.startDate)}</td>
        <td>${event.venue}</td>
        <td>${formatCurrency(totalExpense)}</td>
      `

      row.addEventListener("click", () => {
        openEventDetails(event.id)
      })

      recentEventsTable.appendChild(row)
    })
  }

  function updateEventsTable() {
    const department = loggedInUser.department
    const deptData = JSON.parse(localStorage.getItem(`${department}_data`))
    const eventsTable = document.getElementById("eventsTable").querySelector("tbody")
    eventsTable.innerHTML = ""

    // Get filter values
    const searchTerm = eventSearchInput.value.toLowerCase()
    const statusFilter = eventStatusFilter.value
    const dateFilter = eventDateFilter.value

    // Filter events
    let filteredEvents = [...deptData.events]

    // Apply search filter
    if (searchTerm) {
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm) ||
          event.club.toLowerCase().includes(searchTerm) ||
          event.venue.toLowerCase().includes(searchTerm),
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

    // Apply date filter
    if (dateFilter !== "all") {
      const today = new Date()
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()

      if (dateFilter === "thisMonth") {
        filteredEvents = filteredEvents.filter((event) => {
          const eventDate = new Date(event.startDate)
          return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear
        })
      } else if (dateFilter === "lastMonth") {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

        filteredEvents = filteredEvents.filter((event) => {
          const eventDate = new Date(event.startDate)
          return eventDate.getMonth() === lastMonth && eventDate.getFullYear() === lastMonthYear
        })
      } else if (dateFilter === "thisYear") {
        filteredEvents = filteredEvents.filter((event) => {
          const eventDate = new Date(event.startDate)
          return eventDate.getFullYear() === currentYear
        })
      }
    }

    // Sort events by date (most recent first)
    filteredEvents.sort((a, b) => {
      return new Date(b.startDate) - new Date(a.startDate)
    })

    if (filteredEvents.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = `<td colspan="8" class="text-center">No events found</td>`
      eventsTable.appendChild(row)
      return
    }

    filteredEvents.forEach((event) => {
      const row = document.createElement("tr")

      // Calculate total expense for the event
      let totalExpense = 0
      event.expenses.forEach((expense) => {
        totalExpense += expense.amount
      })

      // Determine event status
      const status = getEventStatus(event)

      row.innerHTML = `
        <td>${event.name}</td>
        <td>${event.club}</td>
        <td>${formatDate(event.startDate)}</td>
        <td>${formatDate(event.endDate)}</td>
        <td>${event.venue}</td>
        <td>${formatCurrency(totalExpense)}</td>
        <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
        <td>
          <button class="action-btn view-btn" data-event-id="${event.id}">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit-btn" data-event-id="${event.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-btn" data-event-id="${event.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `

      eventsTable.appendChild(row)
    })

    // Add event listeners to action buttons
    const viewButtons = document.querySelectorAll(".view-btn")
    const editButtons = document.querySelectorAll(".edit-btn")
    const deleteButtons = document.querySelectorAll(".delete-btn")

    viewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const eventId = Number.parseInt(this.getAttribute("data-event-id"))
        openEventDetails(eventId)
      })
    })

    editButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const eventId = Number.parseInt(this.getAttribute("data-event-id"))
        openEventForm(eventId)
      })
    })

    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const eventId = Number.parseInt(this.getAttribute("data-event-id"))
        openConfirmationModal(
          "Delete Event",
          "Are you sure you want to delete this event? This action cannot be undone.",
          () => {
            deleteEvent(eventId)
          },
        )
      })
    })

    // Add CSS for status badges
    const style = document.createElement("style")
    style.textContent = `
      .status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
      }
      .upcoming {
        background-color: #e0f2fe;
        color: #0284c7;
      }
      .ongoing {
        background-color: #dcfce7;
        color: #16a34a;
      }
      .completed {
        background-color: #f1f5f9;
        color: #64748b;
      }
      .action-btn {
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        font-size: 1rem;
        margin-right: 5px;
        transition: color 0.2s ease;
      }
      .view-btn:hover {
        color: #0ea5e9;
      }
      .edit-btn:hover {
        color: #f59e0b;
      }
      .delete-btn:hover {
        color: #ef4444;
      }
    `

    if (!document.querySelector("style")) {
      document.head.appendChild(style)
    }
  }

  function updateExpensesData() {
    const department = loggedInUser.department
    const deptData = JSON.parse(localStorage.getItem(`${department}_data`))

    // Get selected month and year
    const monthFilter = expensesMonthFilter.value
    const [year, month] = monthFilter.split("-").map((num) => Number.parseInt(num))

    // Filter expenses for the selected month
    const filteredExpenses = []
    deptData.events.forEach((event) => {
      const eventDate = new Date(event.startDate)
      if (eventDate.getFullYear() === year && eventDate.getMonth() === month - 1) {
        event.expenses.forEach((expense) => {
          filteredExpenses.push({
            eventId: event.id,
            eventName: event.name,
            category: expense.category,
            amount: expense.amount,
            date: event.startDate,
          })
        })
      }
    })

    // Update expense summary cards
    updateExpenseSummaryCards(filteredExpenses)

    // Update expense charts
    updateExpenseCharts(filteredExpenses)

    // Update expenses table
    updateExpensesTable(filteredExpenses)
  }

  function updateExpenseSummaryCards(expenses) {
    const totalAmount = document.getElementById("expensesTotalAmount")
    const foodAmount = document.getElementById("expensesFoodAmount")
    const speakersAmount = document.getElementById("expensesSpeakersAmount")
    const marketingAmount = document.getElementById("expensesMarketingAmount")

    // Calculate total amount
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    totalAmount.textContent = formatCurrency(total)

    // Calculate food amount
    const food = expenses
        .filter((expense) => expense.category === "Food")
        .reduce((sum, expense) => sum + expense.amount, 0)
    foodAmount.textContent = formatCurrency(food)

    // Calculate speakers amount
    const speakers = expenses
        .filter((expense) => expense.category === "Speakers")
        .reduce((sum, expense) => sum + expense.amount, 0)
    speakersAmount.textContent = formatCurrency(speakers)

    // Calculate marketing amount
    const marketing = expenses
        .filter((expense) => expense.category === "Marketing")
        .reduce((sum, expense) => sum + expense.amount, 0)
    marketingAmount.textContent = formatCurrency(marketing)
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

    const categories = Object.keys(categoriesMap)
    const amounts = Object.values(categoriesMap)

    // Update expense breakdown chart
    window.expenseBreakdownChart.data.labels = categories
    window.expenseBreakdownChart.data.datasets[0].data = amounts
    window.expenseBreakdownChart.update()

    // Group expenses by event
    const eventsMap = {}
    expenses.forEach((expense) => {
      if (eventsMap[expense.eventName]) {
        eventsMap[expense.eventName] += expense.amount
      } else {
        eventsMap[expense.eventName] = expense.amount
      }
    })

    const events = Object.keys(eventsMap)
    const eventAmounts = Object.values(eventsMap)

    // Update monthly expenses chart
    window.monthlyExpensesChart.data.labels = events
    window.monthlyExpensesChart.data.datasets[0].data = eventAmounts
    window.monthlyExpensesChart.update()
  }

  function updateExpensesTable(filteredExpenses = null) {
    const department = loggedInUser.department
    const deptData = JSON.parse(localStorage.getItem(`${department}_data`))
    const expensesTable = document.getElementById("expensesTable").querySelector("tbody")
    expensesTable.innerHTML = ""

    // If no filtered expenses provided, get all expenses
    let expenses = []
    if (!filteredExpenses) {
      deptData.events.forEach((event) => {
        event.expenses.forEach((expense) => {
          expenses.push({
            eventId: event.id,
            eventName: event.name,
            category: expense.category,
            amount: expense.amount,
            date: event.startDate,
          })
        })
      })
    } else {
      expenses = filteredExpenses
    }

    // Get filter values
    const categoryFilter = expenseCategoryFilter.value
    const eventFilter = expenseEventFilter.value

    // Apply filters
    if (categoryFilter !== "all") {
      expenses = expenses.filter((expense) => expense.category === categoryFilter)
    }

    if (eventFilter !== "all") {
      expenses = expenses.filter((expense) => expense.eventId === Number.parseInt(eventFilter))
    }

    // Sort expenses by date (most recent first)
    expenses.sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })

    if (expenses.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = `<td colspan="4" class="text-center">No expenses found</td>`
      expensesTable.appendChild(row)
      return
    }

    expenses.forEach((expense) => {
      const row = document.createElement("tr")

      row.innerHTML = `
        <td>${expense.eventName}</td>
        <td>${expense.category}</td>
        <td>${formatCurrency(expense.amount)}</td>
        <td>${formatDate(expense.date)}</td>
      `

      expensesTable.appendChild(row)
    })
  }

  function updateMembersGrid(deptData) {
    const membersGrid = document.getElementById("membersGrid")
    membersGrid.innerHTML = ""

    deptData.members.forEach((member) => {
      const memberCard = document.createElement("div")
      memberCard.className = "member-card"

      memberCard.innerHTML = `
        <div class="member-header">
          <div class="member-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="member-name">${member.name}</div>
          <div class="member-role">${member.role}</div>
        </div>
        <div class="member-body">
          <div class="member-info">
            <p><span>Email:</span> <span>${member.email}</span></p>
            <p><span>Phone:</span> <span>${member.phone}</span></p>
            <p><span>Joined:</span> <span>${formatDate(member.joinDate)}</span></p>
          </div>
          <div class="member-actions">
            <button class="secondary-btn">
              <i class="fas fa-envelope"></i> Contact
            </button>
          </div>
        </div>
      `

      membersGrid.appendChild(memberCard)
    })
  }

  function updateSettingsForm(deptData) {
    const deptFullName = document.getElementById("deptFullName")
    const deptShortName = document.getElementById("deptShortName")
    const deptEmail = document.getElementById("deptEmail")
    const deptPhone = document.getElementById("deptPhone")

    deptFullName.value = deptData.settings.fullName
    deptShortName.value = deptData.settings.shortName
    deptEmail.value = deptData.settings.email
    deptPhone.value = deptData.settings.phone

    // Add event listener to department info form
    const departmentInfoForm = document.getElementById("departmentInfoForm")
    departmentInfoForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Update department settings
      const department = loggedInUser.department
      const deptData = JSON.parse(localStorage.getItem(`${department}_data`))

      deptData.settings.email = deptEmail.value
      deptData.settings.phone = deptPhone.value

      // Save updated data
      localStorage.setItem(`${department}_data`, JSON.stringify(deptData))

      // Show success message
      showToast("Success", "Department information updated successfully", "success")
    })

    // Add event listener to change password form
    const changePasswordForm = document.getElementById("changePasswordForm")
    changePasswordForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const currentPassword = document.getElementById("currentPassword").value
      const newPassword = document.getElementById("newPassword").value
      const confirmPassword = document.getElementById("confirmPassword").value

      // Check if current password is correct
      const deptUsers = JSON.parse(localStorage.getItem("deptUsers"))
      const department = loggedInUser.department
      const id = loggedInUser.id

      const user = deptUsers[department].find((user) => user.id === id)

      if (!user || user.password !== currentPassword) {
        showToast("Error", "Current password is incorrect", "error")
        return
      }

      // Check if new password and confirm password match
      if (newPassword !== confirmPassword) {
        showToast("Error", "New password and confirm password do not match", "error")
        return
      }

      // Update password
      user.password = newPassword
      localStorage.setItem("deptUsers", JSON.stringify(deptUsers))

      // Reset form
      changePasswordForm.reset()

      // Show success message
      showToast("Success", "Password updated successfully", "success")
    })
  }

  function populateEventFilterDropdown(deptData) {
    const expenseEventFilter = document.getElementById("expenseEventFilter")
    expenseEventFilter.innerHTML = '<option value="all">All Events</option>'

    deptData.events.forEach((event) => {
      const option = document.createElement("option")
      option.value = event.id
      option.textContent = event.name
      expenseEventFilter.appendChild(option)
    })
  }

  function openEventForm(eventId = null) {
    const department = loggedInUser.department
    const deptData = JSON.parse(localStorage.getItem(`${department}_data`))

    // Reset form
    eventForm.reset()
    expenseItems.innerHTML = ""

    // Add default expense item
    addExpenseItem()

    if (eventId) {
      // Edit existing event
      const event = deptData.events.find((event) => event.id === eventId)

      if (event) {
        eventFormTitle.textContent = "Edit Event"
        document.getElementById("eventId").value = event.id
        document.getElementById("eventName").value = event.name
        document.getElementById("eventClub").value = event.club
        document.getElementById("eventStartDate").value = event.startDate
        document.getElementById("eventEndDate").value = event.endDate
        document.getElementById("eventStartTime").value = event.startTime
        document.getElementById("eventEndTime").value = event.endTime
        document.getElementById("eventVenue").value = event.venue
        document.getElementById("eventDescription").value = event.description

        // Clear default expense item
        expenseItems.innerHTML = ""

        // Add expense items
        event.expenses.forEach((expense, index) => {
          addExpenseItem(expense.category, expense.amount)
        })
      }
    } else {
      // Create new event
      eventFormTitle.textContent = "Create New Event"
      document.getElementById("eventId").value = ""

      // Set default dates to today and tomorrow
      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(today.getDate() + 1)

      document.getElementById("eventStartDate").value = formatDateForInput(today)
      document.getElementById("eventEndDate").value = formatDateForInput(tomorrow)
    }

    // Show modal
    openModal(eventFormModal)
  }

  function openEventDetails(eventId) {
    const department = loggedInUser.department
    const deptData = JSON.parse(localStorage.getItem(`${department}_data`))

    const event = deptData.events.find((event) => event.id === eventId)

    if (event) {
      eventDetailsTitle.textContent = event.name

      // Calculate total expense
      let totalExpense = 0
      event.expenses.forEach((expense) => {
        totalExpense += expense.amount
      })

      // Determine event status
      const status = getEventStatus(event)

      // Format expenses table
      let expensesHtml = ""
      event.expenses.forEach((expense) => {
        expensesHtml += `
          <tr>
            <td>${expense.category}</td>
            <td>${formatCurrency(expense.amount)}</td>
          </tr>
        `
      })

      eventDetailsContent.innerHTML = `
        <div class="event-details">
          <div class="event-info">
            <p><strong>Organizing Club:</strong> ${event.club}</p>
            <p><strong>Date:</strong> ${formatDate(event.startDate)} to ${formatDate(event.endDate)}</p>
            <p><strong>Time:</strong> ${formatTime(event.startTime)} to ${formatTime(event.endTime)}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
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
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${expensesHtml}
                <tr class="total-row">
                  <td><strong>Total</strong></td>
                  <td><strong>${formatCurrency(totalExpense)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `

      // Set event ID for edit and delete buttons
      editEventBtn.setAttribute("data-event-id", eventId)
      deleteEventBtn.setAttribute("data-event-id", eventId)

      // Show modal
      openModal(eventDetailsModal)
    }
  }

  function openConfirmationModal(title, message, confirmCallback) {
    confirmationTitle.textContent = title
    confirmationMessage.textContent = message

    // Set confirm button callback
    confirmBtn.onclick = () => {
      confirmCallback()
      closeModal(confirmationModal)
    }

    // Show modal
    openModal(confirmationModal)
  }

  function addExpenseItem(category = "", amount = "") {
    const expenseCount = expenseItems.children.length
    const expenseItem = document.createElement("div")
    expenseItem.className = "expense-item"

    expenseItem.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label for="expenseCategory${expenseCount}">Category</label>
          <select id="expenseCategory${expenseCount}" class="expense-category" required>
            <option value="" ${!category ? "selected" : ""}>Select Category</option>
            <option value="Speakers" ${category === "Speakers" ? "selected" : ""}>Speakers</option>
            <option value="Sponsors" ${category === "Sponsors" ? "selected" : ""}>Sponsors</option>
            <option value="Food" ${category === "Food" ? "selected" : ""}>Food & Beverages</option>
            <option value="Venue" ${category === "Venue" ? "selected" : ""}>Venue</option>
            <option value="Marketing" ${category === "Marketing" ? "selected" : ""}>Marketing</option>
            <option value="Equipment" ${category === "Equipment" ? "selected" : ""}>Equipment</option>
            <option value="Transportation" ${category === "Transportation" ? "selected" : ""}>Transportation</option>
            <option value="Other" ${category === "Other" ? "selected" : ""}>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label for="expenseAmount${expenseCount}">Amount ($)</label>
          <input type="number" id="expenseAmount${expenseCount}" class="expense-amount" min="0" step="0.01" value="${amount}" required>
        </div>
        <div class="form-group expense-actions">
          <button type="button" class="remove-expense-btn" ${expenseCount === 0 ? "disabled" : ""}>
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `

    // Add event listener to remove button
    const removeBtn = expenseItem.querySelector(".remove-expense-btn")
    removeBtn.addEventListener("click", () => {
      expenseItems.removeChild(expenseItem)

      // Update remove buttons (disable if only one expense item left)
      if (expenseItems.children.length === 1) {
        expenseItems.querySelector(".remove-expense-btn").disabled = true
      }
    })

    expenseItems.appendChild(expenseItem)

    // Enable all remove buttons if more than one expense item
    if (expenseItems.children.length > 1) {
      const removeButtons = expenseItems.querySelectorAll(".remove-expense-btn")
      removeButtons.forEach((btn) => {
        btn.disabled = false
      })
    }
  }

  function saveEvent() {
    const department = loggedInUser.department
    const deptData = JSON.parse(localStorage.getItem(`${department}_data`))

    const eventIdInput = document.getElementById("eventId")
    const eventName = document.getElementById("eventName").value
    const eventClub = document.getElementById("eventClub").value
    const eventStartDate = document.getElementById("eventStartDate").value
    const eventEndDate = document.getElementById("eventEndDate").value
    const eventStartTime = document.getElementById("eventStartTime").value
    const eventEndTime = document.getElementById("eventEndTime").value
    const eventVenue = document.getElementById("eventVenue").value
    const eventDescription = document.getElementById("eventDescription").value

    // Collect expenses
    const expenses = []
    const expenseCategories = document.querySelectorAll(".expense-category")
    const expenseAmounts = document.querySelectorAll(".expense-amount")

    for (let i = 0; i < expenseCategories.length; i++) {
      const category = expenseCategories[i].value
      const amount = Number.parseFloat(expenseAmounts[i].value)

      if (category && !isNaN(amount)) {
        expenses.push({
          category,
          amount,
        })
      }
    }

    if (eventIdInput.value) {
      // Update existing event
      const eventId = Number.parseInt(eventIdInput.value)
      const eventIndex = deptData.events.findIndex((event) => event.id === eventId)

      if (eventIndex !== -1) {
        deptData.events[eventIndex] = {
          id: eventId,
          name: eventName,
          club: eventClub,
          startDate: eventStartDate,
          endDate: eventEndDate,
          startTime: eventStartTime,
          endTime: eventEndTime,
          venue: eventVenue,
          description: eventDescription,
          expenses: expenses,
        }

        // Save updated data
        localStorage.setItem(`${department}_data`, JSON.stringify(deptData))

        // Show success message
        showToast("Success", "Event updated successfully", "success")
      }
    } else {
      // Create new event
      const newEventId = deptData.events.length > 0 ? Math.max(...deptData.events.map((event) => event.id)) + 1 : 1

      const newEvent = {
        id: newEventId,
        name: eventName,
        club: eventClub,
        startDate: eventStartDate,
        endDate: eventEndDate,
        startTime: eventStartTime,
        endTime: eventEndTime,
        venue: eventVenue,
        description: eventDescription,
        expenses: expenses,
      }

      deptData.events.push(newEvent)

      // Save updated data
      localStorage.setItem(`${department}_data`, JSON.stringify(deptData))

      // Show success message
      showToast("Success", "Event created successfully", "success")
    }

    // Close modal
    closeModal(eventFormModal)

    // Update dashboard
    initializeDashboard()
  }

  function deleteEvent(eventId) {
    const department = loggedInUser.department
    const deptData = JSON.parse(localStorage.getItem(`${department}_data`))

    // Find event index
    const eventIndex = deptData.events.findIndex((event) => event.id === eventId)

    if (eventIndex !== -1) {
      // Remove event
      deptData.events.splice(eventIndex, 1)

      // Save updated data
      localStorage.setItem(`${department}_data`, JSON.stringify(deptData))

      // Show success message
      showToast("Success", "Event deleted successfully", "success")

      // Close event details modal if open
      closeModal(eventDetailsModal)

      // Update dashboard
      initializeDashboard()
    }
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

  function openModal(modal) {
    modal.classList.add("active")
  }

  function closeModal(modal) {
    modal.classList.remove("active")
  }

  function showToast(title, message, type = "success") {
    const toast = document.getElementById("toast")
    const toastTitle = document.getElementById("toastTitle")
    const toastMessage = document.getElementById("toastMessage")
    const toastIcon = document.getElementById("toastIcon")

    toastTitle.textContent = title
    toastMessage.textContent = message

    // Set icon based on type
    toastIcon.className = ""
    if (type === "success") {
      toastIcon.className = "fas fa-check-circle success"
    } else if (type === "error") {
      toastIcon.className = "fas fa-times-circle error"
    } else if (type === "warning") {
      toastIcon.className = "fas fa-exclamation-circle warning"
    } else if (type === "info") {
      toastIcon.className = "fas fa-info-circle info"
    }

    // Show toast
    toast.classList.add("active")

    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("active")
    }, 3000)
  }

  function formatCurrency(amount) {
    return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  function formatDateForInput(date) {
    return date.toISOString().split("T")[0]
  }

  function formatTime(timeString) {
    if (!timeString) return ""

    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12

    return `${hour12}:${minutes} ${ampm}`
  }
})

