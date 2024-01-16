import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { updateData } from '../config/firebase';

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
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState(myInfo.userIntroduce);

  const editIntroduceHandler = async () => {
    const userId = myInfo.id;
    const { id, userIntroduce, ...preData } = myInfo;
    const newData = {
      ...preData,
      userIntroduce: editValue,
    };
    await updateData(userId, newData);
    localStorage.setItem('currentUser', JSON.stringify({ ...myInfo, userIntroduce: editValue }));
    setIsEdit(!isEdit);
  };

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
          {isEdit && (
            <div>
              <input
                value={editValue}
                onChange={e => {
                  setEditValue(e.target.value);
                }}
              />
              <button onClick={editIntroduceHandler}>수정하기</button>
            </div>
          )}
          {!isEdit && <p>{myInfo.userIntroduce}</p>}
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            setIsEdit(!isEdit);
          }}>
          프로필 편집
        </button>
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
