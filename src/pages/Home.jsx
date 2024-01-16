import { styled } from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLoginUserData } from '../config/firebase';
import { logOutUser } from '../config/firebase';

const HomeContainer = styled.div`
  width: 40%;
  border: 1px solid black;
  padding: 20px;
  margin: 20% auto;
  text-align: center;
`;

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const currentUserDataInfo = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentLoginUserInfo = await fetchLoginUserData();
        const { id, userPassword, ...needUserData } = currentLoginUserInfo;
        // 필요한 유저 정보만 로컬스토리지에 저장
        localStorage.setItem('currentUser', JSON.stringify(needUserData));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log(currentUserDataInfo);
  const handleLogoutClick = async () => {
    await logOutUser();
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <HomeContainer>
      <>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>환영합니다!</p>
            <p>{currentUserDataInfo.userNickName}님!</p>
            <button
              onClick={() => {
                navigate('/recommend');
              }}>
              추천회원
            </button>
            <button
              onClick={() => {
                navigate('/group');
              }}>
              내 운동 모임
            </button>
            <button
              onClick={() => {
                navigate('/search');
              }}>
              운동모임찾기
            </button>
            <button
              onClick={() => {
                navigate('/friend');
              }}>
              내운동친구
            </button>
            <button
              onClick={() => {
                navigate('/info');
              }}>
              내정보
            </button>
            <button onClick={handleLogoutClick}>로그아웃</button>
          </>
        )}
      </>
    </HomeContainer>
  );
}
