import { styled } from 'styled-components';
import { currentLoginUserData } from '../atom';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { fetchLoginUserData } from '../config/firebase';
import { logOutUser } from '../config/firebase';
import { auth } from '../config/firebase';

const HomeContainer = styled.div`
  width: 40%;
  border: 1px solid black;
  padding: 20px;
  margin: 20% auto;
  text-align: center;
`;

export default function Home() {
  const navigate = useNavigate();
  const [currentUserData, setCurrentUserData] = useRecoilState(currentLoginUserData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentLoginUserInfo = await fetchLoginUserData();
        setCurrentUserData(currentLoginUserInfo);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogoutClick = async () => {
    await logOutUser();
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
            <p>{currentUserData.userNickName}님!</p>
            <button onClick={handleLogoutClick}>로그아웃</button>
          </>
        )}
      </>
    </HomeContainer>
  );
}
