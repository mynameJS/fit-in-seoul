import { useState, useEffect } from 'react';
import { fetchData } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import UserCard from '../components/UserCard';
import TableList from '../components/TableList';

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
    <div className="bg-sky-100 h-screen text-slate-500 font-bold flex flex-col items-center">
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-3/4 h-screen bg-sky-50 flex flex-col gap-10 ">
          <div className="flex flex-col items-center">
            <p className="text-3xl text-slate-600 mt-5">내 운동 친구</p>
          </div>
          <TableList>
            {followList.map(user => (
              <UserCard key={user.id} filterUser={user} />
            ))}
          </TableList>
          <div className="flex justify-center">
            <button
              className="btn btn-outline btn-sm"
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
