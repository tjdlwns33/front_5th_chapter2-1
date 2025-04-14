var sel, addBtn, cartDisp, sum, stockInfo;
var lastSel, bonusPts=0, totalAmt=0, itemCnt=0;

const prodList = [
  {id: 'p1', name: '상품1', val: 10000, q: 50 },
  {id: 'p2', name: '상품2', val: 20000, q: 30 },
  {id: 'p3', name: '상품3', val: 30000, q: 20 },
  {id: 'p4', name: '상품4', val: 15000, q: 0 },
  {id: 'p5', name: '상품5', val: 25000, q: 10 }
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

  cartDisp = document.getElementById('cart-items');
  sum = document.getElementById('cart-total');
  sel = document.getElementById('product-select');
  addBtn = document.getElementById('add-to-cart');
  stockInfo = document.getElementById('stock-status');

  updateSelOpts();
  calcCart();

  setTimeout(function () {
    setInterval(function () {
      var luckyItem=prodList[Math.floor(Math.random() * prodList.length)];
      if(Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val=Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if(lastSel) {
        var suggest=prodList.find(function (item) { return item.id !== lastSel && item.q > 0; });
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
function renderBonusPts() {
  bonusPts = Math.floor(totalAmt / 1000);
  let ptsTag = document.getElementById('loyalty-points');
  if(!ptsTag) {
    ptsTag=document.createElement('span');
    ptsTag.id='loyalty-points';
    ptsTag.className='text-blue-500 ml-2';
    sum.appendChild(ptsTag);
  }
  ptsTag.textContent='(포인트: ' + bonusPts + ')';
};

function calcCart() {
  totalAmt=0;
  itemCnt=0;
  var cartItems = cartDisp.children;
  var subTot=0;
  
  for (var i=0; i < cartItems.length; i++) {
    const currentItem = prodList.find(prod => prod.id === cartItems[i].id);
    const quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
    const itemTotal = currentItem.val * quantity;
    itemCnt += quantity;
    subTot += itemTotal;

    const discountList = {
      p1: 0.1,
      p2: 0.15,
      p3: 0.2,
      p4: 0.05,
      p5: 0.25,
    }
    const discount = quantity >= 10 ? (discountList[currentItem.id] || 0) : 0;
    totalAmt += itemTotal * (1 - discount);
  }

  let discountRate = 0;
  let discount = subTot - totalAmt;
  if(itemCnt >= 30) {
    var bulkDisc=totalAmt * 0.25;
    if(bulkDisc > discount) {
      totalAmt=subTot * 0.75;
      discountRate=0.25;
    } else {
      discountRate= discount / subTot;
    }
  } else {
    discountRate= discount / subTot;
  }

  if(new Date().getDay() === 2) {
    totalAmt *= (1 - 0.1);
    discountRate=Math.max(discountRate, 0.1);
  }

  sum.textContent='총액: ' + Math.round(totalAmt) + '원';

  if(discountRate > 0) {
    var span=document.createElement('span');
    span.className='text-green-500 ml-2';
    span.textContent='(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }
  
  updateStockInfo();
  renderBonusPts();
}

// 상품 셀렉트 옵션 설정
function updateSelOpts() {
  sel.innerHTML='';
  prodList.forEach(function (item) {
    const opt=document.createElement('option');
    opt.value=item.id;
    opt.textContent=item.name + ' - ' + item.val + '원';
    if(item.q === 0) opt.disabled=true;
    sel.appendChild(opt);
  });
}

// 재고부족 문구 노출
function updateStockInfo() {
  let infoMsg='';
  prodList.forEach(function (item) {
    if(item.q < 5) {infoMsg += item.name + ': ' + (item.q > 0 ? '재고 부족 ('+item.q+'개 남음)' : '품절') + '\n';
    }
  });
  stockInfo.textContent=infoMsg;
}


addBtn.addEventListener('click', function () {
  var selItem=sel.value;
  var itemToAdd=prodList.find(p => p.id === selItem);
  if(itemToAdd && itemToAdd.q > 0) {
    var item=document.getElementById(itemToAdd.id);
    if(item) {
      var newQty=parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if(newQty <= itemToAdd.q) {
        item.querySelector('span').textContent=itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
        itemToAdd.q--;
      } else {alert('재고가 부족합니다.');}
    } else {
      const newItem = `
        <div id="${itemToAdd.id}" class="flex justify-between items-center mb-2">
          <span>${itemToAdd.name} - ${itemToAdd.val}원 x 1</span>
          <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button></div>
          </div>
        </div>
      `;
      cartDisp.innerHTML += newItem;

      itemToAdd.q--;
    }
    calcCart();
    lastSel=selItem;
  }
});


cartDisp.addEventListener('click', function (event) {
  var tgt=event.target;
  if(tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    var prodId=tgt.dataset.productId;
    var itemElem=document.getElementById(prodId);
    var prod=prodList.find(function (p) { return p.id === prodId; });
    if(tgt.classList.contains('quantity-change')) {
      var qtyChange=parseInt(tgt.dataset.change);
      var newQty=parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if(newQty > 0 && newQty <= prod.q + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])) {
        itemElem.querySelector('span').textContent=itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.q -= qtyChange;
      } else if(newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if(tgt.classList.contains('remove-item')) {
      var remQty=parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.q += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});