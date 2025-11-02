document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const message = document.getElementById("message");
  const googleBtn = document.getElementById("googleLogin");

  // Handle local login
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value.trim();

    try {
      const res = await fetch("https://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard.html";
      } else {
        message.textContent = data.message || "Login failed";
        message.style.color = "red";
      }
    } catch (err) {
      message.textContent = "Error connecting to server";
      message.style.color = "red";
      console.error(err);
    }
  });

  // Handle Google login
  googleBtn.addEventListener("click", () => {
    window.location.href = "https://localhost:3001/auth/google";
  });
});
