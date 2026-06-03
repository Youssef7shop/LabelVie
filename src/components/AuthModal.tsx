import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'fr' | 'ar';
  onLogin: (user: { name: string; email: string }) => void;
}

export default function AuthModal({ isOpen, onClose, lang, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && (isLogin || name)) {
      const newUser = { email, name: isLogin ? email.split('@')[0] : name };
      onLogin(newUser);
      
      // Send email simulation when registering
      if (!isLogin) {
        console.log(`[SIMULATION] Email sent to admin (contact@labelvie.ma): New user registered - ${newUser.name} (${newUser.email})`);
        alert(lang === 'fr' ? `Simulation : Un email a été envoyé à l'administration pour le nouvel utilisateur ${newUser.name}` : `محاكاة: تم إرسال بريد إلكتروني للإدارة بتسجيل المستخدم الجديد ${newUser.name}`);
      }

      setEmail('');
      setPassword('');
      setName('');
      onClose();
    }
  };

  const t = {
    fr: {
      login: 'Connexion',
      register: 'Inscription',
      email: 'Adresse email',
      password: 'Mot de passe',
      name: 'Nom complet',
      submitLogin: 'Se connecter',
      submitRegister: 'Créer un compte',
      forgot: 'Mot de passe oublié ?',
      noAccount: "Vous n'avez pas de compte ?",
      hasAccount: 'Vous avez déjà un compte ?'
    },
    ar: {
      login: 'تسجيل الدخول',
      register: 'حساب جديد',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      name: 'الاسم الكامل',
      submitLogin: 'دخول',
      submitRegister: 'إنشاء حساب',
      forgot: 'نسيت كلمة المرور؟',
      noAccount: 'ليس لديك حساب؟',
      hasAccount: 'لديك حساب بالفعل؟'
    }
  }[lang];

  if (!isOpen) return null;

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
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-center font-semibold text-sm transition-colors ${
                isLogin ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.login}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-center font-semibold text-sm transition-colors ${
                !isLogin ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.register}
            </button>
            <button
              onClick={onClose}
              className="px-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
                    <div className="relative">
                      <div className={`absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'right-3' : 'left-3'}`}>
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                        className={`w-full border border-gray-200 rounded-lg py-2.5 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all`}
                        placeholder={t.name}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                    placeholder="email@example.com"
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
                    required
                    className={`w-full border border-gray-200 rounded-lg py-2.5 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <a href="#" className="text-sm font-medium text-brand-green hover:underline">
                    {t.forgot}
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-brand-green text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors mt-2 shadow-sm"
              >
                {isLogin ? t.submitLogin : t.submitRegister}
              </button>

              <div className="text-center mt-6 text-sm text-gray-600">
                {isLogin ? t.noAccount : t.hasAccount}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-semibold text-brand-green hover:underline"
                >
                  {isLogin ? t.register : t.login}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
