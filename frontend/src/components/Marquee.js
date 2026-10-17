import events from "../data/events";

// Endless ribbon of all 18 events (pauses on hover)
function Marquee() {
  const row = events.map((e) => {
    const Icon = e.icon;
    return (
      <span className="mq-item" key={e.id}>
        <Icon /> {e.name}
      </span>
    );
  });
  return (
    <div className="marquee" aria-hidden="true">
      <div className="mq-track">
        {row}
        {row}
      </div>
    </div>
  );
}

export default Marquee;
