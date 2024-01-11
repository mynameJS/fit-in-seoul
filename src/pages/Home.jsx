import { styled } from 'styled-components';
import { currentLoginUserData } from '../atom';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
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
  const [currentUserData, setCurrentUserData] = useRecoilState(currentLoginUserData);

  useEffect(() => {
    const fetchData = async () => {
      const currentLoginUserInfo = await fetchLoginUserData();
      console.log({ currentLoginUserInfo });
      setCurrentUserData(currentLoginUserInfo);
    };

    fetchData();
  }, []);

  const handleLogoutClick = () => {
    logOutUser();
    navigate('/login');
  };

  return (
    <HomeContainer>
      <>
        <p>환영합니다!</p>
        <p>{currentUserData.userNickName}님!</p>
        <button onClick={handleLogoutClick}>로그아웃</button>
      </>
    </HomeContainer>
  );
}
