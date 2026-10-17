import { useState, useEffect, useCallback } from "react";
import { Star as FaStar, X as FaXmark, ChevronLeft as FaChevronLeft, ChevronRight as FaChevronRight, CheckCircle2 as FaCircleCheck, ArrowRight as FaArrowRight, AlertTriangle as FaTriangleExclamation, Sparkles as FaWandMagicSparkles, Mic as FaMicrophone, Palette as FaPalette, Puzzle as FaPuzzlePiece, Bot as FaRobot, PenTool as FaPenNib, Video as FaVideo } from "lucide-react";
import events from "../data/events";
import { RULES, GROUPS } from "../data/rules";

// Interests -> matching event ids (used by the "Find your event" picker)
const INTERESTS = [
  { key: "stage", label: "I love performing", Icon: FaMicrophone, ids: [2, 10, 11, 17, 18] },
  { key: "craft", label: "I'm creative with my hands", Icon: FaPalette, ids: [3, 7, 12] },
  { key: "brain", label: "I love puzzles & quizzes", Icon: FaPuzzlePiece, ids: [1, 5, 13, 4] },
  { key: "ai", label: "I'm into AI & tech", Icon: FaRobot, ids: [13, 14, 15, 4] },
  { key: "words", label: "I love words", Icon: FaPenNib, ids: [6, 11, 16] },
  { key: "media", label: "I make content", Icon: FaVideo, ids: [8, 9, 14, 15] },
];
const GRAD = {
  Stage: "linear-gradient(135deg,#6d3df0,#4f7cff)",
  "Art & Craft": "linear-gradient(135deg,#8b5cf6,#c06bff)",
  Writing: "linear-gradient(135deg,#2563eb,#36c6ff)",
  "Quiz & Logic": "linear-gradient(135deg,#3b4fe0,#4f7cff)",
  "AI & Digital": "linear-gradient(135deg,#0ea5c9,#36e4ff)",
};

function EventExplorer({ onSelect }) {
  const [group, setGroup] = useState("All");
  const [picked, setPicked] = useState([]);
  const [sheet, setSheet] = useState(null); // event id

  const matched = new Set(INTERESTS.filter((i) => picked.includes(i.key)).flatMap((i) => i.ids));
  const list = RULES.filter((r) => group === "All" || r.group === group);
  const current = sheet ? RULES.find((r) => r.id === sheet) : null;
  const currentEv = sheet ? events.find((e) => e.id === sheet) : null;

  const toggle = (k) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  const step = useCallback((d) => setSheet((id) => ((id - 1 + d + 18) % 18) + 1), []);
  const register = (name) => {
    onSelect(name);
    setSheet(null);
    setTimeout(() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  useEffect(() => {
    if (!sheet) return undefined;
    const key = (e) => {
      if (e.key === "Escape") setSheet(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [sheet, step]);

  return (
    <section id="events" className="explorer">
      <div className="section-title">
        <h2><FaStar /> 18 EVENTS. ONE STAGE.</h2>
        <p>Find where you shine, then tap any card to see the rules</p>
      </div>

      <div className="finder">
        <div className="finder-head"><FaWandMagicSparkles /> Find your event in 10 seconds</div>
        <div className="finder-chips">
          {INTERESTS.map(({ key, label, Icon }) => (
            <button key={key} type="button" className={picked.includes(key) ? "on" : ""} onClick={() => toggle(key)}>
              <Icon /> {label}
            </button>
          ))}
        </div>
        <p className="finder-result">
          {picked.length === 0
            ? "Tap what describes you. We'll light up your best events."
            : `${matched.size} event${matched.size === 1 ? "" : "s"} match you. They are highlighted below.`}
        </p>
      </div>

      <div className="rule-filters" role="tablist" aria-label="Filter events">
        {GROUPS.map((g) => (
          <button key={g} type="button" className={g === group ? "on" : ""} onClick={() => setGroup(g)}>{g}</button>
        ))}
      </div>

      <div className="ev-grid">
        {list.map((r) => {
          const ev = events.find((e) => e.id === r.id);
          const Icon = ev.icon;
          const hit = matched.has(r.id);
          return (
            <button
              type="button"
              key={r.id}
              className={`ev-tile ${hit ? "hit" : ""} ${picked.length && !hit ? "dim" : ""}`}
              style={{ "--g": GRAD[r.group] }}
              onClick={() => setSheet(r.id)}
            >
              <span className="ev-num">{String(r.id).padStart(2, "0")}</span>
              {r.proposed && <span className="ev-ribbon">Proposed</span>}
              <span className="ev-ico"><Icon /></span>
              <strong>{ev.name}</strong>
              <span className="ev-meta">{r.chips.slice(0, 2).join(" · ")}</span>
              <span className="ev-go">View rules <FaArrowRight /></span>
            </button>
          );
        })}
      </div>

      {current && (
        <div className="sheet-wrap" onClick={() => setSheet(null)}>
          <div className="sheet" role="dialog" aria-modal="true" aria-label={currentEv.name} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-top" style={{ background: GRAD[current.group] }}>
              <button type="button" className="sheet-x" aria-label="Close" onClick={() => setSheet(null)}><FaXmark /></button>
              <span className="sheet-ico">{(() => { const I = currentEv.icon; return <I />; })()}</span>
              <small>EVENT {String(current.id).padStart(2, "0")} OF 18 · {current.type}</small>
              <h3>{currentEv.name}</h3>
              <div className="sheet-chips">
                {current.proposed && <em className="badge-prop">Proposed</em>}
                {current.chips.map((c) => <em key={c}>{c}</em>)}
              </div>
            </div>
            <div className="sheet-body">
              <ul>
                {current.rules.map((t) => (
                  <li key={t}><FaCircleCheck /> <span>{t}</span></li>
                ))}
              </ul>
              <p className="judging"><b>Judging focus:</b> {current.judging}</p>
              {current.proposed && (
                <p className="prop-note"><FaTriangleExclamation /> Proposed format, subject to organising committee approval.</p>
              )}
            </div>
            <div className="sheet-foot">
              <button type="button" className="sheet-nav" aria-label="Previous event" onClick={() => step(-1)}><FaChevronLeft /></button>
              <button type="button" className="cta" onClick={() => register(currentEv.name)}>
                Register for this event <FaArrowRight />
              </button>
              <button type="button" className="sheet-nav" aria-label="Next event" onClick={() => step(1)}><FaChevronRight /></button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default EventExplorer;
