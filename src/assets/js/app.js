"use strict";

const cards = document.querySelectorAll(".card");
console.log(cards);

/**
 * remive the padding of card elements in a list based on the specified direction and number of cards per row.
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