import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFrame from "../../components/auth/AuthFrame";
import "./OtherPartyInformation.css";
import Goback from "../../components/goback";
import Loading from "../../components/loading/Loading";
import LoadingSuccess from "../../components/loading/LoadingSuccess";
import { calculateCompatibility, saveUserInfo } from "../../utils/api";

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
      // 상대방 정보도 사주 정보로 저장
      const [birthYear, birthMonth, birthDay] = form.birthDate.split("-").map(Number);
      const [birthHour, birthMinute] = form.birthTime.split(":").map(Number);

      const otherFortuneInfo = {
        birth_year: birthYear,
        birth_month: birthMonth,
        birth_day: birthDay,
        birth_hour: birthHour,
        birth_minute: birthMinute,
        unknown_time: false,
        birth_place: form.birthCity || "",
      };

      // TODO: 백엔드는 user2_id를 받는데, 현재는 두 사용자 모두 로그인된 상태가 아님
      // 현재 구조상 궁합 계산은 로그인된 두 사용자 간에만 가능
      // 임시로 로컬에서 결과를 생성하고, 나중에 백엔드 API 확장 시 실제 API 호출로 교체
      
      // 임시: 로컬에서 결과 시뮬레이션 (실제 백엔드 API 호출로 교체 필요)
      await new Promise((r) => setTimeout(r, 1200));

      // 궁합 결과 데이터 생성 (백엔드 응답 형식에 맞춤)
      const compatibilityResult = {
        score: 88,
        analysis: "서로의 부족한 부분을 자연스럽게 채워주는 관계예요.\n대화가 편안하고 함께 있으면 안정감을 느낄 수 있어요.",
        communication_analysis: "두 분의 대화의 흐름이 비교적 부드러운 편이에요.\n굳이 설명하지 않아도 감정이나 의도를 눈치채는 순간이 있고,\n때로는 친구처럼 편안하게 이야기가 이어져요.\n다만 생각의 방향이 다를 때는 서로의 관점을 끝까지 들어주는 태도가 관계를 더 단단하게 만들어줘요.",
        emotion_analysis: "감정 표현이 조금 다를 수는 있지만, 그 차이가 오히려 서로를 보완하는 역할을 해요.\n한 사람은 차분하게 상황을 바라보고,\n다른 한 사람은 솔직하게 감정을 드러내며 관계에 생동감을 불어넣는 조합이에요.",
        lifestyle_analysis: "현실적인 목표나 생활 태도에서 공통점이 많은 편이에요.\n함께 무언가를 계획하거나 도전할 때 자연스럽게 역할 분담이 이루어질 가능성이 커요.\n다만 생활 리듬이나 중요하게 여기는 우선순위는 다를 수 있으니,\n중요한 결정은 충분한 대화를 거쳐 조율하는 게 좋아요.",
        caution_analysis: "가끔은 서로 다른 속도와 스타일 때문에 오해가 생길 수 있어요.\n상대의 말투나 표현 방식 뒤에 숨은 진짜 의도를 한 번 더 생각해 보고,\n감정이 격해질수록 잠시 멈춘 뒤 대화하는 연습이 도움이 돼요.",
      };

      // 궁합 결과 페이지로 이동
      navigate("/result", {
        state: {
          compatibility: compatibilityResult,
          myInfo: myInfo,
          otherInfo: form,
        },
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "궁합 계산 중 오류가 발생했습니다. 다시 시도해 주세요.");
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
      {/* Success 오버레이는 navigate로 이동하므로 여기서는 사용하지 않음 */}
    </AuthLayout>
  );
}
