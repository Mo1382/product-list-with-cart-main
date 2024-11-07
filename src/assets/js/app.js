// Elements selections
const cardsWrapper = document.querySelector(".cards-wrapper .row");
const itemsWrapper = document.querySelector(".items-wrapper");
const cartItemsWrapper = document.querySelector(".cart-items");
const emptyCart = document.querySelector(".empty-cart");
const selectedItemsNumEl = document.querySelector(
  ".cart-section-container span"
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

const appData = await getData("http://127.0.0.1:5500/src/assets/data.json");

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
const cardRender = async function (data, cardsWrapperEl) {
  data.forEach((item) => {
    const cardHTML = `<div class="card px-0 col-12 col-sm-6 offset-sm-0 col-md-6 col-lg-4">
            <div class="card-header">
              <img class="img-fluid" src=${item.image[userDevice]} alt="" />
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
const cards = document.querySelectorAll(".card");

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
};

appInit(appData);

// Event listeners

// Rerender cards with new images when window is resized to diffrent screen
window.addEventListener("resize", function () {
  recognizeDevice(deviceCategories);

  cardRender("http://127.0.0.1:5500/src/assets/data.json", cardsWrapper);
});

/**
 * Renders the selected items in the shopping cart.
 *
 * @param {Array} selectedItemsArr - Array of selected item objects containing name, number, price, and itemsPrice
 * @returns {void}
 */
const renderSelectedItems = function (selectedItemsArr) {
  itemsWrapper.innerHTML = "";
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
    itemsWrapper.insertAdjacentHTML("afterbegin", itemHTML);
  });
};

// Adding item to cart when user clicks on "Add to Cart" btn
cardsWrapper.addEventListener("click", function (e) {
  const clicked = e.target;
  // Checking strategy
  if (!clicked.closest(".add-one-to-cart-btn")) return;

  // Getting the title of the card clicked
  const cardClickedTitle = clicked
    .closest(".card")
    .querySelector(".food-title").textContent;

  // Finding the selected item in the appData array
  const selectedItem = appData.find((item) => item.name === cardClickedTitle);

  // Updating the selected item in the appData array
  selectedItem.selected = true;
  selectedItem.number++;
  selectedItem.itemsPrice = selectedItem.number * selectedItem.price;

  // Updating the total price
  totalPrice += selectedItem.itemsPrice;

  // Render plus/minus btn instead of "Add to Cart"
  const clickedBtn = clicked.closest(".add-one-to-cart-btn");
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

  // Rerendering selected items in "cart" section
  const selectedItems = appData.filter((item) => item.selected);

  // Calculating selected items number and render them in UI
  selectedItemsNum = selectedItems.length;
  selectedItemsNumEl.textContent = selectedItemsNum;

  // Move here after new plus/minus btn created to access and manipulate them
  const addOneToCartBtn = document.querySelector(".add-one-to-cart-btn");
  const addMoreToCartBtns = document.querySelectorAll(".add-more-to-cart-btn");
  if (selectedItemsNum === 1) {
    makeElWidthLikeOneEl(addOneToCartBtn, addMoreToCartBtns);
    makeElHeightLikeOneEl(addOneToCartBtn, addMoreToCartBtns);
  } else {
    makeElWidthLikeOneEl(addOneToCartBtn, addMoreToCartBtns, true);
    makeElHeightLikeOneEl(addOneToCartBtn, addMoreToCartBtns, true);
  }

  // Checking that is it the first selected item or not
  if (selectedItemsNum === 1) {
    // Hide empty message and show cart items with animation
    emptyCart.classList.add("hide-el");

    cartItemsWrapper.style.display = "block";
    requestAnimationFrame(() => {
      cartItemsWrapper.style.opacity = 1;
    });
  }

  renderSelectedItems(selectedItems);
  const totalPriceEl = document.querySelector(".total-price");
  totalPriceEl.textContent = `$${totalPrice}`;
});
