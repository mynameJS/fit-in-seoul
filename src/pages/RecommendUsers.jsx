import { useEffect, useState } from 'react';
import { fetchData } from '../config/firebase';
import { useNavigate, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import TableList from '../components/TableList';

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

  console.log(filterUser);
  return (
    <div className="bg-sky-100 h-screen text-slate-500 font-bold flex flex-col items-center">
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-3/4 h-screen bg-sky-50 flex flex-col gap-10 ">
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

function UserCard({ filterUser }) {
  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="userAvatar" />
            </div>
          </div>
          <div>
            <div className="font-bold">{filterUser.userNickName}</div>
          </div>
        </div>
      </td>
      <td>{filterUser.interest.map(int => `${int} `)}</td>
      <td>{filterUser.residence}</td>
      <th>
        <Link to={'/yourInfo'} state={{ selectedUser: filterUser }}>
          <button className="btn btn-ghost btn-xs">상세정보</button>
        </Link>
      </th>
    </tr>
  );
}
