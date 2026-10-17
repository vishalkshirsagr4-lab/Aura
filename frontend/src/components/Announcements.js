import { useState } from "react";
import {
  Megaphone as FaBullhorn,
  CalendarDays as FaCalendarDays,
  AlertTriangle as FaTriangleExclamation,
  Sparkles,
  Info,
} from "lucide-react";
import { formatShort } from "../utils";

const CATEGORY_MAP = {
  important: {
    Icon: FaTriangleExclamation,
    label: "Important Alert",
    className: "cat-important",
  },
  date: {
    Icon: FaCalendarDays,
    label: "Schedule",
    className: "cat-date",
  },
  general: {
    Icon: FaBullhorn,
    label: "Update",
    className: "cat-general",
  },
};

function Announcements({ items }) {
  const [activeFilter, setActiveFilter] = useState("all");

  if (!items || items.length === 0) return null;

  const filtered = items.filter((n) => {
    if (activeFilter === "all") return true;
    return n.category === activeFilter;
  });

  return (
    <section className="announcements-section" aria-label="Official Announcements">
      <div className="section-header">
        <div className="section-badge">
          <FaBullhorn size={14} />
          <span>LATEST BULLETINS</span>
        </div>
        <h2>Official Event Announcements</h2>
        <p className="section-subtitle">
          Real-time updates, reporting instructions, and important guidelines from the organizing desk
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="announcements-filter-bar" role="tablist" aria-label="Filter notices">
        <button
          type="button"
          className={`notice-filter-btn ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All ({items.length})
        </button>
        <button
          type="button"
          className={`notice-filter-btn ${activeFilter === "important" ? "active" : ""}`}
          onClick={() => setActiveFilter("important")}
        >
          Important
        </button>
        <button
          type="button"
          className={`notice-filter-btn ${activeFilter === "date" ? "active" : ""}`}
          onClick={() => setActiveFilter("date")}
        >
          Schedules
        </button>
        <button
          type="button"
          className={`notice-filter-btn ${activeFilter === "general" ? "active" : ""}`}
          onClick={() => setActiveFilter("general")}
        >
          General
        </button>
      </div>

      <div className="notice-cards-grid">
        {filtered.length === 0 ? (
          <div className="notice-empty">
            <Info size={20} />
            <p>No notices in this category at the moment.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const config = CATEGORY_MAP[item.category] || CATEGORY_MAP.general;
            const Icon = config.Icon;

            return (
              <article key={item._id} className={`notice-card ${config.className}`}>
                <div className="notice-card-header">
                  <div className="notice-type-pill">
                    <Icon size={14} />
                    <span>{config.label}</span>
                  </div>
                  {item.date && (
                    <span className="notice-date-pill">
                      <FaCalendarDays size={13} />
                      <span>{formatShort(item.date)}</span>
                    </span>
                  )}
                </div>

                <h3 className="notice-title">{item.title}</h3>
                <p className="notice-message">{item.message}</p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

export default Announcements;
