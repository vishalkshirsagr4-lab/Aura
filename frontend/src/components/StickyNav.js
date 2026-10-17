import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight as FaArrowRight,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const NAV_LINKS = [
  { href: "#events", label: "Events" },
  { href: "#rules", label: "Rules" },
  { href: "#college", label: "Campus" },
  { href: "#courses", label: "Courses" },
  { href: "#seminars", label: "Seminars" },
];

function StickyNav() {
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      setShow(scrollY > 280);
      setPct((scrollY / Math.max(1, h.scrollHeight - h.clientHeight)) * 100);

      // Detect active section
      const sections = NAV_LINKS.map((l) => l.href.substring(1));
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav
        className={`snav ${show ? "show" : ""}`}
        aria-label="Main Navigation"
      >
        {/* Reading Progress Line */}
        <div className="snav-bar" style={{ width: `${pct}%` }} />

        <div className="snav-in">
          {/* Brand */}
          <a className="snav-brand" href="#top" onClick={closeMobile}>
            <span className="brand-dot"><Sparkles size={14} /></span>
            <span className="brand-text">AI-AURA</span>
            <span className="brand-badge">2026</span>
          </a>

          {/* Desktop Nav Links */}
          <div className="snav-links" role="menubar">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={activeSection === link.href.substring(1) ? "active" : ""}
                role="menuitem"
              >
                {link.label}
              </a>
            ))}
            <Link to="/admin" className="snav-admin-link" title="Admin Portal">
              <ShieldCheck size={15} />
              <span>Admin</span>
            </Link>
          </div>

          {/* Right Action CTA & Mobile Trigger */}
          <div className="snav-actions">
            <a className="btn-primary snav-cta" href="#register" onClick={closeMobile}>
              <span>Register</span>
              <FaArrowRight size={14} />
            </a>

            <button
              type="button"
              className="snav-hamburger"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Accessible Mobile Navigation Drawer */}
      <div
        className={`mobile-nav-drawer ${mobileOpen ? "open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-nav-backdrop" onClick={closeMobile} />
        <div className="mobile-nav-content" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div className="mobile-nav-head">
            <span className="snav-brand">
              <span className="brand-dot"><Sparkles size={14} /></span>
              <span>AI-AURA 2026</span>
            </span>
            <button
              type="button"
              className="mobile-nav-close"
              aria-label="Close navigation"
              onClick={closeMobile}
            >
              <X size={20} />
            </button>
          </div>

          <div className="mobile-nav-links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={activeSection === link.href.substring(1) ? "active" : ""}
                onClick={closeMobile}
              >
                {link.label}
              </a>
            ))}
            <Link to="/admin" className="mobile-admin-link" onClick={closeMobile}>
              <ShieldCheck size={16} />
              <span>Admin Portal</span>
            </Link>
          </div>

          <div className="mobile-nav-foot">
            <a className="btn-primary full-width" href="#register" onClick={closeMobile}>
              <span>Register for Events</span>
              <FaArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default StickyNav;
