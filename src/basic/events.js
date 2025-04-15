import { store } from "./store";
import { handleAddCartItem, handleCountCartItem } from "./utils/cart";

// 이벤트 리스너 설정
export function setEventListeners() {
  store.elements.addCartButton.addEventListener("click", handleAddCartItem); // 장바구니 추가 관리
  store.elements.cartDisplay.addEventListener("click", handleCountCartItem); // 장바구니 아이템 개수 관리
}
