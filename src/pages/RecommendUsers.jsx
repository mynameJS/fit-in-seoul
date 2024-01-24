import { useEffect, useState } from 'react';
import { fetchData } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import TableList from '../components/TableList';
import UserCard from '../components/UserCard';

export default function RecommendUsers() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const currentUserInfo = JSON.parse(localStorage.getItem('currentUser'));
  const navigate = useNavigate();
  const filterUser = usersData.filter(user => {
    if (currentUserInfo.userEmail === user.userEmail) return false;
    const commonInterestLen = user.interest.filter(i => currentUserInfo.interest.includes(i)).length;
    if (commonInterestLen > 1) return true;
    return false;
  });

  const itemsPerPage = 6;

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filterUser.slice(startIndex, endIndex);
  };

  const handlePreButtonClick = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextButtonClick = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, maxPage));
  };

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

  useEffect(() => {
    setMaxPage(Math.ceil(filterUser.length / itemsPerPage));
  }, [filterUser, itemsPerPage]);

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
          <div className="flex">
            <TableList>
              {getCurrentPageData().map(user => (
                <UserCard key={user.id} filterUser={user} />
              ))}
            </TableList>
            {!getCurrentPageData().length && <p className="p-5">관심사가 일치하는 회원이 없습니다..ㅠ</p>}
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
