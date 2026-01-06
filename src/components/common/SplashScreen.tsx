"use client";

import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export default function SplashScreen({ onComplete, duration = 2500 }: SplashScreenProps) {
  const [animationPhase, setAnimationPhase] = useState<"zoom-in" | "zoom-out" | "fade-out">("zoom-in");

  useEffect(() => {
    // Phase 1: Zoom in (0-800ms)
    const zoomOutTimer = setTimeout(() => {
      setAnimationPhase("zoom-out");
    }, 800);

    // Phase 2: Zoom out and fade (800-2000ms)
    const fadeOutTimer = setTimeout(() => {
      setAnimationPhase("fade-out");
    }, 2000);

    // Phase 3: Complete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(zoomOutTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, duration]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, #0d1117 0%, #1a2332 50%, #0d1117 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: animationPhase === "fade-out" ? 0 : 1,
        transition: "opacity 0.5s ease-out",
      }}
    >
      {/* Animated background circles */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,191,255,0.1) 0%, transparent 70%)",
          animation: "pulse 2s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 750,
          height: 750,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,191,255,0.05) 0%, transparent 70%)",
          animation: "pulse 2s ease-in-out infinite 0.5s",
        }}
      />

      {/* Logo Container */}
      <div
        style={{
          transform: animationPhase === "zoom-in" 
            ? "scale(0.3)" 
            : animationPhase === "zoom-out" 
            ? "scale(1)" 
            : "scale(1.1)",
          opacity: animationPhase === "zoom-in" ? 0.5 : 1,
          transition: animationPhase === "zoom-in" 
            ? "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out"
            : "transform 0.5s ease-out, opacity 0.5s ease-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* SVG Logo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 120"
          style={{
            width: 550,
            height: 165,
            filter: "drop-shadow(0 0 40px rgba(0,191,255,0.5))",
          }}
        >
          {/* V Shape */}
          <path
            d="M0 0 L50 0 L80 80 L110 0 L130 0 L85 120 L75 120 Z"
            fill="#00BFFF"
            style={{
              animation: "glow 2s ease-in-out infinite",
            }}
          />
          {/* P Circle */}
          <ellipse cx="105" cy="45" rx="25" ry="25" fill="#4A4A4A" />
          <ellipse cx="105" cy="45" rx="15" ry="15" fill="#1a1a2e" />
          {/* VALOR Text */}
          <text
            x="145"
            y="55"
            fontFamily="Arial Black, sans-serif"
            fontSize="48"
            fontWeight="900"
            fill="#00BFFF"
            fontStyle="italic"
          >
            VALOR
          </text>
          {/* PHARMACEUTICALS Text */}
          <text
            x="145"
            y="80"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fontWeight="400"
            fill="#00BFFF"
            letterSpacing="2"
          >
            PHARMACEUTICALS
          </text>
          {/* Address */}
          <text x="145" y="95" fontFamily="Arial, sans-serif" fontSize="11" fill="#00BFFF">
            124/A Industrial Triangle,
          </text>
          <text x="145" y="108" fontFamily="Arial, sans-serif" fontSize="11" fill="#00BFFF">
            Kahuta Road, Islamabad PAKISTAN.
          </text>
        </svg>

        {/* Loading indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 30,
            opacity: animationPhase === "zoom-in" ? 0 : 1,
            transition: "opacity 0.5s ease-out 0.3s",
          }}
        >
          <div
            style={{
              width: 300,
              height: 4,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, #00BFFF, #00E5FF, #00BFFF)",
                borderRadius: 2,
                animation: "loading 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 14,
            margin: 0,
            letterSpacing: 3,
            opacity: animationPhase === "zoom-in" ? 0 : 1,
            transition: "opacity 0.5s ease-out 0.5s",
          }}
        >
          ENTERPRISE RESOURCE PLANNING
        </p>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        @keyframes glow {
          0%, 100% {
            filter: drop-shadow(0 0 10px rgba(0,191,255,0.5));
          }
          50% {
            filter: drop-shadow(0 0 25px rgba(0,191,255,0.8));
          }
        }
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
