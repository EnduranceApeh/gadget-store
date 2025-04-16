//import { phones } from "../script.js";
import { displayCategoryItems } from "./displayFunctions.js";
import { fetchData } from "./utility.js";

const closeSignUpBtn = document.querySelector("#signup-popup .close");
const closeSignInBtn = document.querySelector("#signin-popup .close");
const cartBtn = document.querySelector(".js-cart");
const closeCanva = document.querySelector(".close-canva");
const whishListBtn = document.querySelector(".js-whishlist-btn");
const closeWhishListBtn = document.querySelector(".close-whishlist-canva");


const products = await fetchData();
const phones = products.filter(item => item.category === "Phones");
console.log("phones", phones)

displayCategoryItems("all", phones, "phone-container")

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