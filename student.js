document.addEventListener("DOMContentLoaded", () => {
  // Profile Dropdown Toggle
  const profileDropdownTrigger = document.getElementById("profileDropdownTrigger")
  const profileDropdown = document.getElementById("profileDropdown")

  function showLoader(id) {
    const loader = document.getElementById(id)
    if (loader) loader.style.display = "flex"
  }

  function hideLoader(id) {
    const loader = document.getElementById(id)
    if (loader) loader.style.display = "none"
  }

  if (profileDropdownTrigger && profileDropdown) {
    profileDropdownTrigger.addEventListener("click", (e) => {
      e.stopPropagation()
      profileDropdown.classList.toggle("active")
    })

    // Close profile dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (profileDropdown.classList.contains("active") && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove("active")
      }
    })
  }

  // Event Card Click - Show Event Detail View
  const eventCards = document.querySelectorAll(".event-card")
  const eventDetailView = document.getElementById("eventDetailView")
  const backToEvents = document.getElementById("backToEvents")

  // Event data object for fallback
  const eventData = {
    "hack-grid-2023": {
      title: "Hack The Grid – LUKSO",
      organizer: "LUKSO Foundation",
      organizerLogo: "https://source.unsplash.com/random/100x100/?blockchain",
      banner: "https://source.unsplash.com/random/1200x400/?blockchain,hackathon",
      tags: ["Blockchain", "Web3", "DeFi"],
      date: "April 15-16, 2023",
      time: "9:00 AM - 6:00 PM",
      venue: "Virtual Event",
      teamSize: "1-4 Members",
      prizePool: "₹2,00,000",
      dutyLeave: "Available (Full Day)",
      registrationCount: "1,024 Registered",
      registrationDeadline: "Closes April 10",
      description: `
                    <p>Join us for the Hack The Grid Hackathon by LUKSO! This 48-hour virtual coding marathon brings together blockchain enthusiasts, developers, and innovators to build the future of Web3.</p>
                    
                    <p>LUKSO is a blockchain platform that aims to bring blockchain to the masses through creative and cultural use cases. This hackathon focuses on building decentralized applications that leverage LUKSO's unique features.</p>
                    
                    <p>This year's theme is <strong>"Building the Future of Digital Ownership"</strong> - focusing on how blockchain technology can revolutionize the way we own and interact with digital assets.</p>
                    
                    <h3>What to Expect:</h3>
                    <ul>
                        <li>48-hour coding challenge</li>
                        <li>Mentorship from LUKSO core team</li>
                        <li>Networking opportunities with blockchain experts</li>
                        <li>Workshops on LUKSO's Universal Profiles</li>
                        <li>Substantial prizes for winning teams</li>
                    </ul>
                    
                    <h3>Eligibility Criteria:</h3>
                    <ul>
                        <li>Open to all students and professionals</li>
                        <li>Teams of 1-4 members</li>
                        <li>Basic understanding of blockchain concepts</li>
                        <li>Familiarity with JavaScript/Solidity is a plus</li>
                    </ul>
                `,
    },
    "devyug-2023": {
      title: "DevYug 2023",
      organizer: "Tech Community India",
      organizerLogo: "https://source.unsplash.com/random/100x100/?india,tech",
      banner: "https://source.unsplash.com/random/1200x400/?india,technology",
      tags: ["Open Innovation", "Hackathon", "Tech"],
      date: "May 5-7, 2023",
      time: "10:00 AM - 8:00 PM",
      venue: "Convention Center, Bangalore",
      teamSize: "2-5 Members",
      prizePool: "₹5,00,000",
      dutyLeave: "Available (3 Days)",
      registrationCount: "512 Registered",
      registrationDeadline: "Closes April 25",
      description: `
                    <p>DevYug 2023 is India's premier hackathon that brings together the brightest minds from across the country to solve real-world problems through technology.</p>
                    
                    <p>This 3-day offline event will be held in Bangalore and will feature workshops, networking sessions, and of course, an intense coding competition where teams will build innovative solutions.</p>
                    
                    <p>This year's hackathon has <strong>no specific theme restrictions</strong> - participants are encouraged to identify problems in any domain and build creative solutions.</p>
                    
                    <h3>What to Expect:</h3>
                    <ul>
                        <li>72-hour immersive hackathon experience</li>
                        <li>Mentorship from industry leaders</li>
                        <li>Networking with top tech companies</li>
                        <li>Tech talks and workshops</li>
                        <li>Impressive prizes and potential job offers</li>
                    </ul>
                    
                    <h3>Eligibility Criteria:</h3>
                    <ul>
                        <li>Open to all college students in India</li>
                        <li>Teams of 2-5 members</li>
                        <li>Members can be from different colleges</li>
                        <li>All participants must bring their own laptops</li>
                    </ul>
                `,
    },
    "rotatechx-2023": {
      title: "RotaTechX 2023",
      organizer: "Rotaract Club",
      organizerLogo: "https://source.unsplash.com/random/100x100/?rotary",
      banner: "https://source.unsplash.com/random/1200x400/?fintech,technology",
      tags: ["FinTech", "Web3", "Social Impact"],
      date: "April 22-23, 2023",
      time: "9:00 AM - 5:00 PM",
      venue: "Hybrid (Online & Delhi NCR)",
      teamSize: "2-3 Members",
      prizePool: "₹1,50,000",
      dutyLeave: "Available (2 Days)",
      registrationCount: "750 Registered",
      registrationDeadline: "Closes April 15",
      description: `
                    <p>RotaTechX is a unique hackathon organized by the Rotaract Club that focuses on using technology for social good, with a special emphasis on financial inclusion and Web3 technologies.</p>
                    
                    <p>This hybrid event allows participants to join either online or in-person at our Delhi NCR venue, making it accessible to a wider audience.</p>
                    
                    <p>This year's themes are <strong>FinTech</strong> and <strong>Web3</strong>, with a focus on creating solutions that can drive financial inclusion and leverage blockchain technology for social impact.</p>
                    
                    <h3>What to Expect:</h3>
                    <ul>
                        <li>48-hour coding challenge</li>
                        <li>Mentorship from fintech experts</li>
                        <li>Networking with social impact organizations</li>
                        <li>Workshops on financial inclusion</li>
                        <li>Prizes and implementation opportunities</li>
                    </ul>
                    
                    <h3>Eligibility Criteria:</h3>
                    <ul>
                        <li>Open to students and young professionals</li>
                        <li>Teams of 2-3 members</li>
                        <li>Basic understanding of financial concepts</li>
                        <li>Interest in social impact projects</li>
                    </ul>
                `,
    },
    "techfest-2023": {
      title: "TechFest 2023",
      organizer: "Tech Club",
      organizerLogo: "https://source.unsplash.com/random/100x100/?tech",
      banner: "https://source.unsplash.com/random/1200x400/?hackathon",
      tags: ["AI/ML", "Sustainability", "Innovation"],
      date: "May 15-16, 2023",
      time: "9:00 AM - 5:00 PM",
      venue: "Main Auditorium, University Campus",
      teamSize: "2-4 Members",
      prizePool: "₹1,05,000",
      dutyLeave: "Available (Full Day)",
      registrationCount: "128 Registered",
      registrationDeadline: "Closes May 10",
      description: `
                    <p>Join us for TechFest 2023's flagship Hackathon Challenge! This 24-hour coding marathon brings together the brightest minds to solve real-world problems through technology.</p>
                    
                    <p>Whether you're a seasoned developer or just starting your coding journey, this hackathon offers a platform to showcase your skills, collaborate with like-minded individuals, and create innovative solutions that can make a difference.</p>
                    
                    <p>This year's theme is <strong>"Sustainable Technology Solutions"</strong> - focusing on how technology can address environmental challenges and promote sustainability.</p>
                    
                    <h3>What to Expect:</h3>
                    <ul>
                        <li>24-hour coding challenge</li>
                        <li>Mentorship from industry experts</li>
                        <li>Networking opportunities with tech companies</li>
                        <li>Workshops and tech talks</li>
                        <li>Amazing prizes for winning teams</li>
                    </ul>
                    
                    <h3>Eligibility Criteria:</h3>
                    <ul>
                        <li>Open to all students of the university</li>
                        <li>Teams of 2-4 members</li>
                        <li>At least one team member must have intermediate coding experience</li>
                        <li>All participants must bring their own laptops</li>
                    </ul>
                `,
    },
    "code-for-good-2023": {
      title: "Code For Good",
      organizer: "NGO Alliance",
      organizerLogo: "https://source.unsplash.com/random/100x100/?ngo",
      banner: "https://source.unsplash.com/random/1200x400/?social,impact",
      tags: ["Social Impact", "Healthcare", "Education"],
      date: "May 5-7, 2023",
      time: "10:00 AM - 6:00 PM",
      venue: "Community Center, Mumbai",
      teamSize: "3-5 Members",
      prizePool: "₹75,000 + Implementation",
      dutyLeave: "Available (3 Days)",
      registrationCount: "200 Interested",
      registrationDeadline: "Opens April 15",
      description: `
                    <p>Code For Good is a hackathon with a purpose - to create technology solutions for non-profit organizations and social causes. This event brings together developers, designers, and problem solvers to address real challenges faced by NGOs.</p>
                    
                    <p>This 3-day event will be held in Mumbai and will feature direct interaction with NGO representatives who will present their challenges to the participants.</p>
                    
                    <p>This year's focus areas are <strong>Healthcare</strong> and <strong>Education</strong>, with specific problem statements provided by our partner NGOs.</p>
                    
                    <h3>What to Expect:</h3>
                    <ul>
                        <li>Real-world problem statements from NGOs</li>
                        <li>Mentorship from tech and social sector experts</li>
                        <li>Opportunity to implement your solution</li>
                        <li>Networking with social impact organizations</li>
                        <li>Prizes and implementation grants</li>
                    </ul>
                    
                    <h3>Eligibility Criteria:</h3>
                    <ul>
                        <li>Open to students and professionals</li>
                        <li>Teams of 3-5 members</li>
                        <li>Passion for social impact</li>
                        <li>Diverse skills (coding, design, domain knowledge)</li>
                    </ul>
                `,
    },
    "design-jam-2023": {
      title: "Design Jam 2023",
      organizer: "Design Community",
      organizerLogo: "https://source.unsplash.com/random/100x100/?design",
      banner: "https://source.unsplash.com/random/1200x400/?design,ux",
      tags: ["UI/UX", "Product Design", "Creative"],
      date: "May 12-13, 2023",
      time: "10:00 AM - 7:00 PM",
      venue: "Design Studio, Hyderabad",
      teamSize: "2-3 Members",
      prizePool: "₹50,000 + Internships",
      dutyLeave: "Available (2 Days)",
      registrationCount: "150 Interested",
      registrationDeadline: "Opens April 20",
      description: `
                    <p>Design Jam 2023 is a design-focused hackathon that challenges participants to create innovative user experiences and interfaces for real-world problems.</p>
                    
                    <p>Unlike traditional hackathons that focus primarily on coding, Design Jam emphasizes the design thinking process, user research, prototyping, and creating compelling user experiences.</p>
                    
                    <p>This year's theme is <strong>"Designing for Inclusivity"</strong> - focusing on creating digital experiences that are accessible and usable by people of all abilities and backgrounds.</p>
                    
                    <h3>What to Expect:</h3>
                    <ul>
                        <li>48-hour design challenge</li>
                        <li>Mentorship from UX/UI professionals</li>
                        <li>Workshops on design tools and methodologies</li>
                        <li>User testing sessions</li>
                        <li>Prizes and internship opportunities</li>
                    </ul>
                    
                    <h3>Eligibility Criteria:</h3>
                    <ul>
                        <li>Open to design students and professionals</li>
                        <li>Teams of 2-3 members</li>
                        <li>Basic understanding of design principles</li>
                        <li>Familiarity with design tools (Figma, Adobe XD, etc.)</li>
                    </ul>
                `,
    },
    "bio-ai-2023": {
      title: "Bio × AI Hackathon 2023",
      organizer: "BioTech Research Institute",
      organizerLogo: "https://source.unsplash.com/random/100x100/?biotech",
      banner: "https://source.unsplash.com/random/1200x400/?biotech,ai",
      tags: ["BioTech", "AI/ML", "Healthcare"],
      date: "June 10-12, 2023",
      time: "9:00 AM - 8:00 PM",
      venue: "Research Park, Pune",
      teamSize: "2-4 Members",
      prizePool: "₹3,00,000",
      dutyLeave: "Available (3 Days)",
      registrationCount: "1,000 Interested",
      registrationDeadline: "Opens May 1",
      description: `
                    <p>The Bio × AI Hackathon brings together the worlds of biotechnology and artificial intelligence to solve pressing challenges in healthcare, medicine, and biological research.</p>
                    
                    <p>This 3-day event will be held at the Research Park in Pune and will feature access to biological datasets, AI tools, and mentorship from experts in both fields.</p>
                    
                    <p>This year's focus is on <strong>applying AI to accelerate biological research</strong> and <strong>developing AI tools for healthcare diagnostics</strong>.</p>
                    
                    <h3>What to Expect:</h3>
                    <ul>
                        <li>72-hour intensive hackathon</li>
                        <li>Access to biological datasets and AI tools</li>
                        <li>Mentorship from biotech researchers and AI experts</li>
                        <li>Workshops on AI in healthcare</li>
                        <li>Substantial prizes and research opportunities</li>
                    </ul>
                    
                    <h3>Eligibility Criteria:</h3>
                    <ul>
                        <li>Open to students and professionals</li>
                        <li>Teams of 2-4 members</li>
                        <li>Background in either biology/healthcare or AI/ML</li>
                        <li>Interdisciplinary teams are encouraged</li>
                    </ul>
                `,
    },
  }

  if (eventCards.length > 0 && eventDetailView && backToEvents) {
    eventCards.forEach((card) => {
      card.addEventListener("click", function () {
        const eventId = this.getAttribute("data-event-id")
        fetchEventDetails(eventId)
      })
    })

    // Featured event card click
    const featuredEventCard = document.querySelector(".featured-event-card")
    if (featuredEventCard) {
      featuredEventCard.addEventListener("click", () => {
        const eventId = featuredEventCard.getAttribute("data-event-id") || "bio-ai-2023"
        fetchEventDetails(eventId)
      })
    }

    backToEvents.addEventListener("click", () => {
      eventDetailView.classList.remove("active")
      document.body.style.overflow = "auto"
    })
  }

  // Tab Navigation in Event Detail View
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabPanes = document.querySelectorAll(".tab-pane")

  if (tabBtns.length > 0 && tabPanes.length > 0) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons and panes
        tabBtns.forEach((b) => b.classList.remove("active"))
        tabPanes.forEach((p) => p.classList.remove("active"))

        // Add active class to clicked button
        this.classList.add("active")

        // Show corresponding tab pane
        const tabId = this.getAttribute("data-tab")
        document.getElementById(tabId).classList.add("active")
      })
    })
  }

  // Countdown Timer
  function updateCountdownForEvent(eventDateStr) {
    const date = new Date(eventDateStr)
    if (isNaN(date)) return

    const eventDate = date.getTime()

    if (window.countdownInterval) clearInterval(window.countdownInterval)

    function updateCountdown() {
      const now = new Date().getTime()
      const distance = eventDate - now

      if (distance < 0) {
        document.getElementById("days").textContent = "00"
        document.getElementById("hours").textContent = "00"
        document.getElementById("minutes").textContent = "00"
        document.getElementById("seconds").textContent = "00"
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      document.getElementById("days").textContent = days < 10 ? `0${days}` : days
      document.getElementById("hours").textContent = hours < 10 ? `0${hours}` : hours
      document.getElementById("minutes").textContent = minutes < 10 ? `0${minutes}` : minutes
      document.getElementById("seconds").textContent = seconds < 10 ? `0${seconds}` : seconds
    }

    updateCountdown()
    window.countdownInterval = setInterval(updateCountdown, 1000)
  }

  // Bookmark Button
  const bookmarkBtn = document.getElementById("bookmarkBtn")
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener("click", function (e) {
      e.stopPropagation()
      this.classList.toggle("active")

      if (this.classList.contains("active")) {
        this.innerHTML = '<i class="fas fa-bookmark"></i>'
        showToast("Event bookmarked!")
      } else {
        this.innerHTML = '<i class="far fa-bookmark"></i>'
        showToast("Bookmark removed")
      }
    })
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item")
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
      if (question) {
        question.addEventListener("click", () => {
          // Close all other FAQ items
          faqItems.forEach((i) => {
            if (i !== item) {
              i.classList.remove("active")
            }
          })

          // Toggle current FAQ item
          item.classList.toggle("active")
        })
      }
    })
  }

  // Copy Link Button
  const copyLinkBtn = document.getElementById("copyLinkBtn")
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      const url = window.location.href

      // Create a temporary input element
      const tempInput = document.createElement("input")
      tempInput.value = url
      document.body.appendChild(tempInput)

      // Select and copy the URL
      tempInput.select()
      document.execCommand("copy")

      // Remove the temporary input
      document.body.removeChild(tempInput)

      // Show success message
      showToast("Link copied to clipboard!")
    })
  }

  // Registration Modal
  const registerBtn = document.getElementById("registerBtn")
  const registrationModal = document.getElementById("registrationModal")
  const closeRegModal = document.getElementById("closeRegModal")
  const cancelRegistration = document.getElementById("cancelRegistration")

  if (registerBtn && registrationModal && closeRegModal && cancelRegistration) {
    registerBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      registrationModal.classList.add("active")
    })

    // Declare closeRegistrationModal here
    function closeRegistrationModal() {
      registrationModal.classList.remove("active")
    }

    closeRegModal.addEventListener("click", closeRegistrationModal)
    cancelRegistration.addEventListener("click", closeRegistrationModal)

    // Close modal when clicking outside
    registrationModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeRegistrationModal()
      }
    })
  }

  // Add Team Member Button
  const addMemberBtn = document.getElementById("addMemberBtn")
  const additionalMembers = document.getElementById("additionalMembers")
  let memberCount = 2

  if (addMemberBtn && additionalMembers) {
    addMemberBtn.addEventListener("click", () => {
      memberCount++

      if (memberCount > 4) {
        showToast("Maximum team size is 4 members")
        return
      }

      const memberInputs = document.createElement("div")
      memberInputs.className = "team-member-inputs"
      memberInputs.innerHTML = `
                <div class="form-group">
                    <label for="memberName${memberCount}">Member ${memberCount}*</label>
                    <input type="text" id="memberName${memberCount}" placeholder="Full Name" required>
                </div>
                <div class="form-group">
                    <label for="memberEmail${memberCount}">Email*</label>
                    <input type="email" id="memberEmail${memberCount}" placeholder="Email Address" required>
                </div>
                <div class="form-group">
                    <label for="memberPhone${memberCount}">Phone*</label>
                    <input type="tel" id="memberPhone${memberCount}" placeholder="Phone Number" required>
                </div>
                <div class="form-group">
                    <label for="memberDepartment${memberCount}">Department*</label>
                    <input type="text" id="memberDepartment${memberCount}" placeholder="Department" required>
                </div>
                <button type="button" class="btn-remove-member">
                    <i class="fas fa-times"></i> Remove
                </button>
            `

      additionalMembers.appendChild(memberInputs)

      // Add event listener to remove button
      const removeBtn = memberInputs.querySelector(".btn-remove-member")
      removeBtn.addEventListener("click", () => {
        additionalMembers.removeChild(memberInputs)
        memberCount--
      })
    })
  }

  // Registration Form Submission
  const registrationForm = document.getElementById("registrationForm")
  const successModal = document.getElementById("successModal")
  const closeSuccessModalBtn = document.getElementById("closeSuccessModal")

  if (registrationForm && successModal && closeSuccessModalBtn) {
    registrationForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Get form values
      const teamName = document.getElementById("teamName").value
      const projectIdea = document.getElementById("projectIdea").value
      const techStack = document.getElementById("techStack").value

      // Get current event ID from the modal
      const eventId = getCurrentEventId()

      if (!eventId) {
        showToast("Error", "Event ID not found")
        return
      }

      // Collect team members data
      const members = []

      // Add team leader (first member)
      members.push({
        name: document.getElementById("memberName1").value,
        email: document.getElementById("memberEmail1").value,
        phone: document.getElementById("memberPhone1").value,
        department: document.getElementById("memberDepartment1").value,
        isLeader: true,
      })

      // Add second member
      members.push({
        name: document.getElementById("memberName2").value,
        email: document.getElementById("memberEmail2").value,
        phone: document.getElementById("memberPhone2").value,
        department: document.getElementById("memberDepartment2").value,
        isLeader: false,
      })

      // Add additional members if any
      for (let i = 3; i <= memberCount; i++) {
        const nameInput = document.getElementById(`memberName${i}`)
        if (nameInput) {
          members.push({
            name: nameInput.value,
            email: document.getElementById(`memberEmail${i}`).value,
            phone: document.getElementById(`memberPhone${i}`).value,
            department: document.getElementById(`memberDepartment${i}`).value,
            isLeader: false,
          })
        }
      }

      // Create registration data object
      const registrationData = {
        eventId,
        teamName,
        members,
        projectIdea,
        techStack,
        status: "pending",
      }

      try {
        // Send registration data to server
        const response = await fetch("https://expensetracker-qppb.onrender.com/api/team-registrations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        })

        const data = await response.json()

        if (data.success) {
          // Set confirmation details
          document.getElementById("confirmTeamName").textContent = teamName
          document.getElementById("confirmRegId").textContent =
            data.teamRegistration._id ||
            `REG-${Math.floor(Math.random() * 1000)
              .toString()
              .padStart(4, "0")}`

          // Close registration modal and show success modal
          closeRegistrationModal()
          successModal.classList.add("active")
        } else {
          showToast("Error", data.message || "Registration failed")
        }
      } catch (error) {
        console.error("Error registering team:", error)
        showToast("Error", "Failed to connect to server")
      }
    })

    function closeSuccessModal() {
      successModal.classList.remove("active")
    }

    closeSuccessModalBtn.addEventListener("click", closeSuccessModal)

    // Close modal when clicking outside
    successModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeSuccessModal()
      }
    })
  }

  // Helper function to get current event ID
  function getCurrentEventId() {
    // Try to get from the modal data attribute
    const modal = document.getElementById("registrationModal")
    if (modal && modal.getAttribute("data-event-id")) {
      return modal.getAttribute("data-event-id")
    }

    // Try to get from the event detail view
    const eventDetailView = document.getElementById("eventDetailView")
    if (eventDetailView && eventDetailView.getAttribute("data-event-id")) {
      return eventDetailView.getAttribute("data-event-id")
    }

    return null
  }

  // Download Confirmation Button
  const downloadConfirmation = document.getElementById("downloadConfirmation")
  if (downloadConfirmation) {
    downloadConfirmation.addEventListener("click", () => {
      // Get confirmation details
      const teamName = document.getElementById("confirmTeamName").textContent
      const regId = document.getElementById("confirmRegId").textContent
      const eventDate = document.getElementById("confirmEventDate").textContent
      const eventTitle = document.getElementById("successEventTitle").textContent

      // Create confirmation text
      const confirmationText = `
Registration Confirmation
------------------------
Event: ${eventTitle}
Team Name: ${teamName}
Registration ID: ${regId}
Event Date: ${eventDate}
Status: Pending Approval

Thank you for registering for this event. Your registration is pending approval from the event organizers.
You will receive an email notification once your registration is approved.
      `

      // Create a blob and download
      const blob = new Blob([confirmationText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${teamName}_Registration_Confirmation.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showToast("Registration confirmation downloaded")
    })
  }

  // Feedback Modal
  const feedbackBtn = document.getElementById("feedbackBtn")
  const feedbackModal = document.getElementById("feedbackModal")
  const closeFeedbackModalBtn = document.getElementById("closeFeedbackModal")
  const cancelFeedback = document.getElementById("cancelFeedback")

  if (feedbackBtn && feedbackModal && closeFeedbackModalBtn && cancelFeedback) {
    feedbackBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      feedbackModal.classList.add("active")
    })

    // Declare closeFeedbackModal here
    function closeFeedbackModal() {
      feedbackModal.classList.remove("active")
    }

    closeFeedbackModalBtn.addEventListener("click", closeFeedbackModal)
    cancelFeedback.addEventListener("click", closeFeedbackModal)

    // Close modal when clicking outside
    feedbackModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeFeedbackModal()
      }
    })
  }

  // Rating Stars
  const ratingStars = document.querySelectorAll(".rating-stars i")
  if (ratingStars.length > 0) {
    ratingStars.forEach((star, index) => {
      star.addEventListener("click", () => {
        // Reset all stars
        ratingStars.forEach((s) => (s.className = "far fa-star"))

        // Fill stars up to the clicked one
        for (let i = 0; i <= index; i++) {
          ratingStars[i].className = "fas fa-star active"
        }
      })
    })
  }

  // Feedback Form Submission
  const feedbackForm = document.getElementById("feedbackForm")
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Close feedback modal
      closeFeedbackModal()

      // Show success message
      showToast("Thank you for your feedback!")
    })
  }

  // Search functionality
  const searchInput = document.getElementById("searchInput")
  if (searchInput && eventCards.length > 0) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()

      eventCards.forEach((card) => {
        const title = card.querySelector("h3").textContent.toLowerCase()
        const type = card.querySelector(".event-type").textContent.toLowerCase()
        const tags = Array.from(card.querySelectorAll(".theme-tag")).map((tag) => tag.textContent.toLowerCase())

        if (title.includes(searchTerm) || type.includes(searchTerm) || tags.some((tag) => tag.includes(searchTerm))) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    })
  }

  // Keyboard shortcut for search
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      if (searchInput) searchInput.focus()
    }
  })

  // Toast Notification
  function showToast(message, title = "") {
    // Create toast element if it doesn't exist
    let toast = document.querySelector(".toast")

    if (!toast) {
      toast = document.createElement("div")
      toast.className = "toast"
      document.body.appendChild(toast)
    }

    // Set message and show toast
    if (title) {
      toast.innerHTML = `<strong>${title}</strong>: ${message}`
    } else {
      toast.textContent = message
    }
    toast.classList.add("active")

    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("active")
    }, 3000)
  }

  // Initialize the page
  function initPage() {
    // Fetch all events
    fetchAllEvents()

    // Show a welcome toast
    setTimeout(() => {
      showToast("Welcome to TechEvents! Explore the latest hackathons and events.")
    }, 1000)
  }

  // Fetch all events from the server
  async function fetchAllEvents() {
    showLoader("eventsLoader"); // 👈 Show loader at start

    try {
      const response = await fetch("https://expensetracker-qppb.onrender.com/api/club-events")
      const data = await response.json()

      if (data.success && Array.isArray(data.events) && data.events.length > 0) {
        renderEvents(data.events)
      } else {
        renderMockEvents()
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      renderMockEvents()
    } finally {
      hideLoader("eventsLoader") // 👈 Hide loader at end
    }
  }


  // Render mock events when no real events are available
  function renderMockEvents() {
    const container = document.querySelector("#dynamic-events")
    if (!container) return

    container.innerHTML = ""

    // Mock event data
    const mockEvents = [
      {
        _id: "mock1",
        name: "Hack The Grid – LUKSO",
        club: "Blockchain Club",
        department: "Computer Science",
        venue: "Virtual Event",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
        description: "A 48-hour hackathon focused on blockchain innovation.",
        prizes: [
          { title: "First Prize", amount: 200000, description: "₹2,00,000 cash prize for the winning team." },
          { title: "Second Prize", amount: 100000, description: "₹1,00,000 cash prize for the runner-up." },
        ],
        schedule: [
          {
            date: "April 20, 2025",
            activities: [
              { time: "9:00 AM", title: "Kickoff", description: "Welcome and problem statement reveal." },
              { time: "11:00 AM", title: "Workshop: Blockchain Basics", description: "Hosted by LUKSO experts." },
            ],
          },
          {
            date: "April 21, 2025",
            activities: [
              { time: "3:00 PM", title: "Submission Deadline", description: "All projects must be submitted." },
              { time: "5:00 PM", title: "Closing Ceremony", description: "Winners announced and prizes distributed." },
            ],
          },
        ],
      },
      // Add more mock events as needed
    ]

    mockEvents.forEach((event) => {
      const card = document.createElement("div")
      card.className = "event-card"
      card.setAttribute("data-event-id", event._id)

      card.innerHTML = `
        <div class="event-card-header">
          <h3>${event.name}</h3>
          <p class="event-type">${event.club}</p>
        </div>
        <div class="event-card-actions">
          <a href="#" class="btn-link">
            <i class="fas fa-link"></i>
          </a>
          <a href="#" class="btn-social">
            <i class="fab fa-twitter"></i>
          </a>
        </div>
        <div class="event-card-content">
          <div class="event-themes">
            <span class="theme-label">THEME</span>
            <div class="theme-tags">
              <span class="theme-tag">${event.department}</span>
              <span class="theme-tag">${event.club}</span>
            </div>
          </div>
          <div class="event-status-tags">
            <span class="status-tag">${event.venue}</span>
            <span class="status-tag">STARTS ${formatDate(event.startDate)}</span>
          </div>
        </div>
      `

      card.addEventListener("click", () => displayEventDetails(event))
      container.appendChild(card)
    })
  }

  // Render events from the server
  function renderEvents(events) {
    const container = document.querySelector("#dynamic-events")
    if (!container) return

    container.innerHTML = ""

    if (!events || events.length === 0) {
      container.innerHTML = '<p class="text-muted">No events found. Check back later!</p>'
      return
    }

    events.forEach((event) => {
      const card = document.createElement("div")
      card.className = "event-card"
      const eventId = event._id || event.id || "event-" + Math.random().toString(36).substr(2, 9)
      card.setAttribute("data-event-id", eventId)

      card.innerHTML = `
          <div class="event-card-header">
            <h3>${event.name}</h3>
            <p class="event-type">${event.club || "Hackathon"}</p>
          </div>
          <div class="event-card-actions">
            <a href="#" class="btn-link">
              <i class="fas fa-link"></i>
            </a>
            <a href="#" class="btn-social">
              <i class="fab fa-twitter"></i>
            </a>
          </div>
          <div class="event-card-content">
            <div class="event-themes">
              <span class="theme-label">THEME</span>
              <div class="theme-tags">
                <span class="theme-tag">${event.department || "TECHNOLOGY"}</span>
                <span class="theme-tag">${event.club || "INNOVATION"}</span>
              </div>
            </div>
            <div class="event-participants">
              <div class="participant-avatars">
                <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="Participant" onerror="this.src='https://via.placeholder.com/150x150?text=Avatar';">
                <img src="https://randomuser.me/api/portraits/women/42.jpg" alt="Participant" onerror="this.src='https://via.placeholder.com/150x150?text=Avatar';">
                <img src="https://randomuser.me/api/portraits/men/43.jpg" alt="Participant" onerror="this.src='https://via.placeholder.com/150x150?text=Avatar';">
              </div>
              <span class="participant-count">+${Math.floor(Math.random() * 100) + 50} interested</span>
            </div>
            <div class="event-status-tags">
              <span class="status-tag">${event.venue}</span>
              <span class="status-tag">${isUpcoming(event.startDate) ? "UPCOMING" : "ONGOING"}</span>
              <span class="status-tag">STARTS ${formatDate(event.startDate)}</span>
            </div>
            <a href="#" class="btn-notify">Register Now</a>
          </div>
        `

      container.appendChild(card)

      // Add event listener to show event details when clicked
      card.addEventListener("click", () => {
        fetchEventDetails(eventId)
      })
    })
  }

  // Fetch event details by ID
  async function fetchEventDetails(eventId) {
    showLoader("detailLoader")
  
    try {
      const response = await fetch(`https://expensetracker-qppb.onrender.com/api/club-events/${eventId}`)
      const data = await response.json()
  
      if (data.success && data.event) {
        displayEventDetails(data.event)
      } else {
        const mockEvent = eventData[eventId]
        if (mockEvent) {
          displayEventDetails(mockEvent)
        }
      }
    } catch (error) {
      console.error("Error fetching event details:", error)
      const mockEvent = eventData[eventId]
      if (mockEvent) {
        displayEventDetails(mockEvent)
      }
    } finally {
      hideLoader("detailLoader")
    }
  }
  


  // Display event details
  function displayEventDetails(event) {
    const eventDetailView = document.getElementById("eventDetailView")
    if (!eventDetailView) return

    // Debug log to see the full event data
    console.log("Full event data:", event)

    // Set default values for missing fields
    const defaultBanner = "https://source.unsplash.com/random/1200x400/?hackathon"
    const defaultLogo = "https://source.unsplash.com/random/100x100/?tech"

    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)
    const formattedDate = formatDateRange(startDate, endDate)

    // Store the event ID in the event detail view for later use
    eventDetailView.setAttribute("data-event-id", event._id || event.id)

    // Update event details in the DOM
    document.getElementById("eventBanner").src = event.poster || defaultBanner
    document.getElementById("organizerLogo").src = event.organizerLogo || defaultLogo
    document.getElementById("organizerName").textContent = event.organizer || event.club || "Event Organizer"

    // Update event tags
    const eventTagsContainer = document.getElementById("eventTags")
    eventTagsContainer.innerHTML = ""

    const tags = [event.department, event.theme, "Technology", "Innovation"]
    tags.forEach((tag) => {
      if (tag) {
        const tagElement = document.createElement("span")
        tagElement.className = "tag"
        tagElement.textContent = tag
        eventTagsContainer.appendChild(tagElement)
      }
    })

    document.getElementById("eventTitle").textContent = event.name || event.title

    // Format description for the HTML structure
    let description = event.description || event.about || "<p>No description available.</p>"
    if (event.eligibilityCriteria && event.eligibilityCriteria.length > 0) {
      description += "<h3>Eligibility Criteria:</h3><ul>"
      event.eligibilityCriteria.forEach((criteria) => {
        description += `<li>${criteria}</li>`
      })
      description += "</ul>"
    }
    document.getElementById("eventDescription").innerHTML = description

    document.getElementById("eventDate").textContent = formattedDate
    document.getElementById("eventTime").textContent = `${event.startTime || "N/A"} - ${event.endTime || "N/A"}`
    document.getElementById("eventVenue").textContent = event.venue || "N/A"

    // Team size - display teamMax from MongoDB
    document.getElementById("teamSize").textContent =
      event.teamMin && event.teamMax ? `${event.teamMin}-${event.teamMax} Members` : "N/A"

    // Prize pool - display actual prize data from MongoDB
    document.getElementById("prizePool").textContent = event.prizes?.pool
      ? `₹${Number(event.prizes.pool).toLocaleString()}`
      : "N/A"

    // Duty leave
    const dutyLeave = event.dutyLeave?.available ? `Available (${event.dutyLeave.days} Days)` : "Not Available"
    document.getElementById("dutyLeave").textContent = dutyLeave

    // Registration count
    document.getElementById("registrationCount").innerHTML =
      `<i class="fas fa-user-check"></i> ${event.registrationCount || "N/A"}`

    // Registration deadline
    document.getElementById("registrationDeadline").innerHTML =
      `<i class="fas fa-hourglass-half"></i> ${event.registrationDeadline || "Opens Soon"}`

    // Update modal event titles
    document.getElementById("modalEventTitle").textContent = event.name || event.title
    document.getElementById("successEventTitle").textContent = event.name || event.title
    document.getElementById("confirmEventDate").textContent = formattedDate

    // Update prizes tab with actual prize data
    updatePrizesTab(event.prizes)

    // Update schedule tab with actual schedule data
    updateScheduleTab(event.schedule)

    // Update FAQs tab with actual FAQ data
    updateFAQsTab(event.faqs)

    // Show event detail view
    eventDetailView.classList.add("active")
    document.body.style.overflow = "hidden"

    updateCountdownForEvent(event.startDate)
    eventDetailView.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  // Update prizes tab with event prize data
  function updatePrizesTab(prizes) {
    // Directly match the HTML structure for prizes
    if (!prizes || Object.keys(prizes).length === 0) {
      return
    }

    // Update first prize
    if (prizes.first && prizes.first.amount) {
      const firstPrizeElement = document.querySelector(".first-prize .prize-details")
      if (firstPrizeElement) {
        // Add prize amount and description if not already present
        if (!firstPrizeElement.querySelector(".prize-amount")) {
          const amountElement = document.createElement("p")
          amountElement.className = "prize-amount"
          firstPrizeElement.appendChild(amountElement)
        }

        if (!firstPrizeElement.querySelector(".prize-description")) {
          const descElement = document.createElement("p")
          descElement.className = "prize-description"
          firstPrizeElement.appendChild(descElement)
        }

        firstPrizeElement.querySelector(".prize-amount").textContent =
          `₹${Number(prizes.first.amount).toLocaleString()}`
        firstPrizeElement.querySelector(".prize-description").textContent = prizes.first.description || ""
      }
    }

    // Update second prize
    if (prizes.second && prizes.second.amount) {
      const secondPrizeElement = document.querySelector(".second-prize .prize-details")
      if (secondPrizeElement) {
        // Add prize amount and description if not already present
        if (!secondPrizeElement.querySelector(".prize-amount")) {
          const amountElement = document.createElement("p")
          amountElement.className = "prize-amount"
          secondPrizeElement.appendChild(amountElement)
        }

        if (!secondPrizeElement.querySelector(".prize-description")) {
          const descElement = document.createElement("p")
          descElement.className = "prize-description"
          secondPrizeElement.appendChild(descElement)
        }

        secondPrizeElement.querySelector(".prize-amount").textContent =
          `₹${Number(prizes.second.amount).toLocaleString()}`
        secondPrizeElement.querySelector(".prize-description").textContent = prizes.second.description || ""
      }
    }

    // Update third prize
    if (prizes.third && prizes.third.amount) {
      const thirdPrizeElement = document.querySelector(".third-prize .prize-details")
      if (thirdPrizeElement) {
        // Add prize amount and description if not already present
        if (!thirdPrizeElement.querySelector(".prize-amount")) {
          const amountElement = document.createElement("p")
          amountElement.className = "prize-amount"
          thirdPrizeElement.appendChild(amountElement)
        }

        if (!thirdPrizeElement.querySelector(".prize-description")) {
          const descElement = document.createElement("p")
          descElement.className = "prize-description"
          thirdPrizeElement.appendChild(descElement)
        }

        thirdPrizeElement.querySelector(".prize-amount").textContent =
          `₹${Number(prizes.third.amount).toLocaleString()}`
        thirdPrizeElement.querySelector(".prize-description").textContent = prizes.third.description || ""
      }
    }

    // Update special prize (Innovation Award)
    if (prizes.special && prizes.special.length > 0) {
      const specialPrize = prizes.special[0] // Use the first special prize
      const specialPrizeElement = document.querySelector(".special-prize .prize-details")
      if (specialPrizeElement) {
        // Add prize amount and description if not already present
        if (!specialPrizeElement.querySelector(".prize-amount")) {
          const amountElement = document.createElement("p")
          amountElement.className = "prize-amount"
          specialPrizeElement.appendChild(amountElement)
        }

        if (!specialPrizeElement.querySelector(".prize-description")) {
          const descElement = document.createElement("p")
          descElement.className = "prize-description"
          specialPrizeElement.appendChild(descElement)
        }

        // Update the h3 title if a name is provided
        if (specialPrize.name) {
          specialPrizeElement.querySelector("h3").textContent = specialPrize.name
        }

        specialPrizeElement.querySelector(".prize-amount").textContent = specialPrize.amount
          ? `₹${Number(specialPrize.amount).toLocaleString()}`
          : ""

        specialPrizeElement.querySelector(".prize-description").textContent = specialPrize.description || ""
      }
    }
  }

  // Update schedule tab with event schedule data
  function updateScheduleTab(schedule) {
    if (!schedule || schedule.length === 0) {
      return
    }

    // We need to match the HTML structure which has separate sections for each day
    // Sort schedule by day number
    const sortedSchedule = [...schedule].sort((a, b) => a.dayNumber - b.dayNumber)

    // Find the schedule container
    const scheduleContainer = document.getElementById("schedule")
    if (!scheduleContainer) return

    // Get existing schedule dates
    const scheduleDates = scheduleContainer.querySelectorAll(".schedule-date")

    // Loop through sorted schedule
    sortedSchedule.forEach((day, index) => {
      // Try to find an existing day section
      let daySection
      if (index < scheduleDates.length) {
        daySection = scheduleDates[index]
        daySection.querySelector("h3").textContent = `Day ${day.dayNumber}: ${day.date}`
      } else {
        // Create a new day section if needed
        const dayContainer = document.createElement("div")
        dayContainer.className = "schedule-date"
        dayContainer.innerHTML = `<h3>Day ${day.dayNumber}: ${day.date}</h3>`

        // Find the card-body to append to
        const cardBody = scheduleContainer.querySelector(".card-body")
        if (cardBody) {
          // If there's already a timeline after the last date, insert before it
          const lastDate = scheduleDates[scheduleDates.length - 1]
          if (lastDate) {
            const nextTimeline = lastDate.nextElementSibling
            if (nextTimeline && nextTimeline.classList.contains("timeline")) {
              cardBody.insertBefore(dayContainer, nextTimeline.nextElementSibling)
            } else {
              cardBody.appendChild(dayContainer)
            }
          } else {
            cardBody.appendChild(dayContainer)
          }
        }

        daySection = dayContainer
      }

      // Get the timeline container that follows this day section
      let timeline = daySection.nextElementSibling
      if (!timeline || !timeline.classList.contains("timeline")) {
        // Create a new timeline if needed
        timeline = document.createElement("div")
        timeline.className = "timeline"
        daySection.parentNode.insertBefore(timeline, daySection.nextElementSibling)
      }

      // Clear existing timeline content
      timeline.innerHTML = ""

      // Add schedule items
      if (day.items && day.items.length > 0) {
        day.items.forEach((item) => {
          const timelineItem = document.createElement("div")
          timelineItem.className = "timeline-item"
          timelineItem.innerHTML = `
              <div class="timeline-time">${item.time}</div>
              <div class="timeline-content">
                <div class="timeline-icon">
                  <i class="fas fa-${getIconForActivity(item.title)}"></i>
                </div>
                <div class="timeline-details">
                  <h4>${item.title}</h4>
                  <p>${item.description || ""}</p>
                </div>
              </div>
            `
          timeline.appendChild(timelineItem)
        })
      } else {
        const emptyMessage = document.createElement("p")
        emptyMessage.textContent = "No activities scheduled for this day."
        timeline.appendChild(emptyMessage)
      }
    })
  }

  // Helper function to get icon for schedule activity
  function getIconForActivity(title) {
    const title_lower = title.toLowerCase()

    if (title_lower.includes("registration") || title_lower.includes("check-in")) return "door-open"
    if (title_lower.includes("opening") || title_lower.includes("keynote") || title_lower.includes("speaker"))
      return "microphone"
    if (
      title_lower.includes("food") ||
      title_lower.includes("lunch") ||
      title_lower.includes("breakfast") ||
      title_lower.includes("dinner")
    )
      return "utensils"
    if (title_lower.includes("workshop") || title_lower.includes("technical")) return "chalkboard-teacher"
    if (title_lower.includes("start") || title_lower.includes("kickoff") || title_lower.includes("begin"))
      return "rocket"
    if (title_lower.includes("end") || title_lower.includes("submit") || title_lower.includes("deadline"))
      return "flag-checkered"
    if (title_lower.includes("award") || title_lower.includes("prize") || title_lower.includes("winner"))
      return "trophy"
    if (title_lower.includes("coffee") || title_lower.includes("tea")) return "coffee"

    // Default icon
    return "calendar-day"
  }

  // Update FAQs tab with event FAQ data
  function updateFAQsTab(faqs) {
    if (!faqs || faqs.length === 0) {
      return
    }

    // Find the FAQ container that matches the HTML structure
    const faqContainer = document.querySelector("#faq .faq-container")
    if (!faqContainer) return

    // Clear existing content
    faqContainer.innerHTML = ""

    // Create FAQs based on HTML structure
    faqs.forEach((faq) => {
      const faqItem = document.createElement("div")
      faqItem.className = "faq-item"
      faqItem.innerHTML = `
        <div class="faq-question">
          <h3>${faq.question}</h3>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="faq-answer">
          <p>${faq.answer}</p>
        </div>
      `
      faqContainer.appendChild(faqItem)
    })

    // Add event listeners to the new FAQ items
    const faqItems = faqContainer.querySelectorAll(".faq-item")
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
      question.addEventListener("click", () => {
        // Toggle current FAQ item
        item.classList.toggle("active")
      })
    })
  }

  // Helper function to format date range
  function formatDateRange(startDate, endDate) {
    const options = { month: "long", day: "numeric", year: "numeric" }

    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
      // Same month and year (e.g., "May 5-7, 2023")
      return `${startDate.toLocaleString("default", { month: "long" })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`
    } else if (startDate.getFullYear() === endDate.getFullYear()) {
      // Different months, same year (e.g., "April 30 - May 2, 2023")
      return `${startDate.toLocaleString("default", { month: "long" })} ${startDate.getDate()} - ${endDate.toLocaleString("default", { month: "long" })} ${endDate.getDate()}, ${startDate.getFullYear()}`
    } else {
      // Different years (e.g., "December 30, 2023 - January 2, 2024")
      return `${startDate.toLocaleString("default", options)} - ${endDate.toLocaleString("default", options)}`
    }
  }

  // Helper function to check if event is upcoming
  function isUpcoming(startDate) {
    const now = new Date()
    return new Date(startDate) > now
  }

  // Helper function to format date
  function formatDate(date) {
    const options = { month: "short", day: "numeric" }
    return new Date(date).toLocaleString("en-US", options)
  }

  // Initialize the page
  initPage()

  // Find the function that handles opening the event detail view
  // Around line 200-250, look for a function that handles event card clicks
  // Replace or modify the event detail view opening function with this improved version:

  function fetchEventDetails(eventId) {
    showLoader("detailLoader")
    try {
      // First try to fetch from the server
      fetch(`https://expensetracker-qppb.onrender.com/api/club-events/${eventId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch event details")
          }
          return response.json()
        })
        .then((data) => {
          if (data.success && data.event) {
            console.log("Successfully fetched event data:", data.event)
            displayEventDetails(data.event)

            // After displaying event details, fetch team registrations
            fetchTeamRegistrations(eventId)
          } else {
            console.warn(`Event with ID ${eventId} not found from API.`)
            // Fallback to mock data if available
            const mockEvent = eventData[eventId]
            if (mockEvent) {
              displayEventDetails(mockEvent)
            } else {
              showToast("Error", "Event not found", "error")
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching event details:", error)
          // Fallback to mock data if available
          const mockEvent = eventData[eventId]
          if (mockEvent) {
            displayEventDetails(mockEvent)
          } else {
            showToast("Error", "Failed to load event", "error")
          }
        })
    } catch (error) {
      console.error("Exception in fetchEventDetails:", error)
      showToast("Error", "An unexpected error occurred", "error")
    }finally{
      hideLoader("detailLoader");
    }
  }

  // Add this new function to fetch team registrations
  function fetchTeamRegistrations(eventId) {
    fetch(`https://expensetracker-qppb.onrender.com/api/team-registrations?eventId=${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.teamRegistrations) {
          console.log("Team registrations:", data.teamRegistrations)

          // Update the teams section in the modal
          const teamsContainer = document.getElementById("registrations-tab")
          if (!teamsContainer) return

          const teamsList = teamsContainer.querySelector(".registrations-list")
          if (!teamsList) return

          teamsList.innerHTML = ""

          if (data.teamRegistrations.length === 0) {
            teamsList.innerHTML = '<p class="text-muted">No teams registered yet</p>'
            return
          }

          // Display each team
          data.teamRegistrations.forEach((team) => {
            const teamItem = document.createElement("div")
            teamItem.className = "registration-item"
            teamItem.innerHTML = `
            <div class="team-info">
              <div class="team-name">${team.teamName}</div>
              <div class="team-members">${team.members.length} Members</div>
            </div>
            <div class="team-status-container">
              <span class="team-status status-${team.status}">${team.status.charAt(0).toUpperCase() + team.status.slice(1)}</span>
              <button class="view-team-btn" data-id="${team._id}">View Details</button>
            </div>
          `
            teamsList.appendChild(teamItem)
          })

          // Add event listeners to view team buttons
          const viewTeamButtons = teamsList.querySelectorAll(".view-team-btn")
          viewTeamButtons.forEach((button) => {
            button.addEventListener("click", function () {
              const teamId = this.getAttribute("data-id")
              openTeamDetailsModal(teamId)
            })
          })
        } else {
          console.error("Failed to fetch team registrations:", data.message)
        }
      })
      .catch((error) => {
        console.error("Error fetching team registrations:", error)
      })
  }

  // Add this function to open team details modal
  function openTeamDetailsModal(teamId) {
    fetch(`https://expensetracker-qppb.onrender.com/api/team-registrations/${teamId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.teamRegistration) {
          const team = data.teamRegistration

          // Display team details in a modal
          // You can create a new modal or use an existing one
          alert(`Team: ${team.teamName}\nMembers: ${team.members.length}\nStatus: ${team.status}`)

          // In a real implementation, you would show a proper modal with all team details
        } else {
          console.error("Failed to fetch team details:", data.message)
        }
      })
      .catch((error) => {
        console.error("Error fetching team details:", error)
      })
  }
})
