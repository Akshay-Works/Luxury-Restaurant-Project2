import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SocialCards from "../components/ui/card-fan-carousel";

// ─── smooth scroll helper (used by nav, footer, hero) ───────────
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// ═══════════════════════════════════════════════════════════════
// IMAGES
// ═══════════════════════════════════════════════════════════════
const IMG_TROPICAL   = "/gallery/interior-tropical.jpg";
const IMG_INDUSTRIAL = "/gallery/interior-industrial.jpg";
const IMG_TREE       = "/gallery/interior-tree.jpg";
const IMG_SPICED     = "/gallery/dish-spiced.jpg";
const IMG_SPREAD     = "/gallery/dish-spread.jpg";
const IMG_TAPAS      = "/gallery/dish-tapas.jpg";

const GALLERY_CARDS = [
  { imgUrl: IMG_TROPICAL,   alt: "The Dining Room" },
  { imgUrl: IMG_INDUSTRIAL, alt: "The Bar Lounge" },
  { imgUrl: IMG_TREE,       alt: "The Garden Room" },
  { imgUrl: IMG_SPREAD,     alt: "Signature Sharing" },
  { imgUrl: IMG_TAPAS,      alt: "Mezze & Fine Wine" },
  { imgUrl: IMG_SPICED,     alt: "Chef's Selection" },
];

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════
const BOKEH = [
  { id: 0, w: 280, top: "8%",  left: "3%",  dur: 13, d: 0   },
  { id: 1, w: 180, top: "58%", left: "80%", dur: 11, d: 2   },
  { id: 2, w: 130, top: "28%", left: "68%", dur: 9,  d: 1   },
  { id: 3, w: 360, top: "72%", left: "15%", dur: 16, d: 3   },
  { id: 4, w: 90,  top: "42%", left: "45%", dur: 8,  d: 1.5 },
  { id: 5, w: 220, top: "82%", left: "58%", dur: 12, d: 0.5 },
  { id: 6, w: 65,  top: "12%", left: "88%", dur: 7,  d: 2.5 },
  { id: 7, w: 155, top: "3%",  left: "52%", dur: 10, d: 1   },
];

const MENU = {
  "Entrée": [
    { name: "Foie Gras Terrine",   desc: "Hudson Valley foie gras, Sauternes gelée, brioche toast, fresh micro herbs",       price: "₹3,200",  badge: "Chef's Choice" },
    { name: "Hokkaido Scallop",    desc: "Pan-seared with truffle butter, cauliflower purée, Osetra caviar, chervil oil",     price: "₹4,100",  badge: "" },
    { name: "Garden Crudités",     desc: "Burrata, roasted heirloom beetroot, hazelnut vinaigrette, edible flowers",          price: "₹2,400",  badge: "Vegetarian" },
  ],
  "Main": [
    { name: "Wagyu A5 Tenderloin", desc: "Japanese A5 wagyu, bone marrow jus, pommes fondant, seasonal field leaves",         price: "₹12,800", badge: "Signature" },
    { name: "Dover Sole Meunière", desc: "Whole Dover sole, capers, lemon beurre noisette, green asparagus, golden roe",      price: "₹8,500",  badge: "" },
    { name: "Mushroom Wellington", desc: "Wild mushroom duxelles en croûte, black truffle sauce, roasted root vegetables",    price: "₹5,600",  badge: "Vegetarian" },
  ],
  "Dessert": [
    { name: "Valrhona Soufflé",         desc: "Dark chocolate soufflé, warm vanilla crème anglaise, edible 24k gold leaf",    price: "₹1,800",  badge: "Signature" },
    { name: "Strawberry Mille-feuille", desc: "Caramelised puff pastry, Chantilly cream, fresh strawberries, rose water jelly",price: "₹1,500", badge: "" },
    { name: "Tarte Tatin",              desc: "Caramelised heirloom apple, crème fraîche, calvados ice cream, praline crumb", price: "₹1,600",  badge: "" },
  ],
};

// avatar: Unsplash headshots matching each reviewer's profile
const TESTIMONIALS = [
  {
    text: "An unparalleled dining experience that transcends the ordinary. Every dish tells a story of meticulous craftsmanship. Aurum has redefined what fine dining means in India.",
    name: "Priya Mehta",
    role: "Senior Food Critic, Times of India",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80",
  },
  {
    text: "We celebrate every milestone at Aurum. The service is impeccable, the ambiance divine, the cuisine — extraordinary. It is the only address that never disappoints.",
    name: "Rajan Khosla",
    role: "Chairman, Citadel Group",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80",
  },
  {
    text: "Aurum stands as a testament to what Indian fine dining can achieve on the global stage. Chef Kapoor's dedication to craft is evident in every single bite.",
    name: "Isabelle Fontaine",
    role: "Michelin Guide Contributor",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80",
  },
];

const AWARDS = [
  "☆  One Michelin Star · 2023",
  "☆  Best Fine Dining India — Condé Nast Traveller · 2024",
  "☆  Chef of the Year — India Food Awards · 2023",
  "☆  Asia's 50 Best Restaurants · 2022",
  "☆  Outstanding Wine Programme — World Restaurant Awards",
  "☆  Best Ambiance — Food & Wine India · 2024",
];

const TIMES = ["7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM","10:30 PM"];

// ═══════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════
const CSS = `
  :root {
    --gold:#C4A259; --gold-l:#E8D5A0; --gold-d:rgba(196,162,89,0.1);
    --bg:#0C0B08; --bg2:#111009; --card:#141210; --card2:#1B1916;
    --cream:#F0EBE3; --text:#CCC4B5; --muted:#7D6E5E;
    --border:#252017; --bord-l:rgba(196,162,89,0.2);
  }
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body { background:var(--bg); color:var(--text); font-family:'Cormorant Garamond',Georgia,serif; overflow-x:hidden; }
  button { background:none; border:none; cursor:pointer; font:inherit; }
  input,select,textarea { font:inherit; }
  .fd { font-family:'Playfair Display',Georgia,serif; }
  .fs { font-family:'Inter',system-ui,sans-serif; }
  .eyebrow { font-family:'Inter',system-ui,sans-serif; font-size:11px; font-weight:500; letter-spacing:.3em; text-transform:uppercase; color:var(--gold); display:block; margin-bottom:20px; }
  .divider  { height:1px; border:none; background:linear-gradient(90deg,transparent,var(--gold) 40%,var(--gold) 60%,transparent); }

  /* NAV */
  .nav { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:0 56px; height:88px; transition:all .45s cubic-bezier(.4,0,.2,1); }
  .nav.s { height:70px; background:rgba(12,11,8,.93); backdrop-filter:blur(24px); border-bottom:1px solid rgba(196,162,89,.12); }
  @media(max-width:900px){ .nav{padding:0 24px;} .nav-links{display:none!important;} }
  .nav-link { font-family:'Inter',system-ui,sans-serif; font-size:11px; font-weight:500; letter-spacing:.18em; text-transform:uppercase; color:rgba(240,235,227,.65); transition:color .2s; }
  .nav-link:hover { color:var(--gold); }

  /* BUTTONS */
  .btn { font-family:'Inter',system-ui,sans-serif; font-size:11px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; padding:13px 30px; transition:all .3s cubic-bezier(.4,0,.2,1); display:inline-flex; align-items:center; gap:8px; }
  .btn-p { background:var(--gold); color:var(--bg); }
  .btn-p:hover { background:var(--gold-l); transform:translateY(-2px); box-shadow:0 10px 36px rgba(196,162,89,.22); }
  .btn-g { background:transparent; color:var(--gold); border:1px solid var(--gold); }
  .btn-g:hover { background:var(--gold-d); transform:translateY(-2px); }

  /* KEYFRAMES */
  @keyframes drift    { 0%,100%{transform:translate(0,0);opacity:.15;} 33%{transform:translate(18px,-22px);opacity:.3;} 66%{transform:translate(-12px,10px);opacity:.18;} }
  @keyframes shimmer  { from{background-position:200% center;} to{background-position:-200% center;} }
  @keyframes scroll-b { 0%,100%{transform:translateY(0);} 50%{transform:translateY(7px);} }
  @keyframes marquee  { from{transform:translateX(0);} to{transform:translateX(-50%);} }
  @keyframes pg       { 0%,100%{opacity:.3;transform:scale(1);} 50%{opacity:.9;transform:scale(1.3);} }

  .bokeh { position:absolute; border-radius:50%; pointer-events:none; background:radial-gradient(circle,rgba(196,162,89,.9) 0%,transparent 70%); filter:blur(45px); animation:drift var(--dur,10s) ease-in-out infinite; animation-delay:var(--d,0s); }
  .shimmer { background:linear-gradient(90deg,var(--gold) 0%,var(--gold-l) 30%,#FFF9EE 50%,var(--gold-l) 70%,var(--gold) 100%); background-size:200% auto; -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 5s linear infinite; }
  .scroll-ind { animation:scroll-b 2.2s ease-in-out infinite; }

  /* REVEAL */
  .reveal { opacity:0; transform:translateY(26px); transition:opacity .9s cubic-bezier(.4,0,.2,1),transform .9s cubic-bezier(.4,0,.2,1); }
  .reveal.in { opacity:1; transform:translateY(0); }
  .d1{transition-delay:.1s;} .d2{transition-delay:.2s;} .d3{transition-delay:.3s;}
  .d4{transition-delay:.4s;} .d5{transition-delay:.5s;} .d6{transition-delay:.6s;}

  .section { max-width:1280px; margin:0 auto; padding:120px 56px; }
  @media(max-width:768px){ .section{padding:80px 24px;} }

  /* MENU */
  .tab-btn { font-family:'Inter',system-ui,sans-serif; font-size:11px; font-weight:500; letter-spacing:.22em; text-transform:uppercase; padding:10px 28px; border:1px solid var(--border); color:var(--muted); transition:all .3s; }
  .tab-btn:hover { color:var(--cream); border-color:rgba(196,162,89,.35); }
  .tab-btn.active { color:var(--gold); border-color:var(--gold); background:var(--gold-d); }
  .mc { border-left:1px solid var(--gold); padding:24px 28px; background:var(--card); transition:background .3s,transform .3s; position:relative; overflow:hidden; }
  .mc::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(196,162,89,.05) 0%,transparent 60%); opacity:0; transition:opacity .3s; }
  .mc:hover { background:var(--card2); transform:translateX(4px); }
  .mc:hover::before { opacity:1; }

  /* AWARDS */
  .marquee-track { display:flex; animation:marquee 32s linear infinite; white-space:nowrap; }

  /* FORM */
  .form-field { width:100%; background:var(--bg); border:1px solid var(--border); color:var(--cream); font-family:'Cormorant Garamond',Georgia,serif; font-size:17px; padding:14px 16px; outline:none; transition:border-color .25s; -webkit-appearance:none; appearance:none; }
  .form-field:focus { border-color:var(--gold); }
  .form-field::placeholder { color:var(--muted); font-style:italic; }
  .form-field option { background:var(--card); color:var(--cream); }
  .fl { font-family:'Inter',system-ui,sans-serif; font-size:10px; font-weight:500; letter-spacing:.22em; text-transform:uppercase; color:var(--muted); display:block; margin-bottom:8px; }

  /* FOOTER */
  .flink { font-family:'Inter',system-ui,sans-serif; font-size:12px; color:var(--muted); transition:color .2s; text-align:left; padding:0; display:block; margin-bottom:12px; }
  .flink:hover { color:var(--gold); }

  /* RESPONSIVE */
  @media(max-width:900px){
    .story-grid  { grid-template-columns:1fr!important; }
    .testi-grid  { grid-template-columns:1fr!important; }
    .res-grid    { grid-template-columns:1fr!important; }
    .footer-grid { grid-template-columns:1fr 1fr!important; }
    .story-art   { display:none!important; }
  }
  @media(max-width:600px){
    .footer-grid { grid-template-columns:1fr!important; }
    .form-2col   { grid-template-columns:1fr!important; }
    .form-3col   { grid-template-columns:1fr 1fr!important; }
    .hero-btns   { flex-direction:column!important; align-items:center!important; }
  }

  /* ── Login button ── */
  .nav-login-btn { white-space:nowrap; }
  @media(max-width:480px){
    .nav-login-btn  { padding:10px 14px; letter-spacing:.1em; }
    .nav-reserve-btn{ padding:10px 14px; letter-spacing:.1em; }
  }

  /* ── Card fan carousel ── */
  .fan-layout { min-height:38rem; }
  .fan-card {
    position:relative; width:10rem; height:16.5rem;
    border-radius:14px; overflow:hidden; flex-shrink:0;
    box-shadow:0 25px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(196,162,89,0.18);
    transition:box-shadow .3s ease;
  }
  .fan-card:hover { box-shadow:0 35px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(196,162,89,0.45); }
  @media(max-width:1024px){ .fan-layout{min-height:34rem;} .fan-card{width:8.5rem;height:14rem;} }
  @media(max-width:768px) { .fan-layout{min-height:28rem;} .fan-card{width:7rem;  height:11.5rem;} }
  @media(max-width:640px) { .fan-layout{min-height:26rem;} .fan-card{width:6rem;  height:10rem;} }
  @media(max-width:480px) { .fan-layout{min-height:22rem;} .fan-card{width:5rem;  height:8.3rem;} }

  /* ── Testimonials interactive selector (testimonials.tsx style) ── */
  .testi-quote-wrap { position:relative; padding:0 2.5rem; max-width:780px; margin:0 auto; }
  .testi-quote-mark {
    position:absolute; font-family:'Playfair Display',Georgia,serif;
    font-size:7rem; line-height:1; color:var(--gold);
    opacity:0.07; pointer-events:none; user-select:none;
  }
  .testi-quote-mark.open  { top:-1.2rem; left:0; }
  .testi-quote-mark.close { bottom:-2.2rem; right:0; }
  .testi-quote-text {
    font-family:'Playfair Display',Georgia,serif;
    font-size:clamp(20px,2.6vw,32px); font-weight:400; font-style:italic;
    color:var(--cream); text-align:center; line-height:1.75;
    transition:opacity .4s ease, filter .4s ease, transform .4s ease;
  }
  .testi-quote-text.animating { opacity:0; filter:blur(4px); transform:scale(.98); }
  .testi-role-text {
    font-family:'Inter',system-ui,sans-serif;
    font-size:11px; letter-spacing:.22em; text-transform:uppercase; color:var(--muted);
    transition:opacity .5s ease, transform .5s ease;
  }
  .testi-role-text.animating { opacity:0; transform:translateY(8px); }
  .testi-pill {
    border-radius:9999px; cursor:pointer;
    display:flex; align-items:center;
    transition:all .5s cubic-bezier(.4,0,.2,1);
    border:1px solid transparent; outline:none; background:none;
  }
  .testi-pill.active   { background:var(--gold); padding:6px 18px 6px 6px; border-color:var(--gold); box-shadow:0 4px 24px rgba(196,162,89,.3); }
  .testi-pill.inactive { padding:2px; }
  .testi-pill.inactive:hover { background:rgba(196,162,89,.12); border-color:rgba(196,162,89,.3); padding:6px 18px 6px 6px; }
  .testi-pill-avatar {
    width:2rem; height:2rem; border-radius:9999px; object-fit:cover; flex-shrink:0;
    transition:all .5s cubic-bezier(.4,0,.2,1);
  }
  .testi-pill.active .testi-pill-avatar   { box-shadow:0 0 0 2px rgba(12,11,8,.25); }
  .testi-pill.inactive:hover .testi-pill-avatar { transform:scale(1.05); }
  .testi-pill-name-wrap {
    display:grid; overflow:hidden;
    transition:all .5s cubic-bezier(.4,0,.2,1);
  }
  .testi-pill-name-wrap.visible { grid-template-columns:1fr; opacity:1; margin-left:10px; }
  .testi-pill-name-wrap.hidden  { grid-template-columns:0fr; opacity:0; margin-left:0; }
  .testi-pill-name {
    font-family:'Inter',system-ui,sans-serif; font-size:13px; font-weight:500;
    white-space:nowrap; overflow:hidden; display:block;
    transition:color .3s;
  }
  .testi-pill.active   .testi-pill-name { color:var(--bg); }
  .testi-pill.inactive .testi-pill-name { color:var(--cream); }
`;

// ═══════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════
function useScrolled() {
  const [s, set] = useState(false);
  useEffect(() => {
    const h = () => set(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return s;
}

function useReveal() {
  const ref = useRef(null);
  const [v, set] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { set(true); obs.disconnect(); } },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

function R({ c = "", d = "", children }) {
  const [ref, v] = useReveal();
  return <div ref={ref} className={`reveal ${v ? "in" : ""} ${d} ${c}`}>{children}</div>;
}

// ═══════════════════════════════════════════════════════════════
// NAV — all four links now scroll to their sections
// ═══════════════════════════════════════════════════════════════
function Nav({ scrolled }) {
  const navigate = useNavigate();

  // map label → section id
  const NAV_LINKS = [
    { label: "Our Story", id: "story"   },
    { label: "Menu",      id: "menu"    },
    { label: "Gallery",   id: "gallery" },
    { label: "Reserve",   id: "reserve" },
  ];

  return (
    <nav className={`nav ${scrolled ? "s" : ""}`}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:1, height:32, background:"linear-gradient(to bottom,transparent,var(--gold) 30%,var(--gold) 70%,transparent)" }} />
        <div>
          <div className="fd" style={{ fontSize:20, letterSpacing:"0.42em", color:"var(--cream)", fontWeight:500, lineHeight:1 }}>AURUM</div>
          <div className="fs" style={{ fontSize:9, letterSpacing:"0.3em", color:"var(--gold)", marginTop:3, opacity:.85 }}>FINE DINING</div>
        </div>
        <div style={{ width:1, height:32, background:"linear-gradient(to bottom,transparent,var(--gold) 30%,var(--gold) 70%,transparent)" }} />
      </div>

      {/* Nav links → scroll to sections */}
      <div className="nav-links" style={{ display:"flex", gap:40 }}>
        {NAV_LINKS.map(({ label, id }) => (
          <button key={label} className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display:"flex", gap:10, alignItems:"center", flexShrink:0 }}>
        <button className="btn btn-g nav-login-btn" onClick={() => navigate("/auth")}>Login</button>
        <button className="btn btn-p nav-reserve-btn" onClick={() => scrollTo("reserve")}>Reserve Table</button>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════
// HERO — animated-hero word cycling + "Explore Menu" connected
// ═══════════════════════════════════════════════════════════════
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const luxuryWords = useMemo(
    () => ["Exquisite", "Timeless", "Transcendent", "Luxurious", "Unforgettable"],
    []
  );
  useEffect(() => {
    const t = setTimeout(() => setWordIdx(i => (i + 1) % luxuryWords.length), 2200);
    return () => clearTimeout(t);
  }, [wordIdx, luxuryWords]);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 120); return () => clearTimeout(t); }, []);

  const show = d => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .85s ${d}s cubic-bezier(.4,0,.2,1),transform .85s ${d}s cubic-bezier(.4,0,.2,1)`,
  });

  return (
    <section style={{ position:"relative", height:"100vh", minHeight:600, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 35% 55%,rgba(100,60,18,.38) 0%,transparent 55%),radial-gradient(ellipse at 72% 20%,rgba(80,45,10,.22) 0%,transparent 48%),var(--bg)" }} />
      {BOKEH.map(b => <div key={b.id} className="bokeh" style={{ width:b.w, height:b.w, top:b.top, left:b.left, "--dur":`${b.dur}s`, "--d":`${b.d}s`, opacity:.18 }} />)}
      <div style={{ position:"absolute", top:"50%", left:0, right:0, height:1, background:"linear-gradient(90deg,transparent 0%,rgba(196,162,89,.12) 30%,rgba(196,162,89,.12) 70%,transparent 100%)", pointerEvents:"none" }} />

      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"0 24px", maxWidth:920 }}>
        {/* Eyebrow */}
        <div style={show(0.2)}>
          <span className="eyebrow" style={{ marginBottom:18 }}>Established 2018 · Mumbai, India</span>
        </div>

        {/* animated-hero style cycling descriptor */}
        <div style={{ ...show(0.32), position:"relative", height:"2.2rem", display:"flex", justifyContent:"center", alignItems:"center", overflow:"hidden", marginBottom:20 }}>
          {luxuryWords.map((word, i) => (
            <motion.span
              key={i}
              className="fd"
              style={{ position:"absolute", fontSize:"clamp(13px,1.6vw,18px)", fontWeight:400, fontStyle:"italic", letterSpacing:"0.55em", textTransform:"uppercase", color:"var(--gold)", opacity:.85 }}
              initial={{ opacity:0, y:70 }}
              animate={wordIdx === i ? { opacity:.85, y:0 } : { opacity:0, y: wordIdx > i ? -70 : 70 }}
              transition={{ type:"spring", stiffness:50 }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Main headline */}
        <div style={show(0.4)}><h1 className="fd" style={{ fontSize:"clamp(50px,9vw,110px)", fontWeight:400, fontStyle:"italic", lineHeight:1.07, color:"var(--cream)", marginBottom:0 }}>Where Cuisine</h1></div>
        <div style={show(0.52)}><h1 className="fd shimmer" style={{ fontSize:"clamp(50px,9vw,110px)", fontWeight:400, fontStyle:"italic", lineHeight:1.07, marginBottom:32 }}>Becomes Art</h1></div>

        {/* Subtitle */}
        <div style={show(0.72)}>
          <p style={{ fontSize:20, color:"var(--muted)", lineHeight:1.85, maxWidth:500, margin:"0 auto 46px" }}>
            A sanctuary of fine dining where each dish is a masterpiece, each evening an unforgettable memory.
          </p>
        </div>

        {/* CTAs — both now connected */}
        <div className="hero-btns" style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", ...show(0.9) }}>
          <button className="btn btn-p" onClick={() => scrollTo("reserve")}>Reserve a Table</button>
          <button className="btn btn-g" onClick={() => scrollTo("menu")}>Explore Menu</button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:"absolute", bottom:38, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:10, opacity:loaded?.55:0, transition:"opacity 1.2s 1.4s" }}>
        <span className="fs scroll-ind" style={{ fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:"var(--muted)" }}>Scroll</span>
        <div className="scroll-ind" style={{ width:1, height:40, background:"linear-gradient(to bottom,var(--gold),transparent)" }} />
      </div>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:200, background:"linear-gradient(to bottom,transparent,var(--bg))", pointerEvents:"none" }} />
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// STORY — id="story" added
// ═══════════════════════════════════════════════════════════════
function StorySection() {
  return (
    <section id="story" style={{ background:"var(--bg2)", padding:"140px 0" }}>
      <div className="section" style={{ paddingTop:0, paddingBottom:0 }}>
        <div className="story-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:88, alignItems:"center" }}>
          <div>
            <R><span className="eyebrow">Our Philosophy</span></R>
            <R d="d1"><h2 className="fd" style={{ fontSize:"clamp(34px,4vw,56px)", fontWeight:400, fontStyle:"italic", color:"var(--cream)", lineHeight:1.15, marginBottom:32 }}>The Art of the<br />Perfect Meal</h2></R>
            <R d="d2"><p style={{ fontSize:19, color:"var(--text)", lineHeight:1.88, marginBottom:22 }}>At Aurum, we believe dining is not merely eating — it is a journey. Each plate is the result of obsessive sourcing, relentless refinement, and a reverence for the finest ingredients the world offers.</p></R>
            <R d="d3"><p style={{ fontSize:19, color:"var(--muted)", lineHeight:1.88, marginBottom:48 }}>Our chef, Arnav Kapoor, trained under legends in Paris and Tokyo, brings a singular vision to every season: to honour the ingredient, to elevate the moment, to leave every guest transformed.</p></R>
            <R d="d4">
              <div style={{ display:"flex", gap:56, flexWrap:"wrap" }}>
                {[["12+","Years of Mastery"],["3,200+","Memorable Evenings"],["97%","Return Guests"]].map(([n,l]) => (
                  <div key={l}>
                    <div className="fd" style={{ fontSize:40, fontWeight:500, color:"var(--gold)", lineHeight:1 }}>{n}</div>
                    <div className="fs" style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--muted)", marginTop:8 }}>{l}</div>
                  </div>
                ))}
              </div>
            </R>
          </div>
          <R d="d2" c="story-art">
            <div style={{ position:"relative", aspectRatio:"4/5", overflow:"hidden" }}>
              <img src={IMG_SPREAD} alt="Signature sharing dishes" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(12,11,8,.55) 0%,transparent 50%)" }} />
              <div style={{ position:"absolute", top:10, left:10, width:22, height:22, borderTop:"1px solid var(--gold)", borderLeft:"1px solid var(--gold)", opacity:.6 }} />
              <div style={{ position:"absolute", bottom:10, right:10, width:22, height:22, borderBottom:"1px solid var(--gold)", borderRight:"1px solid var(--gold)", opacity:.6 }} />
            </div>
          </R>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// MENU — id="menu" added
// ═══════════════════════════════════════════════════════════════
function MenuSection({ activeTab, setActiveTab }) {
  return (
    <section id="menu" style={{ padding:"140px 0" }}>
      <div className="section" style={{ paddingTop:0, paddingBottom:0 }}>
        <R>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <span className="eyebrow">Culinary Excellence</span>
            <h2 className="fd" style={{ fontSize:"clamp(34px,4vw,56px)", fontWeight:400, fontStyle:"italic", color:"var(--cream)" }}>Our Menu</h2>
          </div>
        </R>
        <R d="d1">
          <div style={{ display:"flex", justifyContent:"center", marginBottom:48, flexWrap:"wrap" }}>
            {Object.keys(MENU).map(tab => (
              <button key={tab} className={`tab-btn ${activeTab===tab?"active":""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
            ))}
          </div>
        </R>
        <div style={{ display:"grid", gap:12 }}>
          {MENU[activeTab].map((item,i) => (
            <R key={item.name+activeTab} d={`d${i+1}`}>
              <div className="mc">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:24, flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:10, flexWrap:"wrap" }}>
                      <span className="fd" style={{ fontSize:22, color:"var(--cream)", fontWeight:500 }}>{item.name}</span>
                      {item.badge && <span className="fs" style={{ fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--gold)", padding:"3px 10px", border:"1px solid rgba(196,162,89,.3)", flexShrink:0 }}>{item.badge}</span>}
                    </div>
                    <p style={{ fontSize:16, color:"var(--muted)", lineHeight:1.65 }}>{item.desc}</p>
                  </div>
                  <div className="fd" style={{ fontSize:22, color:"var(--gold)", fontWeight:500, whiteSpace:"nowrap", paddingTop:4 }}>{item.price}</div>
                </div>
              </div>
            </R>
          ))}
        </div>
        <R d="d5">
          <div style={{ textAlign:"center", marginTop:56 }}>
            <hr className="divider" style={{ maxWidth:280, margin:"0 auto 28px" }} />
            <p className="fs" style={{ fontSize:12, color:"var(--muted)", letterSpacing:"0.06em", lineHeight:1.8 }}>
              All prices exclude taxes · Tasting menus available upon request<br />
              Dietary requirements accommodated with 24 hrs notice
            </p>
          </div>
        </R>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// GALLERY — id="gallery" added, card-fan-carousel
// ═══════════════════════════════════════════════════════════════
function GallerySection() {
  return (
    <section id="gallery" style={{ background:"var(--bg2)", paddingBottom:48 }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"120px 56px 0" }}>
        <R>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <span className="eyebrow">The Experience</span>
            <h2 className="fd" style={{ fontSize:"clamp(34px,4vw,56px)", fontWeight:400, fontStyle:"italic", color:"var(--cream)" }}>
              An Evening at Aurum
            </h2>
          </div>
        </R>
      </div>
      <div className="dark">
        <SocialCards cards={GALLERY_CARDS} />
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// AWARDS — unchanged
// ═══════════════════════════════════════════════════════════════
function AwardsStrip() {
  const doubled = [...AWARDS, ...AWARDS];
  return (
    <div style={{ background:"var(--card)", borderTop:"1px solid rgba(196,162,89,.1)", borderBottom:"1px solid rgba(196,162,89,.1)", padding:"17px 0", overflow:"hidden" }}>
      <div className="marquee-track">
        {doubled.map((a,i) => <span key={i} className="fs" style={{ padding:"0 52px", fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--muted)", whiteSpace:"nowrap" }}>{a}</span>)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TESTIMONIALS — interactive pill selector (testimonials.tsx style)
// id="voices" · same quotes, names, roles · avatars added
// ═══════════════════════════════════════════════════════════════
function TestimonialsSection() {
  const [activeIdx, setActiveIdx]       = useState(0);
  const [isAnimating, setIsAnimating]   = useState(false);
  const [displayedQuote, setDisplayedQuote] = useState(TESTIMONIALS[0].text);
  const [displayedRole, setDisplayedRole]   = useState(TESTIMONIALS[0].role);
  const [hoveredIdx, setHoveredIdx]     = useState(null);

  const handleSelect = (i) => {
    if (i === activeIdx || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setDisplayedQuote(TESTIMONIALS[i].text);
      setDisplayedRole(TESTIMONIALS[i].role);
      setActiveIdx(i);
      setTimeout(() => setIsAnimating(false), 400);
    }, 200);
  };

  return (
    <section id="voices" style={{ background:"var(--bg2)", padding:"140px 0" }}>
      <div className="section" style={{ paddingTop:0, paddingBottom:0 }}>
        <R>
          <div style={{ textAlign:"center", marginBottom:72 }}>
            <span className="eyebrow">What Guests Say</span>
            <h2 className="fd" style={{ fontSize:"clamp(34px,4vw,56px)", fontWeight:400, fontStyle:"italic", color:"var(--cream)" }}>Voices of Aurum</h2>
          </div>
        </R>

        {/* Interactive testimonial body */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:52 }}>

          {/* Quote block */}
          <div className="testi-quote-wrap">
            <span className="testi-quote-mark open">"</span>
            <p className={`testi-quote-text${isAnimating ? " animating" : ""}`}>{displayedQuote}</p>
            <span className="testi-quote-mark close">"</span>
          </div>

          {/* Role + avatar pills */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:24 }}>
            <p className={`testi-role-text${isAnimating ? " animating" : ""}`}>{displayedRole}</p>

            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {TESTIMONIALS.map((t, i) => {
                const isActive  = activeIdx === i;
                const isHovered = hoveredIdx === i && !isActive;
                const showName  = isActive || isHovered;
                return (
                  <button
                    key={t.name}
                    className={`testi-pill ${isActive ? "active" : "inactive"}`}
                    onClick={() => handleSelect(i)}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <img src={t.avatar} alt={t.name} className="testi-pill-avatar" />
                    <div className={`testi-pill-name-wrap ${showName ? "visible" : "hidden"}`}>
                      <div style={{ overflow:"hidden" }}>
                        <span className="testi-pill-name">{t.name}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// RESERVATION — id="reserve" added
// ═══════════════════════════════════════════════════════════════
function ReservationSection({ form, setForm, onSubmit, submitted }) {
  const f = key => e => setForm(p => ({ ...p, [key]: e.target.value }));
  return (
    <section id="reserve" style={{ padding:"140px 0" }}>
      <div className="section" style={{ paddingTop:0, paddingBottom:0 }}>
        <div className="res-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:88, alignItems:"start" }}>
          <div>
            <R><span className="eyebrow">Reserve Your Table</span></R>
            <R d="d1"><h2 className="fd" style={{ fontSize:"clamp(34px,4vw,56px)", fontWeight:400, fontStyle:"italic", color:"var(--cream)", lineHeight:1.15, marginBottom:32 }}>An Evening<br />Awaits You</h2></R>
            <R d="d2"><p style={{ fontSize:19, color:"var(--muted)", lineHeight:1.88, marginBottom:52 }}>Reserve your table at Aurum and allow us to craft an evening tailored precisely to your desires. Our concierge team is available to assist with every detail.</p></R>
            <R d="d3">
              <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
                {[["Dining Hours","Tuesday – Sunday\n7:00 PM – 11:00 PM"],["Location","The Taj Mahal Tower, Apollo Bunder\nMumbai, Maharashtra 400001"],["Contact","+91 22 6665 3366\nreservations@aurum.in"]].map(([label,value]) => (
                  <div key={label} style={{ borderLeft:"1px solid rgba(196,162,89,.28)", paddingLeft:22 }}>
                    <div className="fs" style={{ fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--gold)", marginBottom:7 }}>{label}</div>
                    <div style={{ fontSize:17, color:"var(--text)", lineHeight:1.75, whiteSpace:"pre-line" }}>{value}</div>
                  </div>
                ))}
              </div>
            </R>
          </div>
          <R d="d2">
            <div style={{ background:"var(--card)", padding:"48px", border:"1px solid var(--border)" }}>
              <div className="form-2col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                <div><label className="fl">Full Name</label><input className="form-field" placeholder="Your name" value={form.name} onChange={f("name")} /></div>
                <div><label className="fl">Phone</label><input className="form-field" placeholder="+91 98765 43210" value={form.phone} onChange={f("phone")} /></div>
              </div>
              <div style={{ marginBottom:16 }}><label className="fl">Email Address</label><input className="form-field" type="email" placeholder="your@email.com" value={form.email} onChange={f("email")} /></div>
              <div className="form-3col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:16 }}>
                <div><label className="fl">Date</label><input className="form-field" type="date" value={form.date} onChange={f("date")} style={{ colorScheme:"dark" }} /></div>
                <div><label className="fl">Time</label><select className="form-field" value={form.time} onChange={f("time")}>{TIMES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="fl">Guests</label><select className="form-field" value={form.guests} onChange={f("guests")}>{[1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n} {n===1?"Guest":"Guests"}</option>)}</select></div>
              </div>
              <div style={{ marginBottom:32 }}><label className="fl">Special Requests</label><textarea className="form-field" rows={3} placeholder="Allergies, celebrations, special arrangements…" value={form.notes} onChange={f("notes")} style={{ resize:"vertical" }} /></div>
              <button className="btn btn-p" style={{ width:"100%", justifyContent:"center", fontSize:12, padding:"16px 30px", background:submitted?"rgba(196,162,89,.6)":"var(--gold)" }} onClick={onSubmit}>
                {submitted ? "✓  Reservation Request Sent" : "Confirm Reservation"}
              </button>
              {submitted && (
                <div style={{ marginTop:16, padding:"14px 20px", background:"rgba(196,162,89,.08)", border:"1px solid rgba(196,162,89,.25)", textAlign:"center" }}>
                  <p className="fs" style={{ fontSize:12, color:"var(--gold)", letterSpacing:"0.08em", lineHeight:1.7 }}>Thank you. Our team will confirm within 2 hours.</p>
                </div>
              )}
              <p className="fs" style={{ fontSize:11, color:"var(--muted)", textAlign:"center", marginTop:20, lineHeight:1.65 }}>For parties of 9 or more, please call us directly.<br />Cancellations accepted up to 24 hrs in advance.</p>
            </div>
          </R>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// FOOTER — Navigate + Reserve links all connected
// ═══════════════════════════════════════════════════════════════
function Footer() {
  // Map footer link text → section id
  const NAV_MAP  = { "Our Story":"story", "Menu":"menu", "Gallery":"gallery", "Events":"reserve", "Press":"voices" };
  const RES_MAP  = { "Book a Table":"reserve", "Private Dining":"reserve", "Wine Programme":"menu", "Gift Vouchers":"reserve", "Tasting Menu":"menu" };

  return (
    <footer style={{ background:"#080706", padding:"80px 0 40px", borderTop:"1px solid rgba(196,162,89,.1)" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 56px" }}>
        <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:56, marginBottom:72, paddingBottom:60, borderBottom:"1px solid var(--border)" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
              <div style={{ width:1, height:28, background:"linear-gradient(to bottom,transparent,var(--gold),transparent)" }} />
              <div>
                <div className="fd" style={{ fontSize:18, letterSpacing:"0.42em", color:"var(--cream)", fontWeight:500, lineHeight:1 }}>AURUM</div>
                <div className="fs" style={{ fontSize:9, letterSpacing:"0.3em", color:"var(--gold)", marginTop:2 }}>FINE DINING</div>
              </div>
              <div style={{ width:1, height:28, background:"linear-gradient(to bottom,transparent,var(--gold),transparent)" }} />
            </div>
            <p style={{ fontSize:16, color:"var(--muted)", lineHeight:1.82, maxWidth:280, marginBottom:32 }}>A sanctuary of fine dining in the heart of Mumbai. Where every meal becomes a memory.</p>
            <div style={{ display:"flex", gap:12 }}>
              {["IG","FB","TW","YT"].map(s=><div key={s} style={{ width:34, height:34, border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><span className="fs" style={{ fontSize:10, color:"var(--muted)" }}>{s}</span></div>)}
            </div>
          </div>

          {/* Navigate — all connected */}
          <div>
            <div className="fs" style={{ fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--gold)", marginBottom:20 }}>Navigate</div>
            {Object.entries(NAV_MAP).map(([label, id]) => (
              <button key={label} className="flink" onClick={() => scrollTo(id)}>{label}</button>
            ))}
          </div>

          {/* Reserve — all connected */}
          <div>
            <div className="fs" style={{ fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--gold)", marginBottom:20 }}>Reserve</div>
            {Object.entries(RES_MAP).map(([label, id]) => (
              <button key={label} className="flink" onClick={() => scrollTo(id)}>{label}</button>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div className="fs" style={{ fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--gold)", marginBottom:20 }}>Contact</div>
            <div style={{ fontSize:15, color:"var(--muted)", lineHeight:1.85 }}>
              <div>The Taj Mahal Tower</div><div>Apollo Bunder, Mumbai 400 001</div>
              <div style={{ marginTop:16 }}>+91 22 6665 3366</div><div>reservations@aurum.in</div>
              <div style={{ marginTop:16, opacity:.7 }}>Tue–Sun: 7:00 – 11:00 PM</div>
            </div>
          </div>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <p className="fs" style={{ fontSize:11, color:"var(--muted)", letterSpacing:"0.05em" }}>© {new Date().getFullYear()} Aurum Fine Dining Pvt. Ltd. All rights reserved.</p>
          <div style={{ display:"flex", gap:28 }}>
            {["Privacy Policy","Terms of Service","Cookie Policy"].map(l=>(
              <button key={l} className="fs" style={{ fontSize:11, color:"var(--muted)", letterSpacing:"0.04em", transition:"color .2s" }} onMouseEnter={e=>e.currentTarget.style.color="var(--gold)"} onMouseLeave={e=>e.currentTarget.style.color="var(--muted)"}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
export default function LandingPage() {
  const scrolled = useScrolled();
  const [activeMenu, setActiveMenu] = useState("Entrée");
  const [form, setForm] = useState({ name:"", email:"", phone:"", date:"", time:"7:30 PM", guests:"2", notes:"" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (form.name && form.email && form.date) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background:"var(--bg)", minHeight:"100vh" }}>
        <Nav scrolled={scrolled} />
        <Hero />
        <StorySection />
        <MenuSection activeTab={activeMenu} setActiveTab={setActiveMenu} />
        <GallerySection />
        <AwardsStrip />
        <TestimonialsSection />
        <ReservationSection form={form} setForm={setForm} onSubmit={handleSubmit} submitted={submitted} />
        <Footer />
      </div>
    </>
  );
}
