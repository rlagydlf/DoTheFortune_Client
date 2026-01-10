import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFrame from "../../components/auth/AuthFrame";
import AuthTitle from "../../components/auth/AuthTitle";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import AuthFooter from "../../components/auth/AuthFooter";
import { register } from "../../utils/api";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // TODO: 백엔드는 더 많은 정보를 요구하지만, 일단 기본 회원가입만 연결
      // 나중에 이름, 성별, 생년월일 등 추가 필요
      const response = await register({
        email,
        password: pw,
        name: "사용자", // 임시
        gender: "M", // 임시
        birth_year: 2000, // 임시
        birth_month: 1, // 임시
        birth_day: 1, // 임시
        birth_place: "서울", // 임시
        is_lunar: false,
      });
      console.log("Register successful:", response);
      // 회원가입 성공 시 홈으로 이동
      navigate("/home");
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "회원가입에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthFrame>
        <AuthTitle>SIGN UP</AuthTitle>

        <form className="authForm" onSubmit={onSubmit}>
          {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
          <AuthInput
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={isLoading}
          />
          <AuthInput
            type="password"
            placeholder="비밀번호를 입력해주세요 (최소 6자)"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
            disabled={isLoading}
          />

          <AuthButton type="submit" disabled={isLoading}>
            {isLoading ? "회원가입 중..." : "회원가입"}
          </AuthButton>
        </form>

        <AuthFooter text="이미 계정이 있으신가요?" linkText="로그인하기" to="/login" />
      </AuthFrame>
    </AuthLayout>
  );
}