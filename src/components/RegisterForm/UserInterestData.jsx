import { userInputState } from '../../atom';
import { useRecoilState } from 'recoil';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userInterestValidation } from './validation';
import { interestList } from '../../constant/constant';

// const UserInterestContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;

//   width: 20%;
//   margin: 5% auto;
//   border: 1px solid black;
//   gap: 10px;

//   p {
//     color: red;
//   }
// `;

// const InterestListContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 10px;

//   div {
//     border: 1px solid blue;
//     border-radius: 50%;
//     padding: 10px;
//     cursor: pointer; /* 마우스를 가져다 대면 커서가 변하도록 설정 */
//   }

//   .selected {
//     background-color: yellow; /* 선택된 항목의 배경색을 변경 */
//   }
// `;

export default function UserInterestData() {
  const navigate = useNavigate();
  const [userInterest, setUserInterest] = useState([]);
  const [userInput, setUserInput] = useRecoilState(userInputState);

  const toggleInterest = interest => {
    const updatedInterests = userInterest.includes(interest)
      ? userInterest.filter(item => item !== interest)
      : [...userInterest, interest];

    setUserInterest(updatedInterests);
  };

  const submitInterest = () => {
    if (!userInterestValidation(userInterest)) {
      alert('최소 1개 이상의 관심사를 등록해주세요!');
      return;
    }
    alert('감사합니다!');
    setUserInput({ ...userInput, ['interest']: userInterest });
    navigate('/register_profile');
  };

  return (
    <div className="bg-sky-100 h-screen text-slate-500 font-bold flex flex-col items-center gap-7 pt-20">
      <p className="text-3xl">관심활동을 추가해주세요</p>
      <div className="flex flex-col items-center gap-5 text-2xl font-semibold ">
        {interestList.map(interest => {
          const selectedClassName = userInterest.includes(interest) ? 'selected text-indigo-300' : '';

          return (
            <div
              key={interest}
              className={`cursor-pointer ${selectedClassName} `}
              onClick={() => toggleInterest(interest)}>
              {interest}
            </div>
          );
        })}
        <button className="text-xl" onClick={submitInterest}>
          확인
        </button>
      </div>
    </div>
  );
}
