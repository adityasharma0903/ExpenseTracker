const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://connectrevoliq:supportrevoliq@revoliq.i93q6.mongodb.net/?retryWrites=true&w=majority&appName=Revoliq');

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
  department: String,
  id: String,
  uid: { type: String, unique: true, required: true }
});

const User = mongoose.model('User1', userSchema);

// Event schema with department field
const eventSchema = new mongoose.Schema({
  department: { type: String, required: true, index: true }, // Added index for better query performance
  name: { type: String, required: true },
  club: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  venue: { type: String, required: true },
  description: String,
  expenses: [{
    category: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

// Add default department users
const addDefaultDeptUsers = async () => {
  const defaultDeptUsers = [
    { department: "CSE", id: "cse001", password: "password123", uid: "cse001", email: "cse001@university.com", username: "cse001" },
    { department: "CSE", id: "cse002", password: "password123", uid: "cse002", email: "cse002@university.com", username: "cse002" },
    { department: "Architecture", id: "arch001", password: "password123", uid: "arch001", email: "arch001@university.com", username: "arch001" },
    { department: "Architecture", id: "arch002", password: "password123", uid: "arch002", email: "arch002@university.com", username: "arch002" },
    { department: "Pharma", id: "pharma001", password: "password123", uid: "pharma001", email: "pharma001@university.com", username: "pharma001" },
    { department: "Pharma", id: "pharma002", password: "password123", uid: "pharma002", email: "pharma002@university.com", username: "pharma002" },
    { department: "Business School", id: "biz001", password: "password123", uid: "biz001", email: "biz001@university.com", username: "biz001" },
    { department: "Business School", id: "biz002", password: "password123", uid: "biz002", email: "biz002@university.com", username: "biz002" },
  ];

  for (const user of defaultDeptUsers) {
    try {
      const existingUser = await User.findOne({ uid: user.uid });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = new User({
          department: user.department,
          id: user.id,
          password: hashedPassword,
          type: 'department',
          uid: user.uid,
          email: user.email,
          username: user.username
        });
        await newUser.save();
      }
    } catch (error) {
      console.error(`Error adding user ${user.uid}:`, error.message);
    }
  }
};

addDefaultDeptUsers();

// Admin signup
app.post('/api/admin/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.json({ success: false, message: 'All fields are required' });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.json({ 
        success: false, 
        message: 'Username or email already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      type: 'admin',
      uid: username
    });

    await user.save();
    res.json({ success: true, message: 'Signup successful!' });
  } catch (error) {
    console.error('Signup error:', error);
    res.json({ 
      success: false, 
      message: 'An error occurred during signup' 
    });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, type: 'admin' });
    
    if (!user) {
      return res.json({ success: false, message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid username or password' });
    }

    res.json({ 
      success: true, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        type: user.type
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ 
      success: false, 
      message: 'An error occurred during login' 
    });
  }
});

// Department login
app.post('/api/department/login', async (req, res) => {
  try {
    const { department, id, password } = req.body;
    const user = await User.findOne({ 
      department, 
      id, 
      type: 'department' 
    });
    
    if (!user) {
      return res.json({ success: false, message: 'Invalid department ID or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid department ID or password' });
    }

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        department: user.department,
        type: user.type
      }
    });
  } catch (error) {
    console.error('Department login error:', error);
    res.json({ 
      success: false, 
      message: 'An error occurred during login' 
    });
  }
});

// Add new event
app.post('/api/add-event', async (req, res) => {
  try {
    const { department, name, club, startDate, endDate, startTime, endTime, venue, description, expenses } = req.body;

    // Validate required fields
    if (!department || !name || !club || !startDate || !endDate || !startTime || !endTime || !venue) {
      return res.json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }

    // Create and save new event
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
      expenses: expenses || []
    });

    await newEvent.save();

    res.json({ 
      success: true, 
      message: 'Event added successfully!',
      event: newEvent
    });
  } catch (error) {
    console.error('Error adding event:', error);
    res.json({ 
      success: false, 
      message: 'Error adding event',
      error: error.message
    });
  }
});

// Get department-specific events
app.get('/api/get-events', async (req, res) => {
  try {
    const { department } = req.query;
    
    if (!department) {
      return res.json({ 
        success: false, 
        message: 'Department parameter is required' 
      });
    }

    const events = await Event.find({ department })
      .sort({ startDate: -1 }) // Sort by start date, newest first
      .exec();

    res.json({ 
      success: true, 
      events 
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.json({ 
      success: false, 
      message: 'Error fetching events',
      error: error.message 
    });
  }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { department } = req.query; // Require department for security

    const event = await Event.findOne({ _id: id, department });
    if (!event) {
      return res.json({ 
        success: false, 
        message: 'Event not found or unauthorized' 
      });
    }

    await Event.deleteOne({ _id: id, department });
    res.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.json({ 
      success: false, 
      message: 'Error deleting event',
      error: error.message 
    });
  }
});

// Update event
app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { department } = req.body;
    const updateData = req.body;

    const event = await Event.findOne({ _id: id, department });
    if (!event) {
      return res.json({ 
        success: false, 
        message: 'Event not found or unauthorized' 
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({ 
      success: true, 
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.json({ 
      success: false, 
      message: 'Error updating event',
      error: error.message 
    });
  }
});

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('MongoDB connected');
  });
});