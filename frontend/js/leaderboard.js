document.addEventListener("DOMContentLoaded", function () {
  const leaderboardBody = document.getElementById("leaderboard-body");

  fetch("http://localhost:3000/leaderboard")
    .then(response => response.json())
    .then(data => {
      const { leaderboard } = data;
      leaderboard.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${entry.playerName}</td>
          <td>${entry.attempts}</td>
          <td>${new Date(entry.date).toLocaleString()}</td>
        `;
        leaderboardBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Error fetching leaderboard:", error);
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="4">Error loading leaderboard. Please try again later.</td>`;
      leaderboardBody.appendChild(row);
    });
});
