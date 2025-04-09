// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
    // Mobile Menu
    const menuToggle = document.getElementById("menuToggle")
    const mobileMenu = document.getElementById("mobileMenu")
    const menuClose = document.getElementById("menuClose")
    const mobileLinks = document.querySelectorAll(".mobile-nav a")
  
    // Role Tabs
    const tabBtns = document.querySelectorAll(".tab-btn")
    const tabContents = document.querySelectorAll(".tab-content")
  
    // Event Slider
    const sliderTrack = document.getElementById("sliderTrack")
    const sliderPrev = document.getElementById("sliderPrev")
    const sliderNext = document.getElementById("sliderNext")
    const sliderDots = document.getElementById("sliderDots")
    const dots = document.querySelectorAll(".dot")
  
    // Pricing Toggle
    const pricingToggle = document.getElementById("pricingToggle")
    const monthlyPrices = document.querySelectorAll(".price-monthly")
    const annualPrices = document.querySelectorAll(".price-annual")
  
    // Role Selection Modal
    const getStartedBtn = document.getElementById("getStartedBtn")
    const mobileGetStartedBtn = document.getElementById("mobileGetStartedBtn")
    const roleModal = document.getElementById("roleModal")
    const modalClose = document.getElementById("modalClose")
    const roleOptions = document.querySelectorAll(".role-option")
  
    // Header Scroll Effect
    window.addEventListener("scroll", () => {
      const header = document.querySelector(".header")
      if (window.scrollY > 50) {
        header.style.boxShadow = "var(--shadow-md)"
        header.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
      } else {
        header.style.boxShadow = "var(--shadow-sm)"
        header.style.backgroundColor = "rgba(255, 255, 255, 0.9)"
      }
    })
  
    // Mobile Menu Toggle
    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        menuToggle.classList.add("active")
        mobileMenu.classList.add("active")
        document.body.style.overflow = "hidden"
      })
    }
  
    if (menuClose) {
      menuClose.addEventListener("click", () => {
        menuToggle.classList.remove("active")
        mobileMenu.classList.remove("active")
        document.body.style.overflow = ""
      })
    }
  
    // Mobile Nav Links
    if (mobileLinks) {
      mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
          menuToggle.classList.remove("active")
          mobileMenu.classList.remove("active")
          document.body.style.overflow = ""
        })
      })
    }
  
    // Role Tabs
    if (tabBtns) {
      tabBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const tab = this.getAttribute("data-tab")
  
          // Update active button
          tabBtns.forEach((b) => b.classList.remove("active"))
          this.classList.add("active")
  
          // Update active content
          tabContents.forEach((content) => {
            content.classList.remove("active")
            if (content.id === `${tab}-tab`) {
              content.classList.add("active")
            }
          })
        })
      })
    }
  
    // Event Slider
    let currentSlide = 0
    const slideWidth = 100 // 100%
    const totalSlides = dots ? dots.length : 0
  
    function updateSlider() {
      if (sliderTrack) {
        sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`
      }
  
      if (dots) {
        dots.forEach((dot, index) => {
          dot.classList.toggle("active", index === currentSlide)
        })
      }
    }
  
    if (sliderPrev) {
      sliderPrev.addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
        updateSlider()
      })
    }
  
    if (sliderNext) {
      sliderNext.addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % totalSlides
        updateSlider()
      })
    }
  
    if (dots) {
      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          currentSlide = index
          updateSlider()
        })
      })
    }
  
    // Auto slide every 5 seconds
    let slideInterval = setInterval(() => {
      if (totalSlides > 0) {
        currentSlide = (currentSlide + 1) % totalSlides
        updateSlider()
      }
    }, 5000)
  
    // Pause auto slide on hover
    if (sliderTrack) {
      sliderTrack.addEventListener("mouseenter", () => {
        clearInterval(slideInterval)
      })
  
      sliderTrack.addEventListener("mouseleave", () => {
        slideInterval = setInterval(() => {
          currentSlide = (currentSlide + 1) % totalSlides
          updateSlider()
        }, 5000)
      })
    }
  
    // Pricing Toggle
    if (pricingToggle) {
      pricingToggle.addEventListener("change", function () {
        if (this.checked) {
          // Show annual prices
          monthlyPrices.forEach((price) => (price.style.display = "none"))
          annualPrices.forEach((price) => (price.style.display = "inline"))
        } else {
          // Show monthly prices
          monthlyPrices.forEach((price) => (price.style.display = "inline"))
          annualPrices.forEach((price) => (price.style.display = "none"))
        }
      })
    }
  
    // Role Selection Modal
    if (getStartedBtn) {
      getStartedBtn.addEventListener("click", (e) => {
        e.preventDefault()
        roleModal.classList.add("active")
        document.body.style.overflow = "hidden"
      })
    }
  
    if (mobileGetStartedBtn) {
      mobileGetStartedBtn.addEventListener("click", (e) => {
        e.preventDefault()
        roleModal.classList.add("active")
        document.body.style.overflow = "hidden"
        // Close mobile menu if open
        menuToggle.classList.remove("active")
        mobileMenu.classList.remove("active")
      })
    }
  
    if (modalClose) {
      modalClose.addEventListener("click", () => {
        roleModal.classList.remove("active")
        document.body.style.overflow = ""
      })
    }
  
    // Close modal when clicking outside
    roleModal.addEventListener("click", (e) => {
      if (e.target === roleModal) {
        roleModal.classList.remove("active")
        document.body.style.overflow = ""
      }
    })
  
    // Role options click handler
    if (roleOptions) {
      roleOptions.forEach((option) => {
        option.addEventListener("click", function (e) {
          e.preventDefault()
          const role = this.getAttribute("data-role")
          // Redirect to login page with role parameter
          // For now, just show an alert
          alert(`Redirecting to login page for ${role} role`)
          roleModal.classList.remove("active")
          document.body.style.overflow = ""
  
          // In a real implementation, you would redirect to a login page:
          // window.location.href = `/login?role=${role}`;
        })
      })
    }
  
    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
  
        const targetId = this.getAttribute("href")
        if (targetId === "#") return
  
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          const headerOffset = 80
          const elementPosition = targetElement.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
  
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          })
        }
      })
    })
  
    // Hero Image Animation
    const heroImage = document.querySelector(".hero-image")
    if (heroImage) {
      heroImage.addEventListener("mousemove", function (e) {
        const { left, top, width, height } = this.getBoundingClientRect()
        const x = (e.clientX - left) / width - 0.5
        const y = (e.clientY - top) / height - 0.5
  
        this.querySelector("img").style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${y * -10}deg)`
      })
  
      heroImage.addEventListener("mouseleave", function () {
        this.querySelector("img").style.transform = "perspective(1000px) rotateY(-5deg) rotateX(5deg)"
      })
    }
  
    // Newsletter Form Submission
    const newsletterForm = document.querySelector(".newsletter-form")
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault()
        const emailInput = this.querySelector('input[type="email"]')
  
        if (emailInput.value.trim() !== "") {
          // Simulate form submission
          alert("Thank you for subscribing to our newsletter!")
          emailInput.value = ""
        }
      })
    }
  
    // Initialize
    updateSlider()
  })
  