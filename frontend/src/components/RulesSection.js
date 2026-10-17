import {
  BookOpen as FaBookOpen,
  FileText as FaFilePdf,
  Download as FaDownload,
  HardDrive as FaGoogleDrive,
  Clock as FaClock,
  Contact as FaIdCard,
  Gavel as FaGavel,
  AlertTriangle as FaTriangleExclamation,
  Trophy as FaTrophy,
  Medal as FaMedal,
  Crown as FaCrown,
  Award as FaAward,
  Phone as FaPhone,
  Globe as FaGlobe,
  ArrowRight as FaArrowRight,
  MapPin as FaLocationDot,
} from "lucide-react";
import { PDF_URL, DRIVE_URL, WEBSITES, GENERAL, PRIZES, CONTACTS } from "../data/rules";

const GENERAL_ICON_MAP = {
  id: FaIdCard,
  clock: FaClock,
  gavel: FaGavel,
};

const PRIZE_ICONS = [FaTrophy, FaMedal, FaCrown, FaAward];

function RulesSection() {
  return (
    <section id="rules" className="rules-section" aria-label="Event Rules and Guidelines">
      <div className="section-header">
        <div className="section-badge">
          <FaBookOpen size={14} />
          <span>OFFICIAL RULEBOOK</span>
        </div>
        <h2>Guidelines & Competition Rules</h2>
        <p className="section-subtitle">
          Essential instructions, participant eligibility criteria, and judging policies for event day
        </p>
      </div>

      {/* Brochure Download Banner */}
      <div className="brochure-download-banner">
        <div className="brochure-icon-wrap">
          <FaFilePdf size={32} />
        </div>
        <div className="brochure-text-content">
          <h3>Official AI-AURA 2K26 Brochure & Rules Guide</h3>
          <p>
            Complete catalog of all 18 competitions, judging parameters, stage regulations, and committee contacts in one handy PDF.
          </p>
        </div>
        <div className="brochure-actions">
          <a
            className="btn-primary small"
            href={PDF_URL}
            download="AI-AURA-2K26-Rules-and-Regulations.pdf"
          >
            <FaDownload size={15} />
            <span>Download PDF</span>
          </a>
          <a
            className="btn-secondary small"
            href={DRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGoogleDrive size={15} />
            <span>Open in Drive</span>
          </a>
        </div>
      </div>

      {/* 3 Core Rule Categories */}
      <div className="general-rules-grid">
        {GENERAL.map((g) => {
          const Icon = GENERAL_ICON_MAP[g.icon] || FaBookOpen;
          return (
            <div className="general-rule-card" key={g.title}>
              <div className="rule-card-icon">
                <Icon size={20} />
              </div>
              <h3 className="rule-card-title">{g.title}</h3>
              <ul className="rule-card-points">
                {g.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="disclaimer-alert">
        <FaTriangleExclamation size={18} />
        <span>
          Event schedules and final rounds are subject to the decisions of the faculty coordinators and organizing committee.
        </span>
      </div>

      {/* Prizes Row */}
      <div className="prizes-banner" aria-label="Awards and Honors">
        <div className="prizes-label">
          <FaTrophy size={18} />
          <span>Awards & Honors</span>
        </div>
        <div className="prizes-list">
          {PRIZES.map((prizeText, idx) => {
            const Icon = PRIZE_ICONS[idx % PRIZE_ICONS.length];
            return (
              <div className="prize-pill" key={prizeText}>
                <Icon size={16} />
                <span>{prizeText}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contacts & Campus Directions */}
      <div className="contacts-directions-grid">
        <div className="contact-card">
          <div className="contact-card-head">
            <FaPhone size={18} />
            <h3>Organizing Coordinators</h3>
          </div>
          <div className="contact-links-list">
            {CONTACTS.map((c) => (
              <a key={c.phone} href={`tel:${c.phone}`} className="contact-person-link">
                <div className="contact-meta">
                  <b>{c.name}</b>
                  <small>{c.role}</small>
                </div>
                <span className="contact-phone-badge">{c.phone}</span>
              </a>
            ))}
          </div>
          <div className="venue-footer-info">
            <FaLocationDot size={16} />
            <span>KLE Society's BCA & BBA College, Mahalingpur</span>
          </div>
        </div>

        <div className="contact-card">
          <div className="contact-card-head">
            <FaGlobe size={18} />
            <h3>Affiliated Institutions</h3>
          </div>
          <div className="websites-list">
            {WEBSITES.map((w) => (
              <a
                key={w.url}
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                className="institution-link"
              >
                <div className="inst-meta">
                  <b>{w.label}</b>
                  <small>{w.text}</small>
                </div>
                <FaArrowRight size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default RulesSection;
