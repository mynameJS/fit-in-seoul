import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FindWorkoutSearchContainer = styled.div`
  width: 50rem;
  height: 30rem;
  border: 1px solid black;
  margin: 5% auto;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

export default function FindWorkoutSearch() {
  const navigate = useNavigate();
  return (
    <FindWorkoutSearchContainer>
      <p>운동모임찾기</p>
      <div>
        <button
          onClick={() => {
            navigate('/posting');
          }}>
          글쓰기
        </button>
      </div>
      <div>필터링</div>
      <div>
        <div>게시글1</div>
        <div>게시글2</div>
        <div>게시글3</div>
        <div>게시글4</div>
        <div>게시글5</div>
      </div>
    </FindWorkoutSearchContainer>
  );
}
