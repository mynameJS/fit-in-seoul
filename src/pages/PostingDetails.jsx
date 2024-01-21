import { styled } from 'styled-components';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { deletePostingData, updateData, updatePostingData } from '../config/firebase';
import { useState } from 'react';

export default function PostingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCard } = location.state;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const isWriter = selectedCard.writer === currentUser.id;
  const [isFriend, setIsFriend] = useState(currentUser.userFriend?.includes(selectedCard.writer));
  const [applicantList, setApplicantList] = useState(selectedCard.applicantList ?? []);
  const isClosed = applicantList.length === selectedCard.count;
  console.log(selectedCard);
  console.log(applicantList);
  const deletePostingHandler = async () => {
    const result = confirm('정말 삭제하시겠습니까?');
    if (result) {
      await deletePostingData(selectedCard.id);
      alert('삭제가 완료되었습니다.');
      navigate('/search');
    }
  };

  const addFriendHandler = async () => {
    const result = confirm(`${selectedCard.writerNickName}님을 친구 추가하시겠습니까?`);
    if (result) {
      const newFriend = selectedCard.writer;
      const newData = {
        ...currentUser,
        userFriend: currentUser.userFriend ? [...currentUser.userFriend, newFriend] : [newFriend],
      };
      await updateData(currentUser.id, newData);
      localStorage.setItem('currentUser', JSON.stringify(newData));
      setIsFriend(!isFriend);
      alert(`${selectedCard.writerNickName}님이 친구로 추가되었습니다!`);
    }
  };

  const deleteFriendHandler = async () => {
    const result = confirm(`${selectedCard.writerNickName}님을 정말 친구목록에서 삭제하시겠습니까?`);
    if (result) {
      const deleteTargetFriend = selectedCard.writer;
      const myNewFriendList = [...currentUser.userFriend].filter(friend => friend !== deleteTargetFriend);
      const newData = {
        ...currentUser,
        userFriend: myNewFriendList,
      };
      await updateData(currentUser.id, newData);
      localStorage.setItem('currentUser', JSON.stringify(newData));
      setIsFriend(!isFriend);
      alert(`${selectedCard.writerNickName}님을 친구 목록에서 삭제하였습니다!`);
    }
  };

  const addWorkoutGroupHandler = async () => {
    const newApplicant = [...applicantList, currentUser.id];
    const currentApplyPosting = currentUser.applyPosting ?? [];
    const newApplyPosting = [...currentApplyPosting, selectedCard.id];
    const newPostingData = {
      ...selectedCard,
      applicantList: newApplicant,
    };
    const newUserData = {
      ...currentUser,
      userApplyPosting: newApplyPosting,
    };
    const result = confirm('해당 운동 모임에 신청하시겠습니까?');
    if (result) {
      alert('신청이 완료되었습니다!');
      // 유저 정보에 신청 포스팅 아이디 넣기
      await updateData(currentUser.id, newUserData);
      // 포스팅 데이터에 신청 유저 데이터 넣기
      await updatePostingData(selectedCard.id, newPostingData);
      localStorage.setItem('currentUser', JSON.stringify(newUserData));
      setApplicantList(newApplicant);
    }
  };

  return (
    <div>
      <p>신청한 운동 모임 상세 페이지</p>
      <div>
        <div>
          <p>제목 : {selectedCard.title}</p>
          <p>날짜 : {selectedCard.date}</p>
          <p>카테고리 : {selectedCard.category}</p>
          <p>모집인원 : {selectedCard.count}</p>
          <p>위치 : {selectedCard.location}</p>
        </div>
        <div>
          <div>사진</div>
          <p>닉네임 : {selectedCard.writerNickName ? selectedCard.writerNickName : '이전데이터'}</p>
          {isWriter ? (
            <>
              <Link to={'/postingEdit'} state={{ editCard: selectedCard }}>
                <button>수정하기</button>
              </Link>
              <button onClick={deletePostingHandler}>삭제하기</button>
            </>
          ) : isFriend ? (
            <button onClick={deleteFriendHandler}>친구삭제</button>
          ) : (
            <button onClick={addFriendHandler}>친구추가</button>
          )}
        </div>
      </div>
      <div>
        <p>{selectedCard.content}</p>
      </div>
      <div>
        <p>
          현재 모집 인원 {applicantList.length} / {selectedCard.count}
        </p>
        {!isWriter && (
          <button onClick={addWorkoutGroupHandler} disabled={isClosed}>
            {isClosed ? `신청마감` : `신청하기`}
          </button>
        )}
      </div>
      <div>댓글기능예정</div>
      <button
        onClick={() => {
          navigate('/search');
        }}>
        목록
      </button>
    </div>
  );
}
