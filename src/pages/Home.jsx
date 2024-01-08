import { styled } from 'styled-components';
import { Link } from 'react-router-dom';

const HomeContainer = styled.div`
  width: 40%;
  border: 1px solid black;
  margin: 20% auto;
  padding: 10px;

  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

export default function Home() {
  return (
    <HomeContainer>
      <p>Fit-In-Seoul 방문해 주셔서 감사합니다!</p>
      <Link to={'/login'}>
        <button>운동 친구 만나러 가기</button>
      </Link>
    </HomeContainer>
  );
}
