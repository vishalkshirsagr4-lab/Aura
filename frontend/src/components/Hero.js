import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import {
  CalendarDays as FaCalendarDays,
  GraduationCap as FaGraduationCap,
  ArrowRight as FaArrowRight,
  Trophy as FaTrophy,
  Landmark as FaBuildingColumns,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { formatDash, formatShort, eventStart } from "../utils";
import { COLLEGE } from "../data/college";
import { createHeroScene } from "../scenes3d";
import SocialLinks from "./SocialLinks";

function getTimeLeft(start) {
  const diff = Math.max(0, start - new Date());
  return {
    days: Math.floor(diff / 864e5),
    hours: Math.floor(diff / 36e5) % 24,
    mins: Math.floor(diff / 6e4) % 60,
    secs: Math.floor(diff / 1e3) % 60,
  };
}

const pad = (n) => String(n).padStart(2, "0");

function Hero({ info }) {
  const [left, setLeft] = useState(() => getTimeLeft(eventStart(info)));
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // Initialize 3D Scene
  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const dispose = createHeroScene(canvasRef.current);
    return () => {
      if (dispose) dispose();
    };
  }, []);

  // Coordinated GSAP Entrance Sequence
  useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-stage, .hero-canvas",
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 1.1 }
      )
        .fromTo(
          ".hero-badge-row",
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.7"
        )
        .fromTo(
          ".hero-title-wrap",
          { opacity: 0, y: 24, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.75 },
          "-=0.4"
        )
        .fromTo(
          ".hero-tagline, .hero-date-badge",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          "-=0.4"
        )
        .fromTo(
          ".hero-countdown .cd-box",
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08 },
          "-=0.3"
        )
        .fromTo(
          ".hero-action-group > *",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
          "-=0.2"
        )
        .fromTo(
          ".stats .stat",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          "-=0.2"
        );
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Mouse move / finger drag tilts the campus photo and stage slightly
  const handleMove = (e) => {
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    heroRef.current.style.setProperty("--px", px.toFixed(3));
    heroRef.current.style.setProperty("--py", py.toFixed(3));
    if (!titleRef.current || e.pointerType === "touch") return;
    titleRef.current.style.setProperty("--hx", `${-py * 12}deg`);
    titleRef.current.style.setProperty("--hy", `${px * 16}deg`);
  };

  const handleLeave = () => {
    if (!heroRef.current) return;
    heroRef.current.style.setProperty("--px", "0");
    heroRef.current.style.setProperty("--py", "0");
    if (!titleRef.current) return;
    titleRef.current.style.setProperty("--hx", "0deg");
    titleRef.current.style.setProperty("--hy", "0deg");
  };

  useEffect(() => {
    const start = eventStart(info);
    setLeft(getTimeLeft(start));
    const id = setInterval(() => setLeft(getTimeLeft(start)), 1000);
    return () => clearInterval(id);
  }, [info]);

  return (
    <div ref={heroRef} className="hero-container">
      <header
        className="hero"
        onPointerDown={handleMove}
        onPointerMove={handleMove}
        onPointerUp={handleLeave}
        onPointerCancel={handleLeave}
        onPointerLeave={handleLeave}
      >
        <span className="hero-stage" aria-hidden="true">
          <span className="hero-photo"></span>
          <span className="hero-gradient-overlay"></span>
        </span>

        {/* 3D Canvas Layer */}
        <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true"></canvas>

        {/* Subtle Ambient Glows */}
        <span className="orb o1" aria-hidden="true"></span>
        <span className="orb o2" aria-hidden="true"></span>

        <div className="hero-content" ref={contentRef}>
          <div className="hero-badge-row">
            <div className="presented-badge">
              <FaBuildingColumns size={15} />
              <span>{COLLEGE.name}, {COLLEGE.place} presents</span>
            </div>
            <div className="subhead-pill">
              <FaGraduationCap size={15} />
              <span>PUC STUDENTS ONLY</span>
            </div>
          </div>

          <div className="hero-title-wrap">
            <h1 ref={titleRef} className="hero-title">
              AI-AURA
            </h1>
            <div className="hero-year-tag">2026</div>
          </div>

          <p className="hero-tagline">
            18 talent events. One day. Your ultimate stage.
          </p>

          <div className="hero-date-badge">
            <FaCalendarDays size={16} />
            <span>{formatDash(info.eventDate)} · Mahalingpur Campus</span>
          </div>

          {/* Precision Countdown */}
          <div className="hero-countdown" aria-label="Event Countdown">
            <div className="cd-box">
              <span className="cd-val">{left.days}</span>
              <span className="cd-lbl">Days</span>
            </div>
            <div className="cd-sep">:</div>
            <div className="cd-box">
              <span className="cd-val">{pad(left.hours)}</span>
              <span className="cd-lbl">Hours</span>
            </div>
            <div className="cd-sep">:</div>
            <div className="cd-box">
              <span className="cd-val">{pad(left.mins)}</span>
              <span className="cd-lbl">Mins</span>
            </div>
            <div className="cd-sep">:</div>
            <div className="cd-box">
              <span className="cd-val">{pad(left.secs)}</span>
              <span className="cd-lbl">Secs</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="hero-action-group">
            <a className="btn-primary hero-btn-main" href="#register">
              <span>Register Now</span>
              <FaArrowRight size={17} />
            </a>
            <a className="btn-secondary hero-btn-rules" href="#rules">
              <BookOpen size={16} />
              <span>Event Rules & PDF</span>
            </a>
          </div>

          <div className="hero-social-wrap">
            <SocialLinks info={info} />
          </div>
        </div>
      </header>

      {/* Quick Statistics Banner */}
      <section className="stats" aria-label="Key Event Highlights">
        <div className="stat">
          <div className="stat-icon-wrap"><FaTrophy /></div>
          <div className="stat-text">
            <b>18</b>
            <span>Competitions & Talent Events</span>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon-wrap"><FaCalendarDays /></div>
          <div className="stat-text">
            <b>1 Day</b>
            <span>{formatShort(info.eventDate)} · Full Day Fest</span>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon-wrap"><Sparkles /></div>
          <div className="stat-text">
            <b>Prizes & Honors</b>
            <span>Trophies, Cash Awards & Certificates</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
