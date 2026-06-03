import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  lang: 'fr' | 'ar';
  onCheckout: () => void;
}

export default function Cart({ isOpen, onClose, items, onRemove, onUpdateQuantity, lang, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const formatter = new Intl.NumberFormat(lang === 'fr' ? 'fr-MA' : 'ar-MA', {
    style: 'currency',
    currency: 'MAD',
  });

  const t = {
    fr: {
      title: "Votre Panier",
      empty: "Votre panier est vide.",
      continue: "Continuer les achats",
      checkout: "Passer la commande",
      total: "Total",
    },
    ar: {
      title: "سلة المشتريات",
      empty: "سلة المشتريات فارغة.",
      continue: "مواصلة التسوق",
      checkout: "إتمام الطلب",
      total: "المجموع",
    }
  }[lang];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ [lang === 'ar' ? 'left' : 'right']: '-100%', opacity: 0 }}
            animate={{ [lang === 'ar' ? 'left' : 'right']: 0, opacity: 1 }}
            exit={{ [lang === 'ar' ? 'left' : 'right']: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 bottom-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-full max-w-md bg-white shadow-2xl z-50 flex flex-col`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-green" />
                {t.title}
                <span className="bg-gray-100 text-gray-600 text-sm py-0.5 px-2 rounded-full ml-1">
                  {items.length}
                </span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-gray-300" />
                  </div>
                  <p>{t.empty}</p>
                  <button
                    onClick={onClose}
                    className="text-brand-green font-medium hover:underline"
                  >
                    {t.continue}
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100">
                        <img
                          src={item.image}
                          alt={lang === 'fr' ? item.name : item.nameAr}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="line-clamp-2">
                            {lang === 'fr' ? item.name : item.nameAr}
                          </h3>
                          <p className="ml-4 whitespace-nowrap">{formatter.format(item.price * item.quantity)}</p>
                        </div>
                        
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1 px-2.5 hover:bg-gray-50 text-gray-500 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 px-2.5 hover:bg-gray-50 text-gray-500 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => onRemove(item.id)}
                            className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-6 bg-gray-50">
                <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                  <p>{t.total}</p>
                  <p>{formatter.format(total)}</p>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full rounded-full border border-transparent bg-brand-green px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-green-700 transition-all hover:shadow-lg"
                >
                  {t.checkout}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
