import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";
import multer from "multer";
import mongoose from "mongoose";
import generatePredictorEmailHTML from "../utils/emailTemplates/predictorEmailTemplate.js";

const router = express.Router();
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

// Email validation rules
const validateEmailWithPDF = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("rank").isInt({ min: 1, max: 2000000 }).withMessage("Rank must be positive integer (1-2,000,000)"),
   body("seatType").isString().trim().notEmpty().withMessage("seatType is required"),
  body("category").isString().trim().notEmpty().withMessage("Category is required"),
  body("name").optional().isString().trim().escape().isLength({ max: 100 }),
  body("counsellingType").optional().isString().trim().notEmpty().withMessage("Counselling Type is required"),
  body("round").optional().isString().trim().notEmpty().withMessage("Round is required"),
];

const createTransporter = () => {
  // Validate required environment variables
  const requiredVars = ['EMAIL_SERVICE', 'EMAIL_USER', 'EMAIL_PASSWORD'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required email configuration: ${missingVars.join(', ')}`);
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {

      rejectUnauthorized: process.env.NODE_ENV === 'production'
    },
    pool: true,
    maxConnections: 5,
    rateLimit: true
  });
};

router.post("/send-with-pdf", upload.single('pdf'), validateEmailWithPDF, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const { selectedYear, email, rank, seatType, category, userName = "", counsellingType, round } = req.body;
    const pdfFile = req.file;

    if (!pdfFile || pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ 
        success: false, 
        error: "Valid PDF file is required"
      });
    }

    const transporter = createTransporter();

    try {
      await transporter.verify();
    } catch (verifyError) {
      throw new Error(`SMTP connection failed: ${verifyError.message}`);
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"College Predictor" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `College Admission Insights – Your Report Inside`,
      html: generatePredictorEmailHTML(userName, rank, seatType, category, counsellingType, round),
      attachments: [{
        filename: `Collegesecracy-${counsellingType.toLowerCase()}-predictions-R${round}-year-${selectedYear}.pdf`,
        content: pdfFile.buffer,
        contentType: 'application/pdf',
      }],
      priority: 'high'
    });

    res.json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId
    });

  } catch (error) {
    handleEmailError(res, error);
  }
});

function handleEmailError(res, error) {
  console.error("Email error:", {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  const statusCode = error.message.includes('credentials') ? 401 : 500;

  res.status(statusCode).json({
    success: false,
    error: "Failed to send email",
    ...(process.env.NODE_ENV !== 'production' && {
      details: error.message
    })
  });
}

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Email Service",
    time: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    emailConfigured: !!process.env.EMAIL_USER
  });
});

export default router;

