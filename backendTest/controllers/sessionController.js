import Session from "../models/Session.js";

// [GET] Fetch all sessions
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: 1 });
    res.status(200).json({ message: "Sessions fetched successfully", sessions });
  } catch (err) {
    console.error("Error in fetching sessions:", err);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

// [POST] Create a new session
export const createSession = async (req, res) => {
  try {
    const {
      title,
      subject,
      date,
      startTime = "",
      endTime = "",
      duration = "",
      priority = "medium",
      bookmarked = false,
      notes = "",
      status = "upcoming",
      topics = ""
    } = req.body;

    const userId = req.user.id; // ✅ add this line

    const createSession = await Session.create({
      title,
      subject,
      date,
      startTime,
      endTime,
      duration,
      priority,
      bookmarked,
      notes,
      status,
      topics,
      userId   // ✅ include thi
    });

    res.status(201).json({ message: 'Session Created', session: createSession });
  } catch (err) {
    console.error('Error detected', err);
    res.status(500).json({ message: 'Error in creating sessions' });
  }
};


// [PUT] Update session
export const updateSession = async (req, res) => {
  try {
    const {
      title,
      subject,
      date,
      startTime = "",
      endTime = "",
      duration = "",
      priority = "medium",
      bookmarked = false,
      notes = "",
      status = "upcoming",
      topics = "",
    } = req.body;

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subject,
        date,
        startTime,
        endTime,
        duration,
        priority,
        bookmarked,
        notes,
        status,
        topics,
      },
      { new: true }
    );

    if (!updatedSession)
      return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ message: "Session updated", updatedSession });
  } catch (err) {
    console.error("Error in updating session:", err);
    res.status(500).json({ message: "Failed to update session" });
  }
};

// [DELETE] Delete session
export const deleteSession = async (req, res) => {
  try {
    const deleted = await Session.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ message: "Session deleted", deleted: true });
  } catch (err) {
    console.error("Error in deleting session:", err);
    res.status(500).json({ message: "Failed to delete session" });
  }
};

// [PATCH] Toggle bookmark
export const toggleSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session)
      return res.status(404).json({ message: "Session not found" });

    session.bookmarked = !session.bookmarked;
    await session.save();

    res.status(200).json({ message: "Bookmark toggled", updatedSession: session });
  } catch (err) {
    console.error("Error in toggling session:", err);
    res.status(500).json({ message: "Failed to toggle bookmark" });
  }
};

// [PATCH] Mark as completed
export const markSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session)
      return res.status(404).json({ message: "Session not found" });

    session.status = "completed";
    session.completionDate = new Date(); // Optional: Add if schema supports
    await session.save();

    res.status(200).json({ message: "Session marked as completed", updatedSession: session });
  } catch (err) {
    error("Error in marking session completed:", err);
    res.status(500).json({ message: "Failed to mark session" });
  }
};
