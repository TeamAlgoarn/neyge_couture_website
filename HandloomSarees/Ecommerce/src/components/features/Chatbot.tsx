import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, RotateCcw, Minus } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

// ── Knowledge Base ─────────────────────────────────────────────────────────────
const KNOWLEDGE_BASE: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'hii', 'helo', 'greet', 'good morning', 'good evening', 'good afternoon'],
    reply:
      "Namaste! 🙏 Welcome to HandloomSarees — India's finest handwoven collection.\n\nI'm Priya, your personal saree guide. I can help you with:\n• 🧵 Saree collections & styles\n• 💰 Pricing & offers\n• 🚚 Shipping & delivery\n• ↩️ Returns & exchanges\n• 🪡 Artisan stories\n\nWhat would you like to explore today?",
  },
  {
    keywords: ['kanchipuram', 'kanchi', 'kanjivaram', 'pattu', 'tamil'],
    reply:
      "✨ Kanchipuram Silk Sarees\n\nHandwoven in Tamil Nadu by 5th-generation master weavers using:\n• 🧵 Pure mulberry silk threads\n• ✨ Real gold & silver zari borders\n• 🎨 Rich temple & peacock motifs\n\n💰 Price Range: ₹8,500 – ₹75,000\n⏱️ Weaving Time: 10–45 days per saree\n🚚 Delivery: 5–7 business days\n\n🌟 These are heirloom pieces passed across generations.\n\nWant to see specific colors or occasions?",
  },
  {
    keywords: ['banarasi', 'banaras', 'varanasi', 'brocade', 'uttar pradesh'],
    reply:
      "🌟 Banarasi Silk Sarees\n\nCrafted in the holy city of Varanasi with:\n• 🥇 Pure silk or georgette base\n• 🔱 Intricate gold/silver brocade work\n• 🌸 Mughal-inspired floral & leaf motifs\n\n💰 Price Range: ₹6,000 – ₹65,000\n⏱️ Weaving Time: 15–30 days\n🎁 Most popular choice for weddings & festivals\n\nTypes available:\nKataan · Organza · Georgette · Shattir\n\nShall I help you pick one for a specific occasion?",
  },
  {
    keywords: ['chanderi', 'maheshwari', 'madhya pradesh', 'lightweight', 'cotton silk'],
    reply:
      "🌸 Chanderi & Maheshwari Sarees\n\nPerfect for summer & daily elegance:\n• 🌿 Sheer, featherlight fabric\n• 🎨 Subtle coin, floral & geometric motifs\n• 💎 Cotton-silk & pure silk variants\n\n💰 Price Range: ₹2,800 – ₹18,000\n📍 Woven in Madhya Pradesh — a GI-tagged craft\n\nGreat for office, casual outings & daytime events!\nWant help choosing between Chanderi or Maheshwari?",
  },
  {
    keywords: ['pochampally', 'ikat', 'telangana', 'tie dye', 'geometric'],
    reply:
      "🔷 Pochampally Ikat Sarees\n\nA UNESCO-recognised weaving art from Telangana:\n• 🎨 Tie-dye threads woven into geometric patterns\n• 🌈 Bold colours with natural dyes\n• 🧵 Cotton & silk variants\n\n💰 Price Range: ₹3,500 – ₹22,000\n✅ GI-tagged authentic weave\n\nWould you like cotton or silk ikat?",
  },
  {
    keywords: ['paithani', 'maharashtra', 'peacock', 'tapestry'],
    reply:
      "🦚 Paithani Sarees\n\nThe pride of Maharashtra, handwoven in Paithan:\n• 🦚 Iconic peacock & parrot motifs\n• 🥇 Pure silk with gold zari pallu\n• ⏱️ Takes 6 months to 2 years for a single saree!\n\n💰 Price Range: ₹15,000 – ₹1,50,000\n🎁 Traditionally gifted at weddings & celebrations\n\nA true collector's treasure. Shall I share more?",
  },
  {
    keywords: ['price', 'cost', 'how much', 'rate', 'budget', 'afford', 'cheap', 'expensive', 'range'],
    reply:
      "💰 Our Price Ranges\n\nHandloom Cotton:  ₹1,800 – ₹6,000\nChanderi / Maheshwari:  ₹2,800 – ₹18,000\nPochampally Ikat:  ₹3,500 – ₹22,000\nBanarasi Silk:  ₹6,000 – ₹65,000\nKanchipuram Silk:  ₹8,500 – ₹75,000\nPaithani:  ₹15,000 – ₹1,50,000\n\n💳 EMI available on orders above ₹5,000\n🎁 Special discounts during festivals!\n\nWhat's your budget? I'll find you the perfect match! 😊",
  },
  {
    keywords: ['shipping', 'delivery', 'dispatch', 'courier', 'track', 'when will', 'how long', 'arrive', 'days'],
    reply:
      "🚚 Shipping & Delivery\n\n✅ Free shipping on orders above ₹3,000\n⚡ Express delivery (2–3 days): ₹149\n📦 Standard delivery (5–7 days): Free / ₹99\n🌍 International shipping: 25+ countries, 10–14 days\n\nHow to track your order:\n1. Visit My Orders in your account\n2. Or enter Order ID on our Track page\n3. SMS/email updates sent automatically\n\nAll orders are carefully packed in premium gift boxes. 🎁",
  },
  {
    keywords: ['return', 'refund', 'exchange', 'replace', 'cancel', 'wrong', 'damaged', 'defect'],
    reply:
      "↩️ Returns & Refund Policy\n\n✅ 7-day hassle-free returns\n✅ Free return pickup (metros & tier-1 cities)\n✅ Refund in 5–7 business days\n\nEasy steps:\n1. Log in → My Orders → Request Return\n2. Pack in original packaging\n3. Our courier picks it up free!\n\n❌ Custom-stitched blouses are non-returnable\n💡 Damaged or wrong items? We'll replace immediately, no questions asked.\n\nNeed to raise a return right now?",
  },
  {
    keywords: ['care', 'wash', 'clean', 'maintain', 'store', 'preserve', 'iron', 'dry'],
    reply:
      "🧺 Saree Care Guide\n\nSilk Sarees:\n• Dry-clean only — avoid machine wash\n• Store in muslin cloth, never plastic\n• Keep camphor balls to avoid insects\n• Iron on reverse at low heat\n\nCotton Sarees:\n• Gentle hand-wash in cold water\n• Use mild detergent — no bleach\n• Dry in shade, not direct sunlight\n\nZari / Embroidery:\n• Wrap zari borders in tissue paper\n• Fold differently each time to avoid crease lines\n\n💛 Proper care keeps a saree beautiful for 50+ years!",
  },
  {
    keywords: ['custom', 'customise', 'customize', 'blouse', 'stitching', 'tailoring', 'stitch', 'fall', 'pico'],
    reply:
      "✂️ Customization Services\n\n🪡 Blouse Stitching: ₹499 – ₹2,500\n🎨 Custom Colors (select weaves): +7–10 days\n🔖 Personalized Gift Wrapping: ₹99\n✍️ Handwritten Gift Note: Free\n\nBlouse styles available:\nSleeveless · Short sleeve · Elbow · Full sleeve · Boat neck · Deep back\n\n⏱️ Allow 7–10 extra days for custom orders.\n📐 Please share your measurements via our size guide for best results!\n\nShall I guide you through the customization process?",
  },
  {
    keywords: ['artisan', 'weaver', 'craft', 'heritage', 'traditional', 'handmade', 'handwoven', 'story', 'who makes'],
    reply:
      "🪡 Our Artisan Community\n\n✅ 500+ artisan families across India\n✅ 15+ states represented\n✅ 50+ distinct weaving techniques preserved\n\n🤝 We pay 25–40% above market rate to ensure fair wages\n📚 We fund children's education in weaver communities\n🌱 Zero middlemen — direct from loom to you\n\nWhere our weavers are from:\nKanchipuram · Varanasi · Pochampally · Paithan · Kutch · Bhagalpur · Sualkuchi\n\n💛 Every purchase directly supports a family.\nRead their stories on our Artisan Stories page!",
  },
  {
    keywords: ['gift', 'gifting', 'occasion', 'wedding', 'festival', 'diwali', 'puja', 'birthday', 'anniversary', 'bridal', 'trousseau'],
    reply:
      "🎁 Gifting & Occasions\n\nPopular gifting categories:\n• 👰 Bridal Trousseau Sets\n• 🪔 Festival Curated Collections\n• 💍 Anniversary & Special Occasion Picks\n• 🎂 Birthday Gifting Hampers\n\nGift extras:\n✅ Luxury gift box packaging (free on ₹5,000+)\n✅ Handwritten personalised note (free)\n✅ Express gift delivery available\n✅ Corporate bulk gifting with branding\n\n🌸 A HandloomSarees gift is a gift of heritage.\n\nWant help choosing for a specific occasion?",
  },
  {
    keywords: ['payment', 'pay', 'upi', 'cod', 'credit', 'debit', 'net banking', 'emi', 'paypal', 'gpay', 'phonepe'],
    reply:
      "💳 Payment Options\n\n✅ UPI (GPay, PhonePe, Paytm)\n✅ Credit / Debit Cards (Visa, Mastercard, RuPay)\n✅ Net Banking (all major banks)\n✅ Cash on Delivery (orders under ₹10,000)\n✅ PayPal (international)\n✅ EMI (orders ₹5,000+) — HDFC, ICICI, Axis\n\n🔒 100% Secure Payments via Razorpay & SSL encryption\n\nAny payment issue? We're here to help!",
  },
  {
    keywords: ['size', 'length', 'measurement', 'how big', 'yards', 'metre', 'meter'],
    reply:
      "📏 Saree Sizes Guide\n\nStandard Saree:  5.5 metres\nWith blouse piece:  +0.8 metres\nNauvari (Maharashtra):  9 yards\nKasavu (Kerala):  6–6.5 metres\nHalf saree:  3.5 metres\n\n💡 Blouse piece is included in most of our sarees\n💡 Width is standard 45–47 inches for most weaves\n\nNeed help with blouse measurements? I can guide you!",
  },
  {
    keywords: ['offer', 'discount', 'coupon', 'deal', 'sale', 'promo', 'code', 'cashback', 'free'],
    reply:
      "🎉 Current Offers & Deals\n\n🏷️ NEWUSER10 — 10% off first order\n🏷️ HERITAGE5 — ₹500 off on ₹5,000+\n🏷️ SILKLOVE — Free blouse stitching on silk sarees\n\nAlways active:\n✅ Free shipping above ₹3,000\n✅ Free gift wrapping on ₹5,000+\n✅ Extra 5% off on app orders\n\n🪔 Festival season sales coming soon — follow us for alerts!\n\nWant me to suggest the best offer for your cart?",
  },
  {
    keywords: ['contact', 'support', 'help', 'human', 'agent', 'talk to', 'connect', 'call', 'email', 'whatsapp'],
    reply:
      "📞 Contact Our Team\n\n📧 Email: support@handloomsarees.com\n📱 WhatsApp: +91 98765 43210\n☎️ Phone: +91 80-1234-5678\n\n🕐 Working Hours:\nMon – Sat · 9 AM – 7 PM IST\nSunday · 10 AM – 5 PM IST\n\n⚡ WhatsApp is our fastest channel — avg reply in 10 mins!\n\nWould you like me to escalate this to a live agent right now?",
  },
  {
    keywords: ['about', 'who are you', 'your company', 'handloom sarees', 'founded', 'history'],
    reply:
      "🏛️ About HandloomSarees\n\nWe are India's most trusted platform for authentic, ethically-sourced handwoven sarees — bridging artisans and saree lovers across the world.\n\n📅 Founded: 2016\n📍 Headquarters: Bengaluru, India\n🌍 Ships to: 25+ countries\n🪡 Artisan Partners: 500+ families\n⭐ Rating: 4.8/5 (12,000+ reviews)\n\n🌱 Our mission: Preserve India's weaving heritage while empowering artisan families.\n\nProud to be a certified Fair Trade partner!",
  },
];

const GENERAL_RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['weather', 'rain', 'sunny', 'temperature', 'climate', 'forecast'],
    reply:
      "☀️ Ha! I wish I could check the weather — but that's a bit outside my expertise as a saree guide! 😄\n\nFor weather updates, try Google Weather or your phone's weather app.\n\nBut while we're chatting — a lightweight Chanderi or Georgette saree is perfect for warm days! Want to explore some? 🌸",
  },
  {
    keywords: ['recipe', 'food', 'cook', 'eat', 'restaurant', 'hungry', 'pizza', 'biryani'],
    reply:
      "🍽️ I'm more of a saree expert than a chef, I'm afraid! 😄\n\nFor food & recipes, Zomato or Swiggy will serve you better!\n\nFun fact — many of our sarees are inspired by food colours! Our saffron Banarasi and turmeric Chanderi are absolute favourites. Fancy a look? 💛",
  },
  {
    keywords: ['movie', 'film', 'netflix', 'show', 'web series', 'bollywood', 'ott', 'cinema'],
    reply:
      "🎬 Movies are not quite my domain — I live in the world of silk and zari! 😊\n\nHave you noticed how sarees steal the show in every Bollywood film? Our Kanchipuram silks are very popular for bridal looks!\n\nCan I help you find a saree as glamorous as your favourite star? ✨",
  },
  {
    keywords: ['cricket', 'football', 'sport', 'ipl', 'match', 'score', 'game', 'fifa'],
    reply:
      "🏏 Sports scores are a bit beyond my weaving knowledge! 😄 Try ESPN or CricBuzz for live scores.\n\nBut here's a fun connection — our Pochampally Ikat sarees are as popular in Hyderabad as the IPL! Want to explore? 🔷",
  },
  {
    keywords: ['joke', 'funny', 'laugh', 'humor', 'comedy', 'tell me a joke'],
    reply:
      "😄 Okay, here's one:\n\nWhy did the saree refuse to be ironed?\nBecause it didn't want to lose its drape! 🥁\n\nAlright, I'm clearly better at sarees than comedy! 😂 Can I help you find a beautiful one today?",
  },
  {
    keywords: ['who are you', 'what are you', 'are you ai', 'are you a robot', 'are you human', 'are you bot', 'bot or human'],
    reply:
      "🤖 Great question! I'm Priya, an AI-powered saree guide created for HandloomSarees.\n\nI'm not a human, but I'm trained with deep knowledge about Indian handloom weaves, artisan crafts, our entire collection, and store policies.\n\nFor complex issues, I can connect you to a real human agent anytime! 😊\n\nNow, shall we find you the perfect saree? 🧵",
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'tq', 'ty', 'great', 'helpful', 'awesome', 'amazing', 'love it', 'perfect'],
    reply:
      "🙏 You're so welcome! It's my pleasure to help.\n\nIs there anything else I can assist you with — collections, offers, care tips, or anything else?\n\nHappy saree shopping! 🌸✨",
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'take care', 'cya', 'later', 'ok bye'],
    reply:
      "👋 Thank you for visiting HandloomSarees!\n\nWishing you a wonderful day ahead. Come back anytime — our looms are always weaving something beautiful for you! 🧵💛\n\nNamaste! 🙏",
  },
];

const FALLBACK_REPLIES = [
  "🤔 Hmm, that's a bit outside my saree expertise! But I'd love to help with anything about our collections, shipping, returns, pricing, or artisans.\n\nFor other queries, our team is just a WhatsApp away:\n📱 +91 98765 43210 😊",
  "I'm still learning new things every day! For this specific question, our support team at support@handloomsarees.com will be much better placed to help.\n\nIn the meantime, can I tell you about our latest collection? 🌸",
  "That's interesting — I'm primarily trained as a saree guide, so I might not be the best for that! 😊\n\nBut if you have questions about our handloom sarees, artisans, delivery, or returns — I'm all yours! 🧵\n\nType 'hi' to see all that I can help with.",
];

const QUICK_PROMPTS = [
  { label: '🛍️ Our Collections', msg: 'What sarees do you have?' },
  { label: '💰 Pricing', msg: 'What are your price ranges?' },
  { label: '🚚 Shipping Info', msg: 'Tell me about shipping and delivery' },
  { label: '↩️ Return Policy', msg: 'What is your return policy?' },
  { label: '🎁 Gifting Options', msg: 'Tell me about gifting options' },
  { label: '🪡 Our Artisans', msg: 'Tell me about your artisans' },
];

function getBotReply(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const entry of [...KNOWLEDGE_BASE, ...GENERAL_RESPONSES]) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry.reply;
  }
  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#800020]/50 animate-bounce"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  );
}

function ChatMessage({ msg }: { msg: Message }) {
  const isBot = msg.role === 'bot';
  const time = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`flex gap-2 ${isBot ? 'items-end' : 'items-end flex-row-reverse'}`}>
      {isBot ? (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#800020] to-[#4B0082] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#800020]">
          U
        </div>
      )}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
            isBot
              ? 'bg-white text-gray-700 border border-[#D4AF37]/20 rounded-2xl rounded-bl-sm'
              : 'bg-gradient-to-br from-[#800020] to-[#4B0082] text-white rounded-2xl rounded-br-sm'
          }`}
        >
          {msg.text}
        </div>
        <span className="text-[10px] text-gray-400 px-1">{time}</span>
      </div>
    </div>
  );
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'bot',
      text: "Namaste! 🙏 I'm Priya, your HandloomSarees guide.\n\nI can help you with our collections, pricing, shipping, returns, care tips & more. Use the quick options below or just type your question!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setIsMinimized(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setShowPrompts(false);
    const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const reply = getBotReply(text);
      const botMsg: Message = { id: Date.now() + 1, role: 'bot', text: reply, timestamp: new Date() };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
      if (!isOpen) setUnread((n) => n + 1);
    }, 800 + Math.random() * 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const resetChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'bot',
        text: "Chat reset! 😊 How can I help you today?\n\nFeel free to ask about our sarees, shipping, returns, or anything else!",
        timestamp: new Date(),
      },
    ]);
    setShowPrompts(true);
    setInput('');
  };

  return (
    <>
      {/* ── Floating Action Button ─────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#800020] to-[#4B0082] text-white shadow-2xl shadow-[#800020]/50 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center"
      >
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </div>
        {!isOpen && unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#D4AF37] text-[#800020] rounded-full text-[10px] font-bold flex items-center justify-center shadow">
            {unread}
          </span>
        )}
      </button>

      {/* ── Chat Window ────────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-[#800020]/25 border border-[#D4AF37]/25 bg-white transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{ width: '370px', maxWidth: 'calc(100vw - 2rem)' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#800020] to-[#4B0082] px-4 py-3.5 flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#4B0082]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-none">Priya</p>
            <p className="text-[#D4AF37]/80 text-[11px] mt-0.5">HandloomSarees AI Guide · Online</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={resetChat}
              title="Reset chat"
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized((v) => !v)}
              title="Minimise"
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              title="Close"
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div
              className="overflow-y-auto bg-gradient-to-b from-[#FDF8F3] to-[#FAF3EC] px-4 py-4 space-y-4"
              style={{ height: '340px' }}
            >
              {messages.map((msg) => (
                <ChatMessage key={msg.id} msg={msg} />
              ))}
              {isTyping && (
                <div className="flex gap-2 items-end">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#800020] to-[#4B0082] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <div className="bg-white border border-[#D4AF37]/20 rounded-2xl rounded-bl-sm shadow-sm">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts — 2-column grid, never overflows */}
            {showPrompts && (
              <div className="bg-[#FDF8F3] border-t border-[#D4AF37]/15 px-3 py-3 flex-shrink-0">
                <p className="text-[11px] text-gray-400 font-medium mb-2 px-0.5 uppercase tracking-wide">
                  Quick options
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p.msg}
                      onClick={() => sendMessage(p.msg)}
                      className="text-[11px] px-3 py-2 rounded-xl border border-[#800020]/20 bg-white text-[#800020] hover:bg-[#800020]/5 hover:border-[#800020]/40 active:scale-95 transition-all duration-150 text-left font-medium leading-tight shadow-sm"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={handleSubmit}
              className="bg-white border-t border-[#D4AF37]/20 px-3 py-3 flex items-center gap-2 flex-shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1 min-w-0 text-sm bg-[#FDF8F3] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 outline-none focus:border-[#800020]/50 focus:ring-2 focus:ring-[#800020]/10 text-gray-700 placeholder:text-gray-400 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#800020] to-[#4B0082] flex items-center justify-center text-white disabled:opacity-35 hover:opacity-90 hover:scale-105 active:scale-95 transition-all flex-shrink-0 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Footer */}
            <div className="bg-white border-t border-gray-100 py-1.5 text-center flex-shrink-0">
              <p className="text-[10px] text-gray-400">Powered by HandloomSarees AI · 🔒 Secure</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}