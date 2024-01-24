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
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const itemsPerPage = 6;

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return followList.slice(startIndex, endIndex);
  };

  const handlePreButtonClick = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextButtonClick = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, maxPage));
  };

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

  useEffect(() => {
    setMaxPage(Math.ceil(followList.length / itemsPerPage));
  }, [followList, itemsPerPage]);

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
          <div className="flex">
            <TableList>
              {getCurrentPageData().map(user => (
                <UserCard key={user.id} filterUser={user} />
              ))}
            </TableList>
            {!getCurrentPageData().length && <p className="p-5">내 운동 친구가 없습니다.</p>}
          </div>
          {!!getCurrentPageData().length && (
            <div className="flex justify-center items-center gap-2">
              <button
                className="btn btn-active btn-neutral btn-sm"
                onClick={handlePreButtonClick}
                disabled={currentPage === 1}>
                이전
              </button>
              <span>
                {currentPage} / {maxPage}
              </span>
              <button
                className="btn btn-active btn-neutral btn-sm"
                onClick={handleNextButtonClick}
                disabled={currentPage === maxPage}>
                다음
              </button>
            </div>
          )}
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
