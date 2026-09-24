import { request } from "./api.js";

const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const message = document.querySelector("#access-message");
const tabs = document.querySelectorAll(".tab");

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const isLogin = tab.dataset.form === "login";

    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    loginForm.classList.toggle("hidden", !isLogin);
    registerForm.classList.toggle("hidden", isLogin);
    showMessage("", "");
  });
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const user = Object.fromEntries(new FormData(registerForm).entries());

  try {
    await request("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    registerForm.reset();
    showMessage("Conta criada. Agora entre com seu e-mail e senha.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const credentials = Object.fromEntries(new FormData(loginForm).entries());

  try {
    const result = await request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });

    localStorage.setItem("easyfood_token", result.token);
    localStorage.setItem("easyfood_user", JSON.stringify(result.user));
    window.location.href = "/";
  } catch (error) {
    showMessage(error.message, "error");
  }
});
