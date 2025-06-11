document.addEventListener("DOMContentLoaded", () => {
  // Sign Up
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("signup-username").value;
      const password = document.getElementById("signup-password").value;

      const users = JSON.parse(localStorage.getItem("users")) || {};
      if (users[username]) {
        document.getElementById("signup-msg").textContent = "Username already exists!";
        return;
      }

      users[username] = { password };
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", username);

      document.getElementById("signup-msg").textContent = "Account created! Redirecting...";
      setTimeout(() => (window.location.href = "index.html"), 1500);
    });
  }

  // Sign In
  const signinForm = document.getElementById("signin-form");
  if (signinForm) {
    signinForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("signin-username").value;
      const password = document.getElementById("signin-password").value;

      const users = JSON.parse(localStorage.getItem("users")) || {};
      if (!users[username] || users[username].password !== password) {
        document.getElementById("signin-msg").textContent = "Invalid username or password.";
        return;
      }

      localStorage.setItem("currentUser", username);
      document.getElementById("signin-msg").textContent = "Signed in! Redirecting...";
      setTimeout(() => (window.location.href = "index.html"), 1500);
    });
  }
});
