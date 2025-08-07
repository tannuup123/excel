const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'super-admin'], default: 'user' }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    const newUser = new User({ fullname, email, password, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This email is already in use.' });
    }
    res.status(500).json({ error: 'Registration failed due to a server error.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    
    if (user.role !== 'super-admin' && user.role !== role) {
      return res.status(403).json({ error: `Forbidden: You are not authorized to login as ${role}.` });
    }
    
    res.status(200).json({ message: 'Login successful!', role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login.' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'fullname email role');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

app.put('/api/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.role = role;
    await user.save();
    
    res.status(200).json({ message: `User role updated to ${role} successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));