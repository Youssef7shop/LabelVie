import { motion } from 'motion/react';
import { ArrowRight, ShoppingBasket } from 'lucide-react';

interface HeroProps {
  lang: 'fr' | 'ar';
}

export default function Hero({ lang }: HeroProps) {
  const t = {
    fr: {
      badge: "Vos courses en un clic",
      title: "La fraîcheur à votre porte.",
      subtitle: "Découvrez notre sélection de produits frais, d'épicerie et d'articles du quotidien à des prix imbattables.",
      cta: "Faire mes courses",
    },
    ar: {
      badge: "بقالتك بنقرة واحدة",
      title: "الطراوة حتى باب بيتك.",
      subtitle: "اكتشف تشكيلتنا من المنتجات الطازجة والبقالة والمنتجات اليومية بأسعار لا تقبل المنافسة.",
      cta: "تسوق الآن",
    }
  }[lang];

  return (
    <div className="relative bg-brand-green bg-opacity-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="relative z-10 lg:w-1/2 flex flex-col items-start gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-brand-green font-medium text-sm"
          >
            <ShoppingBasket className="h-4 w-4" />
            {t.badge}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight"
          >
            {t.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed"
          >
            {t.subtitle}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4"
          >
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all bg-brand-green rounded-full hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5"
            >
              {t.cta}
              <ArrowRight className={`h-5 w-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Image */}
      <div className="lg:absolute lg:inset-y-0 lg:end-0 lg:w-1/2 h-64 lg:h-full">
        <img
          className="h-full w-full object-cover object-center"
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000"
          alt="Fresh groceries"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-gray-50/90 to-transparent lg:hidden" />
      </div>
    </div>
  );
}
