import { productList } from "./script.js";
import { save, load } from "./localStorage.js"

// récupération de l'ID du produit via l'URL
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");

// fonction qui récupère les éléments de la promesse et qui execute la fonction d'affichage et auto executée
(async function () {
    const product = await productList("http://localhost:3000/api/products/"+ id);
    displaySpec(product)   
  }) ()


// Fonction simplifiée ci-dessus
// fonction qui retourne la promesse de l'API
// function productSpecList () {
//     return fetch("http://localhost:3000/api/products/"+ id )
//       .then(function(res) {
//         if (res.ok) {
//           return res.json();
// // On retourne la réponse au format json
//         }
//       })
//       .then(function(product) {
//         return product
// // On récupère les produits de la production list
//       })
//       .catch(function(err) {
//         // Une erreur est survenue
//       });
// }


// Fonction qui injecte les éléments dans la page html 
function displaySpec (product) {
    document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
    document.getElementById("title").textContent = product.name
    document.getElementById("price").textContent = product.price
    document.getElementById("description").textContent = product.description
    for (let color in product.colors ) {
        document.getElementById("colors").innerHTML += `<option value="${product.colors[color]}">${product.colors[color]}</option>`
    }
    
}


let addToCartBtn = document.getElementById("addToCart")
addToCartBtn.addEventListener('click', addProduct)

function addProduct() {  
  // if (!load("allProducts")) return
  let existingProducts = load("allProducts");
  if (existingProducts == null) existingProducts = [];
  let productID = id;
  let productColor = document.getElementById("colors").value;
  let productQuantity = parseInt(document.getElementById("quantity").value);
  let product = {
      "ID": productID,
      "Color": productColor,
      "Quantity": productQuantity
  };
  if ( product.Quantity > 0 && product.Color != null) {
    let existingProduct = existingProducts.find(prod => prod.ID === productID && prod.Color === productColor)
    let existingProductIndex = existingProducts.findIndex(prod => prod.ID === productID && prod.Color === productColor)

    if (existingProduct) {
      existingProducts[existingProductIndex].Quantity += productQuantity
    } else {
      existingProducts.push(product);
    }
  }
  save ("allProducts", existingProducts)
};

let productStored = load("allProducts")
console.log(productStored)
// function storageReset () {
//   localStorage.clear()
// }
// storageReset()