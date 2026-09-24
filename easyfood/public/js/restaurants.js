import { request } from "./api.js";

const list = document.querySelector("#restaurant-list");
const form = document.querySelector("#restaurant-form");
const message = document.querySelector("#form-message");
const loginLink = document.querySelector("#login-link");
const count = document.querySelector("#restaurant-count");

function getToken() {
  return localStorage.getItem("easyfood_token");
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
}

function updateLoginLink() {
  const user = JSON.parse(localStorage.getItem("easyfood_user"));

  if (!user) {
    return;
  }

  loginLink.href = "/";
  loginLink.textContent = `Sair (${user.name})`;
  loginLink.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("easyfood_token");
    localStorage.removeItem("easyfood_user");
    window.location.reload();
  });
}

function createCard(restaurant) {
  const card = document.createElement("article");
  card.className = "restaurant-card";
  card.innerHTML = `
    <span class="badge">${restaurant.category || "Sem categoria"}</span>
    <h3>${restaurant.name}</h3>
    <p class="rating">Nota ${Number(restaurant.rating || 0).toFixed(1)}</p>
  `;
  return card;
}

async function loadRestaurants() {
  try {
    const restaurants = await request("/restaurants");
    list.innerHTML = "";
    count.textContent = `${restaurants.length} cadastrados`;

    if (restaurants.length === 0) {
      list.innerHTML = "<p class=\"loading\">Ainda não existem restaurantes cadastrados.</p>";
      return;
    }

    restaurants.forEach((restaurant) => list.appendChild(createCard(restaurant)));
  } catch (error) {
    list.innerHTML = `<p class="message error">${error.message}</p>`;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = getToken();

  if (!token) {
    showMessage("Entre na sua conta antes de cadastrar um restaurante.", "error");
    return;
  }

  const formData = new FormData(form);
  const restaurant = Object.fromEntries(formData.entries());

  try {
    await request("/restaurants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(restaurant)
    });

    form.reset();
    showMessage("Restaurante cadastrado com sucesso!", "success");
    loadRestaurants();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

updateLoginLink();
loadRestaurants();
