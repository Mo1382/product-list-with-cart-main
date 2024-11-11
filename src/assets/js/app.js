import renderInitHtml from "./htmlRender.js";

/**
 * Fetches data from the provided URL and returns the parsed JSON data.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<any>} - A Promise with data form the URL..
 */
const getData = async function (url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

// Recieving data from the json file
const appData = await getData("http://127.0.0.1:5500/src/assets/data.json");

// Rendering the initial HTML just after the data is recieved
document.body.insertAdjacentHTML("beforeend", renderInitHtml());

// Elements selections
const cardsWrapper = document.querySelector(".cards-wrapper .row");
let cards;
let addOneToCartBtn;
let addToCartBtns;
const itemsWrapper = document.querySelector(".items-wrapper");
const cartItemsWrapper = document.querySelector(".cart-items");
const emptyCart = document.querySelector(".empty-cart");
const selectedItemsNumEl = document.querySelector(
  ".cart-section-container span"
);
const totalPriceEl = document.querySelector("#cart-total-price");
const cartSectionContainer = document.querySelector(".cart-section-container");
const orderConfirmationLayout = document.querySelector(
  ".order-confirmation-layout"
);
const orderedConfiremedItemsList = document.querySelector(
  ".ordered-confiremed-items-list"
);
const modalTotalPriceEl = document.querySelector("#modal-total-price");
const submitNewOrderBtn = document.querySelector("#submit-new-order-btn");
let addMoreToCartBtns;
const ordereConfiremedItemsListEl = document.querySelector(
  ".ordered-confiremed-items-list"
);

// Data
const windowWidth = window.innerWidth;
const deviceCategories = [
  [0, "mobile"],
  [578, "tablet"],
  [992, "desktop"],
];
let totalPrice;
let selectedItemsNum;
const refBtnWidthHieght = {};
let selectedItemsByOrder = [];

// Functions

/**
 * Recognizes the device type based on the current window width and a set of breakpoints.
 *
 * @param {[number, string][]} breakpoints - An array of breakpoint values and their corresponding device types.
 * @returns {string} The recognized device type.
 */
const recognizeDevice = function (breakpoints) {
  let userDevice;
  breakpoints.forEach(function ([breakpoint, device]) {
    if (windowWidth >= breakpoint) userDevice = device;
  });
  return userDevice;
};

const userDevice = recognizeDevice(deviceCategories);

/**
 * Renders a set of cards based on data fetched from the provided URL.
 *
 * @param {string} dataUrl - The URL to fetch the data from.
 * @param {HTMLElement} cardsWrapperEl - The HTML element to insert the rendered cards into.
 * @returns {Promise<void>} - A Promise that resolves when the cards have been rendered.
 */
const cardRender = function (data, cardsWrapperEl) {
  data.forEach((item) => {
    const cardHTML = `<div class="card px-0 col-12 col-sm-6 offset-sm-0 col-md-6 col-lg-4">
            <div class="card-header">
              <img class="img-fluid" src=src${item.image[userDevice]} alt="" />
              <button class="add-to-cart-btn add-one-to-cart-btn">
                <div class="add-to-cart-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><g fill="#C73B0F" clip-path="url(#a)"><path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/><path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M.333 0h20v20h-20z" /></clipPath></defs></svg>
                </div>
                <span>Add to Cart</span>
              </button> 
            </div>
            <div class="card-body">
              <h4 class="food-title-abreviation">${item.category}</h4>
              <h3 class="food-title">${item.name}</h3>
              <div class="food-price">$${item.price}</div>
            </div>
          </div>`;

    cardsWrapperEl.insertAdjacentHTML("beforeend", cardHTML);
  });
};

cardRender(appData, cardsWrapper);

// Move here after cardRender to access this elements
cards = document.querySelectorAll(".card");

/**
 * Sets the width of each element in the provided array to match the width of a reference element.
 *
 * @param {Element} refEl - The reference element whose width will be used.
 * @param {Array<Element>} elements - The array of elements to set the width for.
 */
const makeElWidthLikeOneEl = function (
  refEl,
  elements,
  isWidthCalculated = false
) {
  if (!isWidthCalculated) {
    refBtnWidthHieght.width = getComputedStyle(refEl).width;
    elements.forEach((el) => {
      el.style.width = refBtnWidthHieght.width;
    });
  } else {
    elements.forEach((el) => {
      el.style.width = refBtnWidthHieght.width;
    });
  }
};

/**
 * Sets the height of each element in the provided array to match the width of a reference element.
 *
 * @param {Element} refEl - The reference element whose height will be used.
 * @param {Array<Element>} elements - The array of elements to set the height for.
 */

const makeElHeightLikeOneEl = function (
  refEl,
  elements,
  isHeightCalculated = false
) {
  if (!isHeightCalculated) {
    refBtnWidthHieght.height = getComputedStyle(refEl).height;
    elements.forEach((el) => {
      el.style.height = refBtnWidthHieght.height;
    });
  } else {
    elements.forEach((el) => {
      el.style.height = refBtnWidthHieght.height;
    });
  }
};

/**
 * remove the padding of card elements in a list based on the specified direction and number of cards per row.
 *
 * @param {string} direction - The direction of list in which to remove padding ('right' or 'left').
 * @param {NodeList} cardsList - A list of card elements to be adjusted.
 * @param {number} cardsPerRow - The number of cards per row to determine which cards should have padding removed.
 */
const cardsWithoutPadding = function (direction, cardsList, cardsPerRow) {
  const directionUppercase = direction.replace(
    direction[0],
    direction[0].toUpperCase()
  );
  const reminder = direction === "right" ? 0 : 1;
  cardsList.forEach((card, i) => {
    if ((i + 1) % cardsPerRow === reminder) {
      card.style[`padding${directionUppercase}`] = 0;
    }
  });
};

cardsWithoutPadding("right", cards, 3);
cardsWithoutPadding("left", cards, 3);

/**
 * Initializes the items in the application data and total price.
 *
 * @param {Object[]} data - The application data containing the items to be initialized.
 * @returns {void}
 */
const appInit = function (data) {
  // Implementing initialization for items
  data.forEach((item) => {
    item.selected = false;
    item.number = 0;
    item.itemsPrice = item.number * item.price;
  });

  // Implementing initialization for total price
  totalPrice = 0;
  totalPriceEl.textContent = `$${totalPrice}`;
};

appInit(appData);

/**
 * Renders the selected items in the shopping cart.
 *
 * @param {Array} selectedItemsArr - Array of selected item objects containing name, number, price, and itemsPrice
 * @returns {void}
 */
const renderSelectedItems = function (
  selectedItemsArr,
  wrapperEl = itemsWrapper
) {
  wrapperEl.innerHTML = "";
  selectedItemsArr.forEach((item) => {
    const itemHTML = `
    <div class="item">
      <div class="item-detail">
        <h5 class="item-name">${item.name}</h5>
        <span class="item-count"><span>${item.number}</span>x</span>
        <span>
          <span class="item-price">
            @<span class="price-per-item">$${item.price}</span>
            <span class="price-per-items">$${item.itemsPrice}</span>
          </span>
        </span>
      </div>
      <div class="remove-item-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          fill="none"
          viewBox="0 0 10 10"
        >
          <path
            fill="#CAAFA7"
            d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
          />
        </svg>
      </div>
    </div>`;
    wrapperEl.insertAdjacentHTML("afterbegin", itemHTML);
  });
};

/**
 * Finds the selected item in the provided array based on the clicked element's title.
 *
 * @param {Array} ArrToSearch - The array to search for the selected item.
 * @param {HTMLElement} clickedEL - The clicked element that triggered the search.
 * @param {string} wrapperElClass - The class name of the wrapper element for the clicked item.
 * @param {string} titelElClass - The class name of the title element for the clicked item.
 * @returns {Object} The selected item object from the provided array.
 */
const findActiveItem = function (
  ArrToSearch,
  clickedEL,
  wrapperElClass,
  titelElClass
) {
  // Getting the title of the item clicked
  const itemClickedTitle = clickedEL
    .closest(`.${wrapperElClass}`)
    .querySelector(`.${titelElClass}`).textContent;

  // Finding the selected item in the appData array
  const selectedItem = ArrToSearch.find(
    (item) => item.name === itemClickedTitle
  );

  return selectedItem;
};

/**
 * Updates the number and price of an item in the cart.
 *
 * @param {Object} item - The item object to update.
 * @param {boolean} [isAdded=true] - Indicates whether the item is being added or removed.
 * @returns {void}
 */
const updateItemNumberAndPrice = function (
  item,
  isAdded = true,
  isRemoved = false
) {
  if (isAdded) {
    item.number++;
  }
  if (!isAdded) {
    item.number--;
  }
  if (isRemoved) {
    item.number = 0;
  }
  item.itemsPrice = item.number * item.price;
};

/**
 * Calculates and renders the total price of selected items.
 *
 * @param {Array} data - The array of data containing the items.
 * @param {HTMLElement} elToRender - The HTML element to render the total price.
 * @returns {void}
 */
const calculateAndRenderTotalPrice = function (
  data = appData,
  elToRender = totalPriceEl
) {
  // Finding selected items in data array
  const selectedItems = data.filter((item) => item.selected);

  // Updating the total price and rerender it in UI
  totalPrice = selectedItems.reduce((totalPrice, item) => {
    return totalPrice + item.itemsPrice;
  }, 0);
  elToRender.textContent = `$${totalPrice}`;
};

/**
 * Renders a plus/minus button for an item in the cart instead of "Add to Cart" button.
 *
 * @param {HTMLElement} clickedEl - The clicked element that triggered the function.
 * @returns {void}
 */
const renderPlusMinusBtn = function (clickedEl) {
  const clickedBtn = clickedEl.closest(".add-one-to-cart-btn");
  clickedBtn.classList.replace("add-one-to-cart-btn", "add-more-to-cart-btn");
  clickedBtn.innerHTML = ` 
    <div class="minus-item-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="2"
        fill="none"
        viewBox="0 0 10 2"
      >
        <path fill="#fff" d="M0 .375h10v1.25H0V.375Z" />
      </svg>
    </div>

    <div class="items-num">1</div>

    <div class="plus-item-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        fill="none"
        viewBox="0 0 10 10"
      >
        <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
      </svg>
</div>
`;
};

/**
 * Renders an "Add to Cart" button for an item in the cart instead of plus/minus button.
 *
 * @param {HTMLElement} clickedEl - The clicked element that triggered the function.
 * @returns {void}
 */
const renderAddToCartBtn = function (btnToReplace) {
  btnToReplace.classList.replace("add-more-to-cart-btn", "add-one-to-cart-btn");
  btnToReplace.innerHTML = ` 
                <div class="add-to-cart-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><g fill="#C73B0F" clip-path="url(#a)"><path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/><path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M.333 0h20v20h-20z" /></clipPath></defs></svg>
                </div>
                <span>Add to Cart</span>`;
};

/**
 * Calculates the number of selected items and renders it in the UI.
 *
 * @param {Array} selectedItemsArr - An array of selected item objects to calculate its length.
 * @param {HTMLElement} elToRender - The DOM element to render the selected items count.
 * @returns {void}
 */
const renderSelectedItemsNum = function (selectedItemsArr, elToRender) {
  selectedItemsNum = selectedItemsArr.length;
  elToRender.textContent = selectedItemsNum;
};

/**
 * Switches the visibility of two elements, hiding one and showing the other with an animation.
 *
 * @param {HTMLElement} elToHide - The element to hide.
 * @param {HTMLElement} elToShow - The element to show.
 * @returns {void}
 */
const switchVisibilityOfTwoEls = function (elToHide, elToShow) {
  // Hiding element
  elToHide.style.display = "none";
  elToHide.style.opacity = 0;

  // Showing element with animation
  elToShow.style.display = "block";
  requestAnimationFrame(() => {
    elToShow.style.opacity = 1;
  });
};

/**
 * Renders the updated number of an item in the specified element.
 *
 * @param {HTMLElement} clickedEL - The clicked element that triggered the function.
 * @param {string} wrapperElClass - The class name of the wrapper element containing the number element.
 * @param {string} numberElementClass - The class name of the number element to update.
 * @param {Object} item - The item object containing the updated number.
 * @returns {void}
 */
const renderNewItemNum = function (
  clickedEL,
  wrapperElClass,
  numberElementClass,
  item
) {
  const itemNumEl = clickedEL
    .closest(`.${wrapperElClass}`)
    .querySelector(`.${numberElementClass}`);
  itemNumEl.textContent = item.number;
};

/**
 * Adds a new item in cart to a given array.
 *
 * @param {Object} item - The item to add to the array and make it selected.
 * @param {Array} arrToAdd - The array to add the item to.
 * @returns {void}
 */
const addToCart = function (item, arrToAdd) {
  item.selected = true;
  arrToAdd.push(item);
};

/**
 * Removes a removed item in cart item from a given array.
 *
 * @param {Object} item - The item to remove from the array and make it unselected.
 * @param {Array} arrToRemove - The array to remove the item from.
 * @returns {void}
 */
const removeFromCart = function (item, arrToRemove) {
  item.selected = false;
  const itemIndex = arrToRemove.indexOf(item);
  arrToRemove.splice(itemIndex, 1);
};

/**
 * Opens a modal by removing the "hide-el" class from the modal wrapper element and setting the opacity of the modal itself to 1.
 *
 * @param {HTMLElement} modalWrapper - The wrapper element for the modal.
 * @returns {void}
 */
const openModal = function (modalWrapper) {
  modalWrapper.classList.remove("hide-el");
  modalWrapper.querySelector(".order-confirmation-modal").style.opacity = 1;
};

/**
 * Closes a modal by adding the "hide-el" class to the modal wrapper element and setting the opacity of the modal itself to 0.
 *
 * @param {HTMLElement} modalWrapper - The wrapper element for the modal.
 * @returns {void}
 */
const closeModal = function (modalWrapper) {
  modalWrapper.classList.add("hide-el");
  modalWrapper.querySelector(".order-confirmation-modal").style.opacity = 0;
};

/**
 * Clears all items from a given wrapper element that have the "item" class.
 *
 * @param {HTMLElement} wrapperEl - The wrapper element containing the items to be cleared.
 * @returns {void}
 */
const clearItems = function (wrapperEl) {
  const itemsToClear = [...wrapperEl.children].filter((item) =>
    item.classList.contains("item")
  );

  itemsToClear.forEach((item) => {
    item.remove();
  });
};

/**
 * Renders a list of confirmed order items in the provided wrapper element.
 *
 * @param {Array<Object>} selectedItemsArr - An array of selected items to be rendered.
 * @param {HTMLElement} [wrapperEl=orderedConfiremedItemsList] - The wrapper element to insert the rendered items into. Defaults to `orderedConfiremedItemsList`.
 * @returns {void}
 */
const renderConfiremedItems = function (
  selectedItemsArr,
  wrapperEl = orderedConfiremedItemsList
) {
  selectedItemsArr.forEach((item) => {
    const itemHTML = `
<div class="item">
  <div class="item-detail">
    <div class="item-thumb">
      <img class="img-fluid" src="src${item.image.thumbnail}" alt="">
    </div>
    <div class="item-description">
      <h5 class="item-name">${item.name}</h5>
      <span class="item-count"><span>${item.number}</span>x</span>
      <span class="item-price">@$${item.price}</span>
    </div>
  </div>
  <span class="confiremed-item-last-price">$${item.itemsPrice}</span>
</div>
    `;

    wrapperEl.insertAdjacentHTML("afterbegin", itemHTML);
  });
};

/**
 * Empties the contents of the provided array.
 *
 * @param {Array} arr - The array to be emptied.
 * @returns {void}
 */
const makeArrEmpty = function (arr) {
  arr.splice(0, arr.length);
};

// Event listeners

// Rerender cards with new images when window is resized to diffrent screen
window.addEventListener("resize", function () {
  recognizeDevice(deviceCategories);

  cardRender("http://127.0.0.1:5500/src/assets/data.json", cardsWrapper);
});

// Adding item to cart when user clicks on "Add to Cart" btn
cardsWrapper.addEventListener("click", function (e) {
  const clicked = e.target;
  // Checking strategy
  if (!clicked.closest(".add-one-to-cart-btn")) return;

  // Finding the selected item in the appData array
  const selectedItem = findActiveItem(appData, clicked, "card", "food-title");

  addToCart(selectedItem, selectedItemsByOrder);

  // Updating the selected item in the appData array
  updateItemNumberAndPrice(selectedItem);

  // Updating array of selected items by the order that selected

  renderPlusMinusBtn(clicked);

  renderSelectedItemsNum(selectedItemsByOrder, selectedItemsNumEl);

  // Moving here after new plus/minus btn created to access and manipulate them
  addToCartBtns = document.querySelectorAll(".add-to-cart-btn");
  addOneToCartBtn = document.querySelector(".add-one-to-cart-btn");
  addMoreToCartBtns = document.querySelectorAll(".add-more-to-cart-btn");

  if (selectedItemsNum === 1) {
    makeElWidthLikeOneEl(addOneToCartBtn, addMoreToCartBtns);
    makeElHeightLikeOneEl(addOneToCartBtn, addMoreToCartBtns);
  } else {
    makeElWidthLikeOneEl(addOneToCartBtn, addMoreToCartBtns, true);
    makeElHeightLikeOneEl(addOneToCartBtn, addMoreToCartBtns, true);
  }

  // Checking that is it the first selected item or not
  if (selectedItemsNum === 1) {
    // Hiding empty message and show cart items with animation
    switchVisibilityOfTwoEls(emptyCart, cartItemsWrapper);
  }

  renderSelectedItems(selectedItemsByOrder);

  calculateAndRenderTotalPrice();
});

// Increasing item in card and cart sections when user clicks on plus btn
cardsWrapper.addEventListener("click", function (e) {
  const clicked = e.target;

  // Checking strategy
  if (!clicked.closest(".plus-item-icon")) return;

  // Finding the increased item in the appData array
  const increasedItem = findActiveItem(appData, clicked, "card", "food-title");

  updateItemNumberAndPrice(increasedItem);

  renderNewItemNum(clicked, "add-more-to-cart-btn", "items-num", increasedItem);

  renderSelectedItems(selectedItemsByOrder);

  calculateAndRenderTotalPrice();
});

// Decreasing item in card and cart sections when user clicks on minus btn
cardsWrapper.addEventListener("click", function (e) {
  const clicked = e.target;

  // Checking strategy
  if (!clicked.closest(".minus-item-icon")) return;

  // Finding the decreased item in the appData array
  const decreasedItem = findActiveItem(appData, clicked, "card", "food-title");

  renderNewItemNum(clicked, "add-more-to-cart-btn", "items-num", decreasedItem);

  updateItemNumberAndPrice(decreasedItem, false);

  calculateAndRenderTotalPrice();

  if (decreasedItem.number === 0) {
    const clickedBtn = clicked.closest(".add-more-to-cart-btn");
    renderAddToCartBtn(clickedBtn);

    removeFromCart(decreasedItem, selectedItemsByOrder);

    renderSelectedItemsNum(selectedItemsByOrder, selectedItemsNumEl);
  }

  // Checking that is there any selected item left or not
  if (selectedItemsNum === 0) {
    // Hiding cart items and show empty message with animation
    switchVisibilityOfTwoEls(cartItemsWrapper, emptyCart);
  }

  // Updating cart section after decreasing item
  renderSelectedItems(selectedItemsByOrder);
});

// Removing item in cart section when user clicks on remove icon
cartSectionContainer.addEventListener("click", function (e) {
  const clicked = e.target;

  // Checking strategy
  if (!clicked.closest(".remove-item-icon")) return;

  // Finding the removed item in the appData array
  const removedItem = findActiveItem(appData, clicked, "item", "item-name");

  updateItemNumberAndPrice(removedItem, false, true);

  calculateAndRenderTotalPrice();

  removeFromCart(removedItem, selectedItemsByOrder);

  renderSelectedItemsNum(selectedItemsByOrder, selectedItemsNumEl);

  // Rendering "Add to Cart" btn instead of plus/minus btn for removed items
  appData.forEach((item, i) => {
    const btn = addToCartBtns[i];

    if (item.selected) return;
    renderAddToCartBtn(btn);
  });

  // Checking that is there any selected item left or not
  if (selectedItemsNum === 0) {
    // Hiding cart items and show empty message with animation
    switchVisibilityOfTwoEls(cartItemsWrapper, emptyCart);
  }

  // Updating cart section after removing item
  renderSelectedItems(selectedItemsByOrder);
});

// Open confirmation modal with cart items when user clicks "confirm order" btn
cartSectionContainer.addEventListener("click", function (e) {
  const clicked = e.target;

  // Checking strategy
  if (!clicked.classList.contains("confirm-order-btn")) return;

  openModal(orderConfirmationLayout);

  // Removing previous items from confiremedItemsList
  clearItems(ordereConfiremedItemsListEl);

  // Rendering selected items
  renderConfiremedItems(selectedItemsByOrder);

  calculateAndRenderTotalPrice(undefined, modalTotalPriceEl);
});

// Reseting app and closing modal after clicking "Submit new order" btn by user
submitNewOrderBtn.addEventListener("click", function () {
  // Resetting items and total price in appData array
  appInit(appData);

  makeArrEmpty(selectedItemsByOrder);

  renderSelectedItemsNum(selectedItemsByOrder, selectedItemsNumEl);

  // Hiding cart items and show empty message with animation
  switchVisibilityOfTwoEls(cartItemsWrapper, emptyCart);

  // Rendering "Add to Cart" btn instead of plus/minus
  addMoreToCartBtns.forEach((btn) => {
    renderAddToCartBtn(btn);
  });

  closeModal(orderConfirmationLayout);
});
