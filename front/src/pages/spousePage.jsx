import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import logo from '../assets/logo.svg';

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #fff9d7;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const TopHeader = styled.div`
  position: absolute;
  top: 30px;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 50px;
  line-height: 1;
  img { width: 50px; }
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: #2c2c2c;
`;

const ContentCard = styled.div`
  width: 90vw;
  height: 85vh;
  max-width: 1280px;
  background-image: url("data:image/svg+xml,%3Csvg width='1508' height='865' viewBox='0 0 1508 865' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_234_1206)'%3E%3Cpath d='M1491.83 334.212C1578.67 765.782 1183.52 912.873 858.023 838.596C532.521 764.319 43.1512 986.556 4 473.084C4 186.214 65.2367 -107.174 636.606 54.1686C809.871 103.095 1378.06 -231.188 1491.83 334.212Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_234_1206' x='0' y='0' width='1508' height='865' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='4'/%3E%3CfeGaussianBlur stdDeviation='2'/%3E%3CfeComposite in2='hardAlpha' operator='out'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_234_1206'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_234_1206' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 4vh 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const TextGroup = styled.div`
  text-align: center;
`;

const MainTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #2c2c2c;
  margin: 0 0 10px 0;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

const ResultSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 25px;
  flex: 1;
  max-height: 320px;
`;

const SpouseImageContainer = styled.div`
  flex-shrink: 0;
  height: 100%;
  aspect-ratio: 1 / 1;
`;

const SpouseImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: #e0e0e0;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 500px;
`;

const InfoBox = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 5px;
`;

const InfoTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #2c2c2c;
  margin-bottom: 3px;
`;

const InfoItem = styled.div`
  font-size: 13px;
  color: #666;
  line-height: 1.5;
`;

const SaveButton = styled.button`
  width: 100%;
  max-width: 500px;
  height: 48px;
  background: #FFF3AE;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 400;

  &:hover {
    background: #FFD93D;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const LoadingMessage = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export default function SpousePage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  
  const [spouseData, setSpouseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpouseData = async () => {
      try {
        setLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        const DUMMY_DATA = {
          imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80", // 예시 이미지 (Unsplash)
          impression: ["선한 인상", "부드러운 선", "웃는 상"],
          fashion: ["단정한 느낌", "깔끔한 셔츠", "댄디룩"],
          mood: ["자상함", "가정적인", "따뜻한 성격"],
          job: ["IT 개발자", "연구원"]
        };

        setSpouseData(DUMMY_DATA);

        /*
        const response = await fetch('https://api.your-backend.com/spouse-result');
        if (!response.ok) throw new Error('서버 에러');
        const data = await response.json();
        setSpouseData(data);
        */

      } catch (err) {
        console.error(err);
        setError('결과를 가져오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpouseData();
  }, []);

  const handleSave = () => {
    setSaved(true);
    alert('저장되었습니다! 📸');
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>
          <div>🔮</div>
          <div>결과 분석 중입니다...</div>
        </LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <LoadingMessage>{error}</LoadingMessage>
      </Container>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <TopHeader>
          <Logo onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
            <img src={logo} alt="logo"/>
          </Logo>
          <Title onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>빌려온 사주</Title>
        </TopHeader>

        <ContentCard>
          <TextGroup>
            <MainTitle>나의 미래 배우자는?</MainTitle>
            <Subtitle>실제 인물을 예측하는 것이 아니며, 사주 성향을 바탕으로 시각화한 이미지입니다.</Subtitle>
          </TextGroup>

          <ResultSection>
            <SpouseImageContainer>
              <SpouseImage>
                {spouseData?.imageUrl ? (
                  <img src={spouseData.imageUrl} alt="미래 배우자 이미지" />
                ) : (
                  "이미지 없음"
                )}
              </SpouseImage>
            </SpouseImageContainer>

            <InfoGrid>
              <InfoBox>
                <InfoTitle>인상</InfoTitle>
                {spouseData?.impression?.map((item, idx) => (
                  <InfoItem key={idx}>{item}</InfoItem>
                ))}
              </InfoBox>

              <InfoBox>
                <InfoTitle>패션</InfoTitle>
                {spouseData?.fashion?.map((item, idx) => (
                  <InfoItem key={idx}>{item}</InfoItem>
                ))}
              </InfoBox>

              <InfoBox>
                <InfoTitle>무드</InfoTitle>
                {spouseData?.mood?.map((item, idx) => (
                  <InfoItem key={idx}>{item}</InfoItem>
                ))}
              </InfoBox>

              <InfoBox>
                <InfoTitle>직업</InfoTitle>
                {spouseData?.job?.map((item, idx) => (
                  <InfoItem key={idx}>{item}</InfoItem>
                ))}
              </InfoBox>
            </InfoGrid>
          </ResultSection>

          <SaveButton onClick={handleSave}>
            {saved ? '저장 완료! ✅' : '나의 미래 배우자 저장하기'}
          </SaveButton>
        </ContentCard>
      </Container>
    </>
  );
};