import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, User, Lock, Save, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Order } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'fr' | 'ar';
  user: { name: string; email: string } | null;
  onUpdate: (user: { name: string; email: string }) => void;
  orders?: Order[];
}

export default function ProfileModal({ isOpen, onClose, lang, user, onUpdate, orders = [] }: ProfileModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onUpdate({ name, email });
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        // Do not close so user sees success
      }, 3000);
    }
  };

  const t = {
    fr: {
      title: 'Mon Profil',
      profileTitle: 'Informations',
      ordersTitle: 'Mes Commandes',
      name: 'Nom complet',
      email: 'Adresse email',
      password: 'Nouveau mot de passe (optionnel)',
      save: 'Enregistrer les modifications',
      success: 'Profil mis à jour avec succès !',
      noOrders: 'Aucune commande pour le moment.',
      orderTotal: 'Total',
      orderStatus: 'Statut',
      items: 'articles'
    },
    ar: {
      title: 'حسابي',
      profileTitle: 'معلوماتيات',
      ordersTitle: 'طلباتي',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      password: 'كلمة مرور جديدة (اختياري)',
      save: 'حفظ التغييرات',
      success: 'تم تحديث الحساب بنجاح !',
      noOrders: 'لا توجد طلبات حاليا.',
      orderTotal: 'المجموع',
      orderStatus: 'الحالة',
      items: 'عناصر'
    }
  }[lang];

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-brand-green" />
              {t.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full shadow-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex border-b border-gray-100 flex-shrink-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {t.profileTitle}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'orders' ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {t.ordersTitle}
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {activeTab === 'profile' ? (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
                  <div className="relative">
                    <div className={`absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'right-3' : 'left-3'}`}>
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={`w-full border border-gray-200 rounded-lg py-2.5 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                  <div className="relative">
                    <div className={`absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'right-3' : 'left-3'}`}>
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full border border-gray-200 rounded-lg py-2.5 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
                  <div className="relative">
                    <div className={`absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'right-3' : 'left-3'}`}>
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full border border-gray-200 rounded-lg py-2.5 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {successMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium border border-green-100 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {t.success}
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 bg-brand-green text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors mt-4 shadow-sm"
                >
                  <Save className="h-5 w-5" />
                  {t.save}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mb-3" />
                    <p>{t.noOrders}</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <span className="font-semibold text-gray-900">{order.id}</span>
                        <span className="text-sm text-gray-500 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'ar-MA')}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600 line-clamp-1">{item.quantity}x {lang === 'fr' ? item.name : item.nameAr}</span>
                            <span className="font-medium text-gray-900 whitespace-nowrap px-2">{(item.price * item.quantity).toFixed(2)} MAD</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-1">
                        <div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {lang === 'fr' 
                              ? (order.status === 'pending' ? 'En cours' : order.status === 'delivered' ? 'Livré' : 'Annulé')
                              : (order.status === 'pending' ? 'قيد المعالجة' : order.status === 'delivered' ? 'مُسلَّم' : 'مُلغى')
                            }
                          </span>
                        </div>
                        <div className="font-bold text-brand-green">
                          {t.orderTotal}: {order.total.toFixed(2)} MAD
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
