import { auth, db } from "./firebase.js";
import { doc, setDoc, getDoc, updateDoc, increment, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { products } from "../script.js";

// in cart.html or a script that runs on page load
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // load cart
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
        displayMiniCartItem(user.uid);
        displayFullCart(user.uid);
    } catch (error) {
        console.error("Error adding to cart:", error.message)
    }
}

async function getUserCart(userId) {
    if (!userId) {
      console.log("User not logged in.");
      return;
    }
    const cartRef = collection(db, "users", userId, "cart");
  
    try {
      const cartSnapshot = await getDocs(cartRef);
      let cartItems = [];
  
      cartSnapshot.forEach((cartDoc) => {
        cartItems.push({
          itemId: cartDoc.id,
          quantity: cartDoc.data().quantity,
        });
      });
  
      console.log("User cart:", cartItems);
      return cartItems;
    } catch (error) {
      console.error("Error fetching cart:", error.message);
    }
  }
  

  async function matchingItems(userId) {
    const userCart = await getUserCart(userId);
    if (!userCart || userCart.length === 0) {
      return [];
    }
  
    let matchingItem = [];
  
    userCart.forEach((cartItem) => {
      let foundItem = products.find((product) => product.id === cartItem.itemId);
      if (foundItem) {
        matchingItem.push({
          ...foundItem,
          quantity: cartItem.quantity,
        });
      }
    });
  
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

async function displayMiniCartItem(userId) {
  const matchingItemList = await matchingItems(userId);
  const miniCartBody = document.querySelector(".js-minicart-body");

  if (!matchingItemList || matchingItemList.length === 0) {
    miniCartBody.innerHTML = "No item in cart";
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
            <svg width="13px" ...> ... </svg>
        </button>
      </li>
    `;
  });

  miniCartBody.innerHTML = html;
  document.querySelector('.js-subtotal').innerHTML = await subTotal(userId)

  const removeBtn = document.querySelectorAll(".js-remove-btn");
  removeBtn.forEach((button) => {
    button.addEventListener("click", async () => {
      const itemId = button.dataset.itemId;
      await removeFromCart(userId, itemId);
      displayMiniCartItem(userId); // refresh after removal
    });
  });
}

async function displayFullCart(userId) {
    const matchingItemList = await matchingItems(userId);
    const cartTableBody = document.getElementById("cart-tbody");
  
    if (!matchingItemList || matchingItemList.length === 0) {
      cartTableBody.innerHTML = "<tr><td colspan='6'>No item in cart</td></tr>";
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
            <button class="action-btn remove" data-item-id="${item.id}"><i class="fas fa-times"></i></button>
          </td>
        </tr>
      `;
    });
  
    cartTableBody.innerHTML = html;
  
    const removeBtn = document.querySelectorAll(".remove");
    const minusBtn = document.querySelectorAll(".minus");
    const plusBtn = document.querySelectorAll(".plus");

    // addEventListener to buttons
    removeBtn.forEach((button) => {
      button.addEventListener("click", async () => {
        const itemId = button.dataset.itemId;
        await removeFromCart(userId, itemId);
        displayFullCart(userId); // refresh
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
  
async function subTotal(userId) {
  const userCart = await matchingItems(userId);
  console.log("subtotal cart", userCart)
    if (!userCart || userCart.length === 0) {
      return 0;
    }

    const subtotal = userCart.reduce((accumulator, item) => {
      return accumulator + item.quantity * item.price;
    }, 0)

    return subtotal
}

async function incrementQty(itemId, userId) {
  await updateDoc(doc(db, "users", userId, "cart", itemId), {
    quantity: increment(1)
  })
  await displayFullCart(userId);
  await displayMiniCartItem(userId);
}

async function decrementQty(itemId, userId) {
  const itemRef = doc(db, "users", userId, "cart", itemId);
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
    await displayFullCart(userId)
    await displayMiniCartItem(userId)
  }
}


export {
    addToCart,
    getUserCart,
    matchingItems,
    displayMiniCartItem,
    removeFromCart,
    displayFullCart,
  };
  