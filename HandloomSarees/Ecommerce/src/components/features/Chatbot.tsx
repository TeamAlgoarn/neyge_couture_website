// import { useState, useRef, useEffect } from 'react';
// import { MessageCircle, X, Send, Sparkles, RotateCcw, Minus } from 'lucide-react';

// // ── Types ──────────────────────────────────────────────────────────────────────
// interface Message {
//   id: number;
//   role: 'bot' | 'user';
//   text: string;
//   timestamp: Date;
// }

// // ── Knowledge Base ─────────────────────────────────────────────────────────────
// const KNOWLEDGE_BASE: { keywords: string[]; reply: string }[] = [
//   {
//     keywords: ['hello', 'hi', 'hey', 'namaste', 'hii', 'helo', 'greet', 'good morning', 'good evening', 'good afternoon'],
//     reply:
//       "Namaste! 🙏 Welcome to HandloomSarees — India's finest handwoven collection.\n\nI'm Priya, your personal saree guide. I can help you with:\n• 🧵 Saree collections & styles\n• 💰 Pricing & offers\n• 🚚 Shipping & delivery\n• ↩️ Returns & exchanges\n• 🪡 Artisan stories\n\nWhat would you like to explore today?",
//   },
//   {
//     keywords: ['kanchipuram', 'kanchi', 'kanjivaram', 'pattu', 'tamil'],
//     reply:
//       "✨ Kanchipuram Silk Sarees\n\nHandwoven in Tamil Nadu by 5th-generation master weavers using:\n• 🧵 Pure mulberry silk threads\n• ✨ Real gold & silver zari borders\n• 🎨 Rich temple & peacock motifs\n\n💰 Price Range: ₹8,500 – ₹75,000\n⏱️ Weaving Time: 10–45 days per saree\n🚚 Delivery: 5–7 business days\n\n🌟 These are heirloom pieces passed across generations.\n\nWant to see specific colors or occasions?",
//   },
//   {
//     keywords: ['banarasi', 'banaras', 'varanasi', 'brocade', 'uttar pradesh'],
//     reply:
//       "🌟 Banarasi Silk Sarees\n\nCrafted in the holy city of Varanasi with:\n• 🥇 Pure silk or georgette base\n• 🔱 Intricate gold/silver brocade work\n• 🌸 Mughal-inspired floral & leaf motifs\n\n💰 Price Range: ₹6,000 – ₹65,000\n⏱️ Weaving Time: 15–30 days\n🎁 Most popular choice for weddings & festivals\n\nTypes available:\nKataan · Organza · Georgette · Shattir\n\nShall I help you pick one for a specific occasion?",
//   },
//   {
//     keywords: ['chanderi', 'maheshwari', 'madhya pradesh', 'lightweight', 'cotton silk'],
//     reply:
//       "🌸 Chanderi & Maheshwari Sarees\n\nPerfect for summer & daily elegance:\n• 🌿 Sheer, featherlight fabric\n• 🎨 Subtle coin, floral & geometric motifs\n• 💎 Cotton-silk & pure silk variants\n\n💰 Price Range: ₹2,800 – ₹18,000\n📍 Woven in Madhya Pradesh — a GI-tagged craft\n\nGreat for office, casual outings & daytime events!\nWant help choosing between Chanderi or Maheshwari?",
//   },
//   {
//     keywords: ['pochampally', 'ikat', 'telangana', 'tie dye', 'geometric'],
//     reply:
//       "🔷 Pochampally Ikat Sarees\n\nA UNESCO-recognised weaving art from Telangana:\n• 🎨 Tie-dye threads woven into geometric patterns\n• 🌈 Bold colours with natural dyes\n• 🧵 Cotton & silk variants\n\n💰 Price Range: ₹3,500 – ₹22,000\n✅ GI-tagged authentic weave\n\nWould you like cotton or silk ikat?",
//   },
//   {
//     keywords: ['paithani', 'maharashtra', 'peacock', 'tapestry'],
//     reply:
//       "🦚 Paithani Sarees\n\nThe pride of Maharashtra, handwoven in Paithan:\n• 🦚 Iconic peacock & parrot motifs\n• 🥇 Pure silk with gold zari pallu\n• ⏱️ Takes 6 months to 2 years for a single saree!\n\n💰 Price Range: ₹15,000 – ₹1,50,000\n🎁 Traditionally gifted at weddings & celebrations\n\nA true collector's treasure. Shall I share more?",
//   },
//   {
//     keywords: ['price', 'cost', 'how much', 'rate', 'budget', 'afford', 'cheap', 'expensive', 'range'],
//     reply:
//       "💰 Our Price Ranges\n\nHandloom Cotton:  ₹1,800 – ₹6,000\nChanderi / Maheshwari:  ₹2,800 – ₹18,000\nPochampally Ikat:  ₹3,500 – ₹22,000\nBanarasi Silk:  ₹6,000 – ₹65,000\nKanchipuram Silk:  ₹8,500 – ₹75,000\nPaithani:  ₹15,000 – ₹1,50,000\n\n💳 EMI available on orders above ₹5,000\n🎁 Special discounts during festivals!\n\nWhat's your budget? I'll find you the perfect match! 😊",
//   },
//   {
//     keywords: ['shipping', 'delivery', 'dispatch', 'courier', 'track', 'when will', 'how long', 'arrive', 'days'],
//     reply:
//       "🚚 Shipping & Delivery\n\n✅ Free shipping on orders above ₹3,000\n⚡ Express delivery (2–3 days): ₹149\n📦 Standard delivery (5–7 days): Free / ₹99\n🌍 International shipping: 25+ countries, 10–14 days\n\nHow to track your order:\n1. Visit My Orders in your account\n2. Or enter Order ID on our Track page\n3. SMS/email updates sent automatically\n\nAll orders are carefully packed in premium gift boxes. 🎁",
//   },
//   {
//     keywords: ['return', 'refund', 'exchange', 'replace', 'cancel', 'wrong', 'damaged', 'defect'],
//     reply:
//       "↩️ Returns & Refund Policy\n\n✅ 7-day hassle-free returns\n✅ Free return pickup (metros & tier-1 cities)\n✅ Refund in 5–7 business days\n\nEasy steps:\n1. Log in → My Orders → Request Return\n2. Pack in original packaging\n3. Our courier picks it up free!\n\n❌ Custom-stitched blouses are non-returnable\n💡 Damaged or wrong items? We'll replace immediately, no questions asked.\n\nNeed to raise a return right now?",
//   },
//   {
//     keywords: ['care', 'wash', 'clean', 'maintain', 'store', 'preserve', 'iron', 'dry'],
//     reply:
//       "🧺 Saree Care Guide\n\nSilk Sarees:\n• Dry-clean only — avoid machine wash\n• Store in muslin cloth, never plastic\n• Keep camphor balls to avoid insects\n• Iron on reverse at low heat\n\nCotton Sarees:\n• Gentle hand-wash in cold water\n• Use mild detergent — no bleach\n• Dry in shade, not direct sunlight\n\nZari / Embroidery:\n• Wrap zari borders in tissue paper\n• Fold differently each time to avoid crease lines\n\n💛 Proper care keeps a saree beautiful for 50+ years!",
//   },
//   {
//     keywords: ['custom', 'customise', 'customize', 'blouse', 'stitching', 'tailoring', 'stitch', 'fall', 'pico'],
//     reply:
//       "✂️ Customization Services\n\n🪡 Blouse Stitching: ₹499 – ₹2,500\n🎨 Custom Colors (select weaves): +7–10 days\n🔖 Personalized Gift Wrapping: ₹99\n✍️ Handwritten Gift Note: Free\n\nBlouse styles available:\nSleeveless · Short sleeve · Elbow · Full sleeve · Boat neck · Deep back\n\n⏱️ Allow 7–10 extra days for custom orders.\n📐 Please share your measurements via our size guide for best results!\n\nShall I guide you through the customization process?",
//   },
//   {
//     keywords: ['artisan', 'weaver', 'craft', 'heritage', 'traditional', 'handmade', 'handwoven', 'story', 'who makes'],
//     reply:
//       "🪡 Our Artisan Community\n\n✅ 500+ artisan families across India\n✅ 15+ states represented\n✅ 50+ distinct weaving techniques preserved\n\n🤝 We pay 25–40% above market rate to ensure fair wages\n📚 We fund children's education in weaver communities\n🌱 Zero middlemen — direct from loom to you\n\nWhere our weavers are from:\nKanchipuram · Varanasi · Pochampally · Paithan · Kutch · Bhagalpur · Sualkuchi\n\n💛 Every purchase directly supports a family.\nRead their stories on our Artisan Stories page!",
//   },
//   {
//     keywords: ['gift', 'gifting', 'occasion', 'wedding', 'festival', 'diwali', 'puja', 'birthday', 'anniversary', 'bridal', 'trousseau'],
//     reply:
//       "🎁 Gifting & Occasions\n\nPopular gifting categories:\n• 👰 Bridal Trousseau Sets\n• 🪔 Festival Curated Collections\n• 💍 Anniversary & Special Occasion Picks\n• 🎂 Birthday Gifting Hampers\n\nGift extras:\n✅ Luxury gift box packaging (free on ₹5,000+)\n✅ Handwritten personalised note (free)\n✅ Express gift delivery available\n✅ Corporate bulk gifting with branding\n\n🌸 A HandloomSarees gift is a gift of heritage.\n\nWant help choosing for a specific occasion?",
//   },
//   {
//     keywords: ['payment', 'pay', 'upi', 'cod', 'credit', 'debit', 'net banking', 'emi', 'paypal', 'gpay', 'phonepe'],
//     reply:
//       "💳 Payment Options\n\n✅ UPI (GPay, PhonePe, Paytm)\n✅ Credit / Debit Cards (Visa, Mastercard, RuPay)\n✅ Net Banking (all major banks)\n✅ Cash on Delivery (orders under ₹10,000)\n✅ PayPal (international)\n✅ EMI (orders ₹5,000+) — HDFC, ICICI, Axis\n\n🔒 100% Secure Payments via Razorpay & SSL encryption\n\nAny payment issue? We're here to help!",
//   },
//   {
//     keywords: ['size', 'length', 'measurement', 'how big', 'yards', 'metre', 'meter'],
//     reply:
//       "📏 Saree Sizes Guide\n\nStandard Saree:  5.5 metres\nWith blouse piece:  +0.8 metres\nNauvari (Maharashtra):  9 yards\nKasavu (Kerala):  6–6.5 metres\nHalf saree:  3.5 metres\n\n💡 Blouse piece is included in most of our sarees\n💡 Width is standard 45–47 inches for most weaves\n\nNeed help with blouse measurements? I can guide you!",
//   },
//   {
//     keywords: ['offer', 'discount', 'coupon', 'deal', 'sale', 'promo', 'code', 'cashback', 'free'],
//     reply:
//       "🎉 Current Offers & Deals\n\n🏷️ NEWUSER10 — 10% off first order\n🏷️ HERITAGE5 — ₹500 off on ₹5,000+\n🏷️ SILKLOVE — Free blouse stitching on silk sarees\n\nAlways active:\n✅ Free shipping above ₹3,000\n✅ Free gift wrapping on ₹5,000+\n✅ Extra 5% off on app orders\n\n🪔 Festival season sales coming soon — follow us for alerts!\n\nWant me to suggest the best offer for your cart?",
//   },
//   {
//     keywords: ['contact', 'support', 'help', 'human', 'agent', 'talk to', 'connect', 'call', 'email', 'whatsapp'],
//     reply:
//       "📞 Contact Our Team\n\n📧 Email: support@handloomsarees.com\n📱 WhatsApp: +91 98765 43210\n☎️ Phone: +91 80-1234-5678\n\n🕐 Working Hours:\nMon – Sat · 9 AM – 7 PM IST\nSunday · 10 AM – 5 PM IST\n\n⚡ WhatsApp is our fastest channel — avg reply in 10 mins!\n\nWould you like me to escalate this to a live agent right now?",
//   },
//   {
//     keywords: ['about', 'who are you', 'your company', 'handloom sarees', 'founded', 'history'],
//     reply:
//       "🏛️ About HandloomSarees\n\nWe are India's most trusted platform for authentic, ethically-sourced handwoven sarees — bridging artisans and saree lovers across the world.\n\n📅 Founded: 2016\n📍 Headquarters: Bengaluru, India\n🌍 Ships to: 25+ countries\n🪡 Artisan Partners: 500+ families\n⭐ Rating: 4.8/5 (12,000+ reviews)\n\n🌱 Our mission: Preserve India's weaving heritage while empowering artisan families.\n\nProud to be a certified Fair Trade partner!",
//   },
// ];

// const GENERAL_RESPONSES: { keywords: string[]; reply: string }[] = [
//   {
//     keywords: ['weather', 'rain', 'sunny', 'temperature', 'climate', 'forecast'],
//     reply:
//       "☀️ Ha! I wish I could check the weather — but that's a bit outside my expertise as a saree guide! 😄\n\nFor weather updates, try Google Weather or your phone's weather app.\n\nBut while we're chatting — a lightweight Chanderi or Georgette saree is perfect for warm days! Want to explore some? 🌸",
//   },
//   {
//     keywords: ['recipe', 'food', 'cook', 'eat', 'restaurant', 'hungry', 'pizza', 'biryani'],
//     reply:
//       "🍽️ I'm more of a saree expert than a chef, I'm afraid! 😄\n\nFor food & recipes, Zomato or Swiggy will serve you better!\n\nFun fact — many of our sarees are inspired by food colours! Our saffron Banarasi and turmeric Chanderi are absolute favourites. Fancy a look? 💛",
//   },
//   {
//     keywords: ['movie', 'film', 'netflix', 'show', 'web series', 'bollywood', 'ott', 'cinema'],
//     reply:
//       "🎬 Movies are not quite my domain — I live in the world of silk and zari! 😊\n\nHave you noticed how sarees steal the show in every Bollywood film? Our Kanchipuram silks are very popular for bridal looks!\n\nCan I help you find a saree as glamorous as your favourite star? ✨",
//   },
//   {
//     keywords: ['cricket', 'football', 'sport', 'ipl', 'match', 'score', 'game', 'fifa'],
//     reply:
//       "🏏 Sports scores are a bit beyond my weaving knowledge! 😄 Try ESPN or CricBuzz for live scores.\n\nBut here's a fun connection — our Pochampally Ikat sarees are as popular in Hyderabad as the IPL! Want to explore? 🔷",
//   },
//   {
//     keywords: ['joke', 'funny', 'laugh', 'humor', 'comedy', 'tell me a joke'],
//     reply:
//       "😄 Okay, here's one:\n\nWhy did the saree refuse to be ironed?\nBecause it didn't want to lose its drape! 🥁\n\nAlright, I'm clearly better at sarees than comedy! 😂 Can I help you find a beautiful one today?",
//   },
//   {
//     keywords: ['who are you', 'what are you', 'are you ai', 'are you a robot', 'are you human', 'are you bot', 'bot or human'],
//     reply:
//       "🤖 Great question! I'm Priya, an AI-powered saree guide created for HandloomSarees.\n\nI'm not a human, but I'm trained with deep knowledge about Indian handloom weaves, artisan crafts, our entire collection, and store policies.\n\nFor complex issues, I can connect you to a real human agent anytime! 😊\n\nNow, shall we find you the perfect saree? 🧵",
//   },
//   {
//     keywords: ['thank', 'thanks', 'thank you', 'tq', 'ty', 'great', 'helpful', 'awesome', 'amazing', 'love it', 'perfect'],
//     reply:
//       "🙏 You're so welcome! It's my pleasure to help.\n\nIs there anything else I can assist you with — collections, offers, care tips, or anything else?\n\nHappy saree shopping! 🌸✨",
//   },
//   {
//     keywords: ['bye', 'goodbye', 'see you', 'take care', 'cya', 'later', 'ok bye'],
//     reply:
//       "👋 Thank you for visiting HandloomSarees!\n\nWishing you a wonderful day ahead. Come back anytime — our looms are always weaving something beautiful for you! 🧵💛\n\nNamaste! 🙏",
//   },
// ];

// const FALLBACK_REPLIES = [
//   "🤔 Hmm, that's a bit outside my saree expertise! But I'd love to help with anything about our collections, shipping, returns, pricing, or artisans.\n\nFor other queries, our team is just a WhatsApp away:\n📱 +91 98765 43210 😊",
//   "I'm still learning new things every day! For this specific question, our support team at support@handloomsarees.com will be much better placed to help.\n\nIn the meantime, can I tell you about our latest collection? 🌸",
//   "That's interesting — I'm primarily trained as a saree guide, so I might not be the best for that! 😊\n\nBut if you have questions about our handloom sarees, artisans, delivery, or returns — I'm all yours! 🧵\n\nType 'hi' to see all that I can help with.",
// ];

// const QUICK_PROMPTS = [
//   { label: '🛍️ Our Collections', msg: 'What sarees do you have?' },
//   { label: '💰 Pricing', msg: 'What are your price ranges?' },
//   { label: '🚚 Shipping Info', msg: 'Tell me about shipping and delivery' },
//   { label: '↩️ Return Policy', msg: 'What is your return policy?' },
//   { label: '🎁 Gifting Options', msg: 'Tell me about gifting options' },
//   { label: '🪡 Our Artisans', msg: 'Tell me about your artisans' },
// ];

// function getBotReply(input: string): string {
//   const lower = input.toLowerCase().trim();
//   for (const entry of [...KNOWLEDGE_BASE, ...GENERAL_RESPONSES]) {
//     if (entry.keywords.some((kw) => lower.includes(kw))) return entry.reply;
//   }
//   return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
// }

// function TypingDots() {
//   return (
//     <div className="flex items-center gap-1.5 px-4 py-3.5">
//       {[0, 1, 2].map((i) => (
//         <span
//           key={i}
//           className="w-2 h-2 rounded-full bg-[#800020]/50 animate-bounce"
//           style={{ animationDelay: `${i * 0.18}s` }}
//         />
//       ))}
//     </div>
//   );
// }

// function ChatMessage({ msg }: { msg: Message }) {
//   const isBot = msg.role === 'bot';
//   const time = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   return (
//     <div className={`flex gap-2 ${isBot ? 'items-end' : 'items-end flex-row-reverse'}`}>
//       {isBot ? (
//         <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#800020] to-[#4B0082] flex items-center justify-center flex-shrink-0">
//           <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
//         </div>
//       ) : (
//         <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#800020]">
//           U
//         </div>
//       )}
//       <div className={`flex flex-col gap-1 max-w-[80%] ${isBot ? 'items-start' : 'items-end'}`}>
//         <div
//           className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
//             isBot
//               ? 'bg-white text-gray-700 border border-[#D4AF37]/20 rounded-2xl rounded-bl-sm'
//               : 'bg-gradient-to-br from-[#800020] to-[#4B0082] text-white rounded-2xl rounded-br-sm'
//           }`}
//         >
//           {msg.text}
//         </div>
//         <span className="text-[10px] text-gray-400 px-1">{time}</span>
//       </div>
//     </div>
//   );
// }

// export function Chatbot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 0,
//       role: 'bot',
//       text: "Namaste! 🙏 I'm Priya, your HandloomSarees guide.\n\nI can help you with our collections, pricing, shipping, returns, care tips & more. Use the quick options below or just type your question!",
//       timestamp: new Date(),
//     },
//   ]);
//   const [input, setInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [unread, setUnread] = useState(0);
//   const [showPrompts, setShowPrompts] = useState(true);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isTyping]);

//   useEffect(() => {
//     if (isOpen) {
//       setUnread(0);
//       setIsMinimized(false);
//       setTimeout(() => inputRef.current?.focus(), 300);
//     }
//   }, [isOpen]);

//   const sendMessage = (text: string) => {
//     if (!text.trim()) return;
//     setShowPrompts(false);
//     const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim(), timestamp: new Date() };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput('');
//     setIsTyping(true);
//     setTimeout(() => {
//       const reply = getBotReply(text);
//       const botMsg: Message = { id: Date.now() + 1, role: 'bot', text: reply, timestamp: new Date() };
//       setIsTyping(false);
//       setMessages((prev) => [...prev, botMsg]);
//       if (!isOpen) setUnread((n) => n + 1);
//     }, 800 + Math.random() * 700);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     sendMessage(input);
//   };

//   const resetChat = () => {
//     setMessages([
//       {
//         id: Date.now(),
//         role: 'bot',
//         text: "Chat reset! 😊 How can I help you today?\n\nFeel free to ask about our sarees, shipping, returns, or anything else!",
//         timestamp: new Date(),
//       },
//     ]);
//     setShowPrompts(true);
//     setInput('');
//   };

//   return (
//     <>
//       {/* ── Floating Action Button ─────────────────────────────────────────── */}
//       <button
//         onClick={() => setIsOpen((v) => !v)}
//         aria-label="Open chat"
//         className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#800020] to-[#4B0082] text-white shadow-2xl shadow-[#800020]/50 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center"
//       >
//         <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
//           {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
//         </div>
//         {!isOpen && unread > 0 && (
//           <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#D4AF37] text-[#800020] rounded-full text-[10px] font-bold flex items-center justify-center shadow">
//             {unread}
//           </span>
//         )}
//       </button>

//       {/* ── Chat Window ────────────────────────────────────────────────────── */}
//       <div
//         className={`fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-[#800020]/25 border border-[#D4AF37]/25 bg-white transition-all duration-300 origin-bottom-right ${
//           isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
//         }`}
//         style={{ width: '370px', maxWidth: 'calc(100vw - 2rem)' }}
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-[#800020] to-[#4B0082] px-4 py-3.5 flex items-center gap-3 flex-shrink-0">
//           <div className="relative">
//             <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
//               <Sparkles className="w-5 h-5 text-[#D4AF37]" />
//             </div>
//             <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#4B0082]" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-white font-semibold text-sm leading-none">Priya</p>
//             <p className="text-[#D4AF37]/80 text-[11px] mt-0.5">HandloomSarees AI Guide · Online</p>
//           </div>
//           <div className="flex items-center gap-1">
//             <button
//               onClick={resetChat}
//               title="Reset chat"
//               className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
//             >
//               <RotateCcw className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => setIsMinimized((v) => !v)}
//               title="Minimise"
//               className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
//             >
//               <Minus className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => setIsOpen(false)}
//               title="Close"
//               className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {!isMinimized && (
//           <>
//             {/* Messages */}
//             <div
//               className="overflow-y-auto bg-gradient-to-b from-[#FDF8F3] to-[#FAF3EC] px-4 py-4 space-y-4"
//               style={{ height: '340px' }}
//             >
//               {messages.map((msg) => (
//                 <ChatMessage key={msg.id} msg={msg} />
//               ))}
//               {isTyping && (
//                 <div className="flex gap-2 items-end">
//                   <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#800020] to-[#4B0082] flex items-center justify-center flex-shrink-0">
//                     <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
//                   </div>
//                   <div className="bg-white border border-[#D4AF37]/20 rounded-2xl rounded-bl-sm shadow-sm">
//                     <TypingDots />
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Quick Prompts — 2-column grid, never overflows */}
//             {showPrompts && (
//               <div className="bg-[#FDF8F3] border-t border-[#D4AF37]/15 px-3 py-3 flex-shrink-0">
//                 <p className="text-[11px] text-gray-400 font-medium mb-2 px-0.5 uppercase tracking-wide">
//                   Quick options
//                 </p>
//                 <div className="grid grid-cols-2 gap-1.5">
//                   {QUICK_PROMPTS.map((p) => (
//                     <button
//                       key={p.msg}
//                       onClick={() => sendMessage(p.msg)}
//                       className="text-[11px] px-3 py-2 rounded-xl border border-[#800020]/20 bg-white text-[#800020] hover:bg-[#800020]/5 hover:border-[#800020]/40 active:scale-95 transition-all duration-150 text-left font-medium leading-tight shadow-sm"
//                     >
//                       {p.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Input Bar */}
//             <form
//               onSubmit={handleSubmit}
//               className="bg-white border-t border-[#D4AF37]/20 px-3 py-3 flex items-center gap-2 flex-shrink-0"
//             >
//               <input
//                 ref={inputRef}
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Ask anything…"
//                 className="flex-1 min-w-0 text-sm bg-[#FDF8F3] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 outline-none focus:border-[#800020]/50 focus:ring-2 focus:ring-[#800020]/10 text-gray-700 placeholder:text-gray-400 transition-all"
//               />
//               <button
//                 type="submit"
//                 disabled={!input.trim()}
//                 className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#800020] to-[#4B0082] flex items-center justify-center text-white disabled:opacity-35 hover:opacity-90 hover:scale-105 active:scale-95 transition-all flex-shrink-0 shadow-md"
//               >
//                 <Send className="w-4 h-4" />
//               </button>
//             </form>

//             {/* Footer */}
//             <div className="bg-white border-t border-gray-100 py-1.5 text-center flex-shrink-0">
//               <p className="text-[10px] text-gray-400">Powered by HandloomSarees AI · 🔒 Secure</p>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// }



import { useMemo, useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  ArrowLeft,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { createChatbotLead } from "@/api/chatbot";

type Flow =
  | "menu"
  | "shop_sarees"
  | "video_shopping"
  | "custom_bulk"
  | "support";

type Step =
  | "menu"
  | "shop_type"
  | "shop_help"
  | "video_menu"
  | "form"
  | "done";

type ChatMessage = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const SHOP_TYPES = [
  "Wedding Sarees",
  "Festive Sarees",
  "Daily Wear Sarees",
  "Office Wear Sarees",
  "Silk Sarees",
  "Cotton Sarees",
  "Premium Collection",
];

const REQUIREMENT_TYPES = [
  "Wedding Purchase",
  "Family Function",
  "Corporate Gifting",
  "Boutique / Reseller",
  "Custom Requirement",
];

const TIME_SLOTS = [
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CSS = `
.neyge-chatbot-launcher {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;
  border: none;
  background: linear-gradient(135deg, #800020, #5A0016);
  color: #fff;
  padding: 14px 20px;
  border-radius: 999px;
  box-shadow: 0 18px 45px rgba(128,0,32,.35);
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 700;
  cursor: pointer;
}

.neyge-chatbot-panel {
  position: fixed;
  right: 24px;
  bottom: 92px;
  z-index: 9999;
  width: min(390px, calc(100vw - 28px));
  height: min(620px, calc(100vh - 120px));
  background: #FFF9F0;
  border-radius: 26px;
  overflow: hidden;
  border: 1px solid rgba(196,152,10,.32);
  box-shadow: 0 28px 80px rgba(0,0,0,.25);
  display: flex;
  flex-direction: column;
}

.neyge-chatbot-header {
  padding: 18px;
  background: linear-gradient(135deg, #800020, #5A0016);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.neyge-chatbot-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.neyge-chatbot-title strong {
  font-size: 16px;
}

.neyge-chatbot-title small {
  display: block;
  opacity: .82;
  margin-top: 2px;
}

.neyge-icon-btn {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 4px;
}

.neyge-chatbot-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background:
    radial-gradient(circle at top left, rgba(196,152,10,.16), transparent 34%),
    linear-gradient(180deg, #fff9f0, #fffaf4);
}

.neyge-msg {
  max-width: 85%;
  padding: 11px 13px;
  border-radius: 17px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.45;
  white-space: pre-line;
}

.neyge-msg.bot {
  background: white;
  color: #4A3828;
  border: 1px solid rgba(196,152,10,.18);
  border-bottom-left-radius: 5px;
}

.neyge-msg.user {
  margin-left: auto;
  background: #800020;
  color: white;
  border-bottom-right-radius: 5px;
}

.neyge-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 16px;
}

.neyge-chip {
  border: 1px solid rgba(128,0,32,.24);
  background: white;
  color: #800020;
  padding: 9px 12px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 700;
  transition: .2s ease;
  text-decoration: none;
}

.neyge-chip:hover {
  background: #800020;
  color: white;
  transform: translateY(-1px);
}

.neyge-form {
  padding: 14px;
  background: white;
  border-top: 1px solid rgba(196,152,10,.22);
}

.neyge-input,
.neyge-select,
.neyge-textarea {
  width: 100%;
  border: 1px solid rgba(74,56,40,.18);
  border-radius: 13px;
  padding: 11px 12px;
  margin-bottom: 9px;
  outline: none;
  font-size: 14px;
  background: #fff;
  color: #4A3828;
}

.neyge-input:focus,
.neyge-select:focus,
.neyge-textarea:focus {
  border-color: #C4980A;
  box-shadow: 0 0 0 3px rgba(196,152,10,.12);
}

.neyge-submit {
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 12px;
  background: linear-gradient(135deg, #800020, #5A0016);
  color: white;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
}

.neyge-submit:disabled {
  opacity: .65;
  cursor: not-allowed;
}

.neyge-whatsapp {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  text-decoration: none;
  background: white;
  color: #800020;
  border: 1px solid rgba(128,0,32,.2);
  padding: 9px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 13px;
  margin-top: 6px;
}
.neyge-wa-float {
  position: fixed;
  right: 24px;
  bottom: 90px;
  z-index: 9998;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: #25D366;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(37,211,102,.35);
  text-decoration: none;
  transition: transform .2s;
}
.neyge-wa-float:hover { transform: scale(1.1); }

@media(max-width: 520px) {
  .neyge-chatbot-panel {
    right: 14px;
    bottom: 86px;
    height: min(600px, calc(100vh - 104px));
  }

  .neyge-chatbot-launcher {
    right: 14px;
    bottom: 18px;
  }
}
`;

function getId() {
  return crypto.randomUUID();
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [flow, setFlow] = useState<Flow>("menu");
  const [step, setStep] = useState<Step>("menu");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: getId(),
      sender: "bot",
      text: "Hi, welcome to NEYGE COUTURE 🌸\nI’m your saree concierge. How can I help you today?",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    occasion: "",
    budget: "",
    saree_type: "",
    preferred_date: "",
    preferred_time: "",
    requirement_type: "",
    approx_quantity: "",
    message: "",
  });

  const addMessage = (sender: "bot" | "user", text: string) => {
    setMessages((prev) => [...prev, { id: getId(), sender, text }]);
  };

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      city: "",
      occasion: "",
      budget: "",
      saree_type: "",
      preferred_date: "",
      preferred_time: "",
      requirement_type: "",
      approx_quantity: "",
      message: "",
    });
  };

  const backToMenu = () => {
    setFlow("menu");
    setStep("menu");
    resetForm();
    addMessage("bot", "Welcome to NEYGE. How can we help you today?");
  };

  const menuOptions = useMemo(() => {
    if (step === "menu") {
      return [
        "Shop Sarees",
        "Video Shopping",
        "Custom / Bulk Enquiry",
        "Talk to Support",
      ];
    }

    if (step === "shop_type") return SHOP_TYPES;

    return [];
  }, [step]);

  const handleMenuClick = (label: string) => {
    addMessage("user", label);

    if (label === "Shop Sarees") {
      setFlow("shop_sarees");
      setStep("shop_type");
      addMessage("bot", "What type of saree are you looking for?");
      return;
    }

    if (label === "Video Shopping") {
      setFlow("video_shopping");
      setStep("video_menu");
      addMessage(
        "bot",
        "Experience saree shopping from home with NEYGE video shopping. Our team can show you sarees live and help you choose based on occasion, color, fabric, and budget."
      );
      return;
    }

    if (label === "Custom / Bulk Enquiry") {
      setFlow("custom_bulk");
      setStep("form");
      addMessage("bot", "Please select your enquiry type.");
      return;
    }

    if (label === "Talk to Support") {
      setFlow("support");
      setStep("form");
      addMessage(
        "bot",
        "Please choose what you need help with, or share your details and our team will contact you shortly."
      );
      return;
    }

    if (SHOP_TYPES.includes(label)) {
      updateForm("saree_type", label);
      setStep("shop_help");
      addMessage(
        "bot",
        `Great choice. You can explore our curated ${label.toLowerCase()} collection here.`
      );
      addMessage("bot", "Would you like help choosing a saree?");
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.phone.trim()) return "Phone / WhatsApp number is required";

    if (flow === "video_shopping") {
      if (!form.preferred_date) return "Preferred date is required";
      if (!form.preferred_time) return "Preferred time is required";
    }

    if (flow === "custom_bulk") {
      if (!form.requirement_type) return "Requirement type is required";
      if (!form.city.trim()) return "City is required";
      if (!form.approx_quantity.trim()) return "Approx quantity is required";
    }

    return null;
  };

  const submitLead = async () => {
    const error = validateForm();

    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        source: "chatbot",
        flow,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        city: form.city.trim() || undefined,
        occasion: form.occasion.trim() || undefined,
        budget: form.budget.trim() || undefined,
        saree_type: form.saree_type || undefined,
        preferred_date: form.preferred_date || undefined,
        preferred_time: form.preferred_time || undefined,
        requirement_type: form.requirement_type || undefined,
        approx_quantity: form.approx_quantity.trim() || undefined,
        message: form.message.trim() || undefined,
      };

      await createChatbotLead(payload);

      addMessage("user", `${form.name} - ${form.phone}`);
      addMessage(
        "bot",
        flow === "support"
          ? "Thank you. Our NEYGE support team will contact you soon."
          : "Thank you. Your details are saved. Our NEYGE team will contact you shortly."
      );

      toast.success("Details submitted successfully");
      setStep("done");
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Could not submit details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showForm = step === "form";

  return (
    <>
      <style>{CSS}</style>
      {/* WhatsApp Float Button — only when chat is closed */}
      {!open && (
        <a
          className="neyge-wa-float"
          href="https://wa.me/919113991711?text=Hi%20Neyge%20Couture%2C%20I%20am%20interested%20in%20your%20saree%20collection."
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
        >
          {WA_ICON}
        </a>
      )}

      {open && (
    <section className="neyge-chatbot-panel">
      <header className="neyge-chatbot-header">
        <div className="neyge-chatbot-title">
          {flow !== "menu" && (
            <button className="neyge-icon-btn" onClick={backToMenu}>
              <ArrowLeft size={18} />
            </button>
          )}

          <div>
            <strong>NEYGE Chat</strong>
            <small>Premium saree concierge</small>
          </div>
        </div>

        <button className="neyge-icon-btn" onClick={() => setOpen(false)}>
          <X size={21} />
        </button>
      </header>

      <main className="neyge-chatbot-body">
        {messages.map((msg) => (
          <div key={msg.id} className={`neyge-msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}

        {menuOptions.length > 0 && (
          <div className="neyge-options">
            {menuOptions.map((item) => (
              <button
                key={item}
                className="neyge-chip"
                onClick={() => handleMenuClick(item)}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {step === "shop_help" && (
          <div className="neyge-options">
            <a
              className="neyge-chip"
              href={`/shop?search=${encodeURIComponent(form.saree_type)}`}
            >
              View Collection
            </a>

            <button
              className="neyge-chip"
              onClick={() => {
                addMessage("user", "Yes, contact me");
                setStep("form");
                addMessage("bot", "Sure. Please share your details below.");
              }}
            >
              Yes, contact me
            </button>

            <button
              className="neyge-chip"
              onClick={() => {
                addMessage("user", "No, I will browse");
                addMessage(
                  "bot",
                  "Perfect. Enjoy exploring NEYGE collections 🌸"
                );
                setStep("done");
              }}
            >
              No, I will browse
            </button>
          </div>
        )}

        {flow === "video_shopping" && step === "video_menu" && (
          <div className="neyge-options">
            <button
              className="neyge-chip"
              onClick={() => {
                addMessage("user", "Book Video Shopping");
                setStep("form");
                addMessage(
                  "bot",
                  "Please share your details to book your video shopping session."
                );
              }}
            >
              Book Video Shopping
            </button>

            <button
              className="neyge-chip"
              onClick={() =>
                addMessage(
                  "bot",
                  "How it works: Our team connects on video call, shows sarees live, understands your occasion, color, fabric and budget, then helps you shortlist the best options."
                )
              }
            >
              How It Works
            </button>

            <button
              className="neyge-chip"
              onClick={() =>
                addMessage(
                  "bot",
                  `Available slots: ${TIME_SLOTS.join(", ")}`
                )
              }
            >
              Available Time Slots
            </button>
          </div>
        )}

        {flow === "support" && step === "form" && (
          <div className="neyge-options">
            <button
              className="neyge-chip"
              onClick={() =>
                addMessage(
                  "bot",
                  "Order help: Please share your order ID or registered phone number in the message box. Our team will check and contact you shortly."
                )
              }
            >
              Order Question
            </button>

            <button
              className="neyge-chip"
              onClick={() =>
                addMessage(
                  "bot",
                  "Shipping info: Delivery time depends on your location, product availability, and order confirmation. Please share your city or order ID for accurate details."
                )
              }
            >
              Shipping Info
            </button>

            <button
              className="neyge-chip"
              onClick={() =>
                addMessage(
                  "bot",
                  "Return policy: Return eligibility depends on product condition, order type, and NEYGE return policy. Please share your order details so our team can assist."
                )
              }
            >
              Return Policy
            </button>

            <button
              className="neyge-chip"
              onClick={() =>
                addMessage(
                  "bot",
                  "Product help: Our team can help you choose sarees based on occasion, fabric, color, budget, and availability."
                )
              }
            >
              Product Question
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="neyge-options">
            <button className="neyge-chip" onClick={backToMenu}>
              Start New Enquiry
            </button>

            <a
              className="neyge-whatsapp"
              href="https://wa.me/919113991711"
              target="_blank"
              rel="noreferrer"
            >
              <Phone size={14} />
              Talk on WhatsApp
            </a>
          </div>
        )}
      </main>

      {showForm && (
        <footer className="neyge-form">
          <input
            className="neyge-input"
            placeholder="Name *"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
          />

          <input
            className="neyge-input"
            placeholder="Phone / WhatsApp *"
            value={form.phone}
            onChange={(e) => updateForm("phone", e.target.value)}
          />

          {flow === "support" && (
            <input
              className="neyge-input"
              placeholder="Email optional"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
            />
          )}

          {(flow === "shop_sarees" || flow === "video_shopping") && (
            <>
              <input
                className="neyge-input"
                placeholder="Occasion"
                value={form.occasion}
                onChange={(e) => updateForm("occasion", e.target.value)}
              />

              <input
                className="neyge-input"
                placeholder="Budget"
                value={form.budget}
                onChange={(e) => updateForm("budget", e.target.value)}
              />

              {flow === "video_shopping" && (
                <>
                  <select
                    className="neyge-select"
                    value={form.saree_type}
                    onChange={(e) =>
                      updateForm("saree_type", e.target.value)
                    }
                  >
                    <option value="">Preferred saree type</option>
                    {SHOP_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <input
                    className="neyge-input"
                    type="date"
                    min={todayISO()}
                    value={form.preferred_date}
                    onChange={(e) =>
                      updateForm("preferred_date", e.target.value)
                    }
                  />

                  <select
                    className="neyge-select"
                    value={form.preferred_time}
                    onChange={(e) =>
                      updateForm("preferred_time", e.target.value)
                    }
                  >
                    <option value="">Preferred time *</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </>
          )}

          {flow === "custom_bulk" && (
            <>
              <select
                className="neyge-select"
                value={form.requirement_type}
                onChange={(e) =>
                  updateForm("requirement_type", e.target.value)
                }
              >
                <option value="">Requirement type *</option>
                {REQUIREMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <input
                className="neyge-input"
                placeholder="City *"
                value={form.city}
                onChange={(e) => updateForm("city", e.target.value)}
              />

              <input
                className="neyge-input"
                placeholder="Approx quantity *"
                value={form.approx_quantity}
                onChange={(e) =>
                  updateForm("approx_quantity", e.target.value)
                }
              />

              <input
                className="neyge-input"
                placeholder="Budget range"
                value={form.budget}
                onChange={(e) => updateForm("budget", e.target.value)}
              />
            </>
          )}

          <textarea
            className="neyge-textarea"
            rows={3}
            placeholder={
              flow === "support"
                ? "Message / Order ID / Question"
                : "Message"
            }
            value={form.message}
            onChange={(e) => updateForm("message", e.target.value)}
          />

          <button
            className="neyge-submit"
            disabled={loading}
            onClick={submitLead}
          >
            {loading ? "Submitting..." : "Submit Enquiry"}
            {!loading && <Send size={16} />}
          </button>
        </footer>
      )}
    </section>
  )
}

<button className="neyge-chatbot-launcher" onClick={() => setOpen(true)}>
  <MessageCircle size={20} />
  Need help?
  <Sparkles size={16} />
</button>
    </>
  );
}