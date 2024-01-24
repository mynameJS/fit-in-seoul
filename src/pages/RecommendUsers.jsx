import { useEffect, useState } from 'react';
import { fetchData } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import TableList from '../components/TableList';
import UserCard from '../components/UserCard';

export default function RecommendUsers() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserInfo = JSON.parse(localStorage.getItem('currentUser'));
  const navigate = useNavigate();
  const filterUser = usersData.filter(user => {
    if (currentUserInfo.userEmail === user.userEmail) return false;
    const commonInterestLen = user.interest.filter(i => currentUserInfo.interest.includes(i)).length;
    if (commonInterestLen > 1) return true;
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
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  return (
    <div className="bg-sky-100 h-screen text-slate-500 font-bold flex flex-col items-center">
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-3/4 h-screen bg-sky-50 flex flex-col gap-10">
          <div className="flex flex-col items-center">
            <p className="text-3xl text-slate-600 mt-5">나와 관심사가 비슷한 회원들</p>
          </div>
          <TableList>
            {filterUser.map(user => (
              <UserCard key={user.id} filterUser={user} />
            ))}
          </TableList>
          <div className="flex justify-center">
            <button
              className="btn btn-active btn-neutral btn-sm"
              onClick={() => {
                navigate('/home');
              }}>
              홈으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
