document.addEventListener("DOMContentLoaded", () => {
  let guessHistory = [];

  const guessInput = document.getElementById("guess-input");
  const submitGuess = document.getElementById("submit-guess");
  const feedback = document.getElementById("feedback");
  const guessHistoryEl = document.getElementById("guess-history");

  // Safe read of currentUser 
  function safeGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  
  const currentUser = safeGet("currentUser");
  if (currentUser) {
    const welcomeMessage = document.createElement("p");
    welcomeMessage.textContent = `Welcome, ${currentUser}!`;
    document.body.prepend(welcomeMessage);
  }

  // helper: fetch with better errors 
  async function api(path, options = {}) {
    const base = (typeof window.API_URL === "string" && window.API_URL) || "";
    const url = `${base}${path}`;
    const res = await fetch(url, {
      method: options.method || "GET",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      body: options.body ?? undefined,
      
    });
    if (!res.ok) {
      const text = await res.text();
      const err = new Error(`HTTP ${res.status} ${url}\n${text.slice(0, 200)}`);
      err.status = res.status;
      err.body = text;
      throw err;
    }
    try { return await res.json(); } catch { return {}; }
  }

  // start new game on load (GET /start)
  api("/start")
    .then((data) => {
      feedback.textContent = data.message || "Game started! Make your first guess.";
      guessHistory = [];
      guessHistoryEl.textContent = "";
    })
    .catch((err) => {
      feedback.textContent = "Error starting game.";
      console.error(err);
    });

  // handle guess submission (POST /guess) with a one-time auto-retry
  submitGuess.addEventListener("click", async () => {
    const guess = Number.parseInt(guessInput.value, 10);
    if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
      feedback.textContent = "Please enter a valid number between 1 and 100.";
      return;
    }

    async function submitOnce() {
      return api("/guess", { method: "POST", body: JSON.stringify({ guess }) });
    }

    try {
      let data;
      try {
        data = await submitOnce();
      } catch (err) {
        if (err.status === 400 && /Game not started/i.test(err.body || "")) {
          await api("/start");
          data = await submitOnce();
        } else {
          throw err;
        }
      }

      if (data.message) feedback.textContent = data.message;
      if (Array.isArray(data.guessHistory)) {
        guessHistory = data.guessHistory;
        guessHistoryEl.textContent = "Your guesses: " + guessHistory.join(", ");
      }

      if (data.result === "correct") {
        const playerName =
          currentUser || prompt("Congratulations! Enter your name for the leaderboard:");
        if (playerName) {
          const attempts = data.attempts ?? guessHistory.length;
          await api("/submit-score", {
            method: "POST",
            body: JSON.stringify({ playerName, attempts }),
          });
          alert("Score submitted! Redirecting to leaderboard...");
          window.location.href = "leaderboard.html";
        }
      }
    } catch (err) {
      feedback.textContent = "Error submitting guess.";
      console.error(err);
    } finally {
      guessInput.value = "";
      guessInput.focus();
    }
  });
});
