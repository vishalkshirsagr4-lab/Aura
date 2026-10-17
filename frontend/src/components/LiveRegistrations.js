import { useEffect, useRef, useState } from "react";
import { X, Radio } from "lucide-react";
import { api } from "../api";

const SHOW_DURATION_MS = 6500;
const GAP_DURATION_MS = 3500;
const REFRESH_INTERVAL_MS = 30000;

const formatRelativeTime = (isoString) => {
  if (!isoString) return "just now";
  const diffMinutes = Math.max(
    0,
    Math.round((Date.now() - new Date(isoString).getTime()) / 60000)
  );
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  return diffHours < 24 ? `${diffHours}h ago` : `${Math.round(diffHours / 24)}d ago`;
};

function LiveRegistrations() {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isExiting, setIsExiting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const itemsRef = useRef([]);

  const fetchRecent = () => {
    api("/api/registrations/recent")
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
          itemsRef.current = data;
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchRecent();
    const refreshTimer = setInterval(fetchRecent, REFRESH_INTERVAL_MS);
    const onNewReg = () => fetchRecent();
    window.addEventListener("aura:registered", onNewReg);
    return () => {
      clearInterval(refreshTimer);
      window.removeEventListener("aura:registered", onNewReg);
    };
  }, []);

  useEffect(() => {
    if (isDismissed || items.length === 0) return undefined;
    let tShow, tExit, tNext;

    const startCycle = (idx) => {
      setIsExiting(false);
      setCurrentIndex(idx);

      tShow = setTimeout(() => {
        setIsExiting(true);
      }, SHOW_DURATION_MS);

      tExit = setTimeout(() => {
        setCurrentIndex(-1);
      }, SHOW_DURATION_MS + 400);

      tNext = setTimeout(() => {
        const nextIdx = (idx + 1) % Math.max(1, itemsRef.current.length);
        startCycle(nextIdx);
      }, SHOW_DURATION_MS + GAP_DURATION_MS);
    };

    tNext = setTimeout(() => startCycle(0), 4000);

    return () => {
      clearTimeout(tShow);
      clearTimeout(tExit);
      clearTimeout(tNext);
    };
  }, [items.length, isDismissed]);

  const currentRegistration = items[currentIndex];
  if (isDismissed || !currentRegistration) return null;

  const initialLetter = (currentRegistration.firstName || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <aside className="live-registration-toast-wrap" aria-live="polite">
      <div className={`live-registration-toast ${isExiting ? "toast-exit" : ""}`}>
        <div className="live-toast-status">
          <span className="live-pulse-dot" />
          <Radio size={12} className="live-radio-icon" />
          <span>LIVE</span>
        </div>

        <div className="live-toast-body">
          <div className="live-avatar">{initialLetter}</div>
          <div className="live-details">
            <p className="live-message">
              <b>{currentRegistration.firstName}</b> from {currentRegistration.college} registered for <b>{currentRegistration.event}</b>
            </p>
            <span className="live-time">
              {formatRelativeTime(currentRegistration.createdAt)}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="live-toast-close"
          aria-label="Dismiss live registrations"
          onClick={() => setIsDismissed(true)}
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  );
}

export default LiveRegistrations;
