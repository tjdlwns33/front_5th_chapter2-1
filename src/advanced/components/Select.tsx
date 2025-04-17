import { Product } from "../data/products";

interface SelectProps {
  products: Product[];
  selectedId: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select: React.FC<SelectProps> = ({ products, selectedId, onChange }) => {
  return (
    <select value={selectedId} id="product-select" className="border rounded p-2 mr-2" onChange={onChange}>
      {products.map((product) => (
        <option key={product.id} value={product.id} disabled={product.quantity === 0}>
          {product.name} - {product.value}원
        </option>
      ))}
    </select>
  )
}