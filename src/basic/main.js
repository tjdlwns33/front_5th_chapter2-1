import { promotionAlert } from "./components/promotionAlert";
import { updateSelectOptions } from "./components/selectOptions";
import { getAllElements } from "./elements";
import { setEventListeners } from "./events";
import { calcCart } from "./utils/cart";

function renderAppHTML() {
  return `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2"></select>
        <button type="button" id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
        <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  `;
}

function renderUI() {
  const root = document.getElementById("app");
  root.innerHTML = renderAppHTML();
}

function initializeApp() {
  getAllElements();
  setEventListeners();
  updateSelectOptions();
  calcCart();
  promotionAlert();
}

function main() {
  renderUI();
  initializeApp();
}

main();
