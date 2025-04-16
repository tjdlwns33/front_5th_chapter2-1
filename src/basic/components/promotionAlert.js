import { productList } from "../products";
import { store } from "../store";

// 프로모션 알림
export function promotionAlert() {
  setTimeout(function () {
    setInterval(function () {
      const luckyItem =
        productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if (store.lastSelectProduct) {
        const suggestItem = productList.find(
          (product) =>
            product.id !== store.lastSelectProduct && product.quantity > 0
        );
        if (suggestItem) {
          alert(
            suggestItem.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!"
          );
          suggestItem.val = Math.round(suggestItem.val * 0.95);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
