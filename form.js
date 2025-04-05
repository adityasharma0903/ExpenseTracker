document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements - Portals
    const portals = {
      login: document.getElementById("login-portal"),
      club: document.getElementById("club-portal"),
      event: document.getElementById("event-portal"),
      success: document.getElementById("success-portal"),
    }
  
    // DOM Elements - Forms
    const forms = {
      login: document.getElementById("login-form"),
      event: document.getElementById("event-form"),
    }
  
    // DOM Elements - Navigation
    const navigation = {
      backToClubs: document.getElementById("back-to-clubs"),
      submitAnother: document.getElementById("submit-another"),
      viewEvent: document.getElementById("view-event"),
    }
  
    // DOM Elements - Club Selection
    const clubCards = document.querySelectorAll(".club-card")
    const selectButtons = document.querySelectorAll(".select-btn")
  
    // DOM Elements - Event Form
    const progressSteps = document.querySelectorAll(".progress-step")
    const formSteps = document.querySelectorAll(".form-step")
    const nextButtons = document.querySelectorAll(".btn-next")
    const prevButtons = document.querySelectorAll(".btn-prev")
    const selectedClubName = document.getElementById("selected-club-name")
    const selectedClubIcon = document.getElementById("selected-club-icon")
    const selectedClubBadge = document.getElementById("selected-club-badge")
    const clubIdInput = document.getElementById("club-id")
  
    // DOM Elements - File Upload
    const fileDropArea = document.querySelector(".file-drop-area")
    const fileInput = document.getElementById("proposal-file")
    const fileInfo = document.getElementById("file-info")
  
    // DOM Elements - Range Slider
    const attendeesRange = document.getElementById("attendees-range")
    const attendeesInput = document.getElementById("attendees")
  
    // DOM Elements - Preview
    const eventPreview = document.getElementById("event-preview")
    const successDetails = document.getElementById("success-details")
  
    // Show Portal Function
    function showPortal(portal) {
      // Hide all portals
      Object.values(portals).forEach((p) => {
        p.classList.remove("active")
      })
  
      // Show the requested portal
      portal.classList.add("active")
  
      // Scroll to top
      window.scrollTo(0, 0)
    }
  
    // Login Form Submission
    forms.login.addEventListener("submit", (e) => {
      e.preventDefault()
  
      const username = document.getElementById("username").value
      const password = document.getElementById("password").value
  
      // Simple validation (in a real app, this would be a server request)
      if (username && password) {
        showPortal(portals.club)
  
        // Update user profile
        document.querySelector(".username").textContent = username
        document.querySelector(".avatar").textContent = username.substring(0, 2).toUpperCase()
      } else {
        alert("Please enter both username and password")
      }
    })
  
    // Club Selection
    clubCards.forEach((card) => {
      card.addEventListener("click", function () {
        selectClub(this)
      })
    })
  
    selectButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation()
        selectClub(this.closest(".club-card"))
      })
    })
  
    function selectClub(clubCard) {
      const clubId = clubCard.getAttribute("data-club-id")
      const clubName = clubCard.getAttribute("data-club-name")
      const clubIcon = clubCard.querySelector(".club-icon i").cloneNode(true)
      const clubColor = clubCard.querySelector(".club-icon").style.backgroundColor
  
      // Set the selected club info
      selectedClubName.textContent = clubName
      selectedClubIcon.innerHTML = ""
      selectedClubIcon.appendChild(clubIcon)
      selectedClubIcon.style.backgroundColor = clubColor
      selectedClubBadge.style.display = "flex"
      clubIdInput.value = clubId
  
      // Show the event submission form
      showPortal(portals.event)
  
      // Reset form to first step
      setActiveStep(0)
    }
  
    // Back to Clubs Button
    navigation.backToClubs.addEventListener("click", () => {
      showPortal(portals.club)
    })
  
    // Submit Another Event Button
    navigation.submitAnother.addEventListener("click", () => {
      // Reset the event form
      forms.event.reset()
      fileInfo.innerHTML = ""
  
      // Go back to club selection
      showPortal(portals.club)
    })
  
    // View Event Button (in a real app, this would navigate to the event details)
    navigation.viewEvent.addEventListener("click", () => {
      alert("In a real application, this would navigate to the event details page.")
    })
  
    // Multi-step Form Navigation
    function setActiveStep(stepIndex) {
      // Update progress tracker
      progressSteps.forEach((step, index) => {
        if (index <= stepIndex) {
          step.classList.add("active")
        } else {
          step.classList.remove("active")
        }
      })
  
      // Update form steps
      formSteps.forEach((step, index) => {
        if (index === stepIndex) {
          step.classList.add("active")
        } else {
          step.classList.remove("active")
        }
      })
  
      // If it's the last step, generate the preview
      if (stepIndex === formSteps.length - 1) {
        generatePreview()
      }
    }
  
    nextButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        // Validate current step
        const currentStep = formSteps[index]
        const requiredFields = currentStep.querySelectorAll("[required]")
        let isValid = true
  
        requiredFields.forEach((field) => {
          if (!field.value.trim()) {
            isValid = false
            field.classList.add("error")
          } else {
            field.classList.remove("error")
          }
        })
  
        if (isValid) {
          setActiveStep(index + 1)
        } else {
          alert("Please fill in all required fields before proceeding.")
        }
      })
    })
  
    prevButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        setActiveStep(index)
      })
    })
  
    // File Upload Handling
    fileInput.addEventListener("change", function () {
      updateFileInfo(this.files)
    })
  
    // Modify the file upload handling function to support more file types
    function getFileIcon(fileType) {
      if (fileType.includes("pdf")) {
        return "fa-file-pdf"
      } else if (fileType.includes("word") || fileType.includes("doc")) {
        return "fa-file-word"
      } else if (fileType.includes("powerpoint") || fileType.includes("presentation") || fileType.includes("ppt")) {
        return "fa-file-powerpoint"
      } else if (
        fileType.includes("image") ||
        fileType.includes("jpg") ||
        fileType.includes("jpeg") ||
        fileType.includes("png") ||
        fileType.includes("gif")
      ) {
        return "fa-file-image"
      } else {
        return "fa-file-alt"
      }
    }
  
    // Enhance the file info display to show thumbnails for images
    function updateFileInfo(files) {
      if (files.length > 0) {
        const file = files[0]
        const fileSize = (file.size / 1024).toFixed(2) // Convert to KB
  
        if (file.type.includes("image")) {
          // Create a thumbnail preview for images
          const reader = new FileReader()
          reader.onload = (e) => {
            fileInfo.innerHTML = `
                          <div class="file-preview">
                              <img src="${e.target.result}" alt="${file.name}" style="max-width: 100px; max-height: 100px; border-radius: var(--border-radius);">
                              <span>${file.name} (${fileSize} KB)</span>
                          </div>
                      `
          }
          reader.readAsDataURL(file)
        } else {
          fileInfo.innerHTML = `
                      <div class="file-preview">
                          <i class="fas ${getFileIcon(file.type)}"></i>
                          <span>${file.name} (${fileSize} KB)</span>
                      </div>
                  `
        }
  
        fileDropArea.classList.add("has-file")
      } else {
        fileInfo.innerHTML = ""
        fileDropArea.classList.remove("has-file")
      }
    }
    // Drag and Drop for File Upload
    ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      fileDropArea.addEventListener(eventName, preventDefaults, false)
    })
  
    function preventDefaults(e) {
      e.preventDefault()
      e.stopPropagation()
    }
    ;["dragenter", "dragover"].forEach((eventName) => {
      fileDropArea.addEventListener(eventName, highlight, false)
    })
    ;["dragleave", "drop"].forEach((eventName) => {
      fileDropArea.addEventListener(eventName, unhighlight, false)
    })
  
    function highlight() {
      fileDropArea.classList.add("dragover")
    }
  
    function unhighlight() {
      fileDropArea.classList.remove("dragover")
    }
  
    fileDropArea.addEventListener("drop", handleDrop, false)
  
    function handleDrop(e) {
      const dt = e.dataTransfer
      const files = dt.files
      fileInput.files = files
      updateFileInfo(files)
    }
  
    // Range Slider Sync
    attendeesRange.addEventListener("input", function () {
      attendeesInput.value = this.value
    })
  
    attendeesInput.addEventListener("input", function () {
      attendeesRange.value = this.value
    })
  
    // Preview Generation
    function generatePreview() {
      // Show loading state
      eventPreview.innerHTML = `
              <div class="preview-loading">
                  <div class="spinner"></div>
                  <p>Generating preview...</p>
              </div>
          `
  
      // Simulate loading delay
      setTimeout(() => {
        // Get form data
        const formData = {
          clubName: selectedClubName.textContent,
          department:
            document.getElementById("department").options[document.getElementById("department").selectedIndex]?.text ||
            "Not selected",
          eventName: document.getElementById("event-name").value || "Untitled Event",
          eventType: document.querySelector('input[name="event-type"]:checked')?.value || "workshop",
          eventDescription: document.getElementById("event-description").value || "No description provided",
          eventDate: document.getElementById("event-date").value
            ? new Date(document.getElementById("event-date").value).toLocaleDateString()
            : "Not set",
          eventTime: document.getElementById("event-time").value || "Not set",
          venue: document.getElementById("venue").value || "Not specified",
          attendees: document.getElementById("attendees").value || "0",
          features: Array.from(document.querySelectorAll('input[name="features"]:checked')).map((el) => el.value),
          totalBudget: document.getElementById("total-budget").value || "0",
          sponsorContribution: document.getElementById("sponsor-contribution").value || "0",
          collaboration: document.getElementById("collaboration").value || "None",
          file: fileInput.files.length > 0 ? fileInput.files[0].name : "No file uploaded",
        }
  
        // Format currency
        const formatCurrency = (value) => {
          return `$${Number.parseFloat(value).toFixed(2)}`
        }
  
        // Get event type icon
        const getEventTypeIcon = (type) => {
          switch (type) {
            case "workshop":
              return "fa-laptop"
            case "competition":
              return "fa-trophy"
            case "social":
              return "fa-users"
            case "conference":
              return "fa-microphone"
            default:
              return "fa-calendar-alt"
          }
        }
  
        // Generate preview HTML
        const previewHTML = `
                  <div class="preview-header">
                      <div class="preview-badge">
                          <i class="fas ${getEventTypeIcon(formData.eventType)}"></i>
                          <span>${formData.eventType.charAt(0).toUpperCase() + formData.eventType.slice(1)}</span>
                      </div>
                      <h3>${formData.eventName}</h3>
                      <p class="preview-meta">Organized by ${formData.clubName} • ${formData.department}</p>
                  </div>
                  
                  <div class="preview-body">
                      <div class="preview-section">
                          <h4>Event Details</h4>
                          <div class="preview-details">
                              <div class="preview-detail-item">
                                  <i class="fas fa-calendar-alt"></i>
                                  <div>
                                      <span class="detail-label">Date</span>
                                      <span class="detail-value">${formData.eventDate}</span>
                                  </div>
                              </div>
                              <div class="preview-detail-item">
                                  <i class="fas fa-clock"></i>
                                  <div>
                                      <span class="detail-label">Time</span>
                                      <span class="detail-value">${formData.eventTime}</span>
                                  </div>
                              </div>
                              <div class="preview-detail-item">
                                  <i class="fas fa-map-marker-alt"></i>
                                  <div>
                                      <span class="detail-label">Venue</span>
                                      <span class="detail-value">${formData.venue}</span>
                                  </div>
                              </div>
                              <div class="preview-detail-item">
                                  <i class="fas fa-users"></i>
                                  <div>
                                      <span class="detail-label">Expected Attendees</span>
                                      <span class="detail-value">${formData.attendees}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      <div class="preview-section">
                          <h4>Description</h4>
                          <p>${formData.eventDescription}</p>
                      </div>
                      
                      ${
                        formData.features.length > 0
                          ? `
                      <div class="preview-section">
                          <h4>Features</h4>
                          <div class="preview-features">
                              ${formData.features
                                .map(
                                  (feature) => `
                                  <div class="preview-feature">
                                      <i class="fas ${getFeatureIcon(feature)}"></i>
                                      <span>${feature.charAt(0).toUpperCase() + feature.slice(1)}</span>
                                  </div>
                              `,
                                )
                                .join("")}
                          </div>
                      </div>
                      `
                          : ""
                      }
                      
                      <div class="preview-section">
                          <h4>Budget</h4>
                          <div class="preview-budget">
                              <div class="budget-row">
                                  <span>Total Budget:</span>
                                  <span class="budget-amount">${formatCurrency(formData.totalBudget)}</span>
                              </div>
                              <div class="budget-row">
                                  <span>Sponsor Contribution:</span>
                                  <span class="budget-amount">${formatCurrency(formData.sponsorContribution)}</span>
                              </div>
                          </div>
                      </div>
                      
                      ${
                        formData.collaboration !== "None"
                          ? `
                      <div class="preview-section">
                          <h4>Collaboration</h4>
                          <p>${formData.collaboration}</p>
                      </div>
                      `
                          : ""
                      }
                      
                      <div class="preview-section">
                          <h4>Attached Document</h4>
                          <div class="preview-file">
                              <i class="fas ${getFileIcon(formData.file.split(".").pop())}"></i>
                              <span>${formData.file}</span>
                          </div>
                      </div>
                  </div>
              `
  
        // Update the preview element
        eventPreview.innerHTML = previewHTML
  
        // Add preview styles
        const style = document.createElement("style")
        style.textContent = `
                  .preview-header {
                      margin-bottom: 2rem;
                      text-align: center;
                  }
                  
                  .preview-badge {
                      display: inline-flex;
                      align-items: center;
                      gap: 0.5rem;
                      padding: 0.5rem 1rem;
                      background-color: var(--primary);
                      color: white;
                      border-radius: var(--border-radius-full);
                      margin-bottom: 1rem;
                      font-size: 0.875rem;
                  }
                  
                  .preview-meta {
                      color: var(--gray);
                      font-size: 0.875rem;
                      margin-top: 0.5rem;
                  }
                  
                  .preview-body {
                      display: flex;
                      flex-direction: column;
                      gap: 1.5rem;
                  }
                  
                  .preview-section {
                      background-color: white;
                      border-radius: var(--border-radius);
                      padding: 1.5rem;
                      box-shadow: var(--shadow-sm);
                  }
                  
                  .preview-section h4 {
                      margin-bottom: 1rem;
                      font-size: 1rem;
                      color: var(--dark);
                      font-weight: 600;
                  }
                  
                  .preview-details {
                      display: grid;
                      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                      gap: 1rem;
                  }
                  
                  .preview-detail-item {
                      display: flex;
                      align-items: flex-start;
                      gap: 0.75rem;
                  }
                  
                  .preview-detail-item i {
                      color: var(--primary);
                      margin-top: 0.25rem;
                  }
                  
                  .detail-label {
                      display: block;
                      font-size: 0.75rem;
                      color: var(--gray);
                  }
                  
                  .detail-value {
                      font-weight: 500;
                  }
                  
                  .preview-features {
                      display: flex;
                      flex-wrap: wrap;
                      gap: 0.75rem;
                  }
                  
                  .preview-feature {
                      display: flex;
                      align-items: center;
                      gap: 0.5rem;
                      padding: 0.5rem 1rem;
                      background-color: var(--lighter-gray);
                      border-radius: var(--border-radius-full);
                      font-size: 0.875rem;
                  }
                  
                  .preview-budget {
                      display: flex;
                      flex-direction: column;
                      gap: 0.75rem;
                  }
                  
                  .budget-row {
                      display: flex;
                      justify-content: space-between;
                      padding: 0.75rem;
                      background-color: var(--lighter-gray);
                      border-radius: var(--border-radius);
                  }
                  
                  .budget-amount {
                      font-weight: 600;
                      color: var(--primary);
                  }
                  
                  .preview-file {
                      display: flex;
                      align-items: center;
                      gap: 0.75rem;
                      padding: 0.75rem;
                      background-color: var(--lighter-gray);
                      border-radius: var(--border-radius);
                  }
                  
                  .preview-file i {
                      color: var(--primary);
                  }
              `
        document.head.appendChild(style)
      }, 1500)
    }
  
    function getFeatureIcon(feature) {
      switch (feature) {
        case "refreshments":
          return "fa-utensils"
        case "speakers":
          return "fa-user-tie"
        case "certificates":
          return "fa-certificate"
        case "prizes":
          return "fa-gift"
        default:
          return "fa-star"
      }
    }
  
    // Enhance the success message with animation and better styling
    forms.event.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // In a real application, you would send the form data to a server here
      // For this demo, we'll just show the success message
  
      // Copy the preview to the success details
      successDetails.innerHTML = eventPreview.innerHTML
  
      // Show the success portal with animation
      showPortal(portals.success)
  
      // Trigger the checkmark animation
      const checkmark = document.querySelector(".checkmark")
      checkmark.classList.add("draw")
  
      // Add a subtle entrance animation to the success container
      const successContainer = document.querySelector(".success-container")
      successContainer.style.animation = "fadeInUp 0.8s ease forwards"
    })
  
    // Add the fadeInUp animation to the CSS dynamically
    document.head.insertAdjacentHTML(
      "beforeend",
      `
          <style>
              @keyframes fadeInUp {
                  from {
                      opacity: 0;
                      transform: translateY(20px);
                  }
                  to {
                      opacity: 1;
                      transform: translateY(0);
                  }
              }
          }
      </style>
      `,
    )
  
    // Filter Tags
    const filterTags = document.querySelectorAll(".filter-tag")
  
    filterTags.forEach((tag) => {
      tag.addEventListener("click", function () {
        // Remove active class from all tags
        filterTags.forEach((t) => t.classList.remove("active"))
  
        // Add active class to clicked tag
        this.classList.add("active")
  
        // In a real app, this would filter the clubs
        // For this demo, we'll just show a message
        const filter = this.textContent
        console.log(`Filtering by: ${filter}`)
      })
    })
  
    // Initialize with login portal
    showPortal(portals.login)
  })
  
  