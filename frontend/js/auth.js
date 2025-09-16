document.addEventListener("DOMContentLoaded", () => {
  // Safe storage wrapper (falls back to in-memory if blocked)
  function storageAvailable() {
    try {
      const x = "__test__";
      localStorage.setItem(x, "1");
      localStorage.removeItem(x);
      return true;
    } catch {
      return false;
    }
  }
  const _mem = {};
  const store = storageAvailable()
    ? localStorage
    : {
        getItem: (k) => (_mem.hasOwnProperty(k) ? _mem[k] : null),
        setItem: (k, v) => (_mem[k] = String(v)),
        removeItem: (k) => delete _mem[k],
      };

  function getUsers() {
    try {
      return JSON.parse(store.getItem("users")) || {};
    } catch {
      return {};
    }
  }
  function saveUsers(users) {
    try {
      store.setItem("users", JSON.stringify(users));
    } catch {
     
    }
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
      try { store.setItem("currentUser", username); } catch {}

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

      try { store.setItem("currentUser", username); } catch {}
      msg.textContent = "Signed in! Redirecting...";
      setTimeout(() => (window.location.href = "index.html"), 1000);
    });
  }
});
