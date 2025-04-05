import { auth, db } from "./firebase.js";
import { doc, setDoc, getDoc, updateDoc, increment, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { products } from "../script.js";

// in cart.html or a script that runs on page load
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { displayMiniCartItem, displayFullCart } from "./cart.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Now safe to load cart
    displayMiniCartItem(user.uid);
    displayFullCart(user.uid);
  } else {
    console.log("User not logged in");
    // Optional: redirect to login page
  }
});


async function addToCart(itemId) {
    const user = auth.currentUser;
    if(!user) {
        alert("Please log in to add item to your cart");
        return;
    }

    try{
        const cartRef = doc(db, "users", user.uid, "cart", itemId);
        const cartDoc = await getDoc(cartRef);

        if(cartDoc.exists()) {
            await updateDoc(cartRef, {
                quantity: increment(1)
            });
        }else {
            await setDoc(cartRef, {
                quantity: 1
            });
        }
    } catch (error) {
        console.error("Error adding to cart:", error.message)
    }
}

async function getUserCart() {
    const user = auth.currentUser;

    if (!user) {
        console.log("Please User is not logged in.");
        //alert("Please log in to view your cart.");
        return;
    }
    const cartRef = collection(db, "users", user.uid, "cart");

    try{
        const cartSnapshot = await getDocs(cartRef);
        let cartItems = [];

        cartSnapshot.forEach(cartDoc => {
            cartItems.push({
                itemId: cartDoc.id,
                quantity: cartDoc.data().quantity
            });
        });

        console.log("User cart:", cartItems);
        return cartItems;
    } catch (error) {
        console.error("Eror fetching cart:", error.message)
    }
}

async function matchingItems() {
    const userCart = await getUserCart();
    console.log("This is user cart", userCart)
    if(!userCart || userCart.length === 0) {
        console.log("No items in cart.");
        return [];
    }

    let matchingItem = []

    userCart .forEach((cartItem) => {
        let foundItem = products.find((product) => product.id === cartItem.itemId)

        if(foundItem) {
            matchingItem.push(
                {
                    ...foundItem,
                    quantity: cartItem.quantity
                }
            )
        }

    })
    console.log("Matching items", matchingItem)
    return matchingItem;
}

async function removeFromCart(userId, itemId) {
    if (!userId || !itemId) {
        console.error("Error: userId or itemId is undefined!");
        return;
    }
    try {
        await deleteDoc(doc(db, "users", userId, "cart", itemId));
        displayMiniCartItem()
        console.log("Item removed successfully!");
    } catch (error) {
        console.error("Error removing item:", error);
    }
}

async function displayMiniCartItem() {
    const user = auth.currentUser;
    let matchingItem = await matchingItems();
    const miniCartBody = document.querySelector(".js-minicart-body");
    let html = "";

    console.log(matchingItem)
    if(!matchingItem) {
        miniCartBody.innerHTML = "No item in cart"
        return;
    }

   matchingItem.forEach((item) => {
        html += `
                <li>
                <a href="#" class="cart-img"><img src=${item.image}></a>
                <div class="content">
                    <a href="#" class="cart-item-name">${item.name}</a>
                    <span class="quantity-price">
                        ${item.quantity} x <span class="amount">${item.price}</span>
                    </span>
                </div>
                <button class="remove-cart-item-btn js-remove-btn" data-item-id = "${item.id}">
                    <svg width="13px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </li>
        `
    })

    console.log("display Cart")
    miniCartBody.innerHTML = html;

    const removeBtn = document.querySelectorAll(".js-remove-btn")
    
    removeBtn.forEach((button) => {
        button.addEventListener("click", async () => {
            const itemId = button.dataset.itemId;
            console.log("Remove id", itemId)
            await removeFromCart(user.uid, itemId)
            
        })
    })

}

async function displayFullCart() {
    const user = auth.currentUser;
    let matchingItem = await matchingItems();
    const cartTableBody = document.getElementById("cart-tbody");
    let html = "";

    console.log(matchingItem)
    if(!matchingItem) {
        miniCartBody.innerHTML = "No item in cart"
        return;
    }

   matchingItem.forEach((item) => {
        html += `
        <tr>
        <td class="product-image">
          <img src="${item.image}" alt="Product">
        </td>
        <td class="product-name" data-label="PRODUCT NAME">${item.name}</td>
        <td class="product-price" data-label="UNIT PRICE">${item.price}</td>
        <td class="product-quantity" data-label="QTY">
          <div class="quantity-control">
            <button class="quantity-btn minus">-</button>
            <input type="text" value="1" class="quantity-input" readonly>
            <button class="quantity-btn plus">+</button>
          </div>
        </td>
        <td class="product-subtotal" data-label="SUBTOTAL">$70.00</td>
        <td class="product-actions" data-label="ACTION">
          <button class="action-btn edit"><i class="fas fa-pencil-alt"></i></button>
          <button class="action-btn remove" data-item-id = "${item.id}"><i class="fas fa-times"></i></button>
        </td>
      </tr>
        `
    })

    console.log("display Cart")
    cartTableBody.innerHTML = html;

    const removeBtn = document.querySelectorAll(".remove")
    
    removeBtn.forEach((button) => {
        button.addEventListener("click", async () => {
            const itemId = button.dataset.itemId;
            console.log("Remove id", itemId)
            await removeFromCart(user.uid, itemId)
            
        })
    })

}

const matchingItem = await matchingItems()
console.log(matchingItem)



export { addToCart, getUserCart, matchingItems, displayMiniCartItem, removeFromCart, displayFullCart }