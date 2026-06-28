"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Play, CheckCircle, Clock, BarChart, MessageSquare, 
  FileText, Bell, PieChart, Briefcase, Users, CheckCircle2, Mail, 
  Settings, Shield, Zap, Star, Phone, Menu, X, Globe, Map, 
  Calendar, Image as ImageIcon, FileJson, Layout, Layers, 
  GitBranch, Activity, Database, Smartphone, Tablet, 
  ArrowDownCircle, Award, TrendingUp, MessageCircle, 
  Video, Mic, HelpCircle, BookOpen, Truck, Package,
  Diamond, Sparkles, Droplets, MoveUp, MoveDown, Layers3
} from 'lucide-react';

export default function UltimatePremiumLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'gu' | 'hi'>('en');
  const [activeIndustry, setActiveIndustry] = useState<'diamond' | 'textile'>('diamond');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // =======================================================================
  // TRANSLATION DATA (GUJARATI, HINDI, ENGLISH) - Updated Text for CTA
  // =======================================================================
  const content: Record<string, any> = {
    en: {
      brand: "WORKSETU",
      tagline: "WORK SMART, MANAGE EASY",
      hero_title1: "Your Workshop.",
      hero_title2: "Your Command Center.",
      hero_desc: "The ultimate digital ecosystem for Diamond & Textile industries. Connect Owners and Karigars instantly, track live progress, and finish jobs with unmatched transparency.",
      btn_start: "Start Free Now",
      btn_demo: "Watch Demo",
      stat_1: "Real-time Tracking",
      stat_2: "Smart Comm.",
      stat_3: "On-Time Delivery",
      stats_label_1: "100% Live updates",
      stats_label_2: "Zero Miscommunication",
      stats_label_3: "99.9% Satisfaction",
      nav_home: "Home",
      nav_features: "Features",
      nav_workflow: "Workflow",
      nav_about: "About",
      nav_login: "Login",
      trusted_title: "Trusted by 10,000+ workshops across India",
      
      diamond_tab: "Diamond",
      textile_tab: "Textile",
      diamond_desc: "Precision-crafted tools for Carat, Clarity, Color, and Cut tracking.",
      textile_desc: "Comprehensive fabric management: Thread-count, Length, Color, and Designs.",
      
      owner_section_title: "For Owners",
      owner_desc: "Streamline operations and scale your business infinitely.",
      owner_title1: "Magic Email Login",
      owner_desc1: "One-click passwordless login via Magic Link sent to your inbox.",
      owner_title2: "Auto Task Assign",
      owner_desc2: "AI-powered suggestions to assign the right Karigar based on expertise.",
      owner_title3: "Live Analytics",
      owner_desc3: "Monitor the performance, deadlines, and efficiency of your entire workshop.",
      owner_title4: "Global Dashboard",
      owner_desc4: "A comprehensive control room to manage multiple branches effortlessly.",

      karigar_section_title: "For Karigars",
      karigar_desc: "Empower your workforce with simple tools and zero language barriers.",
      karigar_title1: "4-Digit Secure PIN",
      karigar_desc1: "Private, owner-generated 4-digit PIN. No passwords to memorize.",
      karigar_title2: "Media Uploads",
      karigar_desc2: "Capture photos, share designs, and send status videos instantly.",
      karigar_title3: "One-Tap Status",
      karigar_desc3: "Update work status from 'In-Progress' to 'Completed' with a single tap.",
      karigar_title4: "Direct Owner Chat",
      karigar_desc4: "One-on-one chat with the Owner. Clear doubts about design and time-lines immediately.",

      // Pricing Removed - Replaced with Strong CTA
      cta_title: "Ready to Transform Your Workshop?",
      cta_desc: "Join thousands of owners and karigars who are already managing their business seamlessly with WorkSetu. It's completely free, forever.",
      cta_btn_login: "Login to Dashboard",
      cta_btn_start: "Start Free Now",
      
      comparison_title: "Owner vs Karigar Capabilities",
      comparison_desc: "Clear boundaries. Complete transparency.",
      comp_1: "Permissions",
      comp_owner_1: "Full Control (Create, Assign, Manage)",
      comp_karigar_1: "Limited (Only Assigned Tasks)",
      comp_2: "Login Method",
      comp_owner_2: "Magic Link (Email)",
      comp_karigar_2: "4-Digit PIN",
      comp_3: "Security",
      comp_owner_3: "Can Reset Karigar PINs",
      comp_karigar_3: "Cannot Reset Own PIN",
      comp_4: "Communication",
      comp_owner_4: "Send Global & Direct Messages",
      comp_karigar_4: "Direct Message to Owner Only",

      testi_title: "What Our Users Say",
      testi_1_q: "WorkSetu transformed our diamond workshop. Tracking used to be chaos, now it's seamless!",
      testi_1_n: "Rajesh Patel",
      testi_1_r: "Workshop Owner",
      testi_2_q: "I love the 4-digit PIN. I don't need to remember passwords, and the owner gets instant updates.",
      testi_2_n: "Mohan Karigar",
      testi_2_r: "Master Diamond Polisher",
      testi_3_q: "Using the app in Gujarati is a blessing. Our textile factory adapted it in just 2 days.",
      testi_3_n: "Sneha Desai",
      testi_3_r: "Textile Unit Manager",
      
      blog_title: "Latest Updates",
      blog_1_t: "Introducing AI Auto-Assign",
      blog_1_d: "Our new algorithm helps owners auto-suggest karigars.",
      blog_2_t: "Gujarati Language Support",
      blog_2_d: "We are thrilled to announce full Gujarati UI support.",
      blog_3_t: "2026 Industry Trends",
      blog_3_d: "How digital tools are reshaping the diamond & textile markets.",

      faq_1_q: "Is WorkSetu truly 100% free forever?",
      faq_1_a: "Yes! Owners and Karigars can use the platform completely free forever without hidden costs.",
      faq_2_q: "What if a Karigar forgets their PIN?",
      faq_2_a: "Only the Owner can reset a Karigar's PIN instantly from the dashboard.",
      faq_3_q: "How does the Magic Link login work?",
      faq_3_a: "Owners enter their email. We send a secure one-time-use link. Clicking it logs them in automatically.",
      faq_4_q: "Can I customize the fields for Diamond vs Textile?",
      faq_4_a: "Absolutely. When creating a task, select 'Diamond' to see Carat/Clarity fields, or 'Textile' for Thread-count/Meters.",
      faq_5_q: "Is my design data secure?",
      faq_5_a: "Yes. We use enterprise-grade AES-256 encryption for all data, files, and communications.",
      footer_links: "Quick Links",
      footer_support: "Support",
      footer_sub: "Subscribe",
      footer_tag: "The smart ecosystem connecting Owners and Karigars.",
    },
    gu: {
      brand: "WORKSETU",
      tagline: "સ્માર્ટ વર્ક, સરળ મેનેજમેન્ટ",
      hero_title1: "તમારી વર્કશોપ.",
      hero_title2: "તમારું કમાન્ડ સેન્ટર.",
      hero_desc: "ડાયમંડ અને ટેક્સટાઈલ ઉદ્યોગો માટે અલ્ટીમેટ ડિજિટલ ઇકોસિસ્ટમ. ઓનર અને કારીગરને ત્વરિત જોડો, લાઈવ પ્રોગ્રેસ ટ્રેક કરો અને અજોડ પારદર્શિતા સાથે કામ પૂર્ણ કરો.",
      btn_start: "હમણાં શરૂ કરો",
      btn_demo: "ડેમો જુઓ",
      stat_1: "રીઅલ-ટાઈમ ટ્રેકિંગ",
      stat_2: "સ્માર્ટ કમ્યુનિકેશન",
      stat_3: "સમયસર ડિલિવરી",
      stats_label_1: "૧૦૦% લાઈવ અપડેટ્સ",
      stats_label_2: "શૂન્ય ગેરસમજ",
      stats_label_3: "૯૯.૯% સંતોષ",
      nav_home: "હોમ",
      nav_features: "ફીચર્સ",
      nav_workflow: "કાર્યપ્રવાહ",
      nav_about: "અમારા વિશે",
      nav_login: "લૉગિન",
      trusted_title: "ભારતભરનાં ૧૦,૦૦૦+ વર્કશોપ્સ દ્વારા વિશ્વાસપાત્ર",

      diamond_tab: "ડાયમંડ",
      textile_tab: "ટેક્સટાઈલ",
      diamond_desc: "કેરેટ, ક્લેરિટી, કલર અને કટ ટ્રેકિંગ માટે ચોકસાઈથી બનાવેલ સાધનો.",
      textile_desc: "વ્યાપક ફેબ્રિક મેનેજમેન્ટ: થ્રેડ-કાઉન્ટ, લંબાઈ, રંગ અને ડિઝાઈન.",

      owner_section_title: "ઓનર્સ માટે",
      owner_desc: "કામગીરીને સરળ બનાવો અને તમારા બિઝનેસને અમર્યાદિત રીતે વધારો.",
      owner_title1: "મેજિક ઈમેલ લૉગિન",
      owner_desc1: "તમારા ઈનબોક્સમાં મોકલેલ મેજિક લિંક દ્વારા પાસવર્ડ વગર લૉગિન કરો.",
      owner_title2: "ઓટો ટાસ્ક અસાઈન",
      owner_desc2: "કુશળતા આધારે યોગ્ય કારીગરને કામ સોંપવા માટે AI સૂચનો.",
      owner_title3: "લાઈવ એનાલિટિક્સ",
      owner_desc3: "તમારી સમગ્ર વર્કશોપનું પ્રદર્શન, ડેડલાઈન્સ અને કાર્યક્ષમતા મોનિટર કરો.",
      owner_title4: "ગ્લોબલ ડેશબોર્ડ",
      owner_desc4: "બહુવિધ શાખાઓને સરળતાથી મેનેજ કરવા માટે વ્યાપક કંટ્રોલ રૂમ.",

      karigar_section_title: "કારીગરો માટે",
      karigar_desc: "તમારા કર્મચારીઓને સરળ સાધનો અને શૂન્ય ભાષા અવરોધ સાથે સશક્ત બનાવો.",
      karigar_title1: "૪-અંકનો સુરક્ષિત PIN",
      karigar_desc1: "ખાનગી, ઓનર દ્વારા જનરેટ કરેલ ૪-અંકનો PIN. યાદ રાખવા માટે પાસવર્ડ નહીં.",
      karigar_title2: "મીડિયા અપલોડ્સ",
      karigar_desc2: "ફોટા કેપ્ચર કરો, ડિઝાઈન શેર કરો અને સ્ટેટસ વીડિયો ત્વરિત મોકલો.",
      karigar_title3: "વન-ટેપ સ્ટેટસ",
      karigar_desc3: "એક જ ટેપથી કામનો સ્ટેટસ 'ચાલુ' થી 'પૂર્ણ' કરો.",
      karigar_title4: "ડાયરેક્ટ ઓનર ચેટ",
      karigar_desc4: "ઓનર સાથે વન-ટુ-વન ચેટ. ડિઝાઈન અને સમય-રેખા વિશે ત્વરિત શંકાઓ દૂર કરો.",

      cta_title: "તમારી વર્કશોપને ટ્રાન્સફોર્મ કરવા તૈયાર છો?",
      cta_desc: "હજારો ઓનર્સ અને કારીગરો જેઓ તેમના બિઝનેસને WorkSetu થી સરળતાથી મેનેજ કરે છે તેમની સાથે જોડાઓ. તે સંપૂર્ણપણે ફ્રી છે, કાયમ માટે.",
      cta_btn_login: "ડેશબોર્ડ પર લૉગિન કરો",
      cta_btn_start: "હમણાં શરૂ કરો",
      
      comparison_title: "ઓનર વિ. કારીગર ક્ષમતાઓ",
      comparison_desc: "સ્પષ્ટ સીમાઓ. સંપૂર્ણ પારદર્શિતા.",
      comp_1: "પરવાનગીઓ",
      comp_owner_1: "સંપૂર્ણ નિયંત્રણ (બનાવો, અસાઈન કરો, મેનેજ કરો)",
      comp_karigar_1: "મર્યાદિત (ફક્ત અસાઈન કરેલ કામો)",
      comp_2: "લૉગિન પદ્ધતિ",
      comp_owner_2: "મેજિક લિંક (ઈમેલ)",
      comp_karigar_2: "૪-અંકનો PIN",
      comp_3: "સુરક્ષા",
      comp_owner_3: "કારીગરનો PIN રીસેટ કરી શકે છે",
      comp_karigar_3: "પોતાનો PIN રીસેટ કરી શકતો નથી",
      comp_4: "સંચાર",
      comp_owner_4: "ગ્લોબલ અને ડાયરેક્ટ મેસેજ મોકલો",
      comp_karigar_4: "ફક્ત ઓનરને ડાયરેક્ટ મેસેજ",

      testi_title: "અમારા વપરાશકર્તાઓ શું કહે છે",
      testi_1_q: "WorkSetu એ અમારા ડાયમંડ વર્કશોપને બદલી નાખ્યું. ટ્રેકિંગ અગાઉ અવ્યવસ્થિત હતું, હવે સરળ છે!",
      testi_1_n: "રાજેશ પટેલ",
      testi_1_r: "વર્કશોપ ઓનર",
      testi_2_q: "મને ૪-અંકનો PIN ગમે છે. પાસવર્ડ યાદ રાખવાની જરૂર નથી.",
      testi_2_n: "મોહન કારીગર",
      testi_2_r: "માસ્ટર ડાયમંડ પોલિશર",
      testi_3_q: "ગુજરાતીમાં એપનો ઉપયોગ ખૂબ સરળ છે. અમારા ફેક્ટરીએ તે ૨ દિવસમાં અપનાવી લીધું.",
      testi_3_n: "સ્નેહા દેસાઈ",
      testi_3_r: "ટેક્સટાઈલ યુનિટ મેનેજર",
      
      blog_title: "નવીનતમ અપડેટ્સ",
      blog_1_t: "AI ઓટો-અસાઈનનો પરિચય",
      blog_1_d: "અમારો નવો અલ્ગોરિધમ ઓનર્સને કારીગરો સૂચવવામાં મદદ કરે છે.",
      blog_2_t: "ગુજરાતી ભાષા સપોર્ટ",
      blog_2_d: "અમે સંપૂર્ણ ગુજરાતી UI સપોર્ટ જાહેર કરીને રોમાંચિત છીએ.",
      blog_3_t: "૨૦૨૬ ઇન્ડસ્ટ્રી ટ્રેન્ડ્સ",
      blog_3_d: "ડિજિટલ સાધનો ડાયમંડ અને ટેક્સટાઈલ બજારોને કેવી રીતે ફરીથી આકાર આપી રહ્યા છે.",

      faq_1_q: "શું WorkSetu ખરેખર ૧૦૦% કાયમી ફ્રી છે?",
      faq_1_a: "હા! ઓનર્સ અને કારીગરો છુપા ખર્ચ વિના કાયમ માટે સંપૂર્ણ ફ્રી પ્લેટફોર્મનો ઉપયોગ કરી શકે છે.",
      faq_2_q: "જો કારીગર તેનો PIN ભૂલી જાય તો?",
      faq_2_a: "ફક્ત ઓનર જ પોતાના ડેશબોર્ડથી કારીગરનો PIN ત્વરિત રીસેટ કરી શકે છે.",
      faq_3_q: "મેજિક લિંક લૉગિન કેવી રીતે કામ કરે છે?",
      faq_3_a: "ઓનર તેમનો ઈમેલ દાખલ કરે છે. અમે સુરક્ષિત એક-વખતની લિંક મોકલીએ છીએ. તેના પર ક્લિક કરતાં તેઓ આપોઆપ લૉગિન થઈ જાય છે.",
      faq_4_q: "શું હું ડાયમંડ અને ટેક્સટાઈલ માટે ફીલ્ડ્સ કસ્ટમાઈઝ કરી શકું?",
      faq_4_a: "ચોક્કસ. કામ બનાવતી વખતે 'ડાયમંડ' પસંદ કરો તો કેરેટ/ક્લેરિટી ફીલ્ડ્સ મળે છે, અને 'ટેક્સટાઈલ' પસંદ કરો તો થ્રેડ-કાઉન્ટ/મીટર મળે છે.",
      faq_5_q: "શું મારો ડિઝાઈન ડેટા સુરક્ષિત છે?",
      faq_5_a: "હા. અમે તમામ ડેટા, ફાઇલો અને સંચાર માટે એન્ટરપ્રાઈઝ-ગ્રેડ AES-256 એન્ક્રિપ્શનનો ઉપયોગ કરીએ છીએ.",
      footer_links: "ઝડપી લિંક્સ",
      footer_support: "સપોર્ટ",
      footer_sub: "સબ્સ્ક્રાઇબ કરો",
      footer_tag: "ઓનર્સ અને કારીગરોને જોડતું સ્માર્ટ ઇકોસિસ્ટમ.",
    },
    hi: {
      brand: "WORKSETU",
      tagline: "स्मार्ट वर्क, आसान प्रबंधन",
      hero_title1: "आपकी वर्कशॉप.",
      hero_title2: "आपका कमांड सेंटर.",
      hero_desc: "हीरा और कपड़ा उद्योगों के लिए अल्टीमेट डिजिटल इकोसिस्टम। मालिकों और कारीगरों को तुरंत जोड़ें, लाइव प्रगति ट्रैक करें और अद्वितीय पारदर्शिता के साथ काम पूरा करें।",
      btn_start: "अभी शुरू करें",
      btn_demo: "डेमो देखें",
      stat_1: "रियल-टाइम ट्रैकिंग",
      stat_2: "स्मार्ट कम्युनिकेशन",
      stat_3: "समय पर डिलीवरी",
      stats_label_1: "100% लाइव अपडेट्स",
      stats_label_2: "शून्य गलतफहमी",
      stats_label_3: "99.9% संतुष्टि",
      nav_home: "होम",
      nav_features: "फीचर्स",
      nav_workflow: "वर्कफ़्लो",
      nav_about: "हमारे बारे में",
      nav_login: "लॉगिन",
      trusted_title: "भारत भर में 10,000+ वर्कशॉप्स द्वारा विश्वसनीय",

      diamond_tab: "हीरा",
      textile_tab: "कपड़ा",
      diamond_desc: "कैरेट, स्पष्टता, रंग और कट ट्रैकिंग के लिए सटीकता से निर्मित उपकरण।",
      textile_desc: "व्यापक कपड़ा प्रबंधन: थ्रेड-काउंट, लंबाई, रंग और डिज़ाइन।",

      owner_section_title: "मालिकों के लिए",
      owner_desc: "संचालन को सुव्यवस्थित करें और अपने व्यवसाय को असीमित रूप से बढ़ाएं।",
      owner_title1: "मैजिक ईमेल लॉगिन",
      owner_desc1: "आपके इनबॉक्स में भेजे गए मैजिक लिंक के माध्यम से पासवर्ड के बिना लॉगिन।",
      owner_title2: "ऑटो टास्क असाइन",
      owner_desc2: "विशेषज्ञता के आधार पर सही कारीगर को काम सौंपने के लिए AI सुझाव।",
      owner_title3: "लाइव एनालिटिक्स",
      owner_desc3: "आपकी पूरी वर्कशॉप के प्रदर्शन, समय-सीमा और दक्षता की निगरानी करें।",
      owner_title4: "ग्लोबल डैशबोर्ड",
      owner_desc4: "कई शाखाओं को आसानी से प्रबंधित करने के लिए एक व्यापक कंट्रोल रूम।",

      karigar_section_title: "कारीगरों के लिए",
      karigar_desc: "अपने कार्यबल को सरल उपकरणों और शून्य भाषा बाधाओं के साथ सशक्त बनाएं।",
      karigar_title1: "4-अंकीय सुरक्षित PIN",
      karigar_desc1: "निजी, मालिक द्वारा उत्पन्न 4-अंकीय PIN। याद रखने के लिए कोई पासवर्ड नहीं।",
      karigar_title2: "मीडिया अपलोड",
      karigar_desc2: "फ़ोटो कैप्चर करें, डिज़ाइन साझा करें और स्थिति वीडियो तुरंत भेजें।",
      karigar_title3: "वन-टैप स्थिति",
      karigar_desc3: "एक ही टैप से कार्य की स्थिति को 'प्रगति पर' से 'पूर्ण' में अपडेट करें।",
      karigar_title4: "डायरेक्ट मालिक चैट",
      karigar_desc4: "मालिक के साथ वन-टू-वन चैट। डिज़ाइन और समय-रेखा के बारे में संदेह तुरंत दूर करें।",

      cta_title: "अपनी वर्कशॉप को बदलने के लिए तैयार हैं?",
      cta_desc: "हजारों मालिकों और कारीगरों से जुड़ें जो पहले से ही WorkSetu के साथ अपने व्यवसाय को सहजता से प्रबंधित कर रहे हैं। यह पूरी तरह से मुफ्त है, हमेशा के लिए।",
      cta_btn_login: "डैशबोर्ड पर लॉगिन करें",
      cta_btn_start: "अभी शुरू करें",
      
      comparison_title: "मालिक बनाम कारीगर क्षमताएं",
      comparison_desc: "स्पष्ट सीमाएं। पूर्ण पारदर्शिता।",
      comp_1: "अनुमतियाँ",
      comp_owner_1: "पूर्ण नियंत्रण (बनाएं, असाइन करें, प्रबंधित करें)",
      comp_karigar_1: "सीमित (केवल असाइन किए गए कार्य)",
      comp_2: "लॉगिन विधि",
      comp_owner_2: "मैजिक लिंक (ईमेल)",
      comp_karigar_2: "4-अंकीय PIN",
      comp_3: "सुरक्षा",
      comp_owner_3: "कारीगर PIN रीसेट कर सकता है",
      comp_karigar_3: "अपना PIN रीसेट नहीं कर सकता",
      comp_4: "संचार",
      comp_owner_4: "वैश्विक और प्रत्यक्ष संदेश भेजें",
      comp_karigar_4: "केवल मालिक को प्रत्यक्ष संदेश",

      testi_title: "हमारे उपयोगकर्ता क्या कहते हैं",
      testi_1_q: "WorkSetu ने हमारी डायमंड वर्कशॉप को बदल दिया। ट्रैकिंग पहले अराजक थी, अब सहज है!",
      testi_1_n: "राजेश पटेल",
      testi_1_r: "वर्कशॉप मालिक",
      testi_2_q: "मुझे 4-अंकीय PIN पसंद है। मुझे पासवर्ड याद रखने की ज़रूरत नहीं है।",
      testi_2_n: "मोहन कारीगर",
      testi_2_r: "मास्टर डायमंड पॉलिशर",
      testi_3_q: "हिंदी में ऐप का उपयोग करना बहुत आसान है। हमारे फैक्ट्री ने इसे 2 दिनों में अपना लिया।",
      testi_3_n: "स्नेहा देसाई",
      testi_3_r: "कपड़ा यूनिट मैनेजर",
      
      blog_title: "नवीनतम अपडेट",
      blog_1_t: "AI ऑटो-असाइन का परिचय",
      blog_1_d: "हमारा नया एल्गोरिदम मालिकों को कारीगरों का सुझाव देने में मदद करता है।",
      blog_2_t: "हिंदी भाषा समर्थन",
      blog_2_d: "हम पूर्ण हिंदी UI समर्थन की घोषणा करके रोमांचित हैं।",
      blog_3_t: "2026 उद्योग रुझान",
      blog_3_d: "डिजिटल उपकरण हीरा और कपड़ा बाजारों को कैसे नया आकार दे रहे हैं।",

      faq_1_q: "क्या WorkSetu वास्तव में 100% हमेशा के लिए मुफ्त है?",
      faq_1_a: "हाँ! मालिक और कारीगर बिना किसी छिपे खर्च के हमेशा के लिए पूरी तरह से मुफ्त प्लेटफॉर्म का उपयोग कर सकते हैं।",
      faq_2_q: "अगर कारीगर अपना PIN भूल जाए तो?",
      faq_2_a: "केवल मालिक ही अपने डैशबोर्ड से कारीगर का PIN तुरंत रीसेट कर सकता है।",
      faq_3_q: "मैजिक लिंक लॉगिन कैसे काम करता है?",
      faq_3_a: "मालिक अपना ईमेल दर्ज करता है। हम एक सुरक्षित एक-बार उपयोग वाला लिंक भेजते हैं। उस पर क्लिक करने से वे स्वचालित रूप से लॉगिन हो जाते हैं।",
      faq_4_q: "क्या मैं हीरा और कपड़ा के लिए फ़ील्ड्स कस्टमाइज़ कर सकता हूँ?",
      faq_4_a: "बिल्कुल। कार्य बनाते समय 'हीरा' चुनें तो कैरेट/स्पष्टता फ़ील्ड्स मिलते हैं, और 'कपड़ा' चुनें तो थ्रेड-काउंट/मीटर मिलते हैं।",
      faq_5_q: "क्या मेरा डिज़ाइन डेटा सुरक्षित है?",
      faq_5_a: "हाँ। हम सभी डेटा, फ़ाइलों और संचार के लिए एंटरप्राइज़-ग्रेड AES-256 एन्क्रिप्शन का उपयोग करते हैं।",
      footer_links: "त्वरित लिंक्स",
      footer_support: "सहायता",
      footer_sub: "सदस्यता लें",
      footer_tag: "मालिकों और कारीगरों को जोड़ने वाला स्मार्ट इकोसिस्टम।",
    }
  };

  const t = content[lang];

  // =======================================================================
  // INLINE CSS FOR HIGH-END VISUALS
  // =======================================================================
  const cssStyles = `
    @keyframes floatShape { 0% { transform: translateY(0px) scale(1) rotate(0deg); } 50% { transform: translateY(-30px) scale(1.03) rotate(1deg); } 100% { transform: translateY(0px) scale(1) rotate(0deg); } }
    @keyframes shine { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes pulseGlow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.15); } }
    @keyframes slideIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
    
    .animate-float { animation: floatShape 7s ease-in-out infinite; }
    .animate-float-slow { animation: floatShape 12s ease-in-out infinite; }
    .animate-pulse-glow { animation: pulseGlow 4s ease-in-out infinite; }
    .animate-slide-in { animation: slideIn 0.6s ease-out forwards; }
    
    .glass-panel { background: rgba(255, 255, 255, 0.04); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .glass-panel-deep { background: rgba(10, 16, 35, 0.6); backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px); border: 1px solid rgba(255, 255, 255, 0.06); }
    .glass-panel-glow { border: 1px solid rgba(168, 85, 247, 0.4); box-shadow: 0 0 40px rgba(168, 85, 247, 0.1); }
    
    .bg-dot-grid { background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 20px 20px; }
    .text-gradient-primary { background: linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    
    .marquee-track { display: flex; animation: ticker 25s linear infinite; width: max-content; }
    .marquee-container { mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
    
    .tab-transition { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
    
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  return (
    <div className="min-h-screen bg-[#04080F] text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

      {/* BACKGROUND AMBIENT GLOW & DOTS */}
      <div className="fixed inset-0 pointer-events-none bg-dot-grid opacity-80 z-0"></div>
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/15 via-transparent to-cyan-900/15 pointer-events-none z-0"></div>
      <div className="fixed top-1/3 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] animate-pulse-glow pointer-events-none z-0"></div>
      <div className="fixed bottom-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px] animate-pulse-glow pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

      {/* =======================================================================
          NAVBAR
         ======================================================================= */}
      <nav className="fixed top-4 left-0 right-0 mx-6 z-50 glass-panel-deep rounded-2xl px-6 h-16 flex items-center justify-between shadow-2xl shadow-black/60 border-white/10 max-w-7xl lg:mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center font-black text-[#04080F] text-lg shadow-lg shadow-purple-500/30">W</div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">{t.brand}</span>
        </div>

        <div className="hidden lg:flex gap-8 text-sm font-medium text-slate-300">
          <a href="#home" className="hover:text-white transition relative group"><span className="relative z-10">{t.nav_home}</span><span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-purple-400 group-hover:w-full transition-all duration-300"></span></a>
          <a href="#features" className="hover:text-white transition relative group"><span className="relative z-10">{t.nav_features}</span><span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-purple-400 group-hover:w-full transition-all duration-300"></span></a>
          <a href="#workflow" className="hover:text-white transition relative group"><span className="relative z-10">{t.nav_workflow}</span><span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-purple-400 group-hover:w-full transition-all duration-300"></span></a>
          <a href="#about" className="hover:text-white transition relative group"><span className="relative z-10">{t.nav_about}</span><span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-purple-400 group-hover:w-full transition-all duration-300"></span></a>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="relative group px-2 py-1 rounded-full hover:bg-white/5 transition cursor-pointer">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'EN' : lang === 'gu' ? 'ગુજ' : 'हिं'}</span>
            </div>
            <div className="absolute right-0 top-full mt-2 w-28 glass-panel-deep rounded-xl p-1.5 hidden group-hover:block opacity-0 group-hover:opacity-100 transition duration-300 shadow-xl border-white/5">
              <button onClick={() => setLang('en')} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition">English</button>
              <button onClick={() => setLang('gu')} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition">ગુજરાતી</button>
              <button onClick={() => setLang('hi')} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition">हिन्दी</button>
            </div>
          </div>
          <Link href="/login" className="text-sm text-slate-300 hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-white/5 transition">{t.nav_login}</Link>
          <Link href="/login" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-purple-900/40 transition-all hover:scale-105 flex items-center gap-2">
            {t.btn_start} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-slate-300 hover:text-white transition">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#04080F]/95 backdrop-blur-lg pt-24 px-6 lg:hidden flex flex-col gap-6 text-center">
          <a href="#home" className="text-lg font-medium py-3 border-b border-white/5 hover:text-purple-400 transition">{t.nav_home}</a>
          <a href="#features" className="text-lg font-medium py-3 border-b border-white/5 hover:text-purple-400 transition">{t.nav_features}</a>
          <a href="#workflow" className="text-lg font-medium py-3 border-b border-white/5 hover:text-purple-400 transition">{t.nav_workflow}</a>
          <a href="#about" className="text-lg font-medium py-3 border-b border-white/5 hover:text-purple-400 transition">{t.nav_about}</a>
          <div className="flex flex-col gap-4 mt-6">
            <Link href="/login" className="w-full border border-white/20 rounded-xl py-3 text-sm font-medium text-slate-300">{t.nav_login}</Link>
            <Link href="/login" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl py-3 text-sm font-bold shadow-lg shadow-purple-900/30">{t.btn_start}</Link>
          </div>
        </div>
      )}

      {/* =======================================================================
          HERO SECTION (ID: HOME)
         ======================================================================= */}
      <section id="home" className="relative pt-40 pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-purple-500/20 px-4 py-1.5 rounded-full text-xs font-medium text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              {t.tagline}
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
              {t.hero_title1} <br />
              <span className="text-gradient-primary relative inline-block">
                {t.hero_title2}
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full blur-sm"></div>
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-light">
              {t.hero_desc}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/login" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold shadow-2xl shadow-purple-900/50 transition-all hover:scale-105 hover:shadow-purple-700/70 flex items-center gap-3 relative overflow-hidden group">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full duration-700 transition-transform"></span>
                {t.btn_start} <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="flex items-center gap-3 glass-panel hover:bg-white/10 text-white px-8 py-4 rounded-xl font-medium transition-all border-white/10 shadow-lg">
                <Play className="w-4 h-4 fill-current" /> {t.btn_demo}
              </button>
            </div>
          </div>

          {/* Interactive Dashboard Mockup */}
          <div className="relative lg:block glass-panel-deep rounded-2xl p-5 animate-float w-full border border-purple-500/20 shadow-2xl shadow-purple-900/30 overflow-hidden h-[650px] flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-4 px-2 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-purple-500 to-cyan-500 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest text-white shadow-lg">COMMAND CENTER</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex gap-1 text-[10px] text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white border-2 border-white/20 shadow-lg">OP</div>
              </div>
            </div>

            <div className="flex flex-1 gap-5 overflow-hidden">
              <div className="w-20 flex flex-col gap-4 bg-white/5 rounded-xl p-3 py-6 border border-white/5">
                 <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/50"><Layout className="w-6 h-6" /></div>
                 <div className="w-full aspect-square rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 transition cursor-pointer"><Users className="w-5 h-5" /></div>
                 <div className="w-full aspect-square rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 transition cursor-pointer"><Calendar className="w-5 h-5" /></div>
                 <div className="w-full aspect-square rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 transition cursor-pointer"><Settings className="w-5 h-5" /></div>
                 <div className="mt-auto w-full aspect-square rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 transition cursor-pointer"><MessageSquare className="w-5 h-5" /></div>
              </div>

              <div className="flex-1 flex flex-col gap-5 overflow-y-auto hide-scrollbar pr-2">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                       <div className="absolute right-0 top-0 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>
                       <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Briefcase className="w-3 h-3" /> Total Jobs</div>
                       <div className="text-3xl font-bold mt-1 text-white">128</div>
                       <div className="text-[9px] text-green-400 mt-1">↑ 12% this week</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                       <div className="absolute right-0 top-0 w-16 h-16 bg-orange-500/10 rounded-full blur-xl"></div>
                       <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> In Progress</div>
                       <div className="text-3xl font-bold mt-1 text-orange-400">74</div>
                       <div className="text-[9px] text-slate-500 mt-1">Due today</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                       <div className="absolute right-0 top-0 w-16 h-16 bg-green-500/10 rounded-full blur-xl"></div>
                       <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</div>
                       <div className="text-3xl font-bold mt-1 text-green-400">54</div>
                       <div className="text-[9px] text-slate-500 mt-1">This month</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                       <div className="absolute right-0 top-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
                       <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Users className="w-3 h-3" /> Karigars</div>
                       <div className="text-3xl font-bold mt-1 text-cyan-400">32</div>
                       <div className="text-[9px] text-slate-500 mt-1">Active</div>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex-1">
                       <div className="flex justify-between items-center mb-3">
                          <div className="text-[10px] text-slate-400 font-medium">Recent Tasks</div>
                          <div className="text-[9px] text-purple-400 hover:text-purple-300 cursor-pointer">View All</div>
                       </div>
                       <div className="space-y-3">
                          {[
                             { name: 'Gold Pendant Set', id: '#A-104', status: 'In Progress', color: 'orange' },
                             { name: 'Diamond Ring', id: '#B-202', status: 'Completed', color: 'green' },
                             { name: 'Silver Necklace', id: '#C-309', status: 'In Progress', color: 'orange' },
                             { name: 'Custom Bracelet', id: '#D-115', status: 'Pending', color: 'yellow' },
                          ].map((job, i) => (
                             <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-3">
                                   <div className={`w-2 h-2 rounded-full bg-${job.color}-400`}></div>
                                   <div>
                                      <div className="text-[12px] text-slate-200 font-medium truncate max-w-[100px]">{job.name}</div>
                                      <div className="text-[8px] text-slate-500">{job.id}</div>
                                   </div>
                                </div>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full bg-${job.color}-500/20 text-${job.color}-300 border border-${job.color}-500/20`}>{job.status}</span>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 w-full md:w-1/3 flex flex-col items-center justify-center relative">
                       <div className="text-[10px] text-slate-400 font-medium mb-3 self-start flex items-center gap-1"><PieChart className="w-3 h-3" /> Progress</div>
                       <div className="relative w-24 h-24 rounded-full border-[8px] border-purple-500 border-r-transparent border-b-transparent rotate-[-45deg] flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                          <div className="absolute inset-0 rotate-[45deg] flex items-center justify-center text-base font-black text-white tracking-tight">72<span className="text-[8px] text-slate-400">%</span></div>
                       </div>
                       <div className="flex gap-3 mt-4 self-start w-full justify-between px-2">
                          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span><span className="text-[9px] text-slate-400">Complete</span></div>
                          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-600"></span><span className="text-[9px] text-slate-400">Pending</span></div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================================
          INDUSTRY INTERACTIVE TABS (ID: INDUSTRY)
         ======================================================================= */}
      <section id="industry" className="px-6 py-20 relative z-10 -mt-6">
        <div className="max-w-6xl mx-auto glass-panel-deep rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/60">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-white/5 pb-6">
              <div className="text-center md:text-left">
                 <h3 className="text-2xl font-bold">
                    {lang === 'en' ? 'Tailored for your Industry' : lang === 'gu' ? 'તમારા ઉદ્યોગ માટે તૈયાર' : 'आपके उद्योग के लिए तैयार'}
                 </h3>
                 <p className="text-sm text-slate-400 mt-1">{lang === 'en' ? 'Switch between Diamond and Textile modes.' : lang === 'gu' ? 'ડાયમંડ અને ટેક્સટાઈલ મોડ વચ્ચે સ્વિચ કરો.' : 'हीरा और कपड़ा मोड के बीच स्विच करें।'}</p>
              </div>
              <div className="flex bg-[#0A1025] p-1 rounded-full border border-white/10 shadow-inner">
                 <button 
                   onClick={() => setActiveIndustry('diamond')}
                   className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeIndustry === 'diamond' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/40' : 'text-slate-400 hover:text-white'}`}
                 >
                    <Diamond className="w-4 h-4" /> {t.diamond_tab}
                 </button>
                 <button 
                   onClick={() => setActiveIndustry('textile')}
                   className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeIndustry === 'textile' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/40' : 'text-slate-400 hover:text-white'}`}
                 >
                    <Layers3 className="w-4 h-4" /> {t.textile_tab}
                 </button>
              </div>
           </div>

           <div className="flex flex-col md:flex-row items-center gap-8 p-4 animate-slide-in">
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-3 text-2xl font-bold text-white">
                    {activeIndustry === 'diamond' ? <Diamond className="w-8 h-8 text-cyan-400" /> : <Layers3 className="w-8 h-8 text-purple-400" />}
                    {activeIndustry === 'diamond' ? t.diamond_tab : t.textile_tab}
                 </div>
                 <p className="text-slate-300 text-lg leading-relaxed">
                    {activeIndustry === 'diamond' ? t.diamond_desc : t.textile_desc}
                 </p>
                 <div className="pt-4 grid grid-cols-2 gap-3">
                    {activeIndustry === 'diamond' ? (
                       <>
                         <div className="flex items-center gap-2 text-xs text-slate-400 border border-white/5 rounded-xl p-3"><Sparkles className="w-4 h-4 text-yellow-400" /> {lang === 'en' ? 'Carat Tracking' : lang === 'gu' ? 'કેરેટ ટ્રેકિંગ' : 'कैरेट ट्रैकिंग'}</div>
                         <div className="flex items-center gap-2 text-xs text-slate-400 border border-white/5 rounded-xl p-3"><Droplets className="w-4 h-4 text-blue-400" /> {lang === 'en' ? 'Clarity & Color' : lang === 'gu' ? 'ક્લેરિટી અને કલર' : 'स्पष्टता और रंग'}</div>
                         <div className="flex items-center gap-2 text-xs text-slate-400 border border-white/5 rounded-xl p-3"><MoveDown className="w-4 h-4 text-green-400" /> {lang === 'en' ? 'Cut Grade' : lang === 'gu' ? 'કટ ગ્રેડ' : 'कट ग्रेड'}</div>
                         <div className="flex items-center gap-2 text-xs text-slate-400 border border-white/5 rounded-xl p-3"><BarChart className="w-4 h-4 text-purple-400" /> {lang === 'en' ? 'Weight Analysis' : lang === 'gu' ? 'વજન વિશ્લેષણ' : 'वजन विश्लेषण'}</div>
                       </>
                    ) : (
                       <>
                         <div className="flex items-center gap-2 text-xs text-slate-400 border border-white/5 rounded-xl p-3"><FileText className="w-4 h-4 text-orange-400" /> {lang === 'en' ? 'Thread Count' : lang === 'gu' ? 'થ્રેડ-કાઉન્ટ' : 'थ्रेड-काउंट'}</div>
                         <div className="flex items-center gap-2 text-xs text-slate-400 border border-white/5 rounded-xl p-3"><MoveUp className="w-4 h-4 text-blue-400" /> {lang === 'en' ? 'Fabric Length' : lang === 'gu' ? 'ફેબ્રિક લંબાઈ' : 'कपड़ा लंबाई'}</div>
                         <div className="flex items-center gap-2 text-xs text-slate-400 border border-white/5 rounded-xl p-3"><Palette className="w-4 h-4 text-pink-400" /> {lang === 'en' ? 'Dye & Pattern' : lang === 'gu' ? 'રંગ અને પેટર્ન' : 'रंग और पैटर्न'}</div>
                         <div className="flex items-center gap-2 text-xs text-slate-400 border border-white/5 rounded-xl p-3"><Package className="w-4 h-4 text-green-400" /> {lang === 'en' ? 'Roll Management' : lang === 'gu' ? 'રોલ મેનેજમેન્ટ' : 'रोल प्रबंधन'}</div>
                       </>
                    )}
                 </div>
              </div>
              <div className="flex-1">
                 <div className={`w-full aspect-[4/3] rounded-2xl bg-gradient-to-br ${activeIndustry === 'diamond' ? 'from-slate-800 to-purple-900' : 'from-slate-800 to-cyan-900'} border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605100804763-ebea64333f5d?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-20 blur-sm"></div>
                    <div className="relative z-10 text-center p-8">
                       {activeIndustry === 'diamond' ? (
                          <div className="space-y-2"><Diamond className="w-20 h-20 text-cyan-300 mx-auto drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]"/><h3 className="text-2xl font-bold">Precision Polishing</h3><p className="text-sm text-slate-300">Track every facet.</p></div>
                       ) : (
                          <div className="space-y-2"><Layers3 className="w-20 h-20 text-purple-300 mx-auto drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"/><h3 className="text-2xl font-bold">Textile Weaving</h3><p className="text-sm text-slate-300">Track every thread.</p></div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* =======================================================================
          TRUSTED BY SECTION
         ======================================================================= */}
      <section className="px-6 relative z-10 -mt-6">
        <div className="max-w-5xl mx-auto marquee-container overflow-hidden py-4">
           <div className="marquee-track flex items-center gap-12">
              <span className="text-xs md:text-sm font-medium text-slate-500 tracking-wider uppercase px-4">• {t.trusted_title} •</span>
              <div className="flex items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition duration-300">
                 <div className="flex items-center gap-1 text-lg font-black text-white">♦️ DIA</div>
                 <div className="flex items-center gap-1 text-lg font-black text-white">🧵 TEX</div>
                 <div className="flex items-center gap-1 text-lg font-black text-white">💎 JEWEL</div>
                 <div className="flex items-center gap-1 text-lg font-black text-white">🏭 MFG</div>
              </div>
              <span className="text-xs md:text-sm font-medium text-slate-500 tracking-wider uppercase px-4">• {t.trusted_title} •</span>
              <div className="flex items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition duration-300">
                 <div className="flex items-center gap-1 text-lg font-black text-white">♦️ DIA</div>
                 <div className="flex items-center gap-1 text-lg font-black text-white">🧵 TEX</div>
                 <div className="flex items-center gap-1 text-lg font-black text-white">💎 JEWEL</div>
                 <div className="flex items-center gap-1 text-lg font-black text-white">🏭 MFG</div>
              </div>
           </div>
        </div>
      </section>

      {/* =======================================================================
          PROCESS FLOW SECTION - OWNERS & KARIGARS (ID: WORKFLOW)
         ======================================================================= */}
      <section id="workflow" className="px-6 py-32 relative z-10">
        <div className="max-w-7xl mx-auto">
           <div className="grid lg:grid-cols-2 gap-16 mb-20">
             {/* Owner Process */}
             <div className="glass-panel-deep rounded-3xl p-8 border border-purple-500/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 rounded-full blur-[60px]"></div>
                <div className="flex items-center gap-2 mb-6 text-purple-400 font-bold text-sm"><Award className="w-5 h-5" /> {t.owner_section_title}</div>
                <p className="text-slate-400 text-sm mb-8 max-w-sm">{t.owner_desc}</p>
                <div className="space-y-8 relative border-l border-white/10 pl-6 ml-4">
                   {[
                     { icon: Briefcase, title: t.owner_title1, desc: t.owner_desc1 },
                     { icon: Users, title: t.owner_title2, desc: t.owner_desc2 },
                     { icon: PieChart, title: t.owner_title3, desc: t.owner_desc3 },
                     { icon: Layout, title: t.owner_title4, desc: t.owner_desc4 },
                   ].map((step, idx) => (
                     <div key={idx} className="relative group">
                        <div className="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-purple-600 to-cyan-400 border-2 border-[#04080F] shadow-lg shadow-purple-900/50"></div>
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0"><step.icon className="w-5 h-5" /></div>
                           <div>
                              <h4 className="font-semibold text-base text-white group-hover:text-purple-300 transition">{step.title}</h4>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Karigar Process */}
             <div className="glass-panel-deep rounded-3xl p-8 border border-cyan-500/20 relative overflow-hidden">
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-600/20 rounded-full blur-[60px]"></div>
                <div className="flex items-center gap-2 mb-6 text-cyan-400 font-bold text-sm"><Users className="w-5 h-5" /> {t.karigar_section_title}</div>
                <p className="text-slate-400 text-sm mb-8 max-w-sm">{t.karigar_desc}</p>
                <div className="space-y-8 relative border-l border-white/10 pl-6 ml-4">
                   {[
                     { icon: Smartphone, title: t.karigar_title1, desc: t.karigar_desc1 },
                     { icon: ImageIcon, title: t.karigar_title2, desc: t.karigar_desc2 },
                     { icon: CheckCircle2, title: t.karigar_title3, desc: t.karigar_desc3 },
                     { icon: MessageSquare, title: t.karigar_title4, desc: t.karigar_desc4 },
                   ].map((step, idx) => (
                     <div key={idx} className="relative group">
                        <div className="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 border-2 border-[#04080F] shadow-lg shadow-cyan-900/50"></div>
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0"><step.icon className="w-5 h-5" /></div>
                           <div>
                              <h4 className="font-semibold text-base text-white group-hover:text-cyan-300 transition">{step.title}</h4>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* =======================================================================
          MEGA STATS SECTION
         ======================================================================= */}
      <section className="px-6 py-20 relative z-10 bg-[#0A1025] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
           {[
             { icon: Users, value: "10,000+", label: lang === 'en' ? 'Active Karigars' : lang === 'gu' ? 'સક્રિય કારીગર' : 'सक्रिय कारीगर' },
             { icon: Briefcase, value: "50,000+", label: lang === 'en' ? 'Work Completed' : lang === 'gu' ? 'કામ પૂર્ણ' : 'काम पूर्ण' },
             { icon: Clock, value: "2M+ Hrs", label: lang === 'en' ? 'Time Saved' : lang === 'gu' ? 'સમય બચત' : 'समय की बचत' },
             { icon: Shield, value: "99.9%", label: lang === 'en' ? 'Client Satisfaction' : lang === 'gu' ? 'ગ્રાહક સંતોષ' : 'ग्राहक संतुष्टि' },
           ].map((stat, i) => (
             <div key={i} className="flex flex-col items-center p-4 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition mb-4 shadow-lg group-hover:shadow-purple-500/10">
                   <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
             </div>
           ))}
        </div>
      </section>

      {/* =======================================================================
          FEATURES GRID (ID: FEATURES)
         ======================================================================= */}
      <section id="features" className="px-6 py-32 relative z-10">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-20 relative">
              <span className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1.5 rounded-full text-[10px] font-bold text-white tracking-widest mb-4">✦ FEATURES</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                 {lang === 'en' ? 'Everything You Need to Scale' : lang === 'gu' ? 'સ્કેલ કરવા માટે બધું જ જોઈએ છે' : 'स्केल करने के लिए सब कुछ चाहिए'}
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto mt-4 text-sm">
                 {lang === 'en' ? 'Built with precision for the diamond and textile industries.' : lang === 'gu' ? 'ડાયમંડ અને ટેક્સટાઈલ ઉદ્યોગો માટે ચોકસાઈ સાથે બનાવેલ.' : 'डायमंड और कपड़ा उद्योगों के लिए सटीकता के साथ निर्मित।'}
              </p>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Layout, title: lang === 'en' ? 'Smart Dashboard' : lang === 'gu' ? 'સ્માર્ટ ડેશબોર્ડ' : 'स्मार्ट डैशबोर्ड', desc: lang === 'en' ? 'Get a birds-eye view of your entire workshop output.' : lang === 'gu' ? 'તમારી સમગ્ર વર્કશોપના આઉટપુટનું એક નજરમાં દૃશ્ય.' : 'अपनी पूरी वर्कशॉप के आउटपुट का एक नज़र में दृश्य।' },
                { icon: Layers, title: lang === 'en' ? 'Multi-Industry Support' : lang === 'gu' ? 'મલ્ટિ-ઇન્ડસ્ટ્રી સપોર્ટ' : 'मल्टी-इंडस्ट्री सपोर्ट', desc: lang === 'en' ? 'Perfectly tailored layouts for Diamond & Textile work.' : lang === 'gu' ? 'ડાયમંડ અને ટેક્સટાઈલ કામ માટે સંપૂર્ણ લેઆઉટ.' : 'डायमंड और कपड़ा काम के लिए पूरी तरह से तैयार लेआउट।' },
                { icon: GitBranch, title: lang === 'en' ? 'Work History Log' : lang === 'gu' ? 'કામ ઇતિહાસ લોગ' : 'कार्य इतिहास लॉग', desc: lang === 'en' ? 'Maintain a digital ledger of every task and karigar.' : lang === 'gu' ? 'દરેક કામ અને કારીગરનો ડિજિટલ લેજર જાળવો.' : 'प्रत्येक कार्य और कारीगर का डिजिटल लेजर बनाए रखें।' },
                { icon: Bell, title: lang === 'en' ? 'Instant Notifications' : lang === 'gu' ? 'ઇન્સ્ટન્ટ નોટિફિકેશન્સ' : 'तत्काल सूचनाएं', desc: lang === 'en' ? 'Get alerted instantly when a karigar completes a task.' : lang === 'gu' ? 'કારીગર કામ પૂર્ણ કરે ત્યારે ત્વરિત એલર્ટ.' : 'जब कारीगर कोई कार्य पूरा करता है तो तुरंत अलर्ट।' },
                { icon: Database, title: lang === 'en' ? 'Cloud Storage' : lang === 'gu' ? 'ક્લાઉડ સ્ટોરેજ' : 'क्लाउड स्टोरेज', desc: lang === 'en' ? 'Store unlimited designs, images, and videos securely.' : lang === 'gu' ? 'અમર્યાદિત ડિઝાઇન, ઇમેજ અને વીડિયો સુરક્ષિત રીતે સ્ટોર કરો.' : 'असीमित डिज़ाइन, इमेज और वीडियो सुरक्षित रूप से स्टोर करें।' },
                { icon: Activity, title: lang === 'en' ? 'Productivity Analytics' : lang === 'gu' ? 'પ્રોડક્ટિવિટી એનાલિટિક્સ' : 'उत्पादकता विश्लेषण', desc: lang === 'en' ? 'Analyze which karigars are the fastest and most accurate.' : lang === 'gu' ? 'કયા કારીગર સૌથી ઝડપી અને સચોટ છે તેનું વિશ્લેષણ.' : 'विश्लेषण करें कि कौन से कारीगर सबसे तेज़ और सटीक हैं।' },
              ].map((feature, idx) => (
                 <div key={idx} className="group glass-panel p-8 rounded-2xl border border-white/5 hover:border-purple-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/20 hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/20 transition duration-700"></div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition duration-300 group-hover:text-white group-hover:from-purple-500 group-hover:to-blue-500">
                       <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition">{feature.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* =======================================================================
          OWNER VS KARIGAR COMPARISON TABLE
         ======================================================================= */}
      <section className="px-6 py-32 relative z-10 bg-[#0A1025] border-y border-white/5">
         <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
               <span className="inline-block bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full text-[10px] font-bold text-cyan-400 tracking-widest mb-4">⚡ COMPARE</span>
               <h2 className="text-4xl font-bold">{t.comparison_title}</h2>
               <p className="text-sm text-slate-400 mt-2">{t.comparison_desc}</p>
            </div>
            
            <div className="glass-panel-deep rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
               <div className="grid grid-cols-3 gap-0 border-b border-white/10 bg-white/5 p-4 font-bold text-sm text-center">
                  <div className="text-slate-400">{lang === 'en' ? 'Feature' : lang === 'gu' ? 'સુવિધા' : 'सुविधा'}</div>
                  <div className="text-purple-400">{lang === 'en' ? 'Owner' : lang === 'gu' ? 'ઓનર' : 'मालिक'}</div>
                  <div className="text-cyan-400">{lang === 'en' ? 'Karigar' : lang === 'gu' ? 'કારીગર' : 'कारीगर'}</div>
               </div>
               <div className="divide-y divide-white/5">
                  {[
                    { feat: t.comp_1, o: t.comp_owner_1, k: t.comp_karigar_1 },
                    { feat: t.comp_2, o: t.comp_owner_2, k: t.comp_karigar_2 },
                    { feat: t.comp_3, o: t.comp_owner_3, k: t.comp_karigar_3 },
                    { feat: t.comp_4, o: t.comp_owner_4, k: t.comp_karigar_4 },
                  ].map((row, i) => (
                     <div key={i} className="grid grid-cols-3 gap-0 p-4 text-sm text-center items-center hover:bg-white/5 transition">
                        <div className="text-slate-400 font-medium">{row.feat}</div>
                        <div className="text-slate-200 flex justify-center items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> {row.o}</div>
                        <div className="text-slate-200 flex justify-center items-center gap-1"><CheckCircle className="w-4 h-4 text-cyan-400" /> {row.k}</div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* =======================================================================
          TESTIMONIALS SECTION
         ======================================================================= */}
      <section className="px-6 py-32 relative z-10 bg-[#0A1025] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
              <span className="inline-block bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full text-[10px] font-bold text-yellow-400 tracking-widest mb-4">⭐ REVIEWS</span>
              <h2 className="text-4xl font-bold">{t.testi_title}</h2>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { quote: t.testi_1_q, name: t.testi_1_n, role: t.testi_1_r },
                { quote: t.testi_2_q, name: t.testi_2_n, role: t.testi_2_r },
                { quote: t.testi_3_q, name: t.testi_3_n, role: t.testi_3_r },
              ].map((testi, idx) => (
                 <div key={idx} className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-white/10 transition group hover:-translate-y-1 duration-300">
                    <div className="flex gap-1 text-yellow-400 mb-4">
                       {[1,2,3,4,5].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6 group-hover:text-white transition">"{testi.quote}"</p>
                    <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center font-bold text-xs text-white">{testi.name.charAt(0)}</div>
                       <div>
                          <div className="text-sm font-semibold">{testi.name}</div>
                          <div className="text-[10px] text-slate-500">{testi.role}</div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* =======================================================================
          BLOG / LATEST UPDATES SECTION
         ======================================================================= */}
      <section className="px-6 py-32 relative z-10">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <span className="inline-block bg-slate-500/10 border border-slate-500/20 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-400 tracking-widest mb-4">📰 UPDATES</span>
               <h2 className="text-4xl font-bold">{t.blog_title}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
               {[
                 { icon: Zap, title: t.blog_1_t, desc: t.blog_1_d },
                 { icon: Globe, title: t.blog_2_t, desc: t.blog_2_d },
                 { icon: TrendingUp, title: t.blog_3_t, desc: t.blog_3_d },
               ].map((blog, idx) => (
                  <div key={idx} className="glass-panel-deep p-6 rounded-2xl border border-white/5 hover:border-cyan-400/30 transition cursor-pointer group">
                     <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition">
                        <blog.icon className="w-6 h-6" />
                     </div>
                     <h4 className="font-bold text-white mb-2 group-hover:text-cyan-300 transition">{blog.title}</h4>
                     <p className="text-xs text-slate-400 leading-relaxed">{blog.desc}</p>
                     <div className="mt-4 text-[10px] text-purple-400 flex items-center gap-1 group-hover:gap-2 transition-all">Read More <ArrowRight className="w-3 h-3" /></div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* =======================================================================
          FAQ SECTION (INTERACTIVE ACCORDION)
         ======================================================================= */}
      <section className="px-6 py-32 relative z-10 bg-[#0A1025] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-12">
              <span className="inline-block bg-slate-500/10 border border-slate-500/20 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-400 tracking-widest mb-4">❓ FAQ</span>
              <h2 className="text-4xl font-bold">
                 {lang === 'en' ? 'Frequently Asked Questions' : lang === 'gu' ? 'વારંવાર પૂછાતા પ્રશ્નો' : 'अक्सर पूछे जाने वाले प्रश्न'}
              </h2>
           </div>
           
           <div className="space-y-4">
              {[
                { q: t.faq_1_q, a: t.faq_1_a },
                { q: t.faq_2_q, a: t.faq_2_a },
                { q: t.faq_3_q, a: t.faq_3_a },
                { q: t.faq_4_q, a: t.faq_4_a },
                { q: t.faq_5_q, a: t.faq_5_a },
              ].map((faq, i) => (
                 <div key={i} className="glass-panel-deep rounded-2xl border border-white/5 hover:border-purple-500/30 transition cursor-pointer overflow-hidden">
                    <button 
                       onClick={() => setOpenFaq(openFaq === i ? null : i)}
                       className="w-full flex justify-between items-center p-6 text-left"
                    >
                       <h3 className="font-semibold text-base text-slate-200 hover:text-white transition">{faq.q}</h3>
                       <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-purple-400' : ''}`} />
                    </button>
                    <div className={`px-6 pb-6 text-sm text-slate-400 leading-relaxed transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 opacity-100 block' : 'max-h-0 opacity-0 hidden'}`}>
                       {faq.a}
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* =======================================================================
          FINAL MEGA CTA SECTION - ONLY LOGIN & START BUTTONS
         ======================================================================= */}
      <section id="start" className="px-6 py-32 relative z-10">
        <div className="max-w-7xl mx-auto glass-panel-deep rounded-3xl p-12 md:p-20 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
           <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
           <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px]"></div>
           
           <div className="relative z-10 space-y-6 max-w-xl">
              <div className="inline-block bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20 text-purple-300 text-[10px] font-bold tracking-widest">🚀 GET STARTED</div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                 {t.cta_title}
              </h2>
              <p className="text-slate-400 max-w-md leading-relaxed text-lg">
                 {t.cta_desc}
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                 <Link href="/login" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-2xl shadow-purple-900/50 transition-all hover:scale-105 flex items-center gap-3">
                    {t.cta_btn_start} <ArrowRight className="w-5 h-5" />
                 </Link>
                 <Link href="/login" className="glass-panel border border-white/20 hover:bg-white/10 text-white px-10 py-4 rounded-xl text-lg font-medium transition-all hover:shadow-lg flex items-center gap-3">
                    {t.cta_btn_login} <Users className="w-5 h-5" />
                 </Link>
              </div>
           </div>

           <div className="relative z-10 flex justify-center w-full max-w-xs mx-auto lg:mx-0">
              <div className="relative w-full aspect-[9/18] bg-gradient-to-br from-slate-900 to-[#04080F] rounded-[3.5rem] border-[8px] border-white/20 shadow-2xl shadow-purple-900/60 animate-float-slow flex flex-col items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-cyan-400/10 blur-[1px]"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 bg-black/30 backdrop-blur-xl p-8 rounded-3xl border border-white/10 w-4/5">
                    <div className="bg-gradient-to-br from-purple-500 to-cyan-400 w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-[#04080F] text-xl font-black shadow-lg">W</div>
                    <h4 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">WorkSetu</h4>
                    <div className="mt-4 flex justify-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                       <span className="text-[8px] text-slate-400">Online</span>
                    </div>
                    <div className="mt-4 bg-white/5 rounded-xl p-3 border border-white/5 text-left">
                       <div className="text-[9px] text-slate-400">Current Task</div>
                       <div className="text-xs font-semibold truncate">Silver Necklace</div>
                       <div className="mt-2 flex justify-between items-center">
                          <span className="text-[8px] text-orange-300">In Progress</span>
                          <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-purple-500"></div></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* =======================================================================
          MEGA FOOTER (ID: ABOUT)
         ======================================================================= */}
      <footer id="about" className="border-t border-white/5 px-6 pt-20 pb-8 bg-[#02040A] relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-12 mb-16">
           <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-xl flex items-center justify-center font-black text-[#02040A] text-lg shadow-lg shadow-purple-900/40">W</div>
                 <span className="text-xl font-bold tracking-tight text-white">{t.brand}</span>
              </div>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">{t.footer_tag}</p>
              <div className="flex gap-4 text-slate-500">
                 <MessageSquare className="w-5 h-5 hover:text-purple-400 cursor-pointer transition" />
                 <Map className="w-5 h-5 hover:text-purple-400 cursor-pointer transition" />
                 <BookOpen className="w-5 h-5 hover:text-purple-400 cursor-pointer transition" />
              </div>
           </div>
           
           <div>
              <h4 className="font-semibold text-sm mb-4 text-white">{t.footer_links}</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                 <li><a href="#home" className="hover:text-white transition flex items-center gap-1"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" /> Home</a></li>
                 <li><a href="#features" className="hover:text-white transition">Features</a></li>
                 <li><a href="#workflow" className="hover:text-white transition">How It Works</a></li>
                 <li><a href="#about" className="hover:text-white transition">About</a></li>
              </ul>
           </div>
           
           <div>
              <h4 className="font-semibold text-sm mb-4 text-white">{t.footer_support}</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                 <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                 <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                 <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                 <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
              </ul>
           </div>
           
           <div>
              <h4 className="font-semibold text-sm mb-4 text-white">{t.footer_sub}</h4>
              <p className="text-[10px] text-slate-500 mb-3">
                 {lang === 'en' ? 'Get latest updates directly to your inbox.' : lang === 'gu' ? 'નવીનતમ અપડેટ્સ સીધા તમારા ઇનબોક્સમાં મેળવો.' : 'नवीनतम अपडेट सीधे अपने इनबॉक्स में प्राप्त करें।'}
              </p>
              <div className="flex gap-2">
                 <input type="email" placeholder={lang === 'en' ? 'Email address' : lang === 'gu' ? 'ઈમેલ સરનામું' : 'ईमेल पता'} className="bg-[#0A1025] px-3 py-2 rounded-lg text-xs outline-none border border-white/10 focus:border-purple-500 w-full text-slate-300 transition" />
                 <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 p-2 rounded-lg transition shadow-lg shadow-purple-900/30"><Mail className="w-3.5 h-3.5" /></button>
              </div>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600">
           <div>© 2026 WorkSetu. {lang === 'en' ? 'All rights reserved.' : lang === 'gu' ? 'બધા હક્કો સુરક્ષિત.' : 'सर्वाधिकार सुरक्षित।'}</div>
           <div className="flex gap-6">
              <a href="#" className="hover:text-slate-300 transition">Privacy</a>
              <a href="#" className="hover:text-slate-300 transition">Terms</a>
              <a href="#" className="hover:text-slate-300 transition">Cookies</a>
           </div>
        </div>
      </footer>
    </div>
  );
}

// Helpers
function ChevronDown(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>; }
function Palette(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.8 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.5-1.1-1.4-1.5-3.5-4.5-2.5-7.5.7-2.1 2.5-3.4 4.5-3.4 3.1 0 5.5 2.5 5.5 5.5 0 3.1-2.5 5.5-5.5 5.5h-1.5"/></svg>; }