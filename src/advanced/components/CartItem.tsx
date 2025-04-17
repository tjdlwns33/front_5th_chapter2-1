
import { CartItem } from "../data/cartItems";
import { Product } from "../data/products";

interface CartItemProps {
  item: CartItem;
  product: Product;
  changeCartItem: (productId: string, delta: number) => void;
  removeCartItem: (productId: string) => void;
}

export const CartItemSet:React.FC<CartItemProps> = ({item, product, changeCartItem, removeCartItem}) => {
  return (
    <div id={product.id} className="flex justify-between items-center mb-2">
      <span>{product.name} - {product.value}원 x {item.quantity}</span>
      <div>
        <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" onClick={() => changeCartItem(product.id, -1)}>-</button>
        <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"onClick={() => changeCartItem(product.id, +1)} >+</button>
        <button className="remove-item bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeCartItem(product.id)}>삭제</button>
      </div>
    </div>
  );
};
