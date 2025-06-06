document.addEventListener("DOMContentLoaded", function () {
  let guessHistory = [];

  const guessInput = document.getElementById("guess-input");
  const submitGuess = document.getElementById("submit-guess");
  const feedback = document.getElementById("feedback");
  const guessHistoryEl = document.getElementById("guess-history");

  // Start a new game on page load
  fetch("http://localhost:3000/start")
    .then(response => response.json())
    .then(data => {
      feedback.textContent = data.message;
    })
    .catch(error => {
      feedback.textContent = "Error starting game.";
      console.error(error);
    });

  submitGuess.addEventListener("click", function () {
    const guess = parseInt(guessInput.value);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      feedback.textContent = "Please enter a valid number between 1 and 100.";
      return;
    }

    fetch("http://localhost:3000/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess })
    })
      .then(response => response.json())
      .then(data => {
        feedback.textContent = data.message;
        guessHistory = data.guessHistory;
        guessHistoryEl.textContent = "Your guesses: " + guessHistory.join(", ");

        // If the guess is correct, submit the score
        if (data.result === "correct") {
          const playerName = prompt("Congratulations! Enter your name for the leaderboard:");
          if (playerName) {
            const attempts = guessHistory.length;
            fetch("http://localhost:3000/submit-score", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ playerName, attempts })
            })
              .then(response => response.json())
              .then(data => {
                alert("Score submitted! See the leaderboard.");
                window.location.href = "leaderboard.html";
              })
              .catch(error => {
                console.error("Error submitting score:", error);
              });
          }
        }
      })
      .catch(error => {
        feedback.textContent = "Error submitting guess.";
        console.error(error);
      });

    guessInput.value = "";
    guessInput.focus();
  });
});
