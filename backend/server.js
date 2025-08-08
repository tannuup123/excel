const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = require('./middleware/verifyToken');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/user'); // ✅ Fix: use model from separate file

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Register Route
app.post('/api/register', async (req, res) => {
  try {
    const { fullname, email, password, role, phoneNumber, employeeId } = req.body;

    if (role === 'admin' && (!phoneNumber || !employeeId)) {
      return res.status(400).json({ error: 'Admin registration requires phone number and employee ID.' });
    }

    const newUser = new User({
      fullname,
      email,
      password,
      role,
      phoneNumber: role === 'admin' ? phoneNumber : undefined,
      employeeId: role === 'admin' ? employeeId : undefined,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const errorMessage = `The ${field} '${error.keyValue[field]}' is already in use. Please use a different value.`;
      return res.status(400).json({ error: errorMessage });
    }
    console.error('❌ Registration failed:', error);
    res.status(500).json({ error: 'Registration failed due to a server error.' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password.' });

    if (user.role !== 'super-admin' && user.role !== role) {
      return res.status(403).json({ error: `Forbidden: You are not authorized to login as ${role}.` });
    }

    if (user.role === 'admin' && !user.isApproved) {
      return res.status(403).json({ error: 'Admin approval pending.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful!',
      role: user.role,
      token
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// Protected Routes
app.use('/api/users', verifyToken, userRoutes);

// Super Admin Creation Route (One-time use)
app.post('/api/create-super-admin', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const existingSuperAdmin = await User.findOne({ role: 'super-admin' });

    if (existingSuperAdmin) {
      return res.status(400).json({ error: 'A super admin already exists.' });
    }

    const newUser = new User({ fullname, email, password, role: 'super-admin' });
    await newUser.save();
    res.status(201).json({ message: 'Super Admin created successfully!' });

  } catch (error) {
    res.status(500).json({ error: 'Failed to create Super Admin.' });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
