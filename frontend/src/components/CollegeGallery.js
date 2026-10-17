import { useState, useEffect, useCallback, useRef } from "react";
import {
  Presentation as FaChalkboardUser,
  Images as FaImages,
  X as FaXmark,
  ChevronLeft as FaChevronLeft,
  ChevronRight as FaChevronRight,
  Calendar as FaCalendarDay,
  Users as FaUsers,
  Building2 as FaBuilding,
  Sparkles,
} from "lucide-react";
import { SEMINARS, PHOTOS } from "../data/gallery";

const SLIDE_INTERVAL_SECONDS = 8;

function CollegeGallery() {
  const [lightbox, setLightbox] = useState(null); // { list, index }
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const getStepWidth = () => {
    const el = trackRef.current;
    if (!el || !el.firstElementChild) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 16;
    return el.firstElementChild.offsetWidth + gap;
  };

  const slideBy = useCallback((dir) => {
    const el = trackRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    const atStart = el.scrollLeft <= 8;

    if (dir > 0 && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir < 0 && atStart) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir * getStepWidth(), behavior: "smooth" });
    }
  }, []);

  const goToSlide = (i) => {
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: i * getStepWidth(), behavior: "smooth" });
    }
  };

  const handleTrackScroll = () => {
    const w = getStepWidth();
    if (w && trackRef.current) {
      const idx = Math.min(
        SEMINARS.length - 1,
        Math.round(trackRef.current.scrollLeft / w)
      );
      setActiveSlide(idx);
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current && !document.hidden) {
        slideBy(1);
      }
    }, SLIDE_INTERVAL_SECONDS * 1000);
    return () => clearInterval(id);
  }, [slideBy]);

  const items = lightbox ? lightbox.list : [];
  const currentItem = lightbox ? items[lightbox.index] : null;

  const moveLightbox = useCallback(
    (dir) => {
      setLightbox((b) =>
        b ? { ...b, index: (b.index + dir + b.list.length) % b.list.length } : b
      );
    },
    []
  );

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") moveLightbox(1);
      if (e.key === "ArrowLeft") moveLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, moveLightbox]);

  return (
    <section className="gallery-section" id="seminars" aria-label="Seminars and Campus Life">
      {/* 1. Expert Seminars Header */}
      <div className="section-header">
        <div className="section-badge">
          <FaChalkboardUser size={14} />
          <span>INDUSTRY CONNECT</span>
        </div>
        <h2>Guest Talks & Expert Seminars</h2>
        <p className="section-subtitle">
          Engineers, startup founders, and corporate tech leads from Bengaluru guide our students every semester
        </p>
      </div>

      {/* Seminars Carousel */}
      <div
        className="seminars-carousel"
        onPointerEnter={() => (pausedRef.current = true)}
        onPointerLeave={() => (pausedRef.current = false)}
        onTouchStart={() => (pausedRef.current = true)}
        onTouchEnd={() => setTimeout(() => (pausedRef.current = false), 3500)}
      >
        <button
          type="button"
          className="carousel-nav-btn prev"
          aria-label="Previous seminar"
          onClick={() => slideBy(-1)}
        >
          <FaChevronLeft size={20} />
        </button>

        <div className="seminars-track" ref={trackRef} onScroll={handleTrackScroll}>
          {SEMINARS.map((s, idx) => (
            <article className="seminar-card" key={s.id}>
              <div
                className="seminar-image-wrap"
                onClick={() => setLightbox({ list: SEMINARS, index: idx })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setLightbox({ list: SEMINARS, index: idx });
                }}
                aria-label={`View full poster: ${s.title}`}
              >
                <img src={s.img} alt={`${s.title} poster`} loading="lazy" />
                <span className="expand-overlay-pill">Click to expand</span>
              </div>

              <div className="seminar-card-body">
                <h3 className="seminar-card-title">{s.title}</h3>
                <p className="seminar-speaker">
                  <b>{s.speaker}</b> · {s.role}
                </p>
                <p className="seminar-org">
                  <FaBuilding size={14} />
                  <span>{s.org}</span>
                </p>
                <div className="seminar-card-meta">
                  <span className="meta-pill">
                    <FaCalendarDay size={13} />
                    <span>{s.date}</span>
                  </span>
                  <span className="meta-pill">
                    <FaUsers size={13} />
                    <span>{s.audience}</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="carousel-nav-btn next"
          aria-label="Next seminar"
          onClick={() => slideBy(1)}
        >
          <FaChevronRight size={20} />
        </button>
      </div>

      {/* Carousel Dot Indicators */}
      <div className="carousel-dots-row" role="tablist" aria-label="Seminar slides">
        {SEMINARS.map((s, i) => (
          <button
            type="button"
            key={s.id}
            className={`carousel-dot ${i === activeSlide ? "active" : ""}`}
            aria-label={`Go to seminar ${i + 1}`}
            onClick={() => goToSlide(i)}
          />
        ))}
      </div>

      {/* 2. Campus Moments Photo Grid */}
      <div className="section-header photos-header">
        <div className="section-badge">
          <FaImages size={14} />
          <span>CAMPUS LIFE</span>
        </div>
        <h2>Life at KLE Mahalingpur</h2>
        <p className="section-subtitle">
          Certificates, hackathon projects, student cohorts, and innovation on campus
        </p>
      </div>

      <div className="photo-moments-grid">
        {PHOTOS.map((p, i) => (
          <button
            type="button"
            key={p.id}
            className={`photo-moment-item ${p.wide ? "wide" : ""}`}
            onClick={() => setLightbox({ list: PHOTOS, index: i })}
            aria-label={p.caption}
          >
            <img src={p.img} alt={p.caption} loading="lazy" />
            <div className="photo-caption-gradient">
              <span>{p.caption}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal Dialog */}
      {currentItem && (
        <div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="lightbox-close-btn"
            aria-label="Close lightbox"
            onClick={() => setLightbox(null)}
          >
            <FaXmark size={20} />
          </button>

          <button
            type="button"
            className="lightbox-nav-btn prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              moveLightbox(-1);
            }}
          >
            <FaChevronLeft size={24} />
          </button>

          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img
              src={currentItem.img}
              alt={currentItem.title || currentItem.caption}
            />
            <figcaption className="lightbox-caption">
              <b>{currentItem.title || currentItem.caption}</b>
              <span className="lightbox-counter">
                {lightbox.index + 1} of {items.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            className="lightbox-nav-btn next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              moveLightbox(1);
            }}
          >
            <FaChevronRight size={24} />
          </button>
        </div>
      )}
    </section>
  );
}

export default CollegeGallery;
