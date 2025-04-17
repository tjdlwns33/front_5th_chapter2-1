import { useEffect, useState } from "react";
import { productList } from "../data/products";
import { CartItem } from "../data/cartItems";

const PRODUCT_DISCOUNT_RATES: Record<string, number> = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

interface CartItemProps {
  cartItems: CartItem[];
}

export const Cart: React.FC<CartItemProps> = ({cartItems}) => {
  const [total, setTotal] = useState(0);
  const [discountRate, setdiscountRate] = useState(0);

  useEffect(() => {
    let subTotal = 0;
    let finalTotal = 0;
    let itemCount = 0;
  
    cartItems.forEach((item) => {
      const product = productList.find((product) => product.id === item.productId);
      if (!product) return;
  
      const itemTotal = product.value * item.quantity;
      const itemDiscount = item.quantity >= 10 ? PRODUCT_DISCOUNT_RATES[product.id] || 0 : 0;
      subTotal += itemTotal;
      finalTotal += itemTotal * (1 - itemDiscount);
      itemCount += item.quantity;
    })
  
    let rate = (subTotal - finalTotal) / subTotal;
    if (itemCount >= 30) {
      let bulkDiscount = finalTotal * 0.25;
      if (bulkDiscount > subTotal - finalTotal) {
        finalTotal = subTotal * 0.75;
        rate = 0.25;
      } 
    }
  
    if (new Date().getDay() === 2) {
      finalTotal *= 1 - 0.1;
      rate = Math.max(rate, 0.1);
    }
  
    setTotal(Math.round(finalTotal));
    setdiscountRate(rate);
  }, [cartItems])

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {total}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
    </div>
  )
};