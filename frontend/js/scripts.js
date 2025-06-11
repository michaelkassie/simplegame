document.addEventListener("DOMContentLoaded", function () {
  const playButton = document.getElementById("play-btn");
  const loginButton = document.getElementById("login-btn");
  const signupButton = document.getElementById("signup-btn");
  const logoutButton = document.getElementById("logout-btn");

  // Navigate to different pages
  playButton?.addEventListener("click", function () {
    window.location.href = "game.html";
  });

  loginButton?.addEventListener("click", function () {
    window.location.href = "signin.html";
  });

  signupButton?.addEventListener("click", function () {
    window.location.href = "signup.html";
  });

  // Handle current user session
  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    // Show welcome message
    const welcome = document.createElement("p");
    welcome.textContent = `Welcome, ${currentUser}!`;
    welcome.classList.add("welcome-text");
    document.body.prepend(welcome);

    // Hide login/signup, show logout
    if (loginButton) loginButton.style.display = "none";
    if (signupButton) signupButton.style.display = "none";
    if (logoutButton) logoutButton.style.display = "inline-block";
  }

  // Logout functionality
  logoutButton?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.reload();
  });
});
