import { useEffect, useRef, useState } from "react";
import { Star as FaStar, Layers as FaLayerGroup, Trophy as FaTrophy, Calendar as FaCalendarDay } from "lucide-react";

function Count({ to, run }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return undefined;
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1400);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return <>{n}</>;
}

const STATS = [
  { Icon: FaStar, to: 18, label: "Events to compete in" },
  { Icon: FaLayerGroup, to: 5, label: "Talent categories" },
  { Icon: FaTrophy, to: 4, label: "Prize categories" },
  { Icon: FaCalendarDay, to: 1, label: "Day to shine" },
];

function StatsBand() {
  const ref = useRef(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setRun(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setRun(true), io.disconnect()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="stats" ref={ref}>
      {STATS.map(({ Icon, to, label }) => (
        <div key={label}>
          <Icon />
          <b><Count to={to} run={run} /></b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default StatsBand;
