import { save, load } from "./localStorage.js";
import { productList } from "./script.js";

let productInCart = load("allProducts");
let totalProductQuantity = 0;
let totalProductPrice = 0;

function reload () {
  totalProductQuantity = 0;
  totalProductPrice = 0;
  productInCart = load("allProducts");
  if (productInCart.length === 0) {
    document.getElementById("totalQuantity").textContent = "" ;
    document.getElementById("totalPrice").textContent = "" ;
  }
  // document.getElementById("cart__items").innerHTML = "";
  for (let product of productInCart) {
    if (document.getElementById("cart__items").innerText == "") {
      displayCart(product)
    }
    totalQuantity(product);
    totalPrice(product); 
  } 
}
reload()
// async function displayCart(product) {
//   const productData = await productList("http://localhost:3000/api/products/");
//   const templateEl = document.getElementById("productInCartTemplate");
//   const cloneEl = document.importNode(templateEl.content, true);
//   let quantityInput = cloneEl.getElementById("quantity");
//   quantityInput.addEventListener(`change`, function changeQuantity (product){
//       console.log(product)
//   })
//   let productDataByID = productData.find(
//     (article) => article._id === product.ID
//   );
//   cloneEl.querySelector(".cart__item").dataset.id = productDataByID._id;
//   cloneEl.querySelector(".cart__item").dataset.color = product.Color;
//   cloneEl.getElementById("name").textContent = productDataByID.name;
//   cloneEl.getElementById("price").textContent = productDataByID.price;
//   cloneEl.getElementById("productImg").src = String(productDataByID.imageUrl);
//   cloneEl.getElementById("color").textContent = product.Color;
//   cloneEl.getElementById("quantity").value = product.Quantity;

//   document.getElementById("cart__items").appendChild(cloneEl);

// }

async function displayCart(product) {
    const productData = await productList("http://localhost:3000/api/products/");
    let productDataByID = productData.find((article) => article._id === product.ID);
    if (!document.getElementById("cart__items")) return;
    document.getElementById(
    "cart__items"
    ).innerHTML += 
    
    `<article class="cart__item" data-id="${productDataByID._id}" data-color="${product.Color}">
        <div class="cart__item__img">
            <img src="${productDataByID.imageUrl}" alt="Photographie d'un canapé">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${productDataByID.name}</h2> 
                <p>${product.Color}</p>
                <p>${productDataByID.price} €</p>
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
    </article>`
    document.querySelectorAll(".itemQuantity").forEach(item => {item.addEventListener("change", changeQuantity)});
    document.querySelectorAll(".deleteItem").forEach(item => {item.addEventListener("click", deleteProduct)});
}


function totalQuantity(product) {
  totalProductQuantity += parseInt(product.Quantity);
  document.getElementById("totalQuantity").textContent = totalProductQuantity;
}

async function totalPrice(product) {
  const productData = await productList("http://localhost:3000/api/products/");
  let productDataByID = productData.find(
    (article) => article._id === product.ID
  );
  totalProductPrice += productDataByID.price * product.Quantity;
  document.getElementById("totalPrice").textContent = totalProductPrice;
}

function changeQuantity (){
    let productInCart = load("allProducts");
    let inputQuantity = event.target;
    let closestArticle = inputQuantity.closest("article");
    let productInCartByIdAndColor = productInCart.find((item) => item.ID === closestArticle.dataset.id && item.Color === closestArticle.dataset.color);
    productInCartByIdAndColor.Quantity = inputQuantity.value
    
    save("allProducts", productInCart)
    reload ();
}

function deleteProduct () {
  let productInCart = load("allProducts");
  let deleteBtn = event.target;
  let closestArticle = deleteBtn.closest("article");
  let productInCartByIdAndColor = productInCart.find((item) => item.ID === closestArticle.dataset.id && item.Color === closestArticle.dataset.color);
  productInCart = productInCart.filter( (item) => item.ID != productInCartByIdAndColor.ID && item.Color != productInCartByIdAndColor.Color )
  save("allProducts", productInCart)
  deleteBtn.closest("article").remove()
  reload ();
}



async function order () {
  productInCart = load("allProducts");
  
  let products = []
  for (let product of productInCart) {
    products.push(product.ID)
  }
  
  let contact = {
    firstName : document.getElementById("firstName").value,
    lastName : document.getElementById("lastName").value,
    address : document.getElementById("address").value,
    city : document.getElementById("city").value,
    email : document.getElementById("email").value,
  }
   
  let firstNameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  let lastNameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  let addressRegex = /^[a-zA-Z0-9\s,'-]+$/u;
  let cityNameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


  let firstNameCheck = firstNameRegex.test(contact.firstName);
  let lastNameCheck = lastNameRegex.test(contact.lastName);
  let addressCheck = addressRegex.test(contact.address);
  let cityCheck = cityNameRegex.test(contact.city);
  let emailCheck = emailRegex.test(contact.email);

  if (firstNameCheck != true ) {
    document.getElementById("firstNameErrorMsg").textContent = "format non valide"
  } else {
    document.getElementById("firstNameErrorMsg").textContent = ""
  }
  if (lastNameCheck != true ) {
    document.getElementById("lastNameErrorMsg").textContent = "format non valide"
  } else {
    document.getElementById("lastNameErrorMsg").textContent = ""
  }
  if (addressCheck != true ) {
    document.getElementById("addressErrorMsg").textContent = "format non valide"
  } 
  else {
    document.getElementById("addressErrorMsg").textContent = ""
  }
  if (cityCheck != true ) {
    document.getElementById("cityErrorMsg").textContent = "format non valide"
  } else {
    document.getElementById("cityErrorMsg").textContent = ""
  }
  if (emailCheck != true ) {
    document.getElementById("emailErrorMsg").textContent = "format non valide"
  } else {
    document.getElementById("emailErrorMsg").textContent = ""
  }
  if ( firstNameCheck == true && lastNameCheck == true && addressCheck == true && cityCheck == true && emailCheck == true) {
    let order = {products, contact} 
    console.log(order)
    let response = await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
    });
    let data = await response.json();
    console.log(data)
  }
  
}

let orderBtn = document.getElementById("order")
orderBtn.addEventListener("click", order)