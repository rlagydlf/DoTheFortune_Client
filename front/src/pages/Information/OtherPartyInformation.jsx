import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFrame from "../../components/auth/AuthFrame";
import "./OtherPartyInformation.css";
import Goback from "../../components/goback";
import Loading from "../../components/loading/Loading";
import LoadingSuccess from "../../components/loading/LoadingSuccess";

export default function OtherPartyInformation() {
  const navigate = useNavigate();
  const location = useLocation();

  const myInfo = location?.state?.myInfo || null;

  // 로딩 오버레이 (궁합 계산)
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const loadingTitle = "두 분의 궁합을 계산하고 있어요";
  const loadingDesc = "사주 정보를 분석 중입니다";

  const successTitle = "궁합 결과가 준비됐어요!";
  const successDesc = "결과를 확인해 주세요";
  const successActionText = "홈으로 →";

  // TODO: 실제 로그인 유저명으로 교체 input 기본값도 실제 로그인 유저명으로

  const [form, setForm] = useState({
    userName: "",
    gender: "male", // male | female
    calendar: "solar", // solar | lunar
    birthDate: "1991-01-20",
    birthTime: "01:00",
    birthCity: "",
  });

  const timeOptions = useMemo(() => {
    // 30분 단위 옵션 (원하면 10분 단위도 가능)
    const arr = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        arr.push(`${hh}:${mm}`);
      }
    }
    return arr;
  }, []);

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onToggle = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    setIsSuccessOpen(false);
    setIsLoading(true);

    try {
      // TODO: 궁합 계산 API 연결
      // 현재는 연결 전이므로 콘솔로만 확인
      console.log("MY_INFO:", myInfo);
      console.log("OTHER_INFO:", form);

      // 서버 연결 전까지는 로딩 UI 확인용으로 짧게 지연
      await new Promise((r) => setTimeout(r, 1200));

      // 계산 완료 후 Success 오버레이 표시 (임시)
      setIsSuccessOpen(true);
    } catch (err) {
      console.error(err);
      alert("궁합 계산 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Goback />
      <AuthFrame>
        <h1 className="infoTitle">상대방의 정보를 입력해주세요!</h1>

        <form className="infoForm" onSubmit={onSubmit}>
          {/* 이름 */}
          <input
            className="infoInput"
            placeholder="이름을 입력해주세요"
            value={form.userName}
            onChange={onChange("userName")}
            autoComplete="name"
          />

          {/* 성별 */}
          <div className="segmented" role="group" aria-label="성별 선택">
            <button
              type="button"
              className={`segBtn ${form.gender === "male" ? "active" : ""}`}
              onClick={() => onToggle("gender", "male")}
            >
              남성
            </button>
            <button
              type="button"
              className={`segBtn ${form.gender === "female" ? "active" : ""}`}
              onClick={() => onToggle("gender", "female")}
            >
              여성
            </button>
          </div>

          {/* 양력/음력 + 생년월일/시간 */}
          <div className="row">
            <div className="segmented small" role="group" aria-label="양력/음력 선택">
              <button
                type="button"
                className={`segBtn ${form.calendar === "solar" ? "active" : ""}`}
                onClick={() => onToggle("calendar", "solar")}
              >
                양력
              </button>
              <button
                type="button"
                className={`segBtn ${form.calendar === "lunar" ? "active" : ""}`}
                onClick={() => onToggle("calendar", "lunar")}
              >
                음력
              </button>
            </div>

            {/* 날짜 */}
            <div className="selectWrap">
              <input
                className="infoSelect"
                type="date"
                value={form.birthDate}
                onChange={onChange("birthDate")}
              />
              <span className="chev" aria-hidden="true">▾</span>
            </div>

            {/* 시간 */}
            <div className="selectWrap">
              <select
                className="infoSelect"
                value={form.birthTime}
                onChange={onChange("birthTime")}
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <span className="chev" aria-hidden="true">▾</span>
            </div>
          </div>

          {/* 도시 */}
          <input
            className="infoInput"
            placeholder="태어난 도시명을 입력해주세요"
            value={form.birthCity}
            onChange={onChange("birthCity")}
          />

          <button className="saveBtn" type="submit">
            정보 저장하기
          </button>
        </form>
      </AuthFrame>

      {/* ✅ 상대방 정보까지 입력 완료 후 궁합 계산 로딩 */}
      <Loading open={isLoading} title={loadingTitle} desc={loadingDesc} />
      <LoadingSuccess
        open={isSuccessOpen}
        title={successTitle}
        desc={successDesc}
        actionText={successActionText}
        onAction={() => navigate("/home")}
      />
    </AuthLayout>
  );
}
