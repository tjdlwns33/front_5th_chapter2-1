let productSelect, addCartButton, cartDisplay, cartTotal, stockInfo;
let lastSelectProduct, bonusPts=0, totalAmount=0, itemCount=0;

const prodList = [
  {id: 'p1', name: '상품1', val: 10000, quantity: 50 },
  {id: 'p2', name: '상품2', val: 20000, quantity: 30 },
  {id: 'p3', name: '상품3', val: 30000, quantity: 20 },
  {id: 'p4', name: '상품4', val: 15000, quantity: 0 },
  {id: 'p5', name: '상품5', val: 25000, quantity: 10 }
];

function main() {
  const root = document.getElementById('app');
  const main = `
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
  root.innerHTML = main;

  cartDisplay = document.getElementById('cart-items');
  cartTotal = document.getElementById('cart-total');
  productSelect = document.getElementById('product-select');
  addCartButton = document.getElementById('add-to-cart');
  stockInfo = document.getElementById('stock-status');

  updateSelectOptions();
  calcCart();

  setTimeout(function () {
    setInterval(function () {
      var luckyItem=prodList[Math.floor(Math.random() * prodList.length)];
      if(Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.val=Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if(lastSelectProduct) {
        var suggest=prodList.find(function (item) { return item.id !== lastSelectProduct && item.quantity > 0; });
        if(suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val=Math.round(suggest.val * 0.95);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};
main();


// 포인트 점수 표출
function renderBonusPoints() {
  bonusPts = Math.floor(totalAmount / 1000);
  let ptsTag = document.getElementById('loyalty-points');
  if(!ptsTag) {
    ptsTag=document.createElement('span');
    ptsTag.id='loyalty-points';
    ptsTag.className='text-blue-500 ml-2';
    cartTotal.appendChild(ptsTag);
  }
  ptsTag.textContent='(포인트: ' + bonusPts + ')';
};

function calcCart() {
  totalAmount=0;
  itemCount=0;
  var cartItems = cartDisplay.children;
  var subTotal=0;
  
  for (var i=0; i < cartItems.length; i++) {
    const currentItem = prodList.find(product => product.id === cartItems[i].id);
    const quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
    const itemTotal = currentItem.val * quantity;
    itemCount += quantity;
    subTotal += itemTotal;

    const discountList = {
      p1: 0.1,
      p2: 0.15,
      p3: 0.2,
      p4: 0.05,
      p5: 0.25,
    }
    const discount = quantity >= 10 ? (discountList[currentItem.id] || 0) : 0;
    totalAmount += itemTotal * (1 - discount);
  }

  let discountRate = 0;
  let discount = subTotal - totalAmount;
  if(itemCount >= 30) {
    var bulkDiscount=totalAmount * 0.25;
    if(bulkDiscount > discount) {
      totalAmount=subTotal * 0.75;
      discountRate=0.25;
    } else {
      discountRate= discount / subTotal;
    }
  } else {
    discountRate= discount / subTotal;
  }

  if(new Date().getDay() === 2) {
    totalAmount *= (1 - 0.1);
    discountRate=Math.max(discountRate, 0.1);
  }

  cartTotal.textContent='총액: ' + Math.round(totalAmount) + '원';

  if(discountRate > 0) {
    var span=document.createElement('span');
    span.className='text-green-500 ml-2';
    span.textContent='(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotal.appendChild(span);
  }
  
  updateStockInfo();
  renderBonusPoints();
}

// 상품 셀렉트 옵션 설정
function updateSelectOptions() {
  productSelect.innerHTML='';
  prodList.forEach(function (product) {
    const option=document.createElement('option');
    option.value=product.id;
    option.textContent=product.name + ' - ' + product.val + '원';
    if(product.quantity === 0) option.disabled=true;
    productSelect.appendChild(option);
  });
}

// 재고부족 문구 노출
function updateStockInfo() {
  let infoMessage='';
  prodList.forEach(function (product) {
    if(product.quantity < 5) {infoMessage += product.name + ': ' + (product.quantity > 0 ? '재고 부족 ('+product.quantity+'개 남음)' : '품절') + '\n';
    }
  });
  stockInfo.textContent=infoMessage;
}

// 장바구니 추가 버튼 클릭
addCartButton.addEventListener('click', function () {
  const selectItem=productSelect.value;
  const addItem=prodList.find(product => product.id === selectItem);

  if(!addItem || addItem.quantity <= 0) return;

  const item=document.getElementById(addItem.id);

  if(item) {
    addCartItemQuantity(item, addItem);
  } else {
    addNewCartItem(addItem);
  }

  calcCart();
  lastSelectProduct=selectItem;
});

// 장바구니에 기존 아이템에 개수 추가
function addCartItemQuantity(item, product) {
  const newQuantity=parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
  if(newQuantity <= product.quantity) {
    item.querySelector('span').textContent=product.name + ' - ' + product.val + '원 x ' + newQuantity;
    product.quantity--;
  } else {
    alert('재고가 부족합니다.');
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
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button></div>
      </div>
    </div>
  `;
  cartDisplay.innerHTML += newItem;
  product.quantity--;
}


// 장바구니 아이템 보여주는 영역 클릭
cartDisplay.addEventListener('click', function (event) {
  var target=event.target;
  if(!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) return;

  if(target.classList.contains('quantity-change')) {
    changeCartItem(target);
  } else if(target.classList.contains('remove-item')) {
    removeCartItem(target);
  }

  calcCart();
});

// 장바구니 아이템 변경
function changeCartItem(target) {
  const productId=target.dataset.productId;
  const productItem=document.getElementById(productId);
  const productItemText = productItem.querySelector('span').textContent.split('x ');
  const product=prodList.find(product => product.id === productId);

  const quantityChange=parseInt(target.dataset.change);
  const newQuantity=parseInt(productItemText[1]) + quantityChange;
  
  if(newQuantity > 0 && newQuantity <= product.quantity + parseInt(productItemText[1])) {
    productItem.querySelector('span').textContent=productItemText[0] + 'x ' + newQuantity;
    product.quantity -= quantityChange;
  } else if(newQuantity <= 0) {
    productItem.remove();
    product.quantity -= quantityChange;
  } else {
    alert('재고가 부족합니다.');
  }
}

// 장바구니 아이템 삭제
function removeCartItem(target) {
  const productId=target.dataset.productId;
  const productItem=document.getElementById(productId);
  const productItemText = productItem.querySelector('span').textContent.split('x ');
  const product=prodList.find(product => product.id === productId);

  const removeQuantity=parseInt(productItemText[1]);
  product.quantity += removeQuantity;
  productItem.remove();
}