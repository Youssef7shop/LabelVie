import { ShoppingCart, Menu, Globe, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface HeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
  lang: 'fr' | 'ar';
  setLang: (lang: 'fr' | 'ar') => void;
  onOpenAuth: () => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
  onOpenProfile: () => void;
  settings: any;
}

export default function Header({ cartItemCount, onOpenCart, lang, setLang, onOpenAuth, user, onLogout, onOpenProfile, settings }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-brand-green"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 cursor-pointer">
              <span className="text-2xl font-bold text-brand-green tracking-tight">{settings?.storeName?.toUpperCase() || 'LABELVIE'}<span className="text-brand-orange">.MA</span></span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8 font-medium text-gray-600">
            <a href="#" className="hover:text-brand-green transition-colors">{lang === 'fr' ? 'Accueil' : 'الرئيسية'}</a>
            <a href="#products" className="hover:text-brand-green transition-colors">{lang === 'fr' ? 'Produits' : 'المنتجات'}</a>
            <a href="#testimonials" className="hover:text-brand-green transition-colors">{lang === 'fr' ? 'Témoignages' : 'آراء العملاء'}</a>
            <a href="#contact" className="hover:text-brand-green transition-colors">{lang === 'fr' ? 'Contact' : 'اتصل بنا'}</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
              className="flex items-center gap-1.5 p-2 text-sm font-medium text-gray-600 hover:text-brand-green transition-colors rounded-full hover:bg-gray-50"
            >
              <Globe className="h-5 w-5" />
              <span className="hidden sm:inline">{lang === 'fr' ? 'العربية' : 'Français'}</span>
            </button>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-brand-green transition-colors rounded-full hover:bg-gray-50"
                  title={user.name}
                >
                  <User className="h-5 w-5 text-brand-green" />
                  <span className="hidden sm:inline text-sm font-medium">{user.name.split(' ')[0]}</span>
                </button>
                {isProfileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    />
                    <div className={`absolute top-full ${lang === 'ar' ? 'left-0' : 'right-0'} mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden`}>
                      <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        <p className="font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          onOpenProfile();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-brand-green transition-colors text-sm font-medium border-b border-gray-50"
                      >
                        {lang === 'fr' ? 'Mon Profil' : 'حسابي'}
                      </button>
                      <button 
                        onClick={() => {
                          onLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        {lang === 'fr' ? 'Déconnexion' : 'تسجيل الخروج'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="flex p-2 text-gray-600 hover:text-brand-green transition-colors rounded-full hover:bg-gray-50"
              >
                <User className="h-5 w-5" />
              </button>
            )}

            <button 
              onClick={onOpenCart}
              className="relative p-2 text-gray-600 hover:text-brand-green transition-colors rounded-full hover:bg-gray-50"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-brand-orange rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-4 font-medium text-gray-600">
              <a href="#" className="hover:text-brand-green" onClick={() => setIsMobileMenuOpen(false)}>{lang === 'fr' ? 'Accueil' : 'الرئيسية'}</a>
              <a href="#products" className="hover:text-brand-green" onClick={() => setIsMobileMenuOpen(false)}>{lang === 'fr' ? 'Produits' : 'المنتجات'}</a>
              <a href="#testimonials" className="hover:text-brand-green" onClick={() => setIsMobileMenuOpen(false)}>{lang === 'fr' ? 'Témoignages' : 'آراء العملاء'}</a>
              <a href="#contact" className="hover:text-brand-green" onClick={() => setIsMobileMenuOpen(false)}>{lang === 'fr' ? 'Contact' : 'اتصل بنا'}</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
