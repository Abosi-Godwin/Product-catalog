/* Store all the products */
let allProducts = [];


/* Generic function for API call*/
const apiCaller = async url => {
  try {
    const fetchedData = await fetch(url);
    const response = await fetchedData.json();
    return response;
  } catch (error) {
    console.log(`Error making api call ${error}`);
  }
}


/* fetch the product through API*/
const getProducts = async () => {
  allProducts = [...(await apiCaller("https://fakestoreapi.com/products"))];
  updateProductsCatalogue(allProducts, "default");
}
getProducts();


/* creating the products HTML elements*/
const createProductsElement = productDatas => {
  return `
        <div class="pdt w-full shadow-lg p-3 rounded bg-white">
        <div class="fave">
        <ion-icon class="heart" name="heart"></ion-icon>
        </div>
        <div class="product-info">
        
          <img src="${productDatas.image}" alt="" class="product-img h-80 w-full p-2 rounded border-4">
          
          <div class="py-4">
          <div class="ratings-cont">
          <h1 id="star-rating" class="font-bold mb-1 tracking-wide text-lg">${generateStarRating(productDatas.rating.rate)}
          ${productDatas.rating.rate} Of ${productDatas.rating.count} Reviews 
          </h1>
          </div>
          <p class="category uppercase font-bold category">${productDatas.category}</p>
         
          <h3 class="product-title my-1.5">${productDatas.title}</h3>
          <h2 class="price font-bold text-2xl">$${productDatas.price.toFixed(2)}</h2>
        </div>
        </div>
        
        <div class="cart">
        <button class="addToCart uppercase text-md rounded font-bold p-2 w-full text-white"> add to cart </button>
        </div>
        </div>`
}

/* populate the HTML  products section with*/
const updateProductSection = products => {
  const productsSection = document.querySelector("#products-container");
  productsSection.innerHTML = "";
  products.forEach(product => {
    productsSection.insertAdjacentHTML("beforeend", createProductsElement(product));
  })
}


/*function sorting out the products*/
const sortProducts = (products, sortingType) => {
  const productToSort = [...products];

/* sorting by price*/
  const sortByPrice = productDatas => {
    const compareFunction = (a, b) => {
      return a.price - b.price
    }
    return productDatas.sort(compareFunction);
  }

/* sorting by the bestselling products*/
  const sortByBestSelling = productDatas => {
    const compareFunction = (a, b) => {
      return b.rating.count - a.rating.count
    }
    return productDatas.sort(compareFunction);
  }

/* checking for the sorting method to use*/
  sortingType === "price" ? updateProductSection(sortByPrice(productToSort)) : updateProductSection(sortByBestSelling(productToSort));
}

/* check to know if products should be sorted*/
const updateProductsCatalogue = (products, sorting) => {
  sorting === "default" ? updateProductSection(products) : sortProducts(products, sorting);
}

/* Implementing the sorting feature*/
const productsSortingFunc = () => {
  const sortingInput = document.querySelector("#sorting");
  sortingInput.addEventListener("change", e => {
    const selectedSortOption = e.target.value;
    updateProductsCatalogue(allProducts, selectedSortOption);
  })

}
productsSortingFunc();


// Function to generate star rating HTML
function generateStarRating(rating) {
  let fullStars = Math.floor(rating);
  let halfStar = rating % 1 !== 0;
  let emptyStars = 5 - Math.ceil(rating);

  let starHTML = '';

  for (let i = 0; i < fullStars; i++) {

    starHTML += '<span class="full-star">&#9733;</span>'; // Full star
  }

  if (halfStar) {
    starHTML += '<span class="star">&#9734;</span>'; // Half star (you can use a different symbol if needed)
  }
  for (let i = 0; i < emptyStars; i++) {
    starHTML += '<span class="star">&#9734;</span>'; // Empty star
  }

  return starHTML;
}