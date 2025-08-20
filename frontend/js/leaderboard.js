document.addEventListener("DOMContentLoaded", function () {
  const leaderboardBody = document.getElementById("leaderboard-body");

  fetch("http://localhost:3000/leaderboard")
    .then(response => response.json())
    .then(data => {
      // Use correct property if backend returns { leaderboard: [...] }
      const leaderboard = Array.isArray(data) ? data : data.leaderboard;

      if (!Array.isArray(leaderboard)) {
        throw new Error("Leaderboard data is not an array.");
      }

      leaderboard.forEach((entry, index) => {
        const row = document.createElement("tr");
        const trophyIcon = index === 0
    ? `<img src="img/cup.jpg" alt="Trophy" style="width: 20px; vertical-align: middle; margin-right: 5px;" />`
    : "";
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${trophyIcon}${entry.playerName}</td>
          <td>${entry.attempts}</td>
          <td>${new Date(entry.date).toLocaleString()}</td>
        `;
        leaderboardBody.appendChild(row);
      });

      if (leaderboard.length === 0) {
        leaderboardBody.innerHTML = `<tr><td colspan="4">No scores yet. Be the first!</td></tr>`;
      }
    })
    .catch(error => {
      console.error("Error fetching leaderboard:", error);
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="4">Error loading leaderboard. Please try again later.</td>`;
      leaderboardBody.appendChild(row);
    });
});
