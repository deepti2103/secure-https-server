console.log("✅ dashboard.js loaded");

(async () => {
  const token = localStorage.getItem("token");
  console.log("Token in dashboard:", token);

  if (!token) {
    alert("Please log in first!");
    window.location.href = "/login.html";
    return;
  }

  try {
    const res = await fetch("https://localhost:3001/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Dashboard API status:", res.status);

    const data = await res.json();
    console.log("Dashboard API data:", data);

    if (res.ok) {
      const contentEl = document.getElementById("content");

      if (!contentEl) {
        console.error("❌ #content element not found");
        return;
      }

      // Inject main dashboard UI
      contentEl.innerHTML = `
        <h1>Welcome, ${data.user.username}! 🎉</h1>
        <p>You’ve successfully accessed the secure dashboard.</p>

        <div id="userInfo">
          <p><strong>Username:</strong> ${data.user.username}</p>
        </div>

        <hr />

        <div id="profileSection">
          <h2>Update Profile</h2>

          <form id="profileForm">
            <label>
              Name:
              <input type="text" id="name" placeholder="Enter your name" required />
            </label>
            <br /><br />

            <label>
              Email:
              <input type="email" id="email" placeholder="Enter your email" required />
            </label>
            <br /><br />

            <label>
              Bio:
              <textarea id="bio" placeholder="Tell us about yourself" maxlength="500"></textarea>
            </label>
            <br /><br />

            <button type="submit">Update Profile</button>
          </form>

          <p id="profileMessage" style="color: yellow; margin-top: 10px; font-weight: bold;"></p>
        </div>

        <button id="logoutBtn">Logout</button>
      `;

      // ✅ After rendering the form, fetch existing profile to prefill fields
      try {
        const profileRes = await fetch("https://localhost:3001/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          console.log("Loaded profile:", profileData);

          const profile = profileData.profile || {};

          const nameInput = document.getElementById("name");
          const emailInput = document.getElementById("email");
          const bioInput = document.getElementById("bio");

          if (nameInput && profile.name) {
            nameInput.value = profile.name;
          }
          if (emailInput && profile.email) {
            emailInput.value = profile.email;
          }
          if (bioInput && profile.bio) {
            bioInput.value = profile.bio;
          }
        } else {
          console.warn("Could not load profile:", await profileRes.text());
        }
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }

      // ✅ Logout button behavior
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          console.log("Logging out, clearing token");
          localStorage.removeItem("token");
          window.location.href = "/login.html";
        });
      } else {
        console.warn("⚠️ Logout button not found");
      }

      // ✅ Client-side validation + submit for the profile form
      const profileForm = document.getElementById("profileForm");
      const profileMessage = document.getElementById("profileMessage");

      console.log("profileForm:", profileForm);
      console.log("profileMessage element:", profileMessage);

      if (profileForm) {
        profileForm.addEventListener("submit", async (e) => {
          e.preventDefault(); // prevent page reload
          console.log("▶️ Profile form submitted");

          if (!profileMessage) {
            console.error("❌ #profileMessage not found");
            return;
          }

          // Clear previous message
          profileMessage.textContent = "";

          const nameInput = document.getElementById("name");
          const emailInput = document.getElementById("email");
          const bioInput = document.getElementById("bio");

          if (!nameInput || !emailInput || !bioInput) {
            console.error("❌ One or more input fields not found");
            return;
          }

          const name = nameInput.value.trim();
          const email = emailInput.value.trim();
          const bio = bioInput.value.trim();

          console.log("Form values:", { name, email, bio });

          // 🔒 FRONT-END VALIDATION

          // 1. Name: 3–50 alphabetic characters + spaces
          const nameRegex = /^[A-Za-z\s]{3,50}$/;
          if (!nameRegex.test(name)) {
            profileMessage.textContent =
              "Name must be 3–50 alphabetic characters (letters and spaces only).";
            return;
          }

          // 2. Email: basic standard email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            profileMessage.textContent = "Please enter a valid email address.";
            return;
          }

          // 3. Bio: max 500 chars, no HTML tags, no special characters
          if (bio.length > 500) {
            profileMessage.textContent = "Bio must be 500 characters or less.";
            return;
          }

          // Reject HTML tags like <script>, <b>, etc.
          const htmlTagRegex = /<[^>]*>/;
          if (htmlTagRegex.test(bio)) {
            profileMessage.textContent =
              "Bio cannot contain HTML tags (like <b>, <script>, etc.).";
            return;
          }

          // Allow only letters, numbers, spaces, and basic punctuation
          const bioAllowedRegex = /^[A-Za-z0-9\s.,!?'"()\-]*$/;
          if (!bioAllowedRegex.test(bio)) {
            profileMessage.textContent =
              "Bio contains invalid characters. Use letters, numbers, spaces, and basic punctuation only.";
            return;
          }

          // If we reach here, front-end validation passed
          profileMessage.textContent = "Sending profile securely to the server...";

          try {
            const currentToken = localStorage.getItem("token");
            if (!currentToken) {
              profileMessage.textContent =
                "❌ No token found. Please log in again.";
              window.location.href = "/login.html";
              return;
            }

            const res = await fetch("https://localhost:3001/api/profile", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentToken}`,
              },
              body: JSON.stringify({ name, email, bio }),
            });

            const responseData = await res.json();
            console.log("Profile server response:", responseData);

            if (res.ok) {
              profileMessage.textContent =
                "✅ " +
                (responseData.message ||
                  "Profile securely updated with encryption.");
            } else {
              profileMessage.textContent =
                responseData.message ||
                "❌ Server rejected profile update. Please try again.";
            }
          } catch (err) {
            console.error("❌ Error sending profile to server:", err);
            profileMessage.textContent =
              "❌ Error sending profile to server. Check console for details.";
          }
        });
      } else {
        console.warn("⚠️ #profileForm not found");
      }
    } else {
      alert(data.message || "Access denied");
      localStorage.removeItem("token");
      window.location.href = "/login.html";
    }
  } catch (err) {
    console.error("⚠️ Dashboard access error:", err);
    alert("Session expired or invalid. Please log in again.");
    localStorage.removeItem("token");
    window.location.href = "/login.html";
  }
})();
