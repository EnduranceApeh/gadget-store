// Fetch Data
import { fetchData } from "./js/utility.js";
import { addToCart } from "./js/cart.js";
import { addToWhishList } from "./js/whishlist.js";
import { displayCategoryItems, displayCategories } from "./js/displayFunctions.js";

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
const whishListBtn = document.querySelector(".js-whishlist-btn");
const closeWhishListBtn = document.querySelector(".close-whishlist-canva");


function openPopup(popupId) {
    document.getElementById(popupId).style.display = "flex";
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none";
}


// Display Categories


signInBtn.addEventListener("click", ()=> openPopup("signin-popup"))
singUpBtn.addEventListener("click", () => openPopup("signup-popup"))
closeSignUpBtn.addEventListener("click", () => closePopup("signup-popup"))
closeSignInBtn.addEventListener("click", () => closePopup("signin-popup"))

//Open cart Canva
if(cartBtn) {
    cartBtn.addEventListener("click", () => {
        const offCanvasCart = document.querySelector(".off-canva-cart");
        const offCanvasOverlay = document.querySelector(".offcanvas-overlay")
        offCanvasCart.style.right = "0";
        offCanvasOverlay.classList.add("open");
      });
}


// Close cart Canva
if(closeCanva) {
    closeCanva.addEventListener("click", () => {
        const offCanvasCart = document.querySelector(".off-canva-cart");
        const offCanvasOverlay = document.querySelector(".offcanvas-overlay")
        offCanvasCart.style.right = "-100%";
        offCanvasOverlay.classList.remove("open");
      })
}


// Open whishlist Canva
if(whishListBtn) {
    whishListBtn.addEventListener("click", () => {
        const offCanvasCart = document.querySelector(".off-canva-whishlist");
        const offCanvasOverlay = document.querySelector(".offcanvas-overlay")
        offCanvasCart.style.right = "0";
        offCanvasOverlay.classList.add("open");
    })
}


// close whishlist canava
if(closeWhishListBtn) {
    closeWhishListBtn.addEventListener("click", () => {
        const offCanvasCart = document.querySelector(".off-canva-whishlist");
        const offCanvasOverlay = document.querySelector(".offcanvas-overlay")
        offCanvasCart.style.right = "-100%";
        offCanvasOverlay.classList.remove("open");
    })
}

// Function calls
displayCategories()
displayCategoryItems(5, phones, "phone-container")
displayCategoryItems(3, laptops, "laptops-container")
displayCategoryItems(2, accessories, "accessories-container")



export { products }