document.addEventListener("DOMContentLoaded", function () {
  const playButton = document.getElementById("play-btn");
  const loginButton = document.getElementById("login-btn");
  const signupButton = document.getElementById("signup-btn");

  playButton.addEventListener("click", function () {
    window.location.href = "game.html";
  });

  loginButton.addEventListener("click", function () {
    window.location.href = "login.html";
  });

  signupButton.addEventListener("click", function () {
    window.location.href = "signup.html";
  });
});
