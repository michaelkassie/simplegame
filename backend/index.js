const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();

// Use Render's provided port in production; fallback to 3000 locally
const PORT = process.env.PORT || 3000;

// Frontend origin: set this in prod to your Vercel URL (exact, no trailing slash)
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: ALLOWED_ORIGIN,
  credentials: true, // allow cookies
}));

app.use(express.json());

// ---- Sessions ----
// In prod behind HTTPS, set secure:true and sameSite:"none"
app.use(session({
  secret: process.env.SESSION_SECRET || "dev_secret_change_me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production", // requires HTTPS
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// ---- Health check (for Render) ----
app.get("/health", (_req, res) => res.send("ok"));

// ---- Helpers ----
function ensureGame(req) {
  if (!req.session.game) {
    req.session.game = {
      target: Math.floor(Math.random() * 100) + 1,
      history: [],
      attempts: 0,
      status: "IN_PROGRESS",
    };
  }
  return req.session.game;
}

// ---- Routes ----

// Start a new game (per session)
app.get("/start", (req, res) => {
  req.session.game = {
    target: Math.floor(Math.random() * 100) + 1,
    history: [],
    attempts: 0,
    status: "IN_PROGRESS",
  };
  console.log("New game started for session", req.sessionID);
  res.json({ message: "New game started!", status: "IN_PROGRESS", attempts: 0 });
});

// Optional: current state (nice for restore on refresh)
app.get("/state", (req, res) => {
  const g = req.session.game;
  if (!g) return res.json({ status: "NO_GAME" });
  res.json({ status: g.status, attempts: g.attempts, guessHistory: g.history });
});

// Submit a guess
app.post("/guess", (req, res) => {
  const { guess } = req.body || {};

  // Validate input
  if (typeof guess !== "number" || !Number.isFinite(guess) || guess < 1 || guess > 100) {
    return res.status(400).json({ error: "Invalid guess. Must be a number between 1 and 100." });
  }

  // Ensure a game exists for THIS session/device
  const g = ensureGame(req);

  g.history.push(guess);
  g.attempts += 1;

  if (guess === g.target) {
    const revealed = g.target;
    const lastRoundHistory = [...g.history];
    g.status = "WON";

    // Auto-start next round for this same session
    req.session.game = {
      target: Math.floor(Math.random() * 100) + 1,
      history: [],
      attempts: 0,
      status: "IN_PROGRESS",
    };

    return res.json({
      result: "correct",
      message: `🎉 Correct! The number was ${revealed}. New round started.`,
      attempts: lastRoundHistory.length,
      lastRoundHistory,
      status: "WON",
    });
  }

  const result = guess < g.target ? "low" : "high";
  res.json({
    result,
    message: result === "low" ? "Too low! Try again." : "Too high! Try again.",
    guessHistory: g.history,
    attempts: g.attempts,
    status: g.status,
  });
});

// Leaderboard stored per session (keeps your current behavior)
// For a global/cross-device board, back this with a DB later.
app.post("/submit-score", (req, res) => {
  const { playerName, attempts } = req.body || {};
  if (typeof playerName !== "string" || !playerName.trim() || !Number.isInteger(attempts) || attempts <= 0) {
    return res.status(400).json({ error: "Invalid score submission." });
  }

  if (!req.session.leaderboard) req.session.leaderboard = [];
  req.session.leaderboard.push({ playerName: playerName.trim(), attempts, date: new Date().toISOString() });
  req.session.leaderboard.sort((a, b) => a.attempts - b.attempts);
  req.session.leaderboard = req.session.leaderboard.slice(0, 100);

  res.json({ message: "Score submitted!", leaderboard: req.session.leaderboard });
});

app.get("/leaderboard", (req, res) => {
  res.json({ leaderboard: req.session.leaderboard || [] });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
