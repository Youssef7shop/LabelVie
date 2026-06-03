import { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, Settings, 
  LogOut, Package, TrendingUp, DollarSign, Plus, Edit, Trash2, Store, X
} from 'lucide-react';
import { Product, Order, User } from '../types';

interface AdminDashboardProps {
  lang: 'fr' | 'ar';
  products: Product[];
  orders: Order[];
  users: User[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus?: (orderId: string, status: 'pending' | 'delivered' | 'cancelled') => void;
  settings: any;
  onUpdateSettings: (settings: any) => void;
}

export default function AdminDashboard({ lang, products, orders, users, onAddProduct, onDeleteProduct, onUpdateOrderStatus, settings, onUpdateSettings }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    nameAr: '',
    price: 0,
    category: 'Epicerie',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'
  });
  
  const [localSettings, setLocalSettings] = useState(settings);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrdersCount = orders.length;

  const formatter = new Intl.NumberFormat(lang === 'fr' ? 'fr-MA' : 'ar-MA', {
    style: 'currency',
    currency: 'MAD',
  });

  const handleExit = () => {
    window.location.hash = '';
  };

  const navItems = [
    { id: 'dashboard', label: lang === 'fr' ? 'Tableau de bord' : 'لوحة القيادة', icon: LayoutDashboard },
    { id: 'products', label: lang === 'fr' ? 'Produits' : 'المنتجات', icon: Package },
    { id: 'orders', label: lang === 'fr' ? 'Commandes' : 'الطلبات', icon: ShoppingBag },
    { id: 'customers', label: lang === 'fr' ? 'Clients' : 'العملاء', icon: Users },
    { id: 'settings', label: lang === 'fr' ? 'Paramètres' : 'الإعدادات', icon: Settings },
  ];

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className={`min-h-screen bg-gray-50 flex ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Store className="h-6 w-6 text-brand-green" />
            <span className="text-brand-green">{settings?.storeName?.toUpperCase() || 'LABELVIE'}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
            {lang === 'fr' ? 'Administration' : 'الإدارة'}
          </p>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === item.id 
                  ? 'bg-brand-green text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleExit}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {lang === 'fr' ? "Quitter l'admin" : 'الخروج من الإدارة'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
          <h1 className="text-2xl font-bold text-gray-800">
            {navItems.find(i => i.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <button className="h-10 w-10 bg-brand-green rounded-full text-white font-bold flex items-center justify-center border-2 border-green-100 shadow-sm">
              AM
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
                  <div className="h-14 w-14 bg-green-50 text-brand-green rounded-2xl flex items-center justify-center">
                    <DollarSign className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {lang === 'fr' ? 'Revenus totaux' : 'إجمالي الإيرادات'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{formatter.format(totalRevenue)}</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
                  <div className="h-14 w-14 bg-orange-50 text-brand-orange rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {lang === 'fr' ? 'Commandes' : 'الطلبات'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{totalOrdersCount}</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
                  <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {lang === 'fr' ? 'Clients' : 'العملاء'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders Fake Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {lang === 'fr' ? 'Commandes Récentes' : 'الطلبات الأخيرة'}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50/50 text-xs uppercase font-semibold text-gray-500">
                      <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Client' : 'العميل'}</th>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Montant' : 'المبلغ'}</th>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Statut' : 'الحالة'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-medium text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 font-medium text-gray-700">{order.customerName}</td>
                          <td className="px-6 py-4 font-medium text-gray-900">{formatter.format(order.total)}</td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus?.(order.id, e.target.value as 'pending' | 'delivered' | 'cancelled')}
                              className={`text-xs font-medium rounded-full px-2.5 py-1 border outline-none cursor-pointer ${
                                order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-100' : 
                                order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                'bg-orange-50 text-orange-700 border-orange-100'
                              }`}
                            >
                              <option value="pending">{lang === 'fr' ? 'En attente' : 'قيد الانتظار'}</option>
                              <option value="delivered">{lang === 'fr' ? 'Livré' : 'تم التوصيل'}</option>
                              <option value="cancelled">{lang === 'fr' ? 'Annulé' : 'ملغى'}</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                             {lang === 'fr' ? 'Aucune commande pour le moment' : 'لا توجد طلبات بعد'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-brand-green text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm"
                >
                  <Plus className="h-5 w-5" />
                  {lang === 'fr' ? 'Ajouter un produit' : 'إضافة منتج'}
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50/50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Produit' : 'المنتج'}</th>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Catégorie' : 'الفئة'}</th>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Prix' : 'السعر'}</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-100">
                                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                              </div>
                              <span className="font-semibold text-gray-900 max-w-[200px] truncate">
                                {lang === 'fr' ? product.name : product.nameAr}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            {formatter.format(product.price)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className={`flex items-center justify-end gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                              <button className="p-2 text-gray-400 hover:text-brand-green hover:bg-green-50 rounded-lg transition-colors">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => onDeleteProduct(product.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50/50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Client' : 'العميل'}</th>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Date' : 'التاريخ'}</th>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Montant' : 'المبلغ'}</th>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Articles' : 'العناصر'}</th>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Statut' : 'الحالة'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-medium text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 font-medium text-gray-700">{order.customerName}</td>
                          <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'ar-MA')}</td>
                          <td className="px-6 py-4 font-bold text-gray-900">{formatter.format(order.total)}</td>
                          <td className="px-6 py-4 text-gray-500 min-w-[200px]">
                            <div className="text-xs space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="line-clamp-1 font-medium text-gray-600">
                                  {item.quantity}x {lang === 'fr' ? item.name : item.nameAr}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus?.(order.id, e.target.value as 'pending' | 'delivered' | 'cancelled')}
                              className={`text-xs font-medium rounded-full px-2.5 py-1 border outline-none cursor-pointer ${
                                order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-100' : 
                                order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                'bg-orange-50 text-orange-700 border-orange-100'
                              }`}
                            >
                              <option value="pending">{lang === 'fr' ? 'En attente' : 'قيد الانتظار'}</option>
                              <option value="delivered">{lang === 'fr' ? 'Livré' : 'تم التوصيل'}</option>
                              <option value="cancelled">{lang === 'fr' ? 'Annulé' : 'ملغى'}</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            {lang === 'fr' ? 'Aucune commande pour le moment' : 'لا توجد طلبات بعد'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50/50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Nom' : 'الاسم'}</th>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Email' : 'البريد الإلكتروني'}</th>
                        <th className="px-6 py-4">{lang === 'fr' ? 'Inscription' : 'تاريخ التسجيل'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                            <div className="bg-gray-100 text-gray-600 h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                              {u.name.substring(0, 2)}
                            </div>
                            {u.name}
                          </td>
                          <td className="px-6 py-4 text-gray-500">{u.email}</td>
                          <td className="px-6 py-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'ar-MA')}</td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                            {lang === 'fr' ? 'Aucun client pour le moment' : 'لا يوجد عملاء بعد'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 max-w-3xl">
                <h3 className="font-bold text-gray-900 text-lg mb-6">
                  {lang === 'fr' ? 'Paramètres Généraux' : 'الإعدادات العامة'}
                </h3>
                <form className="space-y-6" onSubmit={e => {
                  e.preventDefault();
                  onUpdateSettings(localSettings);
                  alert(lang === 'fr' ? 'Paramètres sauvegardés avec succès !' : 'تم حفظ الإعدادات بنجاح!');
                }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {lang === 'fr' ? 'Nom du magasin' : 'اسم المتجر'}
                    </label>
                    <input 
                      type="text" 
                      value={localSettings.storeName}
                      onChange={e => setLocalSettings(prev => ({ ...prev, storeName: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {lang === 'fr' ? 'Devise par défaut' : 'العملة الافتراضية'}
                    </label>
                    <select 
                      value={localSettings.currency}
                      onChange={e => setLocalSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green/20"
                    >
                      <option value="MAD">MAD (Dirham Marocain)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="USD">USD (US Dollar)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {lang === 'fr' ? 'Email de contact' : 'البريد الإلكتروني للاتصال'}
                    </label>
                    <input 
                      type="email" 
                      value={localSettings.contactEmail}
                      onChange={e => setLocalSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button type="submit" className="bg-brand-green text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm">
                      {lang === 'fr' ? 'Sauvegarder les modifications' : 'حفظ التغييرات'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {(activeTab !== 'dashboard' && activeTab !== 'products' && activeTab !== 'orders' && activeTab !== 'customers' && activeTab !== 'settings') && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Settings className="h-16 w-16 mb-4 text-gray-200" />
              <p className="text-lg font-medium">
                {lang === 'fr' ? 'Module en construction' : 'الوحدة قيد الإنشاء'}
              </p>
            </div>
          )}
        </div>
      </main>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">{lang === 'fr' ? 'Nouveau Produit' : 'منتج جديد'}</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => {
              e.preventDefault();
              onAddProduct({
                name: newProduct.name,
                nameAr: newProduct.nameAr,
                price: Number(newProduct.price),
                category: newProduct.category,
                image: newProduct.image
              });
              setIsAddModalOpen(false);
              setNewProduct({ name: '', nameAr: '', price: 0, category: 'Epicerie', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' });
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'fr' ? 'Nom (FR)' : 'الاسم (بالفرنسية)'}</label>
                <input 
                  required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'fr' ? 'Nom (AR)' : 'الاسم (بالعربية)'}</label>
                <input 
                  required type="text" value={newProduct.nameAr} onChange={e => setNewProduct({...newProduct, nameAr: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'fr' ? 'Prix (MAD)' : 'السعر (درهم)'}</label>
                <input 
                  required type="number" min="0" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'fr' ? 'Catégorie' : 'الفئة'}</label>
                <select 
                  value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green/20"
                >
                  <option value="Epicerie">Épicerie</option>
                  <option value="Frais">Frais</option>
                  <option value="Boissons">Boissons</option>
                  <option value="Entretien">Entretien</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'fr' ? 'Image (URL)' : 'صورة (رابط)'}</label>
                <input 
                  type="url" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-green/20"
                />
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-brand-green text-white font-semibold py-3 rounded-lg hover:bg-green-700">
                  {lang === 'fr' ? 'Enregistrer' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
