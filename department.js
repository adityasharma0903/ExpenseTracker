// Mock Data
const departments = {
    "cs": {
        id: "cs",
        name: "Computer Science",
        totalBudget: 120000,
        spent: 85000,
        trend: 5.2,
    },
    "eng": {
        id: "eng",
        name: "Engineering",
        totalBudget: 150000,
        spent: 110000,
        trend: -2.1,
    },
    "bus": {
        id: "bus",
        name: "Business",
        totalBudget: 100000,
        spent: 75000,
        trend: 3.7,
    },
    "arts": {
        id: "arts",
        name: "Arts & Humanities",
        totalBudget: 80000,
        spent: 65000,
        trend: 1.5,
    },
    "sci": {
        id: "sci",
        name: "Science",
        totalBudget: 130000,
        spent: 95000,
        trend: -1.8,
    },
};

const events = {
    cs: {
        past: [
            {
                id: "cs-past-1",
                name: "Annual Tech Conference",
                date: "March 15, 2023",
                budget: 45000,
                expenses: {
                    venue: 15000,
                    catering: 10000,
                    equipment: 15000,
                    misc: 5000,
                },
            },
            {
                id: "cs-past-2",
                name: "Hackathon 2023",
                date: "May 20, 2023",
                budget: 30000,
                expenses: {
                    venue: 10000,
                    catering: 8000,
                    equipment: 10000,
                    misc: 2000,
                },
            },
        ],
        planned: [
            {
                id: "cs-planned-1",
                name: "AI Workshop Series",
                date: "October 10, 2023",
                budget: 25000,
                expenses: {
                    venue: 8000,
                    catering: 6000,
                    equipment: 9000,
                    misc: 2000,
                },
            },
            {
                id: "cs-planned-2",
                name: "Programming Competition",
                date: "November 15, 2023",
                budget: 20000,
                expenses: {
                    venue: 7000,
                    catering: 5000,
                    equipment: 6000,
                    misc: 2000,
                },
            },
        ],
        future: [
            {
                id: "cs-future-1",
                name: "Tech Innovation Summit",
                date: "February 2024",
                budget: 35000,
                expenses: {
                    venue: 12000,
                    catering: 8000,
                    equipment: 12000,
                    misc: 3000,
                },
            },
        ],
    },
    eng: {
        past: [
            {
                id: "eng-past-1",
                name: "Engineering Expo",
                date: "April 5, 2023",
                budget: 60000,
                expenses: {
                    venue: 20000,
                    catering: 15000,
                    equipment: 20000,
                    misc: 5000,
                },
            },
            {
                id: "eng-past-2",
                name: "Robotics Competition",
                date: "June 12, 2023",
                budget: 40000,
                expenses: {
                    venue: 15000,
                    catering: 10000,
                    equipment: 12000,
                    misc: 3000,
                },
            },
        ],
        planned: [
            {
                id: "eng-planned-1",
                name: "Sustainable Engineering Workshop",
                date: "September 25, 2023",
                budget: 35000,
                expenses: {
                    venue: 12000,
                    catering: 8000,
                    equipment: 12000,
                    misc: 3000,
                },
            },
            {
                id: "eng-planned-2",
                name: "Industry Partnership Day",
                date: "November 8, 2023",
                budget: 30000,
                expenses: {
                    venue: 10000,
                    catering: 8000,
                    equipment: 10000,
                    misc: 2000,
                },
            },
        ],
        future: [
            {
                id: "eng-future-1",
                name: "Engineering Research Symposium",
                date: "March 2024",
                budget: 40000,
                expenses: {
                    venue: 15000,
                    catering: 10000,
                    equipment: 12000,
                    misc: 3000,
                },
            },
        ],
    },
    bus: {
        past: [
            {
                id: "bus-past-1",
                name: "Business Leadership Conference",
                date: "February 20, 2023",
                budget: 50000,
                expenses: {
                    venue: 18000,
                    catering: 12000,
                    equipment: 15000,
                    misc: 5000,
                },
            },
        ],
        planned: [
            {
                id: "bus-planned-1",
                name: "Entrepreneurship Fair",
                date: "October 5, 2023",
                budget: 30000,
                expenses: {
                    venue: 10000,
                    catering: 8000,
                    equipment: 10000,
                    misc: 2000,
                },
            },
        ],
        future: [
            {
                id: "bus-future-1",
                name: "Global Business Summit",
                date: "January 2024",
                budget: 45000,
                expenses: {
                    venue: 15000,
                    catering: 12000,
                    equipment: 15000,
                    misc: 3000,
                },
            },
        ],
    },
    arts: {
        past: [
            {
                id: "arts-past-1",
                name: "Annual Arts Exhibition",
                date: "May 10, 2023",
                budget: 35000,
                expenses: {
                    venue: 12000,
                    catering: 8000,
                    equipment: 12000,
                    misc: 3000,
                },
            },
        ],
        planned: [
            {
                id: "arts-planned-1",
                name: "Theater Festival",
                date: "September 15, 2023",
                budget: 25000,
                expenses: {
                    venue: 8000,
                    catering: 6000,
                    equipment: 9000,
                    misc: 2000,
                },
            },
        ],
        future: [
            {
                id: "arts-future-1",
                name: "Cultural Heritage Symposium",
                date: "April 2024",
                budget: 30000,
                expenses: {
                    venue: 10000,
                    catering: 8000,
                    equipment: 10000,
                    misc: 2000,
                },
            },
        ],
    },
    sci: {
        past: [
            {
                id: "sci-past-1",
                name: "Science Research Symposium",
                date: "April 25, 2023",
                budget: 55000,
                expenses: {
                    venue: 18000,
                    catering: 15000,
                    equipment: 18000,
                    misc: 4000,
                },
            },
        ],
        planned: [
            {
                id: "sci-planned-1",
                name: "Environmental Science Workshop",
                date: "October 20, 2023",
                budget: 30000,
                expenses: {
                    venue: 10000,
                    catering: 8000,
                    equipment: 10000,
                    misc: 2000,
                },
            },
        ],
        future: [
            {
                id: "sci-future-1",
                name: "Scientific Innovation Conference",
                date: "February 2024",
                budget: 40000,
                expenses: {
                    venue: 15000,
                    catering: 10000,
                    equipment: 12000,
                    misc: 3000,
                },
            },
        ],
    },
};

// DOM Elements
const departmentTitle = document.getElementById('department-title');
const totalBudget = document.getElementById('total-budget');
const spentAmount = document.getElementById('spent-amount');
const spentPercentage = document.getElementById('spent-percentage');
const remainingAmount = document.getElementById('remaining-amount');
const remainingPercentage = document.getElementById('remaining-percentage');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const tabButtons = document.querySelectorAll('.tab-button');
const eventsList = document.querySelector('.events-list');

// Current state
let currentDepartmentId = '';
let currentTab = 'past';
let breakdownChart = null;

// Get department ID from URL
function getDepartmentIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || 'cs'; // Default to CS if no ID provided
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Get department ID from URL
    currentDepartmentId = getDepartmentIdFromUrl();
    
    // Initialize the department page
    loadDepartmentData();
    initializeBreakdownChart();
    renderEventsList();
    
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
            
            // Update events list
            renderEventsList();
        });
    });
});

// Load department data
function loadDepartmentData() {
    const department = departments[currentDepartmentId];
    
    if (!department) {
        window.location.href = 'dash.html'; // Redirect if department not found
        return;
    }
    
    // Update page title
    departmentTitle.textContent = `${department.name} Department`;
    document.title = `${department.name} Department - Expenses`;
    
    // Update summary cards
    totalBudget.textContent = `$${department.totalBudget.toLocaleString()}`;
    spentAmount.textContent = `$${department.spent.toLocaleString()}`;
    
    const spentPercent = ((department.spent / department.totalBudget) * 100).toFixed(1);
    spentPercentage.textContent = `${spentPercent}% of total budget`;
    
    const remaining = department.totalBudget - department.spent;
    remainingAmount.textContent = `$${remaining.toLocaleString()}`;
    
    const remainingPercent = ((remaining / department.totalBudget) * 100).toFixed(1);
    remainingPercentage.textContent = `${remainingPercent}% remaining`;
}

// Initialize breakdown chart
function initializeBreakdownChart() {
    const ctx = document.getElementById('expense-breakdown-chart').getContext('2d');
    const data = getExpenseBreakdownData();
    
    breakdownChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Venue', 'Catering', 'Equipment', 'Miscellaneous'],
            datasets: [{
                data: [data.venue, data.catering, data.equipment, data.misc],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Get expense breakdown data
function getExpenseBreakdownData() {
    const departmentEvents = events[currentDepartmentId] || { past: [], planned: [] };
    const allEvents = [...departmentEvents.past, ...departmentEvents.planned];
    
    // Calculate totals for each expense category
    const totals = {
        venue: 0,
        catering: 0,
        equipment: 0,
        misc: 0
    };
    
    allEvents.forEach(event => {
        totals.venue += event.expenses.venue;
        totals.catering += event.expenses.catering;
        totals.equipment += event.expenses.equipment;
        totals.misc += event.expenses.misc;
    });
    
    return totals;
}

// Render events list
function renderEventsList() {
    eventsList.innerHTML = '';
    
    const departmentEvents = events[currentDepartmentId] || {};
    const currentEvents = departmentEvents[currentTab] || [];
    
    if (currentEvents.length === 0) {
        eventsList.innerHTML = `
            <div class="empty-message">
                No ${currentTab} events found
            </div>
        `;
        return;
    }
    
    currentEvents.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <div class="event-header">
                <div class="event-title">${event.name}</div>
                <div class="event-budget">$${event.budget.toLocaleString()}</div>
            </div>
            <div class="event-date">
                <i class="fas fa-calendar-alt"></i>
                <span>${event.date}</span>
            </div>
            <div class="event-expenses">
                <div class="expense-item">
                    <span class="expense-label">Venue:</span>
                    <span class="expense-value">$${event.expenses.venue.toLocaleString()}</span>
                </div>
                <div class="expense-item">
                    <span class="expense-label">Catering:</span>
                    <span class="expense-value">$${event.expenses.catering.toLocaleString()}</span>
                </div>
                <div class="expense-item">
                    <span class="expense-label">Equipment:</span>
                    <span class="expense-value">$${event.expenses.equipment.toLocaleString()}</span>
                </div>
                <div class="expense-item">
                    <span class="expense-label">Misc:</span>
                    <span class="expense-value">$${event.expenses.misc.toLocaleString()}</span>
                </div>
            </div>
        `;
        
        eventsList.appendChild(eventItem);
    });
}