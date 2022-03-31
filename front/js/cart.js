import { save, load } from "./localStorage.js";
import { productList } from "./script.js";

let productInCart = load("allProducts");
let totalProductQuantity = 0;
let totalProductPrice = 0;

// Fonction d'affichage dynamique des produits du panier
function reload() {
  // initialisation des variables de quantités et de prix
  totalProductQuantity = 0;
  totalProductPrice = 0;

  // chargement du localStorage
  productInCart = load("allProducts");
  if (productInCart.length === 0) {
    // Affichage vierge si le tableau est vide
    document.getElementById("totalQuantity").textContent = "";
    document.getElementById("totalPrice").textContent = "";
  }

  for (let product of productInCart) {
    // affichage des produits dans le panier que s'ils ne sont pas déjà affichés
    if (document.getElementById("cart__items").innerText == "") {
      displayCart(product);
    }
    totalQuantity(product);
    totalPrice(product);
  }
}
reload(); // appel de la fonction dynamique

// fonction d'affichage des produits sur la page panier
async function displayCart(product) {
  const productData = await productList("http://localhost:3000/api/products/");
  let productDataByID = productData.find(
    (article) => article._id === product.ID
  ); // variable permettant de récupérer les informations non présentes dans le localStorage
  if (!document.getElementById("cart__items")) return;
  document.getElementById(
    "cart__items"
  ).innerHTML += `<article class="cart__item" data-id="${productDataByID._id}" data-color="${product.Color}">
        <div class="cart__item__img">
            <img src="${productDataByID.imageUrl}" alt="Photographie d'un canapé">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${productDataByID.name}</h2> 
                <p>${product.Color}</p>
                <p>${productDataByID.price}€</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.Quantity}"/>
                </div>
                <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
                </div>
            </div>
        </div>
    </article>`;

  // Ajout des event sur les modifications de quantités et sur le bouton de suppression
  document.querySelectorAll(".itemQuantity").forEach((item) => {
    item.addEventListener("change", changeQuantity);
  });
  document.querySelectorAll(".deleteItem").forEach((item) => {
    item.addEventListener("click", deleteProduct);
  });
}

// Calcul de la quantité totale
function totalQuantity(product) {
  totalProductQuantity += parseInt(product.Quantity);
  document.getElementById("totalQuantity").textContent = totalProductQuantity;
}

// Calcul du prix, avec utilisation de l'API pour récupérer les prix des produits
async function totalPrice(product) {
  const productData = await productList("http://localhost:3000/api/products/");
  let productDataByID = productData.find(
    (article) => article._id === product.ID
  );
  totalProductPrice += productDataByID.price * product.Quantity;
  document.getElementById("totalPrice").textContent = totalProductPrice;
}

// fonction de mofication de la quantité également modifiée dans le localStorage grace à l'ID présent dans le data-set de l'article
function changeQuantity() {
  let productInCart = load("allProducts");
  let inputQuantity = event.target;
  let closestArticle = inputQuantity.closest("article");
  let productInCartByIdAndColor = productInCart.find(
    (item) =>
      item.ID === closestArticle.dataset.id &&
      item.Color === closestArticle.dataset.color
  );
  productInCartByIdAndColor.Quantity = inputQuantity.value;

  save("allProducts", productInCart);
  reload(); // appel de la fonction de reload pour l'affichage dynamique
}

// fonction de suppression de l'article dans le localStorage et suppression dans l'affichage via remove()
function deleteProduct() {
  let productInCart = load("allProducts");
  let deleteBtn = event.target;
  let closestArticle = deleteBtn.closest("article");
 
  let productIndex = productInCart.findIndex(
    (item) =>
      item.ID === closestArticle.dataset.id &&
      item.Color === closestArticle.dataset.color
  );
  productInCart.splice(productIndex, 1)
  
  save("allProducts", productInCart);
  deleteBtn.closest("article").remove();
  reload(); // appel de la fonction de reload pour l'affichage dynamique
}

// fonction de vérification des données saisies par l'utilisateur avec regex, renvoie les données demandées ensuite pour la route post de l'API
function formCheck() {
  productInCart = load("allProducts");

  // création du tableau d'id
  let products = [];
  for (let product of productInCart) {
    products.push(product.ID);
  }

  // récupération des données utilisateur
  let contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };

  // filtres pour les différents regex
  let firstNameRegex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  let lastNameRegex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  let addressRegex = /^[a-zA-Z0-9\s,'-]+$/u;
  let cityNameRegex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  let emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  // vérification des regex
  let firstNameCheck = firstNameRegex.test(contact.firstName);
  let lastNameCheck = lastNameRegex.test(contact.lastName);
  let addressCheck = addressRegex.test(contact.address);
  let cityCheck = cityNameRegex.test(contact.city);
  let emailCheck = emailRegex.test(contact.email);

  // Affichage des messages d'erreur si les tests sont retournés false
  if (firstNameCheck != true) {
    document.getElementById("firstNameErrorMsg").textContent =
      "format non valide";
  } else {
    document.getElementById("firstNameErrorMsg").textContent = "";
  }
  if (lastNameCheck != true) {
    document.getElementById("lastNameErrorMsg").textContent =
      "format non valide";
  } else {
    document.getElementById("lastNameErrorMsg").textContent = "";
  }
  if (addressCheck != true) {
    document.getElementById("addressErrorMsg").textContent =
      "format non valide";
  } else {
    document.getElementById("addressErrorMsg").textContent = "";
  }
  if (cityCheck != true) {
    document.getElementById("cityErrorMsg").textContent = "format non valide";
  } else {
    document.getElementById("cityErrorMsg").textContent = "";
  }
  if (emailCheck != true) {
    document.getElementById("emailErrorMsg").textContent = "format non valide";
  } else {
    document.getElementById("emailErrorMsg").textContent = "";
  }

  // Si toutes les données sont corectements remplies, retourne le tableau d'ID et le contact
  if (
    firstNameCheck == true &&
    lastNameCheck == true &&
    addressCheck == true &&
    cityCheck == true &&
    emailCheck == true
  ) {
    return { products, contact };
  }
}

// Fonction de fest POST
async function fetchPost(key) {
  let response = await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(key),
  });
  let data = await response.json();
  return data;
}

// Fonction de l'envoie de commande une fois les données utilisateur vérifiées
async function order() {
  const formData = formCheck(); // récupération des données utilisateur
  if (formData == null) return; // vérification que les données existent et sont donc correctes
  const orderData = await fetchPost(formData);
  const orderId = orderData.orderId; // récupération de l'orderId
  window.location.href = "confirmation.html?orderid=" + orderId; // redirection vers la page de confirmation avec l'ID de commande transmis dans l'URL
}

// ajout de l'event sur le bouton de commande avec la fonction order
let orderBtn = document.getElementById("order");
orderBtn.addEventListener("click", order);

