// Fonction qui récupère les données d'une API selon l'adresse fournie. exportée pour être utilisée sur les autres modules

export async function productList(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Fonction auto appelée qui récupère les données de notre API et qui joue la fonction d'affichage pour chaque produit de l'API
(async function () {
  const products = await productList("http://localhost:3000/api/products");
  for (let product of products) {
    displayProducts(product);
  }
})();

// Pour chaque produit de la liste, on crée un bloc HTML avec chacune des variables
function displayProducts(product) {
  if (!document.getElementById("items")) return;
  document.getElementById(
    "items"
  ).innerHTML += `<a href="./product.html?id=${product._id}">
          <article>
            <img src="${product.imageUrl} " alt="${product.altTxt}"/>
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
          </article>
    </a>`;
}
