import React from "react";
import Loading from "./Loading";

/**
 * @deprecated 이제 Loading 하나로 통합되었습니다.
 * 기존 import 경로를 깨지 않기 위해 남겨둔 래퍼입니다.
 *
 * 앞으로는 아래처럼 사용하세요:
 * <Loading variant="success" />
 */
export default function LoadingSuccess(props) {
  return <Loading {...props} variant="success" />;
}