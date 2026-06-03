/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { collection, onSnapshot, setDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
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
    // Listen to Firebase products
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => doc.data() as Product);
      if (productsData.length === 0) setGlobalProducts(initialProducts); // fallback
      else setGlobalProducts(productsData);
    });

    // Listen to Firebase orders
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setGlobalOrders(snapshot.docs.map(doc => doc.data() as Order));
    });

    // Listen to Firebase users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setGlobalUsers(snapshot.docs.map(doc => doc.data() as UserType));
    });

    // Listen to Firebase settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'store'), (docSnap) => {
      if (docSnap.exists()) {
        setStoreSettings(docSnap.data());
      }
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubUsers();
      unsubSettings();
    };
  }, []);

  const [lang, setLang] = useState<'fr' | 'ar'>('fr');
  
  const [globalProducts, setGlobalProducts] = useState<Product[]>(initialProducts);
  const [globalOrders, setGlobalOrders] = useState<Order[]>([]);
  const [globalUsers, setGlobalUsers] = useState<UserType[]>([]);
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'LabelVie',
    currency: 'MAD',
    contactEmail: 'contact@labelvie.ma'
  });

  const handleUpdateSettings = async (newSettings: any) => {
    try {
      await setDoc(doc(db, 'settings', 'store'), newSettings);
    } catch (error) {
      console.error(error);
    }
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

  const handleLogin = async (newUser: { name: string; email: string }) => {
    setUser(newUser);
    localStorage.setItem('labelvie_user', JSON.stringify(newUser));

    setGlobalUsers(prev => {
      const isExisting = prev.some(u => u.email === newUser.email);
      if (!isExisting) {
        const newUserObj = { id: Date.now().toString(), name: newUser.name, email: newUser.email, role: 'customer' as const, createdAt: new Date().toISOString() };
        setDoc(doc(db, 'users', newUserObj.id), newUserObj);
        return [...prev, newUserObj];
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

    const existingUser = globalUsers.find(u => u.email === user?.email);
    if (existingUser) {
      const u = { ...existingUser, name: updatedUser.name, email: updatedUser.email };
      setDoc(doc(db, 'users', u.id), u);
    }
  };

  const handleCheckout = async () => {
    const newOrder: Order = {
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.email || 'guest',
      customerName: user?.name || 'Visiteur',
      items: [...cartItems],
      total: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (e) {
      console.error(e);
    }

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

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const prod = { ...newProduct, id };
    await setDoc(doc(db, 'products', id), prod);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: 'pending' | 'delivered' | 'cancelled') => {
    const order = globalOrders.find(o => o.id === orderId);
    if (order) {
      const updatedOrder = { ...order, status: newStatus };
      await setDoc(doc(db, 'orders', orderId), updatedOrder);
    }
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
