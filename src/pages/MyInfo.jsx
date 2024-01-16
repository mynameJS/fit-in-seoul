import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const MyInfoContainer = styled.div`
  width: 50rem;
  height: 30rem;
  border: 1px solid black;
  margin: 5% auto;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  .MyInfo {
    display: flex;
    width: 100%;
    justify-content: space-around;
  }
`;

export default function MyInfo() {
  const navigate = useNavigate();
  const myInfo = JSON.parse(localStorage.getItem('currentUser'));
  console.log(myInfo);
  return (
    <MyInfoContainer>
      <div>{myInfo.userNickName}님의 정보</div>
      <div className="MyInfo">
        <div>
          <img
            src={myInfo.gender === 'male' ? '/male.svg' : '/female.svg'}
            alt={myInfo.gender === 'male' ? 'Male Icon' : 'Female Icon'}
          />
        </div>
        <div>
          <p>{myInfo.userIntroduce}</p>
        </div>
      </div>
      <div>
        <button>친구추가</button>
        <button>내가 쓴 글 보기</button>
        <button
          onClick={() => {
            navigate('/home');
          }}>
          홈으로
        </button>
      </div>
    </MyInfoContainer>
  );
}
