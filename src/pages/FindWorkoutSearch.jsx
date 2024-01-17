import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { fetchPostingData } from '../config/firebase';
import { useState, useEffect } from 'react';
import { location, interestList } from '../constant/constant';

const FindWorkoutSearchContainer = styled.div`
  width: 50rem;
  height: auto;
  border: 1px solid black;
  margin: 5% auto;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  .cardList {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`;

export default function FindWorkoutSearch() {
  const navigate = useNavigate();
  const [postingData, setPostingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [filterKey, setFilterKey] = useState({
    category: '',
    location: '',
  });
  const renderPostingData = [...postingData].sort((a, b) => b.createTime - a.createTime);
  const filteredPostingData = renderPostingData.filter(item => {
    if (filterKey.category && filterKey.location) {
      return item.category === filterKey.category && item.location === filterKey.location;
    } else if (filterKey.category) {
      return item.category === filterKey.category;
    } else if (filterKey.location) {
      return item.location === filterKey.location;
    } else {
      return true;
    }
  });

  const itemsPerPage = 2;
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPostingData.slice(startIndex, endIndex);
  };

  const handlePreButtonClick = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextButtonClick = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, maxPage));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFilterKey({ ...filterKey, [name]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postingData = await fetchPostingData();
        setPostingData(postingData);
      } catch (error) {
        console.error('Error fetching posting data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setMaxPage(Math.ceil(filteredPostingData.length / itemsPerPage));
  }, [filteredPostingData, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterKey]);

  return (
    <FindWorkoutSearchContainer>
      <p>운동모임찾기</p>
      <div>
        <button
          onClick={() => {
            navigate('/posting');
          }}>
          글쓰기
        </button>
      </div>
      <div>
        <form>
          <label htmlFor="category">카테고리</label>
          <select id="category" name="category" value={filterKey.category} onChange={handleChange}>
            <option value="">운동종목을 선택해주세요</option>
            {interestList.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <label htmlFor="location">지역</label>
          <select id="location" name="location" value={filterKey.location} onChange={handleChange}>
            <option value="">구를 선택해주세요</option>
            {location.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </form>
      </div>
      <div className="cardList">
        {loading ? <p>Loading...</p> : getCurrentPageData().map(data => <PostingCard key={data.id} data={data} />)}
        {!getCurrentPageData().length && <p>일치하는 게시물이 없습니다.</p>}
      </div>
      {!!getCurrentPageData().length && (
        <div>
          <button onClick={handlePreButtonClick} disabled={currentPage === 1}>
            pre
          </button>
          <span>
            {currentPage} / {maxPage}
          </span>
          <button onClick={handleNextButtonClick} disabled={currentPage === maxPage}>
            next
          </button>
        </div>
      )}
    </FindWorkoutSearchContainer>
  );
}

function PostingCard({ data }) {
  return (
    <div>
      <p>{data.title}</p>
      <p>모집 종목 : {data.category}</p>
      <p>일시 : {data.date}</p>
      <p>모집인원 : {data.count}명</p>
      <p>위치 : 서울시 {data.location}</p>
    </div>
  );
}
