export function ArrowIcon({ direction = "right" }) {
  const rotation = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
    upRight: -45,
  }[direction];

  return (
    <svg
      className="icon icon-arrow"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function HeartIcon({ filled = false }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 20.2 4.4 13A4.8 4.8 0 0 1 11.2 6.2L12 7l.8-.8A4.8 4.8 0 0 1 19.6 13Z"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="18" cy="5" r="2.2" />
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="18" cy="19" r="2.2" />
      <path d="m8 11 8-5M8 13l8 5" />
    </svg>
  );
}

export function ZoomIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m15 15 4.5 4.5M10.5 8v5M8 10.5h5" />
    </svg>
  );
}

export function RoomIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 20V5h16v15M8 16h8M7 5v7h10V5" />
    </svg>
  );
}

export function MaximizeIcon({ active = false }) {
  return active ? (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
    </svg>
  ) : (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
    </svg>
  );
}
