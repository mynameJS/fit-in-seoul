import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  deletePostingData,
  updateData,
  updatePostingData,
  fetchPostingData,
  getCurrentTimestamp,
} from '../config/firebase';
import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';

export default function PostingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const { selectedPostingId } = location.state;
  const [selectedPostingData, setSelectedPostingData] = useState({});
  const isWriter = selectedPostingData?.writer === currentUser.id;
  const [isFriend, setIsFriend] = useState(false);
  const [applicantList, setApplicantList] = useState([]);
  const isClosed = applicantList.length === selectedPostingData.count;
  const isApplyUser = applicantList.includes(currentUser.id) || isWriter;
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [commentEditStates, setCommentEditStates] = useState({});
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postingData = await fetchPostingData();
        const filterData = postingData.filter(({ id }) => id === selectedPostingId);
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

  useEffect(() => {
    setIsFriend(currentUser.userFriend?.includes(selectedPostingData.writer));
  }, [currentUser.userFriend, selectedPostingData.writer]);

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

  console.log(commentList);
  const addCommentHandler = async e => {
    e.preventDefault();
    const newComment = comment;
    const currentTime = new Date();
    const preCommentList = [...commentList];
    const updatePostingComment = [
      {
        commentWriter: currentUser.id,
        commentNickName: currentUser.userNickName,
        commentTime: currentTime,
        commentContent: newComment,
      },
    ];
    const newPostingData = {
      ...selectedPostingData,
      postingComment: [...preCommentList, ...updatePostingComment],
    };
    await updatePostingData(selectedPostingData.id, newPostingData);
    setCommentList(prevCommentList => [...prevCommentList, ...updatePostingComment]);
    console.log('최신댓글리스트상태값', commentList);
    setComment('');
  };

  const deleteCommentHandler = async commentId => {
    console.log(commentId);
    try {
      const result = confirm('정말 삭제 하시겠습니까?');
      if (result) {
        const updatedCommentList = commentList.filter(comment => comment.commentTime.seconds !== commentId);
        console.log('삭제당시리스트', commentList);
        console.log('댓글삭제된최신리스트', updatedCommentList);
        await updatePostingData(selectedPostingData.id, { postingComment: updatedCommentList });
        setCommentList(updatedCommentList);
        setCommentEditStates({});
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const editCommentContentHandler = async commentId => {
    try {
      const updatedCommentList = commentList.map(comment => {
        if (comment.commentTime.seconds === commentId) {
          return {
            ...comment,
            commentContent: editContent,
          };
        }
        return comment;
      });

      await updatePostingData(selectedPostingData.id, { postingComment: updatedCommentList });
      setCommentList(updatedCommentList);
      setCommentEditStates({});
    } catch (error) {
      console.error('Error updating comment content:', error);
    }
  };

  return (
    <div className="bg-sky-100 h-screen text-slate-500 font-bold flex flex-col items-center">
      <div className="w-1/2 h-screen bg-sky-50 flex flex-col gap-8">
        <div className="flex flex-col items-center">
          <p className="text-3xl text-slate-600 mt-5">운동모임 상세 페이지</p>
        </div>
        <div className="flex justify-evenly">
          <div className="flex flex-col gap-2 mt-5 gap-3">
            <p>제목 : {selectedPostingData.title}</p>
            <p>날짜 : {selectedPostingData.date}</p>
            <p>모집운동 : {selectedPostingData.category}</p>
            <p>모집인원 : {selectedPostingData.count}</p>
            <p>위치 : {selectedPostingData.location}</p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="avatar">
              <div className="w-32 rounded-full">
                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
            <p>{selectedPostingData.writerNickName ? selectedPostingData.writerNickName : '이전데이터'}</p>
            {isWriter ? (
              <div className="flex gap-2">
                <Link to={'/postingEdit'} state={{ editCard: selectedPostingData }}>
                  <button className="btn btn-active btn-neutral btn-sm">수정하기</button>
                </Link>
                <button className="btn btn-active btn-neutral btn-sm" onClick={deletePostingHandler}>
                  삭제하기
                </button>
              </div>
            ) : isFriend ? (
              <button className="btn btn-active btn-neutral btn-sm" onClick={deleteFriendHandler}>
                친구삭제
              </button>
            ) : (
              <button className="btn btn-active btn-neutral btn-sm" onClick={addFriendHandler}>
                친구추가
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-center border-solid border-4 border-sky-200 p-8 ml-3 mr-3 bg-white font-medium">
          <p>{selectedPostingData.content}</p>
        </div>
        <div className="flex ml-3 gap-2 items-center">
          <p>
            현재 모집 인원 {applicantList.length} / {selectedPostingData.count}
          </p>
          {!isWriter && (
            <button className="btn btn-active btn-neutral btn-sm" onClick={addWorkoutGroupHandler} disabled={isClosed}>
              {isClosed ? `신청마감` : `신청하기`}
            </button>
          )}
        </div>
        {isApplyUser && (
          <div className="ml-3 mr-3 flex flex-col gap-2">
            <p>전체 댓글 {commentList.length}</p>
            <div>
              {commentList.map(data => {
                const date = new Date(data.commentTime.seconds * 1000 + data.commentTime.nanoseconds / 1000000);
                const isEdit = currentUser.id === data.commentWriter;
                return (
                  <div key={data.commentTime.seconds}>
                    <p>작성자 : {data.commentNickName}</p>
                    {!commentEditStates[data.commentTime.seconds] && <p>댓글내용 : {data.commentContent}</p>}
                    {commentEditStates[data.commentTime.seconds] && (
                      <div>
                        <input
                          type="text"
                          value={editContent}
                          onChange={e => {
                            setEditContent(e.target.value);
                          }}
                        />
                        <button onClick={() => editCommentContentHandler(data.commentTime.seconds)}>확인</button>
                        <button onClick={() => setCommentEditStates({})}>취소</button>
                      </div>
                    )}
                    <p>작성시간 :{date.toLocaleString()}</p>
                    {isEdit && (
                      <div>
                        <button
                          onClick={() => {
                            setCommentEditStates({ [data.commentTime.seconds]: true });
                          }}>
                          수정
                        </button>
                        <button onClick={() => deleteCommentHandler(data.commentTime.seconds)}>삭제</button>
                      </div>
                    )}
                  </div>
                );
              })}
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
    </div>
  );
}
