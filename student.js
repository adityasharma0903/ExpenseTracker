document.addEventListener("DOMContentLoaded", () => {
    // Profile Dropdown Toggle
    const profileDropdownTrigger = document.getElementById("profileDropdownTrigger")
    const profileDropdown = document.getElementById("profileDropdown")
  
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
  
    // Event Card Click - Show Event Detail View
    const eventCards = document.querySelectorAll(".event-card")
    const eventDetailView = document.getElementById("eventDetailView")
    const backToEvents = document.getElementById("backToEvents")
  
    // Event data object
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
  
    eventCards.forEach((card) => {
      card.addEventListener("click", function () {
        const eventId = this.getAttribute("data-event-id")
        showEventDetails(eventId)
      })
    })
  
    // Featured event card click
    const featuredEventCard = document.querySelector(".featured-event-card")
    if (featuredEventCard) {
      featuredEventCard.addEventListener("click", () => {
        showEventDetails("bio-ai-2023")
      })
    }
  
    backToEvents.addEventListener("click", () => {
      eventDetailView.classList.remove("active")
      document.body.style.overflow = "auto"
    })
  
    function showEventDetails(eventId) {
      const event = eventData[eventId];
      if (!event) return;
  
      document.getElementById('eventBanner').src = event.banner;
      document.getElementById('organizerLogo').src = event.organizerLogo;
      document.getElementById('organizerName').textContent = event.organizer;
  
      const eventTagsContainer = document.getElementById('eventTags');
      eventTagsContainer.innerHTML = '';
      event.tags.forEach(tag => {
          const tagElement = document.createElement('span');
          tagElement.className = 'tag';
          tagElement.textContent = tag;
          eventTagsContainer.appendChild(tagElement);
      });
  
      document.getElementById('eventTitle').textContent = event.title;
      document.getElementById('eventDescription').innerHTML = event.description;
      document.getElementById('eventDate').textContent = event.date;
      document.getElementById('eventTime').textContent = event.time;
      document.getElementById('eventVenue').textContent = event.venue;
      document.getElementById('teamSize').textContent = event.teamSize;
      document.getElementById('prizePool').textContent = event.prizePool;
      document.getElementById('dutyLeave').textContent = event.dutyLeave;
      document.getElementById('registrationCount').innerHTML = `<i class="fas fa-user-check"></i> ${event.registrationCount}`;
      document.getElementById('registrationDeadline').innerHTML = `<i class="fas fa-hourglass-half"></i> ${event.registrationDeadline}`;
  
      document.getElementById('modalEventTitle').textContent = event.title;
      document.getElementById('successEventTitle').textContent = event.title;
      document.getElementById('confirmEventDate').textContent = event.date;
  
      eventDetailView.classList.add('active');
      document.body.style.overflow = 'hidden';
  
      updateCountdownForEvent(event.date);
  }
  window.showEventDetails = showEventDetails;
  
    
  
    // Tab Navigation in Event Detail View
    const tabBtns = document.querySelectorAll(".tab-btn")
    const tabPanes = document.querySelectorAll(".tab-pane")
  
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
  
    // Countdown Timer
    function updateCountdownForEvent(eventDateStr) {
      const date = new Date(eventDateStr);
      if (isNaN(date)) return;
    
      const eventDate = date.getTime();
    
      if (window.countdownInterval) clearInterval(window.countdownInterval);
    
      function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;
    
        if (distance < 0) {
          document.getElementById('days').textContent = '00';
          document.getElementById('hours').textContent = '00';
          document.getElementById('minutes').textContent = '00';
          document.getElementById('seconds').textContent = '00';
          return;
        }
    
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
        document.getElementById('days').textContent = days < 10 ? `0${days}` : days;
        document.getElementById('hours').textContent = hours < 10 ? `0${hours}` : hours;
        document.getElementById('minutes').textContent = minutes < 10 ? `0${minutes}` : minutes;
        document.getElementById('seconds').textContent = seconds < 10 ? `0${seconds}` : seconds;
      }
    
      updateCountdown();
      window.countdownInterval = setInterval(updateCountdown, 1000);
    }
    
    window.updateCountdownForEvent = updateCountdownForEvent;
  
    // Bookmark Button
    const bookmarkBtn = document.getElementById("bookmarkBtn")
  
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
  
    // FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item")
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
  
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
    })
  
    // Copy Link Button
    const copyLinkBtn = document.getElementById("copyLinkBtn")
  
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
  
    // Registration Modal
    const registerBtn = document.getElementById("registerBtn")
    const registrationModal = document.getElementById("registrationModal")
    const closeRegModal = document.getElementById("closeRegModal")
    const cancelRegistration = document.getElementById("cancelRegistration")
  
    registerBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      registrationModal.classList.add("active")
    })
  
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
  
    // Add Team Member Button
    const addMemberBtn = document.getElementById("addMemberBtn")
    const additionalMembers = document.getElementById("additionalMembers")
    let memberCount = 2
  
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
  
    // Registration Form Submission
    const registrationForm = document.getElementById("registrationForm")
    const successModal = document.getElementById("successModal")
    const closeSuccessModalBtn = document.getElementById("closeSuccessModal")
  
    registrationForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Get form values
      const teamName = document.getElementById("teamName").value
  
      // Set confirmation details
      document.getElementById("confirmTeamName").textContent = teamName
      document.getElementById("confirmRegId").textContent = `TF2023-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(4, "0")}`
  
      // Close registration modal and show success modal
      closeRegistrationModal()
      successModal.classList.add("active")
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
  
    // Download Confirmation Button
    const downloadConfirmation = document.getElementById("downloadConfirmation")
  
    downloadConfirmation.addEventListener("click", () => {
      showToast("Registration confirmation downloaded")
    })
  
    // Feedback Modal
    const feedbackBtn = document.getElementById("feedbackBtn")
    const feedbackModal = document.getElementById("feedbackModal")
    const closeFeedbackModalBtn = document.getElementById("closeFeedbackModal")
    const cancelFeedback = document.getElementById("cancelFeedback")
  
    feedbackBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      feedbackModal.classList.add("active")
    })
  
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
  
    // Rating Stars
    const ratingStars = document.querySelectorAll(".rating-stars i")
  
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
  
    // Feedback Form Submission
    const feedbackForm = document.getElementById("feedbackForm")
  
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Close feedback modal
      closeFeedbackModal()
  
      // Show success message
      showToast("Thank you for your feedback!")
    })
  
    // Search functionality
    const searchInput = document.getElementById("searchInput")
  
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
  
    // Keyboard shortcut for search
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        searchInput.focus()
      }
    })
  
    // Toast Notification
    function showToast(message) {
      // Create toast element if it doesn't exist
      let toast = document.querySelector(".toast")
  
      if (!toast) {
        toast = document.createElement("div")
        toast.className = "toast"
        document.body.appendChild(toast)
      }
  
      // Set message and show toast
      toast.textContent = message
      toast.classList.add("active")
  
      // Hide toast after 3 seconds
      setTimeout(() => {
        toast.classList.remove("active")
      }, 3000)
    }
  
    // Initialize the page
    function initPage() {
      // Show a welcome toast
      setTimeout(() => {
        showToast("Welcome to TechEvents! Explore the latest hackathons and events.")
      }, 1000)
    }
  
    initPage()
  })
  
  // Add this function at the end of your student.js file
  document.addEventListener("DOMContentLoaded", () => {
    fetchAllEvents()
  })
  
  // Replace the fetchAllEvents function with this improved version
  async function fetchAllEvents() {
    try {
      // Try multiple endpoints to find events
      let events = []
  
      // First try the main events endpoint
      const mainResponse = await fetch("http://localhost:5000/api/events")
      const mainData = await mainResponse.json()
  
      if (Array.isArray(mainData) && mainData.length > 0) {
        events = mainData
      } else if (mainData.events && Array.isArray(mainData.events) && mainData.events.length > 0) {
        events = mainData.events
      } else {
        // If no events found, try the approved events endpoint
        const approvedResponse = await fetch("http://localhost:5000/api/approved-events")
        const approvedData = await approvedResponse.json()
  
        if (approvedData.events && Array.isArray(approvedData.events) && approvedData.events.length > 0) {
          events = approvedData.events
        } else {
          // If still no events, try the club events endpoint
          const clubResponse = await fetch("http://localhost:5000/api/club-events")
          const clubData = await clubResponse.json()
  
          if (clubData.events && Array.isArray(clubData.events) && clubData.events.length > 0) {
            events = clubData.events
          }
        }
      }
  
      if (events.length > 0) {
        console.log("Successfully fetched events:", events.length)
        renderEvents(events)
      } else {
        console.log("No events found in any endpoint. Using mock data instead.")
        // Use mock data if no events found
        renderMockEvents()
      }
    } catch (err) {
      console.error("Error fetching events:", err)
      // Fallback to mock data on error
      renderMockEvents()
    }
  }
  
  // Add this function to render mock events when no real events are available
function renderMockEvents() {
  const container = document.querySelector("#dynamic-events");
  container.innerHTML = "";

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
        { title: "Second Prize", amount: 100000, description: "₹1,00,000 cash prize for the runner-up." }
      ],
      schedule: [
        {
          date: "April 20, 2025",
          activities: [
            { time: "9:00 AM", title: "Kickoff", description: "Welcome and problem statement reveal." },
            { time: "11:00 AM", title: "Workshop: Blockchain Basics", description: "Hosted by LUKSO experts." }
          ]
        },
        {
          date: "April 21, 2025",
          activities: [
            { time: "3:00 PM", title: "Submission Deadline", description: "All projects must be submitted." },
            { time: "5:00 PM", title: "Closing Ceremony", description: "Winners announced and prizes distributed." }
          ]
        }
      ]
    },
    // Add more mock events as needed
  ];

  mockEvents.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.setAttribute("data-event-id", event._id);

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
    `;

    card.addEventListener("click", () => displayEventDetails(event));
    container.appendChild(card);
  });
}
  
  // Update the renderEvents function to handle different data structures
  function renderEvents(events) {
    const container = document.querySelector("#dynamic-events")
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
            <a href="#" class="btn-notify">Notify me</a>
          </div>
        `
  
      container.appendChild(card)
  
      // Add event listener to show event details when clicked
      card.addEventListener("click", () => {
        fetchEventDetails(eventId)
      })
    })
  }
  
  app.get("/api/club-events/:id", async (req, res) => {
    try {
      const event = await ClubEvent.findById(req.params.id); // Use ClubEvent model
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
  
      res.json({
        success: true,
        event: {
          ...event.toObject(),
          prizes: event.prizes || { pool: 0 }, // Ensure prizes are included
          schedule: event.schedule || [], // Include schedule if available
          startTime: event.startTime || "9:00 AM",
          endTime: event.endTime || "6:00 PM",
        },
      });
    } catch (error) {
      console.error("Error fetching club event:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  
  // Add a new function to fetch event details by ID
  async function fetchEventDetails(eventId) {
    try {
      const response = await fetch(`http://localhost:5000/api/club-events/${eventId}`); // Correct endpoint
      if (!response.ok) {
        console.warn(`Event with ID ${eventId} not found.`);
        return;
      }
  
      const data = await response.json();
      if (data.success && data.event) {
        displayEventDetails(data.event);
      } else {
        console.warn(`Event with ID ${eventId} not found.`);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  }
  
  
  
  // Add a new function to display event details from database
  function displayEventDetails(event) {
    const eventDetailView = document.getElementById("eventDetailView");
  
    // Set default values for missing fields
    const defaultBanner = "https://source.unsplash.com/random/1200x400/?hackathon";
    const defaultLogo = "https://source.unsplash.com/random/100x100/?tech";
  
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const formattedDate = formatDateRange(startDate, endDate);
  
    // Update event details in the DOM
    document.getElementById("eventBanner").src = event.banner || defaultBanner;
    document.getElementById("organizerLogo").src = event.organizerLogo || defaultLogo;
    document.getElementById("organizerName").textContent = event.organizer || "Event Organizer";
  
    // Update event tags
    const eventTagsContainer = document.getElementById("eventTags");
    eventTagsContainer.innerHTML = "";
  
    const tags = [event.department, event.theme, "Technology", "Innovation"];
    tags.forEach((tag) => {
      if (tag) {
        const tagElement = document.createElement("span");
        tagElement.className = "tag";
        tagElement.textContent = tag;
        eventTagsContainer.appendChild(tagElement);
      }
    });
  
    document.getElementById("eventTitle").textContent = event.title;
  
    // Format description
    let description = event.description || "<p>No description available.</p>";
    if (event.eligibilityCriteria) {
      description += "<h3>Eligibility Criteria:</h3><ul>";
      event.eligibilityCriteria.forEach((criteria) => {
        description += `<li>${criteria}</li>`;
      });
      description += "</ul>";
    }
    document.getElementById("eventDescription").innerHTML = description;
  
    document.getElementById("eventDate").textContent = formattedDate;
    document.getElementById("eventTime").textContent = event.time || "N/A";
    document.getElementById("eventVenue").textContent = event.venue || "N/A";
  
    // Team size
    document.getElementById("teamSize").textContent = event.teamSize || "N/A";
  
    // Prize pool
    document.getElementById("prizePool").textContent = event.prizes?.pool
      ? `₹${event.prizes.pool.toLocaleString()}`
      : "N/A";
  
    // Duty leave
    const dutyLeave = event.dutyLeave?.available
      ? `Available (${event.dutyLeave.days} Days)`
      : "Not Available";
    document.getElementById("dutyLeave").textContent = dutyLeave;
  
    // Registration count
    document.getElementById("registrationCount").innerHTML = `<i class="fas fa-user-check"></i> ${
      event.registrationCount || "N/A"
    }`;
  
    // Registration deadline
    document.getElementById("registrationDeadline").innerHTML = `<i class="fas fa-hourglass-half"></i> ${
      event.registrationDeadline || "Opens Soon"
    }`;
  
    // Show event detail view
    eventDetailView.classList.add("active");
    document.body.style.overflow = "hidden";
  
    updateCountdownForEvent(event.startDate);
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
  
  // Modify the event card click handler to use our improved fetchEventDetails function
  document.addEventListener("DOMContentLoaded", () => {
    // Your existing DOMContentLoaded code...
  
    // Event Card Click - Show Event Detail View
    const eventCards = document.querySelectorAll(".event-card")
    const eventDetailView = document.getElementById("eventDetailView")
    const backToEvents = document.getElementById("backToEvents")
  
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
        const eventId = featuredEventCard.querySelector("[data-event-id]")?.getAttribute("data-event-id") || "bio-ai-2023"
        fetchEventDetails(eventId)
      })
    }
  
    backToEvents.addEventListener("click", () => {
      eventDetailView.classList.remove("active")
      document.body.style.overflow = "auto"
    })
  
    // Fetch all events on page load
    fetchAllEvents()
  })
  
  // Add a toast notification function for error messages
  function showToast(title, message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector(".toast")
  
    if (!toast) {
      toast = document.createElement("div")
      toast.className = "toast"
      document.body.appendChild(toast)
    }
  
    // Set message and show toast
    toast.innerHTML = `<strong>${title}</strong>: ${message}`
    toast.classList.add("active")
  
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("active")
    }, 3000)
  }
  
  fetch('http://localhost:5000/api/events')
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to fetch events');
      }
      return response.json();
  })
  .then(events => {
      console.log(events); // Here you can display or process all the events
      // Example: Display events on the page
      events.forEach(event => {
          console.log(event.name); // Or however you want to display the event
      });
  })
  .catch(error => {
      console.error(error);
  });


  let eventData = {}; // Will be filled from API

  async function fetchAndDisplayEvents() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://your-backend-domain.com/api/events', {
        headers: {
          'x-auth-token': token
        }
      });
  
      const data = await response.json();
  
      if (data.success) {
        const events = data.events;
        const eventContainer = document.getElementById('eventContainer'); // ID of the div where cards go
  
        eventContainer.innerHTML = ''; // Clear existing cards
        eventData = {}; // Clear previous
  
        events.forEach(event => {
          const eventId = event._id;
          eventData[eventId] = {
            title: event.name,
            organizer: event.club,
            banner: event.banner || `https://source.unsplash.com/random/1200x400/?event,${event.club}`,
            organizerLogo: event.organizerLogo || `https://source.unsplash.com/random/100x100/?club,${event.club}`,
            tags: [event.department, event.status],
            date: formatDate(event.startDate),
            time: `${event.startTime || "N/A"} - ${event.endTime || "N/A"}`,
            venue: event.venue || "N/A",
            teamSize: event.teamMin && event.teamMax ? `${event.teamMin}-${event.teamMax} Members` : "N/A",
            prizePool: event.prizes?.pool ? `₹${event.prizes.pool.toLocaleString()}` : "N/A", // Ensure prizes are mapped
            dutyLeave: event.dutyLeave?.available ? `Available (${event.dutyLeave.days} Days)` : "Not Available",
            registrationCount: event.registrationCount || "N/A",
            registrationDeadline: formatDate(event.endDate),
            description: event.description || "<p>No description available.</p>",
          };
  
          // Create card dynamically
          const card = document.createElement('div');
          card.className = 'event-card';
          card.setAttribute('data-event-id', eventId);
          card.innerHTML = `
            <img src="https://source.unsplash.com/random/400x200/?${event.club}" alt="${event.name}" />
            <h3>${event.name}</h3>
            <p>${event.club}</p>
          `;
  
          card.addEventListener('click', () => showEventDetails(eventId));
          eventContainer.appendChild(card);
        });
      } else {
        showToast('Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      showToast('Something went wrong');
    }
  }

// Utility to format date (YYYY-MM-DD to readable format)
function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

