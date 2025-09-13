document.addEventListener("DOMContentLoaded", () => {
  // Helper: load & save users
  function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || {};
  }
  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  // --- Sign Up ---
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("signup-username").value.trim();
      const password = document.getElementById("signup-password").value.trim();
      const msg = document.getElementById("signup-msg");
      msg.textContent = "";

      if (!username || !password) {
        msg.textContent = "Please fill in both fields.";
        return;
      }

      const users = getUsers();
      if (users[username]) {
        msg.textContent = "Username already exists!";
        return;
      }

      users[username] = { password }; 
      saveUsers(users);
      localStorage.setItem("currentUser", username);

      msg.textContent = "Account created! Redirecting...";
      setTimeout(() => (window.location.href = "index.html"), 1000);
    });
  }

  // --- Sign In ---
  const signinForm = document.getElementById("signin-form");
  if (signinForm) {
    signinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("signin-username").value.trim();
      const password = document.getElementById("signin-password").value.trim();
      const msg = document.getElementById("signin-msg");
      msg.textContent = "";

      if (!username || !password) {
        msg.textContent = "Please fill in both fields.";
        return;
      }

      const users = getUsers();
      if (!users[username] || users[username].password !== password) {
        msg.textContent = "Invalid username or password.";
        return;
      }

      localStorage.setItem("currentUser", username);
      msg.textContent = "Signed in! Redirecting...";
      setTimeout(() => (window.location.href = "index.html"), 1000);
    });
  }
});
