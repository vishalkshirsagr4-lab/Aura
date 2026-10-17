import { Megaphone as FaBullhorn, CalendarDays as FaCalendarDays, AlertTriangle as FaTriangleExclamation } from "lucide-react";
import { formatShort } from "../utils";

const CATEGORY = {
  general: { Icon: FaBullhorn, label: "Update" },
  date: { Icon: FaCalendarDays, label: "Date" },
  important: { Icon: FaTriangleExclamation, label: "Important" },
};

function Announcements({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="notices">
      <div className="section-title">
        <h2>
          <FaBullhorn /> ANNOUNCEMENTS
        </h2>
        <p>Latest updates from the organisers</p>
      </div>

      <div className="notice-list">
        {items.map((n) => {
          const cat = CATEGORY[n.category] || CATEGORY.general;
          const Icon = cat.Icon;
          return (
            <article className={`notice ${n.category}`} key={n._id}>
              <div className="notice-icon">
                <Icon />
              </div>
              <div className="notice-body">
                <div className="notice-head">
                  <h3>{n.title}</h3>
                  <span className="chip">{cat.label}</span>
                </div>
                <p>{n.message}</p>
                {n.date && (
                  <span className="notice-date">
                    <FaCalendarDays /> {formatShort(n.date)}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Announcements;
