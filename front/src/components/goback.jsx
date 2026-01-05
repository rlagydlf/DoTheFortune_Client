/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";

const goBackButton = css`
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  padding: 0;
  min-width: 40px;
  min-height: 40px;
  /* flex/grid 컨테이너 안에서도 무조건 왼쪽으로 붙게 */
  margin-right: auto;
  margin-left:50px;
  align-self: flex-start;
  justify-self: start;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: #2f2f2f;
  font-family: "SF Pro", system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Apple SD Gothic Neo", "Noto Sans KR",
    sans-serif;
  font-size: 36px;
  font-weight: 900;
  line-height: 1;

  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  transition: transform 120ms ease, filter 120ms ease;

  &:hover {
    filter: drop-shadow(0 2px 0 rgba(0, 0, 0, 0.08));
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 3px solid rgba(47, 47, 47, 0.25);
    outline-offset: 4px;
  }
`;

export default function Goback() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <button css={goBackButton} onClick={handleGoBack} aria-label="뒤로가기">
      ←
    </button>
  );
}