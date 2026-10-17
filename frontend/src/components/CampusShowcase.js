import { useRef, useState } from "react";
import { Landmark as FaBuildingColumns, ArrowRight as FaArrowRight, MapPin as FaLocationDot, Box as FaCube, Image as FaImage, ExternalLink as FaUpRightFromSquare } from "lucide-react";
import { COLLEGE } from "../data/college";
import SocialLinks from "./SocialLinks";
import Campus3D from "./Campus3D";

/* ---------- Drawn isometric campus (shows only if campus.jpg is missing) ---------- */
const S = 18;
const iso = (x, y, z) => [200 + (x - y) * S * 0.866, 130 + (x + y) * S * 0.5 - z * S];
const pts = (list) => list.map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ");

function Block({ x, y, z = 0, w, d, h, cols, rows }) {
  const top = [iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)];
  const left = [iso(x, y + d, z + h), iso(x + w, y + d, z + h), iso(x + w, y + d, z), iso(x, y + d, z)];
  const right = [iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x + w, y + d, z), iso(x + w, y, z)];

  const windows = [];
  const win = (face, fn) => {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const s0 = (i + 0.25) / cols, s1 = (i + 0.75) / cols;
        const t0 = (j + 0.28) / rows, t1 = (j + 0.72) / rows;
        windows.push(
          <polygon key={`${face}${i}-${j}`} points={pts([fn(s0, t0), fn(s1, t0), fn(s1, t1), fn(s0, t1)])} fill="#ffe9ae" opacity={(i + j) % 3 === 0 ? 0.55 : 0.9} />
        );
      }
    }
  };
  win("l", (s, t) => iso(x + s * w, y + d, z + t * h));
  win("r", (s, t) => iso(x + w, y + d - s * d, z + t * h));

  return (
    <g>
      <polygon points={pts(left)} fill="#8b4fcf" />
      <polygon points={pts(right)} fill="#5a2a9e" />
      <polygon points={pts(top)} fill="#d9bfff" />
      {windows}
    </g>
  );
}

function Tree({ x, y }) {
  const [cx, cy] = iso(x, y, 0);
  return (
    <g>
      <rect x={cx - 1.5} y={cy - 8} width="3" height="9" fill="#5a2a9e" />
      <circle cx={cx} cy={cy - 14} r="9" fill="#7ad8a8" />
      <circle cx={cx - 4} cy={cy - 11} r="6" fill="#58c590" />
    </g>
  );
}

function CampusArt() {
  const ground = [iso(-6, -2, 0), iso(9, -2, 0), iso(9, 10, 0), iso(-6, 10, 0)];
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="campus-art" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a0f4d" />
          <stop offset="1" stopColor="#7a3fc4" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#sky)" />
      <circle cx="330" cy="50" r="26" fill="#ffd9f6" opacity="0.85" />
      <polygon points={pts(ground)} fill="#a97bea" opacity="0.55" />
      <Block x={-4} y={1} w={4} d={3} h={3} cols={3} rows={3} />
      <Block x={0} y={0} w={6} d={4} h={4.5} cols={5} rows={4} />
      <Block x={2.4} y={0.9} z={4.5} w={1.3} d={1.3} h={2.4} cols={1} rows={3} />
      <Block x={2} y={4} w={3.5} d={3} h={3} cols={3} rows={3} />
      <Tree x={-5} y={5} />
      <Tree x={7} y={1} />
      <Tree x={-1} y={8} />
      <Tree x={6.5} y={7} />
    </svg>
  );
}

const Photo = () => (
  <img
    src="/images/campus.jpg"
    alt="KLE BCA & BBA College campus"
    className="campus-photo"
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
  />
);

/* ---------- Showcase: 3D tilt view + clear (normal) view ---------- */
const REST = { x: 8, y: -10 };

function CampusShowcase({ info }) {
  const stage = useRef(null);
  const [tilt, setTilt] = useState(REST);
  const [mode, setMode] = useState("3d"); // "3d" | "clear"
  const [webglFailed, setWebglFailed] = useState(false);

  const handleMove = (e) => {
    const r = stage.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 16, y: px * 18 });
  };

  return (
    <section className="campus">
      <div className="campus-text">
        <span className="chip">
          <FaBuildingColumns /> Our campus
        </span>
        <h2>{COLLEGE.name}</h2>
        <p className="campus-place">
          <FaLocationDot /> {COLLEGE.place}
        </p>
        <p>
          Where learning meets real-world skills: certificate courses, seminars, hackathon
          training and placement preparation. AI-AURA is our stage to showcase the talent of
          PUC students.
        </p>
        <div className="campus-actions">
          <a className="cta small" href="#register">
            Register now <FaArrowRight />
          </a>
          <SocialLinks info={info} />
        </div>
      </div>

      <div className="campus-media">
        <div className="view-toggle">
          <button
            type="button"
            className={mode === "3d" ? "active" : ""}
            onClick={() => setMode("3d")}
          >
            <FaCube /> 3D view
          </button>
          <button
            type="button"
            className={mode === "clear" ? "active" : ""}
            onClick={() => setMode("clear")}
          >
            <FaImage /> Clear view
          </button>
        </div>

        {mode === "3d" && !webglFailed ? (
          <Campus3D onFail={() => setWebglFailed(true)} />
        ) : mode === "3d" ? (
          <div
            className="campus-stage"
            ref={stage}
            onPointerMove={handleMove}
            onPointerLeave={() => setTilt(REST)}
          >
            <div
              className="campus-card"
              style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
            >
              <div className="campus-frame">
                <CampusArt />
                <Photo />
              </div>
              <div className="campus-badge">
                <FaBuildingColumns /> {COLLEGE.name}
              </div>
            </div>
          </div>
        ) : (
          <div className="campus-clear-wrap">
            <div className="campus-clear">
              <CampusArt />
              <Photo />
            </div>
            <a className="open-full" href="/images/campus.jpg" target="_blank" rel="noopener noreferrer">
              <FaUpRightFromSquare /> Open full photo
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export default CampusShowcase;
