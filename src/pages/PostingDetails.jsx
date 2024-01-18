import { styled } from 'styled-components';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function PostingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCard } = location.state;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const isWriter = selectedCard.writer === currentUser.id;

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
            <Link to={'/postingEdit'} state={{ editCard: selectedCard }}>
              <button>수정하기</button>
            </Link>
          ) : (
            <button>친구추가</button>
          )}
        </div>
      </div>
      <div>
        <p>{selectedCard.content}</p>
      </div>
      <button>신청하기</button>
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
