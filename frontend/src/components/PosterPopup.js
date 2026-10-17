import { useState, useEffect, useRef } from "react";
import { X as FaXmark, ArrowRight as FaArrowRight } from "lucide-react";

// ---- Change these numbers (in seconds) ----
const FIRST_DELAY = 3;    // first time the poster appears after the page opens
const SHOW_FOR = 12;      // how long it stays before hiding itself
const REPEAT_EVERY = 40;  // seconds before it appears again after hiding

function PosterPopup() {
  const [open, setOpen] = useState(false);
  const stopped = useRef(false); // true once the student clicks Register

  useEffect(() => {
    let timer;
    const schedule = (secs) => {
      timer = setTimeout(() => {
        if (stopped.current) return;
        setOpen(true);
      }, secs * 1000);
    };
    schedule(FIRST_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // when shown: auto-hide after SHOW_FOR, then come back after REPEAT_EVERY
  useEffect(() => {
    if (!open) return undefined;
    const hide = setTimeout(() => setOpen(false), SHOW_FOR * 1000);
    return () => clearTimeout(hide);
  }, [open]);

  useEffect(() => {
    if (open || stopped.current) return undefined;
    // only schedule a repeat after the first showing has happened
    if (!PosterPopup.shown) return undefined;
    const again = setTimeout(() => !stopped.current && setOpen(true), REPEAT_EVERY * 1000);
    return () => clearTimeout(again);
  }, [open]);

  useEffect(() => {
    if (open) PosterPopup.shown = true;
  }, [open]);

  if (!open) return null;

  const register = () => {
    stopped.current = true;
    setOpen(false);
  };

  return (
    <div className="poster-pop" role="dialog" aria-label="AI-AURA 2K26 poster" onClick={() => setOpen(false)}>
      <div className="poster-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="poster-close" aria-label="Close" onClick={() => setOpen(false)}>
          <FaXmark />
        </button>
        <img src="/images/gallery/ai-aura-poster.jpg" alt="AI-AURA 2K26 – A Talent Hunt for PU Students" />
        <a className="cta small poster-cta" href="#register" onClick={register}>
          Register now <FaArrowRight />
        </a>
        <div className="poster-bar" style={{ animationDuration: `${SHOW_FOR}s` }} />
      </div>
    </div>
  );
}

export default PosterPopup;
