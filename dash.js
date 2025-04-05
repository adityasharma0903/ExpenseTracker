// Mock Data
const departments = [
    {
        id: "cs",
        name: "Computer Science",
        totalBudget: 120000,
        spent: 85000,
        trend: 5.2,
    },
    {
        id: "eng",
        name: "Engineering",
        totalBudget: 150000,
        spent: 110000,
        trend: -2.1,
    },
    {
        id: "bus",
        name: "Business",
        totalBudget: 100000,
        spent: 75000,
        trend: 3.7,
    },
    {
        id: "arts",
        name: "Arts & Humanities",
        totalBudget: 80000,
        spent: 65000,
        trend: 1.5,
    },
    {
        id: "sci",
        name: "Science",
        totalBudget: 130000,
        spent: 95000,
        trend: -1.8,
    },
];

const expenseData = {
    past: [
        {
            name: "Computer Science",
            venue: 25000,
            catering: 18000,
            equipment: 32000,
            misc: 10000,
            total: 85000,
        },
        {
            name: "Engineering",
            venue: 35000,
            catering: 25000,
            equipment: 40000,
            misc: 10000,
            total: 110000,
        },
        {
            name: "Business",
            venue: 30000,
            catering: 20000,
            equipment: 15000,
            misc: 10000,
            total: 75000,
        },
        {
            name: "Arts & Humanities",
            venue: 25000,
            catering: 15000,
            equipment: 15000,
            misc: 10000,
            total: 65000,
        },
        {
            name: "Science",
            venue: 30000,
            catering: 25000,
            equipment: 30000,
            misc: 10000,
            total: 95000,
        },
    ],
    planned: [
        {
            name: "Computer Science",
            venue: 15000,
            catering: 12000,
            equipment: 18000,
            misc: 5000,
            total: 50000,
        },
        {
            name: "Engineering",
            venue: 20000,
            catering: 15000,
            equipment: 25000,
            misc: 5000,
            total: 65000,
        },
        {
            name: "Business",
            venue: 18000,
            catering: 12000,
            equipment: 10000,
            misc: 5000,
            total: 45000,
        },
        {
            name: "Arts & Humanities",
            venue: 12000,
            catering: 8000,
            equipment: 8000,
            misc: 2000,
            total: 30000,
        },
        {
            name: "Science",
            venue: 15000,
            catering: 12000,
            equipment: 18000,
            misc: 5000,
            total: 50000,
        },
    ],
    future: [
        {
            name: "Computer Science",
            venue: 10000,
            catering: 8000,
            equipment: 12000,
            misc: 3000,
            total: 33000,
        },
        {
            name: "Engineering",
            venue: 12000,
            catering: 10000,
            equipment: 15000,
            misc: 3000,
            total: 40000,
        },
        {
            name: "Business",
            venue: 10000,
            catering: 8000,
            equipment: 7000,
            misc: 2000,
            total: 27000,
        },
        {
            name: "Arts & Humanities",
            venue: 8000,
            catering: 5000,
            equipment: 5000,
            misc: 2000,
            total: 20000,
        },
        {
            name: "Science",
            venue: 10000,
            catering: 8000,
            equipment: 12000,
            misc: 3000,
            total: 33000,
        },
    ],
};

// DOM Elements
const filterButton = document.getElementById('filter-button');
const filterDropdown = document.getElementById('filter-dropdown');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const tabButtons = document.querySelectorAll('.tab-button');
const chartTypeButtons = document.querySelectorAll('.chart-type-button');
const departmentsList = document.querySelector('.departments-list');

// Current state
let currentTab = 'past';
let currentChartType = 'bar';
let chart = null;

const logoutBtn = document.querySelector('.sidebar-footer a');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem("loggedInUser");
            window.location.href = "login.html"; // Redirect to login page
        });
    }

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    renderDepartmentsList();
    initializeChart();
    displayUserInfo();
    
    // Filter dropdown toggle
    filterButton.addEventListener('click', function() {
        filterDropdown.classList.toggle('show');
    });
    
    // Close filter dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!filterButton.contains(event.target) && !filterDropdown.contains(event.target)) {
            filterDropdown.classList.remove('show');
        }
    });
    
    // Sidebar toggle
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show');
    });
    
    // Tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.dataset.tab;
            currentTab = tab;
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart
            updateChart();
        });
    });
    
    // Chart type buttons
    chartTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            currentChartType = type;
            
            // Update active button
            chartTypeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart
            updateChart();
        });
    });
});

function displayUserInfo() {
    // Get logged in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
    if (loggedInUser) {
        // Find the user profile element and update it
        const userProfileName = document.querySelector('.user-profile span');
        
        if (userProfileName) {
            // For admin users, show their username
            if (loggedInUser.type === "admin") {
                userProfileName.textContent = loggedInUser.username;
            } 
            // For department users, show their department
            else if (loggedInUser.type === "department") {
                userProfileName.textContent = `${loggedInUser.department} User`;
            }
            // Fallback for any other user type
            else {
                userProfileName.textContent = "User";
            }
        }
    }
}

// Render departments list
function renderDepartmentsList() {
    departmentsList.innerHTML = '';
    
    departments.forEach(dept => {
        const percentUsed = (dept.spent / dept.totalBudget) * 100;
        const isOverBudget = percentUsed > 100;
        
        let progressClass = 'good';
        if (percentUsed > 90) {
            progressClass = 'warning';
        }
        if (isOverBudget) {
            progressClass = 'danger';
        }
        
        const departmentItem = document.createElement('div');
        departmentItem.className = 'department-item';
        departmentItem.innerHTML = `
            <div class="department-header">
                <div class="department-name">${dept.name}</div>
                <div class="department-arrow"><i class="fas fa-chevron-right"></i></div>
            </div>
            <div class="department-budget">
                <span>$${dept.spent.toLocaleString()}</span>
                <span>/</span>
                <span>$${dept.totalBudget.toLocaleString()}</span>
                <span class="department-trend ${dept.trend > 0 ? 'up' : 'down'}">
                    <i class="fas fa-${dept.trend > 0 ? 'arrow-up' : 'arrow-down'}"></i>
                </span>
            </div>
            <div class="progress-container">
                <div class="progress-bar ${progressClass}" style="width: ${Math.min(percentUsed, 100)}%"></div>
            </div>
        `;
        
        departmentItem.addEventListener('click', function() {
            window.location.href = `department.html?id=${dept.id}`;
        });
        
        departmentsList.appendChild(departmentItem);
    });
}

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('expense-chart').getContext('2d');
    
    // Create initial chart
    chart = new Chart(ctx, {
        type: currentChartType,
        data: getChartData(),
        options: getChartOptions()
    });
}

// Update chart when tab or chart type changes
function updateChart() {
    if (chart) {
        chart.destroy();
    }
    
    const ctx = document.getElementById('expense-chart').getContext('2d');
    chart = new Chart(ctx, {
        type: currentChartType,
        data: getChartData(),
        options: getChartOptions()
    });
}

// Get chart data based on current tab and chart type
function getChartData() {
    const data = expenseData[currentTab];
    
    if (currentChartType === 'bar') {
        return {
            labels: data.map(item => item.name),
            datasets: [
                {
                    label: 'Venue',
                    data: data.map(item => item.venue),
                    backgroundColor: 'rgba(99, 102, 241, 0.7)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Catering',
                    data: data.map(item => item.catering),
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Equipment',
                    data: data.map(item => item.equipment),
                    backgroundColor: 'rgba(245, 158, 11, 0.7)',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Miscellaneous',
                    data: data.map(item => item.misc),
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 1
                }
            ]
        };
    } else {
        // Pie chart data
        return {
            labels: data.map(item => item.name),
            datasets: [
                {
                    data: data.map(item => item.total),
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(239, 68, 68, 0.7)',
                        'rgba(139, 92, 246, 0.7)'
                    ],
                    borderColor: [
                        'rgba(99, 102, 241, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(139, 92, 246, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        };
    }
}

// Get chart options based on chart type
function getChartOptions() {
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += '$' + context.raw.toLocaleString();
                        return label;
                    }
                }
            },
            legend: {
                position: 'bottom'
            }
        }
    };
    
    if (currentChartType === 'bar') {
        return {
            ...baseOptions,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        };
    } else {
        return baseOptions;
    }
}