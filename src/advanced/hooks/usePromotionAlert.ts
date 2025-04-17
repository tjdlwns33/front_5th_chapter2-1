import { useEffect } from "react";
import { Product } from "../data/products"


type UsePromotionAlertProps = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  lastSelectedProductId: string | null;
}

export function usePromotionAlert({ products, setProducts, lastSelectedProductId } : UsePromotionAlertProps) {
  useEffect(() => {
    const flashSaleTimeout = setTimeout(() => {
      const flashSaleInterval = setInterval(function() {
        const availableProducts = products.filter((product) => product.quantity > 0);
        if ( availableProducts.length === 0 ) return;
        
        const luckyItem = availableProducts[Math.floor(Math.random() * availableProducts.length)];
        if ( Math.random() < 0.3 ) {
          setProducts((prev) =>
            prev.map((product) => 
              product.id === luckyItem.id ? {...product, value: Math.round(product.value * 0.8)} : product
            )
          );
          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        }
      }, 30000);
      return () => clearInterval(flashSaleInterval);
    }, Math.random() * 10000);

    const suggestTimeout = setTimeout(() => {
      const suggestInterval = setInterval(function(){
        if ( !lastSelectedProductId ) return;
        
        const suggestion = products.find((product) => product.id !== lastSelectedProductId && product.quantity > 0);
        if ( suggestion ) {
          alert(`${suggestion.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          setProducts((prev) =>
            prev.map((product) => product.id === suggestion.id ? {...product, value: Math.round(product.value * 0.95)} : product)
          );
        }
      }, 60000);
      return () => clearInterval(suggestInterval);
    }, Math.random() * 20000)

    return () => {
      clearTimeout(flashSaleTimeout);
      clearTimeout(suggestTimeout);
    }
  }, [products, setProducts, lastSelectedProductId]);
}