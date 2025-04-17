import React, { useState } from 'react';
import { Select } from './components/Select';
import { productList } from './data/products';
import { Cart } from './components/Cart';
import { useCart } from './hooks/useCart';
import { CartItemSet } from './components/CartItem';
import { usePromotionAlert } from './hooks/usePromotionAlert';

const App: React.FC = () => {
  const { cartItems, products, addCartItem, changeCartItem, removeCartItem } = useCart(productList);
  const [selectedId, setSelectedId] = useState(productList[0]?.id ?? "");
  const [lastSelectedProductId, setLastSelectedProductId] = useState<string | null>(null);
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(e.target.value);
    setLastSelectedProductId(e.target.value);
  }

  usePromotionAlert({products, setProducts: () => {}, lastSelectedProductId});

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {cartItems.map((item) => {
            const product = productList.find((product) => product.id === item.productId);
            if ( !product ) return null;
            return (
              <CartItemSet key={item.productId} item={item} product={product} changeCartItem={changeCartItem} removeCartItem={removeCartItem}/>
            )
          })}
        </div>
        <Cart cartItems={cartItems}/>
        <Select selectedId={selectedId} products={productList} onChange={handleSelectChange}/>
        <button type="button" id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => {if (selectedId) addCartItem(selectedId)}}>추가</button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  );
};

export default App;