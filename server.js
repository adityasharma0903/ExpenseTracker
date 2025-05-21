const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const nodemailer = require("nodemailer")
const path = require("path")
const fs = require("fs")
const cloudinary = require("cloudinary").v2
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const docxtemplater = require("docxtemplater")
const PizZip = require("pizzip")
const { PDFDocument } = require("pdf-lib")
const libre = require("libreoffice-convert")
const { promisify } = require("util")
const mammoth = require("mammoth")
const cheerio = require("cheerio")
const tmp = require("tmp")

const libreConvert = promisify(libre.convert)

// Create uploads directory if it doesn't exist
// At the top of your server.js file
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`✅ Created uploads directory: ${uploadsDir}`);
  } catch (err) {
    console.error(`❌ Failed to create uploads directory: ${err.message}`);
  }
}

// Configure multer storage for report templates
const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    cb(null, `template_${Date.now()}_${file.originalname}`)
  }
})

const reportUpload = multer({ 
  storage: reportStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only .docx files
    if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      cb(null, true)
    } else {
      cb(new Error("Only .docx files are allowed"), false)
    }
  }
})

// Load environment variables
dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "902d22ae459df3cef67d662f3b637feb8f149eb451362aa6e40596f9c6503dac2de98d1c3d5fa1ac61d6e545f4e46bac84d5a60937602c146ee0bc2e80e5b1b9"
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://connectrevoliq:supportrevoliq@revoliq.i93q6.mongodb.net/?retryWrites=true&w=majority&appName=Revoliq"

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "event-posters",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1080, height: 1350, crop: "limit" }],
  },
})

// Initialize multer with Cloudinary storage
const upload = multer({ storage })

// Configure CORS
const corsOptions = {
  origin: [
    "https://unibux.vercel.app",
    "http://localhost:3000",
    // Add any other allowed origins
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "x-auth-token"],
  credentials: true,
}

// Apply middleware
app.use(cors(corsOptions))
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// ==================== SCHEMAS & MODELS ====================

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["admin", "department"],
    required: true,
  },
  department: {
    type: String,
    required: function () {
      return this.type === "department"
    },
  },
  uid: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model("admin", userSchema)

// Approved Team Schema
const approvedTeamSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  leaderName: {
    type: String,
    required: true,
  },
  members: [
    {
      name: String,
      email: String,
      phone: String,
      department: String,
      isLeader: Boolean,
    },
  ],
  projectIdea: String,
  techStack: String,
  approvedAt: {
    type: Date,
    default: Date.now,
  },
})

const ApprovedTeam = mongoose.model("approvedteams", approvedTeamSchema)

// Expense Schema
const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
})

// Department Event Schema
const eventSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  club: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  expenses: [expenseSchema],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
eventSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

const Event = mongoose.model("eventsclub", eventSchema)

// ==================== CLUB EVENTS SCHEMA (NEW) ====================

// Prize Schema
const prizeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: "",
  },
})

// Special Award Schema
const specialAwardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: "",
  },
})

// Sponsor Schema
const sponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    default: null,
  },
})

// Schedule Item Schema
const scheduleItemSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
})

// Schedule Day Schema
const scheduleDaySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  items: [scheduleItemSchema],
})

// FAQ Schema
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
})

// Duty Leave Schema
const dutyLeaveSchema = new mongoose.Schema({
  available: {
    type: Boolean,
    default: false,
  },
  days: {
    type: Number,
    default: 0,
  },
})

// Prizes Schema
const prizesSchema = new mongoose.Schema({
  pool: {
    type: Number,
    default: 0,
  },
  first: prizeSchema,
  second: prizeSchema,
  third: prizeSchema,
  special: [specialAwardSchema],
  perks: [String],
})

// Club Event Schema (for eventschitkara collection)
const clubEventSchema = new mongoose.Schema({
  clubId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  hasDL: {
    type: Boolean,
    default: false,
  },
  dlType: {
    type: String,
    default: null,
  },
  dlStartTime: {
    type: String,
    default: null,
  },
  dlEndTime: {
    type: String,
    default: null,
  },
  poster: {
    type: String,
    default: null,
  },
  teams: {
    type: Number,
    default: 1,
  },
  venue: {
    type: String,
    required: true,
  },
  teamMin: {
    type: Number,
    default: 1,
  },
  teamMax: {
    type: Number,
    default: 5,
  },
  about: {
    type: String,
    default: "",
  },
  theme: {
    type: String,
    default: "",
  },
  expectItems: [String],
  eligibilityCriteria: [String],
  dutyLeave: dutyLeaveSchema,
  prizes: prizesSchema,
  sponsors: [sponsorSchema],
  schedule: [scheduleDaySchema],
  faqs: [faqSchema],
  expenses: [expenseSchema],
  totalBudget: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
clubEventSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

const ClubEvent = mongoose.model("eventschitkara", clubEventSchema)

// ==================== TEAM REGISTRATION SCHEMA (NEW) ====================

// Team Member Schema
const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  isLeader: {
    type: Boolean,
    default: false,
  },
})

// Team Registration Schema
const teamRegistrationSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    index: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  members: [teamMemberSchema],
  projectIdea: {
    type: String,
    default: "",
  },
  techStack: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: "",
  },
})

// Update the updatedAt field before saving
teamRegistrationSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

const TeamRegistration = mongoose.model("teamregistrations", teamRegistrationSchema)

// ==================== MIDDLEWARE ====================

// Authentication middleware
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token")

  // Check if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Add user from payload to request
    req.user = decoded.user
    next()
  } catch (error) {
    console.error("Token verification error:", error.message)

    // For club events, we'll try to extract the club ID from the token
    // This is a simplified approach for the club management system
    try {
      // The token is in base64 format: clubId:timestamp
      const tokenData = Buffer.from(token, "base64").toString().split(":")
      if (tokenData.length === 2) {
        req.clubId = tokenData[0]
        // Allow the request to proceed with just the club ID
        return next()
      }
    } catch (e) {
      console.error("Failed to parse token:", e)
    }

    res.status(401).json({
      success: false,
      message: "Token is not valid",
    })
  }
}

// Admin-only middleware
const adminAuth = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token")

  // Check if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Check if user is admin
    if (decoded.user.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      })
    }

    // Add user from payload to request
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    })
  }
}

// Validation middleware
const validateAdminSignup = (req, res, next) => {
  const { username, email, password } = req.body

  // Check if all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    })
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    })
  }

  next()
}

const validateLogin = (req, res, next) => {
  const { username, password } = req.body

  // Check if all fields are provided
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide username and password",
    })
  }

  next()
}

const validateEventCreation = (req, res, next) => {
  const { department, name, club, startDate, endDate, startTime, endTime, venue, description } = req.body

  // Check if all required fields are provided
  if (!department || !name || !club || !startDate || !endDate || !startTime || !endTime || !venue || !description) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    })
  }

  // Validate dates
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid dates",
    })
  }

  if (end < start) {
    return res.status(400).json({
      success: false,
      message: "End date cannot be before start date",
    })
  }

  // Validate expenses if provided
  if (req.body.expenses) {
    const { expenses } = req.body

    if (!Array.isArray(expenses)) {
      return res.status(400).json({
        success: false,
        message: "Expenses must be an array",
      })
    }

    for (const expense of expenses) {
      if (!expense.category || !expense.description || typeof expense.amount !== "number") {
        return res.status(400).json({
          success: false,
          message: "Each expense must have a category, description, and amount",
        })
      }
    }
  }

  next()
}

const validateEventUpdate = (req, res, next) => {
  // Validate dates if provided
  if (req.body.startDate && req.body.endDate) {
    const start = new Date(req.body.startDate)
    const end = new Date(req.body.endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid dates",
      })
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      })
    }
  }

  // Validate expenses if provided
  if (req.body.expenses) {
    const { expenses } = req.body

    if (!Array.isArray(expenses)) {
      return res.status(400).json({
        success: false,
        message: "Expenses must be an array",
      })
    }

    for (const expense of expenses) {
      if (!expense.category || !expense.description || typeof expense.amount !== "number") {
        return res.status(400).json({
          success: false,
          message: "Each expense must have a category, description, and amount",
        })
      }
    }
  }

  next()
}

// Simplified validation for club events
const validateClubEventCreation = (req, res, next) => {
  const { clubId, name, description, startDate, endDate, startTime, endTime, venue } = req.body

  // Check if all required fields are provided
  if (!clubId || !name || !description || !startDate || !endDate || !startTime || !endTime || !venue) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    })
  }

  // Validate dates
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid dates",
    })
  }

  if (end < start) {
    return res.status(400).json({
      success: false,
      message: "End date cannot be before start date",
    })
  }

  next()
}

// Validate team registration
const validateTeamRegistration = (req, res, next) => {
  const { eventId, teamName, members, projectIdea, techStack } = req.body

  if (!eventId || !teamName || !members || !Array.isArray(members) || members.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    })
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@chitkara\.edu\.in$/

  for (const member of members) {
    if (!member.name || !member.email || !member.phone || !member.department) {
      return res.status(400).json({
        success: false,
        message: "Each team member must have a name, email, phone, and department",
      })
    }

    if (!emailPattern.test(member.email)) {
      return res.status(400).json({
        success: false,
        message: `Invalid email: ${member.email}. Only @chitkara.edu.in emails are allowed.`,
      })
    }
  }

  next()
}

// ==================== EMAIL FUNCTIONALITY ====================

// Improved email sending function
const sendApprovalEmail = async (team, customEmail = null) => {
  console.log("📧 SEND APPROVAL EMAIL FUNCTION CALLED")

  try {
    // ✅ 1. Check email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("⚠️ Email credentials missing!")
      throw new Error("Email credentials not configured")
    }

    // ✅ 2. Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true,
    })

    await transporter.verify()
    console.log("✅ Transporter verified")

    // ✅ 3. Fetch event details
    let eventName = "your registered event"
    let clubName = "your club"

    try {
      const event = await ClubEvent.findById(team.eventId)
      console.log("🔍 Fetched Event:", event ? event.name : "Not found")

      if (event) {
        eventName = event.name || eventName
        clubName = event.clubId || clubName
      } else {
        console.warn("⚠️ No event found for eventId:", team.eventId)
      }
    } catch (err) {
      console.error("❌ Error fetching event:", err.message)
    }

    // ✅ 4. Convert club ID to full name
    const clubMap = {
      osc: "Open Source Chandigarh",
      gfg: "GeeksForGeeks CUIET",
      ieee: "IEEE",
      coe: "Center of Excellence",
      explore: "Explore Labs",
      ceed: "CEED",
      // Add more if needed
    }

    const readableClub = clubMap[clubName] || clubName

    // ✅ 5. Loop through members and send email
    for (const member of team.members) {
      // Determine email content - use custom if provided, otherwise default
      let emailSubject = "🎉 Your Team is Approved!"
      let emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 15px;">
          <h2 style="color: #28a745;">Hi ${member.name},</h2>
          <p style="font-size: 16px;">
            We're excited to let you know that your team <b>${team.teamName}</b> has been <span style="color: green;"><b>approved</b></span> to participate in the event <b>${eventName}</b>, proudly organized by <b>${readableClub}</b>! 🥳
          </p>
          <p style="font-size: 15px;"><b>Project Idea:</b> ${team.projectIdea || "Not specified"}</p>
          <p style="font-size: 15px;"><b>Tech Stack:</b> ${team.techStack || "Not specified"}</p>
          <p style="font-size: 15px;">Get ready to showcase your creativity and innovation! This is your moment. 🌟</p>
          <br/>
          <p style="font-size: 16px;">Wishing you all the best,<br><b>${eventName} Team</b></p>
        </div>
      `

      // If custom email content is provided, use it
      if (customEmail) {
        if (customEmail.subject) emailSubject = customEmail.subject
        if (customEmail.content) {
          // Convert plain text to HTML with proper line breaks
          emailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 15px;">
              ${customEmail.content.replace(/\n/g, "<br>")}
            </div>
          `
        }
      }

      const mailOptions = {
        from: `"Unibux" <${process.env.EMAIL_USER}>`,
        to: member.email,
        subject: emailSubject,
        html: emailHtml,
      }

      // Add attachments if provided
      if (customEmail && customEmail.attachments && customEmail.attachments.length > 0) {
        console.log(`📎 Adding ${customEmail.attachments.length} attachments to email`)
        mailOptions.attachments = customEmail.attachments
      }

      console.log(`📧 Sending approval email to: ${member.email}`)
      try {
        const info = await transporter.sendMail(mailOptions)
        console.log(`✅ Email sent to ${member.email}: ${info.messageId}`)
      } catch (sendError) {
        console.error(`❌ Failed to send email to ${member.email}:`, sendError.message)
      }
    }

    console.log("✅ All approval emails sent successfully")
    return true
  } catch (error) {
    console.error("❌ ERROR in sendApprovalEmail function:", error)
    return false
  }
}

// ==================== ROUTES ====================

// Team approval route with improved email handling
app.put("/api/team-registrations/:id/approve", async (req, res) => {
  console.log("🔍 APPROVE TEAM ROUTE CALLED for ID:", req.params.id)

  try {
    console.log("🔍 Finding team registration...")
    const teamRegistration = await TeamRegistration.findById(req.params.id)

    if (!teamRegistration) {
      console.log("❌ Team registration not found!")
      return res.status(404).json({
        success: false,
        message: "Team registration not found",
      })
    }

    console.log("✅ Team found:", teamRegistration.teamName)

    // Update team status
    console.log("🔍 Updating team status to approved...")
    teamRegistration.status = "approved"
    if (req.body.notes) teamRegistration.notes = req.body.notes
    await teamRegistration.save()
    console.log("✅ Team status updated successfully")

    const leader = teamRegistration.members.find((m) => m.isLeader)
    console.log("🔍 Team leader:", leader ? leader.name : "No leader found")

    console.log("🔍 Creating approved team record...")
    const approvedTeam = new ApprovedTeam({
      eventId: teamRegistration.eventId,
      teamName: teamRegistration.teamName,
      leaderName: leader ? leader.name : "",
      members: teamRegistration.members,
      projectIdea: teamRegistration.projectIdea,
      techStack: teamRegistration.techStack,
    })

    await approvedTeam.save()
    console.log("✅ Approved team saved to database")

    // Check if custom email data is provided
    const customEmail = req.body.customEmail

    // Send emails to all team members
    console.log("📧 Attempting to send emails to team members:")
    approvedTeam.members.forEach((m, i) => {
      console.log(`   ${i + 1}. ${m.name} <${m.email}>`)
    })

    try {
      console.log("📧 Calling sendApprovalEmail function...")
      // Pass custom email data if provided
      const emailResult = await sendApprovalEmail(approvedTeam, customEmail)
      if (emailResult) {
        console.log("✅ All approval emails sent successfully")
      } else {
        console.log("⚠️ There were issues sending some emails, but the approval process continued")
      }
    } catch (emailError) {
      console.error("❌ EMAIL ERROR:", emailError)
      // Continue execution even if email fails
      console.log("⚠️ Continuing despite email error")
    }

    console.log("🔍 Sending success response to client")
    res.json({
      success: true,
      message: "Team approved and emails sent",
      teamRegistration,
    })
  } catch (error) {
    console.error("❌ ERROR in approve team route:", error)
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
      error: error.toString(),
    })
  }
})

// Configure disk storage for temporary file uploads
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads")
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

// Create a multer instance for handling file uploads to disk
const diskUpload = multer({
  storage: diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
})

// Helper function to upload file to Cloudinary
async function uploadToCloudinary(filePath, folder = "unibux") {
  try {
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // Automatically detect resource type
      folder: folder, // Store in a specific folder in Cloudinary
    })

    // Remove the temporary file after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    return result.secure_url
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    // Remove the temporary file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    throw error
  }
}

// Route to handle custom email with attachments
app.post("/api/team-registrations/:id/custom-email", diskUpload.array("attachments", 5), async (req, res) => {
  console.log("📧 CUSTOM EMAIL ROUTE CALLED for ID:", req.params.id)

  try {
    const teamId = req.params.id
    const { subject, content } = req.body

    console.log("📧 Email Subject:", subject)
    console.log("📧 Email Content:", content)

    // Get team data
    const team = await TeamRegistration.findById(teamId)
    if (!team) {
      console.log("❌ Team not found!")
      return res.status(404).json({
        success: false,
        message: "Team not found",
      })
    }

    console.log("✅ Team found:", team.teamName)

    // Process file uploads if any
    let attachments = []
    if (req.files && req.files.length > 0) {
      console.log(`📎 Processing ${req.files.length} attachments`)

      attachments = await Promise.all(
        req.files.map(async (file) => {
          // Upload file to Cloudinary
          const cloudinaryUrl = await uploadToCloudinary(file.path)

          return {
            filename: file.originalname,
            path: cloudinaryUrl,
          }
        }),
      )

      console.log("📎 Attachments processed:", attachments)
    }

    // Update team status to approved
    team.status = "approved"
    await team.save()
    console.log("✅ Team status updated to approved")

    // Create approved team record
    const leader = team.members.find((m) => m.isLeader)
    const approvedTeam = new ApprovedTeam({
      eventId: team.eventId,
      teamName: team.teamName,
      leaderName: leader ? leader.name : "",
      members: team.members,
      projectIdea: team.projectIdea,
      techStack: team.techStack,
    })

    await approvedTeam.save()
    console.log("✅ Approved team saved to database")

    // Send custom email
    const customEmail = {
      subject,
      content,
      attachments,
    }

    console.log("📧 Sending custom email with attachments")
    const emailResult = await sendApprovalEmail(approvedTeam, customEmail)

    if (emailResult) {
      console.log("✅ Custom email sent successfully")
      res.json({
        success: true,
        message: "Team approved and custom email sent",
      })
    } else {
      console.log("⚠️ Failed to send custom email")
      res.status(500).json({
        success: false,
        message: "Team approved but failed to send custom email",
      })
    }
  } catch (error) {
    console.error("❌ ERROR in custom email route:", error)
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
      error: error.toString(),
    })
  }
})

// Test email route
app.get("/api/test-email", async (req, res) => {
  console.log("🔍 TEST EMAIL ROUTE CALLED")

  try {
    const testTeam = {
      teamName: "Test Team",
      leaderName: "Test Leader",
      projectIdea: "Test Project",
      techStack: "Test Stack",
      members: [
        {
          name: "Test Member 1",
          email: req.query.email || process.env.EMAIL_USER || "test@example.com",
        },
        {
          name: "Test Member 2",
          email: req.query.email2 || process.env.EMAIL_USER || "test2@example.com",
        },
      ],
    }

    console.log("📧 Calling sendApprovalEmail with test data...")
    const result = await sendApprovalEmail(testTeam)

    if (result) {
      res.json({
        success: true,
        message: "Test email sent successfully",
        testEmail: req.query.email || process.env.EMAIL_USER || "test@example.com",
      })
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send test email. Check server logs for details.",
      })
    }
  } catch (error) {
    console.error("❌ TEST EMAIL ERROR:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.toString(),
    })
  }
})

// Check environment variables route
app.get("/api/check-env", (req, res) => {
  res.json({
    emailUserSet: !!process.env.EMAIL_USER,
    emailPassSet: !!process.env.EMAIL_PASS,
    // Don't show the actual values for security reasons
    emailUserLength: process.env.EMAIL_USER ? process.env.EMAIL_USER.length : 0,
    emailPassLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    cloudinaryConfigured: !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ),
  })
})

// Team status update route
app.put("/api/team-registrations/:id/status", async (req, res) => {
  try {
    const team = await TeamRegistration.findById(req.params.id)
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" })
    }

    const { status } = req.body
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" })
    }

    team.status = status
    await team.save()

    // Auto-create approved entry and send emails if status is approved
    if (status === "approved") {
      const leader = team.members.find((m) => m.isLeader)
      const approvedTeam = await ApprovedTeam.create({
        eventId: team.eventId,
        teamName: team.teamName,
        leaderName: leader ? leader.name : "",
        members: team.members,
        projectIdea: team.projectIdea,
        techStack: team.techStack,
      })

      // Send approval emails
      try {
        await sendApprovalEmail(approvedTeam)
        console.log("✅ Approval emails sent for team:", team.teamName)
      } catch (emailError) {
        console.error("❌ Error sending approval emails:", emailError)
      }
    }

    res.json({ success: true, message: "Status updated", team })
  } catch (err) {
    console.error("Status update error:", err)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// Team rejection route
app.put("/api/team-registrations/:id/reject", async (req, res) => {
  try {
    const teamRegistration = await TeamRegistration.findById(req.params.id)

    if (!teamRegistration) {
      return res.status(404).json({
        success: false,
        message: "Team registration not found",
      })
    }

    teamRegistration.status = "rejected"
    if (req.body.notes) teamRegistration.notes = req.body.notes

    await teamRegistration.save()

    res.json({
      success: true,
      message: "Team registration rejected",
      teamRegistration,
    })
  } catch (error) {
    console.error("Error rejecting team registration:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// ==================== AUTH ROUTES ====================

// @route   POST api/auth/admin/signup
// @desc    Register an admin user
// @access  Public
app.post("/api/auth/admin/signup", validateAdminSignup, async (req, res) => {
  const { username, email, password } = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] })
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      })
    }

    // Create new admin user
    user = new User({
      username,
      email,
      password,
      type: "admin",
      uid: `admin-${Date.now()}`,
    })

    await user.save()

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        type: user.type,
      },
    }

    jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          type: user.type,
        },
      })
    })
  } catch (error) {
    console.error("Error in admin signup:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   POST api/auth/admin/login
// @desc    Login admin user
// @access  Public
app.post("/api/auth/admin/login", validateLogin, async (req, res) => {
  const { username, password } = req.body

  try {
    // Find user by username
    const user = await User.findOne({ username })
    if (!user || user.type !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        type: user.type,
      },
    }

    jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          type: user.type,
        },
      })
    })
  } catch (error) {
    console.error("Error in admin login:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   POST api/auth/department/login
// @desc    Login department user
// @access  Public
app.post("/api/auth/department/login", validateLogin, async (req, res) => {
  const { username, password } = req.body

  try {
    // Find user by username
    const user = await User.findOne({ username })
    if (!user || user.type !== "department") {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        type: user.type,
        department: user.department,
      },
    }

    jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          type: user.type,
          department: user.department,
        },
      })
    })
  } catch (error) {
    console.error("Error in department login:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// ==================== EVENT ROUTES ====================

// @route   POST api/events
// @desc    Create a new event
// @access  Private
app.post("/api/events", auth, validateEventCreation, async (req, res) => {
  try {
    const { department, name, club, startDate, endDate, startTime, endTime, venue, description, expenses } = req.body

    // Log the token for debugging
    console.log("[DEBUG] Token received for event creation:", req.header("x-auth-token"))

    // Validate required fields
    if (!name || !club || !startDate || !endDate || !startTime || !endTime || !venue) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please provide all necessary details.",
      })
    }

    // Validate date and time
    const start = new Date(`${startDate}T${startTime}`)
    const end = new Date(`${endDate}T${endTime}`)
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "Invalid date or time. Start date/time must be before end date/time.",
      })
    }

    // Create new event
    const newEvent = new Event({
      department: department || "General", // Default to "General" if no department is provided
      name,
      club,
      startDate,
      endDate,
      startTime,
      endTime,
      venue,
      description: description || "No description provided.", // Default description
      expenses: expenses || [], // Default to an empty array
      createdBy: req.user.id,
    })

    // Save event to the database
    const event = await newEvent.save()

    // Respond with success
    res.json({
      success: true,
      message: "Event created successfully.",
      event,
    })
  } catch (error) {
    console.error("[ERROR] Error creating event:", error)
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    })
  }
})

// @route   GET api/events
// @desc    Get all events
// @access  Private
app.get("/api/events", async (req, res) => {
  try {
    let events

    // Check if there's a token
    const token = req.header("x-auth-token")

    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET)
        const user = decoded.user

        // If user type is missing
        if (!user.type) {
          return res.status(403).json({
            success: false,
            message: "User type is not defined",
          })
        }

        // If user is admin, get all events
        if (user.type === "admin") {
          events = await Event.find().sort({ startDate: 1 })
        }
        // If user is department, get only their events
        else if (user.type === "department") {
          events = await Event.find({ department: user.department }).sort({ startDate: 1 })
        }
      } catch (error) {
        console.error("Error verifying token:", error)
        // If token verification fails, return all events
        events = await Event.find().sort({ startDate: 1 })
      }
    } else {
      // No token, return all events
      events = await Event.find().sort({ startDate: 1 })
    }

    res.json({
      success: true,
      events,
    })
  } catch (error) {
    console.error("Error fetching events:", error.message || error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// Fetch all club events
app.get("/api/club-events", async (req, res) => {
  try {
    const { clubId } = req.query;
    
    let query = {};
    if (clubId) {
      query.clubId = clubId;
    }
    
    const events = await ClubEvent.find(query);
    
    res.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("❌ Error fetching club events:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error" 
    });
  }
});

// @route   GET api/club-events/:id
// @desc    Get club event by ID
// @access  Public
app.get("/api/club-events/:id", async (req, res) => {
  try {
    console.log("🔍 Fetching event with ID:", req.params.id);
    const event = await ClubEvent.findById(req.params.id) // Fetch event by ID
    
    if (!event) {
      console.log("❌ Event not found with ID:", req.params.id);
      return res.status(404).json({ success: false, message: "Event not found" })
    }

    // Log the event data for debugging
    console.log("✅ Event found:", event.name);

    // Ensure all necessary fields are included in the response with proper structure
    res.json({
      success: true,
      event: {
        ...event.toObject(),
        prizes: event.prizes || {
          pool: 0,
          first: { amount: 0, description: "" },
          second: { amount: 0, description: "" },
          third: { amount: 0, description: "" },
          special: [],
          perks: [],
        },
        schedule: event.schedule || [],
        faqs: event.faqs || [],
        startTime: event.startTime || "9:00 AM",
        endTime: event.endTime || "6:00 PM",
        poster: event.poster || null,
        teamMin: event.teamMin || 1,
        teamMax: event.teamMax || 4,
        dutyLeave: event.dutyLeave || { available: false, days: 0 },
        organizer: event.organizer || event.club || "Event Organizer",
        organizerLogo: event.organizerLogo || null,
        eligibilityCriteria: event.eligibilityCriteria || [],
        registrationCount: event.registrationCount || 0,
        registrationDeadline: event.registrationDeadline || "Open",
      },
    })
  } catch (error) {
    console.error("Error fetching club event:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Private
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Check if there's a token
    const token = req.header("x-auth-token")

    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET)
        const user = decoded.user

        // Check if user has permission to view this event
        if (user.type !== "admin" && event.department !== user.department) {
          return res.status(403).json({
            success: false,
            message: "Not authorized to view this event",
          })
        }
      } catch (error) {
        // Token verification failed, continue without checking permissions
      }
    }

    res.json({
      success: true,
      event,
    })
  } catch (error) {
    console.error("Error fetching event:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private
app.put("/api/events/:id", auth, validateEventUpdate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Check if user has permission to update this event
    if (req.user.type !== "admin" && event.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this event",
      })
    }

    // Update event fields
    const { department, name, club, startDate, endDate, startTime, endTime, venue, description, expenses } = req.body

    if (department) event.department = department
    if (name) event.name = name
    if (club) event.club = club
    if (startDate) event.startDate = startDate
    if (endDate) event.endDate = endDate
    if (startTime) event.startTime = startTime
    if (endTime) event.endTime = endTime
    if (venue) event.venue = venue
    if (description) event.description = description
    if (expenses) event.expenses = expenses

    // If department user is updating, set status back to pending
    if (req.user.type === "department") {
      event.status = "pending"
    }

    // Save updated event
    const updatedEvent = await event.save()

    res.json({
      success: true,
      event: updatedEvent,
    })
  } catch (error) {
    console.error("Error updating event:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private
app.delete("/api/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Check if user has permission to delete this event
    if (req.user.type !== "admin" && event.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event",
      })
    }

    await Event.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Event removed",
    })
  } catch (error) {
    console.error("Error deleting event:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   GET api/events/department/:department
// @desc    Get events by department
// @access  Private (Admin only)
app.get("/api/events/department/:department", adminAuth, async (req, res) => {
  try {
    const events = await Event.find({ department: req.params.department }).sort({ startDate: 1 })

    res.json({
      success: true,
      events,
    })
  } catch (error) {
    console.error("Error fetching department events:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   PUT api/events/:id/approve
// @desc    Approve an event
// @access  Private (Admin only)
app.put("/api/events/:id/approve", adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    event.status = "approved"
    await event.save()

    res.json({
      success: true,
      event,
    })
  } catch (error) {
    console.error("Error approving event:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   PUT api/events/:id/reject
// @desc    Reject an event
// @access  Private (Admin only)
app.put("/api/events/:id/reject", adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    event.status = "rejected"
    await event.save()

    res.json({
      success: true,
      event,
    })
  } catch (error) {
    console.error("Error rejecting event:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// ==================== CLUB EVENTS ROUTES ====================

// @route   POST api/club-events
// @desc    Create a new club event
// @access  Public
app.post("/api/club-events", upload.single("poster"), async (req, res) => {
  try {
    const token = req.header("x-auth-token")
    console.log("Token received:", token)

    const { clubId, name, description, startDate, endDate, startTime, endTime, venue } = req.body

    // Validation
    if (!clubId || !name || !description || !startDate || !endDate || !startTime || !endTime || !venue) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      })
    }

    // Collect event data
    const eventData = { ...req.body }

    // Parse JSON strings if they exist
    if (eventData.prizes && typeof eventData.prizes === "string") {
      eventData.prizes = JSON.parse(eventData.prizes)
    }
    if (eventData.schedule && typeof eventData.schedule === "string") {
      eventData.schedule = JSON.parse(eventData.schedule)
    }
    if (eventData.sponsors && typeof eventData.sponsors === "string") {
      eventData.sponsors = JSON.parse(eventData.sponsors)
    }
    if (eventData.faqs && typeof eventData.faqs === "string") {
      eventData.faqs = JSON.parse(eventData.faqs)
    }
    if (eventData.dutyLeave && typeof eventData.dutyLeave === "string") {
      eventData.dutyLeave = JSON.parse(eventData.dutyLeave)
    }
    if (eventData.expectItems && typeof eventData.expectItems === "string") {
      eventData.expectItems = JSON.parse(eventData.expectItems)
    }
    if (eventData.eligibilityCriteria && typeof eventData.eligibilityCriteria === "string") {
      eventData.eligibilityCriteria = JSON.parse(eventData.eligibilityCriteria)
    }
    if (eventData.expenses && typeof eventData.expenses === "string") {
      eventData.expenses = JSON.parse(eventData.expenses)
    }

    // ✅ Handle poster upload
    if (req.file) {
      try {
        // The file is already uploaded to Cloudinary by the multer-storage-cloudinary middleware
        eventData.poster = req.file.path || req.file.secure_url
        console.log("✅ Poster uploaded to Cloudinary:", eventData.poster)
      } catch (uploadError) {
        console.error("❌ Error handling poster upload:", uploadError)
      }
    }

    // ✅ Save event to MongoDB
    const newEvent = new ClubEvent(eventData)
    const saved = await newEvent.save()

    res.json({
      success: true,
      message: "Event created successfully",
      event: saved,
    })
  } catch (err) {
    console.error("❌ Server Error in /api/club-events:", err)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    })
  }
})

// @route   PUT api/club-events/:id
// @desc    Update a club event
// @access  Public
app.put("/api/club-events/:id", upload.single("poster"), async (req, res) => {
  try {
    // Get the existing event
    const existingEvent = await ClubEvent.findById(req.params.id)

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Create update data from request body
    const updateData = { ...req.body }

    // Parse JSON strings if they exist
    if (updateData.prizes && typeof updateData.prizes === "string") {
      updateData.prizes = JSON.parse(updateData.prizes)
    }
    if (updateData.schedule && typeof updateData.schedule === "string") {
      updateData.schedule = JSON.parse(updateData.schedule)
    }
    if (updateData.sponsors && typeof updateData.sponsors === "string") {
      updateData.sponsors = JSON.parse(updateData.sponsors)
    }
    if (updateData.faqs && typeof updateData.faqs === "string") {
      updateData.faqs = JSON.parse(updateData.faqs)
    }
    if (updateData.dutyLeave && typeof updateData.dutyLeave === "string") {
      updateData.dutyLeave = JSON.parse(updateData.dutyLeave)
    }
    if (updateData.expectItems && typeof updateData.expectItems === "string") {
      updateData.expectItems = JSON.parse(updateData.expectItems)
    }
    if (updateData.eligibilityCriteria && typeof updateData.eligibilityCriteria === "string") {
      updateData.eligibilityCriteria = JSON.parse(updateData.eligibilityCriteria)
    }
    if (updateData.expenses && typeof updateData.expenses === "string") {
      updateData.expenses = JSON.parse(updateData.expenses)
    }

    // Handle poster upload if provided
    if (req.file) {
      // The file is already uploaded to Cloudinary by the multer-storage-cloudinary middleware
      updateData.poster = req.file.path || req.file.secure_url
      console.log("✅ Updated poster uploaded to Cloudinary:", updateData.poster)
    }

    // Find and update the event
    const updatedEvent = await ClubEvent.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true })

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    res.json({
      success: true,
      event: updatedEvent,
    })
  } catch (error) {
    console.error("Error updating club event:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   DELETE api/club-events/:id
// @desc    Delete a club event
// @access  Public
app.delete("/api/club-events/:id", async (req, res) => {
  try {
    const deletedEvent = await ClubEvent.findByIdAndDelete(req.params.id)

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    res.json({
      success: true,
      message: "Event deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting club event:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// ==================== TEAM REGISTRATION ROUTES ====================

// @route   POST api/team-registrations
// @desc    Register a team for an event
// @access  Public
app.post("/api/team-registrations", validateTeamRegistration, async (req, res) => {
  try {
    // Create new team registration
    const newTeamRegistration = new TeamRegistration(req.body)

    // Save team registration
    const teamRegistration = await newTeamRegistration.save()

    // Update event registration count
    const event = await ClubEvent.findById(req.body.eventId)
    if (event) {
      event.registrationCount = (event.registrationCount || 0) + 1
      await event.save()
    }

    res.json({
      success: true,
      message: "Team registered successfully",
      teamRegistration,
    })
  } catch (error) {
    console.error("Error registering team:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// @route   GET api/team-registrations
// @desc    Get all team registrations
// @access  Public
app.get("/api/team-registrations", async (req, res) => {
  try {
    // Get query parameters
    const { eventId, status } = req.query

    // Build query
    const query = {}
    if (eventId) query.eventId = eventId
    if (status) query.status = status

    // Get team registrations
    const teamRegistrations = await TeamRegistration.find(query).sort({ registeredAt: -1 })

    res.json({
      success: true,
      teamRegistrations,
    })
  } catch (error) {
    console.error("Error fetching team registrations:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   GET api/team-registrations/:id
// @desc    Get team registration by ID
// @access  Public
app.get("/api/team-registrations/:id", async (req, res) => {
  try {
    const teamRegistration = await TeamRegistration.findById(req.params.id)

    if (!teamRegistration) {
      return res.status(404).json({
        success: false,
        message: "Team registration not found",
      })
    }

    res.json({
      success: true,
      teamRegistration,
    })
  } catch (error) {
    console.error("Error fetching team registration:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// ==================== ADDITIONAL ROUTES ====================

app.get("/api/events/club/:clubId", async (req, res) => {
  try {
    const { clubId } = req.params
    const events = await ClubEvent.find({ clubId })
    res.json({ success: true, events })
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" })
  }
})

app.get("/api/approved-teams", async (req, res) => {
  try {
    const { eventId } = req.query
    const query = eventId ? { eventId } : {}

    const teams = await ApprovedTeam.find(query)

    res.json({
      success: true,
      teams,
    })
  } catch (error) {
    console.error("Error fetching approved teams:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// ==================== REPORT GENERATION ROUTES ====================


// On your server, add a simple test endpoint
app.post("/api/test-report", (req, res) => {
  console.log("Test report endpoint hit");
  res.json({ success: true, message: "Test endpoint working" });
});

// Then test from your client
const testResponse = await fetch("https://expensetracker-qppb.onrender.com/api/test-report", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ test: "data" })
});



app.post("/api/test-upload", reportUpload.single("file"), (req, res) => {
  console.log("Test upload received");
  console.log("File:", req.file ? req.file.filename : "No file");
  console.log("Body:", req.body);
  
  res.json({
    success: true,
    message: "Test upload successful",
    file: req.file ? req.file.filename : null,
    body: req.body
  });
});


// Add this to your server.js file - this is the complete implementation for the report generation endpoint

// Route to generate report from template - IMPROVED VERSION
// Route to generate report from template - IMPROVED VERSION
app.post("/api/generate-report", reportUpload.single("template"), async (req, res) => {
  console.log("📄 Report generation request received");
  
  // Log request information
  console.log("📄 Request body:", req.body);
  console.log("📄 Request file:", req.file ? {
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype
  } : "No file received");

  try {
    // Validate request
    if (!req.file) {
      console.error("📄 No template file uploaded");
      return res.status(400).json({ 
        success: false, 
        message: "No template file uploaded. Please provide a DOCX template file." 
      });
    }

    const { eventId, eventDetails } = req.body;

    if (!eventId) {
      console.error("📄 No eventId provided");
      return res.status(400).json({ 
        success: false, 
        message: "No eventId provided. Please specify an event ID." 
      });
    }

    if (!eventDetails) {
      console.error("📄 No eventDetails provided");
      return res.status(400).json({ 
        success: false, 
        message: "No eventDetails provided. Please provide event data for the report." 
      });
    }

    console.log("📄 Event ID:", eventId);

    // Parse event details with error handling
    let data;
    try {
      console.log("📄 Event details:", eventDetails);
      data = JSON.parse(eventDetails);
      console.log("📄 Parsed event details:", data);
    } catch (parseError) {
      console.error("📄 Failed to parse event details:", parseError);
      return res.status(400).json({ 
        success: false, 
        message: "eventDetails is not valid JSON. Please provide properly formatted JSON data." 
      });
    }

    // Verify the event exists in the database
    try {
      const event = await ClubEvent.findById(eventId);
      if (!event) {
        console.error(`📄 Event not found in database. ID: ${eventId}`);
        // Continue anyway since we have the data from the client
        console.log("📄 Continuing with client-provided data");
      } else {
        console.log(`📄 Event found in database: ${event.name}`);
        
        // Enhance data with additional database information
        data = {
          ...data,
          // Add any missing fields from the database that might be useful
          dbEventName: event.name,
          dbEventDate: `${event.startDate} - ${event.endDate}`,
          // Add more fields as needed
        };
      }
    } catch (dbError) {
      console.error("📄 Database error when verifying event:", dbError);
      // Continue anyway with client data
      console.log("📄 Continuing with client-provided data despite database error");
    }

    // Verify template file exists and is accessible
    const templatePath = req.file.path;
    console.log(`📄 Template file path: ${templatePath}`);
    
    if (!fs.existsSync(templatePath)) {
      console.error(`📄 Template file not found at path: ${templatePath}`);
      return res.status(500).json({ 
        success: false, 
        message: "Template file not found on server. Upload may have failed." 
      });
    }
    
    // Check file size
    const stats = fs.statSync(templatePath);
    console.log(`📄 Template file size: ${stats.size} bytes`);
    
    if (stats.size === 0) {
      console.error("📄 Template file is empty (0 bytes)");
      return res.status(400).json({ 
        success: false, 
        message: "Template file is empty. Please upload a valid DOCX template." 
      });
    }
    
    // Read the template file with error handling
    let content;
    try {
      content = fs.readFileSync(templatePath, "binary");
      console.log(`📄 Successfully read template file (${content.length} bytes)`);
    } catch (readError) {
      console.error("📄 Error reading template file:", readError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to read template file: " + readError.message 
      });
    }
    
    // Create PizZip instance with error handling
    let zip;
    try {
      zip = new PizZip(content);
      console.log("📄 Successfully created PizZip instance");
    } catch (zipError) {
      console.error("📄 Error creating PizZip instance:", zipError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to process template file. The file may be corrupted or not a valid DOCX file." 
      });
    }
    
    // Extract template variables for debugging
    try {
      const text = zip.file("word/document.xml").asText();
      const regex = /\{([^{}]+)\}/g;
      const templateVars = [];
      let match;
      while ((match = regex.exec(text)) !== null) {
        templateVars.push(match[1]);
      }
      
      console.log("📄 Template variables found:", templateVars);
      console.log("📄 Data keys provided:", Object.keys(data));
      
      // Check for missing variables (excluding loop variables)
      const missingVars = templateVars.filter(v => 
        !(v in data) && 
        !v.startsWith('#') && 
        !v.startsWith('/') &&
        !v.includes('.')  // Skip nested properties
      );
      
      if (missingVars.length > 0) {
        console.warn("📄 Warning: Template contains variables that are not in the data:", missingVars);
        
        // Add default values for missing variables to prevent undefined
        missingVars.forEach(varName => {
          console.log(`📄 Adding default value for missing variable: ${varName}`);
          data[varName] = `[No data for ${varName}]`;
        });
      }
    } catch (err) {
      console.error("📄 Error extracting template variables:", err);
      // Continue anyway, this is just for debugging
    }
    
    // Create docxtemplater instance with error handling
    let doc;
    try {
      doc = new docxtemplater(zip, { 
        paragraphLoop: true, 
        linebreaks: true,
        nullGetter: function() {
          return ""; // Return empty string for null/undefined values
        }
      });
      console.log("📄 Successfully created docxtemplater instance");
    } catch (docError) {
      console.error("📄 Error creating docxtemplater instance:", docError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to initialize document templating engine: " + docError.message 
      });
    }

    // Ensure all data values are properly formatted
    for (const key in data) {
      // Convert undefined or null values to empty strings
      if (data[key] === undefined || data[key] === null) {
        console.log(`📄 Converting undefined/null value for ${key} to empty string`);
        data[key] = "";
      }
      
      // Handle nested objects that might be stringified
      if (typeof data[key] === 'object' && data[key] !== null) {
        console.log(`📄 Found object value for ${key}, ensuring it's properly formatted`);
        // No need to do anything, docxtemplater handles objects
      }
    }

    console.log("📄 Final data for template:", JSON.stringify(data, null, 2));

    // Set the data for template rendering
    try {
      doc.setData(data);
      console.log("📄 Successfully set template data");
    } catch (dataError) {
      console.error("📄 Error setting template data:", dataError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to set template data: " + dataError.message 
      });
    }

    // Render the document (replace all variables with their values)
    try {
      doc.render();
      console.log("📄 Template rendered successfully");
    } catch (renderError) {
      console.error("📄 Template rendering error:", renderError);
      
      // Get more detailed error information
      let errorMessage = "Template rendering failed";
      if (renderError.properties && renderError.properties.errors) {
        errorMessage += ": " + JSON.stringify(renderError.properties.errors);
      } else {
        errorMessage += ": " + renderError.message;
      }
      
      // Log detailed error information for debugging
      if (renderError.properties && renderError.properties.explanation) {
        console.error("📄 Error explanation:", renderError.properties.explanation);
      }
      
      return res.status(500).json({ 
        success: false, 
        message: errorMessage
      });
    }

    // Generate buffer with error handling
    let buffer;
    try {
      buffer = doc.getZip().generate({ type: "nodebuffer" });
      console.log(`📄 Successfully generated document buffer (${buffer.length} bytes)`);
    } catch (bufferError) {
      console.error("📄 Error generating document buffer:", bufferError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to generate document: " + bufferError.message 
      });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log(`📄 Created uploads directory: ${uploadsDir}`);
      } catch (mkdirError) {
        console.error("📄 Error creating uploads directory:", mkdirError);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to create uploads directory: " + mkdirError.message 
        });
      }
    }

    // Create output path and write file with error handling
    const outputFileName = `report_${eventId}_${Date.now()}.docx`;
    const outputPath = path.join(uploadsDir, outputFileName);
    
    try {
      fs.writeFileSync(outputPath, buffer);
      console.log(`📄 Report saved to: ${outputPath}`);
    } catch (writeError) {
      console.error("📄 Error writing output file:", writeError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to save generated report: " + writeError.message 
      });
    }

    // Verify the output file exists and has content
    if (!fs.existsSync(outputPath)) {
      console.error(`📄 Output file not found after writing: ${outputPath}`);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to save report file. File not found after writing." 
      });
    }
    
    const outputStats = fs.statSync(outputPath);
    if (outputStats.size === 0) {
      console.error(`📄 Output file is empty: ${outputPath}`);
      return res.status(500).json({ 
        success: false, 
        message: "Generated report file is empty. Template processing may have failed." 
      });
    }
    
    console.log(`📄 Output file size: ${outputStats.size} bytes`);

    // Return success response with download URL
    const downloadUrl = `/uploads/${outputFileName}`;
    res.status(200).json({
      success: true,
      message: "Report generated successfully",
      downloadUrl: downloadUrl,
      fileName: outputFileName,
      fileSize: outputStats.size
    });
    
    console.log(`📄 Report generation completed successfully. Download URL: ${downloadUrl}`);
    
    // Clean up the template file after successful processing
    try {
      fs.unlinkSync(templatePath);
      console.log(`📄 Cleaned up template file: ${templatePath}`);
    } catch (cleanupError) {
      console.error(`📄 Warning: Failed to clean up template file: ${cleanupError.message}`);
      // Non-critical error, don't fail the request
    }
    
  } catch (error) {
    // Catch-all for any unhandled errors
    console.error("📄 Unhandled error in report generation:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate report due to an unexpected error: " + error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Add a preview endpoint if you don't already have one
app.get("/api/preview-report/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "uploads", filename);
    
    console.log("📄 Preview request for file:", filename);
    console.log("📄 Looking for file at path:", filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error("📄 File not found at path:", filePath);
      return res.status(404).json({ success: false, message: "Report file not found" });
    }
    
    console.log("📄 File found, generating preview");
    
    // Read the DOCX file
    const content = fs.readFileSync(filePath);
    
    // Convert DOCX to HTML using mammoth
    const mammoth = require('mammoth');
    const result = await mammoth.convertToHtml({ buffer: content });
    const html = result.value;
    
    // Return the HTML for preview
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Preview</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1, h2, h3 { margin-top: 1.5rem; margin-bottom: 1rem; }
          p { margin-bottom: 1rem; }
          table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
          table, th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; text-align: left; }
          .preview-container { max-width: 800px; margin: 0 auto; }
          .preview-header { background: #f8f9fa; padding: 15px; margin-bottom: 20px; border-bottom: 1px solid #ddd; }
          .download-btn { display: inline-block; padding: 10px 15px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="preview-header">
          <h2>Report Preview</h2>
          <a href="/uploads/${filename}" download class="download-btn">Download DOCX</a>
        </div>
        <div class="preview-container">
          ${html}
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("📄 Error generating preview:", error);
    res.status(500).json({ success: false, message: "Failed to generate preview: " + error.message });
  }
});


// Add this new endpoint for editable report preview
// Add this new endpoint for editable report preview
app.get("/api/edit-report/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "uploads", filename);
    
    console.log("📄 Edit report request for file:", filename);
    console.log("📄 Looking for file at path:", filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error("📄 File not found at path:", filePath);
      return res.status(404).json({ success: false, message: "Report file not found" });
    }
    
    console.log("📄 File found, generating editable preview");
    
    // Read the DOCX file
    const content = fs.readFileSync(filePath);
    
    // Convert DOCX to HTML using mammoth
    const mammoth = require('mammoth');
    const result = await mammoth.convertToHtml({ buffer: content });
    const html = result.value;
    
    // Get the original filename without the timestamp
    const originalFilename = filename.replace(/^report_[^_]+_\d+/, "report");
    
    // Return the HTML with an editable interface
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Preview</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- Include TinyMCE -->
        <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
        
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            padding: 0; 
            margin: 0;
            background-color: #f5f5f5;
          }
          .editor-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            min-height: 100vh;
          }
          .toolbar {
            background: #2c3e50;
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .toolbar h2 {
            margin: 0;
            font-size: 1.2rem;
          }
          .btn {
            display: inline-block;
            padding: 8px 15px;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
          }
          .btn:hover {
            background: #2980b9;
          }
          .btn-group {
            display: flex;
            gap: 10px;
          }
          .editor-content {
            padding: 20px;
            min-height: calc(100vh - 130px);
          }
          #image-upload {
            display: none;
          }
          .status-message {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #2ecc71;
            color: white;
            border-radius: 4px;
            display: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          }
          .tabs {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #ddd;
          }
          .tab {
            padding: 10px 20px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
          }
          .tab.active {
            border-bottom: 2px solid #3498db;
            font-weight: bold;
          }
          .tab-content {
            display: none;
          }
          .tab-content.active {
            display: block;
          }
          .preview-content {
            padding: 20px;
            min-height: calc(100vh - 130px);
          }
        </style>
      </head>
      <body>
        <div class="editor-container">
          <div class="toolbar">
            <h2>Report Preview: ${originalFilename}</h2>
            <div class="btn-group">
              <button id="download-original-btn" class="btn">Download Original</button>
              <button id="download-edited-btn" class="btn">Download Edited</button>
              <button id="download-pdf-btn" class="btn">Download as PDF</button>
              <label for="image-upload" class="btn">Add Image</label>
              <input type="file" id="image-upload" accept="image/*">
            </div>
          </div>
          
          <div class="tabs">
            <div class="tab active" data-tab="preview">Preview</div>
            <div class="tab" data-tab="edit">Edit</div>
          </div>
          
          <div id="preview-tab" class="tab-content active">
            <div class="preview-content">
              ${html}
            </div>
          </div>
          
          <div id="edit-tab" class="tab-content">
            <div class="editor-content">
              <textarea id="editor">${html}</textarea>
            </div>
          </div>
        </div>
        
        <div id="status-message" class="status-message">Changes saved!</div>
        
        <script>
          // Initialize TinyMCE
          tinymce.init({
            selector: '#editor',
            plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
            menubar: 'file edit view insert format tools table help',
            toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
            toolbar_sticky: true,
            autosave_ask_before_unload: true,
            autosave_interval: '30s',
            autosave_prefix: '{path}{query}-{id}-',
            autosave_restore_when_empty: false,
            autosave_retention: '2m',
            image_advtab: true,
            height: 600,
            image_caption: true,
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
            noneditable_class: 'mceNonEditable',
            toolbar_mode: 'sliding',
            contextmenu: 'link image table',
            skin: 'oxide',
            content_css: 'default',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
            images_upload_handler: function (blobInfo, progress) {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function() {
                  resolve(reader.result);
                };
                reader.onerror = function() {
                  reject('Failed to read file');
                };
                reader.readAsDataURL(blobInfo.blob());
              });
            }
          });
          
          // Tab switching
          document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
              // Remove active class from all tabs
              document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
              document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
              
              // Add active class to clicked tab
              this.classList.add('active');
              
              // Show corresponding tab content
              const tabName = this.getAttribute('data-tab');
              document.getElementById(tabName + '-tab').classList.add('active');
              
              // If switching to edit tab, make sure TinyMCE is initialized
              if (tabName === 'edit') {
                tinymce.activeEditor.focus();
              }
            });
          });
          
          // Handle image upload button
          document.getElementById('image-upload').addEventListener('change', function(e) {
            // First switch to edit tab
            document.querySelector('.tab[data-tab="edit"]').click();
            
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              const reader = new FileReader();
              
              reader.onload = function(e) {
                tinymce.activeEditor.execCommand('mceInsertContent', false, '<img src="' + e.target.result + '" alt="Uploaded Image" />');
              };
              
              reader.readAsDataURL(file);
            }
          });
          
          // Handle download original button
          document.getElementById('download-original-btn').addEventListener('click', function() {
            const a = document.createElement('a');
            a.href = '/uploads/${filename}';
            a.download = '${originalFilename}.docx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          });
          
          // Handle download edited button
          document.getElementById('download-edited-btn').addEventListener('click', function() {
            const content = tinymce.activeEditor.getContent();
            
            // Send content to server to convert to DOCX and download
            fetch('/api/convert-to-docx/${filename}', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ content: content }),
            })
            .then(response => response.blob())
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = '${originalFilename}_edited.docx';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            })
            .catch(error => {
              console.error('Error downloading DOCX:', error);
              alert('Error downloading DOCX. Please try again.');
            });
          });
          
          // Handle PDF download button
          document.getElementById('download-pdf-btn').addEventListener('click', function() {
            // Get content from either preview or editor depending on active tab
            let content;
            if (document.getElementById('edit-tab').classList.contains('active')) {
              content = tinymce.activeEditor.getContent();
            } else {
              content = document.querySelector('.preview-content').innerHTML;
            }
            
            // Send content to server to convert to PDF and download
            fetch('/api/convert-to-pdf/${filename}', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ content: content }),
            })
            .then(response => response.blob())
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = '${originalFilename}.pdf';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            })
            .catch(error => {
              console.error('Error downloading PDF:', error);
              alert('Error downloading PDF. Please try again.');
            });
          });
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("📄 Error generating editable preview:", error);
    res.status(500).json({ success: false, message: "Failed to generate editable preview: " + error.message });
  }
});

// Add endpoint to convert HTML to DOCX and download
app.post("/api/convert-to-docx/:filename", async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, message: "No content provided" });
    }
    
    // Convert HTML to DOCX
    const HTMLtoDOCX = require('html-to-docx');
    const docxBuffer = await HTMLtoDOCX(content, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename}`);
    
    // Send the file
    res.send(docxBuffer);
  } catch (error) {
    console.error("📄 Error converting to DOCX:", error);
    res.status(500).json({ success: false, message: "Failed to convert to DOCX: " + error.message });
  }
});

// Add endpoint to convert HTML to PDF and download
app.post("/api/convert-to-pdf/:filename", async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, message: "No content provided" });
    }
    
    // Convert HTML to PDF using puppeteer
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set content with proper styling
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1, h2, h3 { margin-top: 1.5rem; margin-bottom: 1rem; }
          p { margin-bottom: 1rem; }
          table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
          table, th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; text-align: left; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `);
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });
    
    await browser.close();
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename.replace('.docx', '.pdf')}`);
    
    // Send the file
    res.send(pdfBuffer);
  } catch (error) {
    console.error("📄 Error converting to PDF:", error);
    res.status(500).json({ success: false, message: "Failed to convert to PDF: " + error.message });
  }
});



// Simple test endpoint to verify server is working
app.post("/api/test-report", (req, res) => {
  console.log("Test report endpoint hit");
  console.log("Request body:", req.body);
  res.json({ success: true, message: "Test endpoint working", received: req.body });
});

// Add a preview endpoint
app.get("/api/preview-report/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "uploads", filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Report file not found" });
    }
    
    // Read the DOCX file
    const content = fs.readFileSync(filePath);
    
    // Convert DOCX to HTML using mammoth
    const result = await mammoth.convertToHtml({ buffer: content });
    const html = result.value;
    
    // Return the HTML for preview
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Preview</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1, h2, h3 { margin-top: 1.5rem; margin-bottom: 1rem; }
          p { margin-bottom: 1rem; }
          table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
          table, th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; text-align: left; }
          .preview-container { max-width: 800px; margin: 0 auto; }
          .preview-header { background: #f8f9fa; padding: 15px; margin-bottom: 20px; border-bottom: 1px solid #ddd; }
          .download-btn { display: inline-block; padding: 10px 15px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="preview-header">
          <h2>Report Preview</h2>
          <a href="/uploads/${filename}" download class="download-btn">Download DOCX</a>
        </div>
        <div class="preview-container">
          ${html}
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("📄 Error generating preview:", error);
    res.status(500).json({ success: false, message: "Failed to generate preview" });
  }
});

// Simple test endpoint to verify server is working
app.post("/api/test-report", (req, res) => {
  console.log("Test report endpoint hit");
  res.json({ success: true, message: "Test endpoint working" });
});

// Test upload endpoint to verify file uploads are working
app.post("/api/test-upload", reportUpload.single("file"), (req, res) => {
  console.log("Test upload received");
  console.log("File:", req.file ? req.file.filename : "No file");
  console.log("Body:", req.body);
  
  res.json({
    success: true,
    message: "Test upload successful",
    file: req.file ? req.file.filename : null,
    body: req.body
  });
});



// Add this preview endpoint to your server.js file
app.get("/api/preview-report/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "uploads", filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Report file not found" });
    }
    
    // Read the DOCX file
    const content = fs.readFileSync(filePath);
    
    // Convert DOCX to HTML using mammoth
    const mammoth = require('mammoth');
    const result = await mammoth.convertToHtml({ buffer: content });
    const html = result.value;
    
    // Return the HTML for preview
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Preview</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1, h2, h3 { margin-top: 1.5rem; margin-bottom: 1rem; }
          p { margin-bottom: 1rem; }
          table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
          table, th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; text-align: left; }
          .preview-container { max-width: 800px; margin: 0 auto; }
          .preview-header { background: #f8f9fa; padding: 15px; margin-bottom: 20px; border-bottom: 1px solid #ddd; }
          .download-btn { display: inline-block; padding: 10px 15px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="preview-header">
          <h2>Report Preview</h2>
          <a href="/uploads/${filename}" download class="download-btn">Download DOCX</a>
        </div>
        <div class="preview-container">
          ${html}
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("📄 Error generating preview:", error);
    res.status(500).json({ success: false, message: "Failed to generate preview: " + error.message });
  }
});


// Add this new endpoint for editable report preview
app.get("/api/edit-report/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "uploads", filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Report file not found" });
    }
    
    // Read the DOCX file
    const content = fs.readFileSync(filePath);
    
    // Convert DOCX to HTML using mammoth
    const mammoth = require('mammoth');
    const result = await mammoth.convertToHtml({ buffer: content });
    const html = result.value;
    
    // Get the original filename without the timestamp
    const originalFilename = filename.replace(/^report_[^_]+_\d+/, "report");
    
    // Return the HTML with an editable interface
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Preview</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- Include TinyMCE -->
        <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
        
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            padding: 0; 
            margin: 0;
            background-color: #f5f5f5;
          }
          .editor-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            min-height: 100vh;
          }
          .toolbar {
            background: #2c3e50;
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .toolbar h2 {
            margin: 0;
            font-size: 1.2rem;
          }
          .btn {
            display: inline-block;
            padding: 8px 15px;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
          }
          .btn:hover {
            background: #2980b9;
          }
          .btn-group {
            display: flex;
            gap: 10px;
          }
          .editor-content {
            padding: 20px;
            min-height: calc(100vh - 130px);
          }
          #image-upload {
            display: none;
          }
          .status-message {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #2ecc71;
            color: white;
            border-radius: 4px;
            display: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          }
          .tabs {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #ddd;
          }
          .tab {
            padding: 10px 20px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
          }
          .tab.active {
            border-bottom: 2px solid #3498db;
            font-weight: bold;
          }
          .tab-content {
            display: none;
          }
          .tab-content.active {
            display: block;
          }
          .preview-content {
            padding: 20px;
            min-height: calc(100vh - 130px);
          }
        </style>
      </head>
      <body>
        <div class="editor-container">
          <div class="toolbar">
            <h2>Report Preview: ${originalFilename}</h2>
            <div class="btn-group">
              <button id="download-original-btn" class="btn">Download Original</button>
              <button id="download-edited-btn" class="btn">Download Edited</button>
              <button id="download-pdf-btn" class="btn">Download as PDF</button>
              <label for="image-upload" class="btn">Add Image</label>
              <input type="file" id="image-upload" accept="image/*">
            </div>
          </div>
          
          <div class="tabs">
            <div class="tab active" data-tab="preview">Preview</div>
            <div class="tab" data-tab="edit">Edit</div>
          </div>
          
          <div id="preview-tab" class="tab-content active">
            <div class="preview-content">
              ${html}
            </div>
          </div>
          
          <div id="edit-tab" class="tab-content">
            <div class="editor-content">
              <textarea id="editor">${html}</textarea>
            </div>
          </div>
        </div>
        
        <div id="status-message" class="status-message">Changes saved!</div>
        
        <script>
          // Initialize TinyMCE
          tinymce.init({
            selector: '#editor',
            plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
            menubar: 'file edit view insert format tools table help',
            toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
            toolbar_sticky: true,
            autosave_ask_before_unload: true,
            autosave_interval: '30s',
            autosave_prefix: '{path}{query}-{id}-',
            autosave_restore_when_empty: false,
            autosave_retention: '2m',
            image_advtab: true,
            height: 600,
            image_caption: true,
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
            noneditable_class: 'mceNonEditable',
            toolbar_mode: 'sliding',
            contextmenu: 'link image table',
            skin: 'oxide',
            content_css: 'default',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
            images_upload_handler: function (blobInfo, progress) {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function() {
                  resolve(reader.result);
                };
                reader.onerror = function() {
                  reject('Failed to read file');
                };
                reader.readAsDataURL(blobInfo.blob());
              });
            }
          });
          
          // Tab switching
          document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
              // Remove active class from all tabs
              document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
              document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
              
              // Add active class to clicked tab
              this.classList.add('active');
              
              // Show corresponding tab content
              const tabName = this.getAttribute('data-tab');
              document.getElementById(tabName + '-tab').classList.add('active');
              
              // If switching to edit tab, make sure TinyMCE is initialized
              if (tabName === 'edit') {
                tinymce.activeEditor.focus();
              }
            });
          });
          
          // Handle image upload button
          document.getElementById('image-upload').addEventListener('change', function(e) {
            // First switch to edit tab
            document.querySelector('.tab[data-tab="edit"]').click();
            
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              const reader = new FileReader();
              
              reader.onload = function(e) {
                tinymce.activeEditor.execCommand('mceInsertContent', false, '<img src="' + e.target.result + '" alt="Uploaded Image" />');
              };
              
              reader.readAsDataURL(file);
            }
          });
          
          // Handle download original button
          document.getElementById('download-original-btn').addEventListener('click', function() {
            const a = document.createElement('a');
            a.href = '/uploads/${filename}';
            a.download = '${originalFilename}.docx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          });
          
          // Handle download edited button
          document.getElementById('download-edited-btn').addEventListener('click', function() {
            const content = tinymce.activeEditor.getContent();
            
            // Send content to server to convert to DOCX and download
            fetch('/api/convert-to-docx/${filename}', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ content: content }),
            })
            .then(response => response.blob())
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = '${originalFilename}_edited.docx';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            })
            .catch(error => {
              console.error('Error downloading DOCX:', error);
              alert('Error downloading DOCX. Please try again.');
            });
          });
          
          // Handle PDF download button
          document.getElementById('download-pdf-btn').addEventListener('click', function() {
            // Get content from either preview or editor depending on active tab
            let content;
            if (document.getElementById('edit-tab').classList.contains('active')) {
              content = tinymce.activeEditor.getContent();
            } else {
              content = document.querySelector('.preview-content').innerHTML;
            }
            
            // Send content to server to convert to PDF and download
            fetch('/api/convert-to-pdf/${filename}', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ content: content }),
            })
            .then(response => response.blob())
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = '${originalFilename}.pdf';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            })
            .catch(error => {
              console.error('Error downloading PDF:', error);
              alert('Error downloading PDF. Please try again.');
            });
          });
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("📄 Error generating editable preview:", error);
    res.status(500).json({ success: false, message: "Failed to generate editable preview: " + error.message });
  }
});

// Add endpoint to convert HTML to DOCX and download
app.post("/api/convert-to-docx/:filename", async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, message: "No content provided" });
    }
    
    // Convert HTML to DOCX
    const HTMLtoDOCX = require('html-to-docx');
    const docxBuffer = await HTMLtoDOCX(content, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename}`);
    
    // Send the file
    res.send(docxBuffer);
  } catch (error) {
    console.error("📄 Error converting to DOCX:", error);
    res.status(500).json({ success: false, message: "Failed to convert to DOCX: " + error.message });
  }
});

// Add endpoint to convert HTML to PDF and download
app.post("/api/convert-to-pdf/:filename", async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, message: "No content provided" });
    }
    
    // Convert HTML to PDF using puppeteer
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Add these args for server environments
    });
    const page = await browser.newPage();
    
    // Set content with proper styling
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1, h2, h3 { margin-top: 1.5rem; margin-bottom: 1rem; }
          p { margin-bottom: 1rem; }
          table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
          table, th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; text-align: left; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `);
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });
    
    await browser.close();
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename.replace('.docx', '.pdf')}`);
    
    // Send the file
    res.send(pdfBuffer);
  } catch (error) {
    console.error("📄 Error converting to PDF:", error);
    res.status(500).json({ success: false, message: "Failed to convert to PDF: " + error.message });
  }
});
// Make uploads directory accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================== ADMIN DASHBOARD ROUTES ====================

// @route   GET api/admin/club-data
// @desc    Get all clubs with their events
// @access  Public
app.get("/api/admin/club-data", async (req, res) => {
  try {
    const clubs = [
      { id: "osc", name: "Open Source Chandigarh" },
      { id: "ieee", name: "IEEE" },
      { id: "explore", name: "Explore Labs" },
      { id: "iei", name: "IE(I) CSE Student Chapter" },
      { id: "coe", name: "Center of Excellence" },
      { id: "ceed", name: "CEED" },
      { id: "bnb", name: "BIts N Bytes" },
      { id: "acm", name: "ACM Chapter" },
      { id: "gfg", name: "GFG CUIET" },
      { id: "gdg", name: "GDG CUIET" },
      { id: "cb", name: "Coding Blocks" },
      { id: "cn", name: "Coding Ninjas" },
      { id: "dgit", name: "DGIT Squad" },
      { id: "dice", name: "DICE" },
      { id: "hc", name: "Happiness Center" },
      { id: "nss", name: "NSS" },
    ]

    const allClubsData = await Promise.all(
      clubs.map(async (club) => {
        const events = await ClubEvent.find({ clubId: club.id })

        // Calculate stats
        let totalExpenses = 0
        const totalRegistrations = 0
        const today = new Date()

        events.forEach((event) => {
          event.expenses?.forEach((exp) => {
            totalExpenses += exp.amount || 0
          })

          // Registration logic (if you have separate reg data)
        })

        const upcomingEvents = events.filter((event) => new Date(event.startDate) > today).length

        return {
          id: club.id,
          name: club.name,
          events,
          totalEvents: events.length,
          totalExpenses,
          totalRegistrations,
          upcomingEvents,
        }
      }),
    )

    res.status(200).json({ success: true, clubData: allClubsData })
  } catch (err) {
    console.error("Error in /api/admin/club-data:", err)
    res.status(500).json({ success: false, message: "Server Error" })
  }
})

// ==================== UTILITY FUNCTIONS ====================

// Insert default department accounts
const insertDefaultAccounts = async () => {
  const departmentAccounts = [
    {
      username: "cse",
      email: "cse@university.edu",
      password: "cse123",
      department: "CSE",
      uid: "dept-cse-001",
    },
    {
      username: "architecture",
      email: "architecture@university.edu",
      password: "arch123",
      department: "Architecture",
      uid: "dept-arch-001",
    },
    {
      username: "pharma",
      email: "pharma@university.edu",
      password: "pharma123",
      department: "Pharma",
      uid: "dept-pharma-001",
    },
    {
      username: "business",
      email: "business@university.edu",
      password: "business123",
      department: "Business School",
      uid: "dept-business-001",
    },
  ]

  try {
    // Check if accounts already exist
    const existingAccounts = await User.find({ type: "department" })

    if (existingAccounts.length > 0) {
      console.log("Department accounts already exist, skipping insertion")
      return
    }

    // Insert each department account
    for (const account of departmentAccounts) {
      // Check if account already exists
      const existingAccount = await User.findOne({ username: account.username })

      if (!existingAccount) {
        // Create new account
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(account.password, salt)

        const newUser = new User({
          username: account.username,
          email: account.email,
          password: hashedPassword,
          type: "department",
          department: account.department,
          uid: account.uid,
        })

        await newUser.save()
        console.log(`Created department account: ${account.department}`)
      }
    }

    console.log("All department accounts inserted successfully")
  } catch (error) {
    console.error("Error inserting department accounts:", error)
    throw error
  }
}

// Add this route to server.js
app.post("/api/upload-image", diskUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" })
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "unibux_posters",
    })

    // Remove the file from local storage
    fs.unlinkSync(req.file.path)

    // Return the Cloudinary URL
    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    })
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    res.status(500).json({ success: false, message: "Failed to upload image" })
  }
})

// ==================== SERVER STARTUP ====================

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected successfully")

    // Insert default department accounts
    try {
      await insertDefaultAccounts()
      console.log("Default accounts inserted successfully")
    } catch (error) {
      console.error("Error inserting default accounts:", error)
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

// Test route
app.get("/", (req, res) => {
  res.send("Event Management API is running")
})

module.exports = app