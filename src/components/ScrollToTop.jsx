import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const savedPositions = new Map();

export default function ScrollToTop() {
  const { key, pathname } = useLocation();
  const navigationType = useNavigationType();
  const initialRender = useRef(true);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const languageScroll = window.__benettLanguageScroll;
    delete window.__benettLanguageScroll;
    const target = Number.isFinite(languageScroll)
      ? languageScroll
      : !initialRender.current || navigationType !== "POP"
        ? navigationType === "POP"
          ? savedPositions.get(key) ?? 0
          : 0
        : 0;
    initialRender.current = false;

    const restore = () =>
      window.scrollTo({ top: target, left: 0, behavior: "instant" });
    restore();
    const frame = window.requestAnimationFrame(restore);
    const timer = window.setTimeout(restore, 120);

    return () => {
      savedPositions.set(key, window.scrollY);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [key, navigationType, pathname]);

  return null;
}
