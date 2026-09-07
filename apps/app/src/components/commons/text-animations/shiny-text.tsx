"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  delay?: number;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 2,
  className = "",
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = "left",
  delay = 0,
}) => {
  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: disabled
      ? "none"
      : `shiny-text-${direction} ${speed}s ease-in-out ${delay}s infinite ${yoyo ? "alternate" : "normal"}`,
  };

  return (
    <>
      <style>{`
        @keyframes shiny-text-left {
          0% { background-position: 150% center; }
          100% { background-position: -50% center; }
        }
        @keyframes shiny-text-right {
          0% { background-position: -50% center; }
          100% { background-position: 150% center; }
        }
      `}</style>
      <span
        suppressHydrationWarning
        className={`inline-block ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""} ${className}`}
        style={gradientStyle}
      >
        {text}
      </span>
    </>
  );
};

export default ShinyText;
