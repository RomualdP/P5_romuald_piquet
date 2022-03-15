import { save, load } from "./localStorage.js";
import { productList } from "./script.js";

const productInCart = load("allProducts");
let totalProductQuantity = 0
let totalProductPrice = 0

for (let product of productInCart) {
    displayCart (product)
    totalQuantity (product)
    totalPrice (product)
}

async function displayCart(product) {
    const productData = await productList("http://localhost:3000/api/products/");
    const templateEl = document.getElementById("productInCartTemplate");
    const cloneEl = document.importNode(templateEl.content, true);

    let productDataByID = productData.find( (article) => article._id === product.ID );
    // console.log(productDataByID.imageUrl);
    cloneEl.getElementById("name").textContent = productDataByID.name;
    cloneEl.getElementById("price").textContent = productDataByID.price;
    // cloneEl.getElementById("productImg").src = productDataByID.imageUrl;
    cloneEl.getElementById("color").textContent = product.Color;
    cloneEl.getElementById("quantity").value = product.Quantity;
    document.getElementById("cart__items").appendChild(cloneEl)

    return productDataByID
}

function totalQuantity (product) {
    totalProductQuantity += product.Quantity 
    document.getElementById("totalQuantity").textContent  = totalProductQuantity
}

async function totalPrice (product) {
    const productData = await productList("http://localhost:3000/api/products/");
    let productDataByID = productData.find( (article) => article._id === product.ID );
    totalProductPrice += productDataByID.price * product.Quantity
    document.getElementById("totalPrice").textContent  = totalProductPrice
}

// voir comment résoudre le pb de la fonction async
