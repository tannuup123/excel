const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = require('./middleware/verifyToken');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// =================== REGISTER ===================
app.post('/api/register', async (req, res) => {
  try {
    const { fullname, email, password, role, phoneNumber, employeeId } = req.body;

    const validRoles = ['user', 'admin', 'super-admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role selected.' });
    }

    if (role === 'admin' && (!phoneNumber || !employeeId)) {
      return res.status(400).json({ error: 'Admin registration requires phone number and employee ID.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: `The email '${email}' is already in use.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role,
      phoneNumber: role === 'admin' ? phoneNumber : undefined,
      employeeId: role === 'admin' ? employeeId : undefined,
      isApproved: role === 'super-admin' ? true : false
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error('❌ Registration failed:', error);
    res.status(500).json({ error: 'Registration failed due to a server error.' });
  }
});

// =================== LOGIN ===================
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password.' });

    if (user.role !== 'super-admin' && user.role !== role) {
      return res.status(403).json({ error: `You are not authorized to login as ${role}.` });
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
      user: {
        name: user.fullname,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('❌ Login failed:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// =================== PROTECTED ROUTES ===================
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/files', verifyToken, fileRoutes);

// =================== ONE-TIME SUPER ADMIN CREATION ===================
app.post('/api/create-super-admin', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const existingSuperAdmin = await User.findOne({ role: 'super-admin' });

    if (existingSuperAdmin) {
      return res.status(400).json({ error: 'A super admin already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role: 'super-admin',
      isApproved: true
    });

    await newUser.save();
    res.status(201).json({ message: 'Super Admin created successfully!' });

  } catch (error) {
    console.error('❌ Failed to create Super Admin:', error);
    res.status(500).json({ error: 'Failed to create Super Admin.' });
  }
});

// =================== START SERVER ===================
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
