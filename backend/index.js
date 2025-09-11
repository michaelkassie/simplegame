const express = require("express");
const cors = require("cors");

const app = express();

// Use Render's provided port in production; fallback to 3000 locally
const PORT = process.env.PORT || 3000;

// Lock CORS to your frontend in prod; allow all in dev
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));

app.use(express.json());

// ---- Health check (for Render) ----
app.get("/health", (_req, res) => res.send("ok"));

// ---- Game state (in-memory; will reset on restarts) ----
let targetNumber = null;
let guessHistory = [];
let leaderboard = [];

// Start a new game
app.get("/start", (_req, res) => {
  targetNumber = Math.floor(Math.random() * 100) + 1;
  guessHistory = [];
  console.log(`New game started! Target number is ${targetNumber}`);
  res.json({ message: "New game started!" });
});

// Submit a guess
app.post("/guess", (req, res) => {
  const { guess } = req.body || {};
  if (!targetNumber) {
    return res.status(400).json({ error: "Game not started. Call /start first." });
  }
  if (typeof guess !== "number" || !Number.isFinite(guess) || guess < 1 || guess > 100) {
    return res.status(400).json({ error: "Invalid guess. Must be a number between 1 and 100." });
  }

  guessHistory.push(guess);

  if (guess === targetNumber) {
    const revealed = targetNumber;
    // auto-start next round
    targetNumber = Math.floor(Math.random() * 100) + 1;
    const history = [...guessHistory];
    guessHistory = [];
    return res.json({
      result: "correct",
      message: `🎉 Correct! The number was ${revealed}. New round started.`,
      attempts: history.length,
      lastRoundHistory: history
    });
  } else if (guess < targetNumber) {
    return res.json({ result: "low", message: "Too low! Try again.", guessHistory });
  } else {
    return res.json({ result: "high", message: "Too high! Try again.", guessHistory });
  }
});

// Submit a score
app.post("/submit-score", (req, res) => {
  const { playerName, attempts } = req.body || {};
  if (typeof playerName !== "string" || !playerName.trim() || !Number.isInteger(attempts) || attempts <= 0) {
    return res.status(400).json({ error: "Invalid score submission." });
  }
  leaderboard.push({ playerName: playerName.trim(), attempts, date: new Date().toISOString() });
  leaderboard.sort((a, b) => a.attempts - b.attempts);
  // limit size to avoid unbounded growth
  leaderboard = leaderboard.slice(0, 100);
  res.json({ message: "Score submitted!", leaderboard });
});

// Get leaderboard
app.get("/leaderboard", (_req, res) => {
  res.json({ leaderboard });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
