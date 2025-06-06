const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

let targetNumber = null;
let guessHistory = [];
let leaderboard = [];  // NEW: stores the leaderboard

// Start a new game
app.get("/start", (req, res) => {
  targetNumber = Math.floor(Math.random() * 100) + 1;
  guessHistory = [];
  console.log(`New game started! Target number is ${targetNumber}`);
  res.json({ message: "New game started!" });
});

// Submit a guess
app.post("/guess", (req, res) => {
  const { guess } = req.body;
  if (!targetNumber) {
    return res.status(400).json({ error: "Game not started." });
  }

  if (typeof guess !== "number" || guess < 1 || guess > 100) {
    return res.status(400).json({ error: "Invalid guess. Must be a number between 1 and 100." });
  }

  guessHistory.push(guess);

  if (guess === targetNumber) {
    return res.json({
      result: "correct",
      message: `🎉 Congratulations! You guessed the number ${targetNumber} correctly!`,
      guessHistory
    });
  } else if (guess < targetNumber) {
    return res.json({ result: "low", message: "Too low! Try again.", guessHistory });
  } else {
    return res.json({ result: "high", message: "Too high! Try again.", guessHistory });
  }
});

// Submit a score (NEW)
app.post("/submit-score", (req, res) => {
  const { playerName, attempts } = req.body;

  if (!playerName || typeof attempts !== "number") {
    return res.status(400).json({ error: "Invalid score submission." });
  }

  leaderboard.push({ playerName, attempts, date: new Date() });
  leaderboard.sort((a, b) => a.attempts - b.attempts);  // sort ascending by attempts

  res.json({ message: "Score submitted!", leaderboard });
});

// Get leaderboard (NEW)
app.get("/leaderboard", (req, res) => {
  res.json({ leaderboard });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
