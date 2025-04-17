import { useState } from "react";
import { Product, productList } from "../data/products";
import { CartItem } from "../data/cartItems";


export function useCart(initialProductList: Product[]) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProductList);

  // 기존 장바구니 아이템에 존재하면 개수를 추가하고, 존재하지 않으면 새로운 아이템 세트를 추가한다.
  const addCartItem = (productId: string) => {
    const product = productList.find((product) => product.id === productId);
    if ( !product || product.quantity <= 0 ) return;

    // productList의 product 재고 확인
    const ItemTotalQuantity = cartItems.find((item) => item.productId === productId)?.quantity ?? 0;
    if ( ItemTotalQuantity >= product.quantity ) {
      alert("재고가 부족합니다.");
      return;
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === productId);
      if ( existingItem ) {
        return prev.map((item) => item.productId === productId ? 
          {...item, quantity: item.quantity + 1}
          : item
        )
      } else {
        return [...prev, { productId, quantity: 1 }]
      }
    });

    setProducts((prev) => 
      prev.map((product) => product.id === productId ? {...product, quantity: product.quantity - 1} : product)
    );
  }

  const changeCartItem = (productId: string, delta: number) => {
    const product = products.find((product) => product.id === productId);
    const cartItem = cartItems.find((item) => item.productId === productId);
    if ( !product || !cartItem ) return;

    const newQuantity = cartItem.quantity + delta;

    if ( newQuantity > 0 && newQuantity <= product.quantity + cartItem.quantity ) {
      setCartItems((prev) => 
        prev.map((item) =>
          item.productId === productId ? {...item, quantity: newQuantity} : item
        )
      );
      setProducts((prev) =>
        prev.map((product) => 
          product.id === productId ? {...product, quantity: product.quantity - delta} : product
        )
      );
    } else if ( newQuantity <= 0 ) {
      removeCartItem(productId);
    } else {
      alert("재고가 부족합니다.");
    }
  }

  const removeCartItem = (productId: string) => {
    const cartItem = cartItems.find((item) => item.productId === productId);
    if ( !cartItem ) return;

    setProducts((prev) => 
      prev.map((product) => 
        product.id === productId ? {...product, quantity: product.quantity + cartItem.quantity} : product
      )
    );

    setCartItems((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  }
  
  return { cartItems, products, addCartItem, changeCartItem, removeCartItem };
}