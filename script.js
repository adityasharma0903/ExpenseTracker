// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize club data if not exists
  initializeClubData();
  
  // Setup event listeners
  setupEventListeners();
  
  // Check if user is logged in
  checkLoginStatus();
  
  // Display current date
  displayCurrentDate();
});

// Display current date
function displayCurrentDate() {
  const dateElement = document.getElementById('current-date');
  if (dateElement) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-US', options);
  }
}

// Add this function to initialize the total budget in localStorage if it doesn't exist
function initializeBudgetData() {
  if (!localStorage.getItem('totalBudget')) {
    localStorage.setItem('totalBudget', '0');
  }
  
  if (!localStorage.getItem('expenses')) {
    localStorage.setItem('expenses', JSON.stringify([]));
  }
}

// Club data initialization
function initializeClubData() {
  if (!localStorage.getItem('clubs')) {
    const clubs = [
      { id: 'osc', name: 'Open Source Chandigarh', password: 'osc123' },
      { id: 'ieee', name: 'IEEE', password: 'ieee123' },
      { id: 'explore', name: 'Explore Labs', password: 'explore123' },
      { id: 'iei', name: 'IE(I) CSE Student Chapter', password: 'iei123' },
      { id: 'coe', name: 'Center of Excellence', password: 'coe123' },
      { id: 'ceed', name: 'CEED', password: 'ceed123' },
      { id: 'bnb', name: 'BIts N Bytes', password: 'bnb123' },
      { id: 'acm', name: 'ACM Chapter', password: 'acm123' },
      { id: 'gfg', name: 'GFG CUIET', password: 'gfg123' },
      { id: 'gdg', name: 'GDG CUIET', password: 'gdg123' },
      { id: 'cb', name: 'Coding Blocks', password: 'cb123' },
      { id: 'cn', name: 'Coding Ninjas', password: 'cn123' },
      { id: 'dgit', name: 'DGIT Squad', password: 'dgit123' },
      { id: 'dice', name: 'DICE', password: 'dice123' },
      { id: 'hc', name: 'Happiness Center', password: 'hc123' },
      { id: 'nss', name: 'NSS', password: 'nss123' }
    ];
    
    localStorage.setItem('clubs', JSON.stringify(clubs));
  }
  
  // Initialize events data if not exists
  if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify([]));
  }
  
  // Initialize teams data if not exists
  if (!localStorage.getItem('teams')) {
    localStorage.setItem('teams', JSON.stringify([]));
  }
  
  // Initialize expenses data if not exists
  if (!localStorage.getItem('expenses')) {
    localStorage.setItem('expenses', JSON.stringify([]));
  }
  
  // Initialize budget data
  initializeBudgetData();
}

function setupEnhancedEventListeners() {
  // Tab navigation
  const tabs = document.querySelectorAll(".modal-tabs .tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      switchTab(tabId, this.parentElement);
    });
  });

  // Next and Previous buttons
  document.getElementById("next-tab-btn").addEventListener("click", goToNextTab);
  document.getElementById("prev-tab-btn").addEventListener("click", goToPrevTab);

  // Add "What to Expect" item
  document.getElementById("add-expect-item").addEventListener("click", addExpectItem);

  // Add Eligibility item
  document.getElementById("add-eligibility-item").addEventListener("click", addEligibilityItem);

  // Add Special Award
  document.getElementById("add-special-award").addEventListener("click", addSpecialAward);

  // Add Participant Perk
  document.getElementById("add-participant-perk").addEventListener("click", addParticipantPerk);

  // Add Sponsor
  document.getElementById("add-sponsor").addEventListener("click", addSponsor);

  // Add Schedule Day
  document.getElementById("add-schedule-day").addEventListener("click", addScheduleDay);

  // Add Schedule Item for initial day
  document.querySelector(".add-schedule-item").addEventListener("click", function() {
    const dayElement = this.closest(".schedule-day");
    const dayNumber = dayElement.getAttribute("data-day");
    addScheduleItem(dayElement, dayNumber);
  });

  // Add FAQ Item
  document.getElementById("add-faq-item").addEventListener("click", addFaqItem);

  // Setup remove buttons for initial items
  setupRemoveButtons();
}

function addExpectItem() {
  const container = document.getElementById("expect-items-container");
  const newItem = document.createElement("div");
  newItem.className = "expect-item";
  newItem.innerHTML = `
    <div class="input-with-icon">
      <i class="fas fa-star"></i>
      <input type="text" class="expect-input" placeholder="Enter an expectation item">
    </div>
    <button class="remove-expect-item"><i class="fas fa-trash-alt"></i></button>
  `;
  container.appendChild(newItem);
  
  // Add event listener to remove button
  newItem.querySelector(".remove-expect-item").addEventListener("click", function() {
    newItem.remove();
  });
  
  // Animate the new item
  animateNewElement(newItem);
}

function addEligibilityItem() {
  const container = document.getElementById("eligibility-items-container");
  const newItem = document.createElement("div");
  newItem.className = "eligibility-item";
  newItem.innerHTML = `
    <div class="input-with-icon">
      <i class="fas fa-check-circle"></i>
      <input type="text" class="eligibility-input" placeholder="Enter eligibility criteria">
    </div>
    <button class="remove-eligibility-item"><i class="fas fa-trash-alt"></i></button>
  `;
  container.appendChild(newItem);
  
  // Add event listener to remove button
  newItem.querySelector(".remove-eligibility-item").addEventListener("click", function() {
    newItem.remove();
  });
  
  // Animate the new item
  animateNewElement(newItem);
}

function addSpecialAward() {
  const container = document.getElementById("special-awards-container");
  const awardCount = container.children.length + 1;
  const newAward = document.createElement("div");
  newAward.className = "special-award";
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
  `;
  container.appendChild(newAward);
  
  // Add event listener to remove button
  newAward.querySelector(".remove-special-award").addEventListener("click", function() {
    newAward.remove();
  });
  
  // Animate the new award
  animateNewElement(newAward);
}

// Add Participant Perk
function addParticipantPerk() {
  const container = document.getElementById("participant-perks-container");
  const newPerk = document.createElement("div");
  newPerk.className = "participant-perk";
  newPerk.innerHTML = `
    <div class="input-with-icon">
      <i class="fas fa-gift"></i>
      <input type="text" class="perk-input" placeholder="Enter perk (e.g., T-shirts, Certificates)">
    </div>
    <button class="remove-perk"><i class="fas fa-trash-alt"></i></button>
  `;
  container.appendChild(newPerk);
  
  // Add event listener to remove button
  newPerk.querySelector(".remove-perk").addEventListener("click", function() {
    newPerk.remove();
  });
  
  // Animate the new perk
  animateNewElement(newPerk);
}

// Add Sponsor
function addSponsor() {
  const container = document.getElementById("sponsors-container");
  const sponsorCount = container.children.length + 1;
  const newSponsor = document.createElement("div");
  newSponsor.className = "sponsor-item";
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
  `;
  container.appendChild(newSponsor);
  
  // Add event listener to remove button
  newSponsor.querySelector(".remove-sponsor").addEventListener("click", function() {
    newSponsor.remove();
  });
  
  // Animate the new sponsor
  animateNewElement(newSponsor);
}

// Add Schedule Day
function addScheduleDay() {
  const container = document.getElementById("schedule-days-container");
  const dayCount = container.children.length + 1;
  const newDay = document.createElement("div");
  newDay.className = "schedule-day";
  newDay.setAttribute("data-day", dayCount);
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
  `;
  container.appendChild(newDay);
  
  // Add event listener to add schedule item button
  newDay.querySelector(".add-schedule-item").addEventListener("click", function() {
    addScheduleItem(newDay, dayCount);
  });
  
  // Animate the new day
  animateNewElement(newDay);
}

// Add Schedule Item
function addScheduleItem(dayElement, dayNumber) {
  const container = dayElement.querySelector(".schedule-items-container");
  const newItem = document.createElement("div");
  newItem.className = "schedule-item";
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
  `;
  container.appendChild(newItem);
  
  // Add event listener to remove button
  newItem.querySelector(".remove-schedule").addEventListener("click", function() {
    newItem.remove();
  });
  
  // Animate the new item
  animateNewElement(newItem);
}

// Add FAQ Item
function addFaqItem() {
  const container = document.getElementById("faq-items-container");
  const newItem = document.createElement("div");
  newItem.className = "faq-item";
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
  `;
  container.appendChild(newItem);
  
  // Add event listener to remove button
  newItem.querySelector(".remove-faq").addEventListener("click", function() {
    newItem.remove();
  });
  
  // Animate the new item
  animateNewElement(newItem);
}

function setupRemoveButtons() {
  // Setup remove buttons for expect items
  document.querySelectorAll(".remove-expect-item").forEach(button => {
    button.addEventListener("click", function() {
      this.closest(".expect-item").remove();
    });
  });
  
  // Setup remove buttons for eligibility items
  document.querySelectorAll(".remove-eligibility-item").forEach(button => {
    button.addEventListener("click", function() {
      this.closest(".eligibility-item").remove();
    });
  });
  
  // Setup remove buttons for special awards
  document.querySelectorAll(".remove-special-award").forEach(button => {
    button.addEventListener("click", function() {
      this.closest(".special-award").remove();
    });
  });
  
  // Setup remove buttons for participant perks
  document.querySelectorAll(".remove-perk").forEach(button => {
    button.addEventListener("click", function() {
      this.closest(".participant-perk").remove();
    });
  });
  
  // Setup remove buttons for sponsors
  document.querySelectorAll(".remove-sponsor").forEach(button => {
    button.addEventListener("click", function() {
      this.closest(".sponsor-item").remove();
    });
  });
  
  // Setup remove buttons for schedule items
  document.querySelectorAll(".remove-schedule").forEach(button => {
    button.addEventListener("click", function() {
      this.closest(".schedule-item").remove();
    });
  });
  
  // Setup remove buttons for FAQs
  document.querySelectorAll(".remove-faq").forEach(button => {
    button.addEventListener("click", function() {
      this.closest(".faq-item").remove();
    });
  });
}

// Animate new element
function animateNewElement(element) {
  element.style.opacity = "0";
  element.style.transform = "translateY(20px)";
  setTimeout(() => {
    element.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";
  }, 10);
}

// Go to next tab
function goToNextTab() {
  const activeTab = document.querySelector(".modal-tabs .tab.active");
  const tabs = Array.from(document.querySelectorAll(".modal-tabs .tab"));
  const currentIndex = tabs.indexOf(activeTab);
  
  if (currentIndex < tabs.length - 1) {
    const nextTab = tabs[currentIndex + 1];
    const tabId = nextTab.getAttribute("data-tab");
    switchTab(tabId, document.querySelector(".modal-tabs"));
    
    // Show/hide prev/next/submit buttons
    document.getElementById("prev-tab-btn").classList.remove("hidden");
    
    if (currentIndex + 1 === tabs.length - 1) {
      document.getElementById("next-tab-btn").classList.add("hidden");
      document.getElementById("create-event-submit").classList.remove("hidden");
    } else {
      document.getElementById("next-tab-btn").classList.remove("hidden");
      document.getElementById("create-event-submit").classList.add("hidden");
    }
  }
}

// Go to previous tab
function goToPrevTab() {
  const activeTab = document.querySelector(".modal-tabs .tab.active");
  const tabs = Array.from(document.querySelectorAll(".modal-tabs .tab"));
  const currentIndex = tabs.indexOf(activeTab);
  
  if (currentIndex > 0) {
    const prevTab = tabs[currentIndex - 1];
    const tabId = prevTab.getAttribute("data-tab");
    switchTab(tabId, document.querySelector(".modal-tabs"));
    
    // Show/hide prev/next/submit buttons
    document.getElementById("next-tab-btn").classList.remove("hidden");
    document.getElementById("create-event-submit").classList.add("hidden");
    
    if (currentIndex - 1 === 0) {
      document.getElementById("prev-tab-btn").classList.add("hidden");
    } else {
      document.getElementById("prev-tab-btn").classList.remove("hidden");
    }
  }
}  

// Setup all event listeners
function setupEventListeners() {
  // Login form submission
  document.getElementById('login-btn').addEventListener('click', handleLogin);
  
  // Sidebar navigation
  const navItems = document.querySelectorAll('.sidebar-nav li:not(#logout-btn)');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const page = this.getAttribute('data-page');
      navigateTo(page);
    });
  });
  
  // Logout button
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
  
  // Mobile menu toggle
  document.querySelector('.hamburger-menu').addEventListener('click', toggleSidebar);
  
  // Create event button
  document.getElementById('create-event-btn').addEventListener('click', openCreateEventModal);
  
  // Close modal buttons
  const closeButtons = document.querySelectorAll('.close-modal');
  closeButtons.forEach(button => {
    button.addEventListener('click', closeAllModals);
  });
  
  // Event DL select change
  document.getElementById('event-dl').addEventListener('change', toggleDLOptions);
  
  // DL type select change
  document.getElementById('dl-type').addEventListener('change', toggleDLHours);
  
  // Event poster upload
  document.getElementById('event-poster').addEventListener('change', handlePosterUpload);
  
  // Add expense button
  document.getElementById('add-expense-btn').addEventListener('click', addExpenseField);
  
  // Modal tab navigation
  const tabs = document.querySelectorAll('.modal-tabs .tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      switchTab(tabId, this.parentElement);
    });
  });
  
  // Event tabs navigation
  const eventTabs = document.querySelectorAll('.event-tabs .tab');
  eventTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      switchTab(tabId, this.parentElement);
    });
  });
  
  // Next tab button
  document.getElementById('next-tab-btn').addEventListener('click', goToNextTab);
  
  // Previous tab button
  document.getElementById('prev-tab-btn').addEventListener('click', goToPrevTab);
  
  // Create event submit button
  document.getElementById('create-event-submit').addEventListener('click', createEvent);
  
  // Event filter change
  document.getElementById('event-filter').addEventListener('change', filterEvents);
  
  // Event sort change
  document.getElementById('event-sort').addEventListener('change', sortEvents);
  
  // Save profile button
  document.getElementById('save-profile-btn').addEventListener('click', saveProfile);
  
  // Change password button
  document.getElementById('change-password-btn').addEventListener('click', changePassword);
  
  // Approve team button
  document.getElementById('approve-team-btn').addEventListener('click', approveTeam);
  
  // Reject team button
  document.getElementById('reject-team-btn').addEventListener('click', rejectTeam);
  
  // Registration status filter change
  document.getElementById('registration-status').addEventListener('change', filterRegistrations);
  
  // View all events link
  document.getElementById('view-all-events').addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo('events');
  });
  
  // Chart refresh buttons
  document.getElementById('refresh-budget-chart').addEventListener('click', function() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
    const clubExpenses = expenses.filter(expense => expense.clubId === loggedInClub.id);
    renderBudgetChart(clubExpenses);
    showToast('Chart refreshed', 'Budget chart data has been updated', 'success');
  });
  
  document.getElementById('refresh-timeline-chart').addEventListener('click', function() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
    const clubEvents = events.filter(event => event.clubId === loggedInClub.id);
    renderTimelineChart(clubEvents);
    showToast('Chart refreshed', 'Timeline chart data has been updated', 'success');
  });
  
  document.getElementById('refresh-category-chart').addEventListener('click', function() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
    const clubExpenses = expenses.filter(expense => expense.clubId === loggedInClub.id);
    renderExpenseCategoryChart(clubExpenses);
    showToast('Chart refreshed', 'Category chart data has been updated', 'success');
  });
  
  document.getElementById('refresh-event-chart').addEventListener('click', function() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
    const clubExpenses = expenses.filter(expense => expense.clubId === loggedInClub.id);
    renderExpenseEventChart(clubExpenses, events);
    showToast('Chart refreshed', 'Event chart data has been updated', 'success');
  });
  
  // Expense filter change
  document.getElementById('expense-filter').addEventListener('change', filterExpenses);
  
  // Add expense button (main)
  document.getElementById('add-expense-btn-main').addEventListener('click', openAddExpenseModal);
  
  // Add expense submit button
  document.getElementById('add-expense-submit').addEventListener('click', addExpense);
  
  // Listen for expense amount changes to update total
  document.addEventListener('input', function(e) {
    if (e.target.classList.contains('expense-amount')) {
      updateTotalBudget();
    }
  });
  
  // Listen for file input change to update file name
  document.getElementById('event-poster').addEventListener('change', function(e) {
    const fileName = e.target.files.length > 0 ? e.target.files[0].name : 'No file chosen';
    document.querySelector('.file-name').textContent = fileName;
  });
  
  // Add event listener for update total budget button
  document.getElementById('update-total-budget-btn').addEventListener('click', function() {
    const totalBudgetInput = document.getElementById('total-budget-input');
    const totalBudgetValue = parseFloat(totalBudgetInput.value);
    
    if (isNaN(totalBudgetValue) || totalBudgetValue < 0) {
      showToast('Error', 'Please enter a valid budget amount', 'error');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('totalBudget', totalBudgetValue.toString());
    
    // Update the display
    document.getElementById('budget-total').textContent = `₹${totalBudgetValue}`;
    
    // Calculate and update remaining budget
    updateRemainingBudget();
    
    // Clear input
    totalBudgetInput.value = '';
    
    showToast('Budget Updated', `Total budget updated to ₹${totalBudgetValue}`, 'success');
  });
}

// Check if user is logged in
function checkLoginStatus() {
  const loggedInClub = localStorage.getItem('loggedInClub');
  
  if (loggedInClub) {
    // User is logged in, show dashboard
    const club = JSON.parse(loggedInClub);
    document.getElementById('club-name').textContent = club.name;
    document.getElementById('profile-club-name').textContent = club.name;
    document.getElementById('profile-club-id').textContent = `Club ID: ${club.id}`;
    document.getElementById('profile-name').value = club.name;
    document.getElementById('profile-id').value = club.id;
    
    // Set email and contact if available
    if (club.email) document.getElementById('profile-email').value = club.email;
    if (club.contact) document.getElementById('profile-contact').value = club.contact;
    if (club.description) document.getElementById('profile-description').value = club.description;
    
    showPage('dashboard-page');
    loadDashboardData();
    loadEvents();
    loadBudgetData();
  } else {
    // User is not logged in, show login page
    showPage('login-page');
  }
}

// Handle login form submission
function handleLogin() {
  const clubId = document.getElementById('club-id').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorElement = document.getElementById('login-error');
  
  if (!clubId || !password) {
    errorElement.textContent = 'Please enter both Club ID and Password';
    return;
  }
  
  const clubs = JSON.parse(localStorage.getItem('clubs'));
  const club = clubs.find(c => c.id === clubId && c.password === password);
  
  if (club) {
    // Login successful
    localStorage.setItem('loggedInClub', JSON.stringify(club));
    document.getElementById('club-name').textContent = club.name;
    document.getElementById('profile-club-name').textContent = club.name;
    document.getElementById('profile-club-id').textContent = `Club ID: ${club.id}`;
    document.getElementById('profile-name').value = club.name;
    document.getElementById('profile-id').value = club.id;
    
    showPage('dashboard-page');
    loadDashboardData();
    loadEvents();
    loadBudgetData();
    
    showToast('Login Successful', `Welcome back, ${club.name}!`, 'success');
  } else {
    // Login failed
    errorElement.textContent = 'Invalid Club ID or Password';
    
    // Shake animation for error
    const loginForm = document.querySelector('.login-form');
    loginForm.classList.add('shake');
    setTimeout(() => {
      loginForm.classList.remove('shake');
    }, 500);
  }
}

// Handle logout
function handleLogout() {
  localStorage.removeItem('loggedInClub');
  showPage('login-page');
  showToast('Logged Out', 'You have been successfully logged out', 'info');
}

// Navigate to a specific page
function navigateTo(page) {
  // Hide all content sections
  const contents = document.querySelectorAll('.content');
  contents.forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all nav items
  const navItems = document.querySelectorAll('.sidebar-nav li');
  navItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Show the selected content
  document.getElementById(`${page}-content`).classList.add('active');
  
  // Add active class to the selected nav item
  document.querySelector(`.sidebar-nav li[data-page="${page}"]`).classList.add('active');
  
  // Refresh data based on the page
  if (page === 'dashboard') {
    loadDashboardData();
  } else if (page === 'events') {
    loadEvents();
  } else if (page === 'budget') {
    loadBudgetData();
  }
  
  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    document.querySelector('.sidebar').classList.remove('active');
  }
}

// Show a specific page
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  document.getElementById(pageId).classList.add('active');
}

// Toggle sidebar on mobile
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}

// Open create event modal
function openCreateEventModal() {
  const modal = document.getElementById('create-event-modal');
  modal.style.display = 'block';
  
  // Reset form
  document.getElementById('event-name').value = '';
  document.getElementById('event-description').value = '';
  document.getElementById('event-start-date').value = '';
  document.getElementById('event-end-date').value = '';
  document.getElementById('event-start-time').value = '';
  document.getElementById('event-end-time').value = '';
  document.getElementById('event-venue').value = '';
  document.getElementById('event-dl').value = 'no';
  document.getElementById('dl-options').classList.add('hidden');
  document.getElementById('dl-hours').classList.add('hidden');
  document.getElementById('event-teams').value = '1';
  document.getElementById('poster-preview').style.backgroundImage = '';
  document.getElementById('poster-preview').innerHTML = '<i class="fas fa-image"></i><span>No image selected</span>';
  document.querySelector('.file-name').textContent = 'No file chosen';
  
  // Reset expenses
  const expensesContainer = document.getElementById('expenses-container');
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
  `;
  
  // Reset tabs
  switchTab('event-details', document.querySelector('.modal-tabs'));
  document.getElementById('next-tab-btn').classList.remove('hidden');
  document.getElementById('prev-tab-btn').classList.add('hidden');
  document.getElementById('create-event-submit').classList.add('hidden');
  
  // Add event listener to remove expense buttons
  addRemoveExpenseListeners();
  
  // Update total budget
  updateTotalBudget();
}

// Open add expense modal
function openAddExpenseModal() {
  const modal = document.getElementById('add-expense-modal');
  modal.style.display = 'block';
  
  // Reset form
  document.getElementById('expense-description').value = '';
  document.getElementById('expense-amount').value = '0';
  
  // Populate event dropdown
  const eventSelect = document.getElementById('expense-event');
  eventSelect.innerHTML = '';
  
  const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const clubEvents = events.filter(event => event.clubId === loggedInClub.id);
  
  clubEvents.forEach(event => {
    const option = document.createElement('option');
    option.value = event.id;
    option.textContent = event.name;
    eventSelect.appendChild(option);
  });
}

// Modify your existing addExpense function to include date and description
function addExpense() {
  const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
  const eventId = document.getElementById('expense-event').value;
  const category = document.getElementById('expense-category').value;
  const description = document.getElementById('expense-description').value.trim();
  const amount = parseInt(document.getElementById('expense-amount').value) || 0;
  const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  
  // Validate inputs
  if (!eventId || !description || amount <= 0) {
    showToast('Error', 'Please fill in all fields with valid values', 'error');
    return;
  }
  
  // Create expense object
  const expense = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    eventId,
    clubId: loggedInClub.id,
    category,
    description,
    amount,
    date: date
  };
  
  // Save expense to localStorage
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  
  // Update event total budget
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex !== -1) {
    events[eventIndex].totalBudget += amount;
    localStorage.setItem('events', JSON.stringify(events));
  }
  
  // Update remaining budget
  updateRemainingBudget();
  
  // Close modal and refresh data
  closeAllModals();
  loadBudgetData();
  loadDashboardData();
  
  showToast('Expense Added', `Added ₹${amount} expense for ${events[eventIndex].name}`, 'success');
}

// Add this function to update the remaining budget
function updateRemainingBudget() {
  const totalBudget = parseFloat(localStorage.getItem('totalBudget')) || 0;
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = totalBudget - totalExpenses;
  
  // Update the display
  document.getElementById('budget-remaining').textContent = `₹${remaining}`;
}

// Close all modals
function closeAllModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.style.display = 'none';
  });
}

// Toggle DL options based on selection
function toggleDLOptions() {
  const dlSelect = document.getElementById('event-dl');
  const dlOptions = document.getElementById('dl-options');
  
  if (dlSelect.value === 'yes') {
    dlOptions.classList.remove('hidden');
    toggleDLHours();
  } else {
    dlOptions.classList.add('hidden');
    document.getElementById('dl-hours').classList.add('hidden');
  }
}

// Toggle DL hours based on selection
function toggleDLHours() {
  const dlType = document.getElementById('dl-type');
  const dlHours = document.getElementById('dl-hours');
  
  if (dlType.value === 'specific-hours') {
    dlHours.classList.remove('hidden');
  } else {
    dlHours.classList.add('hidden');
  }
}

// Handle poster upload
function handlePosterUpload(e) {
  const file = e.target.files[0];
  const preview = document.getElementById('poster-preview');
  
  if (file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      preview.style.backgroundImage = `url(${e.target.result})`;
      preview.innerHTML = '';
    }
    
    reader.readAsDataURL(file);
  } else {
    preview.style.backgroundImage = '';
    preview.innerHTML = '<i class="fas fa-image"></i><span>No image selected</span>';
  }
}

// Add expense field
function addExpenseField() {
  const container = document.getElementById('expenses-container');
  const expenseItems = container.querySelectorAll('.expense-item');
  const newId = expenseItems.length + 1;
  
  const newExpense = document.createElement('div');
  newExpense.className = 'expense-item';
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
  `;
  
  container.appendChild(newExpense);
  addRemoveExpenseListeners();
  
  // Animate the new expense item
  newExpense.style.opacity = '0';
  newExpense.style.transform = 'translateY(20px)';
  setTimeout(() => {
    newExpense.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    newExpense.style.opacity = '1';
    newExpense.style.transform = 'translateY(0)';
  }, 10);
}

// Add event listeners to remove expense buttons
function addRemoveExpenseListeners() {
  const removeButtons = document.querySelectorAll('.remove-expense');
  removeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const expenseItems = document.querySelectorAll('.expense-item');
      
      if (expenseItems.length > 1) {
        const expenseItem = this.parentElement;
        
        // Animate removal
        expenseItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        expenseItem.style.opacity = '0';
        expenseItem.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          expenseItem.remove();
          updateTotalBudget();
        }, 300);
      } else {
        showToast('Error', 'You must have at least one expense item', 'warning');
      }
    });
  });
}

// Update total budget
function updateTotalBudget() {
  const amountInputs = document.querySelectorAll('.expense-amount');
  let total = 0;
  
  amountInputs.forEach(input => {
    total += parseInt(input.value) || 0;
  });
  
  document.getElementById('event-total-budget').textContent = `₹${total}`;
}

// Switch tab
function switchTab(tabId, tabContainer) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all tabs
  const tabs = tabContainer.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show the selected tab content
  document.getElementById(`${tabId}-tab`).classList.add('active');
  
  // Add active class to the selected tab
  tabContainer.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
}

// Create event
function createEvent() {
  const loggedInClub = JSON.parse(localStorage.getItem("loggedInClub"));

  // Get basic event details
  const name = document.getElementById("event-name").value.trim();
  const description = document.getElementById("event-description").value.trim();
  const startDate = document.getElementById("event-start-date").value;
  const endDate = document.getElementById("event-end-date").value;
  const startTime = document.getElementById("event-start-time").value;
  const endTime = document.getElementById("event-end-time").value;
  const venue = document.getElementById("event-venue").value.trim();
  const teamMin = parseInt(document.getElementById("event-team-min").value) || 1;
  const teamMax = parseInt(document.getElementById("event-team-max").value) || 5;
  const hasDL = document.getElementById("event-dl").value === "yes";
  const dlType = hasDL ? document.getElementById("dl-type").value : null;
  const dlStartTime = hasDL && dlType === "specific-hours" ? document.getElementById("dl-start-time").value : null;
  const dlEndTime = hasDL && dlType === "specific-hours" ? document.getElementById("dl-end-time").value : null;
  const posterInput = document.getElementById("event-poster");
  const poster =
    posterInput.files.length > 0 ? document.getElementById("poster-preview").style.backgroundImage.slice(5, -2) : null;
  const teams = Number.parseInt(document.getElementById("event-teams").value) || 1;

  // Get overview details
  const about = document.getElementById("event-about") ? document.getElementById("event-about").value.trim() : '';
  const theme = document.getElementById("event-theme") ? document.getElementById("event-theme").value.trim() : '';
  
  // Get what to expect items
  const expectItems = [];
  document.querySelectorAll(".expect-input").forEach(input => {
    if (input.value.trim()) {
      expectItems.push(input.value.trim());
    }
  });
  
  // Get eligibility criteria
  const eligibilityCriteria = [];
  document.querySelectorAll(".eligibility-input").forEach(input => {
    if (input.value.trim()) {
      eligibilityCriteria.push(input.value.trim());
    }
  });
  
  // Get duty leave details
  const dutyLeaveAvailable = document.getElementById("event-duty-leave") ? document.getElementById("event-duty-leave").checked : false;
  const dutyLeaveDays = document.getElementById("event-duty-leave-days") ? parseInt(document.getElementById("event-duty-leave-days").value) || 0 : 0;
  
  // Get prize details
  const prizePool = document.getElementById("event-prize-pool") ? parseInt(document.getElementById("event-prize-pool").value) || 0 : 0;
  
  // Get main prizes
  const firstPrize = {
    amount: document.getElementById("first-prize-amount") ? parseInt(document.getElementById("first-prize-amount").value) || 0 : 0,
    description: document.getElementById("first-prize-description") ? document.getElementById("first-prize-description").value.trim() : ''
  };
  
  const secondPrize = {
    amount: document.getElementById("second-prize-amount") ? parseInt(document.getElementById("second-prize-amount").value) || 0 : 0,
    description: document.getElementById("second-prize-description") ? document.getElementById("second-prize-description").value.trim() : ''
  };
  
  const thirdPrize = {
    amount: document.getElementById("third-prize-amount") ? parseInt(document.getElementById("third-prize-amount").value) || 0 : 0,
    description: document.getElementById("third-prize-description") ? document.getElementById("third-prize-description").value.trim() : ''
  };
  
  // Get special awards
  const specialAwards = [];
  document.querySelectorAll(".special-award").forEach(award => {
    const nameElement = award.querySelector(".award-name");
    const amountElement = award.querySelector(".award-amount");
    const descriptionElement = award.querySelector(".award-description");
    
    if (nameElement && nameElement.value.trim()) {
      specialAwards.push({ 
        name: nameElement.value.trim(), 
        amount: amountElement ? parseInt(amountElement.value) || 0 : 0, 
        description: descriptionElement ? descriptionElement.value.trim() : ''
      });
    }
  });
  
  // Get participant perks
  const participantPerks = [];
  document.querySelectorAll(".perk-input").forEach(input => {
    if (input.value.trim()) {
      participantPerks.push(input.value.trim());
    }
  });
  
  // Get sponsors
  const sponsors = [];
  document.querySelectorAll(".sponsor-item").forEach(sponsor => {
    const nameElement = sponsor.querySelector(".sponsor-name");
    const logoInput = sponsor.querySelector(".sponsor-logo");
    
    if (nameElement && nameElement.value.trim()) {
      let logo = null;
      if (logoInput && logoInput.files.length > 0) {
        // In a real implementation, you would upload the logo and get a URL
        // For now, we'll just note that a logo was selected
        logo = "logo_placeholder.png";
      }
      
      sponsors.push({ name: nameElement.value.trim(), logo });
    }
  });
  
  // Get schedule
  const schedule = [];
  document.querySelectorAll(".schedule-day").forEach(day => {
    const dayNumber = parseInt(day.getAttribute("data-day"));
    const dateElement = day.querySelector(".day-date");
    const date = dateElement ? dateElement.value : '';
    const items = [];
    
    day.querySelectorAll(".schedule-item").forEach(item => {
      const timeElement = item.querySelector(".item-time");
      const titleElement = item.querySelector(".item-title");
      const descriptionElement = item.querySelector(".item-description");
      
      if (timeElement && titleElement && timeElement.value && titleElement.value.trim()) {
        items.push({ 
          time: timeElement.value, 
          title: titleElement.value.trim(), 
          description: descriptionElement ? descriptionElement.value.trim() : ''
        });
      }
    });
    
    if (date && items.length > 0) {
      schedule.push({ dayNumber, date, items });
    }
  });
  
  // Get FAQs
  const faqs = [];
  document.querySelectorAll(".faq-item").forEach(faq => {
    const questionElement = faq.querySelector(".faq-question");
    const answerElement = faq.querySelector(".faq-answer");
    
    if (questionElement && answerElement && questionElement.value.trim() && answerElement.value.trim()) {
      faqs.push({ 
        question: questionElement.value.trim(), 
        answer: answerElement.value.trim() 
      });
    }
  });
  
  // Get expenses
  const expenses = [];
  document.querySelectorAll(".expense-item").forEach(item => {
    const categoryElement = item.querySelector(".expense-category");
    const descriptionElement = item.querySelector(".expense-description");
    const amountElement = item.querySelector(".expense-amount");
    
    if (descriptionElement && amountElement && descriptionElement.value.trim() && (parseInt(amountElement.value) || 0) > 0) {
      expenses.push({ 
        category: categoryElement ? categoryElement.value : 'other', 
        description: descriptionElement.value.trim(), 
        amount: parseInt(amountElement.value) || 0 
      });
    }
  });
  
  // Calculate total budget
  const totalBudget = expenses.reduce((total, expense) => total + expense.amount, 0);

  // Create event object with all the new fields
  const event = {
    id: Date.now().toString(),
    clubId: loggedInClub.id,
    name,
    description,
    startDate,
    endDate,
    startTime,
    endTime,
    hasDL,
    dlType,
    dlStartTime,
    dlEndTime,
    poster,
    teams,
    venue,
    teamMin,
    teamMax,
    about,
    theme,
    expectItems,
    eligibilityCriteria,
    dutyLeave: {
      available: dutyLeaveAvailable,
      days: dutyLeaveDays
    },
    prizes: {
      pool: prizePool,
      first: firstPrize,
      second: secondPrize,
      third: thirdPrize,
      special: specialAwards,
      perks: participantPerks
    },
    sponsors,
    schedule,
    faqs,
    expenses,
    totalBudget,
    createdAt: new Date().toISOString(),
  };

  // Save event to localStorage
  const events = JSON.parse(localStorage.getItem("events")) || [];
  events.push(event);
  localStorage.setItem("events", JSON.stringify(events));

  // Save expenses to localStorage
  const allExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.forEach((expense) => {
    allExpenses.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      eventId: event.id,
      clubId: loggedInClub.id,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      date: new Date().toISOString(),
    });
  });
  localStorage.setItem("expenses", JSON.stringify(allExpenses));

  // Close modal and refresh events
  closeAllModals();
  loadEvents();
  loadDashboardData();
  loadBudgetData();

  showToast("Event Created", `${name} has been created successfully`, "success");
}

document.getElementById("create-event-btn").addEventListener("click", function() {
  openCreateEventModal();
  setupEnhancedEventListeners();
});

// Load dashboard data
function loadDashboardData() {
  const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const teams = JSON.parse(localStorage.getItem('teams')) || [];
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  
  // Filter data for the logged-in club
  const clubEvents = events.filter(event => event.clubId === loggedInClub.id);
  const clubTeams = teams.filter(team => {
    const event = events.find(e => e.id === team.eventId);
    return event && event.clubId === loggedInClub.id;
  });
  const clubExpenses = expenses.filter(expense => expense.clubId === loggedInClub.id);
  
  // Calculate total budget
  const totalBudget = clubExpenses.reduce((total, expense) => total + expense.amount, 0);
  
  // Calculate upcoming events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = clubEvents.filter(event => {
    const eventStartDate = new Date(event.startDate);
    return eventStartDate >= today;
  });
  
  // Update dashboard stats with animation
  animateCounter('total-events', clubEvents.length);
  animateCounter('total-budget', totalBudget, '₹');
  animateCounter('total-registrations', clubTeams.length);
  animateCounter('upcoming-events', upcomingEvents.length);
  
  // Render budget chart
  renderBudgetChart(clubExpenses);
  
  // Render timeline chart
  renderTimelineChart(clubEvents);
  
  // Render upcoming events
  renderUpcomingEvents(upcomingEvents);
}

// Animate counter
function animateCounter(elementId, targetValue, prefix = '') {
  const element = document.getElementById(elementId);
  const startValue = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
  const duration = 1000; // 1 second
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = (targetValue - startValue) / steps;
  
  let currentValue = startValue;
  let currentStep = 0;
  
  const timer = setInterval(() => {
    currentStep++;
    currentValue += increment;
    
    if (currentStep >= steps) {
      clearInterval(timer);
      currentValue = targetValue;
    }
    
    element.textContent = `${prefix}${Math.round(currentValue)}`;
  }, stepTime);
}

// Render budget chart
function renderBudgetChart(expenses) {
  const ctx = document.getElementById('budget-chart').getContext('2d');

  // Group expenses by category
  const categories = {};
  expenses.forEach(expense => {
    if (!categories[expense.category]) {
      categories[expense.category] = 0;
    }
    categories[expense.category] += expense.amount;
  });

  // Prepare data for Chart.js
  const data = {
    labels: Object.keys(categories),
    datasets: [{
      label: 'Budget Allocation',
      data: Object.values(categories),
      backgroundColor: [
        '#4f46e5', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#6b7280'
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverOffset: 10,
    }]
  };

  // Destroy existing chart instance if it exists
  if (window.budgetChart) {
    window.budgetChart.destroy();
  }

  // Create new chart instance
  window.budgetChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#333',
            font: {
              size: 14,
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: {
            size: 16,
          },
          bodyFont: {
            size: 14,
          },
          callbacks: {
            label: function(tooltipItem) {
              const value = tooltipItem.raw;
              const total = tooltipItem.chart._metasets[0].total;
              const percentage = ((value / total) * 100).toFixed(2);
              return `${tooltipItem.label}: ₹${value} (${percentage}%)`;
            }
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      }
    }
  });
}

// Render timeline chart
function renderTimelineChart(events) {
  const canvas = document.getElementById('timeline-chart');
  const ctx = canvas.getContext('2d');

  // Set canvas dimensions
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = 300;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Filter events for the current year
  const filteredEvents = events.filter(event => {
    const eventStartYear = new Date(event.startDate).getFullYear();
    return eventStartYear === currentYear;
  });

  if (filteredEvents.length === 0) {
    // No data
    ctx.font = '16px Arial';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`No events available for ${currentYear}`, canvas.width / 2, canvas.height / 2);
    return;
  }

  // Process events for chart visualization
  const months = Array.from({ length: 12 }, (_, i) => new Date(currentYear, i, 1));
  const eventCounts = Array(12).fill(0);
  const eventNamesByMonth = Array(12).fill(null).map(() => []);

  filteredEvents.forEach(event => {
    const eventMonth = new Date(event.startDate).getMonth();
    eventCounts[eventMonth]++;
    eventNamesByMonth[eventMonth].push(event.name);
  });

  // Destroy existing chart instance if it exists
  if (window.timelineChart) {
    window.timelineChart.destroy();
  }

  // Create new chart instance with improved UI
  window.timelineChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months.map(month => month.toLocaleDateString('en-US', { month: 'short' })), // Display month names
      datasets: [
        {
          label: `Events in ${currentYear}`,
          data: eventCounts,
          backgroundColor: eventCounts.map(count => (count > 0 ? '#4f46e5' : '#e5e7eb')), // Highlight months with events
          borderColor: '#3b82f6',
          borderWidth: 1,
          hoverBackgroundColor: '#3b82f6', // Change color on hover
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
            text: 'Months',
            font: {
              size: 14,
              weight: 'bold',
            },
            color: '#374151',
          },
          grid: {
            display: false, // Cleaner UI by removing grid lines
          },
        },
        y: {
          title: {
            display: true,
            text: 'Number of Events',
            font: {
              size: 14,
              weight: 'bold',
            },
            color: '#374151',
          },
          ticks: {
            stepSize: 1,
            beginAtZero: true,
            color: '#4b5563',
          },
          grid: {
            color: '#e5e7eb', // Subtle grid lines
          },
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: '#1e293b',
          titleFont: {
            size: 14,
            weight: 'bold',
          },
          bodyFont: {
            size: 12,
          },
          bodySpacing: 6,
          padding: 10,
          callbacks: {
            title: function (context) {
              const monthIndex = context[0].dataIndex;
              return `Month: ${context[0].label}`;
            },
            label: function (context) {
              const monthIndex = context.dataIndex;
              const eventCount = eventCounts[monthIndex];
              const eventNames = eventNamesByMonth[monthIndex]
                .map(name => `• ${name}`) // Add bullet points to each event name
                .join('\n'); // Ensure each name is on a new line
              return [`${eventCount} event${eventCount === 1 ? '' : 's'}:`].concat(eventNames.split('\n'));
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
        easing: 'easeOutQuart',
      },
    },
  });
}

// Render upcoming events
function renderUpcomingEvents(events) {
  const container = document.getElementById('upcoming-events-list');
  container.innerHTML = '';
  
  if (events.length === 0) {
    container.innerHTML = '<p class="text-muted">No upcoming events</p>';
    return;
  }
  
  // Sort events by start date
  events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  
  // Take only the first 3 events
  const upcomingEvents = events.slice(0, 3);
  
  upcomingEvents.forEach((event, index) => {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.style.opacity = '0';
    eventCard.style.transform = 'translateY(20px)';
    
    eventCard.innerHTML = `
      <div class="event-image">
        <img src="${event.poster || 'https://via.placeholder.com/300x180?text=Event'}" alt="${event.name}">
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
            <button class="view-event" data-id="${event.id}">View <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(eventCard);
    
    // Animate card appearance
    setTimeout(() => {
      eventCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      eventCard.style.opacity = '1';
      eventCard.style.transform = 'translateY(0)';
    }, 100 + index * 100);
  });
  
  // Add event listeners to view buttons
  setTimeout(() => {
    const viewButtons = document.querySelectorAll('.view-event');
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const eventId = this.getAttribute('data-id');
        openViewEventModal(eventId);
      });
    });
  }, 500);
}

// Load events
function loadEvents() {
  const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
  const events = JSON.parse(localStorage.getItem('events')) || [];
  
  // Filter events for the logged-in club
  const clubEvents = events.filter(event => event.clubId === loggedInClub.id);
  
  // Render events
  renderEvents(clubEvents);
  
  // Render timeline chart with fetched events
  renderTimelineChart(clubEvents);
}

// Render events
function renderEvents(events) {
  const container = document.getElementById('events-list');
  container.innerHTML = '';
  
  if (events.length === 0) {
    container.innerHTML = '<p class="text-muted">No events found</p>';
    return;
  }
  
  // Sort events by start date (newest first)
  events.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  
  events.forEach((event, index) => {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.style.opacity = '0';
    eventCard.style.transform = 'translateY(20px)';
    
    const eventDate = new Date(event.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isUpcoming = eventDate >= today;
    
    eventCard.innerHTML = `
      <div class="event-image">
        <img src="${event.poster || 'https://via.placeholder.com/300x180?text=Event'}" alt="${event.name}">
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
            <button class="view-event" data-id="${event.id}">View <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(eventCard);
    
    // Animate card appearance
    setTimeout(() => {
      eventCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      eventCard.style.opacity = '1';
      eventCard.style.transform = 'translateY(0)';
    }, 100 + index * 100);
  });
  
  // Add event listeners to view buttons
  setTimeout(() => {
    const viewButtons = document.querySelectorAll('.view-event');
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const eventId = this.getAttribute('data-id');
        openViewEventModal(eventId);
      });
    });
  }, 500);
}

// Filter events
function filterEvents() {
  const filterValue = document.getElementById('event-filter').value;
  const sortValue = document.getElementById('event-sort').value;
  const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
  const events = JSON.parse(localStorage.getItem('events')) || [];
  
  // Filter events for the logged-in club
  let clubEvents = events.filter(event => event.clubId === loggedInClub.id);
  
  // Apply filter
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (filterValue === 'upcoming') {
    clubEvents = clubEvents.filter(event => {
      const eventStartDate = new Date(event.startDate);
      return eventStartDate >= today;
    });
  } else if (filterValue === 'past') {
    clubEvents = clubEvents.filter(event => {
      const eventStartDate = new Date(event.startDate);
      return eventStartDate < today;
    });
  }
  
  // Apply sort
  if (sortValue === 'date-desc') {
    clubEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  } else if (sortValue === 'date-asc') {
    clubEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  } else if (sortValue === 'name-asc') {
    clubEvents.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === 'name-desc') {
    clubEvents.sort((a, b) => b.name.localeCompare(a.name));
  }
  
  // Render filtered events
  renderEvents(clubEvents);
}

// Sort events
function sortEvents() {
  filterEvents();
}

// Open view event modal
function openViewEventModal(eventId) {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const teams = JSON.parse(localStorage.getItem('teams')) || [];
  
  // Find event
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    return;
  }
  
  // Find teams for this event
  const eventTeams = teams.filter(team => team.eventId === eventId);
  
  // Update modal content
  document.getElementById('view-event-title').textContent = event.name;
  document.getElementById('view-event-poster').src = event.poster || 'https://via.placeholder.com/300x250?text=Event';
  document.getElementById('view-event-description').textContent = event.description;
  document.getElementById('view-event-date').textContent = `${formatDate(new Date(event.startDate))} - ${formatDate(new Date(event.endDate))}`;
  document.getElementById('view-event-time').textContent = `${event.startTime} - ${event.endTime}`;
  document.getElementById('view-event-venue').textContent = event.venue;
  document.getElementById('view-event-teams').textContent = `${eventTeams.length} / ${event.teams} Teams`;
  document.getElementById('view-event-budget').textContent = `₹${event.totalBudget}`;
  
  // Render expenses
  const expenseTable = document.getElementById('view-expense-table');
  expenseTable.innerHTML = '';
  
  if (event.expenses.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="3">No expenses</td>';
    expenseTable.appendChild(row);
  } else {
    event.expenses.forEach(expense => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</td>
        <td>${expense.description}</td>
        <td>₹${expense.amount}</td>
      `;
      expenseTable.appendChild(row);
    });
  }
  
  // Render registrations
  renderEventRegistrations(eventTeams);
  
  // Store current event ID
  document.getElementById('view-event-modal').setAttribute('data-event-id', eventId);
  
  // Show modal
  document.getElementById('view-event-modal').style.display = 'block';
  
  // Switch to registrations tab
  switchTab('registrations', document.querySelector('#view-event-modal .event-tabs'));
}

// Render event registrations
function renderEventRegistrations(teams) {
  const container = document.getElementById('event-registrations');
  container.innerHTML = '';
  
  if (teams.length === 0) {
    container.innerHTML = '<p class="text-muted">No registrations yet</p>';
    return;
  }
  
  // Filter teams based on status
  const statusFilter = document.getElementById('registration-status').value;
  
  if (statusFilter !== 'all') {
    teams = teams.filter(team => team.status === statusFilter);
  }
  
  teams.forEach((team, index) => {
    const teamItem = document.createElement('div');
    teamItem.className = 'registration-item';
    teamItem.style.opacity = '0';
    teamItem.style.transform = 'translateY(10px)';
    
    teamItem.innerHTML = `
      <div class="team-info">
        <div class="team-name">${team.name}</div>
        <div class="team-members">${team.members.length} Members</div>
      </div>
      <div class="team-status-container">
        <span class="team-status status-${team.status}">${team.status.charAt(0).toUpperCase() + team.status.slice(1)}</span>
        <button class="view-team" data-id="${team.id}">View <i class="fas fa-arrow-right"></i></button>
      </div>
    `;
    
    container.appendChild(teamItem);
    
    // Animate item appearance
    setTimeout(() => {
      teamItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      teamItem.style.opacity = '1';
      teamItem.style.transform = 'translateY(0)';
    }, 50 * index);
  });
  
  // Add event listeners to view buttons
  setTimeout(() => {
    const viewButtons = document.querySelectorAll('.view-team');
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const teamId = this.getAttribute('data-id');
        openViewTeamModal(teamId);
      });
    });
  }, 300);
}

// Filter registrations
function filterRegistrations() {
  const eventId = document.getElementById('view-event-modal').getAttribute('data-event-id');
  const teams = JSON.parse(localStorage.getItem('teams')) || [];
  
  // Find teams for this event
  const eventTeams = teams.filter(team => team.eventId === eventId);
  
  // Render filtered registrations
  renderEventRegistrations(eventTeams);
}

// Open view team modal
function openViewTeamModal(teamId) {
  const teams = JSON.parse(localStorage.getItem('teams')) || [];
  const events = JSON.parse(localStorage.getItem('events')) || [];
  
  // Find team
  const team = teams.find(t => t.id === teamId);
  
  if (!team) {
    return;
  }
  
  // Find event
  const event = events.find(e => e.id === team.eventId);
  
  // Update modal content
  document.getElementById('view-team-title').textContent = `Team: ${team.name}`;
  document.getElementById('view-team-name').textContent = team.name;
  document.getElementById('view-team-event').textContent = event ? event.name : 'Unknown Event';
  document.getElementById('view-team-date').textContent = formatDate(new Date(team.registeredAt));
  document.getElementById('view-team-status').textContent = team.status.charAt(0).toUpperCase() + team.status.slice(1);
  document.getElementById('view-team-status').className = `status-${team.status}`;
  
  // Render team members
  const membersContainer = document.getElementById('team-members-list');
  membersContainer.innerHTML = '';
  
  team.members.forEach((member, index) => {
    const memberItem = document.createElement('div');
    memberItem.className = 'team-member';
    memberItem.style.opacity = '0';
    memberItem.style.transform = 'translateY(10px)';
    
    memberItem.innerHTML = `
      <div class="member-name"><i class="fas fa-user"></i> ${member.name}</div>
      <div class="member-details">
        <div class="member-email"><i class="fas fa-envelope"></i> ${member.email}</div>
        <div class="member-phone"><i class="fas fa-phone"></i> ${member.phone}</div>
      </div>
    `;
    
    membersContainer.appendChild(memberItem);
    
    // Animate item appearance
    setTimeout(() => {
      memberItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      memberItem.style.opacity = '1';
      memberItem.style.transform = 'translateY(0)';
    }, 50 * index);
  });
  
  // Show/hide action buttons based on status
  const approveBtn = document.getElementById('approve-team-btn');
  const rejectBtn = document.getElementById('reject-team-btn');
  
  if (team.status === 'pending') {
    approveBtn.style.display = 'flex';
    rejectBtn.style.display = 'flex';
  } else {
    approveBtn.style.display = 'none';
    rejectBtn.style.display = 'none';
  }
  
  // Store current team ID
  document.getElementById('view-team-modal').setAttribute('data-team-id', teamId);
  
  // Show modal
  document.getElementById('view-team-modal').style.display = 'block';
}

// Approve team
function approveTeam() {
  const teamId = document.getElementById('view-team-modal').getAttribute('data-team-id');
  const teams = JSON.parse(localStorage.getItem('teams')) || [];
  
  // Find team
  const teamIndex = teams.findIndex(t => t.id === teamId);
  
  if (teamIndex === -1) {
    return;
  }
  
  // Update team status
  teams[teamIndex].status = 'approved';
  
  // Save to localStorage
  localStorage.setItem('teams', JSON.stringify(teams));
  
  // Close modal and refresh teams
  closeAllModals();
  
  // Refresh event registrations if event modal is open
  const eventModal = document.getElementById('view-event-modal');
  if (eventModal.style.display === 'block') {
    const eventId = eventModal.getAttribute('data-event-id');
    const eventTeams = teams.filter(team => team.eventId === eventId);
    renderEventRegistrations(eventTeams);
  }
  
  showToast('Team Approved', `${teams[teamIndex].name} has been approved`, 'success');
}

// Reject team
function rejectTeam() {
  const teamId = document.getElementById('view-team-modal').getAttribute('data-team-id');
  const teams = JSON.parse(localStorage.getItem('teams')) || [];
  
  // Find team
  const teamIndex = teams.findIndex(t => t.id === teamId);
  
  if (teamIndex === -1) {
    return;
  }
  
  // Update team status
  teams[teamIndex].status = 'rejected';
  
  // Save to localStorage
  localStorage.setItem('teams', JSON.stringify(teams));
  
  // Close modal and refresh teams
  closeAllModals();
  
  // Refresh event registrations if event modal is open
  const eventModal = document.getElementById('view-event-modal');
  if (eventModal.style.display === 'block') {
    const eventId = eventModal.getAttribute('data-event-id');
    const eventTeams = teams.filter(team => team.eventId === eventId);
    renderEventRegistrations(eventTeams);
  }
  
  showToast('Team Rejected', `${teams[teamIndex].name} has been rejected`, 'error');
}

// Modify your existing loadBudgetData function to include the total budget from localStorage
function loadBudgetData() {
  const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const events = JSON.parse(localStorage.getItem('events')) || [];
  
  // Filter expenses for the logged-in club
  const clubExpenses = expenses.filter(expense => expense.clubId === loggedInClub.id);
  
  // Calculate total expenses
  const totalExpenses = clubExpenses.reduce((total, expense) => total + expense.amount, 0);
  
  // Get total budget from localStorage
  const totalBudget = parseFloat(localStorage.getItem('totalBudget')) || 0;
  
  // Calculate remaining budget
  const remaining = totalBudget - totalExpenses;
  
  // Update budget stats with animation
  animateCounter('budget-total', totalBudget, '₹');
  animateCounter('expenses-total', totalExpenses, '₹');
  animateCounter('budget-remaining', remaining, '₹');
  
  // Render expense charts
  renderExpenseCategoryChart(clubExpenses);
  renderExpenseEventChart(clubExpenses, events);
  
  // Render expense table
  renderExpenseTable(clubExpenses, events);
}

// Filter expenses
function filterExpenses() {
  const filterValue = document.getElementById('expense-filter').value;
  const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const events = JSON.parse(localStorage.getItem('events')) || [];
  
  // Filter expenses for the logged-in club
  let clubExpenses = expenses.filter(expense => expense.clubId === loggedInClub.id);
  
  // Apply category filter
  if (filterValue !== 'all') {
    clubExpenses = clubExpenses.filter(expense => expense.category === filterValue);
  }
  
  // Render filtered expense table
  renderExpenseTable(clubExpenses, events);
}

// Render expense category chart
function renderExpenseCategoryChart(expenses) {
  const ctx = document.getElementById('expenses-category-chart').getContext('2d');

  // Group expenses by category
  const categories = {};
  expenses.forEach(expense => {
    if (!categories[expense.category]) {
      categories[expense.category] = 0;
    }
    categories[expense.category] += expense.amount;
  });

  // Prepare data for Chart.js
  const data = {
    labels: Object.keys(categories),
    datasets: [{
      label: 'Expenses by Category',
      data: Object.values(categories),
      backgroundColor: [
        '#4f46e5', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#6b7280'
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverOffset: 10,
    }]
  };

  // Destroy existing chart instance if it exists
  if (window.expenseCategoryChart) {
    window.expenseCategoryChart.destroy();
  }

  // Create new chart instance
  window.expenseCategoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#333',
            font: {
              size: 14,
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: {
            size: 16,
          },
          bodyFont: {
            size: 14,
          },
          callbacks: {
            label: function(tooltipItem) {
              const value = tooltipItem.raw;
              const total = tooltipItem.chart._metasets[0].total;
              const percentage = ((value / total) * 100).toFixed(2);
              return `${tooltipItem.label}: ₹${value} (${percentage}%)`;
            }
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      }
    }
  });
}

// Render expense event chart
function renderExpenseEventChart(expenses, events) {
  const ctx = document.getElementById('expenses-event-chart').getContext('2d');

  // Group expenses by event
  const eventExpenses = {};
  expenses.forEach(expense => {
    if (!eventExpenses[expense.eventId]) {
      eventExpenses[expense.eventId] = 0;
    }
    eventExpenses[expense.eventId] += expense.amount;
  });

  // Get event names
  const eventNames = {};
  events.forEach(event => {
    eventNames[event.id] = event.name;
  });

  // Prepare data for Chart.js
  const data = {
    labels: Object.keys(eventExpenses).map(eventId => eventNames[eventId] || 'Unknown Event'),
    datasets: [{
      label: 'Expenses by Event',
      data: Object.values(eventExpenses),
      backgroundColor: '#4f46e5',
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverOffset: 10,
    }]
  };

  // Destroy existing chart instance if it exists
  if (window.expenseEventChart) {
    window.expenseEventChart.destroy();
  }

  // Create new chart instance
  window.expenseEventChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Events'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Amount (₹)'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: {
            size: 16,
          },
          bodyFont: {
            size: 14,
          },
          callbacks: {
            label: function(tooltipItem) {
              return `₹${tooltipItem.raw}`;
            }
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      }
    }
  });
}

// Modify your renderExpenseTable function to include date
function renderExpenseTable(expenses, events) {
  const tableBody = document.getElementById('expense-table-body');
  tableBody.innerHTML = '';
  
  if (expenses.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="5">No expenses found</td>';
    tableBody.appendChild(row);
    return;
  }
  
  // Sort expenses by date (newest first)
  expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  expenses.forEach(expense => {
    const event = events.find(e => e.id === expense.eventId);
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${event ? event.name : 'Unknown Event'}</td>
      <td>${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</td>
      <td>${expense.description}</td>
      <td>₹${expense.amount}</td>
      <td>${formatDate(new Date(expense.date))}</td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Save profile
function saveProfile() {
  const email = document.getElementById('profile-email').value.trim();
  const contact = document.getElementById('profile-contact').value.trim();
  const description = document.getElementById('profile-description').value.trim();
  
  // Validate email
  if (!isValidEmail(email)) {
    showToast('Error', 'Please enter a valid email address', 'error');
    return;
  }
  
  // Save profile data
  const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
  loggedInClub.email = email;
  loggedInClub.contact = contact;
  loggedInClub.description = description;
  
  localStorage.setItem('loggedInClub', JSON.stringify(loggedInClub));
  
  showToast('Profile Saved', 'Your profile has been updated successfully', 'success');
}

// Change password
function changePassword() {
  const currentPassword = document.getElementById('current-password').value.trim();
  const newPassword = document.getElementById('new-password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();
  
  // Validate inputs
  if (!currentPassword || !newPassword || !confirmPassword) {
    showToast('Error', 'Please fill in all password fields', 'error');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showToast('Error', 'New password and confirm password do not match', 'error');
    return;
  }
  
  // Verify current password
  const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
  const clubs = JSON.parse(localStorage.getItem('clubs'));
  const clubIndex = clubs.findIndex(c => c.id === loggedInClub.id);
  
  if (clubs[clubIndex].password !== currentPassword) {
    showToast('Error', 'Current password is incorrect', 'error');
    return;
  }
  
  // Update password
  clubs[clubIndex].password = newPassword;
  localStorage.setItem('clubs', JSON.stringify(clubs));
  
  // Clear password fields
  document.getElementById('current-password').value = '';
  document.getElementById('new-password').value = '';
  document.getElementById('confirm-password').value = '';
  
  showToast('Password Changed', 'Your password has been changed successfully', 'success');
}

// Show toast notification
function showToast(title, message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '';
  switch (type) {
    case 'success':
      icon = '<i class="fas fa-check-circle"></i>';
      break;
    case 'error':
      icon = '<i class="fas fa-exclamation-circle"></i>';
      break;
    case 'warning':
      icon = '<i class="fas fa-exclamation-triangle"></i>';
      break;
    default:
      icon = '<i class="fas fa-info-circle"></i>';
  }
  
  toast.innerHTML = `
    <div class="toast-icon ${type}">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <div class="toast-close"><i class="fas fa-times"></i></div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Add event listener to close button
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
      toast.remove();
    }, 300);
  });
  
  // Auto close after 5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 5000);
}

// Helper function to format date
function formatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Helper function to validate email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Add some sample data for demonstration
function addSampleData() {
  const loggedInClub = JSON.parse(localStorage.getItem('loggedInClub'));
  
  if (!loggedInClub) {
    return;
  }
  
  // Sample events
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const clubEvents = events.filter(event => event.clubId === loggedInClub.id);
  
  if (clubEvents.length === 0) {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);
    
    const sampleEvents = [
      {
        id: "event1",
        clubId: loggedInClub.id,
        name: "Hackathon 2023",
        description: "A 24-hour coding competition to build innovative solutions.",
        startDate: nextWeek.toISOString().split("T")[0],
        endDate: new Date(nextWeek.getTime() + 86400000).toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "09:00",
        hasDL: true,
        dlType: "full-day",
        dlStartTime: null,
        dlEndTime: null,
        poster: null,
        teams: 20,
        venue: "Main Auditorium",
        expenses: [
          { category: "venue", description: "Auditorium Booking", amount: 5000 },
          { category: "refreshments", description: "Food and Beverages", amount: 15000 },
          { category: "prizes", description: "Cash Prizes", amount: 25000 },
          { category: "marketing", description: "Posters and Banners", amount: 3000 },
        ],
        totalBudget: 48000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "event2",
        clubId: loggedInClub.id,
        name: "Workshop on AI",
        description: "Learn about the latest advancements in Artificial Intelligence.",
        startDate: nextMonth.toISOString().split("T")[0],
        endDate: nextMonth.toISOString().split("T")[0],
        startTime: "10:00",
        endTime: "16:00",
        hasDL: false,
        dlType: null,
        dlStartTime: null,
        dlEndTime: null,
        poster: null,
        teams: 50,
        venue: "Seminar Hall",
        expenses: [
          { category: "venue", description: "Seminar Hall Booking", amount: 2000 },
          { category: "refreshments", description: "Snacks and Beverages", amount: 5000 },
          { category: "equipment", description: "Projector and Sound System", amount: 3000 },
        ],
        totalBudget: 10000,
        createdAt: new Date().toISOString(),
      },
    ];
    
    events.push(...sampleEvents);
    localStorage.setItem('events', JSON.stringify(events));
    
    // Sample expenses
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    const sampleExpenses = [];
    sampleEvents.forEach(event => {
      event.expenses.forEach(expense => {
        sampleExpenses.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          eventId: event.id,
          clubId: loggedInClub.id,
          category: expense.category,
          description: expense.description,
          amount: expense.amount,
          date: new Date().toISOString(),
        });
      });
    });
    
    expenses.push(...sampleExpenses);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    // Sample teams
    const teams = JSON.parse(localStorage.getItem('teams')) || [];
    
    const sampleTeams = [
      {
        id: "team1",
        eventId: "event1",
        name: "Code Ninjas",
        members: [
          { name: "John Doe", email: "john@example.com", phone: "9876543210" },
          { name: "Jane Smith", email: "jane@example.com", phone: "9876543211" },
          { name: "Bob Johnson", email: "bob@example.com", phone: "9876543212" },
        ],
        status: "approved",
        registeredAt: new Date().toISOString(),
      },
      {
        id: "team2",
        eventId: "event1",
        name: "Tech Wizards",
        members: [
          { name: "Alice Brown", email: "alice@example.com", phone: "9876543213" },
          { name: "Charlie Davis", email: "charlie@example.com", phone: "9876543214" },
        ],
        status: "pending",
        registeredAt: new Date().toISOString(),
      },
      {
        id: "team3",
        eventId: "event2",
        name: "AI Enthusiasts",
        members: [
          { name: "Eva Green", email: "eva@example.com", phone: "9876543215" },
          { name: "Frank White", email: "frank@example.com", phone: "9876543216" },
          { name: "Grace Lee", email: "grace@example.com", phone: "9876543217" },
        ],
        status: "pending",
        registeredAt: new Date().toISOString(),
      },
    ];
    
    teams.push(...sampleTeams);
    localStorage.setItem('teams', JSON.stringify(teams));
  }
}

// Calculate total expenses
function calculateTotalExpenses() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

// Initialize the application with sample data
document.addEventListener("DOMContentLoaded", function() {
  // Add event listener for update total budget button
  const updateTotalBudgetBtn = document.getElementById("update-total-budget-btn");
  if (updateTotalBudgetBtn) {
    updateTotalBudgetBtn.addEventListener("click", function() {
      const totalBudgetInput = document.getElementById("total-budget-input");
      const totalBudgetValue = parseFloat(totalBudgetInput.value);
      
      if (isNaN(totalBudgetValue) || totalBudgetValue < 0) {
        showToast('Error', 'Please enter a valid budget amount', 'error');
        return;
      }
      
      // Save to localStorage
      localStorage.setItem('totalBudget', totalBudgetValue.toString());
      
      // Update the display
      document.getElementById('budget-total').textContent = `₹${totalBudgetValue}`;
      
      // Calculate and update remaining budget
      updateRemainingBudget();
      
      // Clear input
      totalBudgetInput.value = '';
      
      showToast('Budget Updated', `Total budget updated to ₹${totalBudgetValue}`, 'success');
    });
  }
  
  // Load initial data
  initializeBudgetData();
  loadBudgetData();
});