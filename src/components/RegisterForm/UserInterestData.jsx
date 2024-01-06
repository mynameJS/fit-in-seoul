import { styled } from 'styled-components';
import { userInputState } from '../../atom';
import { useRecoilState } from 'recoil';
import { useState } from 'react';

const UserInterestContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 20%;
  margin: 5% auto;
  border: 1px solid black;
  gap: 10px;

  p {
    color: red;
  }
`;

const InterestListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  div {
    border: 1px solid blue;
    border-radius: 50%;
    padding: 10px;
    cursor: pointer; /* 마우스를 가져다 대면 커서가 변하도록 설정 */
  }

  .selected {
    background-color: yellow; /* 선택된 항목의 배경색을 변경 */
  }
`;

const interestList = ['등산', '헬스', '런닝', '풋살', '탁구', '테니스'];

export default function UserInterestData() {
  const [userInterest, setUserInterest] = useState([]);

  const [userInput, setUserInput] = useRecoilState(userInputState);

  const toggleInterest = interest => {
    const updatedInterests = userInterest.includes(interest)
      ? userInterest.filter(item => item !== interest)
      : [...userInterest, interest];

    setUserInterest(updatedInterests);
  };

  const submitInterest = () => {
    if (!userInterest.length) {
      alert('최소 1개 이상의 관심사를 등록해주세요!');
      return;
    }
    alert('감사합니다!');
    setUserInput({ ...userInput, ['interest']: userInterest });
  };

  return (
    <UserInterestContainer>
      <p>관심활동을 추가해주세요</p>
      <InterestListContainer>
        {interestList.map(interest => (
          <div
            key={interest}
            className={userInterest.includes(interest) ? 'selected' : ''}
            onClick={() => toggleInterest(interest)}>
            {interest}
          </div>
        ))}
        <button onClick={submitInterest}>확인</button>
      </InterestListContainer>
    </UserInterestContainer>
  );
}
