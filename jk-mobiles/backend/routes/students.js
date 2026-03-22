const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const protect = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// POST /students/add — Enroll a new student
router.post('/add', async (req, res) => {
  try {
    const { name, phone, course, mode } = req.body;

    if (!name || !phone || !course || !mode) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const existing = await Student.findOne({ phone });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A student with this phone number already exists.' });
    }

    const student = await Student.create({ name, phone, course, mode });
    res.status(201).json({ success: true, message: 'Enrollment successful!', student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /students — Get all students (admin only)
router.get('/', protect, async (req, res) => {
  try {
    const students = await Student.find().sort({ enrolledAt: -1 });
    res.json({ success: true, count: students.length, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /students/complete/:id — Mark student as completed (admin only)
router.put('/complete/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    student.completed = true;
    student.completedAt = new Date();
    
    // Generate certificate ID if not exists
    if (!student.certificateId) {
      const year = new Date().getFullYear();
      const random = Math.floor(100 + Math.random() * 900);
      student.certificateId = `JKM-${year}-${random}`;
    }
    
    await student.save();

    res.json({ success: true, message: 'Student marked as completed.', student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /students/update-cert/:id — Update certificate ID (admin only)
router.put('/update-cert/:id', protect, async (req, res) => {
  try {
    const { certificateId } = req.body;
    
    if (!certificateId) {
      return res.status(400).json({ success: false, message: 'Certificate ID is required.' });
    }

    // Check if certificate ID already exists
    const existing = await Student.findOne({ certificateId, _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Certificate ID already exists.' });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { certificateId },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    res.json({ success: true, message: 'Certificate ID updated.', student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /students/certificate/:phone — Get certificate by phone
router.get('/certificate/:phone', async (req, res) => {
  try {
    const student = await Student.findOne({ phone: req.params.phone });

    if (!student) {
      return res.status(404).json({ success: false, message: 'No student found with this phone number.' });
    }

    if (!student.completed) {
      return res.status(403).json({ success: false, message: 'Course not yet completed. Certificate not available.' });
    }

    res.json({
      success: true,
      message: 'Certificate available.',
      student: {
        name: student.name,
        phone: student.phone,
        course: student.course,
        mode: student.mode,
        completedAt: student.completedAt,
        enrolledAt: student.enrolledAt,
        certificateId: student.certificateId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /students/certificate/:phone/download — Download certificate PDF
router.get('/certificate/:phone/download', async (req, res) => {
  try {
    const student = await Student.findOne({ phone: req.params.phone });

    if (!student) {
      return res.status(404).json({ success: false, message: 'No student found with this phone number.' });
    }

    if (!student.completed) {
      return res.status(403).json({ success: false, message: 'Course not yet completed. Certificate not available.' });
    }

    // Generate certificate ID if not exists
    if (!student.certificateId) {
      const year = new Date().getFullYear();
      const random = Math.floor(100 + Math.random() * 900);
      student.certificateId = `JKM-${year}-${random}`;
      await student.save();
    }

    // Create PDF
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const filename = `JKM_Certificate_${student.certificateId}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    doc.pipe(res);

    // Certificate Design
    const width = doc.page.width;
    const height = doc.page.height;
    const centerX = width / 2;

    // Background - Light cream color
    doc.rect(0, 0, width, height).fill('#FFFEF5');

    // Decorative Border
    doc.rect(30, 30, width - 60, height - 60)
       .lineWidth(4)
       .stroke('#0A2463');
    
    doc.rect(40, 40, width - 80, height - 80)
       .lineWidth(2)
       .stroke('#FF6B00');

    // Header - Institute Logo Area
    doc.fontSize(14)
       .fillColor('#0A2463')
       .font('Helvetica-Bold');
    
    // Logo placeholder
    doc.circle(centerX, 70, 25)
       .lineWidth(2)
       .stroke('#0A2463');
    doc.fontSize(20)
       .fillColor('#0A2463')
       .text('📱', centerX - 12, 60);

    // Institute Name
    doc.fontSize(28)
       .fillColor('#0A2463')
       .font('Helvetica-Bold')
       .text('JK MOBILES', centerX, 110, { align: 'center' });
    
    doc.fontSize(12)
       .fillColor('#666')
       .font('Helvetica')
       .text('Training Institute', centerX, 140, { align: 'center' });

    // Certificate Title
    doc.fontSize(42)
       .fillColor('#0A2463')
       .font('Helvetica-Bold')
       .text('CERTIFICATE', centerX, 180, { align: 'center' });
    
    doc.fontSize(16)
       .fillColor('#FF6B00')
       .font('Helvetica')
       .text('OF COMPLETION', centerX, 225, { align: 'center' });

    // Decorative Line
    doc.moveTo(centerX - 100, 250)
       .lineTo(centerX + 100, 250)
       .lineWidth(2)
       .stroke('#FF6B00');

    // Present Text
    doc.fontSize(14)
       .fillColor('#666')
       .text('This certificate is proudly presented to', centerX, 270, { align: 'center' });

    // Student Name
    doc.fontSize(36)
       .fillColor('#0A2463')
       .font('Helvetica-Bold')
       .text(student.name, centerX, 300, { align: 'center' });

    // Course Details
    doc.fontSize(14)
       .fillColor('#666')
       .font('Helvetica')
       .text(`For successfully completing the`, centerX, 350, { align: 'center' });
    
    doc.fontSize(20)
       .fillColor('#0A2463')
       .font('Helvetica-Bold')
       .text(`${student.course} - Mobile Repair Training`, centerX, 370, { align: 'center' });

    // Duration and Mode
    doc.fontSize(14)
       .fillColor('#666')
       .text(`Duration: 10 Days | Mode: ${student.mode}`, centerX, 400, { align: 'center' });

    // Issue Date
    const issueDate = new Date(student.completedAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    doc.fontSize(12)
       .fillColor('#666')
       .text(`Issue Date: ${issueDate}`, centerX, 430, { align: 'center' });

    // Certificate ID
    doc.fontSize(12)
       .fillColor('#FF6B00')
       .font('Helvetica-Bold')
       .text(`Certificate ID: ${student.certificateId}`, centerX, 455, { align: 'center' });

    // Bottom Section - Signature and Seal
    const bottomY = height - 120;
    
    // Left - Date
    doc.fontSize(12)
       .fillColor('#666')
       .font('Helvetica')
       .text('Date', 150, bottomY, { align: 'center' });
    doc.moveTo(100, bottomY - 10)
       .lineTo(200, bottomY - 10)
       .lineWidth(1)
       .stroke('#0A2463');
    doc.fontSize(11)
       .text(issueDate, 150, bottomY + 15, { align: 'center' });

    // Center - Seal
    doc.circle(centerX, bottomY - 10, 35)
       .lineWidth(2)
       .stroke('#FF6B00');
    doc.fontSize(10)
       .fillColor('#FF6B00')
       .font('Helvetica-Bold')
       .text('OFFICIAL', centerX, bottomY - 15, { align: 'center' });
    doc.fontSize(8)
       .text('SEAL', centerX, bottomY - 5, { align: 'center' });

    // Right - Signature
    doc.fontSize(12)
       .fillColor('#666')
       .text('Director', width - 150, bottomY, { align: 'center' });
    doc.moveTo(width - 200, bottomY - 10)
       .lineTo(width - 100, bottomY - 10)
       .lineWidth(1)
       .stroke('#0A2463');
    doc.fontSize(11)
       .fillColor('#0A2463')
       .text('JK Mobiles', width - 150, bottomY + 15, { align: 'center' });

    // Footer
    doc.fontSize(10)
       .fillColor('#999')
       .text('This certificate verifies the successful completion of the training program.', centerX, height - 50, { align: 'center' });
    doc.text('Verify at: jkmobiles.com/verify', centerX, height - 35, { align: 'center' });

    doc.end();

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /students/verify/:certificateId — Verify certificate
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const student = await Student.findOne({ certificateId: req.params.certificateId });

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        valid: false,
        message: 'Invalid certificate ID. Certificate not found.' 
      });
    }

    if (!student.completed) {
      return res.status(403).json({ 
        success: false, 
        valid: false,
        message: 'Certificate not yet activated. Course not completed.' 
      });
    }

    res.json({
      success: true,
      valid: true,
      message: 'Certificate verified successfully.',
      certificate: {
        certificateId: student.certificateId,
        studentName: student.name,
        course: student.course,
        mode: student.mode,
        completedAt: student.completedAt,
        issueDate: new Date(student.completedAt).toLocaleDateString('en-IN'),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /students/stats — Dashboard stats (admin only)
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const completed = await Student.countDocuments({ completed: true });
    const pending = total - completed;
    const recent = await Student.find().sort({ enrolledAt: -1 }).limit(5);
    res.json({ success: true, stats: { total, completed, pending }, recent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
