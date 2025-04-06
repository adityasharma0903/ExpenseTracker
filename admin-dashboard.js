// import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))

  if (!loggedInUser || loggedInUser.type !== "admin") {
    // Redirect to login page if not logged in as admin
    window.location.href = "login.html"
    return
  }

  // DOM Elements
  const sidebarToggle = document.getElementById("sidebarToggle")
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

  // Event Details Modal Elements
  const eventDetailsModal = document.getElementById("eventDetailsModal")
  const closeEventDetailsModal = document.getElementById("closeEventDetailsModal")
  const closeEventDetailsBtn = document.getElementById("closeEventDetailsBtn")

  // Department Details Modal Elements
  const departmentDetailsModal = document.getElementById("departmentDetailsModal")
  const closeDepartmentDetailsModal = document.getElementById("closeDepartmentDetailsModal")
  const closeDepartmentDetailsBtn = document.getElementById("closeDepartmentDetailsBtn")

  // Toast Elements
  const toast = document.getElementById("toast")
  const toastClose = document.querySelector(".toast-close")

  // Set current date
  const now = new Date()
  currentDate.textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Toggle sidebar
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed")
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

      // If departments tab is selected, update departments grid
      if (tabId === "departments") {
        updateDepartmentsGrid()
      }
    })
  })

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
    window.location.href = "login.html"
  }

  // Close Event Details Modal
  closeEventDetailsModal.addEventListener("click", () => {
    closeModal(eventDetailsModal)
  })

  closeEventDetailsBtn.addEventListener("click", () => {
    closeModal(eventDetailsModal)
  })

  // Close Department Details Modal
  closeDepartmentDetailsModal.addEventListener("click", () => {
    closeModal(departmentDetailsModal)
  })

  closeDepartmentDetailsBtn.addEventListener("click", () => {
    closeModal(departmentDetailsModal)
  })

  // Close Toast
  toastClose.addEventListener("click", () => {
    toast.classList.remove("active")
  })

  // Initialize Dashboard
  initializeDashboard()

  // Functions
  function initializeDashboard() {
    // Fetch all departments data
    fetchAllDepartmentsData()
      .then((data) => {
        // Update overview stats
        updateOverviewStats(data)

        // Initialize charts
        initializeCharts(data)

        // Update recent events table
        updateRecentEventsTable(data)

        // Update departments grid
        updateDepartmentsGrid(data)

        // Update events table
        updateEventsTable(data)

        // Update expenses data
        updateExpensesData(data)

        // Initialize calendar
        initializeCalendar(data)
      })
      .catch((error) => {
        console.error("Error initializing dashboard:", error)
        showToast("Error", "Failed to initialize dashboard", "error")
      })
  }

  async function fetchAllDepartmentsData() {
    try {
      const departments = ["CSE", "Architecture", "Pharma", "Business School"]
      const allData = {
        departments: departments,
        events: [],
        expenses: [],
      }

      // Fetch events for each department
      for (const department of departments) {
        const response = await fetch(
          `http://localhost:5000/api/get-events?department=${encodeURIComponent(department)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch events for ${department}`)
        }

        const data = await response.json()

        if (data.success) {
          // Add department name to each event
          const eventsWithDept = data.events.map((event) => ({
            ...event,
            department: department,
          }))

          allData.events = [...allData.events, ...eventsWithDept]

          // Extract expenses from events
          eventsWithDept.forEach((event) => {
            event.expenses.forEach((expense) => {
              allData.expenses.push({
                eventId: event._id,
                eventName: event.name,
                department: department,
                category: expense.category,
                amount: expense.amount,
                date: event.startDate,
              })
            })
          })
        }
      }

      return allData
    } catch (error) {
      console.error("Error fetching departments data:", error)
      throw error
    }
  }

  function updateOverviewStats(data) {
    const totalDepartments = document.getElementById("totalDepartments")
    const totalEvents = document.getElementById("totalEvents")
    const totalExpenses = document.getElementById("totalExpenses")
    const upcomingEvents = document.getElementById("upcomingEvents")

    // Set total departments
    totalDepartments.textContent = data.departments.length

    // Set total events
    totalEvents.textContent = data.events.length

    // Calculate total expenses
    let expensesSum = 0
    data.expenses.forEach((expense) => {
      expensesSum += expense.amount
    })
    totalExpenses.textContent = formatCurrency(expensesSum)

    // Calculate upcoming events
    const today = new Date()
    const upcomingCount = data.events.filter((event) => {
      const endDate = new Date(event.endDate)
      return endDate >= today
    }).length
    upcomingEvents.textContent = upcomingCount
  }

  function initializeCharts(data) {
    // Department Expenses Chart
    const deptExpensesCtx = document.getElementById("departmentExpensesChart").getContext("2d")
    const deptExpensesData = calculateExpensesByDepartment(data)

    window.deptExpensesChart = new Chart(deptExpensesCtx, {
      type: "bar",
      data: {
        labels: deptExpensesData.departments,
        datasets: [
          {
            label: "Total Expenses",
            data: deptExpensesData.amounts,
            backgroundColor: [
              "rgba(67, 97, 238, 0.7)",
              "rgba(76, 201, 240, 0.7)",
              "rgba(114, 9, 183, 0.7)",
              "rgba(243, 114, 44, 0.7)",
            ],
            borderColor: [
              "rgba(67, 97, 238, 1)",
              "rgba(76, 201, 240, 1)",
              "rgba(114, 9, 183, 1)",
              "rgba(243, 114, 44, 1)",
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
              callback: (value) => "$" + value,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return "Total: " + formatCurrency(context.raw)
              },
            },
          },
        },
      },
    })

    // Expense Categories Chart
    const expenseCategoriesCtx = document.getElementById("expenseCategoriesChart").getContext("2d")
    const expenseCategoriesData = calculateExpensesByCategory(data)

    window.expenseCategoriesChart = new Chart(expenseCategoriesCtx, {
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
    const monthlyExpensesCtx = document.getElementById("monthlyExpensesChart").getContext("2d")
    const monthlyExpensesData = calculateExpensesByMonth(data)

    window.monthlyExpensesChart = new Chart(monthlyExpensesCtx, {
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
              callback: (value) => "$" + value,
            },
          },
        },
      },
    })

    // Expense Distribution Chart
    const expenseDistributionCtx = document.getElementById("expenseDistributionChart").getContext("2d")
    const expenseDistributionData = calculateExpensesByCategory(data)

    window.expenseDistributionChart = new Chart(expenseDistributionCtx, {
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

    // Department Comparison Chart
    const departmentComparisonCtx = document.getElementById("departmentComparisonChart").getContext("2d")
    const departmentComparisonData = calculateDepartmentComparison(data)

    window.departmentComparisonChart = new Chart(departmentComparisonCtx, {
      type: "bar",
      data: {
        labels: departmentComparisonData.departments,
        datasets: departmentComparisonData.datasets,
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
              callback: (value) => "$" + value,
            },
          },
        },
      },
    })

    // Update charts when filters change
    document.getElementById("deptExpenseChartYear").addEventListener("change", function () {
      updateDepartmentExpensesChart(data, this.value)
    })

    document.getElementById("expenseCategoryChartYear").addEventListener("change", function () {
      updateExpenseCategoriesChart(data, this.value)
    })

    document.getElementById("expenseComparisonCategory").addEventListener("change", function () {
      updateDepartmentComparisonChart(data, this.value)
    })

    document.getElementById("expenseTimeFilter").addEventListener("change", function () {
      updateExpensesData(data, this.value)
    })

    document.getElementById("expenseDeptFilter").addEventListener("change", function () {
      const timeFilter = document.getElementById("expenseTimeFilter").value
      updateExpensesData(data, timeFilter, this.value)
    })

    document.getElementById("resetExpenseFilters").addEventListener("click", () => {
      document.getElementById("expenseTimeFilter").value = "thisYear"
      document.getElementById("expenseDeptFilter").value = "all"
      updateExpensesData(data, "thisYear", "all")
    })
  }

  function calculateExpensesByDepartment(data, year = new Date().getFullYear()) {
    const departments = {}

    data.expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date)
      if (expenseDate.getFullYear() === Number(year)) {
        if (departments[expense.department]) {
          departments[expense.department] += expense.amount
        } else {
          departments[expense.department] = expense.amount
        }
      }
    })

    return {
      departments: Object.keys(departments),
      amounts: Object.values(departments),
    }
  }

  function calculateExpensesByCategory(data, year = new Date().getFullYear(), department = "all") {
    const categories = {}

    data.expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date)
      if (expenseDate.getFullYear() === Number(year) && (department === "all" || expense.department === department)) {
        if (categories[expense.category]) {
          categories[expense.category] += expense.amount
        } else {
          categories[expense.category] = expense.amount
        }
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

  function calculateExpensesByMonth(data, year = new Date().getFullYear(), department = "all") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const amounts = Array(12).fill(0)

    data.expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date)
      if (expenseDate.getFullYear() === Number(year) && (department === "all" || expense.department === department)) {
        const month = expenseDate.getMonth()
        amounts[month] += expense.amount
      }
    })

    return {
      months: months,
      amounts: amounts,
    }
  }

  function calculateDepartmentComparison(data, year = new Date().getFullYear(), selectedCategory = "all") {
    const departments = [...new Set(data.expenses.map((expense) => expense.department))]
    const categories = [...new Set(data.expenses.map((expense) => expense.category))]

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

      const departmentAmounts = departments.map((dept) => {
        const filteredExpenses = data.expenses.filter((expense) => {
          const expenseDate = new Date(expense.date)
          return (
            expenseDate.getFullYear() === Number(year) && expense.department === dept && expense.category === category
          )
        })

        return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      })

      return {
        label: category,
        data: departmentAmounts,
        backgroundColor: colors[index % colors.length],
        borderWidth: 1,
      }
    })

    return {
      departments: departments,
      datasets: datasets,
    }
  }

  function updateDepartmentExpensesChart(data, year) {
    const deptExpensesData = calculateExpensesByDepartment(data, year)

    window.deptExpensesChart.data.labels = deptExpensesData.departments
    window.deptExpensesChart.data.datasets[0].data = deptExpensesData.amounts
    window.deptExpensesChart.update()
  }

  function updateExpenseCategoriesChart(data, year) {
    const expenseCategoriesData = calculateExpensesByCategory(data, year)

    window.expenseCategoriesChart.data.labels = expenseCategoriesData.categories
    window.expenseCategoriesChart.data.datasets[0].data = expenseCategoriesData.amounts
    window.expenseCategoriesChart.update()
  }

  function updateDepartmentComparisonChart(data, category) {
    const departmentComparisonData = calculateDepartmentComparison(data, new Date().getFullYear(), category)

    window.departmentComparisonChart.data.labels = departmentComparisonData.departments
    window.departmentComparisonChart.data.datasets = departmentComparisonData.datasets
    window.departmentComparisonChart.update()
  }

  function updateRecentEventsTable(data) {
    const recentEventsTable = document.getElementById("recentEventsTable").querySelector("tbody")
    recentEventsTable.innerHTML = ""

    // Sort events by date (most recent first)
    const sortedEvents = [...data.events].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).slice(0, 5) // Get only the 5 most recent events

    if (sortedEvents.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = `<td colspan="5" class="text-center">No events found</td>`
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

      // Determine event status
      const status = getEventStatus(event)

      row.innerHTML = `
        <td>${event.name}</td>
        <td>${event.department}</td>
        <td>${formatDate(event.startDate)}</td>
        <td>${formatCurrency(totalExpense)}</td>
        <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
      `

      row.addEventListener("click", () => {
        openEventDetails(event)
      })

      recentEventsTable.appendChild(row)
    })
  }

  function updateDepartmentsGrid(data) {
    const departmentGrid = document.getElementById("departmentGrid")
    departmentGrid.innerHTML = ""

    // Group events by department
    const departmentEvents = {}
    data.departments.forEach((dept) => {
      departmentEvents[dept] = data.events.filter((event) => event.department === dept)
    })

    data.departments.forEach((dept) => {
      const events = departmentEvents[dept]

      // Calculate total expenses for the department
      let totalExpenses = 0
      events.forEach((event) => {
        event.expenses.forEach((expense) => {
          totalExpenses += expense.amount
        })
      })

      // Calculate upcoming events
      const today = new Date()
      const upcomingEvents = events.filter((event) => {
        const endDate = new Date(event.endDate)
        return endDate >= today
      }).length

      // Create department card
      const departmentCard = document.createElement("div")
      departmentCard.className = "department-card"
      departmentCard.setAttribute("data-department", dept)

      departmentCard.innerHTML = `
        <div class="department-header">
          <h3>${dept}</h3>
          <p>${getDepartmentFullName(dept)}</p>
        </div>
        <div class="department-body">
          <div class="department-stats">
            <div class="department-stat">
              <h4>${events.length}</h4>
              <p>Events</p>
            </div>
            <div class="department-stat">
              <h4>${formatCurrency(totalExpenses)}</h4>
              <p>Expenses</p>
            </div>
          </div>
          <div class="department-footer">
            <p>${upcomingEvents} upcoming events</p>
            <a href="#" class="view-btn">View Details</a>
          </div>
        </div>
      `

      departmentCard.addEventListener("click", () => {
        showDepartmentDetails(dept, events)
      })

      departmentGrid.appendChild(departmentCard)
    })

    // Add event listener to refresh button
    document.getElementById("refreshDepartmentsBtn").addEventListener("click", () => {
      fetchAllDepartmentsData()
        .then((data) => {
          updateDepartmentsGrid(data)
          showToast("Success", "Departments data refreshed", "success")
        })
        .catch((error) => {
          console.error("Error refreshing departments:", error)
          showToast("Error", "Failed to refresh departments data", "error")
        })
    })
  }

  function showDepartmentDetails(department, events) {
    const selectedDepartmentName = document.getElementById("selectedDepartmentName")
    const departmentContent = document.getElementById("departmentContent")

    selectedDepartmentName.textContent = getDepartmentFullName(department)

    // Calculate total expenses
    let totalExpenses = 0
    events.forEach((event) => {
      event.expenses.forEach((expense) => {
        totalExpenses += expense.amount
      })
    })

    // Calculate expense categories
    const categories = {}
    events.forEach((event) => {
      event.expenses.forEach((expense) => {
        if (categories[expense.category]) {
          categories[expense.category] += expense.amount
        } else {
          categories[expense.category] = expense.amount
        }
      })
    })

    // Sort categories by amount
    const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1])

    // Create categories HTML
    let categoriesHtml = ""
    sortedCategories.forEach(([category, amount]) => {
      const percentage = Math.round((amount / totalExpenses) * 100)
      categoriesHtml += `
        <div class="expense-category-item">
          <div class="category-info">
            <span>${category}</span>
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
    const sortedEvents = [...events].sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

    sortedEvents.forEach((event) => {
      let eventExpenses = 0
      event.expenses.forEach((expense) => {
        eventExpenses += expense.amount
      })

      const status = getEventStatus(event)

      eventsHtml += `
        <tr>
          <td>${event.name}</td>
          <td>${formatDate(event.startDate)}</td>
          <td>${event.venue}</td>
          <td>${formatCurrency(eventExpenses)}</td>
          <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
        </tr>
      `
    })

    departmentContent.innerHTML = `
      <div class="department-details-content">
        <div class="department-summary">
          <div class="summary-card">
            <div class="summary-icon blue">
              <i class="fas fa-calendar-check"></i>
            </div>
            <div class="summary-info">
              <h4>Total Events</h4>
              <p>${events.length}</p>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon purple">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="summary-info">
              <h4>Total Expenses</h4>
              <p>${formatCurrency(totalExpenses)}</p>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon green">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="summary-info">
              <h4>Avg. per Event</h4>
              <p>${formatCurrency(events.length > 0 ? totalExpenses / events.length : 0)}</p>
            </div>
          </div>
        </div>

        <div class="department-expense-categories">
          <h4>Expense Categories</h4>
          <div class="expense-categories-list">
            ${categoriesHtml || '<p class="no-data">No expense data available</p>'}
          </div>
        </div>

        <div class="department-events">
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

    // Add CSS for the department details content
    const style = document.createElement("style")
    style.textContent = `
      .department-details-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .department-summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
      }
      .summary-card {
        background-color: white;
        border-radius: 8px;
        padding: 15px;
        display: flex;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .summary-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        margin-right: 15px;
        color: white;
      }
      .summary-icon.blue {
        background-color: var(--blue);
      }
      .summary-icon.purple {
        background-color: var(--purple);
      }
      .summary-icon.green {
        background-color: var(--green);
      }
      .summary-info h4 {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--gray-color);
        margin-bottom: 5px;
      }
      .summary-info p {
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--dark-color);
      }
      .department-expense-categories, .department-events {
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .department-expense-categories h4, .department-events h4 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 15px;
        color: var(--dark-color);
      }
      .expense-categories-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .expense-category-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .category-info {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
      }
      .category-bar {
        height: 8px;
        background-color: #f5f7fb;
        border-radius: 4px;
        overflow: hidden;
      }
      .category-progress {
        height: 100%;
        background-color: var(--primary-color);
        border-radius: 4px;
      }
      .no-data {
        color: var(--gray-color);
        text-align: center;
        padding: 20px;
      }
      @media (max-width: 768px) {
        .department-summary {
          grid-template-columns: 1fr;
        }
      }
    `
    document.head.appendChild(style)
  }

  function updateEventsTable(data) {
    const eventsTable = document.getElementById("eventsTable").querySelector("tbody")
    eventsTable.innerHTML = ""

    // Get filter values
    const searchTerm = document.getElementById("eventSearchInput").value.toLowerCase()
    const statusFilter = document.getElementById("eventStatusFilter").value
    const deptFilter = document.getElementById("eventDeptFilter").value

    // Filter events
    let filteredEvents = [...data.events]

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

    // Apply department filter
    if (deptFilter !== "all") {
      filteredEvents = filteredEvents.filter((event) => event.department === deptFilter)
    }

    // Sort events by date (most recent first)
    filteredEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

    if (filteredEvents.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = `<td colspan="9" class="text-center">No events found</td>`
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
        <td>${event.department}</td>
        <td>${event.club}</td>
        <td>${formatDate(event.startDate)}</td>
        <td>${formatDate(event.endDate)}</td>
        <td>${event.venue}</td>
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
      viewBtn.addEventListener("click", () => {
        openEventDetails(event)
      })

      eventsTable.appendChild(row)
    })

    // Add event listeners to filter controls
    document.getElementById("eventSearchInput").addEventListener("input", () => {
      updateEventsTable(data)
    })

    document.getElementById("eventStatusFilter").addEventListener("change", () => {
      updateEventsTable(data)
    })

    document.getElementById("eventDeptFilter").addEventListener("change", () => {
      updateEventsTable(data)
    })

    document.getElementById("resetEventFilters").addEventListener("click", () => {
      document.getElementById("eventSearchInput").value = ""
      document.getElementById("eventStatusFilter").value = "all"
      document.getElementById("eventDeptFilter").value = "all"
      updateEventsTable(data)
    })
  }

  function updateExpensesData(data, timeFilter = "thisYear", deptFilter = "all") {
    // Filter expenses based on time period
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    let filteredExpenses = [...data.expenses]

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

    // Filter by department if specified
    if (deptFilter !== "all") {
      filteredExpenses = filteredExpenses.filter((expense) => expense.department === deptFilter)
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
    window.expenseDistributionChart.data.labels = categories
    window.expenseDistributionChart.data.datasets[0].data = amounts
    window.expenseDistributionChart.update()

    // Group expenses by event and month
    const eventsByMonth = {}
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      const month = date.getMonth()

      if (!eventsByMonth[month]) {
        eventsByMonth[month] = {}
      }

      if (!eventsByMonth[month][expense.eventId]) {
        eventsByMonth[month][expense.eventId] = 0
      }

      eventsByMonth[month][expense.eventId] += expense.amount
    })

    // Calculate total expenses per month
    const monthlyAmounts = months.map((_, index) => {
      if (!eventsByMonth[index]) return 0

      return Object.values(eventsByMonth[index]).reduce((sum, amount) => sum + amount, 0)
    })

    // Update monthly expenses chart
    window.monthlyExpensesChart.data.labels = months
    window.monthlyExpensesChart.data.datasets[0].data = monthlyAmounts
    window.monthlyExpensesChart.update()
  }

  function updateExpensesTable(expenses) {
    const expensesTable = document.getElementById("expensesTable").querySelector("tbody")
    expensesTable.innerHTML = ""

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
          expense.department.toLowerCase().includes(searchTerm),
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
      expensesTable.appendChild(row)
      return
    }

    filteredExpenses.forEach((expense) => {
      const row = document.createElement("tr")

      row.innerHTML = `
        <td>${expense.department}</td>
        <td>${expense.eventName}</td>
        <td>${expense.category}</td>
        <td>${formatCurrency(expense.amount)}</td>
        <td>${formatDate(expense.date)}</td>
      `

      expensesTable.appendChild(row)
    })

    // Add event listeners to filter controls
    document.getElementById("expenseSearchInput")?.addEventListener("input", () => {
      updateExpensesTable(expenses)
    })

    document.getElementById("expenseCategoryFilter")?.addEventListener("change", () => {
      updateExpensesTable(expenses)
    })
  }

  function initializeCalendar(data) {
    const calendarMonth = document.getElementById("calendarMonth")
    const eventsCalendar = document.getElementById("eventsCalendar")
    const prevMonthBtn = document.getElementById("prevMonth")
    const nextMonthBtn = document.getElementById("nextMonth")

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
        const dayEvents = data.events.filter((event) => {
          const startDate = new Date(event.startDate)
          const endDate = new Date(event.endDate)
          return currentDay >= startDate && currentDay <= endDate
        })

        // Create events HTML
        let eventsHtml = ""
        dayEvents.slice(0, 3).forEach((event) => {
          const deptClass = event.department.toLowerCase().replace(" ", "-")
          eventsHtml += `
            <div class="calendar-event ${deptClass}" data-event-id="${event._id}">
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
          const event = data.events.find((event) => event._id === eventId)
          if (event) {
            openEventDetails(event)
          }
        })
      })
    }
  }

  function openEventDetails(event) {
    const eventDetailsTitle = document.getElementById("eventDetailsTitle")
    const eventDetailsContent = document.getElementById("eventDetailsContent")

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
          <p><strong>Department:</strong> ${event.department}</p>
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

    // Add CSS for the event details
    const style = document.createElement("style")
    style.textContent = `
      .event-details {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .event-info {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      .event-info p {
        margin: 0;
      }
      .event-description h4, .event-expenses h4 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 10px;
        color: var(--dark-color);
      }
      .expenses-table {
        width: 100%;
        border-collapse: collapse;
      }
      .expenses-table th, .expenses-table td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid var(--gray-light);
      }
      .expenses-table th {
        font-weight: 600;
        color: var(--gray-dark);
        background-color: #f8f9fa;
      }
      .total-row {
        background-color: #f5f7fb;
      }
      @media (max-width: 768px) {
        .event-info {
          grid-template-columns: 1fr;
        }
      }
    `
    document.head.appendChild(style)

    // Show modal
    openModal(eventDetailsModal)
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

  function getDepartmentFullName(department) {
    const deptMap = {
      CSE: "Computer Science & Engineering",
      Architecture: "School of Architecture",
      Pharma: "Pharmaceutical Sciences",
      "Business School": "School of Business Management",
    }

    return deptMap[department] || department
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

  function formatTime(timeString) {
    if (!timeString) return ""

    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12

    return `${hour12}:${minutes} ${ampm}`
  }
})