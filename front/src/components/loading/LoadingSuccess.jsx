import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Loading Overlay
 * 사용법:
 * <Loading open={isLoading} title="미래 배우자를 누구일까요?" desc="AI가 분석 중입니다" />
 */
export default function LoadingSuccess({
  open = true,
  title = "로딩 중…",
  desc = "잠시만 기다려 주세요.",
  minShowMs = 1200,
  actionText = "미래 배우자 보러가기 →",
  onAction,
}) {
  const [render, setRender] = useState(open);
  const openedAtRef = useRef(0);
  const hideTimerRef = useRef(null);

  const navigate = useNavigate();

  // 결과 영역(이미지/데이터) 렌더링은 다른 팀원이 작업 중이라 추후 연결 예정
  // TODO: 완료 화면에 결과(이미지/데이터) 영역 연결

  const handleAction = () => {
    // 우선은 임시로 홈으로 이동 (추후 결과 페이지로 연결)
    if (typeof onAction === "function") return onAction();
    navigate("/home");
  };

  useEffect(() => {
    // cleanup any pending timer
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (open) {
      openedAtRef.current = Date.now();
      setRender(true);
      return;
    }

    // When closing, keep it visible until minShowMs has elapsed
    if (!render) return;

    const elapsed = openedAtRef.current ? Date.now() - openedAtRef.current : 0;
    const remaining = Math.max(0, minShowMs - elapsed);

    hideTimerRef.current = setTimeout(() => {
      setRender(false);
      hideTimerRef.current = null;
    }, remaining);

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [open, minShowMs, render]);

  if (!render) return null;

  return (
    <div className="dtf-loading__backdrop" role="status" aria-live="polite">
      <div className="dtf-loading__content">
        <div className="dtf-loading__spinner" aria-hidden="true">
          <svg
            className="dtf-loading__spinnerSvg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 120"
          >
            <defs>
              <linearGradient
                id="dtfStroke"
                x1="18"
                y1="18"
                x2="102"
                y2="102"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFF9D7" />
                <stop offset="1" stopColor="#FFD562" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient
                id="dtfCenter"
                x1="34"
                y1="30"
                x2="88"
                y2="90"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFF9D7" />
                <stop offset="1" stopColor="#FFF3AE" />
              </linearGradient>
            </defs>

            {/* 바깥 반원 (시계 방향) */}
            <circle
              className="dtf-arc dtf-arc--outer"
              cx="60"
              cy="60"
              r="44"
              fill="none"
              stroke="url(#dtfStroke)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="138 276"
            />

            {/* 안쪽 반원 (시작점 다르게 + 반시계 방향) */}
            <circle
              className="dtf-arc dtf-arc--inner"
              cx="60"
              cy="60"
              r="34"
              fill="none"
              stroke="url(#dtfStroke)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="107 214"
              strokeDashoffset="54"
            />

            {/* 가운데 원 (시계 방향) */}
            <g className="dtf-centerGroup">
              <circle cx="60" cy="60" r="18" fill="url(#dtfCenter)" />
              {/* 회전이 눈에 보이도록 작은 하이라이트 점 추가 */}
              <circle cx="60" cy="42" r="3" fill="rgba(255,255,255,0.9)" />
            </g>
          </svg>
        </div>

        <p className="dtf-loading__title">{title}</p>
        <p className="dtf-loading__desc">{desc}</p>

        <button
          type="button"
          className="dtf-loading__btn"
          onClick={handleAction}
        >
          {actionText}
        </button>

        {/*
          TODO: 결과(이미지/데이터) 영역은 다른 팀원이 작업 중이라 주석 처리해둡니다.
          <div className="dtf-loading__result">
            <img src={resultImageUrl} alt="생성된 이미지" />
          </div>
        */}
      </div>

      <style>{`
        @font-face {
            font-family: "Paperozi";
            src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-1Thin.woff2")
                format("woff2");
            font-weight: 100;
            font-display: swap;
        }

        @font-face {
            font-family: "Paperozi";
            src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-2ExtraLight.woff2")
                format("woff2");
            font-weight: 200;
            font-display: swap;
        }

        @font-face {
            font-family: "Paperozi";
            src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-3Light.woff2")
                format("woff2");
            font-weight: 300;
            font-display: swap;
        }

        @font-face {
            font-family: "Paperozi";
            src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-4Regular.woff2")
                format("woff2");
            font-weight: 400;
            font-display: swap;
        }

        @font-face {
            font-family: "Paperozi";
            src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-5Medium.woff2")
                format("woff2");
            font-weight: 500;
            font-display: swap;
        }

        @font-face {
            font-family: "Paperozi";
            src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-6SemiBold.woff2")
                format("woff2");
            font-weight: 600;
            font-display: swap;
        }

        @font-face {
            font-family: "Paperozi";
            src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-7Bold.woff2")
                format("woff2");
            font-weight: 700;
            font-display: swap;
        }

        @font-face {
            font-family: "Paperozi";
            src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-8ExtraBold.woff2")
                format("woff2");
            font-weight: 800;
            font-display: swap;
        }

        @font-face {
            font-family: "Paperozi";
            src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-9Black.woff2")
                format("woff2");
            font-weight: 900;
            font-display: swap;
        }

        @font-face {
            font-family: "Pretendard";
            src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Regular.woff2")
                format("woff2");
            font-weight: 400;
            font-display: swap;
        }

        @font-face {
            font-family: "Pretendard";
            src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Regular.woff2")
                format("woff2");
            font-weight: 800;
            font-display: swap;
        }

        .dtf-loading__backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
        }

        .dtf-loading__content {
          text-align: center;
        }

        .dtf-loading__spinner {
          width: 110px;
          height: 110px;
          margin: 6px auto 10px;
          display: grid;
          place-items: center;
        }

        /* SVG 전체(반원 2개 + 가운데 원)를 한 덩어리로 360도 회전 */
        .dtf-loading__spinnerSvg {
          width: 100%;
          height: 100%;
          display: block;
          transform-origin: 50% 50%;
          transform-box: fill-box;
          animation: dtfSpin 1.15s linear infinite;
        }

        /* 안쪽 반원은 SVG 전체 회전(+360)과 반대로 보이도록 추가 역회전(-720) */
        .dtf-arc--inner {
          transform-origin: 50% 50%;
          transform-box: fill-box;
          animation: dtfInnerCounterSpin 1.15s linear infinite;
        }

        .dtf-loading__title {
          font-family: "Pretendard";
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.2px;
          color: rgba(255, 255, 255, 0.95);
        }

        .dtf-loading__desc {
          margin: 6px 0 0;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: -0.2px;
          color: rgba(255, 255, 255, 0.78);
        }

        .dtf-loading__btn {
          font-family: "Paperozi";
          margin-top: 12px;
          width: 100%;
          height: 40px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          color: rgba(255, 255, 255, 0.92);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.14);
        }

        .dtf-loading__btn:disabled {
          opacity: 0.6;
          cursor: default;
        }

        @keyframes dtfSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* 부모(+360) + 자식(-720) = 최종 -360 (바깥 반원과 반대 방향) */
        @keyframes dtfInnerCounterSpin {
          to {
            transform: rotate(-720deg);
          }
        }
      `}</style>
    </div>
  );
}
