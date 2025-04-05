// Fetch Data
import { fetchData } from "./js/utility.js";
import { addToCart, matchingItems } from "./js/cart.js";

const products = await fetchData();
const laptops = products.filter(item => item.category === "Laptops")
const phones = products.filter(item => item.category === "Phones");
const accessories = products.filter(item => item.category === "Accessories")

const signInBtn = document.getElementById("signInBtn");
const singUpBtn = document.getElementById("signUpBtn");
const closeSignUpBtn = document.querySelector("#signup-popup .close");
const closeSignInBtn = document.querySelector("#signin-popup .close");
const cartBtn = document.querySelector(".js-cart");
const closeCanva = document.querySelector(".close-canva");

function openPopup(popupId) {
    document.getElementById(popupId).style.display = "flex";
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none";
}


// Display Categories
function displayCategories() {
    const categories = ["Phones", "Laptops", "Accessories"];
    const selectedProducts = [];

    categories.forEach((category) => {
        const product = products.find(item => item.category === category)
        
        if (product) {
            selectedProducts.push(product)
        }
    })

    let html = "";
    let categoriesDescrip;

    const categoriesContainer = document.querySelector(".categories-container")
    selectedProducts.forEach((item) => {
        if(item.category === "Phones") {
            categoriesDescrip = "Stay connected with the latest smartphones featuring powerful processors, stunning displays, and advanced cameras"
        } else if(item.category === "Laptops") {
            categoriesDescrip = "Boost your productivity with high-performance laptops designed for work, gaming, and creativity."
        } else{
            categoriesDescrip = "Enhance your tech experience with essential accessories like wireless earbuds, smartwatches, and chargers."
        }
        html += `
            <div class="categories-col">
                    <div class="image-container">
                        <img src=${item.image} />
                    </div>
                    <h6>${item.category}</h6>
                    <p>${categoriesDescrip}</p>
                    <a class="view-all" href="#">view all</a>
            </div>
        
        `
    })
    categoriesContainer.innerHTML = html
}



function displayCategoryItems(displayCount, category, elementId) {
    const productContainer = document.getElementById(`${elementId}`)
    let html = "";


    if(displayCount > category.length) {
        console.log(`displayCount:${displayCount} is greater than categoryLength ${category.length}`)
        return;
    }

    for(let i = 0; i < displayCount; i++) {
        let item = category[i]

        html +=`
                <div class="card">
                <!-- Favorite Icon -->
                <div>
                    <svg width="30px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 add-to-favorite">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </div>
            
                <!-- Product Image -->
                <div class="card-img-container">
                    <img src=${item.image} alt="Gadget Image" class="product-image">
                </div>
                <!-- Product Info -->
                <div class="info">
                    <h2>${item.name}</h2>
                    <div>
                        <p>${item.price}</p>
                        <!-- Add to Cart Button -->
                        <button class="add-to-bag js-add-to-bag" data-item-id = "${item.id}">
                        <svg width="20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        </button>
                    </div>
                </div>
            </div>
        
        `
    }

    productContainer.innerHTML = html;

    /* addEventListener to all the add-to-bag button */
   // Select only buttons within the specific container
    const addToCartBtns = productContainer.querySelectorAll(".js-add-to-bag");

    addToCartBtns.forEach((button) => {
        const itemID = button.dataset.itemId;
       
        button.addEventListener("click", () => {
            addToCart(itemID);
        });
    });
    
}


signInBtn.addEventListener("click", ()=> openPopup("signin-popup"))
singUpBtn.addEventListener("click", () => openPopup("signup-popup"))
closeSignUpBtn.addEventListener("click", () => closePopup("signup-popup"))
closeSignInBtn.addEventListener("click", () => closePopup("signin-popup"))
cartBtn.addEventListener("click", () => {
  const offCanvasCart = document.querySelector(".off-canva-cart");
  const offCanvasOverlay = document.querySelector(".offcanvas-overlay")
  offCanvasCart.style.right = "0";
  offCanvasOverlay.classList.add("open");
});
closeCanva.addEventListener("click", () => {
  const offCanvasCart = document.querySelector(".off-canva-cart");
  const offCanvasOverlay = document.querySelector(".offcanvas-overlay")
  offCanvasCart.style.right = "-100%";
  offCanvasOverlay.classList.remove("open");
})

// Function calls
displayCategories()
displayCategoryItems(5, phones, "phone-container")
displayCategoryItems(3, laptops, "laptops-container")
displayCategoryItems(2, accessories, "accessories-container")


export { products }