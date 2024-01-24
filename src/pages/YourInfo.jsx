import { useLocation, useNavigate } from 'react-router-dom';
import { updateData } from '../config/firebase';
import { useState } from 'react';

export default function YourInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedUserData = location.state.selectedUser;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [isFriend, setIsFriend] = useState(currentUser.userFriend?.includes(selectedUserData.id));

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
    <div className="bg-sky-100 h-screen text-slate-500 font-bold flex flex-col items-center gap-3">
      <div>
        <p className="text-2xl mt-5 text-slate-600">{selectedUserData.userNickName}님의 정보</p>
      </div>
      <div className="w-1/3 h-2/3 bg-sky-50 rounded-lg flex flex-col border-double border-4 border-sky-400">
        <div className="flex">
          <div className="avatar pt-8 pl-8 pr-8 pb-3">
            <div className="w-32 rounded-full">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <div className="text-sm flex flex-col justify-center gap-2">
            <p>성별 : {selectedUserData.gender === 'male' ? '남성' : '여성'}</p>
            <p>관심사 : {selectedUserData.interest.map(int => `${int} `)}</p>
            <p>사는 곳 : {selectedUserData.residence}</p>
          </div>
        </div>
        <div className="pl-16">
          {isFriend ? (
            <button className="btn btn-active btn-neutral btn-xs" onClick={deleteFriendHandler}>
              친구삭제
            </button>
          ) : (
            <button className="btn btn-active btn-neutral btn-xs" onClick={addFriendHandler}>
              친구추가
            </button>
          )}
        </div>
        <div className="text-sm flex flex-col items-center gap-2">
          <p>자기소개</p>
          <div>
            <p className="font-semibold text-sm">{selectedUserData.userIntroduce}</p>
          </div>
        </div>
        <div className="flex text-sm gap-5 justify-center mt-20">
          <button
            onClick={() => {
              navigate('/friend');
            }}>
            내 친구 리스트
          </button>
          <button
            onClick={() => {
              navigate('/recommend');
            }}>
            추천친구 리스트
          </button>
          <button
            onClick={() => {
              navigate('/home');
            }}>
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
