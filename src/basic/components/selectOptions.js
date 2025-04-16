import { productList } from "../products";
import { store } from "../store";

// 셀렉트 옵션 설정
export function updateSelectOptions() {
  store.elements.productSelect.innerHTML = "";
  productList.forEach(function (product) {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name + " - " + product.val + "원";
    if (product.quantity === 0) option.disabled = true;
    store.elements.productSelect.appendChild(option);
  });
}
