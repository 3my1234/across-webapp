const apiBase = "https://atlanticexpress-api.sportbanter.online";

async function checkApi() {
  const state = document.getElementById("healthState");
  try {
    const response = await fetch(`${apiBase}/api/v1/health`);
    const data = await response.json();
    state.textContent = data.ok ? "Online" : "Unexpected response";
    state.classList.toggle("online", Boolean(data.ok));
  } catch {
    state.textContent = "Offline";
    state.classList.remove("online");
  }
}

function wireAuthForms() {
  const handleSubmit = async (event, action) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const endpoint = action === "signin" ? "/api/v1/auth/login" : "/api/v1/auth/signup";
    const response = await fetch(`${apiBase}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      alert(data.message || "Request failed");
      return;
    }
    alert(`Success. Session token received for ${data.user_id || "account"}.`);
  };

  document.getElementById("signinForm").addEventListener("submit", (event) => handleSubmit(event, "signin"));
  document.getElementById("signupForm").addEventListener("submit", (event) => handleSubmit(event, "signup"));
}

checkApi();
wireAuthForms();
