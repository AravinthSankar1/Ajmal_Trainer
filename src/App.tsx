import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import {
  ArrowRight, Activity, Flame, Calculator,
  Mail, MessageCircle, MapPin, Languages, Award
} from "lucide-react";
import "./App.css";

import heroImg from "./assets/color.jpg";
import backImg from "./assets/back.jpg";
import bwflexImg from "./assets/bwflex.jpg";
import selfieImg from "./assets/selfie.jpg";
import flex2Img from "./assets/flex2.jpg";

type Row = { title: string; meta: string };

const CERT_ROWS: Row[] = [
  { title: "REPS India — Personal Trainer", meta: "Category A · Member REPSIN010320 · Valid till Feb 2027" },
  { title: "Diploma in Personal Training", meta: "Leaders Fitness Academy · PD:Approval accredited · Jan 2026" },
  { title: "General Fitness Trainer", meta: "Skill India / NCVET · NSQF Level 4 · 450 training hours" },
  { title: "Trauma Response", meta: "Australian Lifesaving Academy, NSW · Valid till Oct 2026" },
];

const SERVICE_ROWS: Row[] = [
  { title: "1-on-1 Personal Training", meta: "In-person sessions with form correction, progressive overload and weekly check-ins." },
  { title: "Fat-Loss Transformations", meta: "Structured cuts with training + nutrition working together, tracked week by week." },
  { title: "Strength & Hypertrophy", meta: "Programs built to add size and raw strength with proper periodization." },
  { title: "Diet & Nutrition Coaching", meta: "Personalised meal structuring around your goals, schedule and food preferences." },
  { title: "Online / DM Coaching", meta: "Remote programming and check-ins for clients training anywhere in the world." },
];

const CERT_TICKER = [
  "REPS India — Category A Personal Trainer",
  "Diploma in Personal Training — Leaders Fitness Academy",
  "General Fitness Trainer — Skill India / NCVET, Level 4",
  "Trauma Response — Australian Lifesaving Academy, NSW",
  "PD:Approval Accredited",
];

// Reusable spring-animated counter
function AnimatedStat({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // A simple timeout-based animation for stat numbers when mounted
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(ease * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="stat"
    >
      <div className="num">{displayValue}{suffix}</div>
      <div className="lbl">{label}</div>
    </motion.div>
  );
}

function RowList({ rows }: { rows: Row[] }) {
  return (
    <div className="list-rows">
      {rows.map((r, i) => (
        <motion.div
          className="row"
          key={r.title}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <h3>{r.title}</h3>
          <p>{r.meta}</p>
        </motion.div>
      ))}
    </div>
  );
}

type MacroResult = { calories: number; tdee: number; protein: number; carbs: number; fat: number; label: string };

function MacroCalculator() {
  const [sex, setSex] = useState<"m" | "f">("m");
  const [age, setAge] = useState(24);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(172);
  const [goal, setGoal] = useState<"cut" | "maintain" | "bulk">("cut");
  const [activity, setActivity] = useState(1.55);
  const [result, setResult] = useState<MacroResult | null>(null);

  const calculate = () => {
    if (!age || !weight || !height) return;
    const bmr = sex === "m" ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;
    const tdee = bmr * activity;
    const calories = goal === "cut" ? tdee - 400 : goal === "bulk" ? tdee + 300 : tdee;
    const protein = Math.round(weight * 2);
    const fat = Math.round((calories * 0.25) / 9);
    const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
    const label = goal === "cut" ? "Fat-loss calories" : goal === "bulk" ? "Muscle-gain calories" : "Maintenance calories";
    setResult({ calories: Math.round(calories), tdee: Math.round(tdee), protein, carbs, fat, label });
  };

  return (
    <div className="calc-grid">
      <div className="calc-form">
        <label>Sex</label>
        <select value={sex} onChange={(e) => setSex(e.target.value as "m" | "f")}>
          <option value="m">Male</option>
          <option value="f">Female</option>
        </select>
        <div className="row2">
          <div>
            <label>Age</label>
            <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
          </div>
          <div>
            <label>Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
          </div>
        </div>
        <div className="row2">
          <div>
            <label>Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
          </div>
          <div>
            <label>Goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value as typeof goal)}>
              <option value="cut">Fat loss</option>
              <option value="maintain">Maintain</option>
              <option value="bulk">Muscle gain</option>
            </select>
          </div>
        </div>
        <label>Activity level</label>
        <select value={activity} onChange={(e) => setActivity(Number(e.target.value))}>
          <option value={1.2}>Sedentary (desk job)</option>
          <option value={1.375}>Light exercise 1–3x/wk</option>
          <option value={1.55}>Moderate 3–5x/wk</option>
          <option value={1.725}>Heavy training 6–7x/wk</option>
        </select>
        <button className="calc-btn" onClick={calculate}>
          Calculate my macros <Calculator size={18} />
        </button>
      </div>
      <div className="calc-result">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="rlabel">{result.label}</div>
              <div className="rnum">{result.calories}</div>
              <div className="rsub">kcal / day · TDEE {result.tdee}</div>
              <div className="divider" />
              <div className="macro-row"><span>Protein</span><b>{result.protein} g</b></div>
              <div className="macro-row"><span>Carbs</span><b>{result.carbs} g</b></div>
              <div className="macro-row"><span>Fat</span><b>{result.fat} g</b></div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="calc-empty"
            >
              <Activity size={32} color="var(--muted)" style={{ margin: "0 auto 16px", display: "block" }} />
              <p>Fill in your details and hit calculate — Ajmal builds every real plan around numbers like these.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Mouse Glow logic
  const mouseX = useSpring(0, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > lastY && currentY > 140);
      lastY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.div
        className="glow"
        style={{ left: mouseX, top: mouseY }}
      />

      <header className={`nav ${scrolled ? 'hide' : ''}`}>
        <div className="brand">AJMAL <span>ALI</span></div>
        <a href="#contact" className="cta-mini">
          DM to train <MessageCircle size={14} />
        </a>
      </header>

      <section className="hero">
        <motion.img
          style={{ y: heroY }}
          className="hero-img"
          src={heroImg}
          alt="Ajmal Ali, certified personal trainer, flexing in the gym"
        />
        <div className="hero-fade" />
        <motion.div style={{ opacity: heroOpacity }} className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="eyebrow"
          >
            <MapPin size={14} />
            <span>REPS INDIA CERTIFIED · KOLLAM, KERALA</span>
          </motion.div>
          <h1 className="display">
            <span className="line">
              <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>
                BUILT BY
              </motion.span>
            </span>
            <span className="line">
              <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.35, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>
                DISCIPLINE
              </motion.span>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
            className="hero-sub"
          >
            Personal training, fat-loss transformations and strength coaching from a REPS India registered trainer. Real programs, real accountability, real results.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}
            className="hero-badges"
          >
            <span><MapPin size={16} /> Online coaching — anyone, anywhere</span>
            <span><Award size={16} /> Affordable, no-nonsense pricing</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.8 }}
            className="hero-actions"
          >
            <a href="#contact" className="btn btn-flame">
              Start your transformation <ArrowRight size={18} />
            </a>
            <a href="#certs" className="btn btn-outline">
              See certifications
            </a>
          </motion.div>
        </motion.div>
      </section>

      <div className="stats">
        <AnimatedStat value={4} suffix="+" label="Certifications" />
        <AnimatedStat value={450} suffix="hrs" label="Formal training" />
        <AnimatedStat value={4} label="Languages spoken" />
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="stat"
        >
          <div className="num">A</div><div className="lbl">REPS India category</div>
        </motion.div>
      </div>

      <div className="marquee-wrap">
        <div className="marquee">
          {[...CERT_TICKER, ...CERT_TICKER].map((c, i) => (
            <span className="item" key={i}><span className="dot" /><b>{c}</b></span>
          ))}
        </div>
      </div>

      <section className="wrap">
        <div className="about-grid">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="about-img"
          >
            <img src={backImg} alt="Ajmal Ali back double biceps pose" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="about-text"
          >
            <div className="kicker"><Flame size={16} /> The coach</div>
            <h2 className="display">Trained. Certified. Built for your goals.</h2>
            <p>Ajmal Ali is a REPS India registered Category A Personal Trainer based in Kollam, Kerala, holding a Diploma in Personal Training from Leaders Fitness Academy and a Government-recognised General Fitness Trainer qualification under the Skill India / NCVET framework.</p>
            <p>Beyond the weight room, he's trained in trauma response and emergency care through the Australian Lifesaving Academy, NSW — so every session is coached with both intensity and safety in mind. Training in person in Kollam, or online — he coaches clients from anywhere in the world.</p>
            <div className="lang-row">
              <span><Languages size={14} /> English</span>
              <span><Languages size={14} /> Malayalam</span>
              <span><Languages size={14} /> Tamil</span>
              <span><Languages size={14} /> Hindi</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="wrap" id="certs">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="kicker"><Award size={16} /> Credentials</div>
          <h2 className="display">Every certification, verified.</h2>
          <p className="section-sub">Four recognised qualifications across training, nutrition guidance and emergency response.</p>
        </motion.div>
        <RowList rows={CERT_ROWS} />
      </section>

      <section className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="kicker"><Activity size={16} /> What you get</div>
          <h2 className="display">Coaching built around you, not a template.</h2>
          <p className="section-sub">Sessions are priced to stay affordable — honest coaching, no inflated packages. Train in Kollam or online from anywhere in the world.</p>
        </motion.div>
        <RowList rows={SERVICE_ROWS} />
      </section>

      <section className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="kicker"><MapPin size={16} /> In the gym</div>
          <h2 className="display">This is what the work looks like.</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="gallery"
        >
          <figure><img src={flex2Img} alt="Ajmal Ali flexing his biceps in the gym" /></figure>
          <figure><img src={heroImg} alt="Ajmal Ali gym pose" /></figure>
          <figure><img src={backImg} alt="Ajmal Ali back pose" /></figure>
          <figure><img src={bwflexImg} alt="Ajmal Ali studio flex" /></figure>
          <figure><img src={selfieImg} alt="Ajmal Ali gym selfie" /></figure>
        </motion.div>
      </section>

      <section className="wrap">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="diet"
        >
          <div className="kicker"><Activity size={16} /> Nutrition philosophy</div>
          <h2 className="display">Training gets you there.<br />Food keeps you there.</h2>
          <div className="diet-grid">
            <div className="diet-col">
              <h4>Every plan is built around</h4>
              <ul>
                <li><span>Protein target</span><b>1.6–2.2g / kg</b></li>
                <li><span>Meal timing</span><b>Around training window</b></li>
                <li><span>Hydration</span><b>3–4L water daily</b></li>
                <li><span>Whole foods first</span><b>Supplements second</b></li>
              </ul>
            </div>
            <div className="diet-col">
              <h4>Sample training-day structure</h4>
              <ul>
                <li><span>Pre-workout</span><b>Carbs + light protein</b></li>
                <li><span>Post-workout</span><b>Protein + fast carbs</b></li>
                <li><span>Rest days</span><b>Slight calorie taper</b></li>
                <li><span>Cheat meals</span><b>Planned, not banned</b></li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="calc"
        >
          <div className="kicker"><Calculator size={16} /> Try it yourself</div>
          <h2 className="display">Know your numbers before you DM.</h2>
          <MacroCalculator />
        </motion.div>
      </section>

      <section className="wrap" id="contact">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="contact"
        >
          <div>
            <div className="display">TRAIN WITH</div>
            <h2 className="display" >AJMAL ALI</h2>
            <p>DM to book your first session, ask about online coaching, or check pricing — wherever you're training from.</p>
            <div className="btns">
              <a className="btn btn-flame" href="https://wa.me/917306057936" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={20} /> WhatsApp: +91 73060 57936
              </a>
              <a className="btn btn-outline" href="mailto:ajmalaliedamon@gmail.com">
                <Mail size={20} /> Email me
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <footer>Based in Kollam, Kerala · Coaching clients worldwide online · REPS India Member REPSIN010320</footer>
    </>
  );
}
