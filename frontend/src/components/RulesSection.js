import { BookOpen as FaBookOpen, FileText as FaFilePdf, Download as FaDownload, HardDrive as FaGoogleDrive, Clock as FaClock, Contact as FaIdCard, Gavel as FaGavel, AlertTriangle as FaTriangleExclamation, Trophy as FaTrophy, Medal as FaMedal, Crown as FaCrown, Award as FaAward, Phone as FaPhone, Globe as FaGlobe, ArrowRight as FaArrowRight, MapPin as FaLocationDot } from "lucide-react";
import { PDF_URL, DRIVE_URL, WEBSITES, GENERAL, PRIZES, CONTACTS } from "../data/rules";

const GENERAL_ICON = { id: FaIdCard, clock: FaClock, gavel: FaGavel };
const PRIZE_ICON = [FaTrophy, FaMedal, FaCrown, FaAward];

// Download card, general rules, prizes, contacts and college websites
function RulesSection() {
  return (
    <section id="rules" className="rules">
      <div className="section-title">
        <h2><FaBookOpen /> RULES & GUIDELINES</h2>
        <p>Everything you need to know before event day</p>
      </div>

      <div className="rules-download">
        <div className="rd-icon"><FaFilePdf /></div>
        <div className="rd-text">
          <h3>AI-AURA 2K26 Rules Brochure</h3>
          <p>All 18 events, rules, judging focus and guidelines in one PDF. Save it on your phone.</p>
        </div>
        <div className="rd-actions">
          <a className="cta small" href={PDF_URL} download="AI-AURA-2K26-Rules-and-Regulations.pdf"><FaDownload /> Download PDF</a>
          <a className="ghost-btn" href={DRIVE_URL} target="_blank" rel="noopener noreferrer"><FaGoogleDrive /> Open in Drive</a>
        </div>
      </div>

      <div className="general-grid">
        {GENERAL.map((g) => {
          const Icon = GENERAL_ICON[g.icon];
          return (
            <div className="general-card" key={g.title}>
              <div className="gc-ico"><Icon /></div>
              <h3>{g.title}</h3>
              <ul>{g.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          );
        })}
      </div>
      <p className="important"><FaTriangleExclamation /> The event schedule and proposed rules for new events are subject to confirmation by the organising committee.</p>

      <div className="prize-row">
        {PRIZES.map((p, i) => {
          const Icon = PRIZE_ICON[i];
          return <div key={p}><Icon /><span>{p}</span></div>;
        })}
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <h3><FaPhone /> Event contacts</h3>
          {CONTACTS.map((c) => (
            <a key={c.phone} href={`tel:${c.phone}`}>
              <span><b>{c.name}</b><small>{c.role}</small></span>
              <em>{c.phone}</em>
            </a>
          ))}
          <p className="venue"><FaLocationDot /> KLE Society's BCA & BBA College, Mahalingpur</p>
        </div>
        <div className="contact-card">
          <h3><FaGlobe /> Visit our colleges</h3>
          {WEBSITES.map((w) => (
            <a key={w.url} href={w.url} target="_blank" rel="noopener noreferrer">
              <span><b>{w.label}</b><small>{w.text}</small></span>
              <FaArrowRight />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RulesSection;
