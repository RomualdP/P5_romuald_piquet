// Import des fonctions pour récupérer les données de l'API (productList) et pour la lecture/sauvegarde du localStorage
import { productList } from "./script.js";
import { save, load } from "./localStorage.js";

// récupération de l'ID du produit via l'URL
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");

// fonction qui récupère les éléments de la promesse et qui execute la fonction d'affichage et auto executée
(async function () {
  const product = await productList("http://localhost:3000/api/products/" + id);
  displaySpec(product);
})();

// Fonction qui injecte les éléments dans la page html
function displaySpec(product) {
  document.querySelector(
    ".item__img"
  ).innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  document.getElementById("title").textContent = product.name;
  document.getElementById("price").textContent = product.price;
  document.getElementById("description").textContent = product.description;
  for (let color in product.colors) {
    document.getElementById(
      "colors"
    ).innerHTML += `<option value="${product.colors[color]}">${product.colors[color]}</option>`;
  }
}

// ajout de l'event click pour appeler la fonction d'ajout de produit
let addToCartBtn = document.getElementById("addToCart");
addToCartBtn.addEventListener("click", addProduct);

// Fonction pour ajouter le produit au localStorage
function addProduct() {
 
  let existingProducts = load("allProducts"); // Chargement du localStorage
  if (existingProducts == null) existingProducts = []; // vérification si le localStorage contient déjà un tableau sinon création de celui ci
  
  // Récupération des données sélectionnées par l'utilisateur
  let productID = id;
  let productColor = document.getElementById("colors").value;
  let productQuantity = parseInt(document.getElementById("quantity").value);

  //attribution des données utilisateur à l'object product
  let product = {
    ID: productID,
    Color: productColor,
    Quantity: productQuantity,
  };
  console.log(product.Color)
  // Vérification que l'utilisateur a bien saisi les données
  if (product.Quantity > 0 && product.Color != "") {
    // Vérification si le produit existe déjà dans le tableau de notre localStorage et son index dans le tableau
    let existingProduct = existingProducts.find(
      (prod) => prod.ID === productID && prod.Color === productColor
    );
    let existingProductIndex = existingProducts.findIndex(
      (prod) => prod.ID === productID && prod.Color === productColor
    );

    if (existingProduct) { // S'il existe déjà ajout de la quantité
      existingProducts[existingProductIndex].Quantity += productQuantity;
    } else { // Sinon création du produit dans le tableau
      existingProducts.push(product);
    }
  }
  save("allProducts", existingProducts); // Sauvegarde dans le localStorage
}

