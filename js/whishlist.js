import { auth, db } from "./firebase.js";
import { doc, setDoc, getDoc, updateDoc, increment, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { products } from "../script.js";
import { addToCart, displayFullCart } from "./cart.js";

// in cart.html or a script that runs on page load
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // load cart
    displayMiniWishList(user.uid);
    displayFullWishList(user.uid);
  } else {
    console.log("User not logged in");
    // Optional: redirect to login page
  }
});


async function addToWhishList(itemId) {
    const user = auth.currentUser;
    if(!user) {
        alert("Please log in to add item to your cart");
        return;
    }

    try{
        const wishlistRef = doc(db, "users", user.uid, "wishlists", itemId);
        const wishlistDoc = await getDoc(wishlistRef);

        if(wishlistDoc.exists()) {
            await updateDoc(wishlistRef, {
                quantity: increment(1)
            });
        }else {
            await setDoc(wishlistRef, {
                quantity: 1
            });
        }
        displayMiniWishList(user.uid);
        displayFullWishList(user.uid);
    } catch (error) {
        console.error("Error adding to whishlist:", error.message)
    }
}

// Remove from wishlist
async function removeFromWishList(userId, itemId) {
  if (!userId || !itemId) {
      console.error("Error: userId or itemId is undefined!");
      return;
  }
  try {
      await deleteDoc(doc(db, "users", userId, "wishlists", itemId));
      //displayMiniWishList()
      console.log("Item removed successfully!");
  } catch (error) {
      console.error("Error removing item:", error);
  }
}

// Get user whishlist from firestore
async function getUserWishList(userId) {
    if (!userId) {
      console.log("User not logged in.");
      return;
    }
    const wishListRef = collection(db, "users", userId, "wishlists");
  
    try {
      const whishListSnapshot = await getDocs(wishListRef);
      let wishListItems = [];
  
      whishListSnapshot.forEach((wishListDoc) => {
        wishListItems.push({
          itemId: wishListDoc.id,
          quantity: wishListDoc.data().quantity,
        });
      });
  
      console.log("User wishList:", wishListItems);
      return wishListItems;
    } catch (error) {
      console.error("Error fetching wishList", error.message);
    }
  }

  // get item that matches itemId in wishList from Product
  async function matchingItems(userId) {
    const userWishList = await getUserWishList(userId);
    if (!userWishList || userWishList.length === 0) {
      return [];
    }
  
    let matchingItem = [];
  
    userWishList.forEach((wishListItem) => {
      let foundItem = products.find((product) => product.id === wishListItem.itemId);
      if (foundItem) {
        matchingItem.push({
          ...foundItem,
          quantity: wishListItem.quantity,
        });
      }
    });
  
    return matchingItem;
  }

  async function displayMiniWishList(userId) {
    const matchingItemList = await matchingItems(userId);
    const miniWishListBody = document.querySelector(".js-mini-whishlist-body");
  
    if (!matchingItemList || matchingItemList.length === 0) {
      miniWishListBody.innerHTML = "No item in wishlist";
      return;
    }
  
    let html = "";
    matchingItemList.forEach((item) => {
      html += `
        <li>
          <a href="#" class="mini-img"><img src=${item.image}></a>
          <div class="content">
              <a href="#" class="cart-item-name">${item.name}</a>
              <span class="quantity-price">
                  ${item.quantity} x <span class="amount">${item.price}</span>
              </span>
          </div>
          <button class="remove-cart-item-btn js-remove-btn" data-item-id="${item.id}">
          <svg width = 18px xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
        
          </button>
        </li>
      `;
    });
  
    miniWishListBody.innerHTML = html;
  
    const removeBtn = document.querySelectorAll(".js-remove-btn");
    removeBtn.forEach((button) => {
      button.addEventListener("click", async () => {
        const itemId = button.dataset.itemId;
        await removeFromWishList(userId, itemId);
        displayMiniWishList(userId); // refresh mini wishlist after removal
      });
    });
  }
  
  // Function to increment quantity
  async function incrementQty(itemId, userId) {
    await updateDoc(doc(db, "users", userId, "wishlists", itemId), {
      quantity: increment(1)
    })
    await displayFullWishList(userId);
    await displayMiniWishList(userId);
  }
  
  // Function to decrement quantity
  async function decrementQty(itemId, userId) {
    const itemRef = doc(db, "users", userId, "wishlists", itemId);
    const itemSnap = await getDoc(itemRef);
  
    if(itemSnap.exists()) {
      const currentQty = itemSnap.data().quantity;
      if(currentQty > 1) {
        await updateDoc(itemRef, {
          quantity: increment(-1)
        });
      }else {
        await deleteDoc(itemRef);
      }
      await displayFullWishList(userId)
      await displayMiniWishList(userId)
    }
  }

  // Function to display full wishlist
  async function displayFullWishList(userId) {
    const matchingItemList = await matchingItems(userId);
    const wishlistTableBody = document.getElementById("wishlist-tbody");
  
    if (!matchingItemList || matchingItemList.length === 0) {
      wishlistTableBody.innerHTML = "<tr><td colspan='6'>No item in wishlist</td></tr>";
      return;
    }
  
    let html = "";
    matchingItemList.forEach((item) => {
      html += `
        <tr>
          <td class="product-image"><img src="${item.image}" alt="Product"></td>
          <td class="product-name">${item.name}</td>
          <td class="product-price">${item.price}</td>
          <td class="product-quantity">
            <div class="quantity-control">
              <button class="quantity-btn minus" data-item-id = "${item.id}">-</button>
              <input type="text" value="${item.quantity}" class="quantity-input" readonly>
              <button class="quantity-btn plus" data-item-id = "${item.id}">+</button>
            </div>
          </td>
          <td class="product-subtotal">$${item.price * item.quantity}</td>
          <td class="product-actions">
            <a href="#" class="action-btn add-to-bag" data-item-id="${item.id}">Add to bag</a>
          </td>
        </tr>
      `;
    });
  
    if(wishlistTableBody) {
      wishlistTableBody.innerHTML = html;
    }
  
    const addToBagBtn = document.querySelectorAll(".action-btn.add-to-bag");
    const minusBtn = document.querySelectorAll(".minus");
    const plusBtn = document.querySelectorAll(".plus");

    // addEventListener to buttons
    addToBagBtn.forEach((button) => {
      button.addEventListener("click", async () => {
        const itemId = button.dataset.itemId;
        await addToCart(itemId);
        displayFullCart(userId); // refresh full cart
      });
    });

    minusBtn.forEach((button) => {
      button.addEventListener("click", async () => {
        const itemId = button.dataset.itemId;
        console.log("itemid", itemId)
        await decrementQty(itemId, userId);
      })
    })

    plusBtn.forEach((button) => {
      button.addEventListener("click", async () => {
        const itemId = button.dataset.itemId;
        await incrementQty(itemId, userId);
      })
    })

    const fullCartSubtotal = document.querySelector('.js-full-cart-subtotal');
  if(fullCartSubtotal) {
    fullCartSubtotal.innerHTML = await subTotal(userId);
  }

  }

export {
    addToWhishList
}