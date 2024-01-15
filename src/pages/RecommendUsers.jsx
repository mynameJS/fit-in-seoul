import { styled } from 'styled-components';
import { useEffect, useState } from 'react';
import { fetchData } from '../config/firebase';

const RecommendUserContainer = styled.div`
  margin-top: 10%;
  border: 1px solid black;
  padding: 20px;

  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`;

const UserListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export default function RecommendUsers() {
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(false);
  const currentUserInfo = JSON.parse(localStorage.getItem('currentUser'));
  const filterUser = usersData?.filter(user => {
    if (currentUserInfo.userEmail === user.userEmail) return false;
    const commonInterestLen = user.interest.filter(i => currentUserInfo.interest.includes(i)).length;
    // 공통 관심사가 3개이상이면 추천리스트에 뜨게하자
    if (commonInterestLen > 2) return true;
    return false;
  });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchData();
        setUsersData(data);
      } catch (error) {
        console.log('Error fetching data:', error);
      } finally {
        setLoading(true);
      }
    };

    getUserData();
  }, []);

  return (
    <RecommendUserContainer>
      <p>나와 관심사가 비슷한 회원들</p>
      {loading && (
        <UserListContainer>
          {filterUser.map(user => (
            <UserCard key={user.id} filterUser={user} />
          ))}
        </UserListContainer>
      )}
    </RecommendUserContainer>
  );
}

function UserCard({ filterUser }) {
  return (
    <div>
      <p>추천회원</p>
      <p>{filterUser.userNickName}</p>
    </div>
  );
}
