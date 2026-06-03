import { Star } from 'lucide-react';
import { motion } from 'motion/react';

interface TestimonialsProps {
  lang: 'fr' | 'ar';
}

export default function Testimonials({ lang }: TestimonialsProps) {
  const t = {
    fr: {
      title: "Ce que disent nos clients",
      subtitle: "La satisfaction de nos clients est notre plus grande récompense.",
    },
    ar: {
      title: "ماذا يقول عملاؤنا",
      subtitle: "رضا عملائنا هو أكبر مكافأة لنا.",
    }
  }[lang];

  const testimonials = [
    {
      id: 1,
      name: lang === 'fr' ? 'Karim H.' : 'كريم ح.',
      role: lang === 'fr' ? 'Client Fidèle' : 'عميل وفي',
      content: lang === 'fr' 
        ? "Des produits d'une fraîcheur incroyable. La livraison était ponctuelle et tout est arrivé en parfait état. Je recommande vivement !"
        : "منتجات طازجة بشكل لا يصدق. كان التوصيل في الموعد المحدد ووصل كل شيء في حالة ممتازة. أوصي به بشدة!",
      rating: 5,
    },
    {
      id: 2,
      name: lang === 'fr' ? 'Sofia T.' : 'صوفيا ت.',
      role: lang === 'fr' ? 'Cliente Régulière' : 'عميلة منتظمة',
      content: lang === 'fr'
        ? "J'adore la facilité de commande sur le site. Les prix sont très compétitifs et le service client est toujours à l'écoute."
        : "أحب سهولة الطلب على الموقع. الأسعار تنافسية للغاية وخدمة العملاء دائماً في الاستماع.",
      rating: 5,
    },
    {
      id: 3,
      name: lang === 'fr' ? 'Amine B.' : 'أمين ب.',
      role: lang === 'fr' ? 'Nouveau Client' : 'عميل جديد',
      content: lang === 'fr'
        ? "Une excellente expérience pour ma première commande. Les fruits et légumes sont bien emballés, on sent vraiment la qualité LabelVie."
        : "تجربة ممتازة لطلبيتي الأولى. الخضروات والفواكه مغلفة بشكل جيد، تشعر حقاً بجودة الماركة.",
      rating: 4,
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-gray-600">
            {t.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div 
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gray-50 p-8 rounded-2xl"
            >
              <div className="flex gap-1 mb-6 text-brand-orange">
                {[...Array(5)].map((_, idx) => (
                  <Star 
                    key={idx} 
                    className={`h-5 w-5 ${idx < testimonial.rating ? 'fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
