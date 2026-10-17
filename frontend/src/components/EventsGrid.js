import { Star as FaStar } from "lucide-react";
import events from "../data/events";

function EventsGrid({ onSelect }) {
  const handleSelect = (name) => {
    onSelect(name);
    const el = document.getElementById("register");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section>
      <div className="section-title">
        <h2>
          <FaStar /> 18 EVENTS
        </h2>
        <p>Tap an event to pick it in the form</p>
      </div>

      <div className="events-grid">
        {events.map((ev) => {
          const Icon = ev.icon;
          return (
            <button
              type="button"
              className="event-card tilt"
              key={ev.id}
              onClick={() => handleSelect(ev.name)}
            >
              <div className="event-icon">
                <Icon />
              </div>
              <div className="event-name">{ev.name}</div>
              <span className="chip">{ev.category}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default EventsGrid;
