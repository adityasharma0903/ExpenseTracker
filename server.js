const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const nodemailer = require("nodemailer")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "902d22ae459df3cef67d662f3b637feb8f149eb451362aa6e40596f9c6503dac2de98d1c3d5fa1ac61d6e545f4e46bac84d5a60937602c146ee0bc2e80e5b1b9"
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://connectrevoliq:supportrevoliq@revoliq.i93q6.mongodb.net/?retryWrites=true&w=majority&appName=Revoliq"

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

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

const User = mongoose.model("User", userSchema)

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
      const tokenData = atob(token).split(":")
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

  // Check if all required fields are provided
  if (!eventId || !teamName || !members || !Array.isArray(members) || members.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    })
  }

  // Validate team members
  for (const member of members) {
    if (!member.name || !member.email || !member.phone || !member.department) {
      return res.status(400).json({
        success: false,
        message: "Each team member must have a name, email, phone, and department",
      })
    }
  }

  next()
}

// ==================== EMAIL FUNCTIONALITY ====================


const sendApprovalEmail = async (team) => {
  console.log("📧 SEND APPROVAL EMAIL FUNCTION CALLED");

  try {
    // ✅ 1. Check email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("⚠️ Email credentials missing!");
      throw new Error("Email credentials not configured");
    }

    // ✅ 2. Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true
    });

    await transporter.verify();
    console.log("✅ Transporter verified");

    // ✅ 3. Fetch event details
    let eventName = "your registered event";
    let clubName = "your club";

    try {
      const event = await ClubEvent.findById(team.eventId);
      console.log("🔍 Fetched Event:", event);

      if (event) {
        eventName = event.name || eventName;
        clubName = event.clubId || clubName;
      } else {
        console.warn("⚠️ No event found for eventId:", team.eventId);
      }
    } catch (err) {
      console.error("❌ Error fetching event:", err.message);
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
    };

    const readableClub = clubMap[clubName] || clubName;

    // ✅ 5. Loop through members and send email
    for (const member of team.members) {
      const mailOptions = {
        from: `"TechAbhivyakti Team" <${process.env.EMAIL_USER}>`,
        to: member.email,
        subject: `🎉 Your Team "${team.teamName}" is Approved for ${eventName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 15px;">
            <h2 style="color: #28a745;">Hi ${member.name},</h2>
            <p style="font-size: 16px;">
              We're excited to let you know that your team <b>${team.teamName}</b> has been <span style="color: green;"><b>approved</b></span> to participate in the event <b>${eventName}</b>, proudly organized by <b>${readableClub}</b>! 🥳
            </p>
            <p style="font-size: 15px;"><b>Project Idea:</b> ${team.projectIdea || 'Not specified'}</p>
            <p style="font-size: 15px;"><b>Tech Stack:</b> ${team.techStack || 'Not specified'}</p>
            <p style="font-size: 15px;">Get ready to showcase your creativity and innovation! This is your moment. 🌟</p>
            <br/>
            <p style="font-size: 16px;">Wishing you all the best,<br><b>TechAbhivyakti Team</b></p>
          </div>
        `
      };

      console.log(`📧 Sending approval email to: ${member.email}`);
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${member.email}: ${info.messageId}`);
      } catch (sendError) {
        console.error(`❌ Failed to send email to ${member.email}:`, sendError.message);
      }
    }

    console.log("✅ All approval emails sent successfully");
    return true;

  } catch (error) {
    console.error("❌ ERROR in sendApprovalEmail function:", error);
    return false;
  }
};

// ==================== ROUTES ====================

// Team approval route with improved email handling
app.put("/api/team-registrations/:id/approve", async (req, res) => {
  console.log("🔍 APPROVE TEAM ROUTE CALLED for ID:", req.params.id);
  
  try {
    console.log("🔍 Finding team registration...");
    const teamRegistration = await TeamRegistration.findById(req.params.id);

    if (!teamRegistration) {
      console.log("❌ Team registration not found!");
      return res.status(404).json({
        success: false,
        message: "Team registration not found",
      });
    }

    console.log("✅ Team found:", teamRegistration.teamName);
    
    // Update team status
    console.log("🔍 Updating team status to approved...");
    teamRegistration.status = "approved";
    if (req.body.notes) teamRegistration.notes = req.body.notes;
    await teamRegistration.save();
    console.log("✅ Team status updated successfully");

    const leader = teamRegistration.members.find(m => m.isLeader);
    console.log("🔍 Team leader:", leader ? leader.name : "No leader found");

    console.log("🔍 Creating approved team record...");
    const approvedTeam = new ApprovedTeam({
      eventId: teamRegistration.eventId,
      teamName: teamRegistration.teamName,
      leaderName: leader ? leader.name : "",
      members: teamRegistration.members,
      projectIdea: teamRegistration.projectIdea,
      techStack: teamRegistration.techStack,
    });

    await approvedTeam.save();
    console.log("✅ Approved team saved to database");

    // Send emails to all team members
    console.log("📧 Attempting to send emails to team members:");
    approvedTeam.members.forEach((m, i) => {
      console.log(`   ${i+1}. ${m.name} <${m.email}>`);
    });
    
    try {
      console.log("📧 Calling sendApprovalEmail function...");
      const emailResult = await sendApprovalEmail(approvedTeam);
      if (emailResult) {
        console.log("✅ All approval emails sent successfully");
      } else {
        console.log("⚠️ There were issues sending some emails, but the approval process continued");
      }
    } catch (emailError) {
      console.error("❌ EMAIL ERROR:", emailError);
      // Continue execution even if email fails
      console.log("⚠️ Continuing despite email error");
    }

    console.log("🔍 Sending success response to client");
    res.json({
      success: true,
      message: "Team approved and emails sent",
      teamRegistration,
    });

  } catch (error) {
    console.error("❌ ERROR in approve team route:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
      error: error.toString()
    });
  }
});

// Test email route
app.get("/api/test-email", async (req, res) => {
  console.log("🔍 TEST EMAIL ROUTE CALLED");
  
  try {
    const testTeam = {
      teamName: "Test Team",
      leaderName: "Test Leader",
      projectIdea: "Test Project",
      techStack: "Test Stack",
      members: [
        { 
          name: "Test Member 1", 
          email: req.query.email || process.env.EMAIL_USER || "test@example.com" 
        },
        { 
          name: "Test Member 2", 
          email: req.query.email2 || process.env.EMAIL_USER || "test2@example.com" 
        }
      ]
    };
    
    console.log("📧 Calling sendApprovalEmail with test data...");
    const result = await sendApprovalEmail(testTeam);
    
    if (result) {
      res.json({ 
        success: true, 
        message: "Test email sent successfully",
        testEmail: req.query.email || process.env.EMAIL_USER || "test@example.com"
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "Failed to send test email. Check server logs for details." 
      });
    }
  } catch (error) {
    console.error("❌ TEST EMAIL ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send test email", 
      error: error.toString() 
    });
  }
});

// Check environment variables route
app.get("/api/check-env", (req, res) => {
  res.json({
    emailUserSet: !!process.env.EMAIL_USER,
    emailPassSet: !!process.env.EMAIL_PASS,
    // Don't show the actual values for security reasons
    emailUserLength: process.env.EMAIL_USER ? process.env.EMAIL_USER.length : 0,
    emailPassLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});

// Team status update route
app.put("/api/team-registrations/:id/status", async (req, res) => {
  try {
    const team = await TeamRegistration.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    team.status = status;
    await team.save();

    // Auto-create approved entry and send emails if status is approved
    if (status === "approved") {
      const leader = team.members.find(m => m.isLeader);
      const approvedTeam = await ApprovedTeam.create({
        eventId: team.eventId,
        teamName: team.teamName,
        leaderName: leader ? leader.name : "",
        members: team.members,
        projectIdea: team.projectIdea,
        techStack: team.techStack
      });
      
      // Send approval emails
      try {
        await sendApprovalEmail(approvedTeam);
        console.log("✅ Approval emails sent for team:", team.teamName);
      } catch (emailError) {
        console.error("❌ Error sending approval emails:", emailError);
      }
    }

    res.json({ success: true, message: "Status updated", team });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Team rejection route
app.put("/api/team-registrations/:id/reject", async (req, res) => {
  try {
    const teamRegistration = await TeamRegistration.findById(req.params.id);

    if (!teamRegistration) {
      return res.status(404).json({
        success: false,
        message: "Team registration not found",
      });
    }

    teamRegistration.status = "rejected";
    if (req.body.notes) teamRegistration.notes = req.body.notes;

    await teamRegistration.save();

    res.json({
      success: true,
      message: "Team registration rejected",
      teamRegistration,
    });
  } catch (error) {
    console.error("Error rejecting team registration:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
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

// @route   GET api/club-events/:id
// @desc    Get club event by ID
// @access  Public
app.get("/api/club-events/:id", async (req, res) => {
  try {
    const event = await ClubEvent.findById(req.params.id) // Fetch event by ID
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" })
    }

    // Log the event data for debugging
    console.log("Event data from database:", JSON.stringify(event, null, 2))

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
app.post("/api/club-events", async (req, res) => {
  try {
    // Get token from header
    const token = req.header("x-auth-token")

    // Log the token for debugging
    console.log("Token received:", token)

    // Validate the event data
    const { clubId, name, description, startDate, endDate, startTime, endTime, venue } = req.body

    // Check if all required fields are provided
    if (!clubId || !name || !description || !startDate || !endDate || !startTime || !endTime || !venue) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      })
    }

    // Create new event
    const newEvent = new ClubEvent(req.body)

    // Save event
    const event = await newEvent.save()
    console.log("Club event saved:", event)

    res.json({
      success: true,
      event,
    })
  } catch (error) {
    console.error("Error creating club event:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// @route   GET api/club-events
// @desc    Get all club events
// @access  Public
app.get("/api/club-events", async (req, res) => {
  try {
    // Get query parameters
    const { clubId } = req.query

    // Build query
    const query = {}
    if (clubId) query.clubId = clubId

    // Get events
    const events = await ClubEvent.find(query).sort({ createdAt: -1 })

    res.json({
      success: true,
      events,
    })
  } catch (error) {
    console.error("Error fetching club events:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   PUT api/club-events/:id
// @desc    Update a club event
// @access  Public
app.put("/api/club-events/:id", async (req, res) => {
  try {
    // Find and update the event
    const updatedEvent = await ClubEvent.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

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
    const { clubId } = req.params;
    const events = await ClubEvent.find({ clubId });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/approved-teams", async (req, res) => {
  try {
    const { eventId } = req.query;
    const query = eventId ? { eventId } : {};

    const teams = await ApprovedTeam.find(query);

    res.json({
      success: true,
      teams,
    });
  } catch (error) {
    console.error("Error fetching approved teams:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

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
        let totalRegistrations = 0
        const today = new Date()

        events.forEach(event => {
          event.expenses?.forEach(exp => {
            totalExpenses += exp.amount || 0
          })

          // Registration logic (if you have separate reg data)
        })

        const upcomingEvents = events.filter(event => new Date(event.startDate) > today).length

        return {
          id: club.id,
          name: club.name,
          events,
          totalEvents: events.length,
          totalExpenses,
          totalRegistrations,
          upcomingEvents,
        }
      })
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