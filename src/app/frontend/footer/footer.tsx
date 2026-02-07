"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

export default function Footer() {
  const pathRef = useRef<SVGPathElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const down = "M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V683H0V-0.3z";
    const center = "M0-0.3C0-0.3,464,0,1139,0s1139-0.3,1139-0.3V683H0V-0.3z";

    // Set initial state
    if (pathRef.current) {
      pathRef.current.setAttribute("d", down);
    }

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      let waveTween: gsap.core.Tween | null = null;
      let waveTicker: gsap.TickerCallback | null = null;

      const playAnimation = () => {
        if (!pathRef.current || !svgRef.current) {
          return;
        }

        // Force a known starting state so the change is visible
        gsap.set(pathRef.current, { attr: { d: down } });
        gsap.set(svgRef.current, {
          scaleY: 1,
          y: 0,
          transformOrigin: "50% 0%",
        });

        // Morph quickly to center so the wave starts from a flat surface
        gsap.to(pathRef.current, {
          duration: 0.35,
          attr: { d: center },
          ease: "power2.out",
          overwrite: true,
        });

        // Vertical wave (liquid) using a damped sine update on the path
        if (waveTween) {
          waveTween.kill();
        }
        if (waveTicker) {
          gsap.ticker.remove(waveTicker);
        }

        const wave = { amp: 1 };
        const maxAmp = 48;
        const baseY = 0;
        const freq = 6;

        waveTicker = (time) => {
          if (!pathRef.current) {
            return;
          }
          const a = wave.amp * maxAmp;
          const t = time * freq;
          const y1 = baseY + Math.sin(t) * a;
          const y2 = baseY + Math.sin(t + Math.PI / 2) * a * 0.85;
          const y3 = baseY + Math.sin(t + Math.PI) * a;
          const d = `M0-0.3C0-0.3,464,${y1.toFixed(2)},1139,${y2.toFixed(
            2,
          )}S2278,${y3.toFixed(2)},2278-0.3V683H0V-0.3z`;
          pathRef.current.setAttribute("d", d);
        };

        gsap.ticker.add(waveTicker);

        waveTween = gsap.to(wave, {
          amp: 0,
          duration: 1.4,
          ease: "expo.out",
          onComplete: () => {
            if (waveTicker) {
              gsap.ticker.remove(waveTicker);
              waveTicker = null;
            }
            if (pathRef.current) {
              pathRef.current.setAttribute("d", center);
            }
          },
        });
      };

      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top bottom",
        onEnter: playAnimation,
        onEnterBack: playAnimation,
        onLeave: () => {
          if (pathRef.current) {
            gsap.set(pathRef.current, { attr: { d: down } });
          }
          if (svgRef.current) {
            gsap.set(svgRef.current, {
              scaleY: 1,
              y: 0,
              transformOrigin: "50% 0%",
            });
          }
        },
        onLeaveBack: () => {
          if (pathRef.current) {
            gsap.set(pathRef.current, { attr: { d: down } });
          }
          if (svgRef.current) {
            gsap.set(svgRef.current, {
              scaleY: 1,
              y: 0,
              transformOrigin: "50% 0%",
            });
          }
        },
      });

      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={footerRef} className="footer-container">
      <svg
        preserveAspectRatio="none"
        className="footer-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2278 683"
        ref={svgRef}
      >
        <path
          ref={pathRef}
          fill="var(--color-neutral-900)"
          d="M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V683H0V-0.3z"
        />
      </svg>
      <style jsx>{`
        .footer-container {
          position: relative;
          width: 100%;
          margin-top: auto;
          height: 100px;
        }

        .footer-svg {
          height: 100px;
          width: 100%;
          display: block;
          overflow: visible;
        }
      `}</style>
    </div>
  );
}
