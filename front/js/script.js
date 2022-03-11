async function main() {
  const products = await productList();
  for (product of products) {
    displayProducts(product);
  }
}

function productList() {
  return fetch("http://localhost:3000/api/products")
    .then(function (res) {
      if (res.ok) {
        return res.json();
        // On retourne la réponse au format json
      }
    })
    .then(function (products) {
      return products;
      // On récupère les produits de la production list
    })
    .catch(function (err) {
      // Une erreur est survenue
    });
}

// Pour chaque produit de la liste, on crée un bloc HTML avec chacune des variables

function displayProducts() {
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

main();
