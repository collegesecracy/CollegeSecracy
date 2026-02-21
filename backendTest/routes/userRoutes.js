import express from 'express';
import { protect } from '../middlewares/auth.js';
import upload from '../utils/multer.js';

import {
  getMe,
  updateMe,
  deleteMe,
  deactivateAccount,
  uploadProfilePic,
  removeProfilePic
} from '../controllers/userController.js';

import {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  toggleSession,
  markSession
} from "../controllers/sessionController.js";

import {
  getMyAuditLogs
} from "../controllers/auditController.js";

const router = express.Router();

// 🔐 Apply auth to all routes
router.use(protect);

// ========================
// 📄 User Profile Routes
// ========================
router.get('/me', getMe);
router.patch('/updateMe', updateMe);
router.post('/uploadProfilePic', upload.single('profilePic'), uploadProfilePic);
router.delete('/removeProfilePic', removeProfilePic);

// ========================
// ⚠️ Account Actions
// ========================
router.patch('/deactivateAccount', deactivateAccount);  // soft delete
router.delete('/deleteAccount', deleteMe);              // hard delete (password check)

// ========================
// 📜 Audit Logs
// ========================
router.get("/audit/my-logs", getMyAuditLogs);

// ========================
// 📚 Study Session Routes
// ========================
router.get('/getSession', getSessions);                                // GET all sessions
router.post('/createSession', createSession);                         // POST new session
router.put('/sessionUpdate/:id', updateSession);                       // PUT update session
router.delete('/session/delete/:id', deleteSession);                   // DELETE session
router.patch('/session/toggle/:id', toggleSession);                    // PATCH toggle bookmark
router.patch('/session/mark/:id', markSession);                        // PATCH mark completed

export default router;
