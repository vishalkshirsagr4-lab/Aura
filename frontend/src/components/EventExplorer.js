import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Star as FaStar,
  X as FaXmark,
  ChevronLeft as FaChevronLeft,
  ChevronRight as FaChevronRight,
  CheckCircle2 as FaCircleCheck,
  ArrowRight as FaArrowRight,
  AlertTriangle as FaTriangleExclamation,
  Sparkles as FaWandMagicSparkles,
  Mic as FaMicrophone,
  Palette as FaPalette,
  Puzzle as FaPuzzlePiece,
  Bot as FaRobot,
  PenTool as FaPenNib,
  Video as FaVideo,
  Search,
} from "lucide-react";
import events from "../data/events";
import { RULES, GROUPS } from "../data/rules";

// Interests -> matching event ids
const INTERESTS = [
  { key: "stage", label: "Performing Arts", Icon: FaMicrophone, ids: [2, 10, 11, 17, 18] },
  { key: "craft", label: "Creative & Design", Icon: FaPalette, ids: [3, 7, 12] },
  { key: "brain", label: "Quizzes & Logic", Icon: FaPuzzlePiece, ids: [1, 5, 13, 4] },
  { key: "ai", label: "AI & Tech", Icon: FaRobot, ids: [13, 14, 15, 4] },
  { key: "words", label: "Writing & Speech", Icon: FaPenNib, ids: [6, 11, 16] },
  { key: "media", label: "Media & Reels", Icon: FaVideo, ids: [8, 9, 14, 15] },
];

const GROUP_GRADIENTS = {
  Stage: "linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(99, 102, 241, 0.9))",
  "Art & Craft": "linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(192, 107, 255, 0.9))",
  Writing: "linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(54, 198, 255, 0.9))",
  "Quiz & Logic": "linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(34, 211, 238, 0.9))",
  "AI & Digital": "linear-gradient(135deg, rgba(34, 211, 238, 0.9), rgba(167, 243, 208, 0.9))",
};

function EventExplorer({ onSelect }) {
  const [group, setGroup] = useState("All");
  const [picked, setPicked] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sheet, setSheet] = useState(null); // current event id in modal

  const matchedIds = useMemo(() => {
    return new Set(
      INTERESTS.filter((i) => picked.includes(i.key)).flatMap((i) => i.ids)
    );
  }, [picked]);

  const filteredRules = useMemo(() => {
    return RULES.filter((r) => {
      const ev = events.find((e) => e.id === r.id);
      const matchesGroup = group === "All" || r.group === group;
      const matchesSearch =
        !searchQuery.trim() ||
        (ev && ev.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.chips && r.chips.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesGroup && matchesSearch;
    });
  }, [group, searchQuery]);

  const currentRule = sheet ? RULES.find((r) => r.id === sheet) : null;
  const currentEv = sheet ? events.find((e) => e.id === sheet) : null;

  const toggleInterest = (k) =>
    setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const stepModal = useCallback(
    (dir) => {
      setSheet((id) => {
        const nextId = ((id - 1 + dir + 18) % 18) + 1;
        return nextId;
      });
    },
    []
  );

  const handleRegisterFromModal = (name) => {
    onSelect(name);
    setSheet(null);
    setTimeout(() => {
      const target = document.getElementById("register");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  useEffect(() => {
    if (!sheet) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setSheet(null);
      if (e.key === "ArrowRight") stepModal(1);
      if (e.key === "ArrowLeft") stepModal(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sheet, stepModal]);

  return (
    <section id="events" className="explorer-section">
      <div className="section-header">
        <div className="section-badge">
          <FaStar size={14} />
          <span>COMPETITIONS & EVENTS</span>
        </div>
        <h2>18 Events. One Stage. Your Arena.</h2>
        <p className="section-subtitle">
          Explore individual and team events. Click any card for detailed rules, timing, and judging criteria.
        </p>
      </div>

      {/* Quick Match Finder */}
      <div className="finder-box">
        <div className="finder-header">
          <FaWandMagicSparkles className="finder-sparkle" size={17} />
          <span>Quick Match: Find your best event in 10 seconds</span>
        </div>
        <div className="finder-chips" role="group" aria-label="Interests selector">
          {INTERESTS.map(({ key, label, Icon }) => {
            const isSelected = picked.includes(key);
            return (
              <button
                key={key}
                type="button"
                className={`finder-chip ${isSelected ? "selected" : ""}`}
                onClick={() => toggleInterest(key)}
                aria-pressed={isSelected}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
        <p className="finder-status">
          {picked.length === 0
            ? "Tap an interest above to highlight matching competitions."
            : `${matchedIds.size} event${matchedIds.size === 1 ? "" : "s"} match your passions. Highlighted below.`}
        </p>
      </div>

      {/* Controls: Search + Group Filter Pills */}
      <div className="explorer-controls">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search events (e.g., Quiz, Dance, AI...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search events"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <FaXmark size={14} />
            </button>
          )}
        </div>

        <div className="category-pills" role="tablist" aria-label="Filter events by category">
          {GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              role="tab"
              aria-selected={g === group}
              className={`cat-pill ${g === group ? "active" : ""}`}
              onClick={() => setGroup(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="events-grid">
        {filteredRules.length === 0 ? (
          <div className="events-empty-state">
            <p>No events found matching "{searchQuery}".</p>
            <button
              type="button"
              className="btn-secondary small"
              onClick={() => {
                setSearchQuery("");
                setGroup("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredRules.map((r) => {
            const ev = events.find((e) => e.id === r.id);
            const Icon = ev.icon;
            const isHit = matchedIds.has(r.id);
            const isDimmed = picked.length > 0 && !isHit;

            return (
              <article
                key={r.id}
                className={`event-card ${isHit ? "highlight" : ""} ${isDimmed ? "dimmed" : ""}`}
                onClick={() => setSheet(r.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSheet(r.id);
                  }
                }}
                aria-label={`View details for ${ev.name}`}
              >
                <div className="event-card-head">
                  <span className="event-number">
                    #{String(r.id).padStart(2, "0")}
                  </span>
                  <span className="event-group-tag">{r.group}</span>
                  {r.proposed && <span className="event-proposed-badge">Proposed</span>}
                </div>

                <div className="event-icon-box">
                  <Icon size={24} />
                </div>

                <h3 className="event-name">{ev.name}</h3>

                <div className="event-tags">
                  {r.chips.slice(0, 2).map((chip) => (
                    <span key={chip} className="event-mini-tag">
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="event-card-footer">
                  <span className="view-rules-link">
                    <span>Rules & Format</span>
                    <FaArrowRight size={14} />
                  </span>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Event Detail Modal Sheet */}
      {currentRule && currentEv && (
        <div className="sheet-backdrop" onClick={() => setSheet(null)}>
          <div
            className="sheet-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={currentEv.name}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="sheet-header"
              style={{ background: GROUP_GRADIENTS[currentRule.group] || GROUP_GRADIENTS.Stage }}
            >
              <button
                type="button"
                className="sheet-close-btn"
                aria-label="Close dialog"
                onClick={() => setSheet(null)}
              >
                <FaXmark size={18} />
              </button>

              <div className="sheet-header-content">
                <span className="sheet-icon-large">
                  {(() => {
                    const I = currentEv.icon;
                    return <I size={28} />;
                  })()}
                </span>
                <span className="sheet-meta-num">
                  EVENT #{String(currentRule.id).padStart(2, "0")} OF 18 · {currentRule.type}
                </span>
                <h3 className="sheet-title">{currentEv.name}</h3>

                <div className="sheet-badges">
                  {currentRule.proposed && (
                    <span className="badge-proposed">Proposed</span>
                  )}
                  {currentRule.chips.map((c) => (
                    <span key={c} className="sheet-chip-item">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="sheet-body">
              <h4 className="sheet-section-title">Official Guidelines & Rules</h4>
              <ul className="sheet-rules-list">
                {currentRule.rules.map((rule) => (
                  <li key={rule}>
                    <FaCircleCheck size={16} className="rule-check-icon" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>

              <div className="sheet-judging-box">
                <b>Judging Criteria:</b>
                <p>{currentRule.judging}</p>
              </div>

              {currentRule.proposed && (
                <div className="sheet-proposed-note">
                  <FaTriangleExclamation size={16} />
                  <span>
                    Proposed event format is subject to confirmation by the organizing committee.
                  </span>
                </div>
              )}
            </div>

            <div className="sheet-footer">
              <button
                type="button"
                className="sheet-nav-btn"
                aria-label="Previous event"
                onClick={() => stepModal(-1)}
              >
                <FaChevronLeft size={18} />
              </button>

              <button
                type="button"
                className="btn-primary sheet-register-cta"
                onClick={() => handleRegisterFromModal(currentEv.name)}
              >
                <span>Register for {currentEv.name}</span>
                <FaArrowRight size={16} />
              </button>

              <button
                type="button"
                className="sheet-nav-btn"
                aria-label="Next event"
                onClick={() => stepModal(1)}
              >
                <FaChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default EventExplorer;
