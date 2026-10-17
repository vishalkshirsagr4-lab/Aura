import { useState, useEffect, useRef } from "react";
import { CalendarDays as FaCalendarDays, GraduationCap as FaGraduationCap, ArrowRight as FaArrowRight, Trophy as FaTrophy, Landmark as FaBuildingColumns } from "lucide-react";
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
  const canvasRef = useRef(null);
  const titleRef = useRef(null);

  // Real 3D shapes floating behind the title
  useEffect(() => {
    const dispose = createHeroScene(canvasRef.current);
    return () => {
      if (dispose) dispose();
    };
  }, []);

  // Mouse move / finger drag tilts the college photo in 3D (and the title on desktop)
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--px", px.toFixed(3));
    e.currentTarget.style.setProperty("--py", py.toFixed(3));
    if (!titleRef.current || e.pointerType === "touch") return;
    titleRef.current.style.setProperty("--hx", `${-py * 16}deg`);
    titleRef.current.style.setProperty("--hy", `${px * 22}deg`);
  };
  const handleLeave = (e) => {
    e.currentTarget.style.setProperty("--px", "0");
    e.currentTarget.style.setProperty("--py", "0");
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
    <>
      <header className="hero" onPointerDown={handleMove} onPointerMove={handleMove} onPointerUp={handleLeave} onPointerCancel={handleLeave} onPointerLeave={handleLeave}>
        <span className="hero-stage" aria-hidden="true">
          <span className="hero-photo"></span>
        </span>
        <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true"></canvas>
        <span className="orb o1"></span>
        <span className="orb o2"></span>
        <span className="orb o3"></span>

        <div className="presented">
          <FaBuildingColumns /> {COLLEGE.name}, {COLLEGE.place} presents
        </div>
        <div className="subhead">
          <FaGraduationCap /> PUC STUDENTS ONLY
        </div>
        <h1 ref={titleRef}>AI-AURA</h1>
        <p className="tag">18 events. One day. Your stage.</p>
        <div className="date-badge">
          <FaCalendarDays /> {formatDash(info.eventDate)}
        </div>

        <div className="cd">
          <div><b>{left.days}</b><span>Days</span></div>
          <div><b>{pad(left.hours)}</b><span>Hours</span></div>
          <div><b>{pad(left.mins)}</b><span>Mins</span></div>
          <div><b>{pad(left.secs)}</b><span>Secs</span></div>
        </div>

        <a className="cta" href="#register">
          Register now <FaArrowRight />
        </a>
        <a className="hero-rules" href="#rules">📘 Rules &amp; PDF</a>
        <div className="hero-social">
          <SocialLinks info={info} />
        </div>
      </header>

      <section className="stats">
        <div className="stat tilt"><FaTrophy /><b>18</b><span>Events</span></div>
        <div className="stat tilt"><FaCalendarDays /><b>1 Day</b><span>{formatShort(info.eventDate)}</span></div>
        <div className="stat tilt"><FaGraduationCap /><b>PUC</b><span>Students only</span></div>
      </section>
    </>
  );
}

export default Hero;
