const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || '902d22ae459df3cef67d662f3b637feb8f149eb451362aa6e40596f9c6503dac2de98d1c3d5fa1ac61d6e545f4e46bac84d5a60937602c146ee0bc2e80e5b1b9';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://connectrevoliq:supportrevoliq@revoliq.i93q6.mongodb.net/?retryWrites=true&w=majority&appName=Revoliq';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== SCHEMAS & MODELS ====================

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['admin', 'department'],
    required: true
  },
  department: {
    type: String,
    required: function() {
      return this.type === 'department';
    }
  },
  uid: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Event Schema
const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const eventSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  club: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  expenses: [expenseSchema],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Event = mongoose.model('eventsclub', eventSchema);

// ==================== MIDDLEWARE ====================

// Authentication middleware
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add user from payload to request
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Admin-only middleware
const adminAuth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user is admin
    if (decoded.user.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    // Add user from payload to request
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Validation middleware
const validateAdminSignup = (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  // Check if all fields are provided
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username and password'
    });
  }

  next();
};

const validateEventCreation = (req, res, next) => {
  const { department, name, club, startDate, endDate, startTime, endTime, venue, description } = req.body;

  // Check if all required fields are provided
  if (!department || !name || !club || !startDate || !endDate || !startTime || !endTime || !venue || !description) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide valid dates'
    });
  }

  if (end < start) {
    return res.status(400).json({
      success: false,
      message: 'End date cannot be before start date'
    });
  }

  // Validate expenses if provided
  if (req.body.expenses) {
    const { expenses } = req.body;

    if (!Array.isArray(expenses)) {
      return res.status(400).json({
        success: false,
        message: 'Expenses must be an array'
      });
    }

    for (const expense of expenses) {
      if (!expense.category || !expense.description || typeof expense.amount !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Each expense must have a category, description, and amount'
        });
      }
    }
  }

  next();
};

const validateEventUpdate = (req, res, next) => {
  // Validate dates if provided
  if (req.body.startDate && req.body.endDate) {
    const start = new Date(req.body.startDate);
    const end = new Date(req.body.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid dates'
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be before start date'
      });
    }
  }

  // Validate expenses if provided
  if (req.body.expenses) {
    const { expenses } = req.body;

    if (!Array.isArray(expenses)) {
      return res.status(400).json({
        success: false,
        message: 'Expenses must be an array'
      });
    }

    for (const expense of expenses) {
      if (!expense.category || !expense.description || typeof expense.amount !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Each expense must have a category, description, and amount'
        });
      }
    }
  }

  next();
};

// ==================== ROUTES ====================

// Auth Routes
// @route   POST api/auth/admin/signup
// @desc    Register an admin user
// @access  Public
app.post('/api/auth/admin/signup', validateAdminSignup, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new admin user
    user = new User({
      username,
      email,
      password,
      type: 'admin',
      uid: `admin-${Date.now()}`
    });

    await user.save();

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        type: user.type
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          type: user.type
        }
      });
    });
  } catch (error) {
    console.error('Error in admin signup:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST api/auth/admin/login
// @desc    Login admin user
// @access  Public
app.post('/api/auth/admin/login', validateLogin, async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user || user.type !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        type: user.type
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          type: user.type
        }
      });
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST api/auth/department/login
// @desc    Login department user
// @access  Public
app.post('/api/auth/department/login', validateLogin, async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user || user.type !== 'department') {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        type: user.type,
        department: user.department
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          type: user.type,
          department: user.department
        }
      });
    });
  } catch (error) {
    console.error('Error in department login:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Event Routes
// @route   POST api/events
// @desc    Create a new event
// @access  Private
app.post('/api/events', auth, validateEventCreation, async (req, res) => {
  try {
    const { department, name, club, startDate, endDate, startTime, endTime, venue, description, expenses } = req.body;

    // Log the token for debugging
    console.log('Token received for event creation:', req.header('x-auth-token'));
    
    // Create new event
    const newEvent = new Event({
      department,
      name,
      club,
      startDate,
      endDate,
      startTime,
      endTime,
      venue,
      description,
      expenses: expenses || [],
      createdBy: req.user.id
    });

    // If admin is creating the event, automatically approve it
    if (req.user.type === 'admin') {
      newEvent.status = 'approved';
    }

    // Save event
    const event = await newEvent.save();

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET api/events
// @desc    Get all events
// @access  Private
app.get('/api/events', auth, async (req, res) => {
  try {
    let events;

    // If user is admin, get all events
    if (req.user.type === 'admin') {
      events = await Event.find().sort({ startDate: 1 });
    }
    // If user is department, get only their events
    else if (req.user.type === 'department') {
      events = await Event.find({ department: req.user.department }).sort({ startDate: 1 });
    }

    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Private
app.get('/api/events/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has permission to view this event
    if (req.user.type !== 'admin' && event.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this event'
      });
    }

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private
app.put('/api/events/:id', auth, validateEventUpdate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has permission to update this event
    if (req.user.type !== 'admin' && event.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    // Update event fields
    const { department, name, club, startDate, endDate, startTime, endTime, venue, description, expenses } = req.body;

    if (department) event.department = department;
    if (name) event.name = name;
    if (club) event.club = club;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;
    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (venue) event.venue = venue;
    if (description) event.description = description;
    if (expenses) event.expenses = expenses;

    // If department user is updating, set status back to pending
    if (req.user.type === 'department') {
      event.status = 'pending';
    }

    // Save updated event
    const updatedEvent = await event.save();

    res.json({
      success: true,
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private
app.delete('/api/events/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has permission to delete this event
    if (req.user.type !== 'admin' && event.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event removed'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET api/events/department/:department
// @desc    Get events by department
// @access  Private (Admin only)
app.get('/api/events/department/:department', adminAuth, async (req, res) => {
  try {
    const events = await Event.find({ department: req.params.department }).sort({ startDate: 1 });

    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Error fetching department events:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT api/events/:id/approve
// @desc    Approve an event
// @access  Private (Admin only)
app.put('/api/events/:id/approve', adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.status = 'approved';
    await event.save();

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Error approving event:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT api/events/:id/reject
// @desc    Reject an event
// @access  Private (Admin only)
app.put('/api/events/:id/reject', adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.status = 'rejected';
    await event.save();

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Error rejecting event:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// User Routes
// @route   GET api/users/me
// @desc    Get current user
// @access  Private
app.get('/api/users/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET api/users/departments
// @desc    Get all departments
// @access  Private (Admin only)
app.get('/api/users/departments', adminAuth, async (req, res) => {
  try {
    const departments = await User.find({ type: 'department' }).select('-password');

    res.json({
      success: true,
      departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT api/users/password
// @desc    Update user password
// @access  Private
app.put('/api/users/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password'
    });
  }

  try {
    // Get user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
app.put('/api/users/profile', auth, async (req, res) => {
  const { email } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email'
    });
  }

  try {
    // Check if email is already in use by another user
    const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use'
      });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { email } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ==================== UTILITY FUNCTIONS ====================

// Insert default department accounts
const insertDefaultAccounts = async () => {
  const departmentAccounts = [
    {
      username: 'cse',
      email: 'cse@university.edu',
      password: 'cse123',
      department: 'CSE',
      uid: 'dept-cse-001'
    },
    {
      username: 'architecture',
      email: 'architecture@university.edu',
      password: 'arch123',
      department: 'Architecture',
      uid: 'dept-arch-001'
    },
    {
      username: 'pharma',
      email: 'pharma@university.edu',
      password: 'pharma123',
      department: 'Pharma',
      uid: 'dept-pharma-001'
    },
    {
      username: 'business',
      email: 'business@university.edu',
      password: 'business123',
      department: 'Business School',
      uid: 'dept-business-001'
    }
  ];

  try {
    // Check if accounts already exist
    const existingAccounts = await User.find({ type: 'department' });

    if (existingAccounts.length > 0) {
      console.log('Department accounts already exist, skipping insertion');
      return;
    }

    // Insert each department account
    for (const account of departmentAccounts) {
      // Check if account already exists
      const existingAccount = await User.findOne({ username: account.username });

      if (!existingAccount) {
        // Create new account
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(account.password, salt);

        const newUser = new User({
          username: account.username,
          email: account.email,
          password: hashedPassword,
          type: 'department',
          department: account.department,
          uid: account.uid
        });

        await newUser.save();
        console.log(`Created department account: ${account.department}`);
      }
    }

    console.log('All department accounts inserted successfully');
  } catch (error) {
    console.error('Error inserting department accounts:', error);
    throw error;
  }
};


app.post('/api/events', auth, validateEventCreation, async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('User Info:', req.user);

    const { department, name, club, startDate, endDate, startTime, endTime, venue, description, expenses } = req.body;

    const newEvent = new Event({
      department,
      name,
      club,
      startDate,
      endDate,
      startTime,
      endTime,
      venue,
      description,
      expenses: expenses || [],
      createdBy: req.user.id
    });

    if (req.user.type === 'admin') {
      newEvent.status = 'approved';
    }

    const event = await newEvent.save();
    console.log('Event Saved:', event);

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ==================== SERVER STARTUP ====================

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('MongoDB connected successfully');

    // Insert default department accounts
    try {
      await insertDefaultAccounts();
      console.log('Default accounts inserted successfully');
    } catch (error) {
      console.error('Error inserting default accounts:', error);
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Test route
app.get('/', (req, res) => {
  res.send('Event Management API is running');
});