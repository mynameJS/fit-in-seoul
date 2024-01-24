import { useState, useEffect } from 'react';
import { fetchPostingData } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import PostingTableList from '../components/PostingTableList';
import PostingCard from '../components/PostingCard';
import Spinner from '../components/Spinner';

export default function MyWorkoutGroup() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [myPosting, setMyPosting] = useState([]);
  const [applyPosting, setApplyPosting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxMyPage, setMaxMyPage] = useState(1);
  const [maxApplyPage, setMaxApplyPage] = useState(1);
  const [currentMyPage, setCurrentMyPage] = useState(1);
  const [currentApplyPage, setCurrentApplyPage] = useState(1);

  const itemsPerPage = 2;

  const getCurrentMyPageData = () => {
    const startIndex = (currentMyPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return myPosting.slice(startIndex, endIndex);
  };

  const getCurrentApplyPageData = () => {
    const startIndex = (currentApplyPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return applyPosting.slice(startIndex, endIndex);
  };

  const handleMyPreButtonClick = () => {
    setCurrentMyPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleMyNextButtonClick = () => {
    setCurrentMyPage(prevPage => Math.min(prevPage + 1, maxMyPage));
  };

  const handleApplyPreButtonClick = () => {
    setCurrentApplyPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleApplyNextButtonClick = () => {
    setCurrentApplyPage(prevPage => Math.min(prevPage + 1, maxApplyPage));
  };

  useEffect(() => {
    const getPostingData = async () => {
      try {
        const postingData = await fetchPostingData();
        const filterMyPosting = postingData.filter(({ writer }) => currentUser.id === writer);
        const filterApplyPosting = postingData.filter(({ id }) => currentUser.userApplyPosting?.includes(id));
        setMyPosting(filterMyPosting);
        setApplyPosting(filterApplyPosting);
      } catch (error) {
        console.error('Error fetching posting data:', error);
      } finally {
        setLoading(false);
      }
    };

    getPostingData();
  }, []);

  useEffect(() => {
    setMaxMyPage(Math.ceil(myPosting.length / itemsPerPage));
  }, [myPosting, itemsPerPage]);

  useEffect(() => {
    setMaxApplyPage(Math.ceil(applyPosting.length / itemsPerPage));
  }, [applyPosting, itemsPerPage]);

  return (
    <div className="bg-sky-100 h-screen text-slate-500 font-bold flex flex-col items-center">
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-1/2 h-screen bg-sky-50 flex flex-col justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <p>내가 작성한 운동 모임</p>
            <div>
              <PostingTableList>
                {getCurrentMyPageData().map(data => (
                  <PostingCard key={data.id} data={data} />
                ))}
              </PostingTableList>
              {!getCurrentMyPageData().length && <p className="p-5">작성한 게시물이 없습니다.</p>}
            </div>
            {!!getCurrentMyPageData().length && (
              <div className="flex justify-center items-center gap-2">
                <button
                  className="btn btn-active btn-neutral btn-sm"
                  onClick={handleMyPreButtonClick}
                  disabled={currentMyPage === 1}>
                  이전
                </button>
                <span>
                  {currentMyPage} / {maxMyPage}
                </span>
                <button
                  className="btn btn-active btn-neutral btn-sm"
                  onClick={handleMyNextButtonClick}
                  disabled={currentMyPage === maxMyPage}>
                  다음
                </button>
              </div>
            )}
          </div>
          <div className="divider"></div>
          <div className="flex flex-col items-center gap-2">
            <p>내가 신청한 운동 모임</p>
            <div>
              <PostingTableList>
                {applyPosting.map(data => (
                  <PostingCard key={data.id} data={data} />
                ))}
              </PostingTableList>
              {!getCurrentApplyPageData().length && <p className="p-5">신청한 게시물이 없습니다.</p>}
            </div>
            {!!getCurrentApplyPageData().length && (
              <div className="flex justify-center items-center gap-2">
                <button
                  className="btn btn-active btn-neutral btn-sm"
                  onClick={handleApplyPreButtonClick}
                  disabled={currentApplyPage === 1}>
                  이전
                </button>
                <span>
                  {currentApplyPage} / {maxApplyPage}
                </span>
                <button
                  className="btn btn-active btn-neutral btn-sm"
                  onClick={handleApplyNextButtonClick}
                  disabled={currentApplyPage === maxApplyPage}>
                  다음
                </button>
              </div>
            )}
          </div>
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
