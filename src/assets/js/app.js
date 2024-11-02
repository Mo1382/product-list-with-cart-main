// Elements selections
const cardsWrapper = document.querySelector(".cards-wrapper .row");

// Data
const windowWidth = window.innerWidth;
const deviceCategories = [
  [0, "mobile"],
  [578, "tablet"],
  [992, "desktop"],
];

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
const cardRender = async function (dataUrl, cardsWrapperEl) {
  const data = await getData(dataUrl);
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

await cardRender("http://127.0.0.1:5500/src/assets/data.json", cardsWrapper);

// Move here after cardRender to access this elements
const addOneToCartBtn = document.querySelector(".add-one-to-cart-btn");
const cards = document.querySelectorAll(".card");
const addMoreToCartBtns = document.querySelectorAll(".add-more-to-cart-btn");

/**
 * Sets the width of each element in the provided array to match the width of a reference element.
 *
 * @param {Element} refEl - The reference element whose width will be used.
 * @param {Array<Element>} elements - The array of elements to set the width for.
 */

const makeElWidthLikeOneEl = function (refEl, elements) {
  const refElWidth = getComputedStyle(refEl).width;
  elements.forEach((el) => {
    el.style.width = refElWidth;
  });
};
makeElWidthLikeOneEl(addOneToCartBtn, addMoreToCartBtns);

/**
 * Sets the height of each element in the provided array to match the width of a reference element.
 *
 * @param {Element} refEl - The reference element whose height will be used.
 * @param {Array<Element>} elements - The array of elements to set the height for.
 */
const makeElHeightLikeOneEl = function (refEl, elements) {
  const refElHeight = getComputedStyle(refEl).height;
  elements.forEach((el) => {
    el.style.height = refElHeight;
  });
};
makeElHeightLikeOneEl(addOneToCartBtn, addMoreToCartBtns);

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

// Event listeners
window.addEventListener("resize", function () {
  recognizeDevice(deviceCategories);

  cardRender("http://127.0.0.1:5500/src/assets/data.json", cardsWrapper);
});
