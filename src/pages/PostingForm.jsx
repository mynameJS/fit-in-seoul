import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPostingData } from '../config/firebase';
import { location, interestList } from '../constant/constant';

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
    <div className="bg-sky-100 h-screen text-slate-500 font-bold flex flex-col items-center">
      <div className="w-3/4 h-screen bg-sky-50 flex flex-col gap-10 items-center">
        <p className="text-3xl text-slate-600 mt-5">게시글 작성</p>
        <form onSubmit={handleFormDataSubmit} className="flex flex-col gap-3 w-1/2 ">
          <label htmlFor="title">제목</label>
          <input
            className="rounded-lg p-3 text-sm"
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <label htmlFor="category">카테고리</label>
          <select
            className="rounded-lg p-3 text-sm"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}>
            <option value="">운동종목을 선택해주세요</option>
            {interestList.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <label htmlFor="date">날짜</label>
          <input
            className="rounded-lg p-3 text-sm"
            type="date"
            id="date"
            name="date"
            value={formData.date}
            min={today}
            onChange={handleChange}
          />
          <label htmlFor="count">모집인원</label>
          <input
            className="rounded-lg p-3 text-sm"
            type="number"
            id="count"
            name="count"
            value={formData.count}
            min={1}
            onChange={handleChange}
          />
          <label htmlFor="location">지역</label>
          <select
            className="rounded-lg p-3 text-sm"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}>
            <option value="">구를 선택해주세요</option>
            {location.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <label htmlFor="content">내용</label>
          <textarea
            className="rounded-lg p-3 text-sm"
            type="text"
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
          />
          <div className="flex justify-evenly">
            <button className="btn btn-active btn-neutral btn-xs" type="submit">
              작성완료
            </button>
            <button
              className="btn btn-active btn-neutral btn-xs"
              type="button"
              onClick={() => {
                navigate('/search');
              }}>
              작성취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
