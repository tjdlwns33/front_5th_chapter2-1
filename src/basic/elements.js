import { store } from "./store";

// elements 가져오기
export function cartDisplay() {
  store.elements.cartDisplay = document.getElementById("cart-items");
}
export function cartTotal() {
  store.elements.cartTotal = document.getElementById("cart-total");
}
export function productSelect() {
  store.elements.productSelect = document.getElementById("product-select");
}
export function addCartButton() {
  store.elements.addCartButton = document.getElementById("add-to-cart");
}
export function stockInfo() {
  store.elements.stockInfo = document.getElementById("stock-status");
}

export function getAllElements() {
  cartDisplay();
  cartTotal();
  productSelect();
  addCartButton();
  stockInfo();
}
