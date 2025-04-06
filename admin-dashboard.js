document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in as admin
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    if (!loggedInUser || loggedInUser.type !== "admin") {
      window.location.href = "login.html"
      return
    }
  
    // Set admin username
    document.getElementById("adminUsername").textContent = loggedInUser.username
  
    // Set current date
    const now = new Date()
    document.getElementById("currentDate").textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  
    // DOM Elements
    const sidebarToggle = document.getElementById("sidebarToggle")
    const sidebar = document.querySelector(".sidebar")
    const mainContent = document.querySelector(".main-content")
    const navItems = document.querySelectorAll(".nav-item")
    const pages = document.querySelectorAll(".page")
    const pageTitle = document.getElementById("pageTitle")
    const logoutBtn = document.getElementById("logoutBtn")
    const themeToggle = document.getElementById("themeToggle")
  
    // Theme toggle
    themeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark-theme")
        localStorage.setItem("theme", "dark")
      } else {
        document.body.classList.remove("dark-theme")
        localStorage.setItem("theme", "light")
      }
    })
  
    // Check saved theme
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme")
      themeToggle.checked = true
    }
  
    // Toggle sidebar
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed")
      mainContent.classList.toggle("expanded")
    })
  
    // Navigation
    navItems.forEach((item) => {
      item.addEventListener("click", function () {
        // Remove active class from all nav items and pages
        navItems.forEach((navItem) => navItem.classList.remove("active"))
        pages.forEach((page) => page.classList.remove("active"))
  
        // Add active class to clicked nav item and corresponding page
        this.classList.add("active")
        const pageId = this.getAttribute("data-page")
        document.getElementById(pageId).classList.add("active")
  
        // Update page title
        pageTitle.textContent = this.querySelector("span").textContent
  
        // Load page-specific data
        loadPageData(pageId)
      })
    })
  
    // Logout
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser")
      window.location.href = "login.html"
    })
  
    // Initialize dashboard
    initializeDashboard()
  
    // Settings navigation
    const settingsNavItems = document.querySelectorAll(".settings-nav-item")
    const settingsPanels = document.querySelectorAll(".settings-panel")
  
    settingsNavItems.forEach((item) => {
      item.addEventListener("click", function () {
        // Remove active class from all nav items and panels
        settingsNavItems.forEach((navItem) => navItem.classList.remove("active"))
        settingsPanels.forEach((panel) => panel.classList.remove("active"))
  
        // Add active class to clicked nav item and corresponding panel
        this.classList.add("active")
        const settingsId = this.getAttribute("data-settings")
        document.getElementById(settingsId + "Settings").classList.add("active")
      })
    })
  
    // Users tab navigation
    const usersTabs = document.querySelectorAll(".tab-btn")
    const usersTabContents = document.querySelectorAll(".users-tab-content")
  
    usersTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs and contents
        usersTabs.forEach((t) => t.classList.remove("active"))
        usersTabContents.forEach((c) => c.classList.remove("active"))
  
        // Add active class to clicked tab and corresponding content
        this.classList.add("active")
        const tabId = this.getAttribute("data-tab")
        document.getElementById(tabId).classList.add("active")
      })
    })
  
    // User form type change
    const userType = document.getElementById("userType")
    const departmentField = document.querySelector(".department-field")
  
    userType.addEventListener("change", function () {
      if (this.value === "department") {
        departmentField.style.display = "block"
      } else {
        departmentField.style.display = "none"
      }
    })
  
    // Backup file selection
    const backupFile = document.getElementById("backupFile")
    const selectedBackupFile = document.getElementById("selectedBackupFile")
    const restoreBackupBtn = document.getElementById("restoreBackupBtn")
  
    backupFile.addEventListener("change", function () {
      if (this.files.length > 0) {
        selectedBackupFile.textContent = this.files[0].name
        restoreBackupBtn.disabled = false
      } else {
        selectedBackupFile.textContent = "No file selected"
        restoreBackupBtn.disabled = true
      }
    })
  
    // Functions
    function initializeDashboard() {
      // Fetch all departments
      fetchDepartments()
  
      // Fetch all events
      fetchEvents()
  
      // Initialize charts
      initializeCharts()
  
      // Load dashboard data
      loadDashboardData()
    }
  
    function loadPageData(pageId) {
      switch (pageId) {
        case "dashboard":
          loadDashboardData()
          break
        case "departments":
          loadDepartmentsData()
          break
        case "expenses":
          loadExpensesData()
          break
        case "events":
          loadEventsData()
          break
        case "users":
          loadUsersData()
          break
      }
    }
  
    function fetchDepartments() {
      // In a real application, this would fetch from the server
      // For now, we'll use hardcoded departments
      const departments = [
        { id: 1, name: "CSE", fullName: "Computer Science & Engineering", budget: 50000 },
        { id: 2, name: "Architecture", fullName: "School of Architecture", budget: 45000 },
        { id: 3, name: "Pharma", fullName: "Pharmaceutical Sciences", budget: 60000 },
        { id: 4, name: "Business School", fullName: "School of Business Management", budget: 55000 },
      ]
  
      // Store departments in localStorage for use across the application
      localStorage.setItem("departments", JSON.stringify(departments))
  
      return departments
    }
  
    function fetchEvents() {
      // Fetch all events from all departments
      fetch("http://localhost:5000/api/get-all-events")
        .then((response) => {
          if (!response.ok) {
            // If the endpoint doesn't exist, we'll fetch events for each department separately
            return fetchEventsByDepartment()
          }
          return response.json()
        })
        .then((data) => {
          if (data && data.success) {
            localStorage.setItem("allEvents", JSON.stringify(data.events))
            updateDashboardWithEvents(data.events)
          }
        })
        .catch((error) => {
          console.error("Error fetching events:", error)
          // If there's an error, try fetching by department
          fetchEventsByDepartment()
        })
    }
  
    function fetchEventsByDepartment() {
      const departments = JSON.parse(localStorage.getItem("departments")) || []
      const allEvents = []
      let completedRequests = 0
  
      departments.forEach((dept) => {
        fetch(`http://localhost:5000/api/get-events?department=${encodeURIComponent(dept.name)}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              // Add department name to each event for easier filtering
              const eventsWithDept = data.events.map((event) => ({
                ...event,
                departmentName: dept.name,
                departmentFullName: dept.fullName,
              }))
  
              allEvents.push(...eventsWithDept)
            }
  
            completedRequests++
            if (completedRequests === departments.length) {
              // All requests completed
              localStorage.setItem("allEvents", JSON.stringify(allEvents))
              updateDashboardWithEvents(allEvents)
            }
          })
          .catch((error) => {
            console.error(`Error fetching events for ${dept.name}:`, error)
            completedRequests++
            if (completedRequests === departments.length) {
              // All requests completed
              localStorage.setItem("allEvents", JSON.stringify(allEvents))
              updateDashboardWithEvents(allEvents)
            }
          })
      })
  
      return allEvents
    }
  
    function updateDashboardWithEvents(events) {
      // Update dashboard stats
      document.getElementById("totalEvents").textContent = events.length
  
      // Calculate total expenses
      let totalExpenses = 0
      events.forEach((event) => {
        event.expenses.forEach((expense) => {
          totalExpenses += expense.amount
        })
      })
  
      document.getElementById("totalExpenses").textContent = formatCurrency(totalExpenses)
  
      // Update departments count
      const departments = JSON.parse(localStorage.getItem("departments")) || []
      document.getElementById("totalDepartments").textContent = departments.length
  
      // Calculate budget alerts
      const departmentExpenses = {}
      const departmentBudgets = {}
  
      departments.forEach((dept) => {
        departmentBudgets[dept.name] = dept.budget
        departmentExpenses[dept.name] = 0
      })
  
      events.forEach((event) => {
        if (departmentExpenses[event.department]) {
          event.expenses.forEach((expense) => {
            departmentExpenses[event.department] += expense.amount
          })
        }
      })
  
      let alertCount = 0
      for (const dept in departmentExpenses) {
        if (departmentExpenses[dept] > departmentBudgets[dept] * 0.9) {
          alertCount++
        }
      }
  
      document.getElementById("budgetAlerts").textContent = alertCount
  
      // Update recent events table
      updateRecentEventsTable(events)
  
      // Update department spending table
      updateDepartmentSpendingTable(departmentExpenses, departmentBudgets)
  
      // Update charts
      updateDashboardCharts(events, departmentExpenses)
    }
  
    function updateRecentEventsTable(events) {
      const recentEventsTable = document.getElementById("recentEventsTable").querySelector("tbody")
      recentEventsTable.innerHTML = ""
  
      // Sort events by date (most recent first) and take top 5
      const recentEvents = [...events].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).slice(0, 5)
  
      if (recentEvents.length === 0) {
        const row = document.createElement("tr")
        row.innerHTML = '<td colspan="5" class="text-center">No events found</td>'
        recentEventsTable.appendChild(row)
        return
      }
  
      recentEvents.forEach((event) => {
        const row = document.createElement("tr")
  
        // Calculate total expense for the event
        let totalExpense = 0
        event.expenses.forEach((expense) => {
          totalExpense += expense.amount
        })
  
        // Determine event status
        const status = getEventStatus(event)
  
        row.innerHTML = `
          <td>${event.department}</td>
          <td>${event.name}</td>
          <td>${formatDate(event.startDate)}</td>
          <td>${formatCurrency(totalExpense)}</td>
          <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
        `
  
        recentEventsTable.appendChild(row)
      })
    }
  
    function updateDepartmentSpendingTable(departmentExpenses, departmentBudgets) {
      const departmentSpendingTable = document.getElementById("departmentSpendingTable").querySelector("tbody")
      departmentSpendingTable.innerHTML = ""
  
      const departments = JSON.parse(localStorage.getItem("departments")) || []
  
      if (departments.length === 0) {
        const row = document.createElement("tr")
        row.innerHTML = '<td colspan="5" class="text-center">No departments found</td>'
        departmentSpendingTable.appendChild(row)
        return
      }
  
      departments.forEach((dept) => {
        const row = document.createElement("tr")
  
        const spent = departmentExpenses[dept.name] || 0
        const budget = departmentBudgets[dept.name] || 0
        const remaining = budget - spent
        const percentage = budget > 0 ? (spent / budget) * 100 : 0
  
        let status = "Normal"
        let statusClass = "normal"
  
        if (percentage > 90) {
          status = "Overspending"
          statusClass = "overspending"
        } else if (percentage < 30) {
          status = "Underspending"
          statusClass = "underspending"
        }
  
        row.innerHTML = `
          <td>${dept.fullName}</td>
          <td>${formatCurrency(budget)}</td>
          <td>${formatCurrency(spent)}</td>
          <td>${formatCurrency(remaining)}</td>
          <td><span class="status-badge ${statusClass}">${status}</span></td>
        `
  
        departmentSpendingTable.appendChild(row)
      })
    }
  
    function initializeCharts() {
      // Small charts for stat cards
      initializeStatCharts()
  
      // Create empty charts that will be populated with data later
      createEmptyDepartmentExpensesChart()
      createEmptyCategoryDistributionChart()
    }
  
    function initializeStatCharts() {
      // Departments trend chart
      const deptsCtx = document.getElementById("departmentsChart").getContext("2d")
      drawLineChart(deptsCtx, [4, 4, 4, 4, 4, 4, 4], "#4361ee")
  
      // Events trend chart
      const eventsCtx = document.getElementById("eventsChart").getContext("2d")
      drawLineChart(eventsCtx, [5, 8, 12, 15, 20, 25, 30], "#2ecc71")
  
      // Expenses trend chart
      const expensesCtx = document.getElementById("expensesChart").getContext("2d")
      drawLineChart(expensesCtx, [10000, 15000, 25000, 30000, 40000, 50000, 60000], "#f39c12")
  
      // Alerts trend chart
      const alertsCtx = document.getElementById("alertsChart").getContext("2d")
      drawLineChart(alertsCtx, [0, 1, 2, 1, 3, 2, 1], "#e74c3c")
    }
  
    function drawLineChart(ctx, data, color) {
      ctx.strokeStyle = color
      ctx.lineWidth = 2
  
      const width = ctx.canvas.width
      const height = ctx.canvas.height
      const dataLength = data.length
      const maxValue = Math.max(...data)
  
      ctx.beginPath()
  
      for (let i = 0; i < dataLength; i++) {
        const x = (i / (dataLength - 1)) * width
        const y = height - (data[i] / maxValue) * height
  
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
  
      ctx.stroke()
    }
  
    function createEmptyDepartmentExpensesChart() {
      const ctx = document.getElementById("departmentExpensesChart").getContext("2d")
      drawBarChart(ctx, [], [], "Department Expenses")
    }
  
    function createEmptyCategoryDistributionChart() {
      const ctx = document.getElementById("categoryDistributionChart").getContext("2d")
      drawPieChart(ctx, [], [], "Expense Categories")
    }
  
    function updateDashboardCharts(events, departmentExpenses) {
      // Update department expenses chart
      updateDepartmentExpensesChart(departmentExpenses)
  
      // Update category distribution chart
      updateCategoryDistributionChart(events)
    }
  
    function updateDepartmentExpensesChart(departmentExpenses) {
      const ctx = document.getElementById("departmentExpensesChart").getContext("2d")
      const departments = JSON.parse(localStorage.getItem("departments")) || []
  
      const labels = departments.map((dept) => dept.name)
      const data = departments.map((dept) => departmentExpenses[dept.name] || 0)
  
      // Clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  
      // Draw new chart
      drawBarChart(ctx, labels, data, "Department Expenses")
    }
  
    function updateCategoryDistributionChart(events) {
      const ctx = document.getElementById("categoryDistributionChart").getContext("2d")
  
      // Calculate expenses by category
      const categoryExpenses = {}
  
      events.forEach((event) => {
        event.expenses.forEach((expense) => {
          if (categoryExpenses[expense.category]) {
            categoryExpenses[expense.category] += expense.amount
          } else {
            categoryExpenses[expense.category] = expense.amount
          }
        })
      })
  
      const labels = Object.keys(categoryExpenses)
      const data = Object.values(categoryExpenses)
  
      // Clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  
      // Draw new chart
      drawPieChart(ctx, labels, data, "Expense Categories")
    }
  
    function drawBarChart(ctx, labels, data, title) {
      const width = ctx.canvas.width
      const height = ctx.canvas.height
      const barCount = labels.length
      const maxValue = Math.max(...data, 1) // Avoid division by zero
      const barWidth = width / (barCount * 2)
      const colors = ["#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#4cc9f0", "#4895ef", "#560bad", "#b5179e"]
  
      // Draw title
      ctx.fillStyle = "#343a40"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(title, width / 2, 20)
  
      // Draw bars
      for (let i = 0; i < barCount; i++) {
        const x = i * barWidth * 2 + barWidth / 2
        const barHeight = (data[i] / maxValue) * (height - 60)
        const y = height - barHeight - 30
  
        // Draw bar
        ctx.fillStyle = colors[i % colors.length]
        ctx.fillRect(x, y, barWidth, barHeight)
  
        // Draw label
        ctx.fillStyle = "#343a40"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText(labels[i], x + barWidth / 2, height - 10)
  
        // Draw value
        ctx.fillStyle = "#343a40"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText(formatCurrency(data[i]), x + barWidth / 2, y - 5)
      }
    }
  
    function drawPieChart(ctx, labels, data, title) {
      const width = ctx.canvas.width
      const height = ctx.canvas.height
      const radius = Math.min(width, height) / 2 - 40
      const centerX = width / 2
      const centerY = height / 2
      const total = data.reduce((sum, value) => sum + value, 0) || 1 // Avoid division by zero
      const colors = ["#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#4cc9f0", "#4895ef", "#560bad", "#b5179e"]
  
      // Draw title
      ctx.fillStyle = "#343a40"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(title, centerX, 20)
  
      // Draw pie
      let startAngle = 0
  
      for (let i = 0; i < data.length; i++) {
        const sliceAngle = (data[i] / total) * 2 * Math.PI
        const endAngle = startAngle + sliceAngle
  
        // Draw slice
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
  
        ctx.fillStyle = colors[i % colors.length]
        ctx.fill()
  
        // Calculate label position
        const labelAngle = startAngle + sliceAngle / 2
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7)
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7)
  
        // Draw label if slice is big enough
        if (sliceAngle > 0.2) {
          ctx.fillStyle = "#fff"
          ctx.font = "12px Arial"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(labels[i], labelX, labelY)
        }
  
        startAngle = endAngle
      }
  
      // Draw legend
      const legendX = width - 100
      const legendY = 50
  
      for (let i = 0; i < labels.length; i++) {
        const y = legendY + i * 20
  
        // Draw color box
        ctx.fillStyle = colors[i % colors.length]
        ctx.fillRect(legendX, y, 15, 15)
  
        // Draw label
        ctx.fillStyle = "#343a40"
        ctx.font = "12px Arial"
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
        ctx.fillText(`${labels[i]} (${Math.round((data[i] / total) * 100)}%)`, legendX + 20, y + 7)
      }
    }
  
    function loadDashboardData() {
      // This function is called when the dashboard page is loaded
      // Most of the data is already loaded in initializeDashboard
    }
  
    function loadDepartmentsData() {
      const departments = JSON.parse(localStorage.getItem("departments")) || []
      const departmentsGrid = document.querySelector(".departments-grid")
      departmentsGrid.innerHTML = ""
  
      if (departments.length === 0) {
        departmentsGrid.innerHTML = '<div class="empty-state">No departments found</div>'
        return
      }
  
      // Get all events
      const allEvents = JSON.parse(localStorage.getItem("allEvents")) || []
  
      // Calculate department stats
      const departmentStats = {}
  
      departments.forEach((dept) => {
        departmentStats[dept.name] = {
          totalEvents: 0,
          totalExpenses: 0,
          lastEvent: null,
        }
      })
  
      allEvents.forEach((event) => {
        if (departmentStats[event.department]) {
          departmentStats[event.department].totalEvents++
  
          // Calculate total expenses
          let eventExpense = 0
          event.expenses.forEach((expense) => {
            eventExpense += expense.amount
          })
  
          departmentStats[event.department].totalExpenses += eventExpense
  
          // Check if this is the most recent event
          if (
            !departmentStats[event.department].lastEvent ||
            new Date(event.startDate) > new Date(departmentStats[event.department].lastEvent.startDate)
          ) {
            departmentStats[event.department].lastEvent = event
          }
        }
      })
  
      // Create department cards
      departments.forEach((dept) => {
        const stats = departmentStats[dept.name]
        const card = document.createElement("div")
        card.className = "department-card"
        card.setAttribute("data-department", dept.name)
  
        // Determine department color
        let color
        switch (dept.name) {
          case "CSE":
            color = "#4361ee"
            break
          case "Architecture":
            color = "#3a0ca3"
            break
          case "Pharma":
            color = "#7209b7"
            break
          case "Business School":
            color = "#f72585"
            break
          default:
            color = "#4cc9f0"
        }
  
        card.innerHTML = `
          <div class="department-icon" style="background-color: ${color}20; color: ${color};">
            <i class="fas fa-building"></i>
          </div>
          <h3>${dept.fullName}</h3>
          <p>${dept.name}</p>
          <div class="department-stats">
            <div class="department-stat">
              <span>Events</span>
              <strong>${stats.totalEvents}</strong>
            </div>
            <div class="department-stat">
              <span>Expenses</span>
              <strong>${formatCurrency(stats.totalExpenses)}</strong>
            </div>
            <div class="department-stat">
              <span>Budget</span>
              <strong>${formatCurrency(dept.budget)}</strong>
            </div>
          </div>
        `
  
        card.addEventListener("click", function () {
          // Remove active class from all cards
          document.querySelectorAll(".department-card").forEach((c) => c.classList.remove("active"))
  
          // Add active class to clicked card
          this.classList.add("active")
  
          // Show department details
          showDepartmentDetails(dept, stats)
        })
  
        departmentsGrid.appendChild(card)
      })
    }
  
    function showDepartmentDetails(department, stats) {
      // Update department name
      document.getElementById("selectedDepartmentName").textContent = department.fullName
  
      // Enable buttons
      document.getElementById("editDepartmentBtn").disabled = false
      document.getElementById("deleteDepartmentBtn").disabled = false
  
      // Update department info
      document.getElementById("deptTotalEvents").textContent = stats.totalEvents
      document.getElementById("deptTotalExpenses").textContent = formatCurrency(stats.totalExpenses)
  
      // Calculate budget status
      const percentage = department.budget > 0 ? (stats.totalExpenses / department.budget) * 100 : 0
      let status = "Normal"
      let statusClass = "normal"
  
      if (percentage > 90) {
        status = "Overspending"
        statusClass = "overspending"
      } else if (percentage < 30) {
        status = "Underspending"
        statusClass = "underspending"
      }
  
      document.getElementById("deptBudgetStatus").innerHTML =
        `<span class="status-badge ${statusClass}">${status}</span> (${Math.round(percentage)}%)`
  
      // Update last event
      if (stats.lastEvent) {
        document.getElementById("deptLastEvent").textContent =
          `${stats.lastEvent.name} (${formatDate(stats.lastEvent.startDate)})`
      } else {
        document.getElementById("deptLastEvent").textContent = "No events"
      }
  
      // Update department events table
      updateDepartmentEventsTable(department.name)
  
      // Update expense breakdown chart
      updateDepartmentExpenseBreakdown(department.name)
  
      // Update monthly spending chart
      updateDepartmentMonthlySpending(department.name)
    }
  
    function updateDepartmentEventsTable(departmentName) {
      const departmentEventsTable = document.getElementById("departmentEventsTable").querySelector("tbody")
      departmentEventsTable.innerHTML = ""
  
      // Get all events for this department
      const allEvents = JSON.parse(localStorage.getItem("allEvents")) || []
      const departmentEvents = allEvents.filter((event) => event.department === departmentName)
  
      // Sort events by date (most recent first)
      departmentEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  
      if (departmentEvents.length === 0) {
        const row = document.createElement("tr")
        row.innerHTML = '<td colspan="5" class="text-center">No events found</td>'
        departmentEventsTable.appendChild(row)
        return
      }
  
      // Display up to 5 most recent events
      const recentEvents = departmentEvents.slice(0, 5)
  
      recentEvents.forEach((event) => {
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
          <td>${formatDate(event.startDate)}</td>
          <td>${event.venue}</td>
          <td>${formatCurrency(totalExpense)}</td>
          <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
        `
  
        departmentEventsTable.appendChild(row)
      })
    }
  
    function updateDepartmentExpenseBreakdown(departmentName) {
      const ctx = document.getElementById("deptExpenseBreakdownChart").getContext("2d")
  
      // Get all events for this department
      const allEvents = JSON.parse(localStorage.getItem("allEvents")) || []
      const departmentEvents = allEvents.filter((event) => event.department === departmentName)
  
      // Calculate expenses by category
      const categoryExpenses = {}
  
      departmentEvents.forEach((event) => {
        event.expenses.forEach((expense) => {
          if (categoryExpenses[expense.category]) {
            categoryExpenses[expense.category] += expense.amount
          } else {
            categoryExpenses[expense.category] = expense.amount
          }
        })
      })
  
      const labels = Object.keys(categoryExpenses)
      const data = Object.values(categoryExpenses)
  
      // Clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  
      // Draw new chart
      drawPieChart(ctx, labels, data, "Expense Categories")
    }
  
    function updateDepartmentMonthlySpending(departmentName) {
      const ctx = document.getElementById("deptMonthlySpendingChart").getContext("2d")
  
      // Get all events for this department
      const allEvents = JSON.parse(localStorage.getItem("allEvents")) || []
      const departmentEvents = allEvents.filter((event) => event.department === departmentName)
  
      // Calculate monthly expenses for the current year
      const currentYear = new Date().getFullYear()
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const monthlyExpenses = Array(12).fill(0)
  
      departmentEvents.forEach((event) => {
        const eventDate = new Date(event.startDate)
        if (eventDate.getFullYear() === currentYear) {
          const month = eventDate.getMonth()
  
          event.expenses.forEach((expense) => {
            monthlyExpenses[month] += expense.amount
          })
        }
      })
  
      // Clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  
      // Draw new chart
      drawBarChart(ctx, months, monthlyExpenses, "Monthly Spending")
    }
  
    function loadExpensesData() {
      // Get all events
      const allEvents = JSON.parse(localStorage.getItem("allEvents")) || []
  
      // Calculate total expenses
      let totalExpenses = 0
      const categoryExpenses = {}
      const departmentExpenses = {}
      const monthlyExpenses = Array(12).fill(0)
  
      allEvents.forEach((event) => {
        const eventDate = new Date(event.startDate)
        const month = eventDate.getMonth()
  
        event.expenses.forEach((expense) => {
          totalExpenses += expense.amount
  
          // Category expenses
          if (categoryExpenses[expense.category]) {
            categoryExpenses[expense.category] += expense.amount
          } else {
            categoryExpenses[expense.category] = expense.amount
          }
  
          // Department expenses
          if (departmentExpenses[event.department]) {
            departmentExpenses[event.department] += expense.amount
          } else {
            departmentExpenses[event.department] = expense.amount
          }
  
          // Monthly expenses
          monthlyExpenses[month] += expense.amount
        })
      })
  
      // Update expense summary
      document.getElementById("expAnalysisTotalAmount").textContent = formatCurrency(totalExpenses)
  
      // Find highest category
      let highestCategory = ""
      let highestCategoryAmount = 0
  
      for (const category in categoryExpenses) {
        if (categoryExpenses[category] > highestCategoryAmount) {
          highestCategory = category
          highestCategoryAmount = categoryExpenses[category]
        }
      }
  
      document.getElementById("expAnalysisHighestCategory").textContent =
        `${highestCategory} (${formatCurrency(highestCategoryAmount)})`
  
      // Find highest department
      let highestDept = ""
      let highestDeptAmount = 0
  
      for (const dept in departmentExpenses) {
        if (departmentExpenses[dept] > highestDeptAmount) {
          highestDept = dept
          highestDeptAmount = departmentExpenses[dept]
        }
      }
  
      document.getElementById("expAnalysisHighestDept").textContent =
        `${highestDept} (${formatCurrency(highestDeptAmount)})`
  
      // Calculate monthly average
      const monthlyAvg = totalExpenses / 12
      document.getElementById("expAnalysisMonthlyAvg").textContent = formatCurrency(monthlyAvg)
  
      // Update expense charts
      updateExpenseAnalysisCharts(categoryExpenses, departmentExpenses, monthlyExpenses)
  
      // Update expense transactions table
      updateExpenseTransactionsTable(allEvents)
    }
  
    function updateExpenseAnalysisCharts(categoryExpenses, departmentExpenses, monthlyExpenses) {
      // Monthly expense trends chart
      const monthlyCtx = document.getElementById("monthlyExpenseTrendsChart").getContext("2d")
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
      // Clear canvas
      monthlyCtx.clearRect(0, 0, monthlyCtx.canvas.width, monthlyCtx.canvas.height)
  
      // Draw new chart
      drawLineChartWithLabels(monthlyCtx, months, monthlyExpenses, "Monthly Expense Trends", "#4361ee")
  
      // Expense categories chart
      const categoriesCtx = document.getElementById("expenseCategoriesChart").getContext("2d")
      const categoryLabels = Object.keys(categoryExpenses)
      const categoryData = Object.values(categoryExpenses)
  
      // Clear canvas
      categoriesCtx.clearRect(0, 0, categoriesCtx.canvas.width, categoriesCtx.canvas.height)
  
      // Draw new chart
      drawPieChart(categoriesCtx, categoryLabels, categoryData, "Expense Categories")
  
      // Department comparison chart
      const deptCtx = document.getElementById("expenseDeptComparisonChart").getContext("2d")
      const deptLabels = Object.keys(departmentExpenses)
      const deptData = Object.values(departmentExpenses)
  
      // Clear canvas
      deptCtx.clearRect(0, 0, deptCtx.canvas.width, deptCtx.canvas.height)
  
      // Draw new chart
      drawBarChart(deptCtx, deptLabels, deptData, "Department Expenses")
    }
  
    function drawLineChartWithLabels(ctx, labels, data, title, color) {
      const width = ctx.canvas.width
      const height = ctx.canvas.height
      const dataLength = data.length
      const maxValue = Math.max(...data, 1) // Avoid division by zero
      const padding = 40
  
      // Draw title
      ctx.fillStyle = "#343a40"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(title, width / 2, 20)
  
      // Draw y-axis
      ctx.beginPath()
      ctx.moveTo(padding, padding)
      ctx.lineTo(padding, height - padding)
      ctx.strokeStyle = "#ced4da"
      ctx.stroke()
  
      // Draw x-axis
      ctx.beginPath()
      ctx.moveTo(padding, height - padding)
      ctx.lineTo(width - padding, height - padding)
      ctx.strokeStyle = "#ced4da"
      ctx.stroke()
  
      // Draw y-axis labels
      const yStep = maxValue / 5
      for (let i = 0; i <= 5; i++) {
        const y = height - padding - (i / 5) * (height - 2 * padding)
        const value = Math.round(i * yStep)
  
        ctx.fillStyle = "#6c757d"
        ctx.font = "12px Arial"
        ctx.textAlign = "right"
        ctx.textBaseline = "middle"
        ctx.fillText(formatCurrency(value), padding - 10, y)
  
        // Draw grid line
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.strokeStyle = "#e9ecef"
        ctx.stroke()
      }
  
      // Draw x-axis labels
      const xStep = (width - 2 * padding) / (dataLength - 1)
      for (let i = 0; i < dataLength; i++) {
        const x = padding + i * xStep
  
        ctx.fillStyle = "#6c757d"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.fillText(labels[i], x, height - padding + 10)
      }
  
      // Draw line
      ctx.beginPath()
  
      for (let i = 0; i < dataLength; i++) {
        const x = padding + i * xStep
        const y = height - padding - (data[i] / maxValue) * (height - 2 * padding)
  
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
  
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.stroke()
  
      // Draw points
      for (let i = 0; i < dataLength; i++) {
        const x = padding + i * xStep
        const y = height - padding - (data[i] / maxValue) * (height - 2 * padding)
  
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()
  
        // Draw value
        ctx.fillStyle = "#343a40"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "bottom"
        ctx.fillText(formatCurrency(data[i]), x, y - 10)
      }
    }
  
    function updateExpenseTransactionsTable(events) {
      const expenseTransactionsTable = document.getElementById("expenseTransactionsTable").querySelector("tbody")
      expenseTransactionsTable.innerHTML = ""
  
      // Flatten events into expense transactions
      const transactions = []
  
      events.forEach((event) => {
        event.expenses.forEach((expense) => {
          transactions.push({
            department: event.department,
            event: event.name,
            category: expense.category,
            amount: expense.amount,
            date: event.startDate,
            status: getEventStatus(event),
          })
        })
      })
  
      // Sort transactions by date (most recent first)
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
  
      if (transactions.length === 0) {
        const row = document.createElement("tr")
        row.innerHTML = '<td colspan="6" class="text-center">No transactions found</td>'
        expenseTransactionsTable.appendChild(row)
        return
      }
  
      // Display up to 10 transactions
      const recentTransactions = transactions.slice(0, 10)
  
      recentTransactions.forEach((transaction) => {
        const row = document.createElement("tr")
  
        row.innerHTML = `
          <td>${transaction.department}</td>
          <td>${transaction.event}</td>
          <td>${transaction.category}</td>
          <td>${formatCurrency(transaction.amount)}</td>
          <td>${formatDate(transaction.date)}</td>
          <td><span class="status-badge ${transaction.status.toLowerCase()}">${transaction.status}</span></td>
        `
  
        expenseTransactionsTable.appendChild(row)
      })
    }
  
    function loadEventsData() {
      // Get all events
      const allEvents = JSON.parse(localStorage.getItem("allEvents")) || []
  
      // Update events table
      updateEventsTable(allEvents)
  
      // Initialize events calendar
      initializeEventsCalendar(allEvents)
    }
  
    function updateEventsTable(events) {
      const eventsTable = document.getElementById("eventsTable").querySelector("tbody")
      eventsTable.innerHTML = ""
  
      // Apply filters
      const statusFilter = document.getElementById("eventStatusFilter").value
      const departmentFilter = document.getElementById("eventDepartmentFilter").value
      const monthFilter = document.getElementById("eventMonthFilter").value
      const searchFilter = document.getElementById("eventSearch").value.toLowerCase()
  
      let filteredEvents = [...events]
  
      // Apply status filter
      if (statusFilter !== "all") {
        filteredEvents = filteredEvents.filter((event) => {
          const status = getEventStatus(event).toLowerCase()
          return status === statusFilter
        })
      }
  
      // Apply department filter
      if (departmentFilter !== "all") {
        filteredEvents = filteredEvents.filter((event) => event.department === departmentFilter)
      }
  
      // Apply month filter
      if (monthFilter) {
        const [year, month] = monthFilter.split("-").map(Number)
        filteredEvents = filteredEvents.filter((event) => {
          const eventDate = new Date(event.startDate)
          return eventDate.getFullYear() === year && eventDate.getMonth() === month - 1
        })
      }
  
      // Apply search filter
      if (searchFilter) {
        filteredEvents = filteredEvents.filter((event) => {
          return (
            event.name.toLowerCase().includes(searchFilter) ||
            event.department.toLowerCase().includes(searchFilter) ||
            event.venue.toLowerCase().includes(searchFilter)
          )
        })
      }
  
      // Sort events by date (most recent first)
      filteredEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  
      if (filteredEvents.length === 0) {
        const row = document.createElement("tr")
        row.innerHTML = '<td colspan="8" class="text-center">No events found</td>'
        eventsTable.appendChild(row)
        return
      }
  
      // Display events
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
          <td>${event.department}</td>
          <td>${event.name}</td>
          <td>${formatDate(event.startDate)}</td>
          <td>${formatDate(event.endDate)}</td>
          <td>${event.venue}</td>
          <td>${formatCurrency(totalExpense)}</td>
          <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
          <td>
            <button class="action-btn view-btn" data-event-id="${event._id}">
              <i class="fas fa-eye"></i>
            </button>
          </td>
        `
  
        eventsTable.appendChild(row)
      })
  
      // Add event listeners to view buttons
      const viewButtons = document.querySelectorAll(".view-btn")
      viewButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const eventId = this.getAttribute("data-event-id")
          showEventDetails(eventId)
        })
      })
    }
  
    function initializeEventsCalendar(events) {
      const calendar = document.getElementById("eventsCalendar")
      calendar.innerHTML = ""
  
      // Get current date
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth()
  
      // Update calendar header
      document.getElementById("calendarMonthYear").textContent = new Date(currentYear, currentMonth).toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" },
      )
  
      // Add day headers
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      days.forEach((day) => {
        const dayHeader = document.createElement("div")
        dayHeader.className = "calendar-day-header"
        dayHeader.textContent = day
        calendar.appendChild(dayHeader)
      })
  
      // Get first day of month and number of days in month
      const firstDay = new Date(currentYear, currentMonth, 1).getDay()
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
      // Add empty cells for days before first day of month
      for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement("div")
        emptyDay.className = "calendar-day"
        calendar.appendChild(emptyDay)
      }
  
      // Add days of month
      for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement("div")
        day.className = "calendar-day"
  
        // Create date element
        const dateElement = document.createElement("div")
        dateElement.className = "calendar-date"
        if (i === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear()) {
          dateElement.className += " today"
        }
        dateElement.textContent = i
        day.appendChild(dateElement)
  
        // Add events for this day
        const dayEvents = events.filter((event) => {
          const eventDate = new Date(event.startDate)
          return (
            eventDate.getDate() === i && eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear
          )
        })
  
        dayEvents.forEach((event) => {
          const eventElement = document.createElement("div")
          eventElement.className = "calendar-event"
          eventElement.textContent = event.name
          eventElement.setAttribute("data-event-id", event._id)
          day.appendChild(eventElement)
  
          // Add click event
          eventElement.addEventListener("click", function () {
            const eventId = this.getAttribute("data-event-id")
            showEventDetails(eventId)
          })
        })
  
        calendar.appendChild(day)
      }
    }
  
    function showEventDetails(eventId) {
      const allEvents = JSON.parse(localStorage.getItem("allEvents")) || []
      const event = allEvents.find((e) => e._id === eventId)
  
      if (!event) {
        showToast("Error", "Event not found", "error")
        return
      }
  
      const modal = document.getElementById("eventDetailsModal")
      const modalTitle = document.getElementById("eventDetailsTitle")
      const modalContent = document.getElementById("eventDetailsContent")
  
      modalTitle.textContent = event.name
  
      // Calculate total expense
      let totalExpense = 0
      event.expenses.forEach((expense) => {
        totalExpense += expense.amount
      })
  
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
  
      modalContent.innerHTML = `
        <div class="event-details">
          <div class="event-info">
            <p><strong>Department:</strong> ${event.department}</p>
            <p><strong>Club:</strong> ${event.club}</p>
            <p><strong>Date:</strong> ${formatDate(event.startDate)} to ${formatDate(event.endDate)}</p>
            <p><strong>Time:</strong> ${event.startTime} to ${event.endTime}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Status:</strong> <span class="status-badge ${getEventStatus(event).toLowerCase()}">${getEventStatus(event)}</span></p>
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
  
      // Show modal
      modal.classList.add("active")
  
      // Add close event
      const closeBtn = document.getElementById("closeEventDetailsModal")
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("active")
      })
    }
  
    function loadUsersData() {
      // Fetch admin users
      fetchAdminUsers()
  
      // Fetch department users
      fetchDepartmentUsers()
    }
  
    function fetchAdminUsers() {
      // In a real application, this would fetch from the server
      // For now, we'll use hardcoded data
      const adminUsers = [
        { id: 1, username: "admin", email: "admin@university.edu", lastLogin: "2023-05-15T10:30:00", status: "Active" },
        {
          id: 2,
          username: "superadmin",
          email: "superadmin@university.edu",
          lastLogin: "2023-05-14T14:45:00",
          status: "Active",
        },
      ]
  
      updateAdminUsersTable(adminUsers)
    }
  
    function fetchDepartmentUsers() {
      // In a real application, this would fetch from the server
      // For now, we'll use hardcoded data
      const departmentUsers = [
        {
          id: 1,
          department: "CSE",
          userId: "cse001",
          username: "cse001",
          email: "cse001@university.edu",
          status: "Active",
        },
        {
          id: 2,
          department: "CSE",
          userId: "cse002",
          username: "cse002",
          email: "cse002@university.edu",
          status: "Active",
        },
        {
          id: 3,
          department: "Architecture",
          userId: "arch001",
          username: "arch001",
          email: "arch001@university.edu",
          status: "Active",
        },
        {
          id: 4,
          department: "Architecture",
          userId: "arch002",
          username: "arch002",
          email: "arch002@university.edu",
          status: "Active",
        },
        {
          id: 5,
          department: "Pharma",
          userId: "pharma001",
          username: "pharma001",
          email: "pharma001@university.edu",
          status: "Active",
        },
        {
          id: 6,
          department: "Pharma",
          userId: "pharma002",
          username: "pharma002",
          email: "pharma002@university.edu",
          status: "Active",
        },
        {
          id: 7,
          department: "Business School",
          userId: "biz001",
          username: "biz001",
          email: "biz001@university.edu",
          status: "Active",
        },
        {
          id: 8,
          department: "Business School",
          userId: "biz002",
          username: "biz002",
          email: "biz002@university.edu",
          status: "Active",
        },
      ]
  
      updateDepartmentUsersTable(departmentUsers)
    }
  
    function updateAdminUsersTable(users) {
      const adminUsersTable = document.getElementById("adminUsersTable").querySelector("tbody")
      adminUsersTable.innerHTML = ""
  
      if (users.length === 0) {
        const row = document.createElement("tr")
        row.innerHTML = '<td colspan="5" class="text-center">No admin users found</td>'
        adminUsersTable.appendChild(row)
        return
      }
  
      users.forEach((user) => {
        const row = document.createElement("tr")
  
        row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${formatDate(user.lastLogin)}</td>
          <td><span class="status-badge ${user.status.toLowerCase()}">${user.status}</span></td>
          <td>
            <button class="action-btn edit-btn" data-user-id="${user.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" data-user-id="${user.id}">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        `
  
        adminUsersTable.appendChild(row)
      })
    }
  
    function updateDepartmentUsersTable(users) {
      const departmentUsersTable = document.getElementById("departmentUsersTable").querySelector("tbody")
      departmentUsersTable.innerHTML = ""
  
      if (users.length === 0) {
        const row = document.createElement("tr")
        row.innerHTML = '<td colspan="6" class="text-center">No department users found</td>'
        departmentUsersTable.appendChild(row)
        return
      }
  
      users.forEach((user) => {
        const row = document.createElement("tr")
  
        row.innerHTML = `
          <td>${user.department}</td>
          <td>${user.userId}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td><span class="status-badge ${user.status.toLowerCase()}">${user.status}</span></td>
          <td>
            <button class="action-btn edit-btn" data-user-id="${user.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" data-user-id="${user.id}">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        `
  
        departmentUsersTable.appendChild(row)
      })
    }
  
    // Helper Functions
    function getEventStatus(event) {
      const now = new Date()
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)
  
      if (endDate < now) {
        return "Completed"
      } else if (startDate <= now && endDate >= now) {
        return "Ongoing"
      } else {
        return "Upcoming"
      }
    }
  
    function formatCurrency(amount) {
      return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
    }
  
    function formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }
  
    function showToast(title, message, type) {
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
  })
  
  