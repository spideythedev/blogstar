
import { useRef } from "react";
import "./SpotlightCard.css";

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(80, 110, 190, 0.10)"
}) {
  const cardRef = useRef(null);

  function handleMouseMove(event) {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    card.style.setProperty("--spotlight-color", spotlightColor);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`card-spotlight ${className}`}
    >
      {children}
    </div>
  );
}
