import React, { useCallback, useEffect, useMemo, useState } from "react";

import Banner1 from "../../assets/Banner1.png";
import Banner2 from "../../assets/Banner2.png";
import Banner3 from "../../assets/Banner3.png";

// ✅ 기존 데이터 export 유지 (다른 곳에서 default로 import하고 있을 수 있어서)
const banners = [
  { id: 1, image: Banner1, alt: "Banner 1" },
  { id: 2, image: Banner2, alt: "Banner 2" },
  { id: 3, image: Banner3, alt: "Banner 3" },
];

/**
 * ✅ 5초마다 자동으로 넘어가는 배너 컴포넌트
 * - 기본 interval: 5000ms
 * - hover 시 자동 넘김 일시정지
 * - 좌/우 버튼 및 점(dot) 옵션
 *
 * 사용 예:
 *   import banners, { BannerCarousel } from "./Banner";
 *   <BannerCarousel interval={5000} />
 */
export function BannerCarousel({
  interval = 5000,
  height = 420,
  showArrows = true,
  showDots = true,
  className = "",
  overlay = null, // 필요하면 JSX로 오버레이(문구/버튼 등) 전달
}) {
  const slides = useMemo(() => banners, []);
  const [index, setIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    if (isHover) return;

    const id = window.setInterval(goNext, interval);
    return () => window.clearInterval(id);
  }, [goNext, interval, isHover, slides.length]);

  // 접근성: 키보드 좌/우
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    },
    [goPrev, goNext]
  );

  const wrapperStyle = {
    position: "relative",
    width: "100%",
    height,
    overflow: "hidden",
    borderRadius: 24,
  };

  const slideStyleBase = {
    position: "absolute",
    inset: 0,
    transition: "opacity 500ms ease",
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const arrowStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 44,
    height: 44,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.6)",
    background: "rgba(0,0,0,0.25)",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    userSelect: "none",
    zIndex: 3,
  };

  const dotsWrapStyle = {
    position: "absolute",
    left: "50%",
    bottom: 14,
    transform: "translateX(-50%)",
    display: "flex",
    gap: 8,
    zIndex: 3,
  };

  const dotStyleBase = {
    width: 8,
    height: 8,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.9)",
    background: "transparent",
    cursor: "pointer",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    pointerEvents: "none", // 오버레이 내부에 버튼이 필요하면 아래에서 pointerEvents를 다시 켜면 됨
  };

  return (
    <section
      className={className}
      style={wrapperStyle}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      aria-roledescription="carousel"
      aria-label="Banner carousel"
    >
      {slides.map((b, i) => (
        <div
          key={b.id}
          style={{
            ...slideStyleBase,
            opacity: i === index ? 1 : 0,
            pointerEvents: i === index ? "auto" : "none",
          }}
          aria-hidden={i !== index}
        >
          <img src={b.image} alt={b.alt} style={imgStyle} />
        </div>
      ))}

      {/* 오버레이(문구/버튼 등) 필요하면 overlay prop으로 JSX 넣어줘 */}
      {overlay ? (
        <div style={overlayStyle}>
          <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
            {overlay}
          </div>
        </div>
      ) : null}

      {showArrows ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            style={{ ...arrowStyle, left: 14 }}
            aria-label="Previous banner"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            style={{ ...arrowStyle, right: 14 }}
            aria-label="Next banner"
          >
            ›
          </button>
        </>
      ) : null}

      {showDots ? (
        <div style={dotsWrapStyle} aria-label="Banner dots">
          {slides.map((b, i) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to banner ${i + 1}`}
              style={{
                ...dotStyleBase,
                background: i === index ? "rgba(255,255,255,0.9)" : "transparent",
              }}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default banners;