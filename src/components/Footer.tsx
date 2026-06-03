import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { useState } from 'react';

interface FooterProps {
  lang: 'fr' | 'ar';
}

export default function Footer({ lang }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };
  const t = {
    fr: {
      about: "À Propos",
      aboutText: "LabelVie.ma vous offre la meilleure sélection de produits frais et d'épicerie, livrés directement chez vous.",
      links: "Liens Rapides",
      contact: "Contact",
      newsletter: "Newsletter",
      newsletterText: "Inscrivez-vous pour recevoir nos promotions.",
      subscribe: "S'inscrire",
      rights: "Tous droits réservés.",
      placeholder: "Votre email..."
    },
    ar: {
      about: "عن الشركة",
      aboutText: "تقدم لك LabelVie.ma أفضل تشكيلة من المنتجات الطازجة والبقالة، تصلك مباشرة إلى منزلك.",
      links: "روابط سريعة",
      contact: "اتصل بنا",
      newsletter: "النشرة الإخبارية",
      newsletterText: "اشترك لتلقي عروضنا الترويجية.",
      subscribe: "اشترك",
      rights: "جميع الحقوق محفوظة.",
      placeholder: "بريدك الإلكتروني..."
    }
  }[lang];

  return (
    <footer id="footer" className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">LABEL<span className="text-brand-orange">VIE</span>.MA</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t.aboutText}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">{t.links}</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-brand-green transition-colors">{lang === 'fr' ? 'Accueil' : 'الرئيسية'}</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-brand-green transition-colors">{lang === 'fr' ? 'Produits' : 'المنتجات'}</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-brand-green transition-colors">{lang === 'fr' ? 'Témoignages' : 'آراء العملاء'}</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-brand-green transition-colors">{lang === 'fr' ? 'Contact' : 'اتصل بنا'}</a></li>
            </ul>
          </div>

          <div id="contact">
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">{t.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>contact@labelvie.ma</span>
              </li>
              <li>0802 00 00 00</li>
              <li>{lang === 'fr' ? 'Casablanca, Maroc' : 'الدار البيضاء، المغرب'}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">{t.newsletter}</h4>
            <p className="text-gray-400 mb-4">{t.newsletterText}</p>
            <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholder}
                className="bg-gray-800 border items-center border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green transition-colors w-full"
                required
              />
              <button 
                type="submit"
                className="bg-brand-green hover:bg-green-700 text-white font-semibold rounded-lg px-4 py-3 transition-colors w-full"
              >
                {subscribed ? (lang === 'fr' ? 'Inscrit ! ✓' : 'تم الاشتراك ! ✓') : t.subscribe}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 space-x-1">
            &copy; {new Date().getFullYear()} LabelVie.ma. {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
