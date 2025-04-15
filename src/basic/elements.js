import { store } from "./store";

// elements 가져오기
export function getElements() {
  store.elements.cartDisplay = document.getElementById("cart-items");
  store.elements.cartTotal = document.getElementById("cart-total");
  store.elements.productSelect = document.getElementById("product-select");
  store.elements.addCartButton = document.getElementById("add-to-cart");
  store.elements.stockInfo = document.getElementById("stock-status");
}
