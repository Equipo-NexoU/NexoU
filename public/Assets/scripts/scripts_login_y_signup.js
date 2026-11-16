(() => {
  const screenAuth = document.getElementById("screen-auth");
  const screenApp = document.getElementById("screen-app");
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const emailInput = document.getElementById("auth-email");
  const passwordInput = document.getElementById("auth-password");
  const togglePasswordBtn = document.getElementById("toggle-password");
  const forgotLink = document.getElementById("forgot-link");
  const submitBtn = document.getElementById("auth-submit-btn");
  const authForm = document.getElementById("auth-form");
  const authFeedback = document.getElementById("auth-feedback");

  let mode = "login";

  function switchMode(newMode) {
    mode = newMode;
    const isLogin = mode === "login";
    tabLogin.classList.toggle("is-active", isLogin);
    tabLogin.setAttribute("aria-selected", String(isLogin));
    tabSignup.classList.toggle("is-active", !isLogin);
    tabSignup.setAttribute("aria-selected", String(!isLogin));

    emailInput.placeholder = isLogin ? "Enter your email" : "Register your email";
    submitBtn.textContent = isLogin ? "LOGIN" : "SIGN UP";
    forgotLink.hidden = !isLogin;
    authFeedback.hidden = true;
  }

  tabLogin.addEventListener("click", () => switchMode("login"));
  tabSignup.addEventListener("click", () => switchMode("signup"));

  togglePasswordBtn.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  });

  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    authFeedback.style.color = "#2b4c7e";
    authFeedback.textContent = "Ingresa un correo y contraseña para entrar al apartado Descubrir.";
    authFeedback.hidden = false;
  });

  function enterApp(email) {
    const rawName = email.split("@")[0] || "Brayan Espinoza";
    const formattedName = rawName.toLowerCase().includes("brayan")
      ? "Brayan Espinoza"
      : rawName.charAt(0).toUpperCase() + rawName.slice(1);

    document.getElementById("nx-header-username").textContent = formattedName;
    document.getElementById("nx-dropdown-username").textContent = formattedName;
    document.getElementById("nx-profile-name").textContent = formattedName;
    document.getElementById("nx-set-name").value = formattedName;

    screenAuth.hidden = true;
    screenApp.hidden = false;

    if (typeof window.nxNavigateTo === "function") {
      window.nxNavigateTo("descubrir");
    }
    if (typeof window.showToast === "function") {
      window.showToast(`¡Bienvenido a NexoU, ${formattedName}!`);
    }
  }

  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const pass = passwordInput.value.trim();

    if (!email || !pass) {
      authFeedback.style.color = "#c92a2a";
      authFeedback.textContent = "Por favor, ingresa tu correo y contraseña.";
      authFeedback.hidden = false;
      return;
    }
    enterApp(email);
  });

  document.querySelectorAll(".auth-social-btn").forEach((btn) => {
    btn.addEventListener("click", () => enterApp("brayan.espinoza@nexou.edu.pe"));
  });

  window.nxLogout = function () {
    screenApp.hidden = true;
    screenAuth.hidden = false;
    authForm.reset();
    authFeedback.hidden = true;
  };
})();