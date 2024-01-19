import { styled } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateData } from '../config/firebase';
import { useState } from 'react';

const YourInfoContainer = styled.div`
  margin: 20% 0;
  padding: 3rem;
  width: 50rem;
  height: auto;
  border: 1px solid black;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

export default function YourInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedUserData = location.state.selectedUser;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [isFriend, setIsFriend] = useState(currentUser.userFriend?.includes(selectedUserData.id));

  // postingDetails에 있는 함수랑 똑같음. 나중에 리팩토링해야됨
  const addFriendHandler = async () => {
    const result = confirm(`${selectedUserData.userNickName}님을 친구 추가하시겠습니까?`);
    if (result) {
      const newFriend = selectedUserData.id;
      const newData = {
        ...currentUser,
        userFriend: currentUser.userFriend ? [...currentUser.userFriend, newFriend] : [newFriend],
      };
      await updateData(currentUser.id, newData);
      localStorage.setItem('currentUser', JSON.stringify(newData));
      setIsFriend(!isFriend);
      alert(`${selectedUserData.userNickName}님이 친구로 추가되었습니다!`);
    }
  };

  const deleteFriendHandler = async () => {
    const result = confirm(`${selectedUserData.userNickName}님을 정말 친구목록에서 삭제하시겠습니까?`);
    if (result) {
      const deleteTargetFriend = selectedUserData.id;
      const myNewFriendList = [...currentUser.userFriend].filter(friend => friend !== deleteTargetFriend);
      const newData = {
        ...currentUser,
        userFriend: myNewFriendList,
      };
      await updateData(currentUser.id, newData);
      localStorage.setItem('currentUser', JSON.stringify(newData));
      setIsFriend(!isFriend);
      alert(`${selectedUserData.userNickName}님을 친구 목록에서 삭제하였습니다!`);
    }
  };

  return (
    <YourInfoContainer>
      <div>{selectedUserData.userNickName}님의 정보</div>
      <div>자기소개 : {selectedUserData.userIntroduce}</div>
      <div>
        {isFriend ? (
          <button onClick={deleteFriendHandler}>친구삭제</button>
        ) : (
          <button onClick={addFriendHandler}>친구추가</button>
        )}
        <button>{selectedUserData.userNickName}님이 쓴 글 보기</button>
      </div>
      <button
        onClick={() => {
          navigate('/friend');
        }}>
        친구목록
      </button>
    </YourInfoContainer>
  );
}
