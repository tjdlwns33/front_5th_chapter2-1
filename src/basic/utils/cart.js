import { productList } from "../products";
import { store } from "../store";

// 할인 정보
const PRODUCT_DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

// 장바구니 계산
export function calcCart() {
  store.totalAmount = 0;
  store.itemCount = 0;
  const cartItems = store.elements.cartDisplay.children;
  let subTotal = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const currentItem = productList.find(
      (product) => product.id === cartItems[i].id
    );
    const quantity = parseInt(
      cartItems[i].querySelector("span").textContent.split("x ")[1]
    );
    const itemTotal = currentItem.val * quantity;

    store.itemCount += quantity;
    subTotal += itemTotal;

    const discount =
      quantity >= 10 ? PRODUCT_DISCOUNT_RATES[currentItem.id] || 0 : 0;
    store.totalAmount += itemTotal * (1 - discount);
  }

  let discountRate = (subTotal - store.totalAmount) / subTotal;
  if (store.itemCount >= 30) {
    let bulkDiscount = store.totalAmount * 0.25;
    if (bulkDiscount > subTotal - store.totalAmount) {
      store.totalAmount = subTotal * 0.75;
      discountRate = 0.25;
    }
  }

  if (new Date().getDay() === 2) {
    store.totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  store.elements.cartTotal.textContent =
    "총액: " + Math.round(store.totalAmount) + "원";

  if (discountRate > 0) {
    const span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discountRate * 100).toFixed(1) + "% 할인 적용)";
    store.elements.cartTotal.appendChild(span);
  }

  updateStockInfo();
  renderBonusPoints();
}

// 포인트 점수 표출
function renderBonusPoints() {
  store.bonusPoints = Math.floor(store.totalAmount / 1000);
  let ponitsTag = document.getElementById("loyalty-points");
  if (!ponitsTag) {
    ponitsTag = document.createElement("span");
    ponitsTag.id = "loyalty-points";
    ponitsTag.className = "text-blue-500 ml-2";
    store.elements.cartTotal.appendChild(ponitsTag);
  }
  ponitsTag.textContent = "(포인트: " + store.bonusPoints + ")";
}

// 재고부족 문구 노출
function updateStockInfo() {
  let infoMessage = "";
  productList.forEach(function (product) {
    if (product.quantity < 5) {
      infoMessage +=
        product.name +
        ": " +
        (product.quantity > 0
          ? "재고 부족 (" + product.quantity + "개 남음)"
          : "품절") +
        "\n";
    }
  });
  store.elements.stockInfo.textContent = infoMessage;
}

// 장바구니 추가 관리
export function handleAddCartItem() {
  const selectItem = store.elements.productSelect.value;
  const addItem = productList.find((product) => product.id === selectItem);

  if (!addItem || addItem.quantity <= 0) return;

  const item = document.getElementById(addItem.id);

  if (item) {
    addCartItemQuantity(item, addItem);
  } else {
    addNewCartItem(addItem);
  }

  calcCart();
  store.lastSelectProduct = selectItem;
}

// 장바구니에 기존 아이템에 개수 추가
function addCartItemQuantity(item, product) {
  const newQuantity =
    parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
  if (newQuantity <= product.quantity) {
    item.querySelector("span").textContent =
      product.name + " - " + product.val + "원 x " + newQuantity;
    product.quantity--;
  } else {
    alert("재고가 부족합니다.");
  }
}

// 장바구니에 새로운 아이템 추가
function addNewCartItem(product) {
  const newItem = `
    <div id="${product.id}" class="flex justify-between items-center mb-2">
      <span>${product.name} - ${product.val}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
      </div>
    </div>
  `;
  store.elements.cartDisplay.innerHTML += newItem;
  product.quantity--;
}

// 장바구니 아이템 개수 관리
export function handleCountCartItem(event) {
  const target = event.target;
  const classList = target.classList;
  if (
    !classList.contains("quantity-change") &&
    !classList.contains("remove-item")
  )
    return;

  if (classList.contains("quantity-change")) {
    changeCartItem(target);
  } else if (classList.contains("remove-item")) {
    removeCartItem(target);
  }

  calcCart();
}

// 장바구니 아이템 변경
function changeCartItem(target) {
  const productId = target.dataset.productId;
  const productItem = document.getElementById(productId);
  const productItemText = productItem
    .querySelector("span")
    .textContent.split("x ");
  const product = productList.find((product) => product.id === productId);
  const quantityChange = parseInt(target.dataset.change);
  const newQuantity = parseInt(productItemText[1]) + quantityChange;

  if (
    newQuantity > 0 &&
    newQuantity <= product.quantity + parseInt(productItemText[1])
  ) {
    productItem.querySelector("span").textContent =
      productItemText[0] + "x " + newQuantity;
    product.quantity -= quantityChange;
  } else if (newQuantity <= 0) {
    productItem.remove();
    product.quantity -= quantityChange;
  } else {
    alert("재고가 부족합니다.");
  }
}

// 장바구니 아이템 삭제
function removeCartItem(target) {
  const productId = target.dataset.productId;
  const productItem = document.getElementById(productId);
  const productItemText = productItem
    .querySelector("span")
    .textContent.split("x ");
  const product = productList.find((product) => product.id === productId);

  const removeQuantity = parseInt(productItemText[1]);
  product.quantity += removeQuantity;
  productItem.remove();
}
