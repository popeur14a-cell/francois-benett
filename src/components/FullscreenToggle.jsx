import { useEffect, useState } from "react";
import { MaximizeIcon } from "./Icons";

export default function FullscreenToggle({ targetRef, language = "fr" }) {
  const [active, setActive] = useState(false);
  const en = language === "en";

  useEffect(() => {
    const target = targetRef.current;
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
      const isActive = fullscreenElement === target;
      target?.classList.toggle("lightbox-fullscreen-mode", isActive);
      setActive(isActive);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      target?.classList.remove("lightbox-fullscreen-mode");
    };
  }, [targetRef]);

  const toggleFullscreen = async () => {
    const target = targetRef.current;
    if (!target) return;

    try {
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
      if (fullscreenElement === target) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } else {
        if (target.requestFullscreen) {
          await target.requestFullscreen({ navigationUI: "hide" });
        } else if (target.webkitRequestFullscreen) {
          target.webkitRequestFullscreen();
        } else {
          throw new Error("Fullscreen API unavailable");
        }
      }
    } catch {
      const nextActive = !active;
      target.classList.toggle("lightbox-fullscreen-mode", nextActive);
      setActive(nextActive);
    }
  };

  return (
    <button
      type="button"
      className="lightbox-fullscreen-toggle"
      onClick={toggleFullscreen}
      aria-label={active ? (en ? "Exit full screen" : "Quitter le plein écran") : (en ? "Full screen" : "Plein écran")}
      aria-pressed={active}
    >
      <MaximizeIcon active={active} />
    </button>
  );
}
