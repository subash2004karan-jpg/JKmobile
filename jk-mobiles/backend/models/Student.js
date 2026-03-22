const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    enum: ['Basic', 'Advanced', 'Chip Level'],
  },
  mode: {
    type: String,
    required: [true, 'Mode is required'],
    enum: ['Online', 'Offline'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
  certificateId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

// Generate certificate ID before saving
studentSchema.pre('save', function(next) {
  if (this.isModified('completed') && this.completed && !this.certificateId) {
    const year = new Date().getFullYear();
    const random = Math.floor(100 + Math.random() * 900);
    this.certificateId = `JKM-${year}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
