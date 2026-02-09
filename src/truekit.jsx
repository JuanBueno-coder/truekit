import { useState, useEffect, useRef, useCallback } from "react";

// ─── Data & Constants ──────────────────────────────────────────────
const CATEGORIES = [
  { id: "tech", label: "Tecnología", icon: "💻", color: "#00D4AA" },
  { id: "home", label: "Hogar", icon: "🏠", color: "#FF6B6B" },
  { id: "sports", label: "Deportes", icon: "⚽", color: "#4ECDC4" },
  { id: "books", label: "Libros", icon: "📚", color: "#FFE66D" },
  { id: "fashion", label: "Moda", icon: "👗", color: "#A78BFA" },
  { id: "music", label: "Música", icon: "🎵", color: "#F472B6" },
  { id: "art", label: "Arte", icon: "🎨", color: "#FB923C" },
  { id: "services", label: "Servicios", icon: "🛠️", color: "#38BDF8" },
];

const VALUE_TIERS = [
  { id: 1, label: "Básico", range: "0-10 TC", min: 0, max: 10, color: "#6B7280" },
  { id: 2, label: "Estándar", range: "10-30 TC", min: 10, max: 30, color: "#10B981" },
  { id: 3, label: "Premium", range: "30-60 TC", min: 30, max: 60, color: "#3B82F6" },
  { id: 4, label: "Élite", range: "60-100 TC", min: 60, max: 100, color: "#8B5CF6" },
];

const BADGES = [
  { id: "first_trade", name: "Primer Trueque", icon: "🌱", desc: "Realiza tu primer intercambio", req: 1 },
  { id: "eco_warrior", name: "Eco Guerrero", icon: "♻️", desc: "10 intercambios realizados", req: 10 },
  { id: "tree_planter", name: "Plantador", icon: "🌳", desc: "Planta tu primer árbol", req: 1 },
  { id: "public_transport", name: "Movilidad Verde", icon: "🚌", desc: "Usa transporte público 5 veces", req: 5 },
  { id: "donator", name: "Solidario", icon: "💚", desc: "Dona a BIOAlverde", req: 1 },
  { id: "top_trader", name: "Truekero Top", icon: "⭐", desc: "50 intercambios", req: 50 },
  { id: "local_hero", name: "Héroe Local", icon: "🏅", desc: "Apoya 5 comercios locales", req: 5 },
  { id: "reviewer", name: "Crítico", icon: "📝", desc: "Deja 20 reseñas", req: 20 },
];

const USER_LEVELS = [
  { level: 1, name: "Semilla", min: 0, icon: "🌱" },
  { level: 2, name: "Brote", min: 50, icon: "🌿" },
  { level: 3, name: "Árbol", min: 150, icon: "🌳" },
  { level: 4, name: "Bosque", min: 400, icon: "🏔️" },
  { level: 5, name: "Ecosistema", min: 1000, icon: "🌍" },
];

const SAMPLE_PRODUCTS = [
  { id: 1, name: "Guitarra acústica Yamaha", category: "music", tier: 3, tokens: 45, image: "🎸", owner: "María G.", ownerLevel: 3, rating: 4.8, desc: "Guitarra en perfecto estado, poco uso. Incluye funda.", condition: "Muy bueno" },
  { id: 2, name: "Bicicleta de montaña", category: "sports", tier: 4, tokens: 80, image: "🚲", owner: "Carlos R.", ownerLevel: 4, rating: 4.9, desc: "BTT 29 pulgadas, frenos hidráulicos, suspensión delantera.", condition: "Bueno" },
  { id: 3, name: "Colección Harry Potter", category: "books", tier: 2, tokens: 25, image: "📖", owner: "Ana L.", ownerLevel: 2, rating: 4.5, desc: "7 libros en español, tapa blanda, buen estado.", condition: "Bueno" },
  { id: 4, name: "Tablet Samsung Galaxy", category: "tech", tier: 3, tokens: 55, image: "📱", owner: "Pedro M.", ownerLevel: 3, rating: 4.7, desc: "Galaxy Tab A8, 64GB, con cargador original.", condition: "Excelente" },
  { id: 5, name: "Máquina de coser Singer", category: "home", tier: 3, tokens: 40, image: "🧵", owner: "Lucía F.", ownerLevel: 2, rating: 4.6, desc: "Singer Tradition, funciona perfectamente.", condition: "Bueno" },
  { id: 6, name: "Zapatillas Nike Air Max", category: "fashion", tier: 2, tokens: 20, image: "👟", owner: "Javi S.", ownerLevel: 1, rating: 4.3, desc: "Talla 43, usadas pocas veces, muy buen estado.", condition: "Muy bueno" },
  { id: 7, name: "Set de pinturas acrílicas", category: "art", tier: 1, tokens: 8, image: "🎨", owner: "Elena R.", ownerLevel: 2, rating: 4.4, desc: "24 colores + 5 pinceles + paleta. Sin estrenar.", condition: "Nuevo" },
  { id: 8, name: "Altavoz Bluetooth JBL", category: "tech", tier: 2, tokens: 28, image: "🔊", owner: "Diego P.", ownerLevel: 3, rating: 4.8, desc: "JBL Flip 5, resistente al agua, gran sonido.", condition: "Excelente" },
  { id: 9, name: "Clase de guitarra (grupo)", category: "services", tier: 1, tokens: 5, image: "🎶", owner: "María G.", ownerLevel: 3, rating: 4.9, desc: "Clase grupal de 1h para principiantes. Máx 5 personas.", condition: "Servicio" },
  { id: 10, name: "Diseño gráfico de logo", category: "services", tier: 2, tokens: 15, image: "✏️", owner: "Sara T.", ownerLevel: 4, rating: 5.0, desc: "Diseño profesional de logotipo con 3 propuestas.", condition: "Servicio" },
  { id: 11, name: "Mesa escritorio IKEA", category: "home", tier: 2, tokens: 22, image: "🪑", owner: "Rafa N.", ownerLevel: 1, rating: 4.2, desc: "120x60cm, color blanco, desmontada para transporte.", condition: "Bueno" },
  { id: 12, name: "Patinete eléctrico Xiaomi", category: "sports", tier: 4, tokens: 90, image: "🛴", owner: "Marta V.", ownerLevel: 4, rating: 4.7, desc: "Xiaomi Pro 2, 45km autonomía, bien cuidado.", condition: "Muy bueno" },
];

const SAMPLE_SERVICES = [
  { id: 101, name: "Clase de yoga al aire libre", provider: "Laura M.", tokens: 3, duration: "1h", spots: 8, icon: "🧘", endDate: "2026-02-20" },
  { id: 102, name: "Taller de reparación de bicis", provider: "Toni G.", tokens: 5, duration: "2h", spots: 4, icon: "🔧", endDate: "2026-02-18" },
  { id: 103, name: "Sesión de fotografía", provider: "Carmen D.", tokens: 8, duration: "1.5h", spots: 2, icon: "📸", endDate: "2026-02-15" },
  { id: 104, name: "Asesoría de CV y LinkedIn", provider: "Pablo R.", tokens: 6, duration: "45min", spots: 3, icon: "💼", endDate: "2026-02-22" },
];

const LOCAL_BUSINESSES = [
  { id: 201, name: "Panadería El Horno de Juan", offer: "Pan artesano por 2 TC", tokens: 2, icon: "🍞", area: "Montequinto" },
  { id: 202, name: "Taller Bici-Eco", offer: "Revisión completa por 8 TC", tokens: 8, icon: "🚲", area: "Dos Hermanas" },
  { id: 203, name: "Floristería Verde Vida", offer: "Ramo de temporada por 5 TC", tokens: 5, icon: "💐", area: "Montequinto" },
  { id: 204, name: "Librería Páginas", offer: "Vale 10€ por 6 TC", tokens: 6, icon: "📕", area: "Dos Hermanas" },
];

// ─── Utility Components ────────────────────────────────────────────

function StarRating({ rating, size = 14 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span style={{ display: "inline-flex", gap: 1, fontSize: size }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < full ? "#F59E0B" : i === full && half ? "#F59E0B" : "#D1D5DB" }}>
          {i < full ? "★" : i === full && half ? "★" : "☆"}
        </span>
      ))}
      <span style={{ fontSize: size - 2, color: "#9CA3AF", marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

function TokenBadge({ amount, size = "md" }) {
  const sizes = { sm: { fontSize: 11, padding: "2px 6px" }, md: { fontSize: 13, padding: "3px 10px" }, lg: { fontSize: 16, padding: "5px 14px" } };
  const s = sizes[size] || sizes.md;
  return (
    <span style={{
      background: "linear-gradient(135deg, #065F46, #059669)",
      color: "#ECFDF5",
      borderRadius: 20,
      fontWeight: 700,
      letterSpacing: 0.5,
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      ...s,
      boxShadow: "0 2px 8px rgba(5,150,105,0.3)"
    }}>
      <span style={{ fontSize: s.fontSize + 2 }}>◈</span> {amount} TC
    </span>
  );
}

function Badge({ badge, earned = false }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      opacity: earned ? 1 : 0.35, filter: earned ? "none" : "grayscale(100%)",
      transition: "all 0.3s ease"
    }}>
      <span style={{ fontSize: 28 }}>{badge.icon}</span>
      <span style={{ fontSize: 10, fontWeight: 600, color: earned ? "#065F46" : "#9CA3AF", textAlign: "center" }}>{badge.name}</span>
    </div>
  );
}

function ProgressBar({ value, max, color = "#059669", height = 6 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ width: "100%", height, background: "#E5E7EB", borderRadius: height, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%",
        background: `linear-gradient(90deg, ${color}, ${color}BB)`,
        borderRadius: height, transition: "width 0.6s ease"
      }} />
    </div>
  );
}

function CountdownTimer({ endDate }) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate) - new Date();
      if (diff <= 0) { setTimeLeft("Finalizado"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      setTimeLeft(d > 0 ? `${d}d ${h}h` : `${h}h`);
    };
    calc();
    const i = setInterval(calc, 60000);
    return () => clearInterval(i);
  }, [endDate]);
  return <span style={{ color: "#DC2626", fontWeight: 700, fontSize: 12 }}>⏳ {timeLeft}</span>;
}

// ─── Styles ────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;0,9..144,900;1,9..144,400&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --green-50: #ECFDF5;
  --green-100: #D1FAE5;
  --green-200: #A7F3D0;
  --green-500: #10B981;
  --green-600: #059669;
  --green-700: #047857;
  --green-800: #065F46;
  --green-900: #064E3B;
  --sand-50: #FEFDFB;
  --sand-100: #FBF8F3;
  --sand-200: #F3EDE4;
  --sand-300: #E8DFD1;
  --text-primary: #1A2E1A;
  --text-secondary: #4A5D4A;
  --text-muted: #7D8F7D;
  --radius: 16px;
  --radius-sm: 10px;
  --shadow-sm: 0 1px 3px rgba(6,95,70,0.06);
  --shadow-md: 0 4px 16px rgba(6,95,70,0.08);
  --shadow-lg: 0 8px 32px rgba(6,95,70,0.12);
  --shadow-xl: 0 16px 48px rgba(6,95,70,0.16);
  --font-display: 'Fraunces', serif;
  --font-body: 'DM Sans', sans-serif;
}

body { font-family: var(--font-body); background: var(--sand-50); color: var(--text-primary); }

.app-container { min-height: 100vh; display: flex; flex-direction: column; }

.top-bar {
  background: linear-gradient(135deg, var(--green-900) 0%, var(--green-800) 50%, #0A4A3A 100%);
  color: white; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 4px 20px rgba(6,95,70,0.3);
}

.top-bar-logo { font-family: var(--font-display); font-size: 26px; font-weight: 900; letter-spacing: -1px; display: flex; align-items: center; gap: 8px; }
.top-bar-logo span { background: linear-gradient(135deg, #A7F3D0, #6EE7B7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

.top-bar-user { display: flex; align-items: center; gap: 16px; }
.top-bar-tokens { background: rgba(255,255,255,0.12); backdrop-filter: blur(10px); border: 1px solid rgba(167,243,208,0.2); border-radius: 24px; padding: 6px 16px; display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 14px; }
.top-bar-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--green-500), #34D399); display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; border: 2px solid rgba(255,255,255,0.3); cursor: pointer; }

.nav-bar {
  background: white; border-bottom: 1px solid var(--sand-200);
  display: flex; justify-content: center; gap: 4px; padding: 8px 16px;
  position: sticky; top: 64px; z-index: 99;
  box-shadow: var(--shadow-sm);
}
.nav-item {
  padding: 10px 20px; border-radius: 12px; cursor: pointer;
  font-size: 13px; font-weight: 500; color: var(--text-secondary);
  transition: all 0.25s ease; border: none; background: none;
  display: flex; align-items: center; gap: 6px;
}
.nav-item:hover { background: var(--green-50); color: var(--green-700); }
.nav-item.active { background: var(--green-800); color: white; font-weight: 600; box-shadow: 0 2px 8px rgba(6,95,70,0.25); }

.main-content { flex: 1; max-width: 1200px; width: 100%; margin: 0 auto; padding: 24px 20px 80px; }

.section-title {
  font-family: var(--font-display); font-size: 28px; font-weight: 700;
  color: var(--green-900); margin-bottom: 4px; letter-spacing: -0.5px;
}
.section-subtitle { color: var(--text-muted); font-size: 14px; margin-bottom: 24px; }

.card {
  background: white; border-radius: var(--radius); border: 1px solid var(--sand-200);
  overflow: hidden; transition: all 0.3s ease; cursor: pointer;
}
.card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); border-color: var(--green-200); }

.grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.grid-2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px; }
.grid-4 { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }

.product-image {
  height: 140px; display: flex; align-items: center; justify-content: center;
  font-size: 56px; position: relative;
}
.product-body { padding: 16px; }
.product-name { font-weight: 600; font-size: 15px; margin-bottom: 4px; line-height: 1.3; }
.product-owner { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 4px; }
.product-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
.product-condition { font-size: 11px; padding: 3px 8px; border-radius: 6px; background: var(--sand-100); color: var(--text-secondary); font-weight: 500; }
.product-category-tag { position: absolute; top: 10px; left: 10px; font-size: 11px; padding: 3px 10px; border-radius: 8px; font-weight: 600; color: white; }

.hero-section {
  background: linear-gradient(135deg, var(--green-900) 0%, #0A4A3A 40%, #064E3B 100%);
  border-radius: 24px; padding: 48px 40px; color: white; margin-bottom: 32px;
  position: relative; overflow: hidden;
}
.hero-section::before {
  content: ''; position: absolute; top: -50%; right: -20%; width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(167,243,208,0.15) 0%, transparent 70%);
  pointer-events: none;
}
.hero-section::after {
  content: ''; position: absolute; bottom: -30%; left: -10%; width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%);
  pointer-events: none;
}
.hero-title { font-family: var(--font-display); font-size: 40px; font-weight: 900; line-height: 1.1; margin-bottom: 12px; position: relative; letter-spacing: -1px; }
.hero-subtitle { font-size: 16px; opacity: 0.8; max-width: 500px; line-height: 1.5; position: relative; }
.hero-stats { display: flex; gap: 32px; margin-top: 28px; position: relative; }
.hero-stat { text-align: center; }
.hero-stat-value { font-family: var(--font-display); font-size: 32px; font-weight: 700; color: #6EE7B7; }
.hero-stat-label { font-size: 12px; opacity: 0.7; margin-top: 2px; }

.search-bar {
  display: flex; gap: 12px; margin-bottom: 24px; align-items: center;
}
.search-input {
  flex: 1; padding: 12px 18px; border-radius: 14px; border: 2px solid var(--sand-200);
  font-size: 14px; font-family: var(--font-body); background: white;
  transition: all 0.25s ease; outline: none;
}
.search-input:focus { border-color: var(--green-500); box-shadow: 0 0 0 4px rgba(16,185,129,0.1); }

.filter-chip {
  padding: 8px 16px; border-radius: 24px; border: 1.5px solid var(--sand-200);
  background: white; font-size: 12px; font-weight: 500; cursor: pointer;
  transition: all 0.2s ease; font-family: var(--font-body); white-space: nowrap;
}
.filter-chip:hover { border-color: var(--green-500); }
.filter-chip.active { background: var(--green-800); color: white; border-color: var(--green-800); }

.btn-primary {
  background: linear-gradient(135deg, var(--green-700), var(--green-600));
  color: white; border: none; padding: 12px 28px; border-radius: 14px;
  font-weight: 600; font-size: 14px; cursor: pointer; font-family: var(--font-body);
  transition: all 0.25s ease; box-shadow: 0 2px 10px rgba(5,150,105,0.3);
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(5,150,105,0.4); }

.btn-secondary {
  background: white; color: var(--green-700); border: 2px solid var(--green-200);
  padding: 10px 24px; border-radius: 14px; font-weight: 600; font-size: 13px;
  cursor: pointer; font-family: var(--font-body); transition: all 0.25s ease;
}
.btn-secondary:hover { background: var(--green-50); border-color: var(--green-500); }

.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(6,95,70,0.3); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; padding: 20px; animation: fadeIn 0.2s ease;
}
.modal-content {
  background: white; border-radius: 24px; max-width: 560px; width: 100%;
  max-height: 85vh; overflow-y: auto; padding: 32px;
  box-shadow: var(--shadow-xl); animation: slideUp 0.3s ease;
}

.form-group { margin-bottom: 18px; }
.form-label { display: block; font-weight: 600; font-size: 13px; margin-bottom: 6px; color: var(--text-primary); }
.form-input {
  width: 100%; padding: 10px 14px; border: 2px solid var(--sand-200); border-radius: 12px;
  font-size: 14px; font-family: var(--font-body); transition: all 0.2s ease; outline: none;
}
.form-input:focus { border-color: var(--green-500); box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
.form-select { appearance: auto; }
.form-textarea { resize: vertical; min-height: 80px; }

.toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: var(--green-800); color: white; padding: 14px 28px;
  border-radius: 16px; font-weight: 500; font-size: 14px; z-index: 300;
  box-shadow: var(--shadow-xl); animation: slideUp 0.3s ease, fadeOut 0.3s ease 2.5s forwards;
}

.tab-group { display: flex; gap: 4px; background: var(--sand-100); padding: 4px; border-radius: 14px; margin-bottom: 24px; }
.tab-item {
  flex: 1; padding: 10px 16px; border-radius: 10px; border: none; background: none;
  font-size: 13px; font-weight: 500; cursor: pointer; font-family: var(--font-body);
  color: var(--text-muted); transition: all 0.2s ease; text-align: center;
}
.tab-item.active { background: white; color: var(--green-800); font-weight: 600; box-shadow: var(--shadow-sm); }

.collab-card {
  background: linear-gradient(135deg, #F0FDF4, #ECFDF5);
  border: 2px solid var(--green-200); border-radius: var(--radius);
  padding: 24px; transition: all 0.3s ease;
}
.collab-card:hover { border-color: var(--green-500); box-shadow: var(--shadow-md); }

.campaign-card {
  background: white; border: 1px solid var(--sand-200); border-radius: var(--radius);
  padding: 20px; display: flex; gap: 16px; align-items: center;
  transition: all 0.3s ease;
}
.campaign-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

.review-card {
  background: white; border: 1px solid var(--sand-200); border-radius: var(--radius-sm);
  padding: 16px;
}

.level-bar {
  background: var(--sand-100); border-radius: 20px; padding: 16px 24px;
  display: flex; align-items: center; gap: 20px; margin-bottom: 24px;
}

.transport-badge {
  background: linear-gradient(135deg, #DBEAFE, #EFF6FF);
  border: 2px solid #93C5FD; border-radius: 14px; padding: 16px;
  display: flex; align-items: center; gap: 12px;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

.stagger-1 { animation: slideUp 0.4s ease 0.05s both; }
.stagger-2 { animation: slideUp 0.4s ease 0.1s both; }
.stagger-3 { animation: slideUp 0.4s ease 0.15s both; }
.stagger-4 { animation: slideUp 0.4s ease 0.2s both; }
.stagger-5 { animation: slideUp 0.4s ease 0.25s both; }
.stagger-6 { animation: slideUp 0.4s ease 0.3s both; }

@media (max-width: 768px) {
  .hero-section { padding: 32px 24px; }
  .hero-title { font-size: 28px; }
  .hero-stats { flex-wrap: wrap; gap: 16px; }
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .nav-bar { overflow-x: auto; justify-content: flex-start; }
  .main-content { padding: 16px 12px 80px; }
  .search-bar { flex-wrap: wrap; }
}
`;

// ─── Main App ──────────────────────────────────────────────────────
export default function TrueKitApp() {
  const [page, setPage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [userTokens, setUserTokens] = useState(42);
  const [userXP, setUserXP] = useState(165);
  const [userBadges, setUserBadges] = useState(["first_trade", "donator", "public_transport"]);
  const [myProducts, setMyProducts] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([
    { id: 1, date: "2026-01-15", gave: "Cámara réflex", received: "Guitarra acústica", tokensExchanged: 12, partner: "María G." },
    { id: 2, date: "2026-01-28", gave: "5 TC", received: "Clase de yoga", tokensExchanged: -5, partner: "Laura M." },
    { id: 3, date: "2026-02-03", gave: "Colección vinilos", received: "Tablet Samsung", tokensExchanged: 20, partner: "Pedro M." },
  ]);
  const [profileTab, setProfileTab] = useState("badges");
  const [treesPlanted, setTreesPlanted] = useState(2);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const currentLevel = USER_LEVELS.slice().reverse().find(l => userXP >= l.min) || USER_LEVELS[0];
  const nextLevel = USER_LEVELS.find(l => l.min > userXP);

  const filteredProducts = SAMPLE_PRODUCTS.filter(p => {
    const matchCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchTier = selectedTier === "all" || p.tier === parseInt(selectedTier);
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchTier && matchSearch;
  });

  // ─── Publish Product Form ──────────────────
  const PublishModal = () => {
    const [form, setForm] = useState({ name: "", category: "tech", condition: "Bueno", desc: "" });
    const [step, setStep] = useState(1);
    const [estimatedTokens, setEstimatedTokens] = useState(null);

    const handleEstimate = () => {
      const base = form.condition === "Nuevo" ? 30 : form.condition === "Excelente" ? 25 : form.condition === "Muy bueno" ? 18 : form.condition === "Bueno" ? 12 : 6;
      const catMod = ["tech", "sports"].includes(form.category) ? 1.4 : ["music", "art"].includes(form.category) ? 1.2 : 1;
      const est = Math.round(base * catMod + Math.random() * 10);
      setEstimatedTokens(est);
      setStep(3);
    };

    return (
      <div className="modal-overlay" onClick={() => setModal(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>
              {step === 1 ? "Publicar artículo" : step === 2 ? "Cuestionario de tasación" : "Valoración estimada"}
            </h2>
            <button onClick={() => setModal(null)} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", color: "var(--text-muted)" }}>×</button>
          </div>

          {step === 1 && (
            <>
              <div className="form-group">
                <label className="form-label">Nombre del artículo</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ej: Guitarra acústica Yamaha" />
              </div>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select className="form-input form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea className="form-input form-textarea" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} placeholder="Describe el estado, marca, detalles relevantes..." />
              </div>
              <button className="btn-primary" style={{ width: "100%" }} onClick={() => form.name ? setStep(2) : showToast("Introduce un nombre")}>
                Siguiente →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>
                Responde a estas preguntas para que podamos estimar el valor de tu artículo y categorizarlo correctamente.
              </p>
              <div className="form-group">
                <label className="form-label">Estado del artículo</label>
                <select className="form-input form-select" value={form.condition} onChange={e => setForm({...form, condition: e.target.value})}>
                  <option>Nuevo</option><option>Excelente</option><option>Muy bueno</option><option>Bueno</option><option>Aceptable</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">¿Tiene menos de 2 años?</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="filter-chip active" style={{ flex: 1 }}>Sí</button>
                  <button className="filter-chip" style={{ flex: 1 }}>No</button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">¿Incluye accesorios originales?</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="filter-chip active" style={{ flex: 1 }}>Sí</button>
                  <button className="filter-chip" style={{ flex: 1 }}>No</button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">¿Funciona correctamente?</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="filter-chip active" style={{ flex: 1 }}>Sí</button>
                  <button className="filter-chip" style={{ flex: 1 }}>No / Parcialmente</button>
                </div>
              </div>
              <button className="btn-primary" style={{ width: "100%" }} onClick={handleEstimate}>
                Tasar artículo →
              </button>
            </>
          )}

          {step === 3 && estimatedTokens && (
            <>
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 60, marginBottom: 12 }}>
                  {CATEGORIES.find(c => c.id === form.category)?.icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 4 }}>{form.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>
                  {form.condition} · {CATEGORIES.find(c => c.id === form.category)?.label}
                </p>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 8 }}>Valor estimado:</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <TokenBadge amount={estimatedTokens} size="lg" />
                </div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 16, maxWidth: 350, margin: "16px auto 0", lineHeight: 1.5 }}>
                  Tu artículo será visible para otros usuarios con productos de valor similar. Los Truecréditos se generarán al cerrar el intercambio si hay diferencia de valor.
                </p>
              </div>
              <button className="btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={() => {
                setMyProducts(prev => [...prev, { id: Date.now(), name: form.name, category: form.category, tier: estimatedTokens > 60 ? 4 : estimatedTokens > 30 ? 3 : estimatedTokens > 10 ? 2 : 1, tokens: estimatedTokens, image: CATEGORIES.find(c => c.id === form.category)?.icon, condition: form.condition, desc: form.desc }]);
                setModal(null);
                showToast("¡Artículo publicado con éxito!");
              }}>
                Publicar artículo ✓
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // ─── Trade Modal ──────────────────────────
  const TradeModal = ({ product }) => {
    const [selectedMyItems, setSelectedMyItems] = useState([]);
    const [addTokens, setAddTokens] = useState(0);
    const allMyItems = [...myProducts, { id: 999, name: "Cámara digital Canon", tokens: 30, image: "📷", category: "tech" }, { id: 998, name: "Juego de mesa Catan", tokens: 12, image: "🎲", category: "art" }];
    const myTotal = selectedMyItems.reduce((s, id) => s + (allMyItems.find(i => i.id === id)?.tokens || 0), 0) + addTokens;
    const diff = product.tokens - myTotal;

    return (
      <div className="modal-overlay" onClick={() => setModal(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>Proponer trueque</h2>
            <button onClick={() => setModal(null)} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer" }}>×</button>
          </div>

          <div style={{ background: "var(--sand-100)", borderRadius: 14, padding: 16, marginBottom: 20, display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 40 }}>{product.image}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{product.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>de {product.owner}</div>
              <TokenBadge amount={product.tokens} size="sm" />
            </div>
          </div>

          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Selecciona tus artículos para ofrecer:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, maxHeight: 180, overflowY: "auto" }}>
            {allMyItems.map(item => (
              <label key={item.id} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 10, border: selectedMyItems.includes(item.id) ? "2px solid var(--green-500)" : "2px solid var(--sand-200)",
                background: selectedMyItems.includes(item.id) ? "var(--green-50)" : "white", cursor: "pointer", transition: "all 0.2s"
              }}>
                <input type="checkbox" checked={selectedMyItems.includes(item.id)} onChange={e => {
                  setSelectedMyItems(prev => e.target.checked ? [...prev, item.id] : prev.filter(i => i !== item.id));
                }} style={{ accentColor: "var(--green-600)" }} />
                <span style={{ fontSize: 22 }}>{item.image}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</div>
                </div>
                <TokenBadge amount={item.tokens} size="sm" />
              </label>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Añadir Truecréditos para compensar ({userTokens} TC disponibles)</label>
            <input type="range" min={0} max={Math.min(userTokens, product.tokens)} value={addTokens} onChange={e => setAddTokens(parseInt(e.target.value))} style={{ width: "100%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)" }}>
              <span>0 TC</span><span style={{ fontWeight: 700, color: "var(--green-700)" }}>+{addTokens} TC</span>
            </div>
          </div>

          <div style={{ background: diff > 5 ? "#FEF2F2" : diff > 0 ? "#FFFBEB" : "#ECFDF5", borderRadius: 12, padding: 14, marginBottom: 16, textAlign: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: diff > 5 ? "#DC2626" : diff > 0 ? "#D97706" : "#059669" }}>
              {diff <= 0 ? "✓ Oferta equilibrada" : `Diferencia: ${diff} TC — añade más artículos o créditos`}
            </span>
          </div>

          <button className="btn-primary" style={{ width: "100%", opacity: diff > 10 ? 0.5 : 1 }} onClick={() => {
            if (diff > 10) { showToast("La diferencia es demasiado grande"); return; }
            setModal(null);
            showToast("¡Propuesta de trueque enviada! 🎉");
          }}>
            Enviar propuesta de trueque
          </button>
        </div>
      </div>
    );
  };

  // ─── Product Detail Modal ─────────────────
  const ProductDetailModal = ({ product }) => (
    <div className="modal-overlay" onClick={() => setModal(null)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={() => setModal(null)} style={{ position: "absolute", right: 20, top: 20, border: "none", background: "none", fontSize: 24, cursor: "pointer" }}>×</button>
        <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
          <div style={{
            width: 120, height: 120, borderRadius: 20, margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64,
            background: `linear-gradient(135deg, ${CATEGORIES.find(c => c.id === product.category)?.color}22, ${CATEGORIES.find(c => c.id === product.category)?.color}11)`
          }}>{product.image}</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{product.name}</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{product.owner}</span>
            {product.rating && <StarRating rating={product.rating} size={12} />}
          </div>
          <TokenBadge amount={product.tokens} size="lg" />
        </div>
        <div style={{ background: "var(--sand-100)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Descripción</div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{product.desc}</p>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <span className="product-condition">{product.condition}</span>
          <span className="product-condition">{CATEGORIES.find(c => c.id === product.category)?.label}</span>
          <span className="product-condition">Tier {product.tier}</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={() => setModal({ type: "trade", product })}>
            Proponer trueque
          </button>
          <button className="btn-secondary" style={{ flex: 1 }}>
            Contactar
          </button>
        </div>
      </div>
    </div>
  );

  // ─── Pages ───────────────────────────────────────────────────────

  const HomePage = () => (
    <>
      <div className="hero-section stagger-1">
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="TrueKit" style={{ height: 72, borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }} />
        </div>
        <div className="hero-title">Intercambia, no compres.<br/>Dale una nueva vida.</div>
        <div className="hero-subtitle">TrueKit conecta personas que quieren dar una segunda oportunidad a lo que ya no usan. Trueque inteligente, economía circular y comunidad local.</div>
        <div className="hero-stats">
          <div className="hero-stat"><div className="hero-stat-value">2,847</div><div className="hero-stat-label">Intercambios</div></div>
          <div className="hero-stat"><div className="hero-stat-value">1,203</div><div className="hero-stat-label">Usuarios</div></div>
          <div className="hero-stat"><div className="hero-stat-value">347</div><div className="hero-stat-label">Árboles plantados</div></div>
          <div className="hero-stat"><div className="hero-stat-value">89%</div><div className="hero-stat-label">Satisfacción</div></div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }} className="stagger-2">
        <div>
          <h2 className="section-title">Explorar artículos</h2>
          <p className="section-subtitle">Encuentra lo que necesitas y ofrece lo que ya no usas</p>
        </div>
        <button className="btn-primary" onClick={() => setModal({ type: "publish" })}>
          + Publicar artículo
        </button>
      </div>

      <div className="search-bar stagger-3">
        <input className="search-input" placeholder="Buscar artículos, servicios..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <select className="form-input form-select" style={{ width: 160, padding: "10px 14px" }} value={selectedTier} onChange={e => setSelectedTier(e.target.value)}>
          <option value="all">Todos los valores</option>
          {VALUE_TIERS.map(t => <option key={t.id} value={t.id}>{t.label} ({t.range})</option>)}
        </select>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }} className="stagger-4">
        <button className={`filter-chip ${selectedCategory === "all" ? "active" : ""}`} onClick={() => setSelectedCategory("all")}>Todos</button>
        {CATEGORIES.map(c => (
          <button key={c.id} className={`filter-chip ${selectedCategory === c.id ? "active" : ""}`} onClick={() => setSelectedCategory(c.id)}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <div className="grid-3 stagger-5">
        {filteredProducts.map(product => (
          <div key={product.id} className="card" onClick={() => setModal({ type: "detail", product })}>
            <div className="product-image" style={{ background: `linear-gradient(135deg, ${CATEGORIES.find(c => c.id === product.category)?.color}15, ${CATEGORIES.find(c => c.id === product.category)?.color}08)` }}>
              <span className="product-category-tag" style={{ background: CATEGORIES.find(c => c.id === product.category)?.color }}>
                {CATEGORIES.find(c => c.id === product.category)?.label}
              </span>
              {product.image}
            </div>
            <div className="product-body">
              <div className="product-name">{product.name}</div>
              <div className="product-owner">
                {USER_LEVELS.slice().reverse().find(l => (product.ownerLevel || 1) >= l.level)?.icon} {product.owner}
                {product.rating && <span style={{ marginLeft: 4 }}><StarRating rating={product.rating} size={11} /></span>}
              </div>
              <div className="product-meta">
                <span className="product-condition">{product.condition}</span>
                <TokenBadge amount={product.tokens} size="sm" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p>No se encontraron artículos con esos filtros.</p>
        </div>
      )}
    </>
  );

  const ServicesPage = () => (
    <>
      <h2 className="section-title stagger-1">Servicios en campaña</h2>
      <p className="section-subtitle stagger-1">Servicios ofrecidos por usuarios por tiempo limitado. ¡No te los pierdas!</p>

      <div className="grid-2 stagger-2">
        {SAMPLE_SERVICES.map(s => (
          <div key={s.id} className="campaign-card">
            <div style={{ fontSize: 40, width: 64, height: 64, borderRadius: 16, background: "var(--green-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {s.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                por {s.provider} · {s.duration} · {s.spots} plazas
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <TokenBadge amount={s.tokens} size="sm" />
                <CountdownTimer endDate={s.endDate} />
              </div>
            </div>
            <button className="btn-secondary" style={{ flexShrink: 0, padding: "8px 16px", fontSize: 12 }} onClick={() => {
              if (userTokens >= s.tokens) {
                setUserTokens(prev => prev - s.tokens);
                showToast(`¡Te has inscrito a "${s.name}"! 🎉`);
              } else {
                showToast("No tienes suficientes Truecréditos");
              }
            }}>
              Inscribirse
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <h2 className="section-title stagger-3">Comercios locales</h2>
        <p className="section-subtitle stagger-3">Apoya al comercio de tu zona usando tus Truecréditos</p>
        <div className="grid-2 stagger-4">
          {LOCAL_BUSINESSES.map(b => (
            <div key={b.id} className="campaign-card">
              <div style={{ fontSize: 36, width: 56, height: 56, borderRadius: 14, background: "var(--sand-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {b.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{b.area}</div>
                <div style={{ fontSize: 13, color: "var(--green-700)", fontWeight: 500 }}>{b.offer}</div>
              </div>
              <button className="btn-primary" style={{ flexShrink: 0, padding: "8px 16px", fontSize: 12 }} onClick={() => {
                if (userTokens >= b.tokens) {
                  setUserTokens(prev => prev - b.tokens);
                  showToast(`¡Canjeado en ${b.name}! 🛍️`);
                } else showToast("No tienes suficientes Truecréditos");
              }}>
                Canjear
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const CollabPage = () => (
    <>
      <h2 className="section-title stagger-1">Colaboraciones e impacto</h2>
      <p className="section-subtitle stagger-1">Juntos construimos una comunidad más sostenible</p>

      <div className="grid-2" style={{ marginBottom: 32 }}>
        <div className="collab-card stagger-2">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 36 }}>🌿</span>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--green-800)" }}>BIOAlverde</h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Montequinto · Inserción sociolaboral</span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
            Proyecto que persigue la inserción sociolaboral de personas en situación o riesgo de exclusión social, sensibilizando e incrementando el consumo justo y sostenible.
          </p>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Tu donación:</span>
            <button className="filter-chip" onClick={() => { if (userTokens >= 5) { setUserTokens(p => p - 5); setUserXP(p => p + 15); if (!userBadges.includes("donator")) setUserBadges(p => [...p, "donator"]); showToast("¡Gracias por donar a BIOAlverde! 💚 +15 XP"); } else showToast("No tienes suficientes TC"); }}>5 TC</button>
            <button className="filter-chip" onClick={() => { if (userTokens >= 10) { setUserTokens(p => p - 10); setUserXP(p => p + 30); showToast("¡Donación de 10 TC a BIOAlverde! 💚 +30 XP"); } else showToast("No tienes suficientes TC"); }}>10 TC</button>
            <button className="filter-chip" onClick={() => { if (userTokens >= 20) { setUserTokens(p => p - 20); setUserXP(p => p + 60); showToast("¡Donación de 20 TC a BIOAlverde! 💚 +60 XP"); } else showToast("No tienes suficientes TC"); }}>20 TC</button>
          </div>
          <a href="https://bioalverde.com/quienes-somos-2/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "var(--green-600)", fontWeight: 500 }}>
            Más información →
          </a>
        </div>

        <div className="collab-card stagger-3" style={{ background: "linear-gradient(135deg, #F0F9FF, #E0F2FE)", borderColor: "#7DD3FC" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 36 }}>🌳</span>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#0369A1" }}>Planta un Árbol</h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>El pulmón de Dos Hermanas</span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
            En colaboración con el Ayuntamiento de Dos Hermanas y el proyecto "Sembrando Futuro" de reforestación participativa en la Dehesa.
          </p>
          <div style={{ background: "white", borderRadius: 12, padding: 14, marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: "#059669" }}>{treesPlanted}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>árboles plantados por ti</div>
          </div>
          <button className="btn-primary" style={{ width: "100%", background: "linear-gradient(135deg, #0369A1, #0284C7)" }} onClick={() => {
            if (userTokens >= 15) {
              setUserTokens(p => p - 15);
              setTreesPlanted(p => p + 1);
              setUserXP(p => p + 40);
              if (!userBadges.includes("tree_planter")) setUserBadges(p => [...p, "tree_planter"]);
              showToast("¡Has plantado un árbol! 🌳 +40 XP");
            } else showToast("Necesitas 15 TC para plantar un árbol");
          }}>
            🌱 Plantar un árbol (15 TC)
          </button>
          <a href="https://www.doshermanas.es/noticias/notas-de-prensa/Dos-Hermanas-impulsa-la-reforestacion-participativa-Sembrando-Futuro-en-la-Dehesa-dentro-del-proyecto-europeo-Rural-Voices-2030/" target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 10, fontSize: 13, color: "#0369A1", fontWeight: 500 }}>
            Ver proyecto →
          </a>
        </div>
      </div>

      <div className="stagger-4">
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>🚌 Movilidad sostenible</h3>
        <div className="transport-badge" style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 32 }}>🎫</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Premio por transporte público</div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 4 }}>
              Al cerrar un trueque en mano, sube tu ticket o registro de transporte público. Ganarás 3 TC extra y XP por cada intercambio sostenible.
            </p>
          </div>
          <button className="btn-secondary" style={{ flexShrink: 0 }} onClick={() => {
            setUserTokens(p => p + 3);
            setUserXP(p => p + 10);
            showToast("¡+3 TC y +10 XP por usar transporte público! 🚌");
          }}>
            Subir ticket
          </button>
        </div>
      </div>

      <div className="stagger-5">
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>🏫 Desarrollo colaborativo</h3>
        <div style={{ background: "white", border: "1px solid var(--sand-200)", borderRadius: "var(--radius)", padding: 20 }}>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            El desarrollo técnico y mantenimiento de TrueKit se realiza en colaboración con los ciclos de desarrollo de aplicaciones del instituto local y junto al Ayuntamiento en programas de inclusión social y laboral. Si se quisiera escalar a nivel nacional, colaboraríamos con empresas de mensajería eco para cubrir los envíos.
          </p>
        </div>
      </div>
    </>
  );

  const ProfilePage = () => (
    <>
      <div className="stagger-1" style={{ background: "linear-gradient(135deg, var(--green-900), #0A4A3A)", borderRadius: 24, padding: 32, color: "white", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "radial-gradient(circle, rgba(167,243,208,0.15), transparent 70%)" }} />
        <div style={{ display: "flex", gap: 20, alignItems: "center", position: "relative" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #34D399, #6EE7B7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 700, border: "3px solid rgba(255,255,255,0.3)" }}>
            T
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>TrueKiter</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, opacity: 0.85 }}>
              <span>{currentLevel.icon} Nivel {currentLevel.level}: {currentLevel.name}</span>
              <span>·</span>
              <span>{userXP} XP</span>
            </div>
            {nextLevel && (
              <div style={{ marginTop: 10, maxWidth: 280 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.7, marginBottom: 4 }}>
                  <span>{currentLevel.name}</span><span>{nextLevel.name}</span>
                </div>
                <ProgressBar value={userXP - currentLevel.min} max={nextLevel.min - currentLevel.min} color="#6EE7B7" height={8} />
              </div>
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "#6EE7B7" }}>{userTokens}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Truecréditos</div>
          </div>
        </div>
      </div>

      <div className="tab-group stagger-2">
        <button className={`tab-item ${profileTab === "badges" ? "active" : ""}`} onClick={() => setProfileTab("badges")}>🏅 Insignias</button>
        <button className={`tab-item ${profileTab === "history" ? "active" : ""}`} onClick={() => setProfileTab("history")}>📋 Historial</button>
        <button className={`tab-item ${profileTab === "myitems" ? "active" : ""}`} onClick={() => setProfileTab("myitems")}>📦 Mis artículos</button>
        <button className={`tab-item ${profileTab === "reviews" ? "active" : ""}`} onClick={() => setProfileTab("reviews")}>⭐ Reseñas</button>
      </div>

      {profileTab === "badges" && (
        <div className="stagger-3">
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
            Desbloquea insignias realizando intercambios y acciones éticas. Las insignias te dan acceso a servicios exclusivos y mejores condiciones en el uso de Truecréditos.
          </p>
          <div className="grid-4">
            {BADGES.map(badge => (
              <div key={badge.id} style={{
                background: "white", border: userBadges.includes(badge.id) ? "2px solid var(--green-500)" : "1px solid var(--sand-200)",
                borderRadius: 16, padding: 20, textAlign: "center", transition: "all 0.3s"
              }}>
                <Badge badge={badge} earned={userBadges.includes(badge.id)} />
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {profileTab === "history" && (
        <div className="stagger-3">
          {tradeHistory.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>Aún no has realizado intercambios.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {tradeHistory.map(t => (
                <div key={t.id} style={{ background: "white", border: "1px solid var(--sand-200)", borderRadius: 14, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.gave} ⇄ {t.received}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>con {t.partner} · {t.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {t.tokensExchanged > 0 ? (
                      <span style={{ color: "#059669", fontWeight: 600, fontSize: 14 }}>+{t.tokensExchanged} TC</span>
                    ) : (
                      <span style={{ color: "#DC2626", fontWeight: 600, fontSize: 14 }}>{t.tokensExchanged} TC</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {profileTab === "myitems" && (
        <div className="stagger-3">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{myProducts.length} artículos publicados</span>
            <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 12 }} onClick={() => setModal({ type: "publish" })}>+ Publicar</button>
          </div>
          {myProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📦</div>
              <p>No tienes artículos publicados aún.</p>
              <button className="btn-secondary" style={{ marginTop: 12 }} onClick={() => setModal({ type: "publish" })}>Publicar tu primer artículo</button>
            </div>
          ) : (
            <div className="grid-3">
              {myProducts.map(p => (
                <div key={p.id} className="card">
                  <div className="product-image" style={{ background: `linear-gradient(135deg, ${CATEGORIES.find(c => c.id === p.category)?.color}15, ${CATEGORIES.find(c => c.id === p.category)?.color}08)` }}>
                    {CATEGORIES.find(c => c.id === p.category)?.icon || "📦"}
                  </div>
                  <div className="product-body">
                    <div className="product-name">{p.name}</div>
                    <div className="product-meta">
                      <span className="product-condition">{p.condition}</span>
                      <TokenBadge amount={p.tokens} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {profileTab === "reviews" && (
        <div className="stagger-3">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { author: "María G.", rating: 5, text: "Excelente intercambio, todo como se describió. ¡Muy recomendable!", date: "2026-02-01" },
              { author: "Pedro M.", rating: 4, text: "Buen trato, puntual y amable. El producto en buen estado.", date: "2026-01-28" },
              { author: "Laura M.", rating: 5, text: "Encantada con la clase de yoga. Volveré a intercambiar con este usuario.", date: "2026-01-20" },
            ].map((r, i) => (
              <div key={i} className="review-card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.author}</div>
                  <StarRating rating={r.rating} size={13} />
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{r.text}</p>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>{r.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const HowItWorksPage = () => (
    <>
      <h2 className="section-title stagger-1">¿Cómo funciona TrueKit?</h2>
      <p className="section-subtitle stagger-1">Todo lo que necesitas saber sobre la plataforma</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
        {[
          { step: "1", title: "Publica tu artículo o servicio", desc: "Sube lo que ya no necesitas. Nuestro cuestionario de tasación estimará el valor en Truecréditos (TC) y lo clasificará automáticamente con productos de valor similar.", icon: "📸" },
          { step: "2", title: "Encuentra lo que buscas", desc: "Explora artículos y servicios por categoría o valor. Puedes agrupar varios de tus artículos en una misma propuesta de trueque para compensar diferencias de valor.", icon: "🔍" },
          { step: "3", title: "Propón un trueque", desc: "Selecciona tus artículos y, si hay diferencia de valor, puedes añadir Truecréditos para equilibrarlo. Las diferencias están limitadas para evitar la especulación.", icon: "🤝" },
          { step: "4", title: "Cierra el trato", desc: "Al aceptar ambas partes, se generan los Truecréditos correspondientes si hay diferencia de valor. Puedes cerrar el intercambio en mano o, a nivel nacional, mediante mensajería eco.", icon: "✅" },
          { step: "5", title: "Valora y crece", desc: "Deja una reseña, gana XP y desbloquea insignias. Cuantos más intercambios y acciones éticas hagas, mayor será tu nivel y accederás a servicios exclusivos.", icon: "⭐" },
        ].map((s, i) => (
          <div key={i} className={`stagger-${i + 2}`} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, flexShrink: 0,
              background: "linear-gradient(135deg, var(--green-800), var(--green-700))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700
            }}>{s.step}</div>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{s.icon} {s.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>💡 Truecréditos (TC)</h3>
        <div style={{ background: "white", border: "1px solid var(--sand-200)", borderRadius: "var(--radius)", padding: 24 }}>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>
            Los Truecréditos son la unidad que equilibra las diferencias de valor entre objetos. Se priorizan el flujo frente a la acumulación: no son una moneda, sino un facilitador del trueque justo. Puedes usarlos para igualar diferencias, acceder a servicios en campaña, apoyar iniciativas locales, o plantar árboles.
          </p>
          <div className="grid-4">
            {VALUE_TIERS.map(t => (
              <div key={t.id} style={{ textAlign: "center", padding: 16, background: "var(--sand-50)", borderRadius: 12, border: `2px solid ${t.color}33` }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: t.color }}>{t.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{t.range}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>🏅 Niveles de usuario</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {USER_LEVELS.map(l => (
            <div key={l.level} style={{
              background: userXP >= l.min ? "var(--green-50)" : "white",
              border: userXP >= l.min ? "2px solid var(--green-500)" : "1px solid var(--sand-200)",
              borderRadius: 14, padding: "14px 20px", textAlign: "center", minWidth: 120
            }}>
              <div style={{ fontSize: 28 }}>{l.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>Nivel {l.level}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{l.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{l.min}+ XP</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div className="app-container">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-logo" style={{ cursor: "pointer" }} onClick={() => setPage("home")}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="TrueKit" style={{ height: 42, borderRadius: 8 }} />
            <span>TrueKit</span>
          </div>
          <div className="top-bar-user">
            <div className="top-bar-tokens">
              <span style={{ color: "#6EE7B7" }}>◈</span> {userTokens} TC
            </div>
            <div className="top-bar-avatar" onClick={() => setPage("profile")}>T</div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="nav-bar">
          {[
            { id: "home", label: "Explorar", icon: "🏠" },
            { id: "services", label: "Servicios y Campañas", icon: "⚡" },
            { id: "collab", label: "Colaboraciones", icon: "🤝" },
            { id: "profile", label: "Mi Perfil", icon: "👤" },
            { id: "howto", label: "Cómo funciona", icon: "❓" },
          ].map(nav => (
            <button key={nav.id} className={`nav-item ${page === nav.id ? "active" : ""}`} onClick={() => setPage(nav.id)}>
              {nav.icon} {nav.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="main-content">
          {page === "home" && <HomePage />}
          {page === "services" && <ServicesPage />}
          {page === "collab" && <CollabPage />}
          {page === "profile" && <ProfilePage />}
          {page === "howto" && <HowItWorksPage />}
        </main>

        {/* Footer */}
        <footer style={{ background: "var(--green-900)", color: "white", padding: "24px 20px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="TrueKit" style={{ height: 36, borderRadius: 6 }} />
            <span style={{ color: "#6EE7B7" }}>TrueKit</span>
          </div>
          <p style={{ fontSize: 12, opacity: 0.6, maxWidth: 500, margin: "0 auto", lineHeight: 1.5 }}>
            Fomentando la economía circular, la sostenibilidad y el respeto al medio ambiente en Dos Hermanas y Montequinto.
          </p>
          <p style={{ fontSize: 11, opacity: 0.4, marginTop: 12 }}>
            En colaboración con BIOAlverde, Ayuntamiento de Dos Hermanas y comercios locales.
          </p>
        </footer>

        {/* Modals */}
        {modal?.type === "publish" && <PublishModal />}
        {modal?.type === "detail" && <ProductDetailModal product={modal.product} />}
        {modal?.type === "trade" && <TradeModal product={modal.product} />}

        {/* Toast */}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
