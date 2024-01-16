import { styled } from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPostingData } from '../config/firebase';

const PostingFormContainer = styled.div`
  width: 50rem;
  height: 50rem;
  border: 1px solid black;
  margin: 5% auto;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  .postingForm {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  input[type='date'] {
    width: 14rem;
    height: 6rem;
  }
`;

export default function PostingForm() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-CA');
  const { id } = JSON.parse(localStorage.getItem('currentUser'));
  const [formData, setFormData] = useState({
    writer: id,
    title: '',
    category: '',
    date: '',
    count: 1,
    location: '',
    content: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormDataSubmit = async e => {
    e.preventDefault();
    const checkMissingValue = Object.values(formData).filter(value => value);
    if (checkMissingValue.length !== 7) {
      alert('모든 항목을 입력해야 합니다.');
      return;
    }
    await addPostingData(formData);
    alert('게시글 작성이 완료되었습니다');
    navigate('/search');
  };

  return (
    <PostingFormContainer>
      <p>게시글 작성</p>
      <form onSubmit={handleFormDataSubmit} className="postingForm">
        <label htmlFor="title">제목</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
        <label htmlFor="category">카테고리</label>
        <select id="category" name="category" value={formData.category} onChange={handleChange}>
          <option value="">운동종목을 선택해주세요</option>
          <option value="등산">등산</option>
          <option value="헬스">헬스</option>
          <option value="런닝">런닝</option>
          <option value="풋살">풋살</option>
          <option value="탁구">탁구</option>
          <option value="테니스">테니스</option>
        </select>
        <label htmlFor="date">날짜</label>
        <input type="date" id="date" name="date" value={formData.date} min={today} onChange={handleChange} />
        <label htmlFor="count">모집인원</label>
        <input type="number" id="count" name="count" value={formData.count} min={1} onChange={handleChange} />
        <label htmlFor="location">지역</label>
        <select id="location" name="location" value={formData.location} onChange={handleChange}>
          <option value="">구를 선택해주세요</option>
          <option value="강남구">강남구</option>
          <option value="강동구">강동구</option>
          <option value="강북구">강북구</option>
          <option value="강서구">강서구</option>
          <option value="관악구">관악구</option>
          <option value="광진구">광진구</option>
          <option value="구로구">구로구</option>
          <option value="금천구">금천구</option>
          <option value="노원구">노원구</option>
          <option value="도봉구">도봉구</option>
          <option value="동대문구">동대문구</option>
          <option value="동작구">동작구</option>
          <option value="마포구">마포구</option>
          <option value="서대문구">서대문구</option>
          <option value="서초구">서초구</option>
          <option value="성동구">성동구</option>
          <option value="성북구">성북구</option>
          <option value="송파구">송파구</option>
          <option value="양천구">양천구</option>
          <option value="영등포구">영등포구</option>
          <option value="용산구">용산구</option>
          <option value="은평구">은평구</option>
          <option value="종로구">종로구</option>
          <option value="중구">중구</option>
          <option value="중랑구">중랑구</option>
        </select>
        <label htmlFor="content">내용</label>
        <textarea type="text" id="content" name="content" value={formData.content} onChange={handleChange} />
        <div>
          <button type="submit">작성완료</button>
          <button
            type="button"
            onClick={() => {
              navigate('/search');
            }}>
            작성취소
          </button>
        </div>
      </form>
    </PostingFormContainer>
  );
}
