import express from 'express';
import { getApprovedFeedbacks } from '../controllers/userController.js'

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    api: "CollegeSecracy Public API",
    version: "v1"
  });
});
router.route("/feedback").get(getApprovedFeedbacks);

export default router;