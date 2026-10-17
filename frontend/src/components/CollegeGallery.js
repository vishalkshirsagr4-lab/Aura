import { useState, useEffect, useCallback, useRef } from "react";
import { Presentation as FaChalkboardUser, Images as FaImages, X as FaXmark, ChevronLeft as FaChevronLeft, ChevronRight as FaChevronRight, Calendar as FaCalendarDay, Users as FaUsers, Building2 as FaBuilding } from "lucide-react";
import { SEMINARS, PHOTOS } from "../data/gallery";

// Seconds between automatic slides
const SLIDE_SECONDS = 10;

function CollegeGallery() {
  // one lightbox for both lists: { list, index }
  const [box, setBox] = useState(null);

  // ---- Seminar slider: moves one card every SLIDE_SECONDS, swipe/arrows also work ----
  const track = useRef(null);
  const paused = useRef(false);
  const [active, setActive] = useState(0);

  const step = () => {
    const el = track.current;
    if (!el || !el.firstElementChild) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 16;
    return el.firstElementChild.offsetWidth + gap;
  };
  const slide = useCallback((dir) => {
    const el = track.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;
    if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * step(), behavior: "smooth" });
  }, []);
  const goTo = (i) => track.current && track.current.scrollTo({ left: i * step(), behavior: "smooth" });
  const onScroll = () => {
    const w = step();
    if (w) setActive(Math.min(SEMINARS.length - 1, Math.round(track.current.scrollLeft / w)));
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current && !document.hidden) slide(1);
    }, SLIDE_SECONDS * 1000);
    return () => clearInterval(id);
  }, [slide]);

  const items = box ? box.list : [];
  const cur = box ? items[box.index] : null;

  const move = useCallback(
    (d) => setBox((b) => (b ? { ...b, index: (b.index + d + b.list.length) % b.list.length } : b)),
    []
  );

  useEffect(() => {
    if (!box) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setBox(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [box, move]);

  return (
    <section className="gallery">
      <div className="section-title">
        <h2>
          <FaChalkboardUser /> EXPERT SEMINARS
        </h2>
        <p>Industry professionals from Bengaluru's top companies teach our students every semester</p>
      </div>

      <div
        className="slider"
        onPointerEnter={() => (paused.current = true)}
        onPointerLeave={() => (paused.current = false)}
        onTouchStart={() => (paused.current = true)}
        onTouchEnd={() => setTimeout(() => (paused.current = false), 4000)}
      >
        <button type="button" className="slide-nav prev" aria-label="Previous seminar" onClick={() => slide(-1)}>
          <FaChevronLeft />
        </button>
        <div className="seminar-track" ref={track} onScroll={onScroll}>
          {SEMINARS.map((s, i) => (
          <article className="seminar tilt" key={s.id}>
            <button
              type="button"
              className="seminar-img"
              onClick={() => setBox({ list: SEMINARS, index: i })}
              aria-label={`Open poster: ${s.title}`}
            >
              <img src={s.img} alt={`${s.title} seminar poster`} loading="lazy" />
            </button>
            <div className="seminar-body">
              <h3>{s.title}</h3>
              <p className="seminar-who">
                <strong>{s.speaker}</strong> · {s.role}
              </p>
              <p className="seminar-meta">
                <FaBuilding /> {s.org}
              </p>
              <div className="seminar-tags">
                <span>
                  <FaCalendarDay /> {s.date}
                </span>
                <span>
                  <FaUsers /> {s.audience}
                </span>
              </div>
            </div>
          </article>
        ))}
        </div>
        <button type="button" className="slide-nav next" aria-label="Next seminar" onClick={() => slide(1)}>
          <FaChevronRight />
        </button>
      </div>
      <div className="slide-dots">
        {SEMINARS.map((s, i) => (
          <button
            type="button"
            key={s.id}
            className={i === active ? "on" : ""}
            aria-label={`Go to seminar ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <div className="section-title photos-title">
        <h2>
          <FaImages /> CAMPUS MOMENTS
        </h2>
        <p>Our students, our campus and our achievements</p>
      </div>

      <div className="photo-grid">
        {PHOTOS.map((p, i) => (
          <button
            type="button"
            key={p.id}
            className={`photo ${p.wide ? "wide" : ""}`}
            onClick={() => setBox({ list: PHOTOS, index: i })}
            aria-label={p.caption}
          >
            <img src={p.img} alt={p.caption} loading="lazy" />
            <span>{p.caption}</span>
          </button>
        ))}
      </div>

      {cur && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setBox(null)}>
          <button type="button" className="lb-close" aria-label="Close" onClick={() => setBox(null)}>
            <FaXmark />
          </button>
          <button
            type="button"
            className="lb-nav prev"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
          >
            <FaChevronLeft />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={cur.img} alt={cur.title || cur.caption} />
            <figcaption>
              {cur.title || cur.caption} · {box.index + 1}/{items.length}
            </figcaption>
          </figure>
          <button
            type="button"
            className="lb-nav next"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}

export default CollegeGallery;
