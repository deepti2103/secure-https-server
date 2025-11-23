// ✅ Redirect if already logged in
const token = localStorage.getItem("token");
if (token) {
  window.location.href = "/dashboard.html";
}

// ✅ Handle registration form
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("https://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful! Redirecting to dashboard...");

      // ✅ Auto-login right after registration
      const loginRes = await fetch("https://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginRes.json();
      if (loginRes.ok && loginData.token) {
        localStorage.setItem("token", loginData.token);
        window.location.href = "/dashboard.html";
      } else {
        alert("Auto-login failed. Please log in manually.");
        window.location.href = "/login.html";
      }
    } else {
      alert(data.message || "Registration failed.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred during registration.");
  }
});
