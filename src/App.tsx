/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import AdminDashboard from './components/AdminDashboard';
import { Product, CartItem, Order, User as UserType } from './types';
import { products as initialProducts } from './data';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(window.location.hash.toLowerCase() === '#adminlabelvie234');

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash.toLowerCase() === '#adminlabelvie234');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'labelvie_products' && e.newValue) {
        setGlobalProducts(JSON.parse(e.newValue));
      }
      if (e.key === 'labelvie_orders' && e.newValue) {
        setGlobalOrders(JSON.parse(e.newValue));
      }
      if (e.key === 'labelvie_users' && e.newValue) {
        setGlobalUsers(JSON.parse(e.newValue));
      }
      if (e.key === 'labelvie_settings' && e.newValue) {
        setStoreSettings(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [lang, setLang] = useState<'fr' | 'ar'>('fr');
  
  const [globalProducts, setGlobalProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('labelvie_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [globalOrders, setGlobalOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('labelvie_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [globalUsers, setGlobalUsers] = useState<UserType[]>(() => {
    const saved = localStorage.getItem('labelvie_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [storeSettings, setStoreSettings] = useState(() => {
    const saved = localStorage.getItem('labelvie_settings');
    return saved ? JSON.parse(saved) : {
      storeName: 'LabelVie',
      currency: 'MAD',
      contactEmail: 'contact@labelvie.ma'
    };
  });

  const handleUpdateSettings = (newSettings: any) => {
    setStoreSettings(newSettings);
    localStorage.setItem('labelvie_settings', JSON.stringify(newSettings));
  };

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('labelvie_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (newUser: { name: string; email: string }) => {
    setUser(newUser);
    localStorage.setItem('labelvie_user', JSON.stringify(newUser));

    setGlobalUsers(prev => {
      if (!prev.some(u => u.email === newUser.email)) {
        const updated = [...prev, { id: Date.now().toString(), name: newUser.name, email: newUser.email, role: 'customer' as const, createdAt: new Date().toISOString() }];
        localStorage.setItem('labelvie_users', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('labelvie_user');
  };

  const handleUpdateUser = (updatedUser: { name: string; email: string }) => {
    setUser(updatedUser);
    localStorage.setItem('labelvie_user', JSON.stringify(updatedUser));

    setGlobalUsers(prev => {
      const updated = prev.map(u => u.email === user?.email ? { ...u, name: updatedUser.name, email: updatedUser.email } : u);
      localStorage.setItem('labelvie_users', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCheckout = () => {
    const newOrder: Order = {
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.email || 'guest',
      customerName: user?.name || 'Visiteur',
      items: [...cartItems],
      total: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setGlobalOrders(prev => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('labelvie_orders', JSON.stringify(updated));
      return updated;
    });

    setIsCartOpen(false);
    setCartItems([]);
    setCheckoutSuccess(true);
    setTimeout(() => setCheckoutSuccess(false), 4000);
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Optional: Open cart or show toast
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    setGlobalProducts(prev => {
      const updated = [{ ...newProduct, id: Math.random().toString(36).substring(2, 9) }, ...prev];
      localStorage.setItem('labelvie_products', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteProduct = (id: string) => {
    setGlobalProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('labelvie_products', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'pending' | 'delivered' | 'cancelled') => {
    setGlobalOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      localStorage.setItem('labelvie_orders', JSON.stringify(updated));
      return updated;
    });
  };

  if (isAdminRoute) {
    return <AdminDashboard 
      lang={lang} 
      products={globalProducts}
      orders={globalOrders}
      users={globalUsers}
      onAddProduct={handleAddProduct}
      onDeleteProduct={handleDeleteProduct}
      onUpdateOrderStatus={handleUpdateOrderStatus}
      settings={storeSettings}
      onUpdateSettings={handleUpdateSettings}
    />;
  }

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className={`min-h-screen bg-gray-50 flex flex-col ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}
    >
      <Header 
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        lang={lang}
        setLang={setLang}
        user={user}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
        settings={storeSettings}
      />

      <main className="flex-1">
        <Hero lang={lang} />
        
        {/* Featured Products */}
        <section id="products" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                {lang === 'fr' ? 'Nos Produits Phares' : 'منتجاتنا المميزة'}
              </h2>
              <p className="text-gray-600">
                {lang === 'fr' ? 'Une sélection rigoureuse pour votre quotidien.' : 'تشكيلة مختارة بعناية لمتطلباتكم اليومية.'}
              </p>
            </div>
            <a href="#products" className="text-brand-green font-medium hover:underline inline-flex items-center gap-1 group">
              {lang === 'fr' ? 'Voir tout' : 'عرض الكل'}
              <span className={`transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`}>
                →
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {globalProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={addToCart}
                lang={lang}
              />
            ))}
          </div>
        </section>

        <Testimonials lang={lang} />
      </main>

      <Footer lang={lang} />

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        lang={lang}
        onCheckout={handleCheckout}
      />

      {/* Success Toast */}
      {checkoutSuccess && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2">
          <span className="text-green-400">✓</span>
          {lang === 'fr' ? 'Commande effectuée avec succès !' : 'تم تأكيد طلبك بنجاح !'}
        </div>
      )}

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        lang={lang} 
        onLogin={handleLogin}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        lang={lang}
        user={user}
        onUpdate={handleUpdateUser}
        orders={globalOrders.filter(o => o.userId === user?.email)}
      />
    </div>
  );
}
