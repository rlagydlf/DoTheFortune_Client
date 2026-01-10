import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Loading Overlay (통합)
 *
 * 기본 사용:
 * <Loading open={isLoading} title="로딩 중…" desc="잠시만 기다려 주세요." />
 *
 * 완료(성공) 화면처럼 버튼까지 같이 쓰고 싶으면:
 * <Loading variant="success" open={isDone} title="완료!" desc="이미지 생성이 끝났어요" />
 *
 * 커스텀 버튼:
 * <Loading actionText="다음으로" actionTo="/result" />
 */
export default function Loading({
  open = true,
  title = "로딩 중…",
  desc = "잠시만 기다려 주세요.",
  minShowMs = 1200,
  variant = "default", // 'default' | 'success'
  actionText,
  onAction,
  actionTo,
}) {
  const [render, setRender] = useState(open);
  const openedAtRef = useRef(0);
  const hideTimerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (open) {
      openedAtRef.current = Date.now();
      setRender(true);
      return;
    }

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

  const isSuccess = variant === "success";
  const resolvedActionText =
    actionText ?? (isSuccess ? "미래 배우자 보러가기 →" : undefined);
  const showActionBtn = Boolean(resolvedActionText);
  const resolvedActionTo =
    actionTo ?? (isSuccess ? "/home" : undefined);

  const handleAction = () => {
    if (typeof onAction === "function") return onAction();
    if (typeof resolvedActionTo === "string" && resolvedActionTo.length > 0) {
      navigate(resolvedActionTo);
    }
  };

  const isDisabled =
    showActionBtn &&
    typeof onAction !== "function" &&
    !(typeof resolvedActionTo === "string" && resolvedActionTo.length > 0);

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

        {showActionBtn ? (
          <button
            type="button"
            className="dtf-loading__btn"
            onClick={handleAction}
            disabled={isDisabled}
          >
            {resolvedActionText}
          </button>
        ) : null}
      </div>

      <style>{`
        /* 폰트는 프로젝트 전역에서 이미 로드되어 있으면 이 블록은 무시해도 됩니다. */
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
          font-family: "Pretendard";
          src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Regular.woff2")
            format("woff2");
          font-weight: 400;
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
          font-family: "Pretendard", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.2px;
          color: rgba(255, 255, 255, 0.95);
        }

        .dtf-loading__desc {
          font-family: "Pretendard", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          margin: 6px 0 0;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: -0.2px;
          color: rgba(255, 255, 255, 0.78);
        }

        .dtf-loading__btn {
          font-family: "Paperozi", "Pretendard", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
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