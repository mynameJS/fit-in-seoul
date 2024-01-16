import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { fetchPostingData } from '../config/firebase';
import { useState, useEffect } from 'react';

const FindWorkoutSearchContainer = styled.div`
  width: 50rem;
  height: 30rem;
  border: 1px solid black;
  margin: 5% auto;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

export default function FindWorkoutSearch() {
  const navigate = useNavigate();
  const [postingData, setPostingData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div>필터링</div>
      <div>{loading ? <p>Loading...</p> : postingData.map(data => <PostingCard key={data.id} data={data} />)}</div>
    </FindWorkoutSearchContainer>
  );
}

function PostingCard({ data }) {
  return (
    <div>
      <p>{data.title}</p>
      <p>일시 : {data.date}</p>
      <p>모집인원 : {data.count}명</p>
      <p>위치 : 서울시 {data.location}</p>
    </div>
  );
}
