import { styled } from 'styled-components';
import { userInputLoginData } from '../atom';
import { useRecoilValue } from 'recoil';

const HomeContainer = styled.div`
  width: 40%;
  border: 1px solid black;
  padding: 20px;
  margin: 20% auto;
  text-align: center;
`;

export default function Home() {
  const loginUserInfo = useRecoilValue(userInputLoginData);
  console.log(loginUserInfo);
  return (
    <HomeContainer>
      <p>환영합니다!</p>
      <p>{loginUserInfo.userNickName}님!</p>
    </HomeContainer>
  );
}
