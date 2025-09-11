document.addEventListener("DOMContentLoaded", () => {
  const leaderboardBody = document.getElementById("leaderboard-body");

  // tiny helper that also surfaces 4xx/5xx
  async function api(path) {
    const url = `${window.API_URL}${path}`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} on ${url}\n${text.slice(0,200)}`);
    }
    return res.json();
  }

  api("/leaderboard")
    .then((data) => {
      const leaderboard = Array.isArray(data) ? data : data.leaderboard;
      if (!Array.isArray(leaderboard)) throw new Error("Leaderboard is not an array.");

      if (leaderboard.length === 0) {
        leaderboardBody.innerHTML = `<tr><td colspan="4">No scores yet. Be the first!</td></tr>`;
        return;
      }

      leaderboard.forEach((entry, index) => {
        const row = document.createElement("tr");
        const trophyIcon = index === 0
          ? `<img src="./img/cup.jpg" alt="Trophy" style="width:20px;vertical-align:middle;margin-right:6px;" />`
          : "";
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${trophyIcon}${entry.playerName ?? "Anonymous"}</td>
          <td>${entry.attempts ?? "-"}</td>
          <td>${entry.date ? new Date(entry.date).toLocaleString() : "-"}</td>
        `;
        leaderboardBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error fetching leaderboard:", err);
      leaderboardBody.innerHTML = `<tr><td colspan="4">Error loading leaderboard. Please try again later.</td></tr>`;
    });
});
