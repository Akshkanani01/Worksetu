"use client";

import { useState } from 'react';
import { Diamond, Layers3, ArrowRight, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase.client';
import { useRouter } from 'next/navigation';

interface Props {
  userId: string;
  onComplete: () => void;
}

export default function OnboardingWizard({ userId, onComplete }: Props) {
  const router = useRouter();
  const supabase = createClient();
  
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState<'diamond' | 'textile' | ''>('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Translations
  const t = {
    en: { 
      title: 'Set up your Workshop', desc: 'Tell us a bit about your business to get started.', 
      step1: 'Business Name', step2: 'Industry Type', step3: 'Contact Info',
      name_ph: 'e.g. Rajesh Diamond Works', industry_desc: 'Which industry do you work in?',
      diamond: 'Diamond', textile: 'Textile', address_ph: 'Your workshop address',
      phone_ph: 'Contact phone number', next: 'Next', back: 'Back', complete: 'Complete Setup'
    },
    gu: { 
      title: 'તમારી વર્કશોપ સેટ કરો', desc: 'શરૂઆત કરવા માટે તમારા બિઝનેસ વિશે જણાવો.',
      step1: 'બિઝનેસ નામ', step2: 'ઉદ્યોગ પ્રકાર', step3: 'સંપર્ક માહિતી',
      name_ph: 'દા.ત. રાજેશ ડાયમંડ વર્ક્સ', industry_desc: 'તમે કયા ઉદ્યોગમાં કામ કરો છો?',
      diamond: 'ડાયમંડ', textile: 'ટેક્સટાઈલ', address_ph: 'તમારું વર્કશોપ સરનામું',
      phone_ph: 'સંપર્ક ફોન નંબર', next: 'આગળ', back: 'પાછળ', complete: 'સેટઅપ પૂર્ણ કરો'
    },
    hi: { 
      title: 'अपनी वर्कशॉप सेट करें', desc: 'शुरू करने के लिए अपने व्यवसाय के बारे में बताएं।',
      step1: 'व्यवसाय का नाम', step2: 'उद्योग प्रकार', step3: 'संपर्क जानकारी',
      name_ph: 'उदा. राजेश डायमंड वर्क्स', industry_desc: 'आप किस उद्योग में काम करते हैं?',
      diamond: 'हीरा', textile: 'कपड़ा', address_ph: 'आपकी वर्कशॉप का पता',
      phone_ph: 'संपर्क फोन नंबर', next: 'अगला', back: 'पीछे', complete: 'सेटअप पूरा करें'
    }
  };

  const [lang, setLang] = useState<'en' | 'gu' | 'hi'>('en');
  const T = t[lang];

  const handleNext = () => {
    if (step === 1 && !businessName.trim()) return;
    if (step === 2 && !industry) return;
    if (step === 3) {
      handleSubmit();
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('owners')
      .upsert({
        id: userId,
        business_name: businessName,
        industry: industry,
        address: address,
        contact_phone: phone,
        onboarding_completed: true
      });
    setLoading(false);
    if (error) {
      alert('Error saving details: ' + error.message);
    } else {
      onComplete(); // ડેશબોર્ડ બતાવો
      router.refresh();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
      <div className="glass-panel-deep rounded-3xl p-8 md:p-12 max-w-2xl w-full border border-white/10 shadow-2xl relative">
        
        {/* Language Switcher (Small) */}
        <div className="absolute top-4 right-4 flex gap-2 text-xs">
          {['en', 'gu', 'hi'].map(l => (
            <button key={l} onClick={() => setLang(l as any)} className={`px-2 py-1 rounded ${lang === l ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex items-center gap-2 ${step >= s ? 'text-purple-400' : 'text-slate-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= s ? 'border-purple-500 bg-purple-500/20' : 'border-slate-600'}`}>
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-purple-500' : 'bg-slate-600'}`}></div>}
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-center mb-2">{T.title}</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">{T.desc}</p>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-4 animate-slide-up">
            <label className="block text-sm font-medium text-slate-300">{T.step1}</label>
            <input 
              type="text" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={T.name_ph}
              className="w-full bg-[#0A1025] border border-white/10 rounded-xl px-4 py-4 text-lg text-white outline-none focus:border-purple-500 transition placeholder:text-slate-600"
            />
          </div>
        )}

        {/* Step 2: Industry */}
        {step === 2 && (
          <div className="space-y-4 animate-slide-up">
            <label className="block text-sm font-medium text-slate-300 text-center">{T.industry_desc}</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIndustry('diamond')}
                className={`p-8 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${industry === 'diamond' ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-900/30' : 'border-white/10 hover:border-white/30'}`}
              >
                <Diamond className={`w-12 h-12 ${industry === 'diamond' ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="font-bold text-lg">{T.diamond}</span>
              </button>
              <button 
                onClick={() => setIndustry('textile')}
                className={`p-8 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${industry === 'textile' ? 'border-purple-400 bg-purple-500/10 shadow-lg shadow-purple-900/30' : 'border-white/10 hover:border-white/30'}`}
              >
                <Layers3 className={`w-12 h-12 ${industry === 'textile' ? 'text-purple-400' : 'text-slate-500'}`} />
                <span className="font-bold text-lg">{T.textile}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 3 && (
          <div className="space-y-4 animate-slide-up">
            <label className="block text-sm font-medium text-slate-300">{T.step3}</label>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={T.address_ph}
              className="w-full bg-[#0A1025] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500 transition placeholder:text-slate-600 mb-3"
            />
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={T.phone_ph}
              className="w-full bg-[#0A1025] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500 transition placeholder:text-slate-600"
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10 gap-4">
          <button 
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="px-6 py-3 rounded-xl border border-white/10 text-white transition hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {T.back}
          </button>
          <button 
            onClick={handleNext}
            disabled={loading || (step === 1 && !businessName.trim()) || (step === 2 && !industry)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-6 py-3 rounded-xl text-white font-bold shadow-lg shadow-purple-900/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Saving...' : step === 3 ? T.complete : T.next}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
}