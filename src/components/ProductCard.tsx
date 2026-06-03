import { Product } from '../types';
import { ShoppingCart, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  lang: 'fr' | 'ar';
}

export default function ProductCard({ product, onAdd, lang }: ProductCardProps) {
  const formatter = new Intl.NumberFormat(lang === 'fr' ? 'fr-MA' : 'ar-MA', {
    style: 'currency',
    currency: 'MAD',
  });

  const buttonText = lang === 'fr' ? 'Ajouter' : 'أضف';

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-600 shadow-sm">
          {product.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate" title={lang === 'fr' ? product.name : product.nameAr}>
          {lang === 'fr' ? product.name : product.nameAr}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-brand-orange">
            {formatter.format(product.price)}
          </span>
          <button
            onClick={() => onAdd(product)}
            className="flex items-center gap-1.5 rounded-full bg-brand-green/10 text-brand-green px-4 py-2 text-sm font-medium hover:bg-brand-green hover:text-white transition-colors duration-200"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">{buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
