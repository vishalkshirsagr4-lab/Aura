import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * High-performance GSAP ScrollTrigger reveal system.
 * Animates sections into view with subtle, coordinated stagger,
 * and handles prefers-reduced-motion instantly.
 */
export default function useReveal() {
  useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) {
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("in");
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(".reveal");

      elements.forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 32,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
              toggleActions: "play none none none",
              once: true,
            },
            onComplete: () => {
              el.classList.add("in");
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);
}
