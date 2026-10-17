import { useEffect, useState } from "react";
import { ArrowRight as FaArrowRight } from "lucide-react";

const LINKS = [
  { href: "#events", label: "Events" },
  { href: "#rules", label: "Rules" },
  { href: "#college", label: "Our College" },
  { href: "#seminars", label: "Seminars" },
];

// Appears after the hero, shows reading progress and a always-visible Register button
function StickyNav() {
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setShow(window.scrollY > 420);
      setPct((window.scrollY / Math.max(1, h.scrollHeight - h.clientHeight)) * 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`snav ${show ? "show" : ""}`} aria-label="Sections">
      <div className="snav-bar" style={{ width: `${pct}%` }} />
      <div className="snav-in">
        <a className="snav-brand" href="#top">AI-AURA <b>2K26</b></a>
        <div className="snav-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </div>
        <a className="snav-cta" href="#register">Register <FaArrowRight /></a>
      </div>
    </nav>
  );
}

export default StickyNav;
