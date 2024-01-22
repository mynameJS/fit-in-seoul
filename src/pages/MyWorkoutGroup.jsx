import { styled } from 'styled-components';
import { useState, useEffect } from 'react';
import { fetchPostingData } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const MyWorkoutGroupContainer = styled.div`
  margin: 20% 0;
  width: 50rem;
  height: auto;
  border: 1px solid black;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

export default function MyWorkoutGroup() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [myPosting, setMyPosting] = useState([]);
  const [applyPosting, setApplyPosting] = useState([]);
  console.log(currentUser);

  useEffect(() => {
    const getPostingData = async () => {
      try {
        const postingData = await fetchPostingData();
        const filterMyPosting = postingData.filter(({ writer }) => currentUser.id === writer);
        const filterApplyPosting = postingData.filter(({ id }) => currentUser.userApplyPosting.includes(id));
        setMyPosting(filterMyPosting);
        setApplyPosting(filterApplyPosting);
      } catch (error) {
        console.error('Error fetching posting data:', error);
      }
    };

    getPostingData();
  }, []);

  return (
    <MyWorkoutGroupContainer>
      <div>
        <p>내가 작성한 운동 모임</p>
        <div>
          {myPosting.map(data => (
            <div key={data.id}>
              <p>제목 : {data.title}</p>
              <p>카테고리 : {data.category}</p>
              <p>위치 : {data.location}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p>내가 신청한 운동 모임</p>
        <div>
          {applyPosting.map(data => (
            <div key={data.id}>
              <p>제목 : {data.title}</p>
              <p>카테고리 : {data.category}</p>
              <p>위치 : {data.location}</p>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => {
          navigate('/home');
        }}>
        홈으로
      </button>
    </MyWorkoutGroupContainer>
  );
}
