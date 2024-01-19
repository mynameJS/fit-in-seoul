import { styled } from 'styled-components';
import { useState, useEffect } from 'react';
import { fetchData } from '../config/firebase';
import { useNavigate, Link } from 'react-router-dom';

const MyWorkoutFriendContainer = styled.div`
  margin: 20% 0;
  padding: 3rem;
  width: 50rem;
  height: auto;
  border: 1px solid black;

  display: flex;
  flex-direction: column;
  gap: 2rem;

  align-items: center;
`;

export default function MyWorkoutFriend() {
  const navigate = useNavigate();
  const currentUserFriendList = JSON.parse(localStorage.getItem('currentUser')).userFriend ?? [];
  const [followList, setFollowList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFollowData = async () => {
      try {
        const userData = await fetchData();
        const filteredData = userData.filter(({ id }) => currentUserFriendList.includes(id));
        setFollowList(filteredData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };
    getFollowData();
  }, []);
  return (
    <MyWorkoutFriendContainer>
      <p>내 운동 친구</p>
      <div>
        {loading ? (
          <p>loading...</p>
        ) : (
          followList.map(data => (
            <Link key={data.id} to={'/yourInfo'} state={{ selectedUser: data }}>
              <div>
                <p>닉네임 : {data.userNickName}</p>
              </div>
            </Link>
          ))
        )}
      </div>
      <button
        onClick={() => {
          navigate('/home');
        }}>
        홈으로
      </button>
    </MyWorkoutFriendContainer>
  );
}
