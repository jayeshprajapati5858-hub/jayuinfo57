
import React from 'react';
import { Truck, ShieldCheck, Headset, Star } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface FeaturesSectionProps {
  language: Language;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  const features = [
    {
      icon: <Star size={24} className="text-yellow-500" />,
      title: t.f_quality,
      desc: t.f_quality_desc,
      bg: "bg-yellow-50 dark:bg-yellow-900/10",
      border: "border-yellow-100 dark:border-yellow-900/20"
    },
    {
      icon: <Truck size={24} className="text-blue-500" />,
      title: t.f_shipping,
      desc: t.f_shipping_desc,
      bg: "bg-blue-50 dark:bg-blue-900/10",
      border: "border-blue-100 dark:border-blue-900/20"
    },
    {
      icon: <ShieldCheck size={24} className="text-green-500" />,
      title: t.f_payment,
      desc: t.f_payment_desc,
      bg: "bg-green-50 dark:bg-green-900/10",
      border: "border-green-100 dark:border-green-900/20"
    },
    {
      icon: <Headset size={24} className="text-purple-500" />,
      title: t.f_support,
      desc: t.f_support_desc,
      bg: "bg-purple-50 dark:bg-purple-900/10",
      border: "border-purple-100 dark:border-purple-900/20"
    }
  ];

  return (
    <div className="mb-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${feature.border} ${feature.bg} flex flex-col items-center text-center hover:scale-105 transition-transform cursor-default`}>
            <div className="mb-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
              {feature.icon}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{feature.title}</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
