import { styled } from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPostingData } from '../config/firebase';
import { location, interestList } from '../constant/constant';

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
  const { id, userNickName } = JSON.parse(localStorage.getItem('currentUser'));
  const [formData, setFormData] = useState({
    writer: id,
    writerNickName: userNickName,
    title: '',
    category: '',
    date: '',
    count: 0,
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
    if (checkMissingValue.length !== 8) {
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
          {interestList.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <label htmlFor="date">날짜</label>
        <input type="date" id="date" name="date" value={formData.date} min={today} onChange={handleChange} />
        <label htmlFor="count">모집인원</label>
        <input type="number" id="count" name="count" value={formData.count} min={1} onChange={handleChange} />
        <label htmlFor="location">지역</label>
        <select id="location" name="location" value={formData.location} onChange={handleChange}>
          <option value="">구를 선택해주세요</option>
          {location.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
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
