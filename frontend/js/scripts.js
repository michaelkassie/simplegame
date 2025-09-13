document.addEventListener("DOMContentLoaded", function () {
  const playButton = document.getElementById("play-btn");
  const loginButton = document.getElementById("login-btn");
  const signupButton = document.getElementById("signup-btn");
  const logoutButton = document.getElementById("logout-btn");

  // Navigate to different pages
  playButton?.addEventListener("click", () => (window.location.href = "game.html"));
  loginButton?.addEventListener("click", () => (window.location.href = "signin.html"));
  signupButton?.addEventListener("click", () => (window.location.href = "signup.html"));

  // Safe storage helper
  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null; // fallback if storage unavailable
    }
  }
  function safeRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch {}
  }

  // Handle current user session
  const currentUser = safeGet("currentUser");
  if (currentUser) {
    // Show welcome message
    const welcome = document.createElement("p");
    welcome.textContent = `Welcome, ${currentUser}!`;
    welcome.classList.add("welcome-text");
    document.body.prepend(welcome);

    // Hide login/signup, show logout
    loginButton && (loginButton.style.display = "none");
    signupButton && (signupButton.style.display = "none");
    logoutButton && (logoutButton.style.display = "inline-block");
  }

  // Logout functionality
  logoutButton?.addEventListener("click", () => {
    safeRemove("currentUser");
    window.location.reload();
  });
});
