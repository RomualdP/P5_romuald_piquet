let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");


async function main() {
    const product = await productSpecList();
    displaySpec(product)   
  }



function productSpecList () {
    return fetch("http://localhost:3000/api/products/"+ id )
      .then(function(res) {
        if (res.ok) {
          return res.json();
// On retourne la réponse au format json
        }
      })
      .then(function(product) {
        return product
// On récupère les produits de la production list
      })
      .catch(function(err) {
        // Une erreur est survenue
      });
}

function displaySpec (product) {
    document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
    document.getElementById("title").textContent = product.name
    document.getElementById("price").textContent = product.price
    document.getElementById("description").textContent = product.description
    for (color in product.colors ) {
        document.getElementById("colors").innerHTML += `<option value="${product.colors[color]}">${product.colors[color]}</option>`
    }
}

main ()