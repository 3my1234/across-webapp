const apiBase = "https://api.atlxpres.com";
const appDownloadUrl = "https://expo.dev/accounts/3my1991/projects/across-test/builds";

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

function wireDownloadPopup() {
  const popup = document.getElementById("downloadPopup");
  const dismiss = document.getElementById("dismissPopup");
  const seenKey = "atlanticexpress.downloadPopupSeen";

  if (!popup || !dismiss) return;
  if (sessionStorage.getItem(seenKey) === "1") return;

  const openPopup = () => {
    popup.classList.add("open");
    popup.setAttribute("aria-hidden", "false");
  };
  const closePopup = () => {
    popup.classList.remove("open");
    popup.setAttribute("aria-hidden", "true");
    sessionStorage.setItem(seenKey, "1");
  };

  setTimeout(openPopup, 4000);
  dismiss.addEventListener("click", closePopup);
  popup.addEventListener("click", (event) => {
    if (event.target === popup) closePopup();
  });

  document.querySelectorAll(`a[href="${appDownloadUrl}"]`).forEach((link) => {
    link.addEventListener("click", closePopup);
  });
}

checkApi();
wireAuthForms();
wireDownloadPopup();
