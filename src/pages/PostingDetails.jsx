import { styled } from 'styled-components';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { deletePostingData, updateData, updatePostingData, fetchPostingData } from '../config/firebase';
import { useState, useEffect } from 'react';

export default function PostingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPostingId } = location.state;
  const [selectedPostingData, setSelectedPostingData] = useState({});
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const isWriter = selectedPostingData?.writer === currentUser.id;
  const [isFriend, setIsFriend] = useState(currentUser.userFriend?.includes(selectedPostingData.writer));
  const [applicantList, setApplicantList] = useState([]);
  const isClosed = applicantList.length === selectedPostingData.count;
  const isApplyUser = applicantList.includes(currentUser.id) || isWriter;
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);

  console.log(selectedPostingData);
  console.log(applicantList);
  console.log(commentList);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postingData = await fetchPostingData();
        const filterData = postingData.filter(({ id }) => id === selectedPostingId);
        console.log(filterData);
        setSelectedPostingData(...filterData);
        setApplicantList(selectedPostingData.applicantList ?? []);

        const prePostingComment = filterData[0].postingComment ?? [];
        setCommentList(prePostingComment);
      } catch (error) {
        console.error('Error fetching posting data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setApplicantList(selectedPostingData.applicantList ?? []);
  }, [selectedPostingData]);

  const deletePostingHandler = async () => {
    const result = confirm('정말 삭제하시겠습니까?');
    if (result) {
      await deletePostingData(selectedPostingData.id);
      alert('삭제가 완료되었습니다.');
      navigate('/search');
    }
  };

  const addFriendHandler = async () => {
    const result = confirm(`${selectedPostingData.writerNickName}님을 친구 추가하시겠습니까?`);
    if (result) {
      const newFriend = selectedPostingData.writer;
      const newData = {
        ...currentUser,
        userFriend: currentUser.userFriend ? [...currentUser.userFriend, newFriend] : [newFriend],
      };
      await updateData(currentUser.id, newData);
      localStorage.setItem('currentUser', JSON.stringify(newData));
      setIsFriend(!isFriend);
      alert(`${selectedPostingData.writerNickName}님이 친구로 추가되었습니다!`);
    }
  };

  const deleteFriendHandler = async () => {
    const result = confirm(`${selectedPostingData.writerNickName}님을 정말 친구목록에서 삭제하시겠습니까?`);
    if (result) {
      const deleteTargetFriend = selectedPostingData.writer;
      const myNewFriendList = [...currentUser.userFriend].filter(friend => friend !== deleteTargetFriend);
      const newData = {
        ...currentUser,
        userFriend: myNewFriendList,
      };
      await updateData(currentUser.id, newData);
      localStorage.setItem('currentUser', JSON.stringify(newData));
      setIsFriend(!isFriend);
      alert(`${selectedPostingData.writerNickName}님을 친구 목록에서 삭제하였습니다!`);
    }
  };

  const addWorkoutGroupHandler = async () => {
    const newApplicant = [...applicantList, currentUser.id];
    const currentApplyPosting = currentUser.userApplyPosting ?? [];
    console.log(currentApplyPosting);
    const newApplyPosting = [...currentApplyPosting, selectedPostingData.id];
    const newPostingData = {
      ...selectedPostingData,
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
      await updatePostingData(selectedPostingData.id, newPostingData);
      localStorage.setItem('currentUser', JSON.stringify(newUserData));
      setApplicantList(newApplicant);
    }
  };

  const addCommentHandler = async e => {
    e.preventDefault();
    const newComment = comment;
    const prePostingComment = selectedPostingData.postingComment || [];
    const currentTime = new Date();
    const updatePostingComment = [
      ...prePostingComment,
      {
        commentWriter: currentUser.id,
        commentNickName: currentUser.userNickName,
        commentTime: currentTime,
        commentContent: newComment,
      },
    ];
    const newPostingData = {
      ...selectedPostingData,
      postingComment: updatePostingComment,
    };
    await updatePostingData(selectedPostingData.id, newPostingData);
    setCommentList(updatePostingComment);
    setComment('');
  };

  return (
    <div>
      <p>신청한 운동 모임 상세 페이지</p>
      <div>
        <div>
          <p>제목 : {selectedPostingData.title}</p>
          <p>날짜 : {selectedPostingData.date}</p>
          <p>카테고리 : {selectedPostingData.category}</p>
          <p>모집인원 : {selectedPostingData.count}</p>
          <p>위치 : {selectedPostingData.location}</p>
        </div>
        <div>
          <div>사진</div>
          <p>닉네임 : {selectedPostingData.writerNickName ? selectedPostingData.writerNickName : '이전데이터'}</p>
          {isWriter ? (
            <>
              <Link to={'/postingEdit'} state={{ editCard: selectedPostingData }}>
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
        <p>{selectedPostingData.content}</p>
      </div>
      <div>
        <p>
          현재 모집 인원 {applicantList.length} / {selectedPostingData.count}
        </p>
        {!isWriter && (
          <button onClick={addWorkoutGroupHandler} disabled={isClosed}>
            {isClosed ? `신청마감` : `신청하기`}
          </button>
        )}
      </div>
      {isApplyUser && (
        <div>
          <p>댓글</p>
          <div>
            {commentList.map((data, i) => (
              <div key={i}>
                <p>작성자 : {data.commentNickName}</p>
                <p>댓글내용 : {data.commentContent}</p>
                <p>작성시간 : 타임스탬프 변환방법 찾아보자</p>
              </div>
            ))}
          </div>
          <form onSubmit={addCommentHandler}>
            <label>
              <textarea
                type="text"
                value={comment}
                onChange={e => {
                  setComment(e.target.value);
                }}
              />
            </label>
            <button>작성하기</button>
          </form>
        </div>
      )}
      <button
        onClick={() => {
          navigate('/search');
        }}>
        목록
      </button>
    </div>
  );
}
